"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
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
    const [activeImage, setActiveImage] = useState<string>("");
    const [size, setSize] = useState("S");
    const [carouselIndex, setCarouselIndex] = useState(0);
    const urlImages = getImagesUrl();

    const sizes = ["S", "M", "L", "XL", "XXL"];
    const itemsPerPage = 3; // nombre d'images visibles dans le carousel

    const fetchData = async (id: string) => {
        const libelleModified = id.substring(id.lastIndexOf("/") + 1);
        const libelle = libelleModified.replace(/-/g, " ");

        const result = await getRealisationsByLaballe(libelle);

        if (result.statusCode === 200 && result.data) {
            setReglages(result.data.reglages);
            setRealisations(result.data.realisations);
            setImages(result.data.images);

            const formattedImages = buildRealisationImages(result.data);
            setRealisationImages(formattedImages);
            setActiveImage(formattedImages[0]?.src || "");
        } else {
            toast.error(result.message || "Erreur lors du chargement");
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

    if (!realisations || realisations.length === 0) {
        return (
            <div className="flex justify-center items-center h-60">
                <FullPageLoader status="Chargement du produit" />
            </div>
        );
    }

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
                    <button onClick={() => setExpanded(!expanded)} className="text-sm text-gray-500 ml-1 underline hover:text-gray-700 transition-colors"   >
                        {expanded ? "Réduire" : "Afficher la suite"}
                    </button>
                )}
            </div>
        );
    };



    // if (!realisationImages || realisationImages.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-60">
    //             <FullPageLoader status="Chargement des nouveautés" />
    //         </div>
    //     );
    // }

    const realisation = realisations[0];
    const totalPages = Math.ceil(realisationImages.length / itemsPerPage);

    const handlePrev = () => {
        setCarouselIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCarouselIndex((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const visibleImages = realisationImages.slice(
        carouselIndex * itemsPerPage,
        carouselIndex * itemsPerPage + itemsPerPage
    );

    return (
        <>
            <Navbar />

            <div className="w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                {/* Left Section Images */}
                <div>
                    <div className="w-full h-[500px] relative rounded-2xl overflow-hidden bg-gray-100">
                        <Image
                            src={`${urlImages}/${activeImage}`}
                            alt={realisation.libelle_realisations}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            unoptimized
                        />
                    </div>

                    {/* Carousel */}
                    <div className="flex items-center mt-4">
                        <button
                            onClick={handlePrev}
                            disabled={carouselIndex === 0}
                            className="px-2 py-1 bg-gray-200 rounded-xl disabled:opacity-50" >
                            ◀
                        </button>

                        <div className="flex gap-4 overflow-hidden flex-1">
                            {visibleImages.map((img) => (
                                <div key={img.id} className={`flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden cursor-pointer border ${activeImage === img.src ? "border-black" : "border-transparent"}`}
                                    onClick={() => setActiveImage(img.src)}
                                >
                                    <Image
                                        src={`${urlImages}/${img.src}`}
                                        alt={img.src}
                                        width={150}
                                        height={150}
                                        className="object-cover w-full h-full"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={carouselIndex >= totalPages - 1}
                            className="px-2 py-1 bg-gray-200 rounded-xl disabled:opacity-50"
                        >
                            ▶
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-xl p-2">
                        <p className="text-sm text-gray-400 uppercase">CODE : {realisation.code_realisation}</p>
                        <h1 className="text-3xl font-semibold mb-3">{realisation.libelle_realisations}</h1>
                        <ReadMore html={realisation.descript_real || ""} maxWords={80} />
                    </div>

                    {/* Select Size */}
                    {/* <div>
                    <p className="font-medium mb-2">Select Size</p>
                    <div className="flex gap-2">
                        {sizes.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`px-6 py-3 rounded-xl border transition text-sm ${size === s
                                    ? "bg-black text-white border-black"
                                    : "bg-gray-100 text-gray-700 border-transparent"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div> */}

                </div>

            </div>
            <Footer reglages={reglages ?? []} />
        </>
    );
}
