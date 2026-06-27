from typing import Optional

from pydantic import BaseModel


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
