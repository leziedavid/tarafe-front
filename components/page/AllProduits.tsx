"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import Footer from "@/components/page/Footer";
import { OptionRealisation, Realisation, Reglage } from "@/types/interfaces";
import { getAllRealisationsByFilter } from "@/service/realisationServices";
import CollectionsSection from "../home/ProductList";
import ProductHero, { HeroSlide } from "../store/ProductHero";

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

    const heroSlides: HeroSlide[] = [
        {
            id: 1,
            image: "/ads/images.jpg",
            titleLines: [
                "Tarafé est une plateforme digitale de personnalisation",
                "des produits mode, accessoires et déco, avec une touche africaine,",
                "pour les entreprises et les particuliers. Bienvenue !"
            ],
        },
    ];

    return (
        <>
            <section className="max-w-7xl mx-auto px-1 pt-4 pb-10 mt-12 md:mt-0">

                <div className="mb-10">
                    <ProductHero data={heroSlides} />
                </div>


                {/* Header */}
                <div className="flex mb-5 ">
                    <h2 className="text-brand-secondary text-xl sm:text-1xl px-5 md:px-15 md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
                        DÉCOUVRIR NOS CRÉATIONS
                    </h2>
                </div>


                <div className="px-5 md:px-15 mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Icon icon="solar:tag-bold-duotone" className="text-brand-primary w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégories</span>
                    </div>
                    <div className="flex overflow-x-auto md:flex-wrap gap-2 pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                        <button key="all" onClick={() => { handleFilter(0); }} className={`shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeCategory === 0 ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/50"}`} >
                            <Icon icon="solar:widget-add-bold-duotone" width={18} />
                            Tous
                        </button>
                        {option.map((cat) => (
                            <button key={cat.id_option_reaalisation} onClick={() => handleFilter(cat.id_option_reaalisation)} className={`shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeCategory === cat.id_option_reaalisation ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/50"}`} >
                                <Icon icon="solar:tag-bold-duotone" width={18} />
                                {cat.libelleOption_reaalisation}
                            </button>
                        ))}
                    </div>
                </div>

                <CollectionsSection product={realisations ?? []} isLabel={false} />

                {/* Pagination - Affichée uniquement si des réalisations existent */}
                {realisations.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4 mt-8">
                        {/* Texte de la page */}
                        <div className="text-muted-foreground text-sm sm:text-base text-center sm:text-left">
                            Page {currentPage} sur {totalPages || 1}
                        </div>

                        {/* Boutons Précédent / Suivant */}
                        <div className="flex gap-2 justify-center">
                            <button
                                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                onClick={onPreviousPage}
                                disabled={currentPage <= 1}
                            >
                                <Icon icon="solar:alt-arrow-left-bold" className="h-4 w-4 mr-1" />
                                Précédent
                            </button>

                            <button
                                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                onClick={onNextPage}
                                disabled={currentPage >= totalPages}
                            >
                                Suivant
                                <Icon icon="solar:alt-arrow-right-bold" className="h-4 w-4 ml-1" />
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