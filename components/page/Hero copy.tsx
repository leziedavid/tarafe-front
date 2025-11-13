"use client";

import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Hero() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-6">
            <div className="bg-black text-white rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0">
                {/* ==== LEFT SIDE ==== */}
                <div className="flex-1 p-10 md:p-16">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-5 mb-6">
                        <Instagram className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition" />
                        <Facebook className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition" />
                        <Twitter className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition" />
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                        Elevate Your Style <br /> With Bold Fashion
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 max-w-md mb-8">
                        Discover a world of trends and exclusive collections designed to match your unique lifestyle.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                            Explore Collections →
                        </button>
                        <button className="border border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-black transition">
                            Learn More
                        </button>
                    </div>
                    
                </div>

                {/* ==== RIGHT SIDE ==== */}
                <div className="flex-1 relative w-full md:rounded-r-3xl overflow-hidden">
                    {/* ⚡ Correction : on donne une taille fixe et on garde fill */}
                    <div className="relative w-full h-[400px] md:h-[600px]">
                        <Image src="/ads/fille-noir.jpg"  alt="Fashion Banner"  fill sizes="(max-width: 768px) 100vw, 50vw"  className="object-cover object-center"  priority />
                    </div>
                </div>
            </div>
        </section>
    );
}
