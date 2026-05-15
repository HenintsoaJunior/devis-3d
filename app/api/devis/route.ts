import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { sendConfirmationEmail } from "@/lib/email";
import { sanitizeText } from "@/lib/sanitize";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { devisSchema } from "@/validators/devis";

function getClientIp(request: NextRequest) {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return normalizeIp(cfIp);

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return normalizeIp(firstIp);
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return normalizeIp(xRealIp.trim());

  const requestIp = (request as any).ip;
  if (requestIp) return normalizeIp(requestIp);

  return "127.0.0.1";
}

function normalizeIp(ip: string) {
  if (ip === "::1") return "127.0.0.1";
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip;
}

export async function POST(request: NextRequest) {
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
        {
          error: "Limite atteinte: maximum 3 demandes par heure. Réessayez dans environ 1 heure.",
        },
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

    sendConfirmationEmail({
      email: clean.email,
      nom: clean.nom,
      etablissement: clean.etablissement,
    }).catch((err) => console.error("Email error:", err));

    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Missing SUPABASE_SERVICE_ROLE_KEY"
        ? "Configuration serveur manquante (SUPABASE_SERVICE_ROLE_KEY)"
        : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
