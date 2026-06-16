from pydantic import BaseModel, EmailStr
from typing import Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    household_id: Optional[int] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    message: str
    user: User
