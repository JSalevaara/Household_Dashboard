import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file
from fastapi import FastAPI
from app.routes import users, auth, admin
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="household_dashboard",
    description="A household management dashboard app",
    version="0.1.0"
)

allow_origins = ["http://localhost:5173","http://127.0.0.1:5173"]
if os.getenv("ALLOWED_ORIGINS"):
    allow_origins.append(os.getenv("ALLOWED_ORIGINS"))

app.add_middleware(
    CORSMiddleware,
    allow_origins= allow_origins, 
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(admin.router)
