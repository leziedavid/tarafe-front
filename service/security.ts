import { fetchWithAuth, getTokenFromLocalStorage } from "@/app/middleware";
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { User } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

const baseUrl = getBaseUrl();


/**
 * Connexion utilisateur (email ou téléphone)
 * Retourne user, token et stores
 */
export const login = async (identifier: string, password: string): Promise<BaseResponse<{ user: User; token: string; stores: any[]}>> => {
    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ identifier, password }),
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur login:', error);
        return {
            statusCode: 500,
            message: 'Erreur réseau',
            data: undefined
        };
    }
};

/**
 * Rafraîchir le token
 * Le token actuel est passé en paramètre
 */
export const refreshTokens = async (currentToken: string ): Promise<BaseResponse<{ user: User; token: string }>> => {
    try {
        const response = await fetch(`${baseUrl}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${currentToken}`
            },
            credentials: "include",
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur refresh token:', error);
        return {
            statusCode: 500,
            message: 'Erreur réseau',
            data: undefined
        };
    }
}

/**
 * Récupérer tous les utilisateurs (paginated)
 */
export const getAllUsers = async (params?: { page?: number; limit?: number; search?: string }): Promise<BaseResponse<PaginationType<User>>> => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${baseUrl}/auth?${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    return await response.json();
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUserById = async (id: number): Promise<BaseResponse<User>> => {
    const response = await fetch(`${baseUrl}/auth/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    return await response.json();
};

/**
 * Créer un utilisateur (FormData si photo)
 */
export const createUser = async (data: FormData): Promise<BaseResponse<User>> => {
    const response = await fetch(`${baseUrl}/auth`, {
        method: "POST",
        body: data,
        credentials: "include",
    });
    return await response.json();
};

/**
 * Mettre à jour un utilisateur (FormData + _method=PUT pour Laravel)
 */
export const updateUser = async (id: number, data: FormData): Promise<BaseResponse<User>> => {
    data.append("_method", "PUT"); // Spoof PUT pour Laravel
    const response = await fetch(`${baseUrl}/auth/${id}`, {
        method: "POST",
        body: data,
        credentials: "include",
    });
    return await response.json();
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = async (id: number): Promise<BaseResponse<User>> => {
    const response = await fetch(`${baseUrl}/auth/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return await response.json();
};

// get userdata via fetchWithAuth

export const getUserAllData = async (): Promise<BaseResponse<{ user: User;stores: any[] }>> => {
    const token = getTokenFromLocalStorage()
    if (!token) return { statusCode: 401, message: 'Non authentifié' }
    const response = await fetchWithAuth(`${baseUrl}/auth/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return await response.json();
};
