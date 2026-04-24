import { fetchWithAuth, getTokenFromLocalStorage } from "@/app/middleware";
import { BaseResponse } from "@/types/BaseResponse";
import { EquipeResponse, User } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

/**
 * Connexion utilisateur (email ou téléphone)
 * Retourne user, token et stores
 */
export const login = async (identifier: string, password: string): Promise<BaseResponse<{ user: User; token: string; stores: any[] }>> => {
    try {
        return await api.post('/auth/login', { identifier, password }, { skipAuth: true });
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
 * Inscription utilisateur (Register)
 * Basé sur l'endpoint store du UserController (POST /auth)
 */
export const register = async (data: any): Promise<BaseResponse<{ user: User; token: string }>> => {
    try {
        // Dans UserController.php de Laravel, store correspond à la création brute d'un utilisateur
        // Si votre backend a un /api/register spécifique, adaptez l'URL ici.
        // On utilise skipAuth: true car on n'est pas encore connecté.
        return await api.post('/auth', data, { skipAuth: true });
    } catch (error) {
        console.error('Erreur inscription:', error);
        return {
            statusCode: 500,
            message: 'Erreur réseau lors de l\'inscription',
            data: undefined
        };
    }
};

/**
 * Rafraîchir le token
 * Le token actuel est passé en paramètre
 */
export const refreshTokens = async (currentToken: string): Promise<BaseResponse<{ user: User; token: string }>> => {
    try {
        return await api.post('/auth/refresh-token', {}, { 
            skipAuth: true,
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
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
    return api.get(`/auth?${query}`);
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUserById = async (id: number): Promise<BaseResponse<User>> => {
    return api.get(`/auth/${id}`);
};

/**
 * Créer un utilisateur (FormData si photo)
 */
export const createUser = async (data: FormData): Promise<BaseResponse<User>> => {
    return api.post('/auth', data);
};

/**
 * Mettre à jour un utilisateur (FormData + _method=PUT pour Laravel)
 */
export const updateUser = async (id: number, data: FormData): Promise<BaseResponse<User>> => {
    data.append("_method", "PUT"); // Spoof PUT pour Laravel
    return api.post(`/auth/${id}`, data);
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = async (id: number): Promise<BaseResponse<User>> => {
    return api.delete(`/auth/${id}`);
};

// get userdata via fetchWithAuth

export const getUserAllData = async (): Promise<BaseResponse<{ user: User; stores: any[] }>> => {
    const token = getTokenFromLocalStorage()
    if (!token) return { statusCode: 401, message: 'Non authentifié' }
    
    // On conserve fetchWithAuth ici car il gère déjà le refresh automatique spécifique à cette couche
    const response = await fetchWithAuth(`/auth/me`, {
        method: "GET",
    });
    return await response.json();
};

// getall equipe

export const getAllEquipe = async (): Promise<BaseResponse<EquipeResponse>> => {
    return api.get('/equipes/all/data');
};