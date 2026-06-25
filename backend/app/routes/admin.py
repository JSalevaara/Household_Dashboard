import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.models import User
from app.schemas.user_schemas import UserOut, PasswordReset
from app.core.security import get_current_admin_user
from app.crud import admin as crud_admin
from argon2 import PasswordHasher

ph = PasswordHasher()

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin_user)])


@router.get("/stats")
async def get_system_stats(db: AsyncSession = Depends(get_db)):
    return await crud_admin.get_stats(db)

@router.get("/users", response_model=List[UserOut])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    return await crud_admin.get_all_users(db)

@router.patch("/users/{user_id}/role")
async def update_user_role(user_id: int, new_role: str, db: AsyncSession = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    super_admins = await crud_admin.get_supers(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.username in super_admins:
        raise HTTPException(status_code=403, detail="Cannot change role of a super admin")
    
    if user.id == current_admin.id and new_role != "admin":
        raise HTTPException(status_code=400, detail="You cannot demote yourself")
    await crud_admin.update_user_role(db, user, new_role)
    return {"message": "Role updated"}

@router.patch("/users/{user_id}/reset-password")
async def reset_user_password(user_id: int, payload: PasswordReset, db: AsyncSession = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    super_admins = await crud_admin.get_supers(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.username in super_admins:
        raise HTTPException(status_code=403, detail="Cannot reset admin password.")
    
    user.hashed_password = ph.hash(payload.new_password)
    await crud_admin.reset_user_password(db, user, user.hashed_password)
    return { "message": "Password updated successfully"}

@router.delete("/users/{user_id}/delete")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = await db.get(User, user_id)
    super_admins = await crud_admin.get_supers(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.username in super_admins:
        raise HTTPException(status_code=403, detail="Cannot delete a super admin")
    
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")
    
    await crud_admin.delete_user(db, user)
    return {"message": "User deleted successfully"}