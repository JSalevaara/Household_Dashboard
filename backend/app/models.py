from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Column # Added Column here
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Household(Base):
    __tablename__ = "households"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100)) # Changed int to str
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    users: Mapped[List["User"]] = relationship(back_populates="household", cascade="all, delete-orphan")
    shopping_items: Mapped[List["ShoppingItem"]] = relationship(back_populates="household", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String, default="user") # Updated to use Mapped

    household_id: Mapped[Optional[int]] = mapped_column(ForeignKey("households.id"))
    household: Mapped[Optional["Household"]] = relationship(back_populates="users")

class ShoppingItem(Base):
    __tablename__ = "shopping_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    is_purchased: Mapped[bool] = mapped_column(Boolean, default=False)

    household_id: Mapped[int] = mapped_column(ForeignKey("households.id"))
    added_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))

    household: Mapped["Household"] = relationship(back_populates="shopping_items")