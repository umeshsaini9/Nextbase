"use client";

import { login, signup } from "./actions";
import { LoginButton } from "@/components/auth/LoginButton";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form className="flex flex-col gap-3 w-full max-w-sm border p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-2">🔐 Sign in</h1>

        <label htmlFor="email" className="text-sm font-medium">
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border px-2 py-1 rounded"
        />

        <label htmlFor="password" className="text-sm font-medium">
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border px-2 py-1 rounded"
        />

        <div className="flex gap-2 mt-3">
          <button
            formAction={login}
            className="bg-blue-500 text-white px-3 py-1 rounded w-full"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="bg-green-500 text-white px-3 py-1 rounded w-full"
          >
            Sign up
          </button>
        </div>

        <div className="mt-4 text-center text-gray-600">or</div>

        {/* Google OAuth Button */}
        <LoginButton />
      </form>
    </div>
  );
}
