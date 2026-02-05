"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Realisation } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { useRouter } from "next/navigation";

interface ProductListProps {
    product: Realisation[];
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
// Data
// =============================

const categories = [
    "All",
    "Best Seller",
    "Pick a Mood",
    "Trending",
    "New In",
    "Accessories",
];

// =============================
// Components
// =============================

const CollectionsSection: React.FC<ProductListProps> = ({ product }) => {
    const [products, setProducts] = React.useState<Realisation[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (product && product.length > 0) {
            setProducts(assignProductSizes(product));
        }
        const timer = setTimeout(() => setLoading(false), 800); // simule un loader
        return () => clearTimeout(timer);
    }, [product]);

    // Skeletons pour les produits (mobile + web)
    const renderProductSkeleton = (large?: boolean, key?: number) => (
        <div key={key} className={`relative overflow-hidden rounded-3xl animate-pulse bg-gray-200 ${large ? "h-[250px] sm:h-[300px] lg:h-[520px]" : "h-[250px] sm:h-[300px] lg:h-[250px]"}`} />
    );

    // // Skeletons pour les catégories
    // const renderCategorySkeleton = (key: number) => (
    //     <div
    //         key={key}
    //         className="h-8 w-24 rounded-full bg-gray-200 animate-pulse"
    //     />
    // );

    const smallProducts = products.filter((p) => p.size === "small");
    const largeProducts = products.filter((p) => p.size === "large");

    return (
        <section className="max-w-7xl mx-auto px-16 py-20">

            {/* Header */}
            <div className="grid lg:grid-cols-2 gap-10 mb-14">
                <h2 className="text-5xl font-extrabold leading-tight">
                    NOS <br />
                    <span className="inline-block bg-black text-white px-4 py-0 rounded-xl">
                        NOUVEAUTES
                    </span>
                </h2>
            </div>

            {/* Categories */}
            {/* <div className="flex flex-wrap gap-3 mb-12">
                {loading ? categories.map((_, i) => renderCategorySkeleton(i)) : categories.map((cat, i) => (
                    <button key={cat} className={`px-5 py-2 rounded-full border text-sm transition ${i === 0 ? "bg-black text-white" : "border-gray-300 hover:bg-black hover:text-white"}`} >
                        {cat}
                    </button>
                ))}
            </div> */}

            {/* Products grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Colonne gauche : petites cards */}
                <div className="contents lg:flex lg:flex-col lg:gap-6 lg:col-span-1">
                    {loading ? Array(4).fill(0).map((_, i) => renderProductSkeleton(false, i)) : smallProducts.map((product) => (
                        <ProductCard key={product.id_realisations} product={product} />
                    ))}
                </div>

                {/* Colonne droite : 2 images verticales */}
                <div className="contents lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-6">
                    {loading ? Array(4).fill(0).map((_, i) => renderProductSkeleton(true, i)) : largeProducts.map((product) => (
                        <ProductCard key={product.id_realisations} product={product} large />
                    ))}
                </div>
            </div>

        </section>
    );
};

// =============================
// Product Card
// =============================

function ProductCard({ product, large = false, loading = false }: ProductCardProps) {
    const router = useRouter();
    const urlImages = getImagesUrl();

    const navigateTo = () => {
        const path = product?.libelle_realisations?.replace(/ /g, "-") || "";
        router.push("/product/" + path);
    };

    if (loading || !product) {
        return (<div className={`relative overflow-hidden rounded-3xl animate-pulse bg-gray-200 ${large ? "h-[250px] sm:h-[300px] lg:h-[520px]" : "h-[250px] sm:h-[300px] lg:h-[250px]"}`} />);
    }

    const cardHeight = large ? "h-[250px] sm:h-[300px] lg:h-[520px]" : "h-[250px] sm:h-[300px] lg:h-[250px]";

    return (
        <div className={`relative overflow-hidden rounded-3xl group ${cardHeight}`} onClick={navigateTo}>
            <Image src={`${urlImages}/${product.images_realisations}`} alt={product.libelle_realisations || "Produit"} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized onClick={navigateTo} />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-md font-bold max-w-xs leading-snug">{product.libelle_realisations}</p>
                <div className="flex items-center justify-between mt-3">
                    <button onClick={navigateTo} className="flex items-center gap-1 sm:gap-2 bg-white text-black px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#fd980e] hover:text-white transition">
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
