from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.household import Household, HouseholdMember
from app.schemas.household import HouseholdCreate


def create_household(db: Session, household_in: HouseholdCreate, user_id: int):
    if not household_in.name.strip():
        raise HTTPException(status_code=422, detail="Household name cannot be empty.")
    try:
        new_household = Household(name=household_in.name)
        db.add(new_household)
        db.commit()

        member = HouseholdMember(household_id=new_household.id, user_id=user_id, role="admin")
        db.add(member)
        db.commit()
        return new_household
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail="An error occurred while creating the household."
        ) from e
