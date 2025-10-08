# Installation Guide

This guide will walk you through the process of setting up the project on your local machine.

## Prerequisites

- Node.js: ^20
- npm: ^10
- Python: ^3.12
- FastAPI: ^0.116.1
- Supabase: ^2.56.1
- Tailwind CSS: ^4.1.12
- TypeScript: ^5

## Frontend Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install the dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install the dependencies:

```bash
pip install -e .
```

3. Run the development server:

```bash
uv run fastapi dev
# or
uvicorn main:app --reload
```

4. The backend server will be running on [http://localhost:8000](http://localhost:8000).
