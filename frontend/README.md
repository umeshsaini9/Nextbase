This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Current Dependencies

- Next.js: ^15.3.5
- React: ^19.1.0
- React DOM: ^19.1.0
- Redux Toolkit: ^2.8.2
- React Query: ^5.85.5
- Supabase SSR: ^0.6.1
- Axios: ^1.10.0
- Tailwind CSS: ^4.1.12
- TypeScript: ^5

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Application Structure

The application is structured as follows:

- `src/app/page.tsx`: The main page of the application, which includes a Counter component and a LoginButton component. It also uses React Query to fetch data from the GitHub API.
- `src/app/Counter.tsx`: A simple counter component that demonstrates the use of state management in the application.
- `src/app/auth/page.tsx`: The authentication page of the application, which includes a LoginButton component.
- `src/app/private/page.tsx`: The private page of the application, which is accessible only to authenticated users.
- `src/app/chat/page.tsx`: The chat page of the application, which includes a RealtimeChat component for real-time messaging.
- `src/store/counterSlice.ts`: A Redux slice for managing the state of the Counter component.
- `src/store/store.ts`: The Redux store configuration for the application.
- `undyne/components/auth/LoginButton.tsx`: A component for handling user authentication.
- `undyne/components/chat/realtime-chat.tsx`: A component for real-time messaging.
- `undyne/components/hooks/use-realtime-chat.tsx`: A custom hook for managing real-time chat functionality.
- `undyne/components/hooks/use-chat-scroll.tsx`: A custom hook for managing chat scroll functionality.
- `undyne/components/chat/chat-message.tsx`: A component for displaying chat messages.
- `undyne/components/ui/button.tsx`: A reusable button component.
- `undyne/components/ui/input.tsx`: A reusable input component.
- `undyne/lib/fastapiclient.ts`: A client for interacting with the FastAPI backend.
- `undyne/lib/utils.ts`: Utility functions for the application.
- `undyne/utils/supabase/client.ts`: A Supabase client for interacting with the Supabase database.
- `undyne/utils/supabase/middleware.ts`: Middleware for handling Supabase authentication.
- `undyne/utils/supabase/server.ts`: Server-side Supabase utilities.
- `undyne/utils/supabase/storage.ts`: Utilities for interacting with Supabase storage.

## Key Features

- **Authentication**: The application includes a LoginButton component for handling user authentication.
- **Real-time Messaging**: The application includes a RealtimeChat component for real-time messaging.
- **State Management**: The application uses Redux Toolkit for state management.
- **Data Fetching**: The application uses React Query for data fetching.
- **Supabase Integration**: The application integrates with Supabase for database and storage functionalities.
- **FastAPI Backend**: The application interacts with a FastAPI backend for API functionalities.

## Requirements

- Node.js: ^20
- npm: ^10
- Python: ^3.12
- FastAPI: ^0.116.1
- Supabase: ^2.56.1
- Tailwind CSS: ^4.1.12
- TypeScript: ^5
