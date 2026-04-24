import { BaseResponse } from "@/types/BaseResponse";
import { Hero, ServiceCard, Feature, FinalCTA, Partenaire, Pricing } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

interface GetAllParams {
    page?: number;
    limit?: number;
}

/* ----------------------------- HERO ----------------------------- */

export const getAllHeros = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<Hero>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/heros?${query}`);
};

export const getActiveHeros = async (): Promise<BaseResponse<Hero[]>> => {
    return api.get('/heros/active');
};

export const getHeroById = async (id: number): Promise<BaseResponse<Hero>> => {
    return api.get(`/heros/${id}`);
};

export const createHero = async (data: FormData): Promise<BaseResponse<Hero>> => {
    return api.post('/heros', data);
};

export const updateHero = async (id: number, data: FormData): Promise<BaseResponse<Hero>> => {
    data.append('_method', 'PUT');
    return api.post(`/heros/${id}`, data);
};

export const deleteHero = async (id: number): Promise<BaseResponse<Hero>> => {
    return api.delete(`/heros/${id}`);
};

export const deleteHeroImage = async (id: number): Promise<BaseResponse<Hero>> => {
    return api.delete(`/heros/${id}/image`);
};

export const activateHero = async (id: number, state: number): Promise<BaseResponse<Hero>> => {
    const validState = state ? 1 : 0;
    return api.put(`/heros/${id}/${validState}/activate`);
};

/* ------------------------- SERVICE CARD ------------------------- */

export const getAllServiceCards = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<ServiceCard>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/service-cards?${query}`);
};

export const getActiveServiceCards = async (): Promise<BaseResponse<ServiceCard[]>> => {
    return api.get('/service-cards/active');
};

export const getServiceCardById = async (id: number): Promise<BaseResponse<ServiceCard>> => {
    return api.get(`/service-cards/${id}`);
};

export const createServiceCard = async (data: FormData): Promise<BaseResponse<ServiceCard>> => {
    return api.post('/service-cards', data);
};

export const updateServiceCard = async (id: number, data: FormData): Promise<BaseResponse<ServiceCard>> => {
    data.append('_method', 'PUT');
    return api.post(`/service-cards/${id}`, data);
};

export const deleteServiceCard = async (id: number): Promise<BaseResponse<ServiceCard>> => {
    return api.delete(`/service-cards/${id}`);
};

export const activateServiceCard = async (id: number, state: number): Promise<BaseResponse<ServiceCard>> => {
    const validState = state ? 1 : 0;
    return api.put(`/service-cards/${id}/${validState}/activate`);
};

export const deleteServiceCardImage = async (id: number): Promise<BaseResponse<ServiceCard>> => {
    return api.delete(`/service-cards/${id}/image`);
};

/* ----------------------------- FEATURE ----------------------------- */

export const getAllFeatures = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<Feature>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/features?${query}`);
};

export const getFeatureById = async (id: number): Promise<BaseResponse<Feature>> => {
    return api.get(`/features/${id}`);
};

export const createFeature = async (data: FormData): Promise<BaseResponse<Feature>> => {
    return api.post('/features', data);
};

export const updateFeature = async (id: number, data: FormData): Promise<BaseResponse<Feature>> => {
    data.append('_method', 'PUT');
    return api.post(`/features/${id}`, data);
};

export const deleteFeature = async (id: number): Promise<BaseResponse<Feature>> => {
    return api.delete(`/features/${id}`);
};

export const activateFeature = async (id: number, state: number): Promise<BaseResponse<Feature>> => {
    const validState = state ? 1 : 0;
    return api.put(`/features/${id}/${validState}/activate`);
};

export const deleteFeatureImage = async (id: number): Promise<BaseResponse<Feature>> => {
    return api.delete(`/features/${id}/image`);
};

/* ---------------------------- FINAL CTA ---------------------------- */

export const getAllFinalCTA = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<FinalCTA>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/final-cta?${query}`);
};

export const getActiveFinalCTA = async (): Promise<BaseResponse<FinalCTA[]>> => {
    return api.get('/final-cta/active');
};

export const getFinalCTAById = async (id: number): Promise<BaseResponse<FinalCTA>> => {
    return api.get(`/final-cta/${id}`);
};

export const createFinalCTA = async (data: FormData): Promise<BaseResponse<FinalCTA>> => {
    return api.post('/final-cta', data);
};

export const updateFinalCTA = async (id: number, data: FormData): Promise<BaseResponse<FinalCTA>> => {
    data.append('_method', 'PUT');
    return api.post(`/final-cta/${id}`, data);
};

export const deleteFinalCTA = async (id: number): Promise<BaseResponse<FinalCTA>> => {
    return api.delete(`/final-cta/${id}`);
};

export const activateFinalCTA = async (id: number, state: number): Promise<BaseResponse<FinalCTA>> => {
    const validState = state ? 1 : 0;
    return api.put(`/final-cta/${id}/${validState}/activate`);
};

export const deleteFinalCTAImage = async (id: number): Promise<BaseResponse<FinalCTA>> => {
    return api.delete(`/final-cta/${id}/image`);
};

/* ---------------------------- PARTENARES --------------------------- */

export const getAllPartners = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<Partenaire>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/partenaires?${query}`);
};

export const createPartner = async (data: FormData): Promise<BaseResponse<Partenaire>> => {
    return api.post('/partenaires', data);
};

export const updatePartner = async (id: number, data: FormData): Promise<BaseResponse<Partenaire>> => {
    data.append('_method', 'PUT');
    return api.post(`/partenaires/${id}`, data);
};

export const deletePartner = async (id: number): Promise<BaseResponse<Partenaire>> => {
    return api.delete(`/partenaires/${id}`);
};

export const activatePartner = async (id: number, state: number): Promise<BaseResponse<Partenaire>> => {
    const validState = state ? 1 : 0;
    return api.put(`/partenaires/${id}/${validState}/activate`);
};

export const deletePartnerImage = async (id: number): Promise<BaseResponse<Partenaire>> => {
    return api.delete(`/partenaires/${id}/image`);
};

/* ----------------------------- PRICING ----------------------------- */

export const getAllPricing = async (params?: GetAllParams): Promise<BaseResponse<PaginationType<Pricing>>> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/pricing?${query}`);
};

export const createPricing = async (data: FormData): Promise<BaseResponse<Pricing>> => {
    return api.post('/pricing', data);
};

export const updatePricing = async (id: number, data: FormData): Promise<BaseResponse<Pricing>> => {
    data.append('_method', 'PUT');
    return api.post(`/pricing/${id}`, data);
};

export const deletePricing = async (id: number): Promise<BaseResponse<Pricing>> => {
    return api.delete(`/pricing/${id}`);
};

export const activatePricing = async (id: number, state: number): Promise<BaseResponse<Pricing>> => {
    const validState = state ? 1 : 0;
    return api.put(`/pricing/${id}/${validState}/activate`);
};

export const deletePricingImage = async (id: number): Promise<BaseResponse<Pricing>> => {
    return api.delete(`/pricing/${id}/image`);
};
