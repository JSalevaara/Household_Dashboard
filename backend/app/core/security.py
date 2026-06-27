import os
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status
from app.crud import user as crud_user
from app.core.utils import decode_access_token
from app.core.database import get_db
from app.models import User


# Allows access to the token from the Authorization header in the format
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")
    
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise credentials_exception
    
    user = await crud_user.get_user_by_username(db, username=payload["sub"])
    if not user:
        raise credentials_exception
    
    return user

async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin" and not current_user.super:
        raise HTTPException(
            status_code=403, 
            detail="Insufficient permissions"
        )
    return current_user