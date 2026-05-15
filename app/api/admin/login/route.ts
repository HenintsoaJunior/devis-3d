import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getAdminCookieName,
  getAdminSessionValue,
  isAdminPasswordValid,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!body.password || !(await isAdminPasswordValid(body.password))) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), await getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true });
}
