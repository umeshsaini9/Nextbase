"use client";
import { supabase } from "@/utils/supabase/client";

export default function HeaderBar({ user, onLogout, isBusy }: any) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">🔒 Private Files</h1>
        <p className="text-gray-600 text-sm">
          Logged in as <strong>{user.email}</strong>
        </p>
      </div>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          onLogout();
        }}
        disabled={isBusy}
        className={`${
          isBusy ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
        } text-white px-3 py-1 rounded transition-colors duration-150`}
      >
        {isBusy ? "Logging out…" : "Logout"}
      </button>
    </div>
  );
}
