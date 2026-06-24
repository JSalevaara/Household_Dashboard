from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from app.core.database import get_db
from app.models import User, Household
from app.schemas.user_schemas import UserOut
from app.core.security import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin_user)])

@router.get("/stats")
async def get_system_stats(db: AsyncSession = Depends(get_db)):
    user_count = await db.scalar(select(func.count(User.id)))
    household_count = await db.scalar(select(func.count(Household.id)))
    return {
        "total_users": user_count,
        "total_households": household_count
    }

@router.get("/users", response_model=List[UserOut])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.patch("/users/{user_id}/role")
async def update_user_role(user_id: int, new_role: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = new_role
    await db.commit()
    return {"message": "Role updated"}