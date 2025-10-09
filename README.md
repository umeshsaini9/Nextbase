# Dockerized Full-Stack Application

This repository contains a dockerized full-stack application with:

- Backend: FastAPI (Python)
- Frontend: Next.js

## Prerequisites

- Docker
- Docker Compose

## Development Setup

### Without Docker

1. **Backend**:

   ```bash
   cd backend
   uv sync
   uv run fastapi dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   bun install
   bun run dev
   ```

### Current Dependency Versions

**Frontend (Next.js)**:

- Next.js: ^15.3.5
- React: ^19.1.0
- React DOM: ^19.1.0
- Redux Toolkit: ^2.8.2
- React Query: ^5.85.5
- Supabase SSR: ^0.6.1
- Axios: ^1.10.0

**Backend (FastAPI)**:

- FastAPI: ^0.116.1
- Python: >=3.12

### With Docker

#### Building the images

```bash
docker-compose build
```

#### Running the application

```bash
docker-compose up
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

#### Stopping the application

```bash
docker-compose down
```

## Environment Variables

### Frontend

- `FASTAPI_URL`: URL for the backend API (defaults to http://backend:80 in docker)
- `DOCKER_ENV`: Set to 'true' when running in docker environment

### Backend

- Standard FastAPI environment variables

## Project Structure

```
.
├── backend/          # FastAPI backend
│   ├── Dockerfile
│   ├── main.py
│   └── ...
├── frontend/         # Next.js frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ...
└── docker-compose.yml
```

## Notes

- The frontend is configured to proxy API requests to the backend
- In development (without docker), the frontend expects the backend at http://localhost:8000
- In docker environment, services communicate using docker network DNS
