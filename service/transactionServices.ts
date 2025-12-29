import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Filters } from "@/types/Filters";
import { CategorieTransaction, Demande, TotalTransaction, Transaction, TransactionDataGraphe, TransactionTotalsResponse } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

export const imports = async (formData: FormData): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/transactions/import`, {
        method: 'POST',
        body: formData,
    });
    return await response.json();
};

// Service pour récupérer les commandes avec des filtres
export const getAlltransactions = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null, selectedCategorie: string | null,): Promise<BaseResponse<PaginationType<Transaction>>> => {

    // Construction de l'URL avec les paramètres de filtre

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    const url = new URL(`${getBaseUrl()}/transactions`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (filters.search) { url.searchParams.append('search', filters.search); }
    if (category) { url.searchParams.append('category', category); }
    if (payment) { url.searchParams.append('payment', payment); }
    if (selectedYears) { url.searchParams.append('selectedYears', selectedYears); }
    if (selectedCategorie) { url.searchParams.append('selectedCategorie', selectedCategorie); }
    const response = await fetch(url.toString(), {

        method: 'GET',
        headers: {
            // 'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'   // Type de contenu JSON
        }
    });
    return await response.json();

};


export const DownloadFiles = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null): Promise<BaseResponse<any>> => {
    // Construction de l'URL avec les paramètres de filtre
    const url = new URL(`${getBaseUrl()}/transactions/export-transactions`); // Assurez-vous que l'API retourne les totaux via cette route
    url.searchParams.append('page', filters.page.toString());
    url.searchParams.append('limit', filters.limit.toString());
    if (filters.search) { url.searchParams.append('search', filters.search); }
    if (category) { url.searchParams.append('category', category); }
    if (payment) { url.searchParams.append('payment', payment); }
    if (selectedYears) { url.searchParams.append('selectedYears', selectedYears); }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    return await response.json();

}


export const submitTransaction = async (data: any): Promise<BaseResponse<any>> => {

    const response = await fetch(`${getBaseUrl()}/transactions/save-transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return await response.json();
};

// updateTransaction

export const updateTransaction = async (id: number, data: any): Promise<BaseResponse<any>> => {

    const response = await fetch(`${getBaseUrl()}/transactions/update-transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    return await response.json();

};


// Service pour récupérer les catégories de transactions en ordre décroissant
export const fetchCategorieTransaction = async (): Promise<BaseResponse<CategorieTransaction[]>> => {

    const response = await fetch(`${getBaseUrl()}/categorie-transactions/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return await response.json();
};

// Service pour CRUD les catégories de transactions
export const fetchAllCategorieTransaction = async (filters: Filters): Promise<BaseResponse<PaginationType<CategorieTransaction>>> => {

    const response = await fetch(`${getBaseUrl()}/categorie-transactions?page=${filters.page}&limit=${filters.limit}&search=${filters.search}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return await response.json();


};


export const createCategoryTransaction = async (data: any) => {

    const response = await fetch(`${getBaseUrl()}/categorie-transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
};

export const updateCategoryTransaction = async (id: number, data: any) => {

    const response = await fetch(`${getBaseUrl()}/categorie-transactions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
};

export const deleteCategoryTransaction = async (id: number) => {

    const response = await fetch(`${getBaseUrl()}/categorie-transactions/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
};

// Service pour récupérer les commandes avec des filtres
export const getTransactionDataGraphe = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null, selectedCategorie: string | null,): Promise<BaseResponse<TransactionDataGraphe>> => {

    // Construction de l'URL avec les paramètres de filtre
    const url = new URL(`${getBaseUrl()}/transactions/all/graphs`);
    url.searchParams.append('page', filters.page.toString());
    url.searchParams.append('limit', filters.limit.toString());
    if (filters.search) { url.searchParams.append('search', filters.search); }
    if (category) { url.searchParams.append('category', category); }
    if (payment) { url.searchParams.append('payment', payment); }
    if (selectedYears) { url.searchParams.append('selectedYears', selectedYears); }
    if (selectedCategorie) { url.searchParams.append('selectedCategorie', selectedCategorie); }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'   // Type de contenu JSON
        }
    });
    return await response.json();

};


export const getAllTransactionTotals = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null): Promise<BaseResponse<TransactionTotalsResponse>> => {

    // Construction de l'URL avec les paramètres de filtre
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    const url = new URL(`${getBaseUrl()}/transactions/totals`); // Assurez-vous que l'API retourne les totaux via cette route
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (filters.search) { url.searchParams.append('search', filters.search); }
    if (category) { url.searchParams.append('category', category); }
    if (payment) { url.searchParams.append('payment', payment); }
    if (selectedYears) { url.searchParams.append('selectedYears', selectedYears); }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'   // Type de contenu JSON
        }
    });

    return await response.json();


}

// Service pour récupérer les détails des commandes
export const getdetailCommandes = async (id: number): Promise<BaseResponse<any>> => {
    // Appel de l'API avec le token et l'ID de la commande
    const response = await fetch(`${getBaseUrl()}/getdetailCommandes/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
};

export const deleteTransaction = async (id: number): Promise<BaseResponse<any>> => {

    const response = await fetch(`${getBaseUrl()}/transactions/delete-transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
};

// gestion des categorie de Transaction

