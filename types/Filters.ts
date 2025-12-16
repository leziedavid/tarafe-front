export interface Filters {
    page: number;
    limit: number;
    search?: string; // Recherche optionnelle
}

export interface Params {
    page: number;
    limit: number;
    search?: string; // Recherche sous forme de chaîne clé-valeur avec des virgules
}
