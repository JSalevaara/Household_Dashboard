import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from app.core.database import get_db
from app.models import User, Household
from app.schemas.user_schemas import UserOut, PasswordReset
from app.core.security import get_current_admin_user
from argon2 import PasswordHasher

ph = PasswordHasher()

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin_user)])
raw_super_admins = os.getenv("SUPER_ADMINS", "admin")

super_admins_list = [admin.strip() for admin in raw_super_admins.split(",")]
print(f"Super Admins loaded: {super_admins_list}")

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
async def update_user_role(user_id: int, new_role: str, db: AsyncSession = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.username in super_admins_list:
        raise HTTPException(status_code=403, detail="Cannot change role of a super admin")
    
    if user.id == current_admin.id and new_role != "admin":
        raise HTTPException(status_code=400, detail="You cannot demote yourself")
    user.role = new_role
    await db.commit()
    return {"message": "Role updated"}

@router.patch("/users/{user_id}/reset-password")
async def reset_user_password(user_id: int, payload: PasswordReset, db: AsyncSession = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.username in super_admins_list:
        raise HTTPException(status_code=403, detail="Cannot reset admin password.")
    
    user.hashed_password = ph.hash(payload.new_password)
    await db.commit()

    return { "message": "Password updated successfully"}