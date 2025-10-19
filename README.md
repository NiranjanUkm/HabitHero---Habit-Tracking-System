# Habit Hero

Habit Hero is a full-stack habit tracking application designed to help users build and maintain healthy habits. It consists of a React + TypeScript + Vite frontend and a FastAPI + SQLAlchemy backend.

---

## Frontend
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS
- **Features:**
  - Habit dashboard
  - Calendar view for check-ins
  - Analytics dashboard
  - User authentication
  - Responsive UI

### Setup
1. Go to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

---

## Backend
- **Tech Stack:** FastAPI, SQLAlchemy, SQLite/PostgreSQL
- **Features:**
  - RESTful API for habits and check-ins
  - JWT-based authentication
  - Analytics endpoints
  - CORS support

### Setup
1. Go to the `backend` folder:
   ```sh
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/Scripts/activate  # Windows
   source venv/bin/activate      # macOS/Linux
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

---

## Environment Variables
- Frontend: Create `.env` in `frontend` with `VITE_API_URL=http://localhost:8000`
- Backend: Create `.env` in `backend` with `DATABASE_URL`, `SECRET_KEY`, etc.

---

## License
MIT