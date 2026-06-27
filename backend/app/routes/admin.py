from typing import List

from app.schemas.user import PasswordReset, UserOut
from argon2 import PasswordHasher
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.crud import admin as crud_admin
from app.models.user import User

ph = PasswordHasher()

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin_user)])


@router.get("/stats")
async def get_system_stats(db: AsyncSession = Depends(get_db)):
    return await crud_admin.get_stats(db)


@router.get("/users", response_model=List[UserOut])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    return await crud_admin.get_all_users(db)


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    new_role: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    user = await crud_admin.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.super:
        raise HTTPException(status_code=403, detail="Cannot change role of a super admin")

    if user.id == current_admin.id and new_role != "admin":
        raise HTTPException(status_code=400, detail="You cannot demote yourself")

    try:
        await crud_admin.update_user_role(db, user, new_role)
        return {"message": "Role updated"}
    except Exception:
        raise HTTPException(status_code=500, detail="Database error while updating role")


@router.patch("/users/{user_id}/reset-password")
async def reset_user_password(
    user_id: int,
    payload: PasswordReset,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    user = await crud_admin.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.super:
        raise HTTPException(status_code=403, detail="Cannot reset a super admin password")

    new_hashed_password = ph.hash(payload.new_password)

    try:
        await crud_admin.reset_user_password(db, user, new_hashed_password)
        return {"message": "Password updated successfully"}
    except Exception:
        raise HTTPException(status_code=500, detail="Database error while resetting password")


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    user = await crud_admin.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.super:
        raise HTTPException(status_code=403, detail="Cannot delete a super admin")

    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")

    try:
        await crud_admin.delete_user(db, user)
        return {"message": "User deleted successfully"}
    except Exception:
        raise HTTPException(status_code=500, detail="Database error while deleting user")
