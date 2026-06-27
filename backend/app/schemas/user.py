from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    username: str = Field(..., min_length=5, max_length=20)
    email: EmailStr
    password: str = Field(
        ..., min_length=6, description="Password must be atleast 6 characters long"
    )


class User(UserBase):
    id: int
    household_id: Optional[int] = None
    role: str
    super: bool = False

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    message: str
    user: User

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    username: str
    password: str


class UserChangePassword(BaseModel):
    old_password: str
    new_password: str


class UserChangeUsername(BaseModel):
    password: str
    new_username: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    super: bool
    household_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class PasswordReset(BaseModel):
    new_password: str
