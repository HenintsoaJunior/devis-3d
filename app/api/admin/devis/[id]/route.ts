import { NextResponse } from "next/server";

import { getAdminCookieName, getAdminSessionValue } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const allowedStatus = new Set(["nouveau", "traite", "archive"]);

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const cookieStore = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieStore.split(";").map((part) => {
      const [k, ...v] = part.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );

  const expected = await getAdminSessionValue();
  if (cookies[getAdminCookieName()] !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { statut?: string };
  if (!body.statut || !allowedStatus.has(body.statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const { id } = await context.params;

  const { error } = await getSupabaseAdmin()
    .from("devis")
    .update({ statut: body.statut })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
