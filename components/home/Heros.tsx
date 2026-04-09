"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { getImagesUrl } from "@/types/baseUrl";
import { Hero } from "@/types/interfaces";

interface HeroProps {
    heros: Hero[];
}

// Stagger container for children animations
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

// -----------------------------
// Skeleton
// -----------------------------
function HeroSkeleton() {
    return (
        <section className="relative w-full lg:min-h-screen flex flex-col items-center overflow-hidden bg-[#0c0c14]">
            <div className="h-24 md:h-32 w-full shrink-0" />
            <div className="container mx-auto px-6 md:px-12 pt-8 pb-20 lg:py-0 w-full animate-pulse">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-8">
                    <div className="space-y-6 max-w-xl">
                        <div className="h-5 w-32 bg-white/10 rounded-full" />
                        <div className="space-y-3">
                            <div className="h-14 md:h-16 bg-white/10 rounded-xl w-3/4" />
                            <div className="h-14 md:h-16 bg-white/10 rounded-xl w-full" />
                            <div className="h-14 md:h-16 bg-white/10 rounded-xl w-5/6" />
                        </div>
                        <div className="h-5 bg-white/10 rounded-lg w-2/3" />
                        <div className="h-5 bg-white/10 rounded-lg w-1/2" />
                        <div className="flex gap-3 mt-6">
                            <div className="h-13 w-40 bg-white/15 rounded-full" />
                            <div className="h-13 w-40 bg-white/5 border border-white/10 rounded-full" />
                        </div>
                    </div>
                    <div className="hidden lg:flex justify-center items-center">
                        <div className="w-[420px] aspect-square bg-white/5 rounded-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// -----------------------------
// Main Component
// -----------------------------
export default function Heros({ heros }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const urlImages = getImagesUrl();

    useEffect(() => {
        if (heros.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heros.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heros.length]);

    if (!heros || heros.length === 0) return <HeroSkeleton />;

    const currentHero = heros[currentSlide];
    const slideLabel = `${String(currentSlide + 1).padStart(2, "0")} / ${String(heros.length).padStart(2, "0")}`;

    const goTo = (index: number) => setCurrentSlide(index);
    const goPrev = () => setCurrentSlide((p) => (p - 1 + heros.length) % heros.length);
    const goNext = () => setCurrentSlide((p) => (p + 1) % heros.length);

    return (
        <section className="relative w-full lg:min-h-screen flex flex-col items-center overflow-hidden bg-[#07070f]">

            {/* ── Full-bleed Background Image ── */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={currentHero.image ? `${urlImages}/${currentHero.image}` : "/hero-mockup.png"}
                            alt="Hero Background"
                            fill
                            className="object-cover scale-105"
                            priority
                            unoptimized
                        />
                        {/* Left gradient – ensures text is readable */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
                        {/* Bottom fade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Slide progress bar (thin, animates 0→100% in 6s) ── */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-30">
                <motion.div
                    key={currentSlide}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full bg-brand-primary origin-left"
                />
            </div>

            {/* ── Navbar spacer ── */}
            <div className="h-24 md:h-32 w-full shrink-0 z-10" />

            {/* ── Main Content ── */}
            <div className="container relative z-20 mx-auto px-6 md:px-12 pt-6 pb-24 lg:pb-16 lg:pt-0 grid">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={currentSlide}
                        className="relative grid lg:grid-cols-2 gap-12 lg:gap-6 items-center col-start-1 row-start-1"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        variants={containerVariants}
                    >
                        {/* ── LEFT: Text Content ── */}
                        <div className="max-w-xl space-y-7 z-20 flex flex-col items-start">

                            {/* Slide counter */}
                            <motion.div variants={itemVariants} className="flex items-center gap-3">
                                <span className="w-8 h-px bg-brand-primary" />
                                <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">
                                    {slideLabel}
                                </span>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05]"
                            >
                                <span className="text-white">{currentHero.title}</span>
                                {currentHero.highlight_text && (
                                    <>
                                        {" "}
                                        <span className="text-brand-primary">
                                            {currentHero.highlight_text}
                                        </span>
                                    </>
                                )}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                variants={itemVariants}
                                className="text-base md:text-lg text-white/70 max-w-md leading-relaxed font-normal"
                                dangerouslySetInnerHTML={{
                                    __html: currentHero.description || "Personnalisation de produits mode, accessoires et déco avec une touche africaine.",
                                }}
                            />

                            {/* CTA Buttons */}
                            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 w-full sm:w-auto pt-1">
                                {currentHero.primary_button_text && (
                                    <Link
                                        href={currentHero.primary_button_link || "/auth/register"}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-brand-primary/30 whitespace-nowrap"
                                    >
                                        {currentHero.primary_button_text}
                                        <Icon icon="solar:alt-arrow-right-bold" width={16} />
                                    </Link>
                                )}
                                {currentHero.secondary_button_text && (
                                    <Link
                                        href={currentHero.secondary_button_link || "#"}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white text-sm font-bold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm whitespace-nowrap"
                                    >
                                        {currentHero.secondary_button_text}
                                    </Link>
                                )}
                            </motion.div>
                        </div>

                        {/* ── RIGHT: Floating Product Image ── */}
                        <motion.div
                            variants={itemVariants}
                            className="hidden lg:flex justify-center items-center relative"
                        >
                            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">

                                {/* Decorative glow rings */}
                                <div className="absolute w-[75%] h-[75%] rounded-full bg-brand-primary/15 blur-[80px]" />
                                <div className="absolute w-[45%] h-[45%] rounded-full bg-white/5 blur-[40px] translate-x-16 -translate-y-10" />

                                {/* Decorative ring */}
                                <div className="absolute w-[88%] h-[88%] rounded-full border border-white/8" />
                                <div className="absolute w-[72%] h-[72%] rounded-full border border-brand-primary/20" />

                                {/* Product Image */}
                                <div className="relative z-10 w-[90%] h-[90%]">
                                    <Image
                                        src={currentHero.image ? `${urlImages}/${currentHero.image}` : "/hero-mockup.png"}
                                        alt={currentHero.title}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                        unoptimized
                                    />
                                </div>

                                {/* Floating badge – top right */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="absolute top-6 right-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                                        <Icon icon="solar:star-bold" className="text-brand-primary w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-sm leading-none">4.9</p>
                                        <p className="text-white/50 text-[10px] mt-0.5">Satisfaction</p>
                                    </div>
                                </motion.div>

                                {/* Floating badge – bottom left */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    className="absolute bottom-10 -left-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <Icon icon="solar:shield-check-bold" className="text-emerald-400 w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-sm leading-none">100%</p>
                                        <p className="text-white/50 text-[10px] mt-0.5">Personnalisé</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* ── Slide Controls ── */}
                <div className="flex items-center justify-between mt-10 lg:mt-14 relative z-10">

                    {/* Dots */}
                    {heros.length > 1 && (
                        <div className="flex items-center gap-2">
                            {heros.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`rounded-full transition-all duration-300 ${i === currentSlide ? "w-7 h-1.5 bg-brand-primary" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Arrow navigation */}
                    {heros.length > 1 && (
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={goPrev}
                                className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all backdrop-blur-sm"
                            >
                                <Icon icon="solar:alt-arrow-left-bold" width={16} />
                            </button>
                            <button
                                onClick={goNext}
                                className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all backdrop-blur-sm"
                            >
                                <Icon icon="solar:alt-arrow-right-bold" width={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Scroll Indicator ── */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 hidden lg:flex"
            >
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-2 bg-white/60 rounded-full" />
                </motion.div>
                <span className="text-white/35 text-[9px] uppercase tracking-widest font-bold">Scroll</span>
            </motion.div>
        </section>
    );
}
