
// On récupère la variable d'environnement ou on met une valeur par défaut
// const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'http://127.0.0.1:8000/api/v1';
// const IMAGES_SERVEURURL = process.env.IMAGES_SERVEUR_URL || 'http://127.0.0.1:8000';

const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'https://security.tarafe.com/api/v1';
const IMAGES_SERVEURURL = process.env.IMAGES_SERVEUR_URL || 'https://security.tarafe.com';

const BASE_URL_SITE_PROD ='https://security.tarafe.com/catalogue';
const BASE_URL_SITE ='https://tarafe.com/catalogue';

export const getBaseUrl = (): string => {
    return BASE_URL;
};

export const getImagesUrl = (): string => {
    return IMAGES_SERVEURURL;
};
