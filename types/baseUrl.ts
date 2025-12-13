
// On récupère la variable d'environnement ou on met une valeur par défaut
// const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'http://localhost:8080/api/v1';
const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'https://ms.cloud.tarafe.com/api/v1';
const IMAGES_SERVEUR_URL = process.env.IMAGES_SERVEUR_URL || 'https://ms.cloud.tarafe.com';

export const getBaseUrl = (): string => {
    return BASE_URL;
};

export const getImagesUrl = (): string => {
    return IMAGES_SERVEUR_URL;
};
