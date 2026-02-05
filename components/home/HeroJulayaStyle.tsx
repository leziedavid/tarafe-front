"use client";

import Image from "next/image";

export default function HerotarafeStyle() {
    return (
        <section className="w-full bg-tarafe-gray">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                {/* Grand conteneur arrondi avec dégradé */}
                <div className="bg-gradient-to-br from-tarafe-lavender to-tarafe-blue rounded-tarafe p-12 md:p-20 animate-fadeIn">

                    <div className="grid md:grid-cols-5 gap-12 items-center">
                        {/* Colonne gauche: 60% (3/5) */}
                        <div className="md:col-span-3 space-y-8">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.1] text-tarafe-black">
                                AFFIRMEZ VOTRE STYLE{" "}
                                <span className="text-transparent bg-[#fd980e] bg-clip-text">
                                    AVEC UNE MODE AUDACIEUSE
                                </span>
                            </h1>

                            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-tarafe-black/80 max-w-2xl">
                                Découvrez un univers de tendances et de collections exclusives conçues pour s&apos;harmoniser avec votre style de vie unique. Tarafé transforme votre vision de la mode en réalité.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="bg-gradient-to-r from-[#fd980e] to-[#f59e0b] text-white px-8 py-4 rounded-full font-semibold text-sm md:text-base hover:scale-105 hover:shadow-lg transition-all duration-300">
                                    Découvrir la collection
                                </button>

                                <button className="bg-transparent border-2 border-tarafe-black text-tarafe-black px-8 py-4 rounded-full font-semibold text-sm md:text-base hover:bg-tarafe-black hover:text-white transition-all duration-300">
                                    Nos tarifs
                                </button>
                            </div>
                        </div>

                        {/* Colonne droite: 40% (2/5) */}
                        <div className="md:col-span-2 relative">
                            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
                                <Image src="/ads/fille-noir.jpg" alt="Fashion Banner" fill className="object-cover object-center" priority quality={90} />

                                {/* UI Card flottante (style tarafe) */}
                                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4  max-w-[200px]">
                                    <p className="text-xs font-semibold text-tarafe-black/70 mb-1">Nouvelle arrivée</p>
                                    <p className="text-lg font-black text-tarafe-black">Collection Été</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
