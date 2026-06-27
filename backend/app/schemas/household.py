from datetime import datetime

from pydantic import BaseModel, ConfigDict


class HouseholdCreate(BaseModel):
    name: str


class HouseholdOut(BaseModel):
    id: int
    name: str
    created_at: datetime

    model_config = ConfigDict(orm_mode=True)
