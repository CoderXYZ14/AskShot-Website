import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import arcjet, { shield, detectBot } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";

const isDev = process.env.NODE_ENV === "development";
const aj = arcjet({
  key: process.env.ARCJET_KEY || "",
  rules: [
    // Shield protects your app from common attacks like SQL injection
    shield({
      mode: isDev ? "DRY_RUN" : "LIVE",
    }),
    // Bot protection to detect and block unwanted bots
    detectBot({
      mode: isDev ? "DRY_RUN" : "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),
  ],
});

export async function middleware(request: NextRequest) {
  const decision = await aj.protect(request);

  if (decision.isDenied()) {
    return new Response("Forbidden", { status: 403 });
  }

  if (decision.results.some(isSpoofedBot)) {
    return new Response("Forbidden", { status: 403 });
  }
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtectedRoute = ["/history", "/profile", "/plans"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/history/:path*",
    "/profile/:path*",
    "/plans/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
