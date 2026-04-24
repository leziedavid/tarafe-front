import { BaseResponse } from "@/types/BaseResponse";
import { Filters } from "@/types/Filters";
import { CategorieTransaction, Transaction, TransactionDataGraphe, TransactionTotalsResponse } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

export const imports = async (formData: FormData): Promise<BaseResponse<any>> => {
    return api.post('/transactions/import', formData);
};

// Service pour récupérer les transactions avec des filtres
export const getAlltransactions = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null, selectedCategorie: string | null): Promise<BaseResponse<PaginationType<Transaction>>> => {
    const params = new URLSearchParams({
        page: (filters.page ?? 1).toString(),
        limit: (filters.limit ?? 10).toString()
    });

    if (filters.search) params.append('search', filters.search);
    if (category) params.append('category', category);
    if (payment) params.append('payment', payment);
    if (selectedYears) params.append('selectedYears', selectedYears);
    if (selectedCategorie) params.append('selectedCategorie', selectedCategorie);

    return api.get(`/transactions?${params.toString()}`);
};

export const DownloadFiles = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null): Promise<BaseResponse<any>> => {
    const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString()
    });

    if (filters.search) params.append('search', filters.search);
    if (category) params.append('category', category);
    if (payment) params.append('payment', payment);
    if (selectedYears) params.append('selectedYears', selectedYears);

    return api.get(`/transactions/export-transactions?${params.toString()}`);
}

export const submitTransaction = async (data: any): Promise<BaseResponse<any>> => {
    return api.post('/transactions/save-transactions', data);
};

// updateTransaction
export const updateTransaction = async (id: number, data: any): Promise<BaseResponse<any>> => {
    return api.put(`/transactions/update-transactions/${id}`, data);
};

// Service pour récupérer les catégories de transactions en ordre décroissant
export const fetchCategorieTransaction = async (): Promise<BaseResponse<CategorieTransaction[]>> => {
    return api.get('/categorie-transactions/all');
};

// Service pour CRUD les catégories de transactions
export const fetchAllCategorieTransaction = async (filters: Filters): Promise<BaseResponse<PaginationType<CategorieTransaction>>> => {
    return api.get(`/categorie-transactions?page=${filters.page}&limit=${filters.limit}&search=${filters.search}`);
};

export const createCategoryTransaction = async (data: any) => {
    return api.post('/categorie-transactions', data);
};

export const updateCategoryTransaction = async (id: number, data: any) => {
    return api.put(`/categorie-transactions/${id}`, data);
};

export const deleteCategoryTransaction = async (id: number) => {
    return api.delete(`/categorie-transactions/${id}`);
};

// Service pour récupérer les données du graphe
export const getTransactionDataGraphe = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null, selectedCategorie: string | null): Promise<BaseResponse<TransactionDataGraphe>> => {
    const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString()
    });

    if (filters.search) params.append('search', filters.search);
    if (category) params.append('category', category);
    if (payment) params.append('payment', payment);
    if (selectedYears) params.append('selectedYears', selectedYears);
    if (selectedCategorie) params.append('selectedCategorie', selectedCategorie);

    return api.get(`/transactions/all/graphs?${params.toString()}`);
};

export const getAllTransactionTotals = async (filters: Filters, category: string | null, payment: string | null, selectedYears: string | null, selectedCategorie: string | null): Promise<BaseResponse<TransactionTotalsResponse>> => {
    const params = new URLSearchParams({
        page: (filters.page ?? 1).toString(),
        limit: (filters.limit ?? 10).toString()
    });

    if (filters.search) params.append('search', filters.search);
    if (category) params.append('category', category);
    if (payment) params.append('payment', payment);
    if (selectedYears) params.append('selectedYears', selectedYears);
    if (selectedCategorie) params.append('selectedCategorie', selectedCategorie);

    return api.get(`/transactions/totals?${params.toString()}`);
}

// Service pour récupérer les détails des commandes
export const getdetailCommandes = async (id: number): Promise<BaseResponse<any>> => {
    return api.get(`/getdetailCommandes/${id}`);
};

export const deleteTransaction = async (id: number): Promise<BaseResponse<any>> => {
    return api.delete(`/transactions/delete-transactions/${id}`);
};

// gestion des categorie de Transaction

