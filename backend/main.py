from dotenv import load_dotenv # Import load_dotenv
load_dotenv() # Load variables from .env file immediately
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends

# FIX: Imports are now direct and simple
from database import Base, engine, get_db
from routers import auth, habits, checkins, analytics, ai, report

app = FastAPI(
    title="Habit Hero API",
    description="Backend API for Habit Hero application",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(habits.router)
app.include_router(checkins.router)
app.include_router(analytics.router)
app.include_router(ai.router)
app.include_router(report.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Habit Hero API"}

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}