from fastapi import FastAPI
from app.routes import users

app = FastAPI(
    title="household_dashboard",
    description="A household management dashboard app",
    version="0.1.0"
)

app.include_router(users.router)
