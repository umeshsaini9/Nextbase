# Supabase Setup Guide

This guide will walk you through the process of setting up Supabase for your project. Please do this after completing the README.md

## Prerequisites

- Node.js: ^20
- npm: ^10
- Python: ^3.12
- FastAPI: ^0.116.1
- Supabase: ^2.56.1
- Tailwind CSS: ^4.1.12
- TypeScript: ^5

## Setting Up Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com).

2. Create a new project in Supabase.

3. Navigate to the Project Settings and copy the Project URL and Anon Key.

4. Create a `.env.local` file in the root of your frontend and add the following environment variables, of which you can find in Project-Settings/API-Keys and Project-Settings/Data-API:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

## Configuring Supabase

For future use, run the following SQL to make a table:

```sql
CREATE TABLE countries (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL
);

INSERT INTO countries (name) VALUES
('United States'),
('Canada'),
('Mexico');
```

Then, the most important step is to go to storage and create an bucket called uploads, which is set to public for testing.
