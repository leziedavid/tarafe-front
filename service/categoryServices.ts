import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { CategoryProduct, SubCategoryProduct } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

const baseUrl = getBaseUrl();

// ========================== CATÉGORIES ==========================

// Récupérer toutes les catégories
export const getAllCategories = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<CategoryProduct>>> => {
    const response = await fetch(`${baseUrl}/products-categories?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Récupérer toutes les catégories
export const getAllCategoriesIn = async (): Promise<BaseResponse<CategoryProduct[]>> => {
    const response = await fetch(`${baseUrl}/products-categories/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};


// Récupérer une catégorie par ID
export const getCategoryById = async (id: number): Promise<BaseResponse<CategoryProduct>> => {
    const response = await fetch(`${baseUrl}/products-categories/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Créer une catégorie
// Créer une ou plusieurs catégories
export const createCategory = async (data: { name: string; slug: string } | { name: string; slug: string }[]): Promise<BaseResponse<CategoryProduct>> => {
    const response = await fetch(`${baseUrl}/products-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // supporte un objet ou un tableau
        credentials: 'include',
    });
    return response.json();
};

// Mettre à jour une catégorie
export const updateCategory = async (id: number, data: { name: string; slug: string }): Promise<BaseResponse<CategoryProduct>> => {
    const response = await fetch(`${baseUrl}/products-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    return response.json();
};

// Supprimer une catégorie
export const deleteCategory = async (id: number): Promise<BaseResponse<CategoryProduct>> => {
    const response = await fetch(`${baseUrl}/products-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// ========================== SOUS-CATÉGORIES ==========================



//{category}/sub-categories
export const getSubCategoriesbyCategory = async (category: number): Promise<BaseResponse<SubCategoryProduct[]>> => {
    const response = await fetch(`${baseUrl}/products-categories/${category}/sub-categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Récupérer toutes les sous-catégories
export const getAllSubCategories = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<SubCategoryProduct>>> => {
    const response = await fetch(`${baseUrl}/products-sous-categories?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Récupérer une sous-catégorie par ID
export const getSubCategoryById = async (id: number): Promise<BaseResponse<SubCategoryProduct>> => {
    const response = await fetch(`${baseUrl}/products-sous-categories/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Créer une ou plusieurs sous-catégories
// Créer une ou plusieurs sous-catégories
export const createSubCategory = async (
    data: { name: string; category_id: number; slug: string; added_by: number;}[]): Promise<BaseResponse<SubCategoryProduct>> => {

    // 🔁 mapping frontend → backend
    const payload = data.map(item => ({
        name: item.name,
        slug: item.slug,
        category_id: item.category_id, // ✅ IMPORTANT
        added_by: item.added_by,
    }));

    const response = await fetch(`${baseUrl}/products-sous-categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', // 👈 force JSON côté Laravel
        },
        body: JSON.stringify(payload),
    });

    // 🔥 GESTION ERREUR PROPRE
    if (!response.ok) {
        const text = await response.text();
        console.error("API ERROR createSubCategory:", text);
        throw new Error("Erreur serveur lors de la création des sous-catégories");
    }

    return response.json();
};



// Mettre à jour une sous-catégorie
export const updateSubCategory = async (id: number, data: { name: string; categoryId: number }): Promise<BaseResponse<SubCategoryProduct>> => {
    const response = await fetch(`${baseUrl}/products-sous-categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    return response.json();
};

// Supprimer une sous-catégorie
export const deleteSubCategory = async (id: number): Promise<BaseResponse<SubCategoryProduct>> => {
    const response = await fetch(`${baseUrl}/products-sous-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};
