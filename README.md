# Medication Management System

A cross-platform medication management system demonstrating the flow between patients, pharmacies, and insurance companies.

## ⚠️ Important Notice
This is a **demonstration system** using dummy data only. It does NOT handle real Protected Health Information (PHI) or actual insurance claims.

## Features
- User registration and profile management
- Insurance plan registration and management
- Prescription upload and tracking
- Insurance claim simulation with transparent adjudication
- Clear error reporting and "behind the scenes" explanations

## Tech Stack
- **Frontend**: React + Vite + Vanilla CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (development) / PostgreSQL (production-ready)
- **Shared**: Common constants and utilities (plain JavaScript)

## Project Structure
```
medication-management/
├── packages/
│   ├── shared/      # Shared constants, validators, utilities
│   ├── backend/     # Express REST API
│   └── frontend/    # React web application
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation
```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend in development mode
npm run dev

# Or start them separately:
npm run dev:backend   # Backend runs on http://localhost:3001
npm run dev:frontend  # Frontend runs on http://localhost:5173
```

## Development Workflow
1. Make changes to code
2. Both servers auto-reload on file changes
3. Frontend proxies API requests to backend automatically

## Future Enhancements
- React Native mobile app using shared constants
- Real insurance API integration hooks
- Enhanced claim adjudication rules
- Prior authorization workflow
- Multi-pharmacy support

## Architecture Notes
- **Shared package**: Contains constants and validators used by both frontend and backend
- **API-first design**: Clean REST API boundaries make mobile integration straightforward
- **Validation**: Runtime validation ensures data integrity
- **ES Modules**: Modern JavaScript with import/export
