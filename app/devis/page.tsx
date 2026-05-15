"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import type { DevisFormValues, DevisPayload } from "@/validators/devis";
import { devisSchema } from "@/validators/devis";

const etablissementOptions = [
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hôtel" },
  { value: "copropriete", label: "Copropriété" },
  { value: "autre", label: "Autre" },
] as const;

const nuisiblesOptions = [
  { value: "rats", label: "Rats" },
  { value: "cafards", label: "Cafards" },
  { value: "punaises_de_lit", label: "Punaises de lit" },
  { value: "frelons", label: "Frelons" },
  { value: "autre", label: "Autre" },
] as const;

export default function DevisPage() {
  const [serverError, setServerError] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [contactSubmitAttempted, setContactSubmitAttempted] = useState(false);
  const [submittedData, setSubmittedData] = useState<DevisPayload | null>(null);

  const form = useForm<DevisFormValues>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      etablissement: "restaurant",
      surface: 0,
      nuisibles: [],
      urgence: "simple_devis",
      nom: "",
      email: "",
      telephone: "",
      message: "",
    },
    mode: "onBlur",
  });

  const { register, handleSubmit, formState, trigger, watch } = form;
  const { errors } = formState;
  const shouldShowContactErrors = contactSubmitAttempted;
  const nomValue = watch("nom");
  const emailValue = watch("email");
  const telephoneValue = watch("telephone");
  const messageValue = watch("message");
  const urgenceValue = watch("urgence");
  const canShowContactFieldError = (name: "nom" | "email" | "telephone" | "message") => {
    if (shouldShowContactErrors) return true;
    const valueByField = {
      nom: nomValue,
      email: emailValue,
      telephone: telephoneValue,
      message: messageValue,
    } as const;
    return Boolean(valueByField[name]?.trim());
  };

  const steps = [
    <section key="s1" style={{ display: "grid", gap: "var(--spacing-md)" }}>
      <div className="form-group">
        <label htmlFor="etablissement" className="form-label">Type d'etablissement</label>
        <Select id="etablissement" className={errors.etablissement ? "is-invalid" : ""} {...register("etablissement")} aria-invalid={Boolean(errors.etablissement)}>
          {etablissementOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
        {errors.etablissement && <span className="error-message">{errors.etablissement.message || "Etablissement invalide"}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="surface" className="form-label">Surface (m²)</label>
        <Input id="surface" className={errors.surface ? "is-invalid" : ""} type="number" min={10} max={50000} {...register("surface")} aria-invalid={Boolean(errors.surface)} />
        {errors.surface && <span className="error-message">{errors.surface.message || "La surface doit etre superieure a 0"}</span>}
      </div>
    </section>,
    <section key="s2" style={{ display: "grid", gap: "var(--spacing-md)" }}>
      <fieldset className="card" style={{ padding: "var(--spacing-md)" }}>
        <legend className="form-label">Nuisibles</legend>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--spacing-sm)", marginTop: "var(--spacing-sm)" }}>
          {nuisiblesOptions.map((option) => (
            <label key={option.value} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", fontSize: "var(--font-size-sm)" }}>
              <input
                type="checkbox"
                value={option.value}
                checked={watch("nuisibles").includes(option.value)}
                onChange={(e) => {
                  const current = watch("nuisibles");
                  form.setValue(
                    "nuisibles",
                    e.target.checked
                      ? [...current, option.value]
                      : current.filter((item) => item !== option.value),
                    { shouldValidate: true }
                  );
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      {errors.nuisibles && <span className="error-message">{errors.nuisibles.message || "Selectionnez au moins un nuisible"}</span>}
      <fieldset className="card" style={{ padding: "var(--spacing-md)" }}>
        <legend className="form-label">Urgence</legend>
        <div className="radio-grid" style={{ marginTop: "var(--spacing-sm)" }}>
          {[
            {
              value: "24h",
              title: "Intervention sous 24h",
              desc: "Priorité maximale",
            },
            {
              value: "contrat_annuel",
              title: "Contrat annuel",
              desc: "Suivi régulier",
            },
            {
              value: "simple_devis",
              title: "Simple devis",
              desc: "Demande standard",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`radio-option ${urgenceValue === option.value ? "is-selected" : ""}`}
            >
              <input type="radio" value={option.value} {...register("urgence")} />
              <span>
                <span className="radio-option-title">{option.title}</span>
                <span className="radio-option-desc">{option.desc}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.urgence && <span className="error-message">{errors.urgence.message || "Urgence invalide"}</span>}
      </fieldset>
    </section>,
    <section key="s3" style={{ display: "grid", gap: "var(--spacing-md)" }}>
      <div className="form-group">
        <label htmlFor="nom" className="form-label">Nom du contact <span className="required-star">*</span></label>
        <Input id="nom" className={errors.nom && canShowContactFieldError("nom") ? "is-invalid" : ""} {...register("nom")} aria-invalid={Boolean(errors.nom && canShowContactFieldError("nom"))} />
        {errors.nom && canShowContactFieldError("nom") && <span className="error-message">{errors.nom.message || "Nom invalide"}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email <span className="required-star">*</span></label>
        <Input id="email" className={errors.email && canShowContactFieldError("email") ? "is-invalid" : ""} type="email" {...register("email")} aria-invalid={Boolean(errors.email && canShowContactFieldError("email"))} />
        {errors.email && canShowContactFieldError("email") && <span className="error-message">{errors.email.message || "Email invalide"}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="telephone" className="form-label">Téléphone <span className="required-star">*</span></label>
        <div className="input-with-prefix">
          <span className="field-prefix field-prefix-flag" aria-hidden="true">🇫🇷</span>
          <Input
            id="telephone"
            className={[
              "with-prefix",
              errors.telephone && canShowContactFieldError("telephone") ? "is-invalid" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            placeholder="06 12 34 56 78"
            {...register("telephone")}
            aria-invalid={Boolean(errors.telephone && canShowContactFieldError("telephone"))}
          />
        </div>
        {errors.telephone && canShowContactFieldError("telephone") && <span className="error-message">{errors.telephone.message || "Telephone invalide"}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="message" className="form-label">Message</label>
        <Textarea id="message" className={errors.message && canShowContactFieldError("message") ? "is-invalid" : ""} rows={4} maxLength={500} {...register("message")} aria-invalid={Boolean(errors.message && canShowContactFieldError("message"))} />
        <span className="form-hint">{(messageValue ?? "").length}/500 caracteres</span>
        {errors.message && canShowContactFieldError("message") && <span className="error-message">{errors.message.message || "Message invalide"}</span>}
      </div>
    </section>,
  ];

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back, reset } = useMultiStepForm(steps);

  async function onSubmit(values: DevisFormValues) {
    setServerError("");
    setConfirmationId("");

    const response = await fetch("/api/devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    let payload: { id?: string; error?: string } = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      setServerError(payload.error || "Erreur inconnue");
      return;
    }

    setSubmittedData(values as DevisPayload);
    setConfirmationId(payload.id || "");
    form.reset();
    setContactSubmitAttempted(false);
  }

  async function handleNext() {
    const fieldsByStep: (keyof DevisFormValues)[][] = [
      ["etablissement", "surface"],
      ["nuisibles", "urgence"],
      ["nom", "email", "telephone", "message"],
    ];
    const ok = await trigger(fieldsByStep[currentStepIndex]);
    if (ok) next();
  }

  return (
    <main className="page-container" style={{ maxWidth: 860 }}>
      {!confirmationId && (
        <div className="card">
          <div className="card-header">
            <h1 style={{ margin: 0, fontSize: "var(--font-size-2xl)" }}>Demande de devis</h1>
            <p style={{ margin: "var(--spacing-xs) 0 0", color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>Étape {currentStepIndex + 1} / {steps.length}</p>
          </div>
          <div className="card-body" style={{ display: "grid", gap: "var(--spacing-lg)" }}>
            <div className="stepper">
              <div className={`step-item ${currentStepIndex > 0 ? "done" : currentStepIndex === 0 ? "active" : "idle"}`}><div className="step-circle">{currentStepIndex > 0 ? "✓" : "1"}</div><span className="step-label">Infos</span></div>
              <div className={`step-line ${currentStepIndex > 0 ? "done" : ""}`}></div>
              <div className={`step-item ${currentStepIndex > 1 ? "done" : currentStepIndex === 1 ? "active" : "idle"}`}><div className="step-circle">{currentStepIndex > 1 ? "✓" : "2"}</div><span className="step-label">Nuisibles</span></div>
              <div className={`step-line ${currentStepIndex > 1 ? "done" : ""}`}></div>
              <div className={`step-item ${currentStepIndex === 2 ? "active" : "idle"}`}><div className="step-circle">3</div><span className="step-label">Contact</span></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "var(--spacing-lg)" }} aria-live="polite">
              {step}
              {serverError && <p className="error-message">{serverError}</p>}
              <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                {!isFirstStep && <Button type="button" variant="secondary" onClick={() => { setContactSubmitAttempted(false); back(); }}>Retour</Button>}
                {!isLastStep ? (
                  <Button type="button" onClick={handleNext}>Suivant</Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={() => setContactSubmitAttempted(true)}
                    loading={formState.isSubmitting}
                  >
                    Envoyer
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmationId && (
        <aside className="card" style={{ borderStyle: "dashed", boxShadow: "var(--shadow-md)" }}>
          <div className="card-header">
            <h2 style={{ margin: 0, fontSize: "var(--font-size-xl)" }}>Résumé de la demande</h2>
          </div>
          <div className="card-body" style={{ display: "grid", gap: "var(--spacing-md)" }}>
            <span className="badge badge-success" style={{ justifySelf: "start" }}>
              Demande validée
            </span>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              Votre demande a bien été enregistrée.
            </p>
            <div
              style={{
                padding: "var(--spacing-sm)",
                border: "1px solid var(--border)",
                borderRadius: "var(--border-radius-md)",
                background: "color-mix(in oklab, var(--bg-card), #000 1%)",
              }}
            >
              <span className="form-hint">Identifiant de demande</span>
              <p style={{ margin: "4px 0 0", fontWeight: 700 }}>{confirmationId}</p>
            </div>
            {submittedData && (
              <div
                style={{
                  padding: "var(--spacing-sm)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--border-radius-md)",
                  display: "grid",
                  gap: "6px",
                }}
              >
                <span className="form-hint">Récapitulatif</span>
                <p style={{ margin: 0 }}><strong>Établissement:</strong> {etablissementOptions.find((o) => o.value === submittedData.etablissement)?.label}</p>
                <p style={{ margin: 0 }}><strong>Surface:</strong> {submittedData.surface} m²</p>
                <p style={{ margin: 0 }}><strong>Nuisibles:</strong> {submittedData.nuisibles.map((n) => nuisiblesOptions.find((o) => o.value === n)?.label || n).join(", ")}</p>
                <p style={{ margin: 0 }}><strong>Urgence:</strong> {submittedData.urgence === "24h" ? "Intervention sous 24h" : submittedData.urgence === "contrat_annuel" ? "Contrat annuel" : "Simple devis"}</p>
                <p style={{ margin: 0 }}><strong>Contact:</strong> {submittedData.nom} ({submittedData.email})</p>
                <p style={{ margin: 0 }}><strong>Téléphone:</strong> {submittedData.telephone}</p>
                {submittedData.message && <p style={{ margin: 0 }}><strong>Message:</strong> {submittedData.message}</p>}
              </div>
            )}
            <Button
              type="button"
              variant="primary"
              className="btn-success btn-sm"
              onClick={() => {
                setConfirmationId("");
                setServerError("");
                setContactSubmitAttempted(false);
                setSubmittedData(null);
                form.reset();
                reset();
              }}
              style={{ justifySelf: "start" }}
            >
              Faire une nouvelle demande
            </Button>
          </div>
        </aside>
      )}
    </main>
  );
}
