# Backend API Documentation

This is a FastAPI project that serves as the backend for the full-stack application.

## Current Dependencies

- FastAPI: ^0.116.1
- Python: ^3.12

## Getting Started

First, run the development server:

```bash
uv run fastapi dev
# or
uvicorn main:app --reload
```

## Application Structure

The application is structured as follows:

- `main.py`: The main entry point of the application, which includes the FastAPI app configuration, CORS middleware, and API endpoints.

## Key Features

- **CORS Middleware**: The application includes CORS middleware for handling cross-origin requests.
- **API Endpoints**: The application includes the following API endpoints:
  - `/api/hello`: Returns a simple greeting message.
  - `/api/ping`: Returns a "pong" response.

## Requirements

- Python: ^3.12
- FastAPI: ^0.116.1
- Uvicorn: ^0.27.0
- UVicorn: ^0.30.0
