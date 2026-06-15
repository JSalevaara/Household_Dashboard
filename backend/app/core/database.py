import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load variables from the .env file.
load_dotenv() 

# Get the database URL from the environment variables.
SQLALCHEMY_URL = os.getenv("DATABASE_URL") 

# Create the engine that manages a pool of connections.
engine = create_engine(SQLALCHEMY_URL)

# Create session factory. 
# autocommit = False: Must call db.commit() to save changes.
# autoflush = False: Prevents the session from automatically sending pending data to the database before every query.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the Base class. Allows SQLAlchemy to map python classes to database tables.
Base = declarative_base()