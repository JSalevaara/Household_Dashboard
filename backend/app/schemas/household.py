from pydantic import BaseModel


class HouseholdCreate(BaseModel):
    name: str
