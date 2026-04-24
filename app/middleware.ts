'use client'

import { toast } from 'sonner'
import { User, Role, UserData } from '@/types/interfaces'
export type { UserData }
import { refreshTokens } from '@/service/security'

// Stockage du token
export const getTokenFromLocalStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token')
    }
    return null
}

export const setTokenToLocalStorage = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token)
    }
}

// Stockage des données utilisateur
export const getUserDataFromLocalStorage = (): UserData | null => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user_data')
        return userData ? JSON.parse(userData) : null
    }
    return null
}

export const setUserDataToLocalStorage = (userData: UserData): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(userData))
    }
}

// Variable pour éviter les appels multiples simultanés
let isRefreshing = false
let refreshPromise: Promise<UserData | null> | null = null

// Rafraîchir le token et récupérer les données utilisateur
const validateTokenWithRefresh = async (): Promise<UserData | null> => {
    // Si un refresh est déjà en cours, retourner la promesse existante
    if (isRefreshing && refreshPromise) {
        console.log('⏳ Refresh déjà en cours, attente...')
        return refreshPromise
    }

    isRefreshing = true

    refreshPromise = (async () => {
        try {
            const token = getTokenFromLocalStorage()
            console.log('🔄 Tentative de refresh token:', token ? `${token.substring(0, 20)}...` : 'Aucun')

            if (!token) {
                console.warn('⚠️ Aucun token à rafraîchir')
                return null
            }

            const response = await refreshTokens(token)
            console.log('📡 Réponse refresh:', response)

            if (response.statusCode === 200 && response.data) {
                console.log('✅ Token rafraîchi avec succès')

                // Sauvegarder le nouveau token
                setTokenToLocalStorage(response.data.token)

                // Construire l'objet UserData
                const userData: UserData = {
                    id: response.data.user.id,
                    name: response.data.user.name ?? '',
                    email: response.data.user.email,
                    roles: response.data.user.is_admin,
                    status: response.data.user.status,
                    stores: response.data.user.stores || []
                }

                // Sauvegarder les données utilisateur
                setUserDataToLocalStorage(userData)

                console.log('✅ Données utilisateur sauvegardées:', {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    storesCount: userData.stores.length
                })

                return userData
            } else {
                console.error('❌ Erreur refresh token:', response.message)
                return null
            }
        } catch (error) {
            console.error('❌ Erreur lors du refresh:', error)
            return null
        } finally {
            isRefreshing = false
            refreshPromise = null
        }
    })()

    return refreshPromise
}

// Middleware d'authentification
export const useAuthMiddleware = async (): Promise<UserData | null> => {
    const token = getTokenFromLocalStorage()
    console.log('🔐 Token récupéré:', token ? `${token.substring(0, 20)}...` : 'Aucun token')

    if (!token) {
        console.warn('⚠️ Aucun token trouvé, déconnexion')
        logout()
        return null
    }

    // Vérifier si on a déjà les données utilisateur en cache
    let userData = getUserDataFromLocalStorage()
    console.log('💾 Données en cache:', userData ? `${userData.name} (${userData.email})` : 'Non trouvées')

    // Si pas de cache, rafraîchir le token et récupérer les données
    if (!userData) {
        console.log('🔄 Pas de cache, refresh du token...')
        userData = await validateTokenWithRefresh()

        if (!userData) {
            console.error('❌ Refresh échoué, déconnexion')
            logout()
            return null
        }

        console.log('✅ Token validé via refresh')
    }

    return userData
}

// Obtenir les informations utilisateur
export const getUserInfos = async (): Promise<{
    id: number
    roles: Role
    status: number
    name: string
    email: string
    stores: any[]
} | null> => {
    console.log('📋 Récupération des infos utilisateur...')
    const user = await useAuthMiddleware()

    if (!user) {
        console.warn('⚠️ Aucun utilisateur trouvé')
        return null
    }

    console.log('✅ Infos utilisateur:', {
        id: user.id,
        name: user.name,
        email: user.email,
        storesCount: user.stores?.length || 0
    })

    return {
        id: user.id,
        roles: user.roles,
        status: user.status,
        name: user.name,
        email: user.email,
        stores: user.stores || []
    }
}

// Vérifier si l'utilisateur est authentifié
export const isUserAuthenticated = async (): Promise<boolean> => {
    const token = getTokenFromLocalStorage()
    if (!token) {
        console.log('❌ Pas de token, non authentifié')
        return false
    }

    const userData = await validateTokenWithRefresh()
    if (userData) {
        console.log('✅ Utilisateur authentifié')
        return true
    }

    console.log('❌ Token invalide, non authentifié')
    return false
}

// Déconnexion
export const logout = (): void => {
    if (typeof window === 'undefined') return

    console.log('🚪 Déconnexion en cours...')
    const token = getTokenFromLocalStorage()

    // Appel optionnel pour révoquer le token côté serveur
    if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).catch(err => console.error('Erreur logout:', err))
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
    console.log('✅ Déconnexion effectuée')
    window.location.href = '/auth/login'
}

// Obtenir l'ID d'un store
export const getStoreId = async (position: number = 1): Promise<number | null> => {
    const user = await useAuthMiddleware()
    if (!user || !user.stores || user.stores.length === 0) return null

    const index = position - 1
    if (index < 0 || index >= user.stores.length) return null

    return user.stores[index].id ?? null
}

// Helper pour les requêtes API authentifiées
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getTokenFromLocalStorage()

    if (!token) {
        console.error('❌ Aucun token pour fetchWithAuth')
        logout()
        throw new Error('Non authentifié')
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
    }

    console.log('🌐 Requête API:', url)

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    })

    // Si 401, tenter un refresh du token
    if (response.status === 401) {
        console.warn('⚠️ Token expiré (401), tentative de refresh...')

        const userData = await validateTokenWithRefresh()

        if (!userData) {
            console.error('❌ Refresh échoué, déconnexion')
            logout()
            throw new Error('Token invalide')
        }

        // Refaire la requête avec le nouveau token
        console.log('🔄 Nouvelle tentative avec token rafraîchi')
        const newToken = getTokenFromLocalStorage()
        const newHeaders = {
            ...headers,
            'Authorization': `Bearer ${newToken}`,
        }

        return fetch(url, {
            ...options,
            headers: newHeaders,
            credentials: 'include'
        })
    }

    return response
}