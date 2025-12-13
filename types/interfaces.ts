export interface Category {
    id_categories_produits: string;
    libelle_categories_produits: string;
    slug_categories_produits: string;
    logos_categories_produits: string | null;
    logos_size: string | null;
    state_categories_produits: string;
    created_at: string;
    updated_at: string | null;
}

export interface Slider {
    id_sliders: string;
    name_sliders: string;
    slidersUrl: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Blog {
    posts_id: string;
    posts_title: string;
    posts_slug: string;
    posts_user_id: string;
    posts_status: string;
    posts_category_id: string;
    imagePath: string;
    posts_body: string;
    created_at: string;
    updated_at: string | null;
    id: string;
    name: string;
    sexe_users: string;
    contact: string;
    piece: string;
    email: string;
    photo: string | null;
    password: string;
    status: string;
    nom_ntreprise: string | null;
    pays: string;
    lieu_livraison: string;
    ville: string;
    quartier: string;
    code_postal: string;
    email_verified_at: string | null;
    remember_token: string | null;
    is_admin: string;
    categories_blog_id: string;
    slug_categories_blog: string;
    name_categories_blog: string;
    state_categories_blog: string;
}

export interface Partenaire {
    id_partenaires: string;
    libelle_partenaires: string;
    Path_partenaires: string;
    status_partenaires: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface Realisation {
    id_realisations: string;
    code_realisation: string;
    libelle_realisations: string;
    descript_real: string;
    images_realisations: string;
    statut_realisations: string;
    isActive: string;
    users_realisations: string;
    position: string;
    created_at: string;
    updated_at: string | null;
}

export interface Images {
    id_img_realisations: number;
    realisations_id: number;
    codeId: string;
    filles_img_realisations: string;
    one_img_realisations: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface DetailRealisation {
    images: Images[];
    id: string;
    realisations: Realisation[];
    reglages: Reglage[];
}

export interface Reglage {
    id_reglages: string;
    entreprise_reglages: string;
    description_reglages: string;
    desc_reglagesImg1: string;
    desc_reglagesImg2: string;
    desc_footer: string;
    texte_personnalisation: string;
    logoSite_reglages: string;
    logo_footer: string;
    images1_reglages: string;
    images2_reglages: string;
    images3_reglages: string;
    active: string;
    titre_banner1: string;
    texte_banner1: string;
    titre_banner2: string | null;
    texte_banner2: string | null;
    localisation_reglages: string;
    email_reglages: string;
    phone1_reglages: string;
    phone2_reglages: string | null;
    ouverture_reglages: string;
    lienFacebbook_reglages: string;
    liensYoutub_reglages: string;
    lienLikedin_reglages: string;
    lienInstagram_reglages: string;
    libelle_section: string;
    description_section: string;
    addby_partenaires: string;
    texteHeader1: string;
    texteHeader2: string;
    couleur1: string;
    couleur2: string;
    couleur3: string;
    couleur4: string;
    nb_views_site: string;
    nb_views_fb: string;
    nb_views_insta: string;
    created_at: string;
    updated_at: string;
}

export interface Publicite {
    id_publicite: string;
    typesCard1: string;
    typesCard2: string;
    files_publicite1: string;
    files_publicite2: string;
    libelle_publicite1: string;
    libelle_publicite2: string;
    link1: string;
    link2: string;
    class1: string;
    class2: string;
    created_at: string;
    updated_at: string;
}

export interface Politique {
    id_politique: string;
    libelle_politique: string;
    description_politique: string;
    files_politique: string;
    created_at: string;
    updated_at: string | null;
}

export interface ApiResponse {
    categories: Category[];
    sliders: Slider[];
    blogs: Blog[];
    partenaires: Partenaire[];
    realisations: Realisation[];
    reglages: Reglage[];
    Publicites: Publicite[];
    politique: Politique[];
}

// Interface pour les réponses API individuelles si nécessaire
export interface CategoriesResponse {
    categories: Category[];
}

export interface SlidersResponse {
    sliders: Slider[];
}

export interface BlogsResponse {
    blogs: Blog[];
}

export interface PartenairesResponse {
    partenaires: Partenaire[];
}

export interface RealisationsResponse {
    realisations: Realisation[];
}

export interface ReglagesResponse {
    reglages: Reglage[];
}

export interface PublicitesResponse {
    Publicites: Publicite[];
}

export interface PolitiqueResponse {
    politique: Politique[];
}


export interface OptionRealisation {
    id_option_reaalisation: number;
    stateOption_reaalisation: number;
    libelleOption_reaalisation: string;
    created_at: string; // Utilisé comme chaîne de caractères pour représenter une date
    updated_at: string | null; // Peut être une chaîne de caractères ou null
}


// Interface pour la structure de pagination des réalisations
export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}
// Interface pour la réponse de l'API
export interface AllDataResponse {
    realisations: {
        current_page: number;
        data: Realisation[];  // Liste des réalisations
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: PaginationLinks[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    reglages: Reglage[];
    OptionRealisation: OptionRealisation[];
}
