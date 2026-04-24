import { BaseResponse } from "@/types/BaseResponse";
import { Store } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

// Récupérer tous les stores
export const getAllStores = async (): Promise<BaseResponse<PaginationType<Store>>> => {
    return api.get('/stores');
};

// Créer un store (FormData pour logo)
export const createStore = async (data: FormData): Promise<BaseResponse<Store>> => {
    return api.post('/stores', data);
};

// Récupérer un store par ID
export const getStoreById = async (id: number): Promise<BaseResponse<Store>> => {
    return api.get(`/stores/${id}`);
};

// Mettre à jour un store (FormData)
export const updateStore = async (id: number, data: FormData): Promise<BaseResponse<Store>> => {
    // Pour Laravel : FormData + méthode spoofing
    data.append('_method', 'PUT');
    return api.post(`/stores/${id}`, data);
};

// Supprimer un store
export const deleteStore = async (id: number): Promise<BaseResponse<Store>> => {
    return api.delete(`/stores/${id}`);
};

// Activer / désactiver un store
export const setStoreActive = async (id: number, isActive: boolean): Promise<BaseResponse<Store>> => {
    return api.patch(`/stores/${id}/active`, { active: isActive });
};
