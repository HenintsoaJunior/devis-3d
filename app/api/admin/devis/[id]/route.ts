import { NextResponse } from "next/server";

import { getAdminCookieName, getAdminSessionValue } from "@/lib/admin-auth";
import { sendStatusUpdateEmail } from "@/lib/email";
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

  // 1. Récupérer les infos actuelles pour l'email
  const { data: currentDevis } = await getSupabaseAdmin()
    .from("devis")
    .select("email, nom, etablissement, statut")
    .eq("id", id)
    .single();

  if (!currentDevis) {
    return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
  }

  // 2. Mettre à jour le statut
  const { error } = await getSupabaseAdmin()
    .from("devis")
    .update({ statut: body.statut })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }

  // 3. Envoyer l'email si le statut a changé
  if (currentDevis.statut !== body.statut) {
    console.log(`[Email] Envoi de notification de changement de statut (${body.statut}) à ${currentDevis.email}`);
    sendStatusUpdateEmail({
      email: currentDevis.email,
      nom: currentDevis.nom,
      etablissement: currentDevis.etablissement,
      nouveauStatut: body.statut,
    }).catch((err) => console.error("Update email error:", err));
  }

  return NextResponse.json({ ok: true });
}
