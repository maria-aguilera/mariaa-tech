import { NextRequest, NextResponse } from "next/server";
import { PRIVATE_COOKIE_NAME } from "@/middleware";

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const password = String(formData?.get("password") ?? "");
  const to = String(formData?.get("to") ?? "/private/projects") || "/private/projects";

  const expected = process.env.PRIVATE_PASSWORD || "dev-unlock";
  if (!timingSafeStringEqual(password, expected)) {
    // Bounce back to the unlock page with an error flag.
    const url = req.nextUrl.clone();
    url.pathname = "/private/unlock";
    url.search = `?to=${encodeURIComponent(to)}&err=1`;
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = process.env.PRIVATE_COOKIE_TOKEN || "dev-unlock-token";
  const dest = req.nextUrl.clone();
  // Only accept safe internal destinations.
  dest.pathname = to.startsWith("/private/") ? to : "/private/projects";
  dest.search = "";

  const res = NextResponse.redirect(dest, { status: 303 });
  res.cookies.set({
    name: PRIVATE_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // 30 days
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
