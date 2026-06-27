from typing import List, TYPE_CHECKING
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.household import HouseholdMember

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String, default="user")
    super: Mapped[bool] = mapped_column(Boolean, default=False)

    households: Mapped[List["HouseholdMember"]] = relationship(
        "HouseholdMember", 
        back_populates="user", 
        cascade="all, delete-orphan"
    )