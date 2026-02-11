"use client";

import { ServiceCard } from "@/types/interfaces";
import Link from "next/link";
import { useState, useEffect } from "react";

// Composant Skeleton
const ServiceCardSkeleton = () => {
    return (
        <section className="w-full bg-gray-100">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <div className="grid md:grid-cols-2 gap-1">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="bg-gray-100 rounded-tarafe p-12 md:p-16 animate-pulse"
                        >
                            <div className="h-12 md:h-14 lg:h-16 w-3/4 bg-gray-200 rounded mb-6"></div>
                            <div className="space-y-3 mb-8">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-32 bg-gray-300 rounded"></div>
                                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

interface ProductCardProps {
    serviceCards: ServiceCard[];
}

export default function ProductCardsSection({ serviceCards }: ProductCardProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si les données sont chargées
        if (serviceCards && serviceCards.length > 0) {
            setIsLoading(false);
        }
    }, [serviceCards]);

    // Filtrer les cartes actives uniquement
    const activeServiceCards = serviceCards.filter((card) => card.is_active === 1);

    // Affiche le skeleton pendant le chargement
    if (isLoading) {
        return <ServiceCardSkeleton />;
    }

    return (
        <section className="w-full bg-tarafe-gray">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <div className="grid md:grid-cols-2 gap-1">
                    {serviceCards.map((card) => (
                        <div  key={card.id} className={`bg-${card.bg_color || 'tarafe-gray'} rounded-tarafe p-12 md:p-16 hover:scale-[1.02] transition-transform duration-300`} >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 text-tarafe-black leading-tight">
                                {card.title}
                            </h2>

                            <p className="text-base md:text-lg leading-relaxed mb-8 text-tarafe-black/80" dangerouslySetInnerHTML={{ __html: card.description || 'Description à venir...' }} />

                            <Link  href={card.link || '#'}  className="underline font-semibold inline-flex items-center gap-2 text-tarafe-black hover:gap-4 transition-all duration-300"  >
                                En savoir plus
                                <span>→</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}