"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Footer from "@/components/page/Footer";
import { Spinner } from "../spinner/Loader";
import { OptionRealisation, Realisation, Reglage } from "@/types/interfaces";
import { getAllRealisationsByFilter } from "@/service/realisationServices";
import FullPageLoader from "../spinner/FullPageLoader";
import { getImagesUrl } from "@/types/baseUrl";

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

export default function AllProduits() {
    const router = useRouter();

    // === Etats ===
    const [activeCategory, setActiveCategory] = useState<number>(0); // 0 = TOUS
    const [loading, setLoading] = useState(false);
    const [reglages, setReglages] = useState<Reglage[]>([]);
    const [option, setOption] = useState<OptionRealisation[]>([]);
    const [realisations, setRealisations] = useState<RealisationWithImages[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});
    const itemsPerPage = 20; // Nombre d'éléments par page

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
            const result = await getAllRealisationsByFilter(currentPage, Number(itemsPerPage), activeCategory);
            if (result.statusCode === 200 && result.data && result.data.realisations.data.length !== 0) {
                setOption(result.data.OptionRealisation);

                // Transformer les données pour inclure les images si disponibles
                const realisationsWithImages = result.data.realisations.data.map((real: RealisationWithImages) => ({
                    ...real,
                    images: real.images || [] // Assurez-vous que votre API retourne les images
                }));

                setRealisations(realisationsWithImages);
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
    }, [currentPage, activeCategory]);

    // === Filtrage ===
    const handleFilter = (categoryId: number) => {
        setActiveCategory(categoryId);
        setCurrentPage(1); // Réinitialiser à la première page lors du filtrage
        setLoading(true);
    };

    // === Fonctions de pagination ===
    const onNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const onPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // === Fonctions pour la slide d'images ===
    const nextImage = (e: React.MouseEvent, realisationId: string) => {
        e.stopPropagation(); // Empêche la propagation vers le bouton "Voir plus"
        const realisation = realisations.find(r => r.id_realisations === realisationId);
        if (!realisation || !realisation.images || realisation.images.length <= 1) return;

        const currentIndex = activeImageIndex[realisationId] || 0;
        const nextIndex = (currentIndex + 1) % realisation.images.length;
        setActiveImageIndex(prev => ({ ...prev, [realisationId]: nextIndex }));
    };

    const prevImage = (e: React.MouseEvent, realisationId: string) => {
        e.stopPropagation(); // Empêche la propagation vers le bouton "Voir plus"
        const realisation = realisations.find(r => r.id_realisations === realisationId);
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
                        {/* Categories */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (<div key={i} className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />))) : (
                                <>
                                    <button key="all" onClick={() => { handleFilter(0); }} className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${activeCategory === 0 ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}  >
                                        Tous
                                    </button>

                                    {option.map((cat) => (
                                        <button
                                            key={cat.id_option_reaalisation}
                                            onClick={() => handleFilter(cat.id_option_reaalisation)}
                                            className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${activeCategory === cat.id_option_reaalisation ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}  >
                                            {cat.libelleOption_reaalisation}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Grille de produits - Structure inchangée */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
                            {realisations.map((product) => {
                                const activeImage = getActiveImage(product);
                                const totalImages = product.images?.length || 0;
                                const currentIndex = activeImageIndex[product.id_realisations] || 0;

                                return (
                                    <div key={product.id_realisations} className="group">
                                        <div className="relative rounded-3xl bg-[#efefec] overflow-hidden">
                                            {/* Image avec possibilité de slider */}
                                            <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-center bg-cover rounded-3xl" style={{ backgroundImage: `url(${urlImages}/${activeImage.filles_img_realisations})`, transition: 'background-image 0.3s ease' }}  >

                                                {/* Boutons de navigation du slider - AU-DESSUS du bouton "Voir plus" */}
                                                {totalImages > 1 && (
                                                    <>
                                                        <button
                                                            onClick={(e) => prevImage(e, product.id_realisations)}
                                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-all z-20"
                                                            style={{ zIndex: 20 }} // Plus élevé que le bouton "Voir plus"
                                                        >
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => nextImage(e, product.id_realisations)}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-all z-20"
                                                            style={{ zIndex: 20 }} // Plus élevé que le bouton "Voir plus"
                                                        >
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

                                            {/* Overlay bouton Voir plus - avec z-index plus bas */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition z-10">
                                                <button
                                                    onClick={() => navigateTo(product.libelle_realisations)}
                                                    className="bg-[#c08457] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#a96f46] transition-colors"
                                                >
                                                    Voir plus
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card info - inchangé */}
                                        <div className="mt-2 sm:mt-3 px-1 sm:px-2">
                                            <h3 className="font-semibold text-sm sm:text-base">
                                                {product.libelle_realisations || "\u00A0"}
                                            </h3>
                                        </div>

                                        {/* Miniatures des images - optionnel */}
                                        {totalImages > 1 && (
                                            <div className="mt-2 flex gap-1 overflow-x-auto px-1">
                                                {product.images?.slice(0, 4).map((image, index) => (
                                                    <button
                                                        key={image.id_img_realisations}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveImageIndex(prev => ({
                                                                ...prev,
                                                                [product.id_realisations]: index
                                                            }));
                                                        }}
                                                        className={`relative w-8 h-8 rounded overflow-hidden flex-shrink-0 ${index === currentIndex ? 'ring-2 ring-[#fd980e]' : 'opacity-70 hover:opacity-100'}`}
                                                    >
                                                        <div
                                                            className="w-full h-full bg-center bg-cover"
                                                            style={{ backgroundImage: `url(${urlImages}/${image.filles_img_realisations})` }}
                                                        />
                                                    </button>
                                                ))}
                                                {totalImages > 4 && (
                                                    <div className="relative w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs">
                                                        +{totalImages - 4}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination - Ajoutée */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4 mt-8">
                            <div className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                                Page {currentPage} sur {totalPages || 1}
                            </div>

                            <div className="flex gap-2 justify-center">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                    onClick={onPreviousPage}
                                    disabled={currentPage <= 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Précédent
                                </button>

                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                    onClick={onNextPage}
                                    disabled={currentPage >= totalPages}
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* Footer */}
            <Footer reglages={reglages} />
        </>
    );
}