# Habit Hero Backend

This is the backend API for Habit Hero, a habit tracking application. Built with FastAPI and SQLAlchemy, it provides secure user authentication, habit management, check-ins, analytics, and more.

## Features
- User registration and authentication (JWT-based)
- Create, update, delete habits
- Track habit check-ins
- Analytics endpoints for streaks and progress
- RESTful API with OpenAPI docs
- Database migrations (Alembic)

## Tech Stack
- **Python 3.11+**
- **FastAPI** (web framework)
- **SQLAlchemy** (ORM)
- **Alembic** (migrations)
- **Pydantic** (data validation)
- **Uvicorn** (ASGI server)

## Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL (or SQLite for local testing)

### Installation
Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the backend directory:
```
DATABASE_URL=postgresql://user:password@localhost/habit_hero
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Database Migrations
Run Alembic migrations to set up the database schema:
```bash
alembic upgrade head
```

### Running the API
Start the FastAPI server:
```bash
uvicorn main:app --reload
```
API will run on [http://localhost:8000](http://localhost:8000) by default.

### API Documentation
Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API docs.

## Project Structure
```
backend/
├── main.py           # FastAPI app entry point
├── models/           # SQLAlchemy models
├── routers/          # API route modules
├── schemas/          # Pydantic schemas
├── database.py       # DB setup
├── config.py         # App configuration
├── migrations/       # Alembic migrations
├── requirements.txt  # Python dependencies
└── README.md
```

## License
MIT

---
For frontend setup, see the [frontend README](../frontend/README.md).