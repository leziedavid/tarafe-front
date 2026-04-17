"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

// -----------------------------
// Types
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
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (data.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((i) => (i + 1) % data.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [data.length]);

    const slide = data[activeIndex];

    return (
        <div className="relative w-full h-[16rem] md:h-[24rem] rounded-2xl md:rounded-3xl overflow-hidden mt-12 md:mt-0">
            {/* Background Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0" >
                    <Image src={slide.image} alt="Hero" fill className="object-cover" priority />
                </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Content */}
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-14 lg:px-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 max-w-lg"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 text-brand-primary font-bold text-[10px] uppercase tracking-widest"
                        >
                            <span className="w-4 h-px bg-brand-primary" />
                            Collection Tarafé
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight"
                        >
                            {slide.titleLines[0]}
                        </motion.h1>

                        {slide.titleLines[1] && (
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/70 text-xs md:text-sm leading-relaxed hidden sm:block line-clamp-2"
                            >
                                {slide.titleLines[1]}
                            </motion.p>
                        )}

                        <motion.button
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-xl shadow-brand-primary/30 hover:bg-brand-secondary transition-all"
                        >
                            Découvrir
                            <Icon icon="solar:alt-arrow-right-bold" width={14} />
                        </motion.button>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Slide Dots */}
            {data.length > 1 && (
                <div className="absolute bottom-5 right-5 flex gap-1.5">
                    {data.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-brand-primary" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
