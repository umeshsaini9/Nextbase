// pages/ping.tsx
import fastapi from "@/lib/fastapiclient";

export default async function Page() {
  let message = "No response";

  try {
    const response = await fastapi.get("/api/hello");
    message = response.data.message;
  } catch (error: any) {
    message = "Error fetching from FastAPI";
    console.error("FastAPI error:", error.message);
  }

  return (
    <div>
      <h1>FastAPI Test</h1>
      <p>Message from FastAPI: {message}</p>
    </div>
  );
}
