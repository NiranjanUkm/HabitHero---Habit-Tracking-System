# Habit Hero Frontend

Habit Hero is a modern habit tracking web application built with React, TypeScript, and Vite. It helps users build and maintain healthy habits with features like habit creation, check-ins, analytics, and calendar views.

## Features
- User authentication (sign up, login, logout)
- Create, view, and delete habits
- Track daily and weekly habit check-ins
- Calendar view for habit completion
- Analytics dashboard for progress and streaks
- Responsive, mobile-friendly UI

## Tech Stack
- **React** (with hooks and context)
- **TypeScript**
- **Vite** (for fast development and builds)
- **Tailwind CSS** (for styling)
- **Radix UI** (for accessible components)
- **Recharts** (for analytics charts)
- **Framer Motion** (for animations)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Frontend will run on [http://localhost:8080](http://localhost:8080) by default.

### Environment Variables
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:8000
```

### Linting & Formatting
```bash
npm run lint
```

## Project Structure
```
frontend/
├── src/
│   ├── components/   # UI components
│   ├── hooks/        # Custom React hooks
│   ├── contexts/     # Context providers
│   ├── lib/          # Utility libraries (API, helpers)
│   ├── types/        # TypeScript types
│   ├── pages/        # Main app pages
│   └── App.tsx       # Main app entry
├── public/
├── package.json
├── tailwind.config.js
└── README.md
```

## Deployment
Build for production:
```bash
npm run build
```
Preview production build:
```bash
npm run preview
```

## License
MIT

---
For backend setup, see the [backend README](../backend/README.md).