
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { AdminRealisationFilters, AllDataResponse, ApiResponse, DetailRealisation, OptionRealisation, Realisation } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

// export const getAllRealisations = async (page: number, limit: number): Promise<BaseResponse<PaginationType<ApiResponse>>> => {
//     const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
//     const response = await fetch(`${getBaseUrl()}/homepage-data`, { method: "GET" });
//     return await response.json();
// }


// CRUD
// createRealisation

export const createRealisation = async (data: FormData): Promise<BaseResponse<Realisation>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/create`, {
        method: 'POST',
        body: data,
    });
    return await response.json();
}


// updateRealisations
export const updateRealisation = async (id: number, data: FormData): Promise<BaseResponse<Realisation>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/${id}`, {
        method: 'PUT',
        body: data,
    });
    return await response.json();
}


// deleteRealisations
export const deleteRealisation = async (id: number): Promise<BaseResponse<Realisation>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
}

export const getAllRealisations = async (): Promise<BaseResponse<ApiResponse>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/homepage-data`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

// getRealisationsByLaballe https://ms.cloud.tarafe.com/api/v1/realisation/libelle/Trousses%20beaut%C3%A9%20personnalisables

export const getRealisationsByLaballe = async (labelle: string): Promise<BaseResponse<DetailRealisation>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/libelle/${labelle}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
};

// Service pour récupérer les réalisations
export const getAllRealisationsByFilter = async (page: number, limit: number, search: number): Promise<BaseResponse<AllDataResponse>> => {
    console.log(search);
    const response = await fetch(`${getBaseUrl()}/realisations/status/${search}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
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
    const response = await fetch(`${getBaseUrl()}/realisations/all/admin/data?${query}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return await response.json();
};

// updateRealisationStatut
export const updateRealisationStatut = async (id: number, statut: string): Promise<BaseResponse<Realisation>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/update/stats/${id}/statut`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut_realisations: statut }),
    });
    return await response.json();
}

// updateRealisationActive
export const updateRealisationActive = async (id: number, statut: string): Promise<BaseResponse<Realisation>> => {
    const response = await fetch(`${getBaseUrl()}/realisations/update/${id}/isActive`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: statut }),
    });
    return await response.json();
}

// lieste des categorie de realisation et ses CRUD

export const getCategories = async (): Promise<BaseResponse<OptionRealisation[]>> => {
    const response = await fetch(`${getBaseUrl()}/categories-realisation`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
}

export const createCategory = async (data: OptionRealisation): Promise<BaseResponse<OptionRealisation>> => {
    const response = await fetch(`${getBaseUrl()}/categories-realisation/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

export const updateCategory = async (id: number, data: OptionRealisation): Promise<BaseResponse<OptionRealisation>> => {
    const response = await fetch(`${getBaseUrl()}/categories-realisation/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

export const deleteCategory = async (id: number): Promise<BaseResponse<OptionRealisation>> => {
    const response = await fetch(`${getBaseUrl()}/categories-realisation/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
}

export const getCategoryById = async (id: number): Promise<BaseResponse<OptionRealisation>> => {
    const response = await fetch(`${getBaseUrl()}/categories-realisation/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
}


// api option realisation table pivo
// getCategoriesById 
export const getCategoriesById = async (id: number): Promise<BaseResponse<OptionRealisation>> => {
    const response = await fetch(`${getBaseUrl()}/options/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
}