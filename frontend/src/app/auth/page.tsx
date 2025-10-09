"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) return setError(error.message);
    router.push("/private");
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);
    if (error) return setError(error.message);
    router.push("/private");
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setIsLoading(false);
    if (error) setError(error.message);
  };

  return (
    <div className="max-w-sm mx-auto p-6 border rounded-lg mt-12">
      <h1 className="text-2xl font-bold mb-4">🔐 Sign in or Sign up</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border rounded px-2 py-1 mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border rounded px-2 py-1 mb-3"
      />
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white px-3 py-2 rounded mb-2 disabled:opacity-50"
      >
        {isLoading ? "Signing in…" : "Login"}
      </button>
      <button
        onClick={handleSignup}
        disabled={isLoading}
        className="w-full bg-green-500 text-white px-3 py-2 rounded mb-2 disabled:opacity-50"
      >
        {isLoading ? "Creating account…" : "Sign up"}
      </button>
      <button
        onClick={handleGoogle}
        disabled={isLoading}
        className="w-full bg-red-500 text-white px-3 py-2 rounded disabled:opacity-50"
      >
        Continue with Google
      </button>
    </div>
  );
}
