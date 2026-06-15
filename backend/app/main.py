from fastapi import FastAPI

app = FastAPI(
    title="household_dashboard",
    description="A household management dashboard app",
    version="0.1.0"
)

@app.get("/")
def test_API():
    return {"message": "Hello world!"}