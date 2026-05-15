import { z } from "zod";

export const devisSchema = z.object({
  etablissement: z.string().min(2),
  surface: z.coerce.number().int().positive(),
  nuisibles: z.array(z.string().min(1)).min(1),
  urgence: z.enum(["faible", "moyenne", "elevee"]),
  nom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

export type DevisFormValues = z.input<typeof devisSchema>;
export type DevisPayload = z.output<typeof devisSchema>;
