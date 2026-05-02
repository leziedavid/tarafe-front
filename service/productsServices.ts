import { BaseResponse } from "@/types/BaseResponse";
import { Product, ProductStats } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

/**
 * Récupérer tous les produits avec pagination et filtres optionnels
 */
export const getAllProducts = async (params?: { page?: number; limit?: number; search?: string; category_id?: number; sub_category_id?: number; store_id?: number; available?: boolean; }): Promise<BaseResponse<PaginationType<Product>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/products?${query}`);
};

/**
 * Récupérer tous les produits avec pagination et filtres optionnels
 */
export const getForAdmin = async (params?: { page?: number; limit?: number; search?: string; category_id?: number; sub_category_id?: number; store_id?: number; available?: boolean; }): Promise<BaseResponse<PaginationType<Product>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/products/admin/all_liste?${query}`);
};



/**
 * Filtrer les produits (advanced)
 */
export const filterProducts = async (params?: { page?: number; limit?: number; search?: string; category_id?: number; sub_category_id?: number; store_id?: number; available?: boolean; }): Promise<BaseResponse<PaginationType<Product>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/products/filter?${query}`);
};

// ProductStats     // Récupérer les statistiques des produits
export const getProductStats = async (params?: { page?: number; limit?: number; search?: string; category_id?: number; sub_category_id?: number; store_id?: number; available?: boolean; }): Promise<BaseResponse<ProductStats>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/products/stats/by-filter?${query}`);
};

/**
 * Récupérer un produit par ID
 */
export const getProductById = async (id: number): Promise<BaseResponse<Product>> => {
    return api.get(`/products/${id}`);
};

/**
 * Créer un produit (FormData pour images)
 */
export const createProduct = async (data: FormData): Promise<BaseResponse<Product>> => {
    return api.post('/products', data);
};

/**
 * Mettre à jour un produit (FormData + méthode spoofing)
 */
export const updateProduct = async (id: number, data: FormData): Promise<BaseResponse<Product>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel avec FormData
    return api.post(`/products/${id}`, data);
};

/**
 * Supprimer un produit
 */
export const deleteProduct = async (id: number): Promise<BaseResponse<Product>> => {
    return api.delete(`/products/${id}`);
};

/**
 * Définir l'image principale d'un produit
 */
export const setMainProductImage = async (productId: number, imageId: number): Promise<BaseResponse<Product>> => {
    return api.post(`/products/${productId}/main-image/${imageId}`);
};

/**
 * ==================================================
 * UPDATE PRODUCT STATUS
 * ==================================================
 * 
 * updateProductField(1, "statut", true);
updateProductField(1, "stock", 50);
updateProductField(1, "featured", false);

 */
export const updateProductField = async (productId: number, field: "statut" | "stock" | "featured", value: string | number | boolean): Promise<BaseResponse<any>> => {
    return api.put(`/products/${productId}/${field}/${value}`);
};
