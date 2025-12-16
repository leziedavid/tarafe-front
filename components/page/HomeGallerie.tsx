"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Spinner } from "../spinner/Loader";
import FullPageLoader from "../spinner/FullPageLoader";
import { GallerieImage, GalleryCategory, Reglage } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { getAllCategoriesGallery, getAllImagesGallery } from "@/service/galleryServices";
import { Filters } from "@/types/Filters";
import { toast } from "sonner";
import Footer from "./Footer";

interface Product {
    id: number;
    name: string;
    price: number;
    colors: string;
    image: string;
    category: string;
}

const products: Product[] = [
    {
        id: 1,
        name: "The Classic Knit Polo",
        price: 12.0,
        colors: "7 Colors available",
        image: "/ads/Tarafe-51069Z.jpg",
        category: "MEN'S",
    },
    {
        id: 2,
        name: "Zip Jacket",
        price: 16.25,
        colors: "2 Colors available",
        image: "/ads/Tarafe-45821F.jpg",
        category: "JACKET",
    },
    {
        id: 3,
        name: "The Utility Jacket",
        price: 25.0,
        colors: "3 Colors available",
        image: "/ads/Tarafe-51069Z.jpg",
        category: "WOMEN'S",
    },
    {
        id: 4,
        name: "The Suede Jacket",
        price: 18.75,
        colors: "7 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "SUITS",
    },
    {
        id: 5,
        name: "Casual Hoodie",
        price: 14.5,
        colors: "5 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "HOODIE",
    },
    {
        id: 6,
        name: "Urban Crewneck",
        price: 10.99,
        colors: "3 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "CREWNECK",
    },
    {
        id: 7,
        name: "Slim T-Shirt",
        price: 8.75,
        colors: "4 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "T-SHIRT",
    },
    {
        id: 8,
        name: "Elegant Dress",
        price: 21.0,
        colors: "2 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "WOMEN'S",
    },
];

// const categories = ["ALL", "WOMEN'S", "MEN'S", "T-SHIRT", "SUITS", "CREWNECK", "JACKET", "HOODIE"];

export default function HomeGallerie() {

    const [gallery, setGallery] = useState<GallerieImage[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(''); // Recherche
    const [reglage, setReglages] = useState<Reglage[]>([]);

    // === Etats ===
    const [activeCategory, setActiveCategory] = useState<number>(0); // 0 = TOUS
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const urlImages = getImagesUrl();

    // === Fetch des données ===
    const fetchData = async () => {
        setLoading(true);
        try {
            const filters: Filters = { page: currentPage, limit: 10, search: search || undefined, };
            const result = await getAllImagesGallery(filters);

            if (result.statusCode === 200 && result.data) {
                setGallery(result.data.data.data);
                setTotalPages(result.data.data.last_page); // Met à jour le nombre total de pages
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

    const getAllCategories = async () => {
        const result = await getAllCategoriesGallery();
        if (result.statusCode === 200 && result.data) {
            setCategories(result.data);
        }
    };


    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        fetchData();
    }, [currentPage, activeCategory]);

    // === Filtrage ===

    const handleFilter = async (categoryId: number) => {
        setGallery([])
        setActiveCategory(categoryId);
        const filters: Filters = { page: currentPage, limit: 10, search: categoryId !== 0 ? categoryId.toString() : undefined, };
        setLoading(true);
        try {

            if (categoryId === 0) {
                await fetchData(); // Assure-toi que fetchData est async
            } else {
                const result = await getAllImagesGallery(filters);
                if (result.statusCode === 200 && result.data) {
                    setGallery(result.data.data.data);
                    setTotalPages(result.data.data.last_page); // Met à jour le nombre total de pages
                    setReglages(result.data.reglages);
                } else {
                    toast.error(result.message || "Erreur lors du chargement");
                }
            }
        } catch (error) {
            toast.error("Erreur serveur");

        } finally {
            setLoading(false);
        }
    };

    const resetFilters = async () => {
        setActiveCategory(0); // réinitialise la catégorie
        setCurrentPage(1);    // remet la page à 1
        setSearch('');        // vide le champ de recherche si utilisé
        await fetchData(); // recharge toutes les images

    };


    // if (!gallery || gallery.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-60">
    //             <FullPageLoader status="Chargement du produit" />
    //         </div>
    //     );
    // }

    return (
        <>
            <section className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight ">
                        NOS REALISATIONS
                    </h2>
                </div>



                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
                    {categories.map((category) => (
                        <button key={category.idcategories_gallery}
                            onClick={() => handleFilter(category.idcategories_gallery)}
                            className={`px-5 py-2 rounded-full border font-medium text-sm sm:text-base transition-all duration-200 ${activeCategory === category.idcategories_gallery ? "bg-[#fd980e] text-white border-[#fd980e] scale-105" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`} >
                            {category.libelle}
                        </button>
                    ))}
                </div>

                {/* Bouton Réinitialiser visible uniquement si une catégorie est active */}
                <div className={`flex justify-center mb-8 transition-all duration-300 ${activeCategory !== 0 ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}`}>
                    <button
                        onClick={resetFilters} // appelle la nouvelle fonction
                        className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition transform hover:scale-105"
                    >
                        Réinitialiser
                    </button>
                </div>


                {/* Product Grid ou Spinner */}
                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <Spinner />
                    </div>
                ) : (


                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
                        {gallery.map((item, index) => (
                            <div key={item.id_gallerie_images} className="group">
                                <div className="relative rounded-3xl bg-[#efefec] overflow-hidden">
                                    {/* Image */}
                                    <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-center bg-cover rounded-3xl" style={{ backgroundImage: `url(${urlImages}/${item.files_gallerie_images})` }} />
                                    {/* Overlay bouton Voir plus */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition">
                                        <button className="bg-[#c08457] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold" >
                                            Voir plus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </section>
            <Footer reglages={reglage} />

        </>

    );
}
