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

<details>
<summary>For future use, run the following SQL to make a table:</summary>

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

</details>

The most important step is to go to storage and create an bucket called uploads, which is set to private to allow for rls policies.

<details>
<summary>Then, use the following sql to setup rls policies and user data:</summary>

```sql
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
USING (
  auth.uid() = owner
  OR (bucket_id = 'uploads' AND position(auth.uid()::text in name) = 1)
);

CREATE POLICY "Users can upload files into their own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'uploads'
  AND position(auth.uid()::text in name) = 1
);

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'uploads' AND position(auth.uid()::text in name) = 1
)
WITH CHECK (
  bucket_id = 'uploads' AND position(auth.uid()::text in name) = 1
);

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'uploads' AND position(auth.uid()::text in name) = 1
);

--then we have the trigger functions:

CREATE OR REPLACE FUNCTION handle_storage_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner IS NULL THEN
    NEW.owner := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_storage_insert
BEFORE INSERT ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION handle_storage_insert();
```

</details>

## Google OAuth

This is quite complex and requires some external help, going out of github and everything.

Here is the tutorial I followed to get it correctly: https://www.youtube.com/watch?v=sB6bPOvvlgw

<details>
<summary>So, in a nutshell, here are the steps required to make this work:</summary>

1.  ### Configure Google Cloud Project
1.  Go to Google Cloud Console and create a new project
1.  Configure OAuth Consent Screen
    1. In the left navigation menu, go to APIs & Services > OAuth consent screen.
    2. Select External as the user type (unless you are a Google Workspace user) and click Create.
    3. Fill in the required fields, such as "App name", "User support email", and "Developer contact information". Click Save and Continue.
    4. On the Scopes page, you can define what user data your application can access (e.g., .../auth/userinfo.email, .../auth/userinfo.profile, openid). These are often pre-selected or can be added as needed. Click Save and Continue.
    5. Add Test users if your app is still in testing.
1.  Create OAuth Credentials
    1. Go to APIs & Services > Credentials.
    2. Click + Create Credentials and select OAuth client ID.
    3. Select Web application as the Application type. Give it a name like Supabase Auth Web Client.
    4. Authorized redirect URIs: This is a critical step. You must add the callback URL provided by Supabase. This URL follows the format: https://<your-project-ref>.supabase.co/auth/v1/callback
       - Note: You can find your project reference in the Supabase dashboard settings. For local development, you might also add http://localhost:54321/auth/v1/callback
1.  Get Credentials: Click Create. A modal will display your Client ID and Client Secret. Copy these, as you will need them for Supabase
1.  ### Configure Supabase
    1. Go to Supabase Dashboard: Navigate to your project dashboard.
    2. Access Authentication Settings: In the left sidebar, click on Authentication (the shield icon).
    3. Enable Google Provider: Go to the Providers tab, find Google, and click on it.
    4. Enter Credentials:
       - Toggle Enable Sign in with Google to ON.
       - Paste the Client ID and Client Secret you obtained from the Google Cloud Console into the respective fields.
       - Callback URL: Copy the URL shown here. This is the exact URL you should have added to the Google Cloud Console in Part 1, Step 3.
    5. Save: Click Save at the bottom of the section.

</details>
