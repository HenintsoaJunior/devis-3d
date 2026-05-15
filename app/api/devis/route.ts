import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { devisSchema } from "@/validators/devis";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON invalide" }, { status: 400 });
    }

    const parsed = devisSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation échouée" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const rl = await checkRateLimit(ip);

    if (!rl.ok && (rl as { limited?: boolean }).limited) {
      return NextResponse.json(
        { error: "Trop de soumissions, réessayez plus tard" },
        { status: 429 }
      );
    }

    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limit indisponible" }, { status: 500 });
    }

    const clean = {
      ...parsed.data,
      etablissement: sanitizeText(parsed.data.etablissement),
      nom: sanitizeText(parsed.data.nom),
      email: sanitizeText(parsed.data.email),
      telephone: sanitizeText(parsed.data.telephone || ""),
      message: sanitizeText(parsed.data.message || ""),
    };

    const { data, error } = await getSupabaseAdmin()
      .from("devis")
      .insert(clean)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erreur insertion" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Missing SUPABASE_SERVICE_ROLE_KEY"
        ? "Configuration serveur manquante (SUPABASE_SERVICE_ROLE_KEY)"
        : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
