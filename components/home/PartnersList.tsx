"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Partenaire } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { Icon } from "@iconify/react";

interface PartnersListProps {
    partners: Partenaire[];
    isPaginate?: boolean;
    isLoading?: boolean;
}

export default function PartnersList({ partners, isPaginate = false, isLoading = false }: PartnersListProps) {
    const urlImages = getImagesUrl();
    const [currentPage, setCurrentPage] = useState(0);
    const [cols, setCols] = useState(2); // Valeur par défaut (mobile)

    // Déterminer le nombre de colonnes et d'items par page de manière responsive
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setCols(5);
            } else if (window.innerWidth >= 768) {
                setCols(3);
            } else {
                setCols(2);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Réinitialiser la page si on change de breakpoint (optionnel mais plus propre)
    useEffect(() => {
        setCurrentPage(0);
    }, [cols]);

    // Filtrer les partenaires actifs
    const activePartners = partners.filter(p => p.status_partenaires === "1");

    // Calcul dynamique de la pagination : toujours 2 lignes
    const itemsPerPage = isPaginate ? cols * 2 : activePartners.length;
    const totalPages = Math.ceil(activePartners.length / itemsPerPage);

    const displayedPartners = isPaginate
        ? activePartners.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        : activePartners;

    const PartnerSkeleton = () => (
        <div className="relative w-full h-24 md:h-32 flex items-center justify-center p-2 rounded-xl bg-gray-50/50 animate-pulse border border-gray-100/50 dark:border-gray-800/10">
            <div className="w-20 md:w-28 h-10 md:h-14 bg-gray-200/50 dark:bg-gray-800 rounded-md"></div>
        </div>
    );

    return (
        <section className="py-20 px-6 md:px-10 bg-white relative overflow-hidden">
            {/* Subtle background pattern/texture if possible, otherwise keep clean white */}
            {/* The image shows a very light pattern of coffee beans or similar icons. 
                I will use a subtle CSS background or keep it clean to match the premium feel. */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url('/ads/pattern.png')`, backgroundSize: '200px' }}>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 text-brand-secondary leading-tight">
                        Ils nous ont fait confiance
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 items-center justify-items-center">
                    {isLoading ? (
                        Array(5).fill(0).map((_, i) => <PartnerSkeleton key={i} />)
                    ) : (
                        displayedPartners.map((partner) => (
                            <div
                                key={partner.id}
                                className="relative w-full h-24 md:h-32 flex items-center justify-center p-2 transition-all duration-300 hover:scale-105"
                            >
                                {partner.path_partenaires && (
                                    <Image
                                        src={`${urlImages}/${partner.path_partenaires}`}
                                        alt={partner.libelle_partenaires}
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>

                {isPaginate && totalPages > 1 && !isLoading && (
                    <div className="flex justify-center mt-16 gap-3">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentPage === idx
                                    ? "bg-[#242078] w-10"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                aria-label={`Page ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
