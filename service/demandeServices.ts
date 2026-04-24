import { BaseResponse } from "@/types/BaseResponse";
import { Demande } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

// ============================
// 📌 GET ALL DEMANDES (Admin / Pagination / Filtres)
// ============================
export const getAllDemandes = async (page: number, limit: number, status?: string, search?: string): Promise<BaseResponse<PaginationType<Demande>>> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    
    return api.get(`/demandes?${params.toString()}`);
};

// ============================
// 📌 GET DEMANDE BY ID
// ============================
export const getDemandeById = async (id: number): Promise<BaseResponse<Demande>> => {
    return api.get(`/demandes/${id}`);
};

// ============================
// 📌 CREATE DEMANDE
// ============================
export const createDemande = async (payload: FormData): Promise<BaseResponse<Demande>> => {
    return api.post('/demandes', payload);
};

// ============================
// 📌 UPDATE DEMANDE STATUS
// ============================
export const updateDemandeStatus = async (id: number, status: string): Promise<BaseResponse<Demande>> => {
    return api.patch(`/demandes/${id}/status`, { status });
};

// ============================
// 📌 DELETE DEMANDE
// ============================
export const deleteDemande = async (id: number): Promise<BaseResponse<null>> => {
    return api.delete(`/demandes/${id}`);
};

// ============================
// 📌 GET DEMANDES BY REALISATION
// ============================
export const getDemandesByRealisation = async (realisationId: number): Promise<BaseResponse<Demande[]>> => {
    return api.get(`/demandes/realisation/${realisationId}`);
};
