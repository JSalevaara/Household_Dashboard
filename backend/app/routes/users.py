from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas import user_schemas as schemas
from app.crud import user as crud_user
from argon2 import PasswordHasher
from app.core.security import get_current_user

ph = PasswordHasher()
router = APIRouter(prefix="/users")


@router.post("", response_model=schemas.User)
async def create_user(user_in: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud_user.get_user_by_username(db, username=user_in.username)
    if db_user:
        raise HTTPException(status_code=409, detail="Username already taken.")

    db_email = await crud_user.get_user_by_email(db, email=user_in.email)
    if db_email:
        raise HTTPException(status_code=409, detail="Email already registered.")
    
    try:
        created_db_user = await crud_user.create_new_user(db, user_in)
        return created_db_user
    except Exception as e:
        print(f"CRITICAL DB ERROR during user creation: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during user creation.")
    
@router.put("/me/password")
async def change_password(
    password_data: schemas.UserChangePassword,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        ph.verify(current_user.hashed_password, password_data.old_password)
    except:
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    new_hashed_pw = ph.hash(password_data.new_password)
    current_user.hashed_password = new_hashed_pw
    
    await db.commit()
    
    return {"message": "Password updated successfully"}

