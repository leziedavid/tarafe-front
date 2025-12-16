"use client";

import Image from "next/image";

// -----------------------------
// Fake Data
// -----------------------------
interface HeroSlide {
    id: number;
    image: string;
    titleLines: string[];
}

const heroSlides: HeroSlide[] = [
    {
        id: 1,
        image: "/ads/images.jpg",
        titleLines: [
            "Tarafé est une plateforme digitale de personnalisation",
            "des produits mode, accessoires et déco, avec une touche africaine,",
            "pour les entreprises et les particuliers. Bienvenue !"
        ],
    },
];

// -----------------------------
// Component
// -----------------------------
export default function ProductHero() {
    return (
        <div className="overflow-hidden">
            <div className="flex -ml-4" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
                {heroSlides.map((slide) => (
                    <div key={slide.id} role="group" aria-roledescription="slide" className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                        <div className="relative">
                            <span className="inline-flex items-center justify-center font-normal select-none shrink-0 bg-secondary overflow-hidden text-xs w-full h-[12rem] md:h-[17rem] rounded-xl md:rounded-3xl relative">

                                {/* Image */}
                                <Image
                                    src={slide.image}
                                    alt="Hero Slide"
                                    fill
                                    className="object-cover rounded-xl md:rounded-3xl"
                                />
                                {/* Overlay */}
                                <div className="absolute top-0 left-0 w-full h-full">
                                    <div className="relative w-full h-full">
                                        {slide.titleLines.map((line, index) => (
                                            <div
                                                key={index}
                                                className={`absolute left-4 md:left-24 z-${30 - index * 10}  bg-primary/50 shadow-lg shadow-black/20  text-white uppercase font-black  pt-2 pb-1 px-2 text-xs md:text-2xl `}
                                                style={{  top: `${1.5 + index * 2.5}rem`, // mobile: plus serré
                                                }} >
                                                {line}
                                            </div>
                                        ))}
                                    </div>
                                </div>


                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
