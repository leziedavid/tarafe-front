"use client";

import Image from "next/image";
import CardContainer from "../layout/CardContainer";
import { Feature } from "@/types/interfaces";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getImagesUrl } from "@/types/baseUrl";


// Composant Skeleton pour les features
const FeatureSkeleton = () => {
    return (
        <section className="w-full bg-tarafe-gray">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <CardContainer bgColor="white" rounded="tarafe" padding="xl">
                    <div className="space-y-24">
                        {[1, 2].map((item) => (
                            <div key={item} className="grid md:grid-cols-2 gap-12 md:gap-16 items-center animate-pulse">
                                {/* Texte Skeleton */}
                                <div className={`space-y-6 ${item === 2 ? "md:order-2" : "md:order-1"}`}>
                                    <div className="h-12 md:h-14 lg:h-16 w-3/4 bg-gray-200 rounded"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>

                                {/* Image Skeleton */}
                                <div className={`rounded-xl overflow-hidden ${item === 2 ? "md:order-1" : "md:order-2"}`}>
                                    <div className="w-full h-[300px] md:h-[400px] bg-gray-200"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContainer>
            </div>
        </section>
    );
};

interface FeatureProps {
    feature: Feature[];
}

export default function AlternatingFeaturesSection({ feature }: FeatureProps) {
    const [isLoading, setIsLoading] = useState(true);
    const urlImages = getImagesUrl();

    useEffect(() => {
        // Vérifier si les données sont chargées
        if (feature && feature.length > 0) {
            setIsLoading(false);
        }
    }, [feature]);

    // Filtrer les features actives uniquement
    const activeFeatures = feature.filter((feat) => feat.active === 1);

    // Affiche le skeleton pendant le chargement
    if (isLoading) {
        return <FeatureSkeleton />;
    }

    return (
        <section className="w-full bg-tarafe-gray">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <CardContainer bgColor="white" rounded="tarafe" padding="xl">
                    <div className="space-y-24">
                        {activeFeatures.map((feat) => (
                            <div  key={feat.id}  className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"  >
                                {/* Texte */}
                                <div className={`space-y-6 ${feat.reverse === 1 ? "md:order-2" : "md:order-1"  }`} >
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight text-tarafe-black">
                                        {feat.title}
                                    </h2>
                                    <p className="text-base md:text-lg leading-relaxed text-tarafe-black/80"  dangerouslySetInnerHTML={{ __html: feat.description || 'Description à venir...' }}  />

                                    <Link  href={feat.link || "#"} className="underline font-semibold inline-flex items-center gap-2 text-tarafe-black hover:gap-4 transition-all duration-300" >
                                        En savoir plus
                                        <span>→</span>
                                    </Link>
                                </div>

                                {/* Image */}
                                <div className={`rounded-xl overflow-hidden ${feat.reverse === 1 ? "md:order-1" : "md:order-2"  }`}  >
                                    {feat.image ? (
                                        <Image src={`${urlImages}/${feat.image}`}  alt={feat.title}  width={600}   height={400}  className="w-full h-auto"  unoptimized />
                                    ) : (
                                        <div className="w-full h-[300px] md:h-[400px] bg-tarafe-gray flex items-center justify-center">
                                            <span className="text-tarafe-black/50">Image à venir</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContainer>
            </div>
        </section>
    );
}