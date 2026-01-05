// types/schemas/equipeSchema.ts
import { z } from 'zod';

export const equipeSchema = z.object({
    nomPren_equipe: z.string().min(1, "Le nom complet est requis"),
    fonction_equipe: z.string().min(1, "La fonction est requise"),
    email_equipe: z.string().email("Email invalide").optional().nullable(),
    photo_equipe: z.any().optional().nullable(),
});

export type EquipeFormValues = z.infer<typeof equipeSchema>;