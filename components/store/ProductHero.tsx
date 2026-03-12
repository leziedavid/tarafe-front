"use client";

import Image from "next/image";

// -----------------------------
// Fake Data
// -----------------------------
export interface HeroSlide {
    id: number;
    image: string;
    titleLines: string[];
}

interface ProductHeroProps {
    data: HeroSlide[];
}

// -----------------------------
// Component
// -----------------------------
export default function ProductHero({ data }: ProductHeroProps) {
    return (
        <div className="overflow-hidden mt-12 md:mt-0">
            <div className="flex -ml-4" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
                {data.map((slide) => (
                    <div key={slide.id} role="group" aria-roledescription="slide" className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                        <div className="relative">
                            <span className="inline-flex items-center justify-center font-normal select-none shrink-0 bg-secondary overflow-hidden text-xs w-full h-[12rem] md:h-[17rem] rounded-xl md:rounded-3xl relative">

                                {/* Image */}
                                <Image src={slide.image} alt="Hero Slide" fill className="object-cover rounded-xl md:rounded-3xl" />
                                {/* Overlay */}
                                <div className="absolute top-0 left-0 w-full h-full">
                                    <div className="relative w-full h-full">
                                        {slide.titleLines.map((line, index) => (
                                            <div key={index} className={`absolute left-4 md:left-24 z-${30 - index * 10}  bg-primary/50 shadow-lg shadow-black/20  text-white uppercase font-black  pt-2 pb-1 px-2 text-xs md:text-2xl `} style={{ top: `${1.5 + index * 2.5}rem`, }} >
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
