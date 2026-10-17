import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/admin/:path*"],
};

type SessionRole = "admin" | "customer" | "present" | null;

async function getSessionRole(request: NextRequest): Promise<SessionRole> {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  // If no JWT_SECRET is configured in web env, fall back to presence check
  // (API remains the source of truth for authorization).
  if (!secret) return "present";
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = (payload as { role?: string }).role;
    if (role === "admin" || role === "customer") return role;
    return null;
  } catch {
    return null;
  }
}

function toLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except login — require a valid admin JWT
  // (or any session when JWT_SECRET isn't configured for web; API still enforces role)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const role = await getSessionRole(request);
    const allowed = process.env.JWT_SECRET ? role === "admin" : role !== null;
    if (!allowed) {
      const res = toLogin(request, pathname);
      // Clear an invalid/non-admin session so stale cookies don't loop
      if (request.cookies.get("session")?.value) {
        res.cookies.delete("session");
      }
      return res;
    }
    return NextResponse.next();
  }

  // Redirect valid admins away from login page
  if (pathname === "/admin/login") {
    const role = await getSessionRole(request);
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}
