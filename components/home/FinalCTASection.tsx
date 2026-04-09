"use client";

import { FinalCTA } from "@/types/interfaces";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// =============================
// Skeleton
// =============================
const FinalCTASkeleton = () => (
    <section className="w-full bg-background py-section-lg">
        <div className="w-full md:max-w-[1400px] md:mx-auto px-4 md:px-6">
            <div className="rounded-3xl bg-muted animate-pulse p-12 md:p-20 text-center space-y-6">
                <div className="h-3 w-24 bg-muted-foreground/20 rounded-full mx-auto" />
                <div className="h-12 w-2/3 bg-muted-foreground/20 rounded-xl mx-auto" />
                <div className="h-12 w-1/2 bg-muted-foreground/20 rounded-xl mx-auto" />
                <div className="space-y-2 max-w-lg mx-auto pt-2">
                    <div className="h-4 bg-muted-foreground/15 rounded-lg w-full" />
                    <div className="h-4 bg-muted-foreground/15 rounded-lg w-5/6 mx-auto" />
                </div>
                <div className="flex justify-center gap-3 pt-4">
                    <div className="h-12 w-40 bg-muted-foreground/20 rounded-xl" />
                    <div className="h-12 w-36 bg-muted-foreground/10 rounded-xl" />
                </div>
            </div>
        </div>
    </section>
);

// =============================
// Trust badges
// =============================
const trustBadges = [
    { icon: "solar:shield-check-bold", label: "Paiement sécurisé" },
    { icon: "solar:headphones-round-bold", label: "Support 24/7" },
    { icon: "solar:medal-ribbons-star-bold", label: "Qualité garantie" },
    { icon: "solar:delivery-bold", label: "Livraison rapide" },
];

// =============================
// Main Component
// =============================
interface FinalCTASectionProps {
    finals: FinalCTA[];
}

export default function FinalCTASection({ finals }: FinalCTASectionProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (finals && finals.length > 0) setIsLoading(false);
    }, [finals]);

    const activeCTA = finals.find((cta) => cta.active === 1);

    if (isLoading) return <FinalCTASkeleton />;

    return (
        <section className="w-full bg-background transition-colors duration-500">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-4 md:px-6 py-4">
                {finals.map((cta) => (
                    <motion.div
                        key={cta.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, ease }}
                        className="relative rounded-3xl overflow-hidden bg-[#242078] p-10 md:p-20 text-left md:text-center"
                    >
                        {/* ── Decorative background ── */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-primary/10 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/4 blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/4" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/4 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-brand-primary/10 pointer-events-none" />
                        {/* Floating dots */}
                        <div className="absolute top-10 left-16 w-2 h-2 rounded-full bg-brand-primary/50 pointer-events-none" />
                        <div className="absolute top-20 right-24 w-1.5 h-1.5 rounded-full bg-white/30 pointer-events-none" />
                        <div className="absolute bottom-14 left-32 w-1 h-1 rounded-full bg-white/20 pointer-events-none" />
                        <div className="absolute bottom-10 right-16 w-2.5 h-2.5 rounded-full bg-brand-primary/40 pointer-events-none" />

                        {/* ── Content ── */}
                        <div className="relative z-10 flex flex-col items-start md:items-center">

                            {/* Label */}
                            <motion.div
                                className="flex items-center gap-2 mb-5 self-start md:self-center"
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1, ease }}
                            >
                                <span className="w-5 h-px bg-brand-primary" />
                                <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">
                                    Passez à l'action
                                </span>
                                <span className="w-5 h-px bg-brand-primary" />
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase leading-tight text-white max-w-3xl"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.18, ease }}
                            >
                                {cta.title
                                    ? cta.title
                                    : (<>Prêt à transformer <span className="text-brand-primary">votre style ?</span></>)
                                }
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                className="text-white/60 text-base md:text-lg leading-relaxed mt-6 max-w-xl"
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: 0.28, ease }}
                                dangerouslySetInnerHTML={{
                                    __html: cta.description || "Rejoignez des milliers de professionnels et particuliers qui font confiance à Tarafé pour leurs besoins en mode et personnalisation.",
                                }}
                            />

                            {/* Buttons */}
                            <motion.div
                                className="flex flex-nowrap items-center justify-start md:justify-center gap-2 md:gap-3 mt-10"
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.38, ease }}
                            >
                                <Link
                                    href={cta?.button_link || "/contact"}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl bg-brand-primary text-white font-bold text-xs md:text-sm whitespace-nowrap hover:bg-brand-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-brand-primary/30"
                                >
                                    {cta?.button_text || "Nous contacter"}
                                    <Icon icon="solar:alt-arrow-right-bold" width={15} />
                                </Link>

                                <Link
                                    href="/boutique"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs md:text-sm whitespace-nowrap hover:bg-white/20 active:scale-95 transition-all duration-300 backdrop-blur-sm"
                                >
                                    Voir la boutique
                                </Link>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div
                                className="flex flex-wrap items-center justify-start md:justify-center gap-4 md:gap-6 mt-12 pt-10 border-t border-white/10 w-full max-w-2xl"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                {trustBadges.map((badge, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.52 + i * 0.08, ease }}
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                            <Icon icon={badge.icon} className="text-brand-primary w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-white/60 text-xs font-semibold whitespace-nowrap">
                                            {badge.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>

                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
