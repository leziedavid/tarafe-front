"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function Heros() {
    return (
        <section className="w-full overflow-x-hidden bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-2 grid lg:grid-cols-2 gap-14 items-center">

                {/* LEFT CONTENT */}
                <div className="space-y-6 sm:space-y-8">

                    {/* TITLE */}
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tight uppercase">
                        Commandez vos packagings, <br />
                        Pour un effet <br />
                        <span className="text-transparent bg-brand-primary bg-clip-text">
                            wahou !
                        </span>
                    </h1>

                    {/* DESCRIPTION */}
                    <p className="text-sm sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                        Découvrez un univers de tendances et de collections exclusives
                        conçues pour s&apos;harmoniser avec votre style de vie unique.
                        Tarafé transforme votre vision de la mode en réalité.
                    </p>

                    {/* BUTTONS */}
                    <div className="flex flex-wrap gap-4">

                        {/* Primary */}
                        <button
                            className="bg-brand-primary text-white px-5 sm:px-7 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition " >
                            Nouvelle Collection
                        </button>

                        {/* Secondary */}
                        <button className="border border-border bg-card text-foreground px-5 sm:px-7 py-3 sm:py-4 rounded-full font-semibold hover:bg-muted transition" >
                            Nos Tarifs
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE + FLOATING CARDS */}
                <div className="relative flex justify-center lg:justify-end">

                    {/* IMAGE */}
                    <div className=" relative w-full aspect-[4/5] sm:aspect-[4/5] lg:w-[420px] lg:h-[520px] lg:aspect-auto rounded-3xl overflow-hidden dark:shadow-black/40 " >
                        <Image src="/ads/fille-noir.jpg" alt="Portrait client" fill className="object-cover" sizes="(max-width:768px) 100vw, 420px" />
                    </div>

                    {/* Floating card 1 */}
                    <div className=" absolute hidden sm:block bottom-20 -left-10 bg-card text-card-foreground shadow-lg dark:shadow-black/40 rounded-2xl p-4 w-64 border border-border " >
                        <p className="text-sm font-semibold mb-2">Mes commandes</p>
                        <div className="h-2 bg-muted rounded mb-2" />
                        <div className="h-2 bg-muted rounded mb-2 w-4/5" />
                        <div className="h-2 bg-muted rounded w-3/5" />
                    </div>

                    {/* Floating card 2 */}
                    <div className=" absolute hidden sm:block -bottom-8 right-0 bg-card text-card-foreground shadow-lg dark:shadow-black/40 rounded-2xl p-4 w-56 border border-border " >
                        <p className="text-sm font-semibold mb-3">Historique</p>
                        <div className="space-y-2">
                            <div className="h-2 bg-muted rounded" />
                            <div className="h-2 bg-muted rounded" />
                            <div className="h-2 bg-muted rounded" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
