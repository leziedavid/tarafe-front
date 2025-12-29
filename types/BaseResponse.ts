// app/interfaces/ApiResponse.ts

export interface PaginationLink {
    url?: string | null;
    label: string;
    active: boolean;
}

export interface BaseResponse<T> {
    statusCode: number | string;
    message: string;
    data?: T;

    // Pagination (OPTIONNELLE)
    current_page?: number;
    first_page_url?: string;
    from?: number;
    last_page?: number;
    last_page_url?: string;
    links?: PaginationLink[];
    next_page_url?: string | null;
    path?: string;
    per_page?: number;
    prev_page_url?: string | null;
    to?: number;
    total?: number;
}


// Exemple : structure attendue du body JSON
export interface PaymentResponse {
    id: string;
    amount: number;
    status: string;
    // ajoute ici les autres champs que l’API de Wave renvoie
}