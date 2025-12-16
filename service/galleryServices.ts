
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Filters } from "@/types/Filters";
import { AllDataResponse, ApiResponse, DetailRealisation, GallerieImagesResponse, GalleryCategory } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

export const getAllRealisations = async (): Promise<BaseResponse<ApiResponse>> => {
    const response = await fetch(`${getBaseUrl()}/homepage-data`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

// Service pour récupérer les commandes avec des filtres
export const getAllImagesGallery = async (filters: Filters): Promise<BaseResponse<GallerieImagesResponse>> => {

    // Construction de l'URL avec les paramètres de filtre
    const url = new URL(`${getBaseUrl()}/gallerie-images`);
    url.searchParams.append('page', filters.page.toString());
    url.searchParams.append('limit', filters.limit.toString());

    if (filters.search) {
        url.searchParams.append('search', filters.search);
    }
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { "Content-Type": "application/json", },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des données.');
    }
    return await response.json();


}

// categories-gallery
export const getAllCategoriesGallery = async (): Promise<BaseResponse<GalleryCategory[]>> => {

    const response = await fetch(`${getBaseUrl()}/categories-gallery`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des données.');
    }
    return await response.json();

}