import { z } from "zod";

export const devisSchema = z.object({
  etablissement: z.enum(["restaurant", "hotel", "copropriete", "autre"], {
    error: "Type d'etablissement invalide",
  }),
  surface: z.coerce
    .number({ error: "La surface est requise" })
    .refine(Number.isFinite, "La surface doit etre un nombre valide")
    .refine(Number.isInteger, "La surface doit etre un nombre entier")
    .min(10, "La surface minimum est 10 m²")
    .max(50000, "La surface maximum est 50000 m²"),
  nuisibles: z
    .array(
      z.enum(["rats", "cafards", "punaises_de_lit", "frelons", "autre"])
    )
    .min(1, "Selectionnez au moins un nuisible"),
  urgence: z.enum(["24h", "contrat_annuel", "simple_devis"], {
    error: "Type d'urgence invalide",
  }),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.string().email("Adresse email invalide"),
  telephone: z
    .string()
    .trim()
    .min(1, "Le telephone est requis")
    .refine(
      (value) =>
        /^(?:(?:\+33|0033)[67]|0[67])(?:[\s.-]?\d{2}){4}$/.test(value),
      "Numero de telephone FR invalide"
    ),
  message: z
    .string()
    .max(500, "Le message ne doit pas depasser 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type DevisFormValues = z.input<typeof devisSchema>;
export type DevisPayload = z.output<typeof devisSchema>;
