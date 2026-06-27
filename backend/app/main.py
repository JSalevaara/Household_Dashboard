import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.routes import admin, auth, users

load_dotenv()


app = FastAPI(
    title="household_dashboard",
    description="A household management dashboard app",
    version="0.1.0",
)

Instrumentator().instrument(app).expose(app)

allow_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if os.getenv("ALLOWED_ORIGIN"):
    allow_origins.append(os.getenv("ALLOWED_ORIGIN"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(users.router)
app.include_router(auth.router)
app.include_router(admin.router)
