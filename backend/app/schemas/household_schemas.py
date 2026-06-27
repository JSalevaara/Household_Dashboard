from datetime import datetime

from pydantic import BaseModel


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
