from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.household import HouseholdCreate
from app.services.household_service import create_household

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_new_household(
    household_in: HouseholdCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_household(db, household_in, current_user.id)
