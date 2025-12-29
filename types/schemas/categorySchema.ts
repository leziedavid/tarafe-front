import { z } from "zod";

export const categorySchema = z.object({
    categories: z.array(  z.object({ name: z.string().min(1, "Nom requis"), slug: z.string().min(1, "Slug requis"), }) ).min(1, "Ajoutez au moins une catégorie"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
