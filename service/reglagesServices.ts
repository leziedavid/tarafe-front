import { fetchWithAuth } from "@/app/middleware";
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { CategoryProduct, DataReglage, Equipe, Publicite, Reglage, SubCategoryProduct } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

const baseUrl = getBaseUrl();

// ========================== Reglage ==========================

// Récupérer toutes les Reglage
export const getAllReglages = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<Reglage>>> => {
    const response = await fetch(`${baseUrl}/reglages?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Récupérer toutes les Reglage
export const getAllReglagesIn = async (): Promise<BaseResponse<DataReglage>> => {
    const response = await fetch(`${baseUrl}/reglages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};


// createReglage
export const createReglage = async (data: FormData): Promise<BaseResponse<Reglage>> => {
    const response = await fetch(`${baseUrl}/reglages`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

// Mettre à jour une reglage
export const updateReglage = async (id: number, data: FormData): Promise<BaseResponse<Reglage>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel
    const response = await fetch(`${baseUrl}/reglages/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

// Supprimer une reglage
export const deleteReglage = async (id: number): Promise<BaseResponse<Reglage>> => {
    const response = await fetch(`${baseUrl}/reglages/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

// ========================== Publicité ==========================

// Récupérer toutes les Publicité
export const getAllPublicites = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<Publicite>>> => {
    const response = await fetch(`${baseUrl}/publicites?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Récupérer toutes les Publicité
export const getAllPublicitesIn = async (): Promise<BaseResponse<Publicite[]>> => {
    const response = await fetch(`${baseUrl}/publicites/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};


// createPublicite
export const createPublicite = async (data: FormData): Promise<BaseResponse<Publicite>> => {
    const response = await fetch(`${baseUrl}/publicites`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

// Mettre à jour une publicité
export const updatePublicite = async (id: number, data: FormData): Promise<BaseResponse<Publicite>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel
    const response = await fetch(`${baseUrl}/publicites/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

// Supprimer une publicité
export const deletePublicite = async (id: number): Promise<BaseResponse<Publicite>> => {
    const response = await fetch(`${baseUrl}/publicites/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

// CRUD Equipe

export const getAllEquipes = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<Equipe>>> => {
    const response = await fetch(`${baseUrl}/equipes?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};

// Récupérer toutes les Equipe
export const getAllEquipesIn = async (): Promise<BaseResponse<Equipe[]>> => {
    const response = await fetch(`${baseUrl}/equipes/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return response.json();
};


// createEquipe
export const createEquipe = async (data: FormData): Promise<BaseResponse<Equipe>> => {
    const response = await fetch(`${baseUrl}/equipes`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

// Mettre à jour une equipe
export const updateEquipe = async (id: number, data: FormData): Promise<BaseResponse<Equipe>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel
    const response = await fetch(`${baseUrl}/equipes/${id}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    return response.json();
};

// Supprimer une equipe
export const deleteEquipe = async (id: number): Promise<BaseResponse<Equipe>> => {
    const response = await fetch(`${baseUrl}/equipes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

