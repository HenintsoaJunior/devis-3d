"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import type { DevisFormValues } from "@/validators/devis";
import { devisSchema } from "@/validators/devis";

const nuisiblesOptions = ["rats", "cafards", "punaises", "fourmis", "termites"];

export default function DevisPage() {
  const [serverError, setServerError] = useState("");
  const [confirmationId, setConfirmationId] = useState("");

  const form = useForm<DevisFormValues>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      etablissement: "",
      surface: 0,
      nuisibles: [],
      urgence: "moyenne",
      nom: "",
      email: "",
      telephone: "",
      message: "",
    },
    mode: "onBlur",
  });

  const { register, handleSubmit, formState, trigger, watch } = form;

  const steps = [
    <section key="s1" className="space-y-4">
      <div>
        <label htmlFor="etablissement" className="mb-1 block text-sm font-medium">Etablissement</label>
        <Input id="etablissement" {...register("etablissement")} />
      </div>
      <div>
        <label htmlFor="surface" className="mb-1 block text-sm font-medium">Surface (m²)</label>
        <Input id="surface" type="number" min={1} {...register("surface")} />
      </div>
    </section>,
    <section key="s2" className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Nuisibles</legend>
        <div className="grid grid-cols-2 gap-2">
          {nuisiblesOptions.map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={value}
                checked={watch("nuisibles").includes(value)}
                onChange={(e) => {
                  const current = watch("nuisibles");
                  form.setValue(
                    "nuisibles",
                    e.target.checked
                      ? [...current, value]
                      : current.filter((item) => item !== value),
                    { shouldValidate: true }
                  );
                }}
              />
              {value}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="urgence" className="mb-1 block text-sm font-medium">Urgence</label>
        <Select id="urgence" {...register("urgence")}>
          <option value="faible">Faible</option>
          <option value="moyenne">Moyenne</option>
          <option value="elevee">Elevee</option>
        </Select>
      </div>
    </section>,
    <section key="s3" className="space-y-4">
      <div>
        <label htmlFor="nom" className="mb-1 block text-sm font-medium">Nom</label>
        <Input id="nom" {...register("nom")} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <Input id="email" type="email" {...register("email")} />
      </div>
      <div>
        <label htmlFor="telephone" className="mb-1 block text-sm font-medium">Telephone</label>
        <Input id="telephone" {...register("telephone")} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">Message</label>
        <Textarea id="message" rows={4} {...register("message")} />
      </div>
    </section>,
  ];

  const { step, currentStepIndex, isFirstStep, isLastStep, next, back } = useMultiStepForm(steps);

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

    setConfirmationId(payload.id || "");
    form.reset();
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
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Demande de devis</h1>
      <p className="mb-6 text-sm text-neutral-600">Etape {currentStepIndex + 1} / {steps.length}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-live="polite">
        {step}
        {Object.keys(formState.errors).length > 0 && (
          <p className="text-sm text-red-600">Veuillez corriger les champs invalides.</p>
        )}
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {confirmationId && <p className="text-sm text-green-700">Demande envoyee. ID: {confirmationId}</p>}

        <div className="flex gap-3">
          {!isFirstStep && (
            <Button type="button" variant="secondary" onClick={back}>Retour</Button>
          )}
          {!isLastStep ? (
            <Button type="button" onClick={handleNext}>Suivant</Button>
          ) : (
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Envoi..." : "Envoyer"}
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}
