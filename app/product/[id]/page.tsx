"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRealisationsByLaballe } from "@/service/realisationServices";
import { getImagesUrl } from "@/types/baseUrl";
import { DetailRealisation, Images, Realisation, Reglage } from "@/types/interfaces";
import FullPageLoader from "@/components/spinner/FullPageLoader";
import Navbar from "@/components/page/Navbar";
import Footer from "@/components/page/Footer";

interface ProductImage {
    id: number;
    src: string;
    alt: string;
}

interface ReadMoreProps {
    html: string;
    maxWords?: number;
}

export default function Page() {
    const { id } = useParams<{ id: string }>();
    const [realisations, setRealisations] = useState<Realisation[]>([]);
    const [images, setImages] = useState<Images[]>([]);
    const [reglages, setReglages] = useState<Reglage[]>([]);
    const [realisationImages, setRealisationImages] = useState<ProductImage[]>([]);
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const urlImages = getImagesUrl();

    const fetchData = async (id: string) => {
        setLoading(true);
        try {
            const libelleModified = id.substring(id.lastIndexOf("/") + 1);
            const libelle = libelleModified.replace(/-/g, " ");

            const result = await getRealisationsByLaballe(libelle);

            if (result.statusCode === 200 && result.data) {
                setReglages(result.data.reglages);
                setRealisations(result.data.realisations);
                setImages(result.data.images);

                const formattedImages = buildRealisationImages(result.data);
                setRealisationImages(formattedImages);
                setActiveImageIndex(0);
            } else {
                toast.error(result.message || "Erreur lors du chargement");
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData(id);
    }, [id]);

    function buildRealisationImages(data: DetailRealisation): ProductImage[] {
        const apiImages = data?.images ?? [];
        const mainImage = data?.realisations?.[0]?.images_realisations ?? null;

        const formatted: ProductImage[] = apiImages.map((img) => ({
            id: img.id_img_realisations,
            src: `${img.filles_img_realisations}`,
            alt: `img-${img.id_img_realisations}`,
        }));

        if (mainImage) {
            const mainSrc = `${mainImage}`;
            const exists = formatted.some((i) => i.src === mainSrc);
            if (!exists) {
                formatted.unshift({ id: 0, src: mainSrc, alt: "main" });
            }
        }

        return formatted;
    }

    // === Fonctions pour la slide d'images ===
    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (realisationImages.length <= 1) return;

        const nextIndex = (activeImageIndex + 1) % realisationImages.length;
        setActiveImageIndex(nextIndex);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (realisationImages.length <= 1) return;

        const prevIndex = (activeImageIndex - 1 + realisationImages.length) % realisationImages.length;
        setActiveImageIndex(prevIndex);
    };

    // === Composant ReadMore ===
    const ReadMore: React.FC<ReadMoreProps> = ({ html, maxWords = 30 }) => {
        const [expanded, setExpanded] = useState(false);

        // Convertit le HTML en texte brut pour compter les mots
        const tempDiv = typeof window !== "undefined" ? document.createElement("div") : null;
        if (tempDiv) tempDiv.innerHTML = html;
        const text = tempDiv?.textContent || "";

        const words = text.split(" ");
        const shouldTruncate = words.length > maxWords;

        // Si on tronque, on prend les maxWords premiers mots et on les remet en HTML minimal
        const displayHtml = expanded ? html : words.slice(0, maxWords).join(" ") + (shouldTruncate ? "..." : "");

        return (
            <div className="text-gray-600 prose prose-sm max-w-none">
                <span dangerouslySetInnerHTML={{ __html: displayHtml }} />
                {shouldTruncate && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-sm text-gray-500 ml-1 underline hover:text-gray-700 transition-colors"
                    >
                        {expanded ? "Réduire" : "Afficher la suite"}
                    </button>
                )}
            </div>
        );
    };

    if (loading || !realisations || realisations.length === 0) {
        return (
            <div className="flex justify-center items-center h-60">
                <FullPageLoader status="Chargement du produit" />
            </div>
        );
    }

    const realisation = realisations[0];
    const activeImage = realisationImages[activeImageIndex];
    const totalImages = realisationImages.length;

    return (
        <>
            <Navbar />

            <div className="w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                {/* Left Section - Images avec slider */}
                <div>
                    {/* Image principale avec boutons de slide */}
                    <div className="relative mx-auto h-[600px] overflow-hidden bg-white">
                        {activeImage && (
                            <Image src={`${urlImages}/${activeImage.src}`} alt={realisation.libelle_realisations}fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
                        )}

                        {/* Boutons de navigation du slider */}
                        {totalImages > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all z-20"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all z-20"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                {/* Compteur d'images */}
                                {totalImages > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-lg z-10">
                                        {activeImageIndex + 1}/{totalImages}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Miniatures des images */}
                    {totalImages > 1 && (
                        <div className="mt-4">
                            <div className="flex gap-2 overflow-x-auto pb-2 items-center justify-start md:justify-center">
                                {realisationImages.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${index === activeImageIndex ? 'ring-2 ring-[#fd980e] scale-105' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <Image
                                            src={`${urlImages}/${image.src}`}
                                            alt={image.alt}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Section - Informations produit */}
                <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-xl p-6">
                        <p className="text-sm text-gray-400 uppercase mb-2">
                            CODE : {realisation.code_realisation}
                        </p>
                        <h1 className="text-3xl font-semibold mb-4">
                            {realisation.libelle_realisations}
                        </h1>
                        <div className="border-t pt-4">
                            <ReadMore html={realisation.descript_real || ""} maxWords={80} />
                        </div>
                    </div>

                    {/* Informations supplémentaires si disponibles */}
                    {realisation.created_at && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500">
                                Créé le: {new Date(realisation.created_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    )}

                </div>
            </div>

            <Footer reglages={reglages ?? []} />
        </>
    );
}