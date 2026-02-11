import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Hero, ServiceCard, Feature, FinalCTA } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

const baseUrl = getBaseUrl();

interface GetAllParams {
    page?: number;
    limit?: number;
}

/* ----------------------------- HERO ----------------------------- */

export const getAllHeros = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<Hero>>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/heros?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const getActiveHeros = async (): Promise<BaseResponse<Hero[]>> => {
    const response = await fetch(`${baseUrl}/heros/active`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const getHeroById = async (id: number): Promise<BaseResponse<Hero>> => {
    const response = await fetch(`${baseUrl}/heros/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const createHero = async (data: FormData): Promise<BaseResponse<Hero>> => {
    const response = await fetch(`${baseUrl}/heros`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const updateHero = async (id: number, data: FormData): Promise<BaseResponse<Hero>> => {
    data.append('_method', 'PUT');
    const response = await fetch(`${baseUrl}/heros/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const deleteHero = async (id: number): Promise<BaseResponse<Hero>> => {
    const response = await fetch(`${baseUrl}/heros/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const deleteHeroImage = async (id: number): Promise<BaseResponse<Hero>> => {
    const response = await fetch(`${baseUrl}/heros/${id}/image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};



export const activateHero = async (id: number,state: number): Promise<BaseResponse<Hero>> => {
    // sécuriser la valeur (0 ou 1)
    const validState = state ? 1 : 0;
    const response = await fetch(`${baseUrl}/heros/${id}/${validState}/activate`,
        {
            method: 'PUT', // ✅ correction ici
            headers: { 'Content-Type': 'application/json',  },
            credentials: 'include',
        }
    );
    return response.json();
};


/* ------------------------- SERVICE CARD ------------------------- */

export const getAllServiceCards = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<ServiceCard>>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/service-cards?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const getActiveServiceCards = async (): Promise<BaseResponse<ServiceCard[]>> => {
    const response = await fetch(`${baseUrl}/service-cards/active`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const getServiceCardById = async (id: number): Promise<BaseResponse<ServiceCard>> => {
    const response = await fetch(`${baseUrl}/service-cards/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const createServiceCard = async (data: FormData): Promise<BaseResponse<ServiceCard>> => {
    const response = await fetch(`${baseUrl}/service-cards`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const updateServiceCard = async (id: number, data: FormData): Promise<BaseResponse<ServiceCard>> => {
    data.append('_method', 'PUT');
    const response = await fetch(`${baseUrl}/service-cards/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const deleteServiceCard = async (id: number): Promise<BaseResponse<ServiceCard>> => {
    const response = await fetch(`${baseUrl}/service-cards/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const activateServiceCard = async (id: number,state: number): Promise<BaseResponse<ServiceCard>> => {
    // sécuriser la valeur (0 ou 1)
    const validState = state ? 1 : 0;
    const response = await fetch(`${baseUrl}/service-cards/${id}/${validState}/activate`,
        {
            method: 'PUT', // ✅ correction ici
            headers: { 'Content-Type': 'application/json',  },
            credentials: 'include',
        }
    );
    return response.json();
};

export const deleteServiceCardImage = async (id: number): Promise<BaseResponse<ServiceCard>> => {
    const response = await fetch(`${baseUrl}/service-cards/${id}/image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

/* ----------------------------- FEATURE ----------------------------- */

export const getAllFeatures = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<Feature>>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/features?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const getFeatureById = async (id: number): Promise<BaseResponse<Feature>> => {
    const response = await fetch(`${baseUrl}/features/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const createFeature = async (data: FormData): Promise<BaseResponse<Feature>> => {
    const response = await fetch(`${baseUrl}/features`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const updateFeature = async (id: number, data: FormData): Promise<BaseResponse<Feature>> => {
    data.append('_method', 'PUT');
    const response = await fetch(`${baseUrl}/features/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const deleteFeature = async (id: number): Promise<BaseResponse<Feature>> => {
    const response = await fetch(`${baseUrl}/features/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const activateFeature = async (id: number,state: number): Promise<BaseResponse<Feature>> => {
    // sécuriser la valeur (0 ou 1)
    const validState = state ? 1 : 0;
    const response = await fetch(`${baseUrl}/features/${id}/${validState}/activate`,
        {
            method: 'PUT', // ✅ correction ici
            headers: { 'Content-Type': 'application/json',  },
            credentials: 'include',
        }
    );
    return response.json();
};

export const deleteFeatureImage = async (id: number): Promise<BaseResponse<Feature>> => {
    const response = await fetch(`${baseUrl}/features/${id}/image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

/* ---------------------------- FINAL CTA ---------------------------- */

export const getAllFinalCTA = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<FinalCTA>>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/final-cta?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const getActiveFinalCTA = async (): Promise<BaseResponse<FinalCTA[]>> => {
    const response = await fetch(`${baseUrl}/final-cta/active`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const getFinalCTAById = async (id: number): Promise<BaseResponse<FinalCTA>> => {
    const response = await fetch(`${baseUrl}/final-cta/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

export const createFinalCTA = async (data: FormData): Promise<BaseResponse<FinalCTA>> => {
    const response = await fetch(`${baseUrl}/final-cta`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const updateFinalCTA = async (id: number, data: FormData): Promise<BaseResponse<FinalCTA>> => {
    data.append('_method', 'PUT');
    const response = await fetch(`${baseUrl}/final-cta/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

export const deleteFinalCTA = async (id: number): Promise<BaseResponse<FinalCTA>> => {
    const response = await fetch(`${baseUrl}/final-cta/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

export const activateFinalCTA = async (id: number,state: number): Promise<BaseResponse<FinalCTA>> => {
    // sécuriser la valeur (0 ou 1)
    const validState = state ? 1 : 0;
    const response = await fetch(`${baseUrl}/final-cta/${id}/${validState}/activate`,
        {
            method: 'PUT', // ✅ correction ici
            headers: { 'Content-Type': 'application/json',  },
            credentials: 'include',
        }
    );
    return response.json();
};

export const deleteFinalCTAImage = async (id: number): Promise<BaseResponse<FinalCTA>> => {
    const response = await fetch(`${baseUrl}/final-cta/${id}/image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};
