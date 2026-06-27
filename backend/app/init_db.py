import asyncio
import os

from argon2 import PasswordHasher
from dotenv import load_dotenv
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import AsyncSessionLocal
from app.models.user import User

load_dotenv()


ph = PasswordHasher()


async def create_initial_admin():
    print("Starting database initialization...")

    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(select(func.count(User.id)))
            user_count = result.scalar()

            if user_count > 0:
                print("Users already exist in the database. Skipping super admin creation.")
                return

            print("Database is empty. Creating default super admin...")
            default_password = os.getenv("FIRST_SUPERUSER_PASSWORD", "admin123")
            hashed_pw = ph.hash(default_password)

            super_admin = User(
                username="admin",
                email="admin@example.com",
                role="admin",
                super=True,
                hashed_password=hashed_pw,
            )

            session.add(super_admin)
            await session.commit()

            print("✅ Super admin created successfully!")
            print("Username: admin")
            print(f"Password: {default_password}")

        except SQLAlchemyError as e:
            await session.rollback()
            print(f"❌ Failed to initialize database: {e}")


if __name__ == "__main__":
    asyncio.run(create_initial_admin())
