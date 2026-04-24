import { BaseResponse } from "@/types/BaseResponse";
import { DataReglage, Equipe, Publicite, Reglage } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

// ========================== Reglage ==========================

// Récupérer toutes les Reglage
export const getAllReglages = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<Reglage>>> => {
    return api.get(`/reglages?page=${page}&limit=${limit}`);
};

// Récupérer toutes les Reglage sans pagination
export const getAllReglagesIn = async (): Promise<BaseResponse<DataReglage>> => {
    return api.get('/reglages');
};

// createReglage
export const createReglage = async (data: FormData): Promise<BaseResponse<Reglage>> => {
    return api.post('/reglages', data);
};

// Mettre à jour une reglage
export const updateReglage = async (id: number, data: FormData): Promise<BaseResponse<Reglage>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel
    return api.post(`/reglages/${id}`, data);
};

// Supprimer une reglage
export const deleteReglage = async (id: number): Promise<BaseResponse<Reglage>> => {
    return api.delete(`/reglages/${id}`);
};

// ========================== Publicité ==========================

// Récupérer toutes les Publicité
export const getAllPublicites = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<Publicite>>> => {
    return api.get(`/publicites?page=${page}&limit=${limit}`);
};

// Récupérer toutes les Publicité sans pagination
export const getAllPublicitesIn = async (): Promise<BaseResponse<Publicite[]>> => {
    return api.get('/publicites/all');
};

// createPublicite
export const createPublicite = async (data: FormData): Promise<BaseResponse<Publicite>> => {
    return api.post('/publicites', data);
};

// Mettre à jour une publicité
export const updatePublicite = async (id: number, data: FormData): Promise<BaseResponse<Publicite>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel
    return api.post(`/publicites/${id}`, data);
};

// Supprimer une publicité
export const deletePublicite = async (id: number): Promise<BaseResponse<Publicite>> => {
    return api.delete(`/publicites/${id}`);
};

// ========================== CRUD Equipe ==========================

export const getAllEquipes = async (page: number = 1, limit: number = 10): Promise<BaseResponse<PaginationType<Equipe>>> => {
    return api.get(`/equipes?page=${page}&limit=${limit}`);
};

// Récupérer toutes les Equipe sans pagination
export const getAllEquipesIn = async (): Promise<BaseResponse<Equipe[]>> => {
    return api.get('/equipes/all');
};

// createEquipe
export const createEquipe = async (data: FormData): Promise<BaseResponse<Equipe>> => {
    return api.post('/equipes', data);
};

// Mettre à jour une equipe
export const updateEquipe = async (id: number, data: FormData): Promise<BaseResponse<Equipe>> => {
    data.append('_method', 'PUT'); // Spoof PUT pour Laravel
    return api.post(`/equipes/${id}`, data);
};

// Supprimer une equipe
export const deleteEquipe = async (id: number): Promise<BaseResponse<Equipe>> => {
    return api.delete(`/equipes/${id}`);
};

