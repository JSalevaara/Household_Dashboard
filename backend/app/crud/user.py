from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import User
from app.schemas.user_schemas import UserCreate
from argon2 import PasswordHasher

ph = PasswordHasher()

#Only handles database interaction
async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(User).filter(User.username == username))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalar_one_or_none()

async def create_new_user(db: AsyncSession, user_in: UserCreate):
    raw_password = str(user_in.password)
    hashed_pw = ph.hash(raw_password)
    new_user = User(username=user_in.username, email=user_in.email, hashed_password=hashed_pw)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user