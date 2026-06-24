from pydantic import BaseModel, EmailStr, ConfigDict
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

    model_config=ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    username: str
    password: str

class UserChangePassword(BaseModel):
    old_password: str
    new_password: str
    confirm_new_password: str
