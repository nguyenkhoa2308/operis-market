import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const protectedPaths = [
  "/profile", "/api-keys", "/billing", "/usage", "/logs",
];

export async function middleware(req: NextRequest) {
  const isProtected = protectedPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p),
  );
  if (!isProtected) return NextResponse.next();

  const accessToken = req.cookies.get("access_token");
  const refreshToken = req.cookies.get("refresh_token");

  // No tokens at all → redirect login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Access token expired but refresh token exists → try refresh
  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { Cookie: `refresh_token=${refreshToken.value}` },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Forward new cookies from BE to browser
      const response = NextResponse.next();
      res.headers.getSetCookie().forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
      return response;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/api-keys/:path*", "/billing/:path*",
    "/usage/:path*", "/logs/:path*",
  ],
};
