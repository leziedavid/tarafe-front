"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Realisation } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProductListProps {
    product: Realisation[];
    isLabel?: boolean;
}

interface ProductCardProps {
    product?: Realisation;
    large?: boolean;
    loading?: boolean;
}

// =============================
// Helpers
// =============================

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function assignProductSizes(products: Realisation[]): Realisation[] {
    const shuffled = shuffleArray(products);
    return shuffled.map((product, index) => {
        const mod = index % 4;
        const size = mod < 2 ? "small" : "large";
        return { ...product, size };
    });
}

// =============================
// Animation Variants
// =============================

const headerVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

// =============================
// Skeleton
// =============================

function CardSkeleton({ large = false, mobile = false }: { large?: boolean; mobile?: boolean }) {
    const height = mobile
        ? "h-[250px] sm:h-[300px]"
        : large
            ? "h-[300px] md:h-[400px] lg:h-[520px]"
            : "h-[300px] md:h-[400px] lg:h-[250px]";

    return (
        <div className={`relative overflow-hidden rounded-2xl lg:rounded-3xl bg-muted ${height}`}>
            <div className="absolute inset-0 -translate-x-full animate-[skeleton-shimmer_1.8s_infinite]
                bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
    );
}

// =============================
// Main Section
// =============================

const CollectionsSection: React.FC<ProductListProps> = ({ product, isLabel = false }) => {
    const [products, setProducts] = React.useState<Realisation[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (product && product.length > 0) {
            setProducts(assignProductSizes(product));
            setLoading(false);
        }
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, [product]);

    const smallProducts = products.filter((p) => p.size === "small");
    const largeProducts = products.filter((p) => p.size === "large");

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-10 md:py-14 lg:py-5">

            {/* Header */}
            {isLabel && (
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mb-8 sm:mb-10 md:mb-12"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-px bg-brand-primary" />
                        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">Portfolio</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-brand-secondary dark:text-white leading-tight mb-4">
                        NOS PRODUITS
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
                        Découvrez nos produits, conçus pour répondre à vos besoins et dépasser vos attentes.
                        Chaque produit est le fruit d'une recherche approfondie et d'une innovation constante, garantissant performance et fiabilité.
                    </p>
                </motion.div>
            )}

            {/* Mobile : 2 colonnes */}
            <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {loading
                        ? Array(4).fill(0).map((_, i) => (
                            <CardSkeleton key={i} mobile />
                        ))
                        : products.map((p, i) => (
                            <motion.div
                                key={p.id_realisations}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                            >
                                <MobileProductCard product={p} />
                            </motion.div>
                        ))}
                </div>
            </div>

            {/* Desktop : layout petites / grandes */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">

                {/* Colonne gauche : petites cards */}
                <div className="flex flex-col gap-6">
                    {loading
                        ? Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
                        : smallProducts.map((p, i) => (
                            <motion.div
                                key={p.id_realisations}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                            >
                                <DesktopProductCard product={p} />
                            </motion.div>
                        ))}
                </div>

                {/* Colonne droite : grandes cards */}
                <div className="grid grid-cols-2 col-span-2 gap-6">
                    {loading
                        ? Array(4).fill(0).map((_, i) => <CardSkeleton key={i} large />)
                        : largeProducts.map((p, i) => (
                            <motion.div
                                key={p.id_realisations}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                            >
                                <DesktopProductCard product={p} large />
                            </motion.div>
                        ))}
                </div>
            </div>
        </section>
    );
};

// =============================
// Mobile Product Card
// =============================

function MobileProductCard({ product }: { product: Realisation }) {
    const router = useRouter();
    const urlImages = getImagesUrl();

    const navigateTo = () => {
        const path = product?.libelle_realisations?.replace(/ /g, "-") || "";
        router.push("/product/" + path);
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-[250px] sm:h-[300px]" onClick={navigateTo} >
            {/* Image */}
            <Image src={`${urlImages}/${product.images_realisations}`} alt={product.libelle_realisations || "Produit"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 33vw" unoptimized />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            {/* Hover tint */}
            <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-xs font-bold text-white line-clamp-2 leading-snug mb-1.5">
                    {product.libelle_realisations}
                </p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[9px] text-white/70 font-semibold uppercase tracking-widest">Voir</span>
                    <Icon icon="solar:alt-arrow-right-bold" className="text-brand-primary w-3 h-3" />
                </div>
            </div>
        </div>
    );
}

// =============================
// Desktop Product Card
// =============================

function DesktopProductCard({ product, large = false }: ProductCardProps) {
    const router = useRouter();
    const urlImages = getImagesUrl();

    const navigateTo = () => {
        const path = product?.libelle_realisations?.replace(/ /g, "-") || "";
        router.push("/product/" + path);
    };

    if (!product) {
        return <CardSkeleton large={large} />;
    }

    const cardHeight = large ? "h-[520px]" : "h-[250px]";

    return (
        <div className={`relative overflow-hidden rounded-3xl group ${cardHeight} cursor-pointer`} onClick={navigateTo}  >
            {/* Image */}
            <Image src={`${urlImages}/${product.images_realisations}`} alt={product.libelle_realisations || "Produit"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 33vw"} />

            {/* Base gradient – always visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Hover brand tint – subtle */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content panel */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">

                {/* Tag – slides in on hover */}
                <div className="mb-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-75">
                    <span className="inline-flex items-center gap-1 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-brand-primary/30">
                        <Icon icon="solar:palette-bold" width={9} />
                        Produit réalisé
                    </span>
                </div>

                {/* Title */}
                <p className="font-bold text-white text-sm md:text-base leading-snug line-clamp-2 transition-all duration-300 group-hover:mb-3">
                    {product.libelle_realisations}
                </p>

                {/* CTA – height animates on hover */}
                <div className="overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-400 delay-100">
                    <div className="flex items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1.5 bg-white/95 text-black px-4 py-2 rounded-full text-[11px] font-bold hover:bg-brand-primary hover:text-white transition-colors shadow-lg">
                            Voir le produit
                            <Icon icon="solar:alt-arrow-right-bold" width={11} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollectionsSection;
