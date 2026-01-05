

export enum OrderStatus {
    NEW = "NEW",
    PROCESSING = "PROCESSING",
    READY = "READY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

export enum UserStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

export enum Role {
    ADMIN = "Admin",
    VENDOR = "Vendeurs",
    MANAGER = "Gestionnaire",
    CLIENT = "Clients",
}


export enum PaymentMethod {
    IMMEDIATE = "IMMEDIATE",
    ON_ARRIVAL = "ON_ARRIVAL",
    MOBILE_MONEY = "MOBILE_MONEY",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
}

export enum PaymentMethodFrench {
    IMMEDIATE = "PAIEMENT IMMÉDIAT",
    ON_ARRIVAL = "PAIEMENT À LA LIVRAISON",
    MOBILE_MONEY = "MOBILE MONEY",
    CARD = "CARTE BANCAIRE",
    BANK_TRANSFER = "VIREMENT BANCAIRE",
}

export enum DeliveryMethod {
    HOME_DELIVERY = "HOME_DELIVERY",
    STORE_PICKUP = "STORE_PICKUP",
    LIFT = "LIFT",
    PICKUP = "PICKUP",
    DROP = "DROP",
}

export enum DeliveryMethodFrench {
    HOME_DELIVERY = "LIVRAISON À DOMICILE",
    STORE_PICKUP = "RETRAIT EN MAGASIN",
    LIFT = "COVOITURAGE",
    PICKUP = "POINT DE RETRAIT",
    DROP = "DÉPÔT À UN POINT",
}

export interface User {
    id: number;
    name?: string;
    sexe_users?: 'M' | 'F' | 'A' | '';
    contact?: string;
    piece?: string;
    email: string;
    photo?: string;
    password?: string;
    status: number;
    nom_ntreprise?: number;
    pays?: string;
    lieu_livraison?: string;
    ville?: string;
    quartier?: string;
    code_postal?: string;
    email_verified_at?: string; // ISO string
    remember_token?: string | null;
    is_admin: Role;
    stores: Store[];
    created_at?: string; // ISO string
    updated_at?: string; // ISO string
}


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
    images?: Images[];
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

    titre_banner3: string | null;
    texte_banner3: string | null;
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

// Interface pour une équipe
export interface Equipe {
    id_equipe: number;
    nomPren_equipe?: string | null;
    fonction_equipe?: string | null;
    email_equipe?: string | null;
    photo_equipe?: string | null;
    created_at?: string | null; // timestamps
    updated_at?: string | null;
}

// Interface pour une visite
export interface Visit {
    id_visit: number;
    nb_visite_site?: number | null;
    nb_abonnes_facebook?: number | null;
    nb_abonnes_twitter?: number | null;
    nb_abonnes_instagram?: number | null;
    nb_abonnes_youtube?: number | null;
    created_at?: string | null; // timestamps
    updated_at?: string | null;
}

// Interface principale regroupant reglages, equipes et visits
export interface DataReglage {
    reglages: Reglage[];
    equipes: Equipe[];
    visits: Visit[];
}
export interface Publicite {
    id_publicite: string;
    typesCard1: string;
    typesCard2: string;
    files_publicite1: string;
    files_publicite2: string;
    libelle_publicite1: string;
    libelle_publicite2: string;
    files_publicite3: string;
    link1: string;
    link2: string;
    link3: string;
    class1: string;
    class2: string;
    class3: string;
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


export interface ApiDataCategoriesByRealisation {
    data: {
        id_op_realisation: number;               // ID unique de l'option de réalisation
        idrealis_op_realisation: number;          // ID de la relation avec la réalisation
        idoption_realis_op_realisation: number;   // ID de l'option associée
        created_at: string | null;                // Date de création (peut être null)
        updated_at: string | null;                // Date de mise à jour (peut être null)
    }[];
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

export interface CategoryProduct {
    id: number;
    name: string;
    slug: string;
    added_by: number;
    created_at: string;
    updated_at: string;
}

export interface SubCategoryProduct {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category?: CategoryProduct;
    added_by: number;
    created_at: string;
    updated_at: string;
}


export interface ProductImage {
    id: number;
    product_id: number;
    path: string;
    is_main: number; // 0 | 1
    created_at: string;
    updated_at: string;
}

export interface ProductStats {
    total_items: number;
    featured: number;
    out_of_stock: number;
    average_stock: number;
}


export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string;
    image: string;
    images: ProductImage[];
    price: string;          // "10000.00"
    old_price: string | null;
    stock: number;
    available: number;      // 0 | 1
    featured: number;       // 0 | 1
    tag: "NEW ARRIVAL" | "GET OFF 20%" | "BEST SELLER" | "LIMITED" | null;
    rating: string;         // "0.0"
    review_count: number;
    category_id: number;
    sub_category_id: number;
    store_id: number;
    added_by: number;
    colors: any[];          // relation vide pour l’instant
    sizes: any[];           // relation vide pour l’instant
    category: CategoryProduct;
    sub_category: SubCategoryProduct;
    store: Store;
    created_at: string;
    updated_at: string;
}


// Définir l'interface pour l'image dans la galerie
export interface GallerieImage {
    id_gallerie_images: string; // Identifiant de l'image
    files_gallerie_images: string; // Chemin du fichier d'image
    libelle_gallerie_images: string | null; // Libellé de l'image (peut être nul)
    created_at: string; // Date de création de l'image
    updated_at: string | null; // Date de mise à jour de l'image (peut être nul)
}
export interface GalleryCategory {
    idcategories_gallery: number;
    libelle: string;
}

export interface GallerieImagesResponse {

    data: {
        current_page: number;
        data: GallerieImage[];  // Liste des réalisations
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
}

export interface MyOrder {
    id_orders: string;
    transaction_id: string;
    total: string;
    date_orders: string;        // format: YYYY-MM-DD
    heurs_orders: string;       // format: HH:mm:ss
    couleur_orders: string | null;
    taille_orders: string | null;
    pointures_orders: string | null;
    Mode_paiement: string;
    adresse_paiement: string | null;
    contact_paiement: string | null;
    email_orders: string;
    nomUsers_orders: string;
    status_orders: string;      // "0", "1", etc.
    storesId_orders: string;
    user_id: string;
    notes_orders: string | null;
    personnalise: string;
    created_at: string;         // format: YYYY-MM-DD HH:mm:ss
    updated_at: string | null;
}

export interface Demande {
    id: number;
    realisation_id: number;
    realisation: Realisation;
    texte?: string;
    police?: string;
    dimension?: string;
    colors?: string;
    nom_prenom: string;
    entreprise?: string;
    numero?: string;
    email: string;
    description?: string;
    position: string;
    files: string
};


export interface Transaction {
    id: string;
    date: string; // format YYYY-MM-DD
    libelle: string;
    categorieTransactionsId: string;
    sortie_caisse: string;
    sortie_banque: string;
    entree_caisse: string;
    entree_banque: string;
    type_operation: string; // Type d'opération (par exemple "NSP")
    // type_operation: "WAVE" | "ORANGE MONEY" | string;
    details: string;
    created_at: string; // datetime
    updated_at: string; // datetime
    categorie_label: string;
}
export interface CategorieTransaction {
    id: number;
    label: string;
    defautPrice: string;
    created_at: string | null;
    updated_at: string | null;
}
export interface GraphData {
    date: string;
    value: number;
    label: string;
    color: string;
}


// types/interfaces.ts
export interface Store {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    description: string;
    active: number; // 0 | 1
    added_by: number;
    created_at: string;
    updated_at: string;
}

export interface TransactionDataGraphe {
    BarGraphByDate: GraphData[];
    BarGraphByTypeOperation: GraphData[];
    BarGraphByCategorieTransactions: GraphData[];
    PieGraphByDate: GraphData[];
    PieGraphByTypeOperation: GraphData[];
    PieGraphByCategorieTransactions: GraphData[];
}

export interface OrderDetails {
    id_orders: number;
    transaction_id: string;
    total: number;
    date_orders: string;
    heurs_orders: string;
    couleur_orders: string | null;
    taille_orders: string | null;
    pointures_orders: string | null;
    Mode_paiement: string;
    adresse_paiement: string | null;
    contact_paiement: string;
    email_orders: string;
    nomUsers_orders: string;
    status_orders: number;
    storesId_orders: number;
    user_id: number;
    notes_orders: string | null;
    personnalise: number;
    created_at: string;
    updated_at: string | null;
    id_achats: number;
    codeAchat: string;
    orderId: number;
    id_reali: number;
    dimensionAchats: string;
    taillesParamsAchats: string | null;
    pointuresParamsAchats: string | null;
    couleursAchats: string;
    NomPrenomAchats: string;
    EntrepriseAchats: string;
    numeroAchats: string;
    emailAchats: string;
    FileAchats: string;
    PositionsFiles: string;
    imgLogosAchats: string;
    policeAchats: string;
    texteAchats: string;
    isMails: number;
    modelfiles: string | null;
    typesmodeel: number;
    devisAchat: string | null;
    typesdevis: number;
    factures: string;
    typesfactures: number;
    objetmodels: string | null;
    objetdevis: string | null;
    objetfactures: string;
    remarques: string;
    id_realisations: number;
    code_realisation: string;
    libelle_realisations: string;
    descript_real: string;
    images_realisations: string;
    statut_realisations: string;
    isActive: number;
    users_realisations: number;
    position: number;
}
export interface TotalTransaction {
    total_sortie_caisse: string;  // Montant total de la sortie caisse
    total_sortie_banque: string;  // Montant total de la sortie banque
    total_entree_caisse: string;  // Montant total de l'entrée caisse
    total_entree_banque: string;  // Montant total de l'entrée banque
    total_general: number;        // Total général de toutes les transactions
}

export interface TransactionTotalsResponse {
    totals: TotalTransaction; // Totaux des transactions
}

export interface AdminRealisationFilters {
    page?: number;
    limit?: number;
    option_id?: number;
    statut?: number;
    libelle?: string;
}


