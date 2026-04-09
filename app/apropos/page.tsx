"use client";

import Footer from "@/components/page/Footer";
import Navbar from "@/components/page/Navbar";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Equipe, Reglage } from "@/types/interfaces";
import { getAllEquipe } from "@/service/security";
import { getImagesUrl } from "@/types/baseUrl";
import Link from "next/link";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const values = [
    {
        icon: "solar:medal-ribbons-star-bold",
        title: "Excellence",
        desc: "Chaque produit est réalisé avec le plus grand soin et la plus haute précision.",
    },
    {
        icon: "solar:palette-bold",
        title: "Créativité",
        desc: "Nous donnons vie à vos idées les plus audacieuses avec une touche africaine unique.",
    },
    {
        icon: "solar:users-group-two-rounded-bold",
        title: "Proximité",
        desc: "Une équipe à votre écoute pour vous accompagner à chaque étape de votre projet.",
    },
    {
        icon: "solar:leaf-bold",
        title: "Authenticité",
        desc: "Des créations qui reflètent votre identité et vos valeurs les plus profondes.",
    },
];

const stats = [
    { value: "5+", label: "Années\nd'expérience" },
    { value: "1K+", label: "Clients\nsatisfaits" },
    { value: "50+", label: "Partenaires\nde confiance" },
];

export default function Page() {
    const [equipeData, setEquipeData] = useState<Equipe[]>([]);
    const [reglages, setReglages] = useState<Reglage[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const urlImages = getImagesUrl();

    useEffect(() => {
        getAllEquipe()
            .then((res) => {
                if (res.data) {
                    setEquipeData(res.data.equipes || []);
                    if (res.data.reglages) setReglages(res.data.reglages);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération de l'équipe:", err);
                setLoading(false);
            });
    }, []);

    const nextSlide = () => {
        if (equipeData.length === 0) return;
        setCurrentSlide((prev) => (prev === equipeData.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        if (equipeData.length === 0) return;
        setCurrentSlide((prev) => (prev === 0 ? equipeData.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (equipeData.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [equipeData.length]);

    const getFullImageUrl = (path: string | null | undefined) => {
        if (!path) return "/ads/tdl.jpg";
        if (path.startsWith("http") || path.startsWith("data:")) return path;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${urlImages}${cleanPath}`;
    };

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="relative mt-16 md:mt-20 pb-16 overflow-hidden">

                {/* Background blobs */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-0 right-[-10%] w-[45%] h-[60%] bg-brand-primary/5 rounded-full blur-[130px]" />
                    <div className="absolute bottom-0 left-[-10%] w-[40%] h-[50%] bg-[#242078]/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-start gap-14 lg:gap-20">

                        {/* ── LEFT: Content ── */}
                        <div className="flex-1 space-y-7 pt-8 lg:pt-16">

                            {/* Label */}
                            <motion.div
                                className="flex items-center gap-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, ease }}
                            >
                                <span className="w-6 h-px bg-brand-primary" />
                                <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">
                                    {reglages[0]?.entreprise_reglages || "Notre Histoire"}
                                </span>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-secondary dark:text-white leading-[1.05]"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1, ease }}
                            >
                                {reglages[0]?.texteHeader2 || (
                                    <>
                                        À propos de{" "}
                                        <span className="text-brand-primary">Tarafé</span>
                                    </>
                                )}
                            </motion.h1>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.2, ease }}
                            >
                                {loading ? (
                                    <div className="space-y-2.5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className={`h-4 bg-muted animate-pulse rounded-lg ${i === 1 ? "w-5/6" : i === 2 ? "w-4/6" : "w-full"}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-lg"
                                        dangerouslySetInnerHTML={{
                                            __html: reglages[0]?.description_reglages || "",
                                        }}
                                    />
                                )}
                            </motion.div>

                            {/* Stats row */}
                            <motion.div
                                className="grid grid-cols-3 gap-3 pt-2"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3, ease }}
                            >
                                {stats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-2xl bg-card border border-border hover:border-brand-primary/30 transition-colors duration-300"
                                    >
                                        <p className="text-2xl md:text-3xl font-black text-brand-primary">{stat.value}</p>
                                        <p className="text-[11px] text-muted-foreground mt-1 leading-tight whitespace-pre-line">{stat.label}</p>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4, ease }}
                            >
                                <Link
                                    href="/#contact"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-brand-primary/25"
                                >
                                    Nous contacter
                                    <Icon icon="solar:alt-arrow-right-bold" width={15} />
                                </Link>
                            </motion.div>
                        </div>

                        {/* ── RIGHT: Team Slider ── */}
                        <motion.div
                            className="flex-1 w-full lg:sticky lg:top-28"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.15, ease }}
                        >
                            <div className="relative group aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-w-lg mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 bg-muted ring-1 ring-black/5">

                                {/* Slide progress bar */}
                                {!loading && equipeData.length > 1 && (
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/15 z-30">
                                        <motion.div
                                            key={currentSlide}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 5, ease: "linear" }}
                                            className="h-full bg-brand-primary origin-left"
                                        />
                                    </div>
                                )}

                                {/* Loading state */}
                                {loading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-muted">
                                        <div className="w-10 h-10 border-[3px] border-brand-primary border-t-transparent rounded-full animate-spin" />
                                        <p className="text-muted-foreground text-sm animate-pulse">Chargement de l'équipe...</p>
                                    </div>
                                ) : equipeData.length > 0 ? (
                                    <>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentSlide}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="absolute inset-0"
                                            >
                                                <Image
                                                    src={getFullImageUrl(equipeData[currentSlide].photo_equipe)}
                                                    alt={equipeData[currentSlide].nomPren_equipe || "Membre Tarafé"}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    priority
                                                    unoptimized
                                                />
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                                                {/* Member info */}
                                                <div className="absolute bottom-0 left-0 w-full p-7 md:p-10">
                                                    <motion.div
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.25, ease }}
                                                        className="space-y-1.5"
                                                    >
                                                        <p className="text-white/45 text-[10px] font-bold uppercase tracking-widest">
                                                            {String(currentSlide + 1).padStart(2, "0")} / {String(equipeData.length).padStart(2, "0")}
                                                        </p>
                                                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                                            {equipeData[currentSlide].nomPren_equipe}
                                                        </h3>
                                                        <div className="flex items-center gap-2.5 pt-0.5">
                                                            <span className="w-5 h-px bg-brand-primary" />
                                                            <p className="text-brand-primary font-bold uppercase tracking-widest text-[11px]">
                                                                {equipeData[currentSlide].fonction_equipe}
                                                            </p>
                                                        </div>
                                                        {equipeData[currentSlide].email_equipe && (
                                                            <p className="text-white/55 text-xs flex items-center gap-1.5 pt-1">
                                                                <Icon icon="solar:letter-bold" width={12} />
                                                                {equipeData[currentSlide].email_equipe}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Navigation arrows - always visible */}
                                        {equipeData.length > 1 && (
                                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
                                                <button
                                                    onClick={prevSlide}
                                                    className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
                                                >
                                                    <Icon icon="solar:alt-arrow-left-bold" width={16} />
                                                </button>
                                                <button
                                                    onClick={nextSlide}
                                                    className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
                                                >
                                                    <Icon icon="solar:alt-arrow-right-bold" width={16} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Vertical dots */}
                                        <div className="absolute top-1/2 -translate-y-1/2 right-5 flex flex-col gap-1.5 z-20">
                                            {equipeData.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentSlide(index)}
                                                    className={`rounded-full w-1.5 transition-all duration-300 ${index === currentSlide ? "h-7 bg-brand-primary" : "h-1.5 bg-white/30 hover:bg-white/60"}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <p className="text-muted-foreground text-sm">Aucun membre trouvé.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Nos Valeurs ── */}
            <section className="max-w-7xl mx-auto px-6 pb-24">

                {/* Section header */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, ease }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-px bg-brand-primary" />
                        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">
                            Nos valeurs
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-brand-secondary dark:text-white leading-tight">
                        Ce qui nous définit
                    </h2>
                </motion.div>

                {/* Values grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: i * 0.09, ease }}
                            className="group p-6 rounded-2xl bg-card border border-border hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
                        >
                            <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors duration-300">
                                <Icon icon={v.icon} className="text-brand-primary w-5 h-5" />
                            </div>
                            <h3 className="font-black text-foreground text-base mb-2">{v.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer reglages={reglages} />
        </main>
    );
}
