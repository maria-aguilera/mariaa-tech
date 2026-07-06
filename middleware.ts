import { NextRequest, NextResponse } from "next/server";

// The cookie name and expected token value are shared with /api/private/unlock.
// The unlock endpoint sets this cookie when the visitor types the correct
// PRIVATE_PASSWORD. In production, PRIVATE_COOKIE_TOKEN must be set on Vercel
// (any long random string). In dev, both fall back to a static value so the
// unlock page works out of the box.
export const PRIVATE_COOKIE_NAME = "mt_private";

function expectedToken(): string {
  return process.env.PRIVATE_COOKIE_TOKEN || "dev-unlock-token";
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // The unlock page and its API must be reachable without a cookie.
  if (
    url.pathname === "/private/unlock" ||
    url.pathname.startsWith("/api/private/unlock")
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(PRIVATE_COOKIE_NAME);
  if (cookie?.value === expectedToken()) {
    return NextResponse.next();
  }

  // Bounce to the unlock page, preserving the intended destination as ?to=.
  const unlock = url.clone();
  unlock.pathname = "/private/unlock";
  unlock.search = `?to=${encodeURIComponent(url.pathname + url.search)}`;
  return NextResponse.redirect(unlock);
}

// Only run middleware on private routes — nothing else on the site is affected.
export const config = {
  matcher: ["/private/:path*"],
};
