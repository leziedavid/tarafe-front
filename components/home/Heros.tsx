"use client";

import Image from "next/image";
import { Hero } from "@/types/interfaces";
import { useState, useEffect } from "react";
import { getImagesUrl } from "@/types/baseUrl";
import Link from "next/link";

interface HeroProps {
    heros: Hero[];
}


function highlightTextInTitle(title: string, highlight?: string | null) {
    if (!title) return null;
    return (
        <>
            {title}
            {highlight && (
                <> <br />  <span className="text-transparent bg-brand-primary bg-clip-text">  {highlight}  </span>
                </>
            )}
        </>
    );
}


// SKELETON COMPONENT - VERSION AMÉLIORÉE
function HeroSkeleton() {
    return (
        <section className="w-full overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20 text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-2 grid lg:grid-cols-2 gap-14 items-center">

                {/* LEFT CONTENT SKELETON */}
                <div className="space-y-6 sm:space-y-8">
                    {/* BADGE SKELETON - pour plus de style */}
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-brand-primary/30 to-brand-primary/10 animate-pulse" />
                        <div className="h-4 w-24 rounded-full bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/5 animate-pulse" />
                    </div>

                    {/* TITLE SKELETON - avec dégradé et animation */}
                    <div className="space-y-3">
                        <div className="relative">
                            <div className="h-12 sm:h-16 lg:h-20 bg-gradient-to-r from-muted via-muted/80 to-muted rounded-lg w-3/4 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
                        </div>
                        <div className="relative">
                            <div className="h-12 sm:h-16 lg:h-20 bg-gradient-to-r from-muted via-muted/80 to-muted rounded-lg w-2/3 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <div className="relative">
                            <div className="h-12 sm:h-16 lg:h-20 bg-gradient-to-r from-muted via-muted/80 to-muted rounded-lg w-1/2 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>

                    {/* DESCRIPTION SKELETON - avec vague plus subtile */}
                    <div className="space-y-3">
                        <div className="relative">
                            <div className="h-4 bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/15 to-muted-foreground/20 rounded w-full animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer" />
                        </div>
                        <div className="relative">
                            <div className="h-4 bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/15 to-muted-foreground/20 rounded w-5/6 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer" style={{ animationDelay: '0.15s' }} />
                        </div>
                        <div className="relative">
                            <div className="h-4 bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/15 to-muted-foreground/20 rounded w-4/6 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer" style={{ animationDelay: '0.3s' }} />
                        </div>
                    </div>

                    {/* BUTTONS SKELETON - avec effet de glow */}
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <div className="bg-gradient-to-r from-brand-primary/30 via-brand-primary/20 to-brand-primary/30 rounded-full w-48 h-12 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent rounded-full animate-shimmer" />
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-r from-muted via-muted/80 to-muted rounded-full w-36 h-12 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent rounded-full animate-shimmer" style={{ animationDelay: '0.2s' }} />
                        </div>
                    </div>
                </div>

                {/* RIGHT IMAGE SKELETON - avec overlay stylisé */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] lg:w-[420px] lg:h-[520px] lg:aspect-auto rounded-3xl overflow-hidden">
                        {/* Image placeholder avec dégradé */}
                        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60 animate-pulse" />

                        {/* Motif géométrique subtil */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-2xl rotate-12" />
                            <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        </div>

                        {/* Vague lumineuse */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-white/10 to-transparent animate-shimmer" />

                        {/* Floating cards skeleton - visibles même en skeleton */}
                        <div className="absolute hidden sm:block bottom-20 -left-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg dark:shadow-black/40 rounded-2xl p-4 w-64 border border-white/30 dark:border-gray-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-brand-primary/30 to-brand-primary/10 animate-pulse" />
                                <div className="h-3 w-24 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10 rounded animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/20 to-muted-foreground/30 rounded w-full animate-pulse" />
                                <div className="h-2 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/20 to-muted-foreground/30 rounded w-4/5 animate-pulse" />
                                <div className="h-2 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/20 to-muted-foreground/30 rounded w-3/5 animate-pulse" />
                            </div>
                        </div>

                        <div className="absolute hidden sm:block -bottom-8 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg dark:shadow-black/40 rounded-2xl p-4 w-56 border border-white/30 dark:border-gray-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10 animate-pulse" />
                                <div className="h-3 w-20 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10 rounded animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/20 to-muted-foreground/30 rounded animate-pulse" />
                                <div className="h-2 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/20 to-muted-foreground/30 rounded animate-pulse" />
                                <div className="h-2 bg-gradient-to-r from-muted-foreground/30 via-muted-foreground/20 to-muted-foreground/30 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


// SLIDER INDICATOR COMPONENT
function SliderIndicator({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex justify-center items-center gap-2 mt-8 lg:mt-0 lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2">
            {Array.from({ length: total }).map((_, index) => (
                <div
                    key={index}
                    className={`
                        h-1.5 rounded-full transition-all duration-300
                        ${index === current
                            ? 'w-8 bg-brand-primary'
                            : 'w-4 bg-muted-foreground/30'
                        }
                    `}
                />
            ))}
        </div>
    );
}

export default function Heros({ heros }: HeroProps) {

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const urlImages = getImagesUrl();

    // MONITEUR : tant qu'il n'y a pas de données, le skeleton est affiché
    useEffect(() => {
        if (heros && heros.length > 0) {
            setIsLoading(false);
        }
    }, [heros]);

    const isMultipleHeros = heros?.length > 1;

    // Auto-slide si plusieurs héros
    useEffect(() => {
        if (!isMultipleHeros || !heros?.length || isLoading) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heros.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isMultipleHeros, heros?.length, isLoading]);

    // Affiche le skeleton pendant le chargement
    if (isLoading) {
        return <HeroSkeleton />;
    }

    // Si pas de données, ne rien afficher
    if (!heros?.length) {
        return null;
    }

    // Si un seul hero, affichage normal
    if (!isMultipleHeros) {
        const hero = heros[0];
        return (
            <section className="w-full overflow-x-hidden bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-2 grid lg:grid-cols-2 gap-14 items-center">

                    {/* LEFT CONTENT */}
                    <div className="space-y-6 sm:space-y-8">
                        {/* TITLE */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase">
                            {highlightTextInTitle(hero.title, hero.highlight_text)}
                        </h1>

                        {/* DESCRIPTION */}
                        {hero.description && (
                            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: hero.description }} />
                        )}

                        {/* BUTTONS */}
                        {(hero.primary_button_text || hero.secondary_button_text) && (
                            <div className="flex flex-wrap gap-4">
                                {hero.primary_button_text && hero.primary_button_link && (
                                    <Link href={hero.primary_button_link} className="bg-brand-primary text-white px-5 sm:px-7 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition" >
                                        {hero.primary_button_text}
                                    </Link>
                                )}
                                {hero.secondary_button_text && hero.secondary_button_link && (
                                    <Link href={hero.secondary_button_link}  className="border border-border bg-card text-foreground px-5 sm:px-7 py-3 sm:py-4 rounded-full font-semibold hover:bg-muted transition"  >
                                        {hero.secondary_button_text}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT IMAGE */}
                    {hero.image && (
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] lg:w-[420px] lg:h-[520px] lg:aspect-auto rounded-3xl overflow-hidden dark:shadow-black/40">
                                <Image src={`${urlImages}/${hero.image}`} alt={hero.title || "Hero image"} fill className="object-cover" sizes="(max-width:768px) 100vw, 420px" unoptimized />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // MODE SLIDER : plusieurs héros
    const currentHero = heros[currentSlide];

    return (
        <section className="w-full overflow-x-hidden bg-background text-foreground relative pb-16 lg:pb-0">

            {/* OVERLAY */}
            {/* <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" /> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-2 grid lg:grid-cols-2 gap-14 items-center">

                {/* LEFT CONTENT - SLIDE ACTUEL */}
                <div className="space-y-6 sm:space-y-8">
                    {/* TITLE */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase">
                        {highlightTextInTitle(currentHero.title, currentHero.highlight_text)}
                    </h1>

                    {/* DESCRIPTION */}
                    {currentHero.description && (
                        <p className="text-sm sm:text-lg text-muted-foreground max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: currentHero.description }} />
                    )}

                    {/* BUTTONS */}
                    {(currentHero.primary_button_text || currentHero.secondary_button_text) && (
                        <div className="flex flex-wrap gap-4">
                            {currentHero.primary_button_text && currentHero.primary_button_link && (
                                <Link
                                    href={currentHero.primary_button_link}
                                    className="bg-brand-primary text-white px-5 sm:px-7 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition"
                                >
                                    {currentHero.primary_button_text}
                                </Link>
                            )}
                            {currentHero.secondary_button_text && currentHero.secondary_button_link && (
                                <Link
                                    href={currentHero.secondary_button_link}
                                    className="border border-border bg-card text-foreground px-5 sm:px-7 py-3 sm:py-4 rounded-full font-semibold hover:bg-muted transition"
                                >
                                    {currentHero.secondary_button_text}
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT IMAGE - SLIDE ACTUEL */}
                {currentHero.image && (
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] lg:w-[420px] lg:h-[520px] lg:aspect-auto rounded-3xl overflow-hidden dark:shadow-black/40">
                            <Image
                                src={`${urlImages}/${currentHero.image}`}
                                alt={currentHero.title || "Hero image"}
                                fill
                                className="object-cover transition-opacity duration-500"
                                sizes="(max-width:768px) 100vw, 420px"
                                unoptimized
                            />

                        </div>
                    </div>
                )}
            </div>

            {/* INDICATEURS SLIDER - UNIQUEMENT DES PETITS TRAITS */}
            <SliderIndicator total={heros.length} current={currentSlide} />
        </section>
    );
}