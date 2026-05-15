import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendConfirmationEmail(data: {
  email: string;
  nom: string;
  etablissement: string;
}) {
  if (!env.RESEND_API_KEY) {
    console.warn("[Resend] Clé API manquante. Envoi annulé.");
    return;
  }

  try {
    const response = await resend.emails.send({
      from: "Devis 3D <onboarding@resend.dev>",
      to: data.email,
      subject: "Confirmation de votre demande de devis",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>Bonjour ${data.nom},</h2>
          <p>Nous avons bien reçu votre demande de devis pour l'établissement <strong>${data.etablissement}</strong>.</p>
          <p>Notre équipe va étudier votre demande et reviendra vers vous dans les plus brefs délais.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #777;">Ceci est un message automatique, merci de ne pas y répondre directement.</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("[Resend] Erreur API lors de la confirmation:", response.error);
    } else {
      console.log("[Resend] Email de confirmation envoyé avec succès:", response.data?.id);
    }
  } catch (error) {
    console.error("[Resend] Exception lors de l'envoi de confirmation:", error);
  }
}

export async function sendStatusUpdateEmail(data: {
  email: string;
  nom: string;
  etablissement: string;
  nouveauStatut: string;
}) {
  if (!env.RESEND_API_KEY) {
    console.warn("[Resend] Clé API manquante. Envoi de mise à jour annulé.");
    return;
  }

  const statusLabel =
    data.nouveauStatut === "traite"
      ? "Traité"
      : data.nouveauStatut === "archive"
      ? "Archivé"
      : "Nouveau";

  try {
    const response = await resend.emails.send({
      from: "Devis 3D <onboarding@resend.dev>",
      to: data.email,
      subject: `Mise à jour de votre demande : ${statusLabel}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>Bonjour ${data.nom},</h2>
          <p>Le statut de votre demande de devis pour <strong>${data.etablissement}</strong> a été mis à jour.</p>
          <p>Nouveau statut : <strong style="color: #0070f3;">${statusLabel}</strong></p>
          <p>Notre équipe traite votre dossier et reviendra vers vous si nécessaire.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #777;">Ceci est un message automatique, merci de ne pas y répondre directement.</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("[Resend] Erreur API lors de la mise à jour:", response.error);
    } else {
      console.log("[Resend] Email de mise à jour envoyé avec succès:", response.data?.id);
    }
  } catch (error) {
    console.error("[Resend] Exception lors de l'envoi de mise à jour:", error);
  }
}

