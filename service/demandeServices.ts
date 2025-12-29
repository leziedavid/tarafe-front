import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Demande } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

type CreateDemandePayload = {
    realisation_id: number;
    texte?: string;
    police?: string;
    dimension?: string;
    colors?: string;
    nom_prenom: string;
    entreprise?: string;
    numero?: string;
    email: string;
    description?: string;
    position: string;
    files: File[]; // fichiers à uploader
};

// ============================
// 📌 GET ALL DEMANDES (Admin / Pagination / Filtres)
// ============================
export const getAllDemandes = async (page: number,limit: number,status?: string,search?: string): Promise<BaseResponse<PaginationType<Demande>>> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    const response = await fetch(`${getBaseUrl()}/demandes?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

// ============================
// 📌 GET DEMANDE BY ID
// ============================
export const getDemandeById = async (id: number): Promise<BaseResponse<Demande>> => {
    const response = await fetch(`${getBaseUrl()}/demandes/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

// ============================
// 📌 CREATE DEMANDE
// ============================
export const createDemande = async (payload: FormData): Promise<BaseResponse<Demande>> => {
    const response = await fetch(`${getBaseUrl()}/demandes`, {
        method: "POST",
        body: payload, // FormData direct
    });

    return response.json();
};

// ============================
// 📌 UPDATE DEMANDE STATUS
// ============================
export const updateDemandeStatus = async (id: number, status: string): Promise<BaseResponse<Demande>> => {
    const response = await fetch(`${getBaseUrl()}/demandes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    return response.json();
};

// ============================
// 📌 DELETE DEMANDE
// ============================
export const deleteDemande = async (id: number): Promise<BaseResponse<null>> => {
    const response = await fetch(`${getBaseUrl()}/demandes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

// ============================
// 📌 GET DEMANDES BY REALISATION
// ============================
export const getDemandesByRealisation = async (realisationId: number): Promise<BaseResponse<Demande[]>> => {
    const response = await fetch(`${getBaseUrl()}/demandes/realisation/${realisationId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};
