import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Store } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

const baseUrl = getBaseUrl();

// Récupérer tous les stores
export const getAllStores = async (): Promise<BaseResponse<PaginationType<Store>>> => {
    const response = await fetch(`${baseUrl}/stores`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <-- important si Sanctum
    });
    return await response.json();
};

// Créer un store (FormData pour logo)
export const createStore = async (data: FormData): Promise<BaseResponse<Store>> => {
    const response = await fetch(`${baseUrl}/stores`, {
        method: 'POST',
        body: data,
    });
    return await response.json();
};

// Récupérer un store par ID
export const getStoreById = async (id: number): Promise<BaseResponse<Store>> => {
    const response = await fetch(`${baseUrl}/stores/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return await response.json();
};

// Mettre à jour un store (FormData)
export const updateStore = async (id: number, data: FormData): Promise<BaseResponse<Store>> => {
    const response = await fetch(`${baseUrl}/stores/${id}`, {
        method: 'POST', // Laravel 15 préfère POST + _method=PUT pour FormData
        body: (() => {
            // Pour Laravel : FormData + méthode spoofing
            data.append('_method', 'PUT');
            return data;
        })(),
        credentials: 'include',
    });
    return await response.json();
};

// Supprimer un store
export const deleteStore = async (id: number): Promise<BaseResponse<Store>> => {
    const response = await fetch(`${baseUrl}/stores/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
};

// Activer / désactiver un store
export const setStoreActive = async (id: number, isActive: boolean): Promise<BaseResponse<Store>> => {
    const response = await fetch(`${baseUrl}/stores/${id}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: isActive }),
    });
    return await response.json();
};
