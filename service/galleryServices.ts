import { BaseResponse } from "@/types/BaseResponse";
import { Filters } from "@/types/Filters";
import { ApiResponse, GallerieImagesResponse, GalleryCategory } from "@/types/interfaces";
import { api } from "@/lib/proxy";

export const getAllRealisations = async (): Promise<BaseResponse<ApiResponse>> => {
    return api.get('/homepage-data');
};

// Service pour récupérer les commandes avec des filtres
export const getAllImagesGallery = async (filters: Filters): Promise<BaseResponse<GallerieImagesResponse>> => {
    const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString()
    });

    if (filters.search) {
        params.append('search', filters.search);
    }

    return api.get(`/images/gallerie-images?${params.toString()}`);
}

// categories-gallery
export const getAllCategoriesGallery = async (): Promise<BaseResponse<GalleryCategory[]>> => {
    return api.get('/categories/categories-gallery');
}