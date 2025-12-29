import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Product, ProductStats } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

const baseUrl = getBaseUrl();

/**
 * Récupérer tous les produits avec pagination et filtres optionnels
 */
export const getAllProducts = async (params?: {page?: number;limit?: number;search?: string;category_id?: number;sub_category_id?: number;store_id?: number;available?: boolean;}): Promise<BaseResponse<PaginationType<Product>>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/products?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return await response.json();
};

/**
 * Filtrer les produits (advanced)
 */
export const filterProducts = async (params?: {page?: number;limit?: number;search?: string;category_id?: number;sub_category_id?: number;store_id?: number;available?: boolean;}): Promise<BaseResponse<PaginationType<Product>>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/products/filter?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return await response.json();
};

// ProductStats     // Récupérer les statistiques des produits
export const getProductStats = async (params?: {page?: number;limit?: number;search?: string;category_id?: number;sub_category_id?: number;store_id?: number;available?: boolean;}): Promise<BaseResponse<ProductStats>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/products/stats/by-filter?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return await response.json();
};

/**
 * Récupérer un produit par ID
 */
export const getProductById = async (id: number): Promise<BaseResponse<Product>> => {
    const response = await fetch(`${baseUrl}/products/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return await response.json();
};

/**
 * Créer un produit (FormData pour images)
 */
export const createProduct = async (data: FormData): Promise<BaseResponse<Product>> => {
    const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return await response.json();
};

/**
 * Mettre à jour un produit (FormData + méthode spoofing)
 */
export const updateProduct = async (id: number, data: FormData): Promise<BaseResponse<Product>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel avec FormData
    const response = await fetch(`${baseUrl}/products/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return await response.json();
};

/**
 * Supprimer un produit
 */
export const deleteProduct = async (id: number): Promise<BaseResponse<Product>> => {
    const response = await fetch(`${baseUrl}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
};

/**
 * Définir l'image principale d'un produit
 */
export const setMainProductImage = async (productId: number, imageId: number): Promise<BaseResponse<Product>> => {
    const response = await fetch(`${baseUrl}/products/${productId}/main-image/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return await response.json();
};
