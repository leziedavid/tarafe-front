import { z } from 'zod';

export const reglageSchema = z.object({
    // Champs de base
    entreprise_reglages: z.string().nullable().optional(),
    description_reglages: z.string().nullable().optional(),

    // Images de description
    desc_reglagesImg1: z.any().nullable().optional(),
    desc_reglagesImg2: z.any().nullable().optional(),

    // Footer et personnalisation
    desc_footer: z.string().nullable().optional(),
    texte_personnalisation: z.string().nullable().optional(),

    // Logos
    logoSite_reglages: z.any().nullable().optional(),
    logo_footer: z.any().nullable().optional(),

    // Images supplémentaires
    images1_reglages: z.any().nullable().optional(),
    images2_reglages: z.any().nullable().optional(),
    images3_reglages: z.any().nullable().optional(),

    // Statut
    active: z.number().min(0).max(1).default(0).optional(),

    // Bannières
    titre_banner1: z.string().nullable().optional(),
    texte_banner1: z.string().nullable().optional(),
    titre_banner2: z.string().nullable().optional(),
    texte_banner2: z.string().nullable().optional(),
    titre_banner3: z.string().nullable().optional(),
    texte_banner3: z.string().nullable().optional(),

    // Contact
    localisation_reglages: z.string().nullable().optional(),
    email_reglages: z.string().email().nullable().optional(),
    phone1_reglages: z.string().nullable().optional(),
    phone2_reglages: z.string().nullable().optional(),
    ouverture_reglages: z.string().nullable().optional(),

    // Réseaux sociaux
    lienFacebbook_reglages: z.string().url().nullable().optional(),
    liensYoutub_reglages: z.string().url().nullable().optional(),
    lienLikedin_reglages: z.string().url().nullable().optional(),
    lienInstagram_reglages: z.string().url().nullable().optional(),
    // Section
    libelle_section: z.string().nullable().optional(),
    description_section: z.string().nullable().optional(),
    // Partenaires
    addby_partenaires: z.number().default(0).optional(),

    // Textes header
    texteHeader1: z.string().nullable().optional(),
    texteHeader2: z.string().nullable().optional(),

    // Couleurs
    couleur1: z.string().nullable().optional(),
    couleur2: z.string().nullable().optional(),
    couleur3: z.string().nullable().optional(),
    couleur4: z.string().nullable().optional(),

    // Statistiques
    nb_views_site: z.number().default(0).optional(),
    nb_views_fb: z.number().default(0).optional(),
    nb_views_insta: z.number().default(0).optional()
});

// Type pour les valeurs du formulaire
export type ReglageFormValues = z.infer<typeof reglageSchema>;

// Type pour les données complètes avec ID
export interface Reglage extends ReglageFormValues {
    id_reglages: string;
}