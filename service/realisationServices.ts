
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { AllDataResponse, ApiResponse, DetailRealisation } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

// export const getAllRealisations = async (page: number, limit: number): Promise<BaseResponse<PaginationType<ApiResponse>>> => {
//     const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
//     const response = await fetch(`${getBaseUrl()}/homepage-data`, { method: "GET" });
//     return await response.json();
// }

export const getAllRealisations = async (): Promise<BaseResponse<ApiResponse>> => {
    const response = await fetch(`${getBaseUrl()}/homepage-data`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

// getRealisationsByLaballe https://ms.cloud.tarafe.com/api/v1/realisation/libelle/Trousses%20beaut%C3%A9%20personnalisables

export const getRealisationsByLaballe = async (labelle: string): Promise<BaseResponse<DetailRealisation>> => {
    const response = await fetch(`${getBaseUrl()}/realisation/libelle/${labelle}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

// Service pour récupérer les réalisations
export const getAllRealisationsByFilter = async (page: number, selectedCategory: number): Promise<BaseResponse<AllDataResponse>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/status/${selectedCategory}?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'   // Type de contenu JSON
        }
    });
    return await response.json();
};

