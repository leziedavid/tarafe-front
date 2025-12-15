"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Realisation } from "@/types/interfaces";
import FullPageLoader from "../spinner/FullPageLoader";
import { getImagesUrl } from "@/types/baseUrl";
import { useRouter } from "next/navigation";

interface ProductListProps {
    products: Realisation[];
}

const ProductList = ({ products }: ProductListProps) => {

    const [filteredProducts, setFilteredProducts] = useState<Realisation[]>([]);
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const urlImages = getImagesUrl();
    const router = useRouter();

    const navigateTo = (path: string) => {
        const libelleModified = path.replace(/ /g, '-');
        router.push('/product/' + libelleModified);
    };

    useEffect(() => {
        setFilteredProducts(products);

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
        <section className="max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
                    NOUVEAUTÉS
                </h2>
                <Link href="/realisations" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Voir plus
                </Link>
            </div>

            {/* Loader */}
            {loading && (
                <div className="flex justify-center items-center h-60">
                    <FullPageLoader status="Chargement des nouveautés" />
                </div>
            )}

            {/* Aucun résultat + image */}
            {!loading && noData && (
                <div className="flex flex-col justify-center items-center h-60 text-center">
                    <Image src="/images/empty_1.svg" alt="Aucune donnée"  width={180}  height={180}  className="opacity-80"  />
                    <p className="mt-4 text-gray-500 text-lg">Aucune donnée disponible.</p>
                </div>
            )}

            {/* Grille des produits */}
            {!loading && !noData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-300 animate-fadeIn">
                    {filteredProducts.map((product) => (
                        <div key={product.id_realisations} onClick={() => navigateTo(product.libelle_realisations)}  className="flex flex-col transform hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-md">
                                <Image src={`${urlImages}/${product.images_realisations}`} alt={product.libelle_realisations} fill className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" unoptimized />
                            </div>
                            <div className="mt-4 flex flex-col bg-gray-100 min-h-[60px] h-16 p-2 rounded-md">
                                <h3  className="text-sm sm:text-lg font-medium text-black hover:text-[#fd980e] transition-colors duration-200 cursor-pointer">
                                    {product.libelle_realisations || " "} {/* espace insécable si vide */}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProductList;
