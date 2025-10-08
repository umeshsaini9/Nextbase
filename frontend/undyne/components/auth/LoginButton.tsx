"use client";

import { supabase } from "@/utils/supabase/client";

export function LoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/private`, // redirect after login
      },
    });
    if (error) console.error("Google login error:", error.message);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded mt-2"
    >
      Sign in with Google
    </button>
  );
}
