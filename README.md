# ReportForge Enterprise — Frontend (Vite + React)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
```

## Flow
Landing → Auth (Google/GitHub/Email) → Cookie Banner → Welcome Screen → Dashboard

## Roles
- **Admin** (dark theme): Full access — Cube Engine, MQ Monitor, All Reports, Settings
- **User** (light green): Restricted — own reports only, locked items shown with 🔒

## Backend Integration (MERN — next phase)
Replace `AuthContext.jsx` sessionStorage with JWT. Wire `/api/auth`, `/api/reports`, `/api/queue`, `/api/cube` endpoints.

## Stack
Vite · React · React Router DOM · Chart.js · JetBrains Mono + Fraunces + Plus Jakarta Sans
