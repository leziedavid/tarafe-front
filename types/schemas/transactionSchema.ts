// schemas/transactionSchema.ts

import { z } from 'zod';

export const transactionSchema2 = z.object({
    date: z.string().min(1, { message: "La date est requise" }),
    libelle: z.string().min(1, { message: "Le libellé est requis" }),
    categorieTransactionsId: z.string().min(1, { message: "La catégorie est requise" }),
    autreCategorie: z.string().optional(), // s'affiche seulement si "Autre"
    sortie_caisse: z.string().optional(),
    sortie_banque: z.string().optional(),
    entree_caisse: z.string().optional(),
    entree_banque: z.string().optional(),
    type_operation: z.enum([
        'MOOV MONEY',
        'ORANGE MONEY',
        'MTN MONEY',
        'WAVE',
        'BANQUE',
        'NSP'
    ], { required_error: "Le type d'opération est requis" }),
    details: z.string().optional()
});

export const transactionSchema = z.object({
    date: z.string().min(1, { message: "La date est requise" }),
    libelle: z.string().min(1, { message: "Le libellé est requis" }),
    categorieTransactionsId: z.string().min(1, { message: "La catégorie est requise" }),
    autreCategorie: z.string().optional(), // utilisé si catégorie = autre

    typeTransaction: z.enum([
        'entree_caisse',
        'entree_banque',
        'sortie_caisse',
        'sortie_banque'
    ], { required_error: "Le type de transaction est requis" }),

    somme: z
        .string()
        .min(1, { message: "Le montant est requis" })
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Le montant doit être un nombre positif"
        }),

    type_operation: z.enum([
        'MOOV MONEY',
        'ORANGE MONEY',
        'MTN MONEY',
        'WAVE',
        'BANQUE',
        'NSP'
    ], { required_error: "Le type d'opération est requis" }),

    details: z.string().optional(),

    categorieFinale: z.string().min(1, { message: "La catégorie finale est requise" }) // ajout pour validation complète
});
