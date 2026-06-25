import asyncio
import os
from sqlalchemy import select, func
from app.core.database import get_db 
from app.models import User
from argon2 import PasswordHasher

ph = PasswordHasher()

async def create_initial_admin():
    print("Starting database initialization...")

    async for session in get_db():
        result = await session.execute(select(func.count(User.id)))
        user_count = result.scalar()

        if user_count > 0:
            print("Users already exist in the database. Skipping super admin creation.")
            break 
        print("Database is empty. Creating default super admin...")
        default_password = os.getenv("FIRST_SUPERUSER_PASSWORD", "admin123")
        hashed_pw = ph.hash(default_password)
        
        super_admin = User(
            username="admin",
            email="admin@household.local", 
            role="admin",
            super=True,
            hashed_password=hashed_pw
        )
        
        session.add(super_admin)
        await session.commit()
        
        print("✅ Super admin created successfully!")
        print(f"Username: admin")
        print(f"Password: {default_password}")
        
        break 

if __name__ == "__main__":
    asyncio.run(create_initial_admin())