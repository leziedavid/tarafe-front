"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Footer from "@/components/page/Footer";
import { Spinner } from "../spinner/Loader";
import { OptionRealisation, Realisation, Reglage } from "@/types/interfaces";
import { getAllRealisationsByFilter } from "@/service/realisationServices";
import FullPageLoader from "../spinner/FullPageLoader";
import { getImagesUrl } from "@/types/baseUrl";

interface Product {
    id: number;
    name: string;
    price: number;
    colors: string;
    image: string;
    categoryId: number; // ID de l'option correspondante
}

const products: Product[] = [
    { id: 1, name: "The Classic Knit Polo", price: 12, colors: "7 Colors", image: "/ads/Tarafe-51069Z.jpg", categoryId: 1 },
    { id: 2, name: "Zip Jacket", price: 16.25, colors: "2 Colors", image: "/ads/Tarafe-45821F.jpg", categoryId: 2 },
    { id: 3, name: "The Utility Jacket", price: 25, colors: "3 Colors", image: "/ads/Tarafe-51069Z.jpg", categoryId: 3 },
    { id: 4, name: "The Suede Jacket", price: 18.75, colors: "7 Colors", image: "/ads/fille-noir.jpg", categoryId: 4 },
    { id: 5, name: "Casual Hoodie", price: 14.5, colors: "5 Colors", image: "/ads/fille-noir.jpg", categoryId: 5 },
    { id: 6, name: "Urban Crewneck", price: 10.99, colors: "3 Colors", image: "/ads/fille-noir.jpg", categoryId: 6 },
    { id: 7, name: "Slim T-Shirt", price: 8.75, colors: "4 Colors", image: "/ads/fille-noir.jpg", categoryId: 7 },
    { id: 8, name: "Elegant Dress", price: 21, colors: "2 Colors", image: "/ads/fille-noir.jpg", categoryId: 3 },
];

export default function AllProduits() {
    const router = useRouter();

    // === Etats ===
    const [activeCategory, setActiveCategory] = useState<number>(0); // 0 = TOUS
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [loading, setLoading] = useState(false);
    const [reglages, setReglages] = useState<Reglage[]>([]);
    const [option, setOption] = useState<OptionRealisation[]>([]);
    const [realisations, setRealisations] = useState<Realisation[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const urlImages = getImagesUrl();

    // === Navigation vers produit ===
    const navigateTo = (path: string) => {
        const libelleModified = path.replace(/ /g, "-");
        router.push("/product/" + libelleModified);
    };

    // === Fetch des données ===
    const fetchData = async () => {
        setLoading(true);
        try {

            const result = await getAllRealisationsByFilter(currentPage, activeCategory);
            if (result.statusCode === 200 && result.data && result.data.realisations.data.length !== 0) {
                setOption(result.data.OptionRealisation);
                setRealisations(result.data.realisations.data);
                setTotalPages(result.data.realisations.last_page);
                setReglages(result.data.reglages);
                setLoading(false);

            } else {
                toast.error(result.message || "Erreur lors du chargement");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Erreur serveur");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setFilteredProducts(products); // initialisation
    }, [currentPage, activeCategory]);

    // === Filtrage ===
    const handleFilter = (categoryId: number) => {
        setActiveCategory(categoryId);
        setLoading(true);

        setTimeout(() => {
            if (categoryId === 0) {
                setFilteredProducts(products);
            } else {
                setFilteredProducts(products.filter((p) => p.categoryId === categoryId));
            }
            setLoading(false);
        }, 500);
    };
    

    if (!realisations || realisations.length === 0) {
        return (
            <div className="flex justify-center items-center h-60">
                <FullPageLoader status="Chargement du produit" />
            </div>
        );
    }

    return (
        <>
            <section className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
                        DÉCOUVRIR NOS CRÉATIONS
                    </h2>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <Spinner />
                    </div>
                ) : (

                    <>

                        {/* Category Filters */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
                            <button onClick={() => handleFilter(0)} className={`px-5 py-2 rounded-full border font-medium text-sm sm:text-base transition-all duration-200 ${activeCategory === 0 ? "bg-[#fd980e] text-white border-[#fd980e] scale-105" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}  >
                                Tous
                            </button>

                            {option.map((category) => (
                                <button key={category.id_option_reaalisation} onClick={() => handleFilter(category.id_option_reaalisation)} className={`px-5 py-2 rounded-full border font-medium text-sm sm:text-base transition-all duration-200 ${activeCategory === category.id_option_reaalisation ? "bg-[#fd980e] text-white border-[#fd980e] scale-105" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`} >
                                    {category.libelleOption_reaalisation}
                                </button>
                            ))}
                        </div>


                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
                            {realisations.map((product) => (
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

                        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-300 animate-fadeIn">
                            {realisations.map((product) => (
                                <div key={product.id_realisations} onClick={() => navigateTo(product.libelle_realisations)} className="flex flex-col transform hover:scale-[1.02] transition-transform cursor-pointer">
                                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-md">
                                        <Image src={`${urlImages}/${product.images_realisations}`} alt={product.libelle_realisations} fill className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" unoptimized />
                                    </div>
                                    <div className="mt-4 flex flex-col bg-gray-100 min-h-[60px] h-16 p-2 rounded-md">
                                        <h3 className="text-sm sm:text-lg font-medium text-black hover:text-[#fd980e] transition-colors duration-200 cursor-pointer">
                                            {product.libelle_realisations || " "}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div> */}

                    </>

                )}

            </section>


            {/* Footer */}
            <Footer reglages={reglages} />

        </>
    );
}
