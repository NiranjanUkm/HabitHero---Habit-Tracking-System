from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, habits

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Habit Hero API",
    description="Backend API for Habit Hero application",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(habits.router)


@app.get("/")
async def root():
    return {"message": "Welcome to Habit Hero API"}