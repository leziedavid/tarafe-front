import { useState, useEffect } from 'react';
import { getBaseUrl } from "@/types/baseUrl";
import { showToast } from "@/lib/toast";
import { UserData } from "@/types/interfaces";

/**
 * Configuration des options de la requête
 */
interface RequestOptions extends RequestInit {
    timeout?: number;
    skipAuth?: boolean;
}

/**
 * Récupère le token d'accès depuis le localStorage
 */
const getAccessToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

/**
 * Décode un token JWT pour extraire les informations
 */
export const decodeJWT = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

/**
 * Hook pour récupérer les informations d'authentification
 */
export const useAuth = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = getAccessToken();
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;
        
        if (storedToken) {
            setToken(storedToken);
        }
        
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    return {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        // Optionnel: infos extraites du token si besoin
        tokenData: token ? decodeJWT(token) : null
    };
};

/**
 * Gère les erreurs de réponse
 */
const handleResponseError = async (response: Response) => {
    const status = response.status;
    let errorMessage = "Une erreur est survenue lors de la communication avec le serveur.";

    try {
        const body = await response.json();
        errorMessage = body.message || errorMessage;
    } catch (e) {
        // Le corps n'est pas du JSON, pas d'action spécifique
    }

    switch (status) {
        case 401:
            // Géré par fetchWithAuth pour le refresh, sinon déconnexion
            break;
        case 403:
            showToast.error("Accès refusé", "Vous n'avez pas les permissions nécessaires.");
            break;
        case 404:
            console.error("Ressource non trouvée:", response.url);
            break;
        case 422:
            // Erreurs de validation Laravel - généralement gérées par le composant
            break;
        case 500:
            showToast.error("Erreur Serveur", "Le serveur rencontre un problème technique.");
            break;
        default:
            showToast.error("Erreur API", errorMessage);
    }
};

/**
 * Client API (Proxy) pour Laravel
 */
export const proxy = async (endpoint: string, options: RequestOptions = {}): Promise<any> => {
    const { timeout = 15000, skipAuth = false, headers: customHeaders, ...rest } = options;

    const baseUrl = getBaseUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    // Contrôleur pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // En-têtes par défaut optimisés pour Laravel
    const headers = new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Identifie comme requête AJAX (utile pour Laravel)
        ...customHeaders,
    });

    // Ajout du token si nécessaire
    if (!skipAuth) {
        const token = getAccessToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    try {
        const response = await fetch(url, {
            ...rest,
            headers,
            signal: controller.signal,
            credentials: 'include',
        });

        clearTimeout(timeoutId);

        // Gestion du 401 (Unauthorized) - Redirection ou refresh
        if (response.status === 401 && !skipAuth) {
            // Optionnel : On pourrait déclencher le refresh ici
            // Pour l'instant, on laisse le composant ou la couche middleware gérer
            if (typeof window !== 'undefined' && !url.includes('/auth/refresh-token')) {
                // localStorage.removeItem('access_token');
                // window.location.href = '/login';
            }
        }

        if (!response.ok) {
            await handleResponseError(response);
            throw response;
        }

        // Si la réponse est vide (ex: 204 No Content)
        if (response.status === 204) return null;

        return await response.json();

    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            showToast.error("Timeout", "La requête a mis trop de temps à répondre.");
        } else if (!(error instanceof Response)) {
            console.error('API Proxy Error:', error);
            // showToast.error("Erreur Réseau", "Veuillez vérifier votre connexion internet.");
        }

        throw error;
    }
};

/**
 * Raccourcis pour les méthodes HTTP
 */
export const api = {
    get: (url: string, options?: RequestOptions) => proxy(url, { ...options, method: 'GET' }),
    post: (url: string, data?: any, options?: RequestOptions) => proxy(url, {
        ...options,
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' }
    }),
    put: (url: string, data?: any, options?: RequestOptions) => proxy(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    patch: (url: string, data?: any, options?: RequestOptions) => proxy(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    delete: (url: string, options?: RequestOptions) => proxy(url, { ...options, method: 'DELETE' }),
};
