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
                    <Image src="/images/empty_1.svg" alt="Aucune donnée" width={180} height={180} className="opacity-80" />
                    <p className="mt-4 text-gray-500 text-lg">Aucune donnée disponible.</p>
                </div>
            )}


            {/* Grid (réalisations responsive) */}
            {!loading && !noData && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
                    {filteredProducts.map((product) => (
                        <div key={product.id_realisations} className="group">
                            <div className="relative rounded-3xl bg-[#efefec] overflow-hidden">
                                {/* Image */}
                                <div
                                    className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-center bg-cover rounded-3xl"
                                    style={{ backgroundImage: `url(${urlImages}/${product.images_realisations})` }}
                                />

                                {/* Overlay bouton Voir plus */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => navigateTo(product.libelle_realisations)}
                                        className="bg-[#c08457] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold"
                                    >
                                        Voir plus
                                    </button>
                                </div>
                            </div>

                            {/* Card info */}
                            <div className="mt-2 sm:mt-3 px-1 sm:px-2">
                                <h3 className="font-semibold text-sm sm:text-base">
                                    {product.libelle_realisations || "\u00A0"} {/* espace insécable si vide */}
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
