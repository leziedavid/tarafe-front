"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Realisation } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { useRouter } from "next/navigation";

interface ProductListProps {
    product: Realisation[];
    isLabel?: boolean;
}

interface ProductCardProps {
    product?: Realisation;
    large?: boolean;
    loading?: boolean; // si true on affiche le skeleton
}

// =============================
// Helpers
// =============================

// Mélange aléatoirement un tableau (Fisher–Yates)
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Assigne dynamiquement les tailles : pattern répétitif 2 small → 2 large
function assignProductSizes(products: Realisation[]): Realisation[] {
    const shuffled = shuffleArray(products);

    return shuffled.map((product, index) => {
        const mod = index % 4;
        const size = mod < 2 ? "small" : "large";
        return { ...product, size };
    });
}

// =============================
// Components
// =============================

const CollectionsSection: React.FC<ProductListProps> = ({ product, isLabel = false }) => {
    const router = useRouter();
    const [products, setProducts] = React.useState<Realisation[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (product && product.length > 0) {
            setProducts(assignProductSizes(product));
            setLoading(false);
        }
        const timer = setTimeout(() => setLoading(false), 800); // simule un loader
        return () => clearTimeout(timer);
    }, [product]);

    // Skeletons pour les produits (mobile + web)
    const renderProductSkeleton = (large?: boolean, key?: number) => (
        <div key={key} className={`relative overflow-hidden rounded-xl animate-pulse bg-gray-200 ${large ? "h-[300px] md:h-[400px] lg:h-[520px]" : "h-[300px] md:h-[400px] lg:h-[250px]"}`} />
    );

    const smallProducts = products.filter((p) => p.size === "small");
    const largeProducts = products.filter((p) => p.size === "large");

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-10 md:py-14 lg:py-5">

            {/* Header */}
            {isLabel && (
                <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-10">
                    <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold leading-tight">
                        NOS <br />
                        <span className="inline-block bg-black text-white px-3 sm:px-4 py-1 rounded-lg md:rounded-xl">
                            NOUVEAUTES
                        </span>
                    </h2>
                </div>
            )}

            {/* Version mobile : TOUS les produits en 2 colonnes avec design réduit */}
            <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {loading ? (
                        // Skeleton pour mobile - affiche 4 squelettes
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="relative overflow-hidden rounded-xl animate-pulse bg-gray-200 h-[250px] sm:h-[300px]" />
                        ))
                    ) : (
                        // Affiche TOUS les produits en mode mobile
                        products.map((product) => (
                            <MobileProductCard key={product.id_realisations} product={product} />
                        ))
                    )}
                </div>
            </div>

            {/* Version desktop : layout original avec petites/grandes images */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
                {/* Colonne gauche : petites cards */}
                <div className="flex flex-col gap-6">
                    {loading ? Array(4).fill(0).map((_, i) => renderProductSkeleton(false, i)) : smallProducts.map((product) => (
                        <DesktopProductCard key={product.id_realisations} product={product} />
                    ))}
                </div>

                {/* Colonne droite : grandes cards */}
                <div className="grid grid-cols-2 col-span-2 gap-6">
                    {loading ? Array(4).fill(0).map((_, i) => renderProductSkeleton(true, i)) : largeProducts.map((product) => (
                        <DesktopProductCard key={product.id_realisations} product={product} large />
                    ))}
                </div>
            </div>

        </section>
    );
};

// =============================
// Mobile Product Card (design réduit, 2 colonnes)
// =============================

function MobileProductCard({ product }: { product: Realisation }) {
    const router = useRouter();
    const urlImages = getImagesUrl();

    const navigateTo = () => {
        const path = product?.libelle_realisations?.replace(/ /g, "-") || "";
        router.push("/product/" + path);
    };

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-[250px] sm:h-[300px]" onClick={navigateTo}>
            {/* Image container - prend 100% de la hauteur */}
            <div className="relative h-full w-full">
                <Image src={`${urlImages}/${product.images_realisations}`} alt={product.libelle_realisations || "Produit"} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw" unoptimized />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />

                {/* Contenu superposé sur l'image */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex flex-col items-start">
                        <p className="text-sm font-bold text-white line-clamp-1 mb-2 bg-black/10 backdrop-blur-sm px-2 py-1 rounded">
                            {product.libelle_realisations}
                        </p>
                        <button onClick={(e) => { e.stopPropagation(); navigateTo(); }}
                            className="flex items-center justify-between w-full max-w-[140px] bg-white text-black px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#fd980e] hover:text-white transition-all shadow-md" >
                            <span>Details</span>
                            <span className="bg-[#fd980e] text-white rounded-full p-1">
                                <ArrowRight size={10} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================
// Desktop Product Card (design original)
// =============================

function DesktopProductCard({ product, large = false, loading = false }: ProductCardProps) {
    const router = useRouter();
    const urlImages = getImagesUrl();

    const navigateTo = () => {
        const path = product?.libelle_realisations?.replace(/ /g, "-") || "";
        router.push("/product/" + path);
    };

    if (loading || !product) {
        return (<div className={`relative overflow-hidden rounded-3xl animate-pulse bg-gray-200 ${large ? "h-[520px]" : "h-[250px]"}`} />);
    }

    const cardHeight = large ? "h-[520px]" : "h-[250px]";

    return (
        <div className={`relative overflow-hidden rounded-3xl group ${cardHeight} cursor-pointer`} onClick={navigateTo}>
            <Image
                src={`${urlImages}/${product.images_realisations}`}
                alt={product.libelle_realisations || "Produit"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
                sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 33vw"}
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-md font-bold max-w-xs leading-snug">{product.libelle_realisations}</p>
                <div className="flex items-center justify-between mt-3">
                    <button onClick={navigateTo} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#fd980e] hover:text-white transition">
                        Details
                        <span className="bg-[#fd980e] text-white rounded-full p-1">
                            <ArrowRight size={14} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CollectionsSection;