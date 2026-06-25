from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas import user_schemas as schemas
from app.crud import user as crud_user
from app.core.utils import create_access_token
from argon2 import PasswordHasher
from app.core.security import get_current_user

ph = PasswordHasher()
router = APIRouter()

@router.post("/login")
async def login(credentials: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_user_by_username(db, username=credentials.username)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        ph.verify(user.hashed_password, credentials.password)
    except:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": str(user.username)})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user: schemas.UserOut = Depends(get_current_user)):
    return current_user