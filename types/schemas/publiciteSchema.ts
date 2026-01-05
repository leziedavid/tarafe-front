// types/schemas/publiciteSchema.ts
import { z } from 'zod';

export const publiciteSchema = z.object({
    typesCard1: z.string().nullable().optional(),
    typesCard2: z.string().nullable().optional(),
    files_publicite1: z.any().nullable().optional(),
    files_publicite2: z.any().nullable().optional(),
    files_publicite3: z.any().nullable().optional(),
    libelle_publicite1: z.string().nullable().optional(),
    libelle_publicite2: z.string().nullable().optional(),
    link1: z.string().url("URL invalide").nullable().optional(),
    link2: z.string().url("URL invalide").nullable().optional(),
    link3: z.string().url("URL invalide").nullable().optional(),
    class1: z.string().nullable().optional(),
    class2: z.string().nullable().optional(),
    class3: z.string().nullable().optional(),
});

export type PubliciteFormValues = z.infer<typeof publiciteSchema>;