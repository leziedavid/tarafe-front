"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getImagesUrl } from "@/types/baseUrl";

import { Hero } from "@/types/interfaces";

interface HeroProps {
    heros: Hero[];
}

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

    if (!heros || heros.length === 0) {
        return (
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#242078] dark:bg-background">
                <div className="container relative z-10 mx-auto px-6 md:px-12 py-12 lg:py-0 w-full animate-pulse">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-20">
                        {/* Skeleton Content */}
                        <div className="max-w-2xl space-y-6 lg:pr-10 w-full">
                            <div className="space-y-4">
                                <div className="h-12 md:h-16 lg:h-20 bg-white/10 rounded-2xl w-3/4"></div>
                                <div className="h-12 md:h-16 lg:h-20 bg-white/10 rounded-2xl w-full"></div>
                                <div className="h-12 md:h-16 lg:h-20 bg-white/10 rounded-2xl w-5/6"></div>
                            </div>
                            <div className="h-6 md:h-8 bg-white/10 rounded-lg w-2/3 mt-6"></div>
                            <div className="h-6 md:h-8 bg-white/10 rounded-lg w-1/2"></div>

                            <div className="flex gap-3 w-full sm:w-auto mt-10">
                                <div className="h-12 sm:h-14 w-32 sm:w-40 bg-white/20 rounded-full"></div>
                                <div className="h-12 sm:h-14 w-32 sm:w-40 bg-white/5 border border-white/10 rounded-full"></div>
                            </div>
                        </div>

                        {/* Skeleton Image */}
                        <div className="relative flex justify-center items-center mt-12 lg:mt-0">
                            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
                                <div className="absolute w-full h-[120%] sm:h-full bg-white/5 rounded-full blur-3xl scale-110"></div>
                                <div className="relative z-10 w-3/4 h-3/4 bg-white/10 rounded-3xl drop-shadow-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const currentHero = heros[currentSlide];


    function highlightTextInTitle(title: string, highlight?: string | null) {
        if (!title) return null;
        return (
            <>
                <p className="text-white font-bold">{title}</p>
                {highlight && (
                    <> <span className="text-transparent bg-brand-primary bg-clip-text">  {highlight}  </span> </>
                )}
            </>
        );
    }

    return (
        //bg-[#0a1a10]
        <section className="relative w-full min-h-screen flex flex-col items-center overflow-hidden bg-[#242078] dark:bg-background">
            {/* Minimal spacing for transparent Navbar */}
            <div className="h-24 md:h-32 w-full shrink-0" />

            {/* Mesh Gradient Background */}
            {/* <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#1a4a2e] rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0f2e1e] rounded-full blur-[100px] opacity-30" />
            </div> */}

            <div className="container relative z-10 mx-auto px-6 md:px-12 py-2 lg:py-0">
                <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center" >
                        {/* Left Column: Text Content */}
                        <div className="max-w-2xl space-y-8 lg:pr-10">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="space-y-6"  >
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.05]">
                                    {highlightTextInTitle(currentHero.title, currentHero.highlight_text)}

                                    {/* {currentHero.title.split('\n').map((line, i) => (<span key={i}>{line}<br /></span>)) || "Smart way to manage money"} */}
                                </h1>
                                <p className="text-lg md:text-xl text-white max-w-md font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: currentHero.description || "Planning today lays the foundation for a secure and successful tomorrow." }} />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex gap-3 w-full sm:w-auto mt-6" >
                                {currentHero.primary_button_text && (
                                    <Link href={currentHero.primary_button_link || "/auth/register"} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-8 md:px-10 py-3 sm:py-3 bg-white text-[#0a1a10] text-xs sm:text-lg font-semibold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap" >
                                        {currentHero.primary_button_text}
                                    </Link>
                                )}
                                {currentHero.secondary_button_text && (
                                    <Link href={currentHero.secondary_button_link || "#"} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-8 md:px-10 py-3 sm:py-3 bg-transparent border border-white/20 text-white text-xs sm:text-lg font-semibold rounded-full hover:bg-white/10 transition-all duration-300 whitespace-nowrap" >
                                        {currentHero.secondary_button_text}
                                    </Link>
                                )}
                            </motion.div>

                        </div>

                        {/* Right Column: Dynamic Hero Image / App Mockup */}
                        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center items-center" >
                            <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
                                <div className="absolute w-full h-full bg-[#1a4a2e] rounded-full blur-[120px] opacity-20 scale-110" />

                                <div className="relative z-10 w-full h-[120%] sm:h-full scale-[1.15] sm:scale-100">
                                    <Image src={currentHero.image ? `${urlImages}/${currentHero.image}` : "/hero-mockup.png"} alt={currentHero.title} fill className="object-contain drop-shadow-2xl" priority unoptimized />
                                </div>

                                {/* Floating Card: Dynamic or Mockup style */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="absolute bottom-[10%] left-[-5%] md:left-[-10%] z-20 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-4 md:p-6 min-w-[240px] md:min-w-[280px] border border-white/10"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider font-semibold">Plus de </p>
                                                <h4 className="text-2xl md:text-3xl font-bold text-foreground">10000</h4>
                                                <p className="text-muted-foreground text-[10px] md:text-xs">Projets réalisés</p>
                                            </div>
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Icon icon="solar:chart-square-bold" className="text-primary w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "65%" }}
                                                transition={{ duration: 1, delay: 1 }}
                                                className="bg-primary h-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Indicators */}
                {heros.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {heros.map((_, i) => (
                            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/20 h-1.5"}`} />
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Background Decoration */}
            <div className="absolute bottom-0 right-0 w-[40%] h-[60%] pointer-events-none z-0">
                <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10">
                    <path d="M400 600V0C300 100 0 200 0 400C0 600 200 600 400 600Z" fill="url(#paint0_linear)" />
                    <defs>
                        <linearGradient id="paint0_linear" x1="200" y1="0" x2="200" y2="600" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#1a4a2e" />
                            <stop offset="1" stopColor="#0a1a10" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
}