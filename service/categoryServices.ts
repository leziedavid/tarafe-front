import { BaseResponse } from "@/types/BaseResponse";
import { CategoryProduct, SubCategoryProduct } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

// ========================== CATÉGORIES ==========================

// Récupérer toutes les catégories
export const getAllCategories = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<CategoryProduct>>> => {
    return api.get(`/products-categories?page=${page}&limit=${limit}`);
};

// Récupérer toutes les catégories sans pagination
export const getAllCategoriesIn = async (): Promise<BaseResponse<CategoryProduct[]>> => {
    return api.get('/products-categories/all');
};

// Récupérer une catégorie par ID
export const getCategoryById = async (id: number): Promise<BaseResponse<CategoryProduct>> => {
    return api.get(`/products-categories/${id}`);
};

// Créer une ou plusieurs catégories
export const createCategory = async (data: { name: string; slug: string } | { name: string; slug: string }[]): Promise<BaseResponse<CategoryProduct>> => {
    return api.post('/products-categories', data);
};

// Mettre à jour une catégorie
export const updateCategory = async (id: number, data: { name: string; slug: string }): Promise<BaseResponse<CategoryProduct>> => {
    return api.put(`/products-categories/${id}`, data);
};

// Supprimer une catégorie
export const deleteCategory = async (id: number): Promise<BaseResponse<CategoryProduct>> => {
    return api.delete(`/products-categories/${id}`);
};

// ========================== SOUS-CATÉGORIES ==========================

// Récupérer les sous-catégories par catégorie
export const getSubCategoriesbyCategory = async (category: number): Promise<BaseResponse<SubCategoryProduct[]>> => {
    return api.get(`/products-categories/${category}/sub-categories`);
};

// Récupérer toutes les sous-catégories
export const getAllSubCategories = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<SubCategoryProduct>>> => {
    return api.get(`/products-sous-categories?page=${page}&limit=${limit}`);
};

// Récupérer une sous-catégorie par ID
export const getSubCategoryById = async (id: number): Promise<BaseResponse<SubCategoryProduct>> => {
    return api.get(`/products-sous-categories/${id}`);
};

// Créer une ou plusieurs sous-catégories
export const createSubCategory = async (
    data: { name: string; category_id: number; slug: string; added_by: number;}[]): Promise<BaseResponse<SubCategoryProduct>> => {

    const payload = data.map(item => ({
        name: item.name,
        slug: item.slug,
        category_id: item.category_id,
        added_by: item.added_by,
    }));

    return api.post('/products-sous-categories', payload);
};

// Mettre à jour une sous-catégorie
export const updateSubCategory = async (id: number, data: { name: string; category_id: number }): Promise<BaseResponse<SubCategoryProduct>> => {
    return api.put(`/products-sous-categories/${id}`, data);
};

// Supprimer une sous-catégorie
export const deleteSubCategory = async (id: number): Promise<BaseResponse<SubCategoryProduct>> => {
    return api.delete(`/products-sous-categories/${id}`);
};
