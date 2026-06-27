from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.household import Household
from app.models.user import User


async def get_stats(db: AsyncSession):
    user_count = await db.scalar(select(func.count(User.id)))
    household_count = await db.scalar(select(func.count(Household.id)))
    return {"total_users": user_count, "total_households": household_count}


# Get functions
async def get_all_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()


async def get_user_by_id(db: AsyncSession, user_id: int):
    return await db.get(User, user_id)


async def get_supers(db: AsyncSession):
    result = await db.execute(select(User).filter(User.super))
    return result.scalars().all()


async def update_user_role(db: AsyncSession, user: User, new_role: str):
    user.role = new_role
    try:
        await db.commit()
        return user
    except SQLAlchemyError:
        await db.rollback()
        raise Exception("An unexpected database error occurred while updating user role.")


async def reset_user_password(db: AsyncSession, user: User, hashed_password: str):
    user.hashed_password = hashed_password
    try:
        await db.commit()
        return user
    except SQLAlchemyError:
        await db.rollback()
        raise Exception("An unexpected database error occurred while resetting user password.")


async def delete_user(db: AsyncSession, user: User):
    await db.delete(user)
    try:
        await db.commit()
    except SQLAlchemyError:
        await db.rollback
        raise Exception("An unexpected database error occured while deleting user.")
