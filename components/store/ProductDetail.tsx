// components/ProductDetail.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/interfaces';
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useCart } from '@/components/providers/CartProvider';


interface ProductDetailProps {
    product?: Product | null;
    onBack?: () => void;
    onNegotiate?: (product: Product) => void;
    onOrder?: (product: Product) => void;
    imageBaseUrl?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onNegotiate, onOrder, imageBaseUrl = '' }) => {
    // États pour le slider d'images
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { addToCart } = useCart();

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
                                    <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                </button>

                                {/* Message d'erreur */}
                                <div className="text-center py-12">
                                    <Icon icon="solar:info-circle-bold" className="text-slate-400 mx-auto w-12 h-12" />
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
                    <Icon
                        key={i}
                        icon="solar:star-bold"
                        className={`w-5 h-5 ${i < Math.floor(numericRating)
                            ? 'text-amber-500'
                            : 'text-slate-300 dark:text-slate-600'
                            }`}
                    />
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
                            <button type="button" onClick={onBack} className="p-2 -ml-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" >
                                <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>

                            {/* Section Image avec Slider */}
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {currentImage ? (
                                    <>
                                        <img src={`${imageBaseUrl}/${currentImage.path}`} alt={`${product.name} - Image ${currentImageIndex + 1}`} className="w-full h-full object-cover cursor-pointer" onClick={() => setIsFullscreen(true)} />

                                        {/* Bouton plein écran */}
                                        <button type="button" onClick={() => setIsFullscreen(true)} className="absolute top-4 right-4 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition-colors z-20"  >
                                            <Icon icon="solar:full-screen-bold" className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                        </button>

                                        {/* Contrôles du slider (si plus d'une image) */}
                                        {totalImages > 1 && (
                                            <>
                                                {/* Bouton précédent */}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition-colors z-20" >
                                                    <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                                </button>

                                                {/* Bouton suivant */}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 p-2 rounded-full transition-colors z-20" >
                                                    <Icon icon="solar:alt-arrow-right-bold" className="w-5 h-5 text-slate-700 dark:text-slate-300" />
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
                                        <Icon icon="solar:gallery-bold" className="w-20 h-20 text-slate-400" />
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
                                        <Icon icon="solar:delivery-bold" className="w-4 h-4" />
                                        🚚 Livraison disponible
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Icon icon="solar:shield-check-bold" className="w-4 h-4" />
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
                                    <button onClick={() => onNegotiate?.(product)} disabled={!isAvailable} className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 border bg-white dark:bg-slate-800 shadow-none hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 h-12 px-4 flex-1 py-6 rounded-2xl text-base font-medium border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed" type="button"  >
                                        Négocier
                                    </button>
                                    <button onClick={() => addToCart(product, 1)} disabled={!isAvailable || product.stock <= 0} className={`inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 shadow-none h-12 px-4 flex-[2] py-6 rounded-2xl text-base font-medium ${!isAvailable || product.stock <= 0 ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-blue-900 hover:bg-slate-800 dark:hover:bg-blue-800 text-white dark:text-slate-50'}`} type="button"  >
                                        {!isAvailable ? 'Indisponible' : product.stock <= 0 ? 'Rupture de stock' : 'Commander →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal plein écran */}
            {isFullscreen && currentImage && (
                <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4" onClick={() => setIsFullscreen(false)}  >
                    <div className="relative w-full max-w-4xl max-h-[90vh]">
                        <Image src={`${imageBaseUrl}/${currentImage.path}`} alt={`${product.name} - Plein écran`} width={1200} height={800} priority className="w-full h-full object-contain max-h-[80vh]" unoptimized />
                        {/* Contrôles du slider en plein écran */}
                        {totalImages > 1 && (
                            <>
                                <button type="button" onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"  >
                                    <Icon icon="solar:alt-arrow-left-bold" className="w-6 h-6 text-white" />
                                </button>

                                <button type="button" onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-colors"  >
                                    <Icon icon="solar:alt-arrow-right-bold" className="w-6 h-6 text-white" />
                                </button>

                                {/* Compteur d'images plein écran */}
                                <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded">
                                    {currentImageIndex + 1}/{totalImages}
                                </div>

                                {/* Miniatures en bas */}
                                <div className="absolute bottom-4 left-0 right-0">
                                    <div className="flex justify-center gap-2 overflow-x-auto px-4">
                                        {allImages.map((image, index) => (
                                            <button key={image.id || index} type="button" onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-blue-500' : 'border-transparent hover:border-white'}`}  >
                                                <Image src={`${imageBaseUrl}/${image.path}`} alt={`Miniature ${index + 1}`} fill className="object-cover" unoptimized />
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
                            <Icon icon="solar:close-square-bold" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;