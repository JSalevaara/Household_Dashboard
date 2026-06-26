#External imports
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

#Internal imports
from app.core.database import get_db
from app.schemas import user_schemas as schemas
from app.crud import user as crud_user
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
    except VerifyMismatchError:
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    new_hashed_pw = ph.hash(password_data.new_password)
    current_user.hashed_password = new_hashed_pw
    
    try:
        await db.commit()
    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during password update.")
    
    return {"message": "Password updated successfully"}

@router.put("/me/username")
async def change_username(
    username_data: schemas.UserChangeUsername,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        ph.verify(current_user.hashed_password, username_data.password)
    except:
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    db_user = await crud_user.get_user_by_username(db, username=username_data.new_username)
    if db_user:
        raise HTTPException(status_code=409, detail="Username already taken.")
    
    current_user.username = username_data.new_username
    try:
        await db.commit()
    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during username update.")

