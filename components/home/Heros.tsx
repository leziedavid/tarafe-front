"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function Heros() {
    return (
        <section className="w-full bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 lg:py-2 grid lg:grid-cols-2 gap-14 items-center">

                {/* LEFT CONTENT */}
                <div className="space-y-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-black uppercase">
                        Commandez vos packagings, <br />
                        Pour un effet <br />
                        <span className="text-transparent bg-[#fd980e] bg-clip-text">
                            wahou !
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                        Découvrez un univers de tendances et de collections exclusives conçues pour s&apos;harmoniser avec votre style de vie unique. Tarafé transforme votre vision de la mode en réalité.
                    </p>

                    {/* BUTTONS */}
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-[#fd980e] text-white px-7 py-4 rounded-full font-semibold hover:opacity-90 transition">  Nouvelle Collection </button>

                        <button className="border border-gray-300 px-7 py-4 rounded-full font-semibold hover:bg-gray-50 transition">
                            Nos Tarifs
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE + FLOATING CARDS */}
                <div className="relative flex justify-center lg:justify-end">
                    {/* Portrait */}
                    <div className="relative w-[420px] h-[520px] rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src="/ads/fille-noir.jpg"
                            alt="Portrait client"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Floating card 1 */}
                    <div className="absolute bottom-20 -left-10 bg-white shadow-xl rounded-2xl p-4 w-64 border">
                        <p className="text-sm font-semibold mb-2">Mes commandes</p>
                        <div className="h-2 bg-gray-200 rounded mb-2" />
                        <div className="h-2 bg-gray-200 rounded mb-2 w-4/5" />
                        <div className="h-2 bg-gray-200 rounded w-3/5" />
                    </div>

                    {/* Floating card 2 */}
                    <div className="absolute -bottom-8 right-0 bg-white shadow-xl rounded-2xl p-4 w-56 border">
                        <p className="text-sm font-semibold mb-3">Historique</p>
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-200 rounded" />
                            <div className="h-2 bg-gray-200 rounded" />
                            <div className="h-2 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
