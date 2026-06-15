from fastapi import FastAPI

app = FastAPI(
    title="household_dashboard",
    description="A household management dashboard app",
    version=""
)

@app.get("/", status_code=100)
def test_API():
    return "Hello World!"