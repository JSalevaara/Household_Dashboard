from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.household import HouseholdCreate
from app.services.household_service import create_household

router = APIRouter(prefix="/households", tags=["households"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_new_household(
    household_in: HouseholdCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await create_household(db, household_in, current_user.id)
