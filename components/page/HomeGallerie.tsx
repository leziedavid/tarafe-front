"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GallerieImage, GalleryCategory, Reglage } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { getAllCategoriesGallery, getAllImagesGallery } from "@/service/galleryServices";
import { Filters } from "@/types/Filters";
import { toast } from "sonner";
import Footer from "./Footer";
import { Icon } from "@iconify/react";
import ImagePreview from "../shared/ImagePreview";
import { Skeleton } from "@/components/ui/skeleton";
import ProductHero, { HeroSlide } from "../store/ProductHero";

export default function HomeGallerie() {
    const [gallery, setGallery] = useState<GallerieImage[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [reglage, setReglages] = useState<Reglage[]>([]);

    // === Etats ===
    const [activeCategory, setActiveCategory] = useState<number>(0); // 0 = TOUS
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedImages, setSelectedImages] = useState<any[] | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState<number | null>(null);
    const urlImages = getImagesUrl();

    // === Fetch des données ===
    const fetchData = async () => {
        setLoading(true);
        try {
            // Utiliser l'ID de catégorie comme recherche si différent de 0, comme dans AllProduits
            const filters: Filters = {
                page: currentPage,
                limit: 12,
                search: activeCategory !== 0 ? activeCategory.toString() : undefined,
            };
            const result = await getAllImagesGallery(filters);

            if (result.statusCode === 200 && result.data) {
                setGallery(result.data.data.data);
                setTotalPages(result.data.data.last_page);
                setReglages(result.data.reglages);
            } else {
                toast.error(result.message || "Erreur lors du chargement");
            }
        } catch (error) {
            toast.error("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    const getAllCategories = async () => {
        try {
            const result = await getAllCategoriesGallery();
            if (result.statusCode === 200 && result.data) {
                setCategories(result.data);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        fetchData();
    }, [currentPage, activeCategory]);

    // === Filtrage (Aligné sur AllProduits.tsx) ===
    const handleFilter = (categoryId: number) => {
        setActiveCategory(categoryId);
        setCurrentPage(1);
        setLoading(true);
    };

    const resetFilters = () => {
        setActiveCategory(0);
        setCurrentPage(1);
    };

    // === Fonctions de pagination ===
    const onNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const onPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // Skeleton for the gallery items
    const renderSkeleton = () => (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0  mt-12 md:mt-0">
            {Array(8).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] w-full rounded-[2rem] bg-muted animate-pulse relative overflow-hidden">
                    <Skeleton className="absolute inset-0" />
                </div>
            ))}
        </div>
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
            <section className="max-w-7xl mx-auto px-6 py-10  mt-12 md:mt-0">

                <div className="mb-10">
                    <ProductHero data={heroSlides} />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-brand-secondary text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                        NOS REALISATIONS
                    </h2>
                </div>

                {/* Categories */}
                <div className="flex flex-nowrap sm:flex-wrap items-center gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2 sm:pb-0 px-2 sm:px-0">
                    <button onClick={() => handleFilter(0)} className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${activeCategory === 0 ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 border-brand-primary" : "bg-background text-foreground border-border hover:border-brand-primary/50"}`}  >
                        Tous
                    </button>

                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <button key={cat.idcategories_gallery} onClick={() => handleFilter(cat.idcategories_gallery)} className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${activeCategory === cat.idcategories_gallery ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 border-brand-primary" : "bg-background text-foreground border-border hover:border-brand-primary/50"}`} >
                                {cat.libelle}
                            </button>
                        ))
                    ) : (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="shrink-0 w-24 h-10 bg-muted rounded-full animate-pulse" />
                        ))
                    )}

                    {activeCategory !== 0 && (
                        <button onClick={resetFilters} className="shrink-0 p-2.5 rounded-full bg-secondary text-secondary-foreground hover:text-brand-primary transition-colors" title="Réinitialiser" >
                            <Icon icon="solar:backspace-bold" width="24" height="24" />
                        </button>
                    )}
                </div>

                {/* Grid */}
                {loading ? (
                    renderSkeleton()
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
                            {gallery.map((item, index) => (
                                <div key={item.id_gallerie_images} className="group cursor-pointer" onClick={() => { setSelectedImages(gallery.map(g => ({ file_path: g.files_gallerie_images }))); setInitialIndex(index); setModalOpen(true); }} >
                                    <div className="relative aspect-[3/4] rounded-3xl bg-muted overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500">
                                        <Image src={`${urlImages}/${item.files_gallerie_images}`} alt={item.libelle_gallerie_images || "Gallery Image"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-[2px]">
                                            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-full border border-white/20 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                                                <Icon icon="solar:eye-bold" className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {gallery.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-12">
                                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border font-bold text-sm hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed" onClick={onPreviousPage} disabled={currentPage === 1} >
                                    <Icon icon="solar:alt-arrow-left-bold" width="20" height="20" />
                                    Précédent
                                </button>

                                <div className="text-sm font-bold text-muted-foreground">
                                    {currentPage} / {totalPages}
                                </div>

                                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border font-bold text-sm hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed" onClick={onNextPage} disabled={currentPage === totalPages}  >
                                    Suivant
                                    <Icon icon="solar:alt-arrow-right-bold" width="20" height="20" />
                                </button>
                            </div>
                        )}

                        {!loading && gallery.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <Icon icon="solar:gallery-wide-bold" width="64" height="64" className="mb-4 opacity-20" />
                                <p className="text-lg font-medium">Aucune image trouvée</p>
                            </div>
                        )}
                    </>
                )}
            </section>

            <Footer reglages={reglage} />
            {modalOpen && selectedImages && (
                <ImagePreview data={selectedImages} imageKey="file_path" initialIndex={initialIndex} onClose={() => { setModalOpen(false); setInitialIndex(null); }} />
            )}
        </>
    );
}
