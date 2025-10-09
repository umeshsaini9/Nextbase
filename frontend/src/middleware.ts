// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    // Run on everything except static assets, APIs, and Next internals
    "/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|ico|svg|css|js|map)$).*)",
  ],
};

/** Check if Supabase auth cookies exist */
function hasSupabaseCookies(req: NextRequest) {
  const names = req.cookies.getAll().map((c) => c.name);
  return names.some(
    (n) =>
      n.startsWith("sb-") ||
      n.startsWith("sb:") ||
      n.includes("supabase")
  );
}

/** Middleware entry */
export default async function middleware(req: NextRequest) {
  // Skip CORS preflights
  if (req.method === "OPTIONS") return NextResponse.next();

  const url = req.nextUrl.clone();
  const isProtected = url.pathname.startsWith("/private");

  // --- 1️⃣ No Supabase cookies → just redirect unauthenticated /private users ---
  if (!hasSupabaseCookies(req) && isProtected) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // --- 2️⃣ Refresh session safely (Edge-compatible) ---
  let res = NextResponse.next();
  try {
    const { updateSession } = await import("@/utils/supabase/middleware");
    // In Next 15, call updateSession BEFORE returning res
    const maybeResponse = await (updateSession as any)(req);
    if (maybeResponse) res = maybeResponse;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Supabase middleware session refresh skipped:", err);
    }
  }

  // --- 3️⃣ Redirect logic for logged-out users trying to access protected routes ---
  if (!hasSupabaseCookies(req) && isProtected) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return res;
}
