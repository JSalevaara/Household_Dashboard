import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# Load variables from the .env file
load_dotenv() 

# Get the database URL from the environment variables
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") 

# Create the async engine
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Create the async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Create the Base class using the modern SQLAlchemy 2.0 syntax
class Base(DeclarativeBase):
    pass

# Dependency injection for FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session