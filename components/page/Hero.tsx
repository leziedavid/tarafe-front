"use client";

import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Hero() {
    return (
        <section className="max-w-7xl mx-auto px-3 md:px-6 py-6">
            <div
                className="
                    bg-[#242078] text-white rounded-3xl overflow-hidden
                    flex flex-row items-center justify-between
                    h-[320px] sm:h-[360px] md:h-[520px]
                "
            >
                {/* ==== LEFT SIDE ==== */}
                <div
                    className="
                        flex-1 flex flex-col justify-center
                        px-3 sm:px-6 md:px-16 space-y-3 sm:space-y-4
                        transform scale-[0.8] sm:scale-[0.9] md:scale-100
                        origin-center
                    "
                >
                    {/* Social Icons */}
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-1 sm:mb-2 md:mb-4">
                        {[Instagram, Facebook, Twitter].map((Icon, index) => (
                            <Icon
                                key={index}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-300 hover:text-[#fd980e] cursor-pointer transition-colors duration-200"
                            />
                        ))}
                    </div>

                    {/* Title avec dégradé */}
                    <h2
                        className="
                            text-[clamp(1.1rem,4vw,2rem)] md:text-5xl font-extrabold leading-tight 
                            bg-gradient-to-r from-[#fd980e] via-white to-[#fd980e]
                            text-transparent bg-clip-text
                        "
                    >
                        Affirmez votre style avec une mode audacieuse
                    </h2>

                    {/* Description */}
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-md leading-snug">
                        Découvrez un univers de tendances et de collections exclusives conçues
                        pour s'harmoniser avec votre style de vie unique.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 md:mt-5">
                        <button
                            className="
                                bg-[#fd980e] text-white 
                                px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full 
                                font-semibold text-xs sm:text-sm md:text-base
                                hover:bg-white hover:text-[#fd980e] transition-colors duration-200
                            "
                        >
                            Explorer →
                        </button>
                        <button
                            className="
                                border border-[#fd980e] text-[#fd980e] 
                                px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full 
                                font-semibold text-xs sm:text-sm md:text-base
                                hover:bg-[#fd980e] hover:text-white transition-colors duration-200
                            "
                        >
                            En savoir plus
                        </button>
                    </div>
                </div>

                {/* ==== RIGHT SIDE ==== */}
                <div className="flex-1 relative w-full h-full md:rounded-r-3xl overflow-hidden">
                    <Image
                        src="/ads/fille-noir.jpg"
                        alt="Fashion Banner"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
