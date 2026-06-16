from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas import user_schemas as schemas
from app.crud import user as crud_user

router = APIRouter()

@router.post("/api/users", response_model=schemas.UserResponse)
async def create_user(user_in: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud_user.get_user_by_username(db, username=user_in.username)
    if db_user:
        raise HTTPException(status_code=404, detail="Username already taken.")
    
    created_db_user = await crud_user.create_new_user(db, user_in)

    return { "message": "A new user created.", "user": created_db_user}

@router.get("/api/users")
async def test():
    return {"Test successful xdd"}