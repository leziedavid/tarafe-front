// subCategorySchema.ts
import { z } from "zod";

export const subCategorySchema = z.object({
    items: z.array(
        z.object({
            name: z.string().min(1, "Nom requis"),
            slug: z.string().min(1, "Slug requis"),
            categoryId: z.string().min(1, "Catégorie requise"),
            added_by: z.number().optional(),
        })
    ),
});

export type SubCategoryFormValues = z.infer<typeof subCategorySchema>;
