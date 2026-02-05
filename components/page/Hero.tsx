"use client";

import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Hero() {
    return (
        <>

            <section className="relative w-full max-w-7xl mx-auto px-3 md:px-6 py-8 sm:py-12 md:py-16 animate-fadeIn">
                {/* Conteneur principal */}
                <div className="relative w-full h-[280px] sm:h-[380px] md:h-[520px] lg:h-[600px] rounded-card-lg overflow-hidden shadow-xl">
                    {/* Image de fond */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image src="/ads/fille-noir.jpg" alt="Fashion Banner" fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 1920px" className="object-cover object-center" priority quality={90} />

                        {/* Overlay dégradé pour améliorer la lisibilité */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#242078]/90 via-[#242078]/50 to-transparent md:bg-gradient-to-r md:from-[#242078]/80 md:via-[#242078]/40 md:to-transparent" />

                        {/* Overlay coloré subtil */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#242078]/20 to-transparent mix-blend-overlay" />
                    </div>

                    {/* Contenu overlay */}
                    <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-14 overflow-hidden">
                        {/* Partie supérieure avec icônes sociaux */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                {[Instagram, Facebook, Twitter].map((Icon, index) => (
                                    <button key={index} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-[#fd980e] hover:scale-110 transition-all duration-300 flex-shrink-0" aria-label={`Suivez-nous sur ${Icon.name}`}>
                                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                                    </button>
                                ))}
                            </div>

                            {/* Badge optionnel */}
                            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#fd980e] text-white text-xs rounded-pill font-semibold backdrop-blur-sm whitespace-nowrap flex-shrink-0">
                                Nouvelle Collection
                            </span>
                        </div>

                        {/* Contenu principal - Centre vertical */}
                        <div className="flex-1 flex flex-col justify-center max-w-full md:max-w-xl space-y-4 sm:space-y-5 md:space-y-7 mt-4 sm:mt-0">
                            {/* Titre ajusté */}
                            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight text-white drop-shadow-xl max-w-[300px] sm:max-w-lg md:max-w-xl whitespace-normal break-words">
                                <span className="block">Affirmez votre style</span>
                                <span className="block text-transparent bg-gradient-to-r from-[#fd980e] via-[#ffb24d] to-[#fd980e] bg-clip-text text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                                    avec une mode audacieuse
                                </span>
                            </h1>


                            {/* Description ajustée */}
                            <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-[280px] sm:max-w-md md:max-w-lg break-words whitespace-normal backdrop-blur-sm bg-black/20 p-3 sm:p-4 rounded-card line-clamp-3 sm:line-clamp-none">
                                Découvrez un univers de tendances et de collections exclusives conçues pour s&apos;harmoniser avec votre style de vie unique.
                            </p>


                            {/* Boutons avec taille ajustée */}
                            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                                <button className="group relative px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 bg-gradient-to-r from-[#fd980e] to-[#ffb24d] text-white font-semibold rounded-pill hover:shadow-lg hover:shadow-[#fd980e]/30 transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base whitespace-nowrap">
                                    <span className="flex items-center gap-2">
                                        Explorer
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </span>
                                </button>

                                <button className="group px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 border-2 border-white text-white font-semibold rounded-pill backdrop-blur-sm bg-white/10 hover:bg-white hover:text-[#242078] transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base whitespace-nowrap">
                                    En savoir plus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>

    );
}
