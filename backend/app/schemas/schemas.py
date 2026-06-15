from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Household schemas
class HouseholdBase(BaseModel):
    name: str

class HouseholdCreate(HouseholdBase):
    pass

class Household(HouseholdBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# User schemas

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    message: str
    user: User

class User(UserBase):
    id: int
    household_id: Optional[int] = None

    class Config:
        from_attributes = True


# Shopping item schemas
class ShoppingItemBase(BaseModel):
    name: str

class ShoppingItemCreate(ShoppingItemBase):
    pass

class ShoppingItem(ShoppingItemBase):
    id: int
    is_purchased: bool
    household_id: int
    added_by_id: Optional[int] = None

    class Config:
        from_attributes = True