from typing import List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.household import Household, HouseholdMember
from app.schemas.household import HouseholdCreate


async def create_household(db: AsyncSession, household_in: HouseholdCreate, user_id: int):
    if not household_in.name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Household name cannot be empty.",
        )

    try:
        new_household = Household(name=household_in.name.strip())
        db.add(new_household)
        await db.flush()

        member = HouseholdMember(household_id=new_household.id, user_id=user_id, role="admin")
        db.add(member)
        await db.commit()
        await db.refresh(new_household)

        return new_household

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the household.",
        ) from e


async def get_user_households(db: AsyncSession, user_id: int) -> List[Household]:
    query = select(Household).join(HouseholdMember).where(HouseholdMember.user_id == user_id)
    result = await db.execute(query)

    return list(result.scalars().all())
