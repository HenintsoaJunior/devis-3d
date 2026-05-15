import { NextResponse } from "next/server";

import { isBearerAuthorized } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const allowedStatus = new Set(["nouveau", "traite", "archive"]);

export async function GET(request: Request) {
  if (!isBearerAuthorized(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const statut = url.searchParams.get("statut");

  let query = getSupabaseAdmin().from("devis").select("*").order("created_at", { ascending: false });

  if (statut && allowedStatus.has(statut)) {
    query = query.eq("statut", statut);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Erreur lecture" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
