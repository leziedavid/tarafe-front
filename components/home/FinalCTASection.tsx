"use client";

import { FinalCTA } from "@/types/interfaces";
import Link from "next/link";
import { useState, useEffect } from "react";

// Composant Skeleton pour le CTA
const FinalCTASkeleton = () => {
    return (
        <section className="w-full bg-tarafe-gray py-section-lg">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Grand conteneur CTA Skeleton */}
                <div className="bg-gradient-to-br from-tarafe-lavender/50 to-tarafe-blue/50 rounded-tarafe p-12 md:p-20 text-center animate-pulse">
                    <div className="h-12 md:h-14 lg:h-16 w-3/4 bg-gray-300 rounded mb-6 max-w-3xl mx-auto"></div>
                    
                    <div className="space-y-3 mb-10 max-w-2xl mx-auto">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/6 mx-auto"></div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <div className="h-12 w-40 bg-gray-300 rounded-full"></div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <div className="h-4 w-48 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface FinalCTASectionProps {
    finals: FinalCTA[];
}

export default function FinalCTASection({ finals }: FinalCTASectionProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si les données sont chargées
        if (finals && finals.length > 0) {
            setIsLoading(false);
        }
    }, [finals]);

    // Prendre le premier CTA actif
    const activeCTA = finals.find((cta) => cta.active === 1);

    // Affiche le skeleton pendant le chargement
    if (isLoading) {
        return <FinalCTASkeleton />;
    }

    return (
        <section className="w-full bg-tarafe-gray py-section-lg">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Grand conteneur CTA */}
                <div className="bg-gradient-to-br from-tarafe-lavender to-tarafe-blue rounded-tarafe p-12 md:p-20 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 text-tarafe-black leading-tight max-w-3xl mx-auto">
                        {activeCTA?.title || "PRÊT À TRANSFORMER VOTRE STYLE ?"}
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl leading-relaxed mb-10 text-tarafe-black/80 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: activeCTA?.description || 'Rejoignez plus de 10 000 professionnels et particuliers qui font confiance à Tarafé pour leurs besoins en mode et personnalisation.' }}/>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href={activeCTA?.button_link || "/contact"} className="bg-transparent border-2 border-tarafe-black text-tarafe-black px-10 py-2 rounded-full font-bold text-base md:text-lg hover:bg-tarafe-black hover:text-[#fd980e] transition-all duration-300" >
                            {activeCTA?.button_text || "Nous contacter"} 
                        </Link>
                    </div>
                    <br />
                    { "✨ ⚡ Support 24/7 • 🔒 Paiement sécurisé"}
                </div>
            </div>
        </section>
    );
}