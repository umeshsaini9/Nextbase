"use client";

import { useQuery } from "@tanstack/react-query";
import Counter from "./Counter";
import { LoginButton } from "@/components/auth/LoginButton";

export default function Home() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["zen"],
    queryFn: async () => {
      const res = await fetch("https://api.github.com/zen");
      if (!res.ok) throw new Error("Request failed");
      return res.text();
    },
  });

  return (
    <div className="space-y-4 p-6">
      <Counter />
      <div className="pt-8">
        <button onClick={() => refetch()}>Refetch</button>
        {isLoading && <p>Loading…</p>}
        {isError && <p>Something went wrong.</p>}
        {data && <p className="font-mono">{data}</p>}
      </div>
    </div>
  );
}
