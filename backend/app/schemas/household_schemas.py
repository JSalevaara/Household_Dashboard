from pydantic import BaseModel
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
