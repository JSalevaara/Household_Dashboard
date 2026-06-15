import app
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import schemas
from fastapi import Depends, HTTPException
from core.database import get_db
from app.crud import user


@app.post("/api/users", response_model=schemas.UserResponse)
async def create_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await user.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=404, detail="Username already taken.")
    
    return await user.create_new_user(db, db_user)