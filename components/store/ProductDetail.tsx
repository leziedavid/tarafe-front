// components/ProductDetail.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/interfaces';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from "next/image";
import { useCart } from '@/app/context/CartProvider';


interface ProductDetailProps {
    product?: Product | null;
    onBack?: () => void;
    onNegotiate?: (product: Product) => void;
    onOrder?: (product: Product) => void;
    imageBaseUrl?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({  product,  onBack, onNegotiate,  onOrder,  imageBaseUrl = '' }) => {
    // États pour le slider d'images
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { updateCart } = useCart();
    
    // Si pas de produit, afficher un état de chargement ou message d'erreur
    if (!product) {
        return (
            <div className="overflow-y-auto pt-8 pb-24 bg-white dark:bg-slate-900 min-h-screen">
                <div className="mx-auto max-w-md border-0">
                    <div className="p-6 pt-0">
                        <div className="pt-2">
                            <div className="pb-28">
                                {/* Bouton retour */}
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="p-2 -ml-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-left w-5 h-5 text-slate-600 dark:text-slate-400"
                                    >
                                        <path d="m12 19-7-7 7-7"></path>
                                        <path d="M19 12H5"></path>
                                    </svg>
                                </button>

                                {/* Message d'erreur */}
                                <div className="text-center py-12">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-slate-400 mx-auto"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                                        Produit non trouvé
                                    </h2>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Le produit que vous recherchez n'existe pas ou a été supprimé.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Fonction pour formater le prix
    const formatPrice = (price: string) => {
        const numericPrice = parseFloat(price);
        return isNaN(numericPrice) ? price : numericPrice.toLocaleString('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).replace(/\s/g, '\u202F');
    };

    // Fonction pour afficher les étoiles de notation
    const renderStars = (rating: string) => {
        const numericRating = parseFloat(rating) || 0;
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(numericRating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-600'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    {numericRating.toFixed(1)} ({product.review_count} avis)
                </span>
            </div>
        );
    };

    // Fonction pour déterminer le statut du stock
    const getStockStatus = () => {
        if (product.stock <= 0) {
            return {
                text: 'Rupture de stock',
                className: 'bg-red-100 text-red-700'
            };
        } else if (product.stock < 10) {
            return {
                text: `Plus que ${product.stock} disponible${product.stock > 1 ? 's' : ''}`,
                className: 'bg-amber-100 text-amber-700'
            };
        } else {
            return {
                text: '✓ En stock',
                className: 'bg-green-100 text-green-700'
            };
        }
    };

    // Fonction pour obtenir le texte du tag
    const getTagText = () => {
        switch (product.tag) {
            case 'NEW ARRIVAL':
                return 'Nouveauté';
            case 'GET OFF 20%':
                return '-20%';
            case 'BEST SELLER':
                return 'Best-seller';
            case 'LIMITED':
                return 'Édition limitée';
            default:
                return null;
        }
    };

    // Fonctions pour le slider d'images
    const nextImage = () => {
        const totalImages = Math.max(1, product.images?.length || 0);
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = () => {
        const totalImages = Math.max(1, product.images?.length || 0);
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    // Obtenir toutes les images (image principale + images de la galerie)
    const getAllImages = () => {
        const images = [];

        // Ajouter l'image principale
        if (product.image) {
            images.push({
                id: 0,
                path: product.image,
                is_main: 1,
                product_id: product.id,
                created_at: product.created_at,
                updated_at: product.updated_at
            });
        }

        // Ajouter les images de la galerie
        if (product.images && product.images.length > 0) {
            images.push(...product.images);
        }

        return images;
    };

    const allImages = getAllImages();
    const totalImages = allImages.length;
    const currentImage = allImages[currentImageIndex] || null;

    const stockStatus = getStockStatus();
    const tagText = getTagText();
    const isFeatured = product.featured === 1;
    const isAvailable = product.available > 0 && product.stock > 0;

    // Gérer le clavier pour la navigation des images
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFullscreen) {
                if (e.key === 'Escape') {
                    setIsFullscreen(false);
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                } else if (e.key === 'ArrowRight') {
                    nextImage();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    return (
        <div className="overflow-y-auto pt-8 pb-24 bg-white dark:bg-slate-900 min-h-screen">

            <div className="mx-auto max-w-md border-0">
                <div className="p-6 pt-0">
                    <div className="pt-2">
                        <div className="pb-28">
                            {/* Bouton retour */}
                            <button   type="button"   onClick={onBack}  className="p-2 -ml-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-arrow-left w-5 h-5 text-slate-600 dark:text-slate-400" >
                                    <path d="m12 19-7-7 7-7"></path>
                                    <path d="M19 12H5"></path>
                                </svg>
                            </button>

                            {/* Section Image avec Slider */}
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {currentImage ? (
                                    <>
                                        <img src={`${imageBaseUrl}/${currentImage.path}`}   alt={`${product.name} - Image ${currentImageIndex + 1}`} className="w-full h-full object-cover cursor-pointer"   onClick={() => setIsFullscreen(true)} />

                                        {/* Bouton plein écran */}
                                        <button  type="button" onClick={() => setIsFullscreen(true)}  className="absolute top-4 right-4 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition-colors z-20"  >
                                            <Maximize2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                        </button>

                                        {/* Contrôles du slider (si plus d'une image) */}
                                        {totalImages > 1 && (
                                            <>
                                                {/* Bouton précédent */}
                                                <button  type="button"  onClick={(e) => {e.stopPropagation();  prevImage();}}  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition-colors z-20" >
                                                    <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                                </button>

                                                {/* Bouton suivant */}
                                                <button  type="button" onClick={(e) => {  e.stopPropagation();  nextImage();  }} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition-colors z-20" >
                                                    <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                                </button>

                                                {/* Compteur d'images */}
                                                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
                                                    {currentImageIndex + 1}/{totalImages}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-20 h-20"
                                        >
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                            <circle cx="9" cy="9" r="2"></circle>
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                        </svg>
                                    </div>
                                )}

                                {/* Badge de prix */}
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-20">
                                    <span className="text-base font-bold">
                                        {formatPrice(product.price)} FCFA
                                    </span>
                                    {product.old_price && parseFloat(product.old_price) > parseFloat(product.price) && (
                                        <div className="text-xs opacity-90 line-through mt-1">
                                            {formatPrice(product.old_price)} FCFA
                                        </div>
                                    )}
                                </div>

                                {/* Badge tag */}
                                {tagText && (
                                    <div className="absolute top-16 left-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg z-20">
                                        {tagText}
                                    </div>
                                )}

                                {/* Badge featured */}
                                {isFeatured && (
                                    <div className="absolute top-28 left-4 bg-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg z-20">
                                        En vedette
                                    </div>
                                )}
                            </div>

                            {/* Miniatures des images (carousel horizontal) */}
                            {totalImages > 1 && (
                                <div className="mt-4">
                                    <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                                        {allImages.map((image, index) => (
                                            <button
                                                key={image.id || index}
                                                type="button"
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                                    : 'border-transparent hover:border-slate-300'
                                                    }`}
                                            >
                                                <img
                                                    src={`${imageBaseUrl}/${image.path}`}
                                                    alt={`Miniature ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {image.is_main === 1 && index !== 0 && (
                                                    <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] px-1 rounded">
                                                        P
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Titre du produit */}
                            <div className="mt-6">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {product.name}
                                </h1>

                                {/* Note et avis */}
                                <div className="mt-3">
                                    {renderStars(product.rating)}
                                </div>

                                {/* Référence SKU */}
                                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Référence: {product.sku}
                                </div>

                                {/* Catégorie et sous-catégorie */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {product.category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            {product.category.name}
                                        </span>
                                    )}
                                    {product.sub_category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            {product.sub_category.name}
                                        </span>
                                    )}
                                    {product.store && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                            Magasin: {product.store.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Informations de stock et disponibilité */}
                            <div className="mt-8 space-y-6">
                                {/* Statut du stock et disponibilité */}
                                <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${stockStatus.className}`}>
                                        {stockStatus.text}
                                    </span>
                                    {!isAvailable && (
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                            Non disponible
                                        </span>
                                    )}
                                </div>

                                {/* Livraison et paiement */}
                                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                                    <p className="flex items-center gap-2">
                                        <svg   xmlns="http://www.w3.org/2000/svg"   width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-truck" >
                                            <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                                            <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                                            <circle cx="7" cy="18" r="2" />
                                            <path d="M15 18H9" />
                                            <circle cx="17" cy="18" r="2" />
                                        </svg>
                                        🚚 Livraison disponible
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-shield-check"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                        Paiement sécurisé
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                        Description
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Couleurs disponibles */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                            Couleurs disponibles
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors.map((color: any, index: number) => (
                                                <div key={index} className="flex flex-col items-center">
                                                    <div
                                                        className="w-10 h-10 rounded-full border-2 border-slate-300"
                                                        style={{ backgroundColor: color.value || color.color || color || '#000' }}
                                                    />
                                                    <span className="text-xs mt-1 text-slate-600">
                                                        {color.name || color.label || `Couleur ${index + 1}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tailles disponibles */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                            Tailles disponibles
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map((size: any, index: number) => (
                                                <button
                                                    key={index}
                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
                                                >
                                                    {size.value || size.size || size.name || size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Informations supplémentaires */}
                                <div className="mt-8 space-y-4 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">Stock actuel</p>
                                            <p>{product.stock} unité{product.stock > 1 ? 's' : ''}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">Statut</p>
                                            <p>{isAvailable ? 'Disponible' : 'Indisponible'}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">Ajouté le</p>
                                            <p>{new Date(product.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">Dernière mise à jour</p>
                                            <p>{new Date(product.updated_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons d'action fixés en bas */}
                            <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex gap-3 max-w-md mx-auto">
                                    <button  onClick={() => onNegotiate?.(product)}  disabled={!isAvailable}   className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 border bg-white dark:bg-slate-800 shadow-none hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 h-12 px-4 flex-1 py-6 rounded-2xl text-base font-medium border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"  type="button"  >
                                        Négocier
                                    </button>
                                    <button  onClick={() => updateCart(product, 1)}  disabled={!isAvailable || product.stock <= 0} className={`inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 shadow-none h-12 px-4 flex-[2] py-6 rounded-2xl text-base font-medium ${!isAvailable || product.stock <= 0  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed'  : 'bg-slate-900 dark:bg-blue-900 hover:bg-slate-800 dark:hover:bg-blue-800 text-white dark:text-slate-50'  }`}  type="button"  >
                                        {!isAvailable ? 'Indisponible' :   product.stock <= 0 ? 'Rupture de stock' : 'Commander →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal plein écran */}
            {isFullscreen && currentImage && (
                <div  className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"  onClick={() => setIsFullscreen(false)}  >
                    <div className="relative w-full max-w-4xl max-h-[90vh]">
                        <Image src={`${imageBaseUrl}/${currentImage.path}`} alt={`${product.name} - Plein écran`} width={1200} height={800} priority  className="w-full h-full object-contain max-h-[80vh]" unoptimized/>
                        {/* Contrôles du slider en plein écran */}
                        {totalImages > 1 && (
                            <>
                                <button  type="button"  onClick={(e) => {  e.stopPropagation(); prevImage();  }}  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"  >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>

                                <button  type="button"  onClick={(e) => {  e.stopPropagation();  nextImage();   }}  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"  >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>

                                {/* Compteur d'images plein écran */}
                                <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded">
                                    {currentImageIndex + 1}/{totalImages}
                                </div>

                                {/* Miniatures en bas */}
                                <div className="absolute bottom-4 left-0 right-0">
                                    <div className="flex justify-center gap-2 overflow-x-auto px-4">
                                        {allImages.map((image, index) => (
                                            <button  key={image.id || index}   type="button"  onClick={(e) => {  e.stopPropagation();  setCurrentImageIndex(index); }}  className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === currentImageIndex  ? 'border-blue-500'  : 'border-transparent hover:border-white'  }`}  >
                                                <Image src={`${imageBaseUrl}/${image.path}`}  alt={`Miniature ${index + 1}`} fill className="object-cover" unoptimized />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Bouton fermer plein écran */}
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-5 h-5"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;