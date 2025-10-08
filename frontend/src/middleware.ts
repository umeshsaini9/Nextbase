// middleware.ts (project root)
import { NextResponse, type NextRequest } from "next/server";

// Run only on real app routes (skip Next internals & static assets)
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|icon.png|apple-icon.png|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};

// Minimal heuristic: only try Supabase if its cookies exist
function hasSupabaseCookies(req: NextRequest) {
  const names = req.cookies.getAll().map((c) => c.name);
  return names.some(
    (n) => n.startsWith("sb-") || n.startsWith("sb:") || n.includes("supabase")
  );
}

export default async function middleware(req: NextRequest) {
  // Skip CORS preflight
  if (req.method === "OPTIONS") return NextResponse.next();

  // Hard bypass in dev if you want zero Edge auth work
  if (process.env.NODE_ENV === "development" && process.env.DISABLE_EDGE_AUTH === "1") {
    return NextResponse.next();
  }

  // No Supabase cookies? Don’t poke the auth client on Edge.
  if (!hasSupabaseCookies(req)) return NextResponse.next();

  // Try to update the session, but never crash dev if fetch fails
  const res = NextResponse.next();
  try {
    // Lazy import so we don't even bundle Supabase if we early-returned above
    const { updateSession } = await import("@/utils/supabase/middleware");
    // Support helpers that accept (req) OR (req, res)
    const maybeRes = await (updateSession as any)(req, res);
    return maybeRes ?? res;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Supabase middleware: refresh skipped (dev)", err);
    }
    return res;
  }
}
