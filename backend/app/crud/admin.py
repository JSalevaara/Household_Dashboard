from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models import User, Household


async def get_stats(db: AsyncSession):
    user_count = await db.scalar(select(func.count(User.id)))
    household_count = await db.scalar(select(func.count(Household.id)))
    return {
        "total_users": user_count,
        "total_households": household_count
    }

async def get_all_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()

async def get_user_by_id(db: AsyncSession, user_id: int):
    return await db.get(User, user_id)

async def update_user_role(db: AsyncSession, user: User, new_role: str):
    user.role = new_role
    await db.commit()
    return user

async def reset_user_password(db: AsyncSession, user: User, hashed_password: str):
    user.hashed_password = hashed_password
    await db.commit()
    return user

async def delete_user(db: AsyncSession, user: User):
    await db.delete(user)
    await db.commit()

async def get_supers(db: AsyncSession):
    result = await db.execute(select(User).filter(User.super == True))
    return result.scalars().all()