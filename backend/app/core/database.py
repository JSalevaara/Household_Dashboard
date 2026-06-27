import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

# Load variables from the .env file
load_dotenv()

# 1. Grab all the individual variables
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "db")
DB_CONTAINER_PORT = os.getenv("DB_CONTAINER_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "household_db")

# Get the database URL from the environment variables
SQLALCHEMY_DATABASE_URL = (
    f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_CONTAINER_PORT}/{DB_NAME}"
)

# Create the async engine
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Create the async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# Create the Base class using the modern SQLAlchemy 2.0 syntax
class Base(DeclarativeBase):
    pass


# Dependency injection for FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
