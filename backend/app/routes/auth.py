from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas import user_schemas as schemas
from app.crud import user as crud_user
from app.core.security import create_access_token
from argon2 import PasswordHasher

ph = PasswordHasher()
router = APIRouter()

@router.post("/api/login")
async def login(credentials: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_user_by_username(db, username=credentials.username)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        ph.verify(user.hashed_password, credentials.password)
    except:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": str(user.username)})
    
    return {"access_token": access_token, "token_type": "bearer"}