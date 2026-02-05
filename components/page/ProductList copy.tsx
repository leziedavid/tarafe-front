"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Realisation } from "@/types/interfaces";
import FullPageLoader from "../spinner/FullPageLoader";
import { getImagesUrl } from "@/types/baseUrl";
import { useRouter } from "next/navigation";

// Interface pour les images
interface ImageRealisation {
    id_img_realisations: number;
    realisations_id: number;
    codeId: string;
    filles_img_realisations: string;
    one_img_realisations: string | null;
    created_at: string;
    updated_at: string | null;
}

// Étendre l'interface Realisation pour inclure les images
interface RealisationWithImages extends Realisation {
    images?: ImageRealisation[];
}

interface ProductListProps {
    products: Realisation[];
}

const ProductList = ({ products }: ProductListProps) => {
    const [filteredProducts, setFilteredProducts] = useState<RealisationWithImages[]>([]);
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});

    const urlImages = getImagesUrl();
    const router = useRouter();

    const navigateTo = (path: string) => {
        const libelleModified = path.replace(/ /g, '-');
        router.push('/product/' + libelleModified);
    };

    // === Fonctions pour la slide d'images ===
    const nextImage = (e: React.MouseEvent, realisationId: string) => {
        e.stopPropagation();
        const realisation = filteredProducts.find(r => r.id_realisations === realisationId);
        if (!realisation || !realisation.images || realisation.images.length <= 1) return;

        const currentIndex = activeImageIndex[realisationId] || 0;
        const nextIndex = (currentIndex + 1) % realisation.images.length;
        setActiveImageIndex(prev => ({ ...prev, [realisationId]: nextIndex }));
    };

    const prevImage = (e: React.MouseEvent, realisationId: string) => {
        e.stopPropagation();
        const realisation = filteredProducts.find(r => r.id_realisations === realisationId);
        if (!realisation || !realisation.images || realisation.images.length <= 1) return;

        const currentIndex = activeImageIndex[realisationId] || 0;
        const prevIndex = (currentIndex - 1 + realisation.images.length) % realisation.images.length;
        setActiveImageIndex(prev => ({ ...prev, [realisationId]: prevIndex }));
    };

    // === Fonction pour obtenir l'image active ===
    const getActiveImage = (realisation: RealisationWithImages) => {
        const activeIndex = activeImageIndex[realisation.id_realisations] || 0;
        if (realisation.images && realisation.images.length > 0) {
            return realisation.images[activeIndex];
        }
        // Si pas d'images multiples, utiliser l'image principale
        return {
            filles_img_realisations: realisation.images_realisations,
            id_img_realisations: 0
        };
    };

    useEffect(() => {
        // Transformer les produits pour inclure les images
        const productsWithImages = products.map((product: any) => ({
            ...product,
            images: product.images || []
        })) as RealisationWithImages[];

        setFilteredProducts(productsWithImages);

        if (products.length > 0) {
            setLoading(false);
            setNoData(false);
            return;
        }

        const timer = setTimeout(() => {
            if (products.length === 0) {
                setLoading(false);
                setNoData(true);
            }
        }, 4000);

        return () => clearTimeout(timer);
    }, [products]);

    return (
        <section className="max-w-7xl mx-auto px-6 py-section">

            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-soft-dark">
                    NOUVEAUTÉS
                </h2>
                <Link href="/realisations" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-all duration-300 hover:scale-105">
                    Voir plus
                </Link>
            </div>


            {/* Loader */}
            {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 px-2 sm:px-0 mb-8 animate-fadeIn">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="group">
                            {/* Card image */}
                            <div className="relative rounded-card-lg bg-[#efefec] overflow-hidden">
                                <div className="animate-pulse w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-gray-200 rounded-card-lg" />
                            </div>

                            {/* Titre */}
                            <div className="mt-3 sm:mt-4 px-1 sm:px-2">
                                <div className="animate-pulse h-4 sm:h-5 bg-gray-200 rounded w-3/4" />
                            </div>

                            {/* Miniatures */}
                            <div className="mt-2 flex gap-1 overflow-x-auto px-1">
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <div key={idx} className="animate-pulse w-8 h-8 rounded bg-gray-200 flex-shrink-0" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* Aucun résultat + image */}
            {!loading && noData && (
                <div className="flex flex-col justify-center items-center h-60 text-center">
                    <Image src="/images/empty_1.svg" alt="Aucune donnée" width={180} height={180} className="opacity-80" />
                    <p className="mt-4 text-gray-500 text-lg">Aucune donnée disponible.</p>
                </div>
            )}

            {/* Grid avec slide d'images */}
            {!loading && !noData && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 px-2 sm:px-0 animate-fadeIn">
                    {filteredProducts.map((product) => {
                        const activeImage = getActiveImage(product);
                        const totalImages = product.images?.length || 0;
                        const currentIndex = activeImageIndex[product.id_realisations] || 0;

                        return (
                            <div key={product.id_realisations} className="group">
                                <div className="relative rounded-xl bg-[#efefec] overflow-hidden transition-all duration-300">
                                    {/* Image avec slider */}
                                    <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-center bg-cover rounded-xl" style={{ backgroundImage: `url(${urlImages}/${activeImage.filles_img_realisations})`, transition: 'background-image 0.3s ease' }}>

                                        {/* Boutons de navigation du slider */}
                                        {totalImages > 1 && (
                                            <>
                                                <button onClick={(e) => prevImage(e, product.id_realisations)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-all z-20"  >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button onClick={(e) => nextImage(e, product.id_realisations)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-all z-20">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>

                                                {/* Compteur d'images */}
                                                {totalImages > 1 && (
                                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
                                                        {currentIndex + 1}/{totalImages}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Overlay bouton Voir plus */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <button onClick={() => navigateTo(product.libelle_realisations)} className="bg-[#c08457] text-white px-6 py-3 rounded-pill text-xs sm:text-sm font-semibold hover:bg-[#a96f46] hover:scale-105 transition-all duration-300 shadow-lg">
                                            Voir plus
                                        </button>
                                    </div>
                                </div>

                                {/* Card info */}
                                <div className="mt-2 sm:mt-3 px-1 sm:px-2">
                                    <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                                        {product.libelle_realisations || "\u00A0"}
                                    </h3>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

        </section>
    );
};

export default ProductList;