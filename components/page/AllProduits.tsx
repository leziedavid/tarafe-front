"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Footer from "@/components/page/Footer";
import { OptionRealisation, Realisation, Reglage } from "@/types/interfaces";
import { getAllRealisationsByFilter } from "@/service/realisationServices";
import CollectionsSection from "../home/ProductList";

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

    // === Navigation vers produit ===
    const navigateTo = (path: string) => {
        const libelleModified = path.replace(/ /g, "-");
        router.push("/product/" + libelleModified);
    };

    // === Fetch des données ===
    const fetchData = async () => {

        try {
            setLoading(true);
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

    // Skeletons pour les produits (mobile + web)
    const renderProductSkeleton = (large?: boolean, key?: number) => (
        <div key={key} className={`relative overflow-hidden rounded-xl animate-pulse bg-gray-200 ${large ? "h-[300px] md:h-[400px] lg:h-[520px]" : "h-[300px] md:h-[400px] lg:h-[250px]"}`} />
    );

    return (
        <>
            <section className="max-w-7xl mx-auto px-1 py-10">

                {/* Header */}
                <div className="flex mb-5 ">
                    <h2 className="text-xl sm:text-1xl px-5 md:px-15 md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
                        DÉCOUVRIR NOS CRÉATIONS
                    </h2>
                </div>


                <div className="text-xl sm:text-1xl px-5 md:px-15 md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight space-x-2 space-y-2">
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
                </div>

                <CollectionsSection product={realisations ?? []} isLabel={false} />

                {/* Pagination - Affichée uniquement si des réalisations existent */}
                {realisations.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4 mt-8">
                        {/* Texte de la page */}
                        <div className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                            Page {currentPage} sur {totalPages || 1}
                        </div>

                        {/* Boutons Précédent / Suivant */}
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
                )}

            </section>

            {/* Footer */}
            <Footer reglages={reglages} />
        </>
    );
}