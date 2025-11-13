"use client";

import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function MonthlyAd() {
    return (
        <section className="max-w-7xl mx-auto px-3 md:px-6 py-10 md:py-16">
            <div
                className="
                    bg-[#242078] text-white rounded-3xl overflow-hidden
                    flex flex-col md:flex-row items-stretch justify-between
                "
            >
                {/* ==== LEFT SIDE ==== */}
                <div className="flex-1 p-6 sm:p-10 md:p-16 flex flex-col justify-center">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                        {[Instagram, Facebook, Twitter].map((Icon, index) => (
                            <Icon
                                key={index}
                                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-[#fd980e] cursor-pointer transition-colors duration-200"
                            />
                        ))}
                    </div>

                    {/* Title avec dégradé */}
                    <h2
                        className="
                            text-[clamp(1.5rem,5vw,2.8rem)] md:text-5xl font-extrabold leading-tight mb-4 sm:mb-6
                            bg-gradient-to-r from-[#fd980e] via-white to-[#fd980e]
                            text-transparent bg-clip-text
                        "
                    >
                        TENDANCES ET <br /> STYLES DE LA MODE
                    </h2>

                    {/* Description */}
                    <p className="text-gray-300 max-w-md mb-6 sm:mb-8 text-sm sm:text-base leading-snug">
                        Découvrez un large choix d&apos;articles de mode : vêtements,
                        chaussures, accessoires et bien plus encore.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <button
                            className="
                                bg-[#fd980e] text-white 
                                px-4 sm:px-6 py-1.5 sm:py-2 rounded-full 
                                font-semibold text-sm sm:text-base
                                hover:bg-white hover:text-[#fd980e] transition-colors duration-200
                            "
                        >
                            En savoir plus
                        </button>
                    </div>
                </div>

                {/* ==== RIGHT SIDE ==== */}
                <div className="flex-1 relative w-full md:rounded-r-3xl overflow-hidden">
                    <div className="relative h-[300px] sm:h-[400px] md:h-[550px] w-full">
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
            </div>
        </section>
    );
}
