from fastapi import APIRouter, Depends, HTTPException, Body, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas import user_schemas as schemas
from app.crud import user as crud_user
from app.core.utils import create_access_token, decode_access_token, create_refresh_token
from argon2 import PasswordHasher
from app.core.security import get_current_user

ph = PasswordHasher()
router = APIRouter()

@router.post("/login")
async def login(
    credentials: schemas.UserLogin, 
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    
    user = await crud_user.get_user_by_username(db, username=credentials.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        ph.verify(user.hashed_password, credentials.password)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": str(user.username)})
    refresh_token = create_refresh_token({"sub": str(user.username)}) 
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh_token(request: Request, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    payload = decode_access_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = await crud_user.get_user_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    new_access_token = create_access_token(data={"sub": user.username})
    
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return { "message": "Logged out successfully"}

@router.get("/me", response_model=schemas.User)
async def get_current_user_info(current_user = Depends(get_current_user)):
    return current_user