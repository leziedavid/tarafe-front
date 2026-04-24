import { BaseResponse } from "@/types/BaseResponse";
import { AdminRealisationFilters, AllDataResponse, ApiResponse, DetailRealisation, OptionRealisation, Realisation } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

// CRUD
// createRealisation

export const createRealisation = async (data: FormData): Promise<BaseResponse<Realisation>> => {
    return api.post('/realisations/create', data);
}

// updateRealisations
export const updateRealisation = async (id: number, data: FormData): Promise<BaseResponse<Realisation>> => {
    // Note: Laravel can be tricky with PUT and FormData, usually POST + _method=PUT is preferred
    // If original code used POST, we keep it.
    return api.post(`/realisations/${id}`, data);
}

// deleteRealisations
export const deleteRealisation = async (id: number): Promise<BaseResponse<Realisation>> => {
    return api.delete(`/realisations/${id}`);
}

export const getAllRealisations = async (): Promise<BaseResponse<ApiResponse>> => {
    return api.get('/realisations/homepage-data');
};

export const getRealisationsByLaballe = async (labelle: string): Promise<BaseResponse<DetailRealisation>> => {
    return api.get(`/realisations/libelle/${encodeURIComponent(labelle)}`);
};

// Service pour récupérer les réalisations
export const getAllRealisationsByFilter = async (page: number, limit: number, search: number): Promise<BaseResponse<AllDataResponse>> => {
    return api.get(`/realisations/status/${search}?page=${page}&limit=${limit}`);
};

// getall admin realisations

const buildQueryParams = (filters: AdminRealisationFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });
    return params.toString();
};

export const getAllRealisationsByAdmin = async (filters: AdminRealisationFilters): Promise<BaseResponse<PaginationType<Realisation>>> => {
    const query = buildQueryParams(filters);
    return api.get(`/realisations/all/admin/data?${query}`);
};

// updateRealisationStatut
export const updateRealisationStatut = async (id: number, statut: string): Promise<BaseResponse<Realisation>> => {
    return api.put(`/realisations/update/stats/${id}/statut`, { statut_realisations: statut });
}

// updateRealisationActive
export const updateRealisationActive = async (id: number, statut: string): Promise<BaseResponse<Realisation>> => {
    return api.put(`/realisations/update/${id}/isActive`, { isActive: statut });
}

// lieste des categorie de realisation et ses CRUD

export const getCategories = async (): Promise<BaseResponse<OptionRealisation[]>> => {
    return api.get('/categories-realisation');
}

export const createCategory = async (data: OptionRealisation): Promise<BaseResponse<OptionRealisation>> => {
    return api.post('/categories-realisation/create', data);
}

export const updateCategory = async (id: number, data: OptionRealisation): Promise<BaseResponse<OptionRealisation>> => {
    return api.put(`/categories-realisation/update/${id}`, data);
}

export const deleteCategory = async (id: number): Promise<BaseResponse<OptionRealisation>> => {
    return api.delete(`/categories-realisation/delete/${id}`);
}

export const getCategoryById = async (id: number): Promise<BaseResponse<OptionRealisation>> => {
    return api.get(`/categories-realisation/${id}`);
}

// api option realisation table pivo
// getCategoriesById 
export const getCategoriesById = async (id: number): Promise<BaseResponse<OptionRealisation>> => {
    return api.get(`/options/${id}`);
}