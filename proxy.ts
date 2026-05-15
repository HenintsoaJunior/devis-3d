import { NextResponse, type NextRequest } from "next/server";

import { getAdminCookieName, getAdminSessionValue } from "./lib/admin-auth";

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const expected = await getAdminSessionValue();
  const current = request.cookies.get(getAdminCookieName())?.value;

  if (current === expected) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
