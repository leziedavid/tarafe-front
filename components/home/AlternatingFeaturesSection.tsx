"use client";

import Image from "next/image";
import CardContainer from "../layout/CardContainer";
import { Feature } from "@/types/interfaces";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getImagesUrl } from "@/types/baseUrl";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

// =============================
// Skeleton
// =============================
const FeatureSkeleton = () => (
    <section className="w-full bg-background">
        <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
            <div className="space-y-24 p-4 md:p-14">
                {[1, 2].map((item) => (
                    <div key={item} className="grid md:grid-cols-2 gap-12 md:gap-16 items-center animate-pulse">
                        <div className={`space-y-5 ${item === 2 ? "md:order-2" : "md:order-1"}`}>
                            <div className="h-2.5 w-16 bg-muted rounded-full" />
                            <div className="space-y-3">
                                <div className="h-10 w-3/4 bg-muted rounded-xl" />
                                <div className="h-10 w-1/2 bg-muted rounded-xl" />
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className="h-4 bg-muted rounded-lg w-full" />
                                <div className="h-4 bg-muted rounded-lg w-5/6" />
                                <div className="h-4 bg-muted rounded-lg w-4/6" />
                            </div>
                        </div>
                        <div className={item === 2 ? "md:order-1" : "md:order-2"}>
                            <div className="w-full h-[300px] md:h-[420px] bg-muted rounded-2xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// =============================
// Ease curve
// =============================
const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// =============================
// Main Component
// =============================
interface FeatureProps {
    feature: Feature[];
}

export default function AlternatingFeaturesSection({ feature }: FeatureProps) {
    const [isLoading, setIsLoading] = useState(true);
    const urlImages = getImagesUrl();

    useEffect(() => {
        if (feature && feature.length > 0) {
            setIsLoading(false);
        }
    }, [feature]);

    const activeFeatures = feature.filter((feat) => feat.active === 1);

    if (isLoading) return <FeatureSkeleton />;

    return (
        <section className="w-full bg-background transition-colors duration-500">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <div className="space-y-28 p-4 md:p-14">
                    {feature.map((feat, index) => {
                        const reverse = Number(feat.reverse) === 1;
                        const num = String(index + 1).padStart(2, "0");

                        return (
                            <div key={feat.id} className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"  >

                                {/* ── Text Column ── */}
                                <div className={`relative ${reverse ? "md:order-2" : "md:order-1"}`}>

                                    {/* Ghost number — arrière-plan décoratif */}
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className="absolute -top-8 -left-2 md:-left-6 text-[7rem] md:text-[9rem] font-black leading-none select-none pointer-events-none text-muted/30 dark:text-muted/20 tabular-nums"
                                        aria-hidden
                                    >
                                        {num}
                                    </motion.span>

                                    <div className="relative space-y-6">

                                        {/* Numéro + trait */}
                                        <motion.div
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.5, ease }}
                                        >
                                            <span className="text-brand-primary font-black text-xs tabular-nums tracking-widest">
                                                {num}
                                            </span>
                                            <span className="h-px w-8 bg-brand-primary" />
                                            <span className="text-muted-foreground font-semibold text-xs uppercase tracking-widest">
                                                Tarafé
                                            </span>
                                        </motion.div>

                                        {/* Titre */}
                                        <motion.h2
                                            className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight text-brand-secondary dark:text-white"
                                            initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, delay: 0.08, ease }}
                                        >
                                            {feat.title}
                                        </motion.h2>

                                        {/* Description */}
                                        <motion.div
                                            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, delay: 0.18, ease }}
                                        >
                                            <p
                                                className="text-base md:text-lg leading-relaxed text-foreground/70"
                                                dangerouslySetInnerHTML={{ __html: feat.description || "Description à venir..." }}
                                            />
                                        </motion.div>

                                        {/* CTA */}
                                        {feat.link && (
                                            <motion.div
                                                initial={{ opacity: 0, x: reverse ? 20 : -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ duration: 0.5, delay: 0.28, ease }}
                                            >
                                                <Link
                                                    href={feat.link}
                                                    className="group/cta inline-flex items-center gap-2.5 text-brand-secondary dark:text-white font-bold text-sm hover:text-brand-primary transition-colors duration-300"
                                                >
                                                    <span>En savoir plus</span>
                                                    <span className="w-7 h-7 rounded-full bg-brand-primary/10 group-hover/cta:bg-brand-primary flex items-center justify-center transition-all duration-300 group-hover/cta:scale-110">
                                                        <Icon
                                                            icon="solar:alt-arrow-right-bold"
                                                            width={13}
                                                            className="text-brand-primary group-hover/cta:text-white transition-colors"
                                                        />
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Image Column ── */}
                                <motion.div
                                    className={`relative ${reverse ? "md:order-1" : "md:order-2"}`}
                                    initial={{ opacity: 0, x: reverse ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.25 }}
                                    transition={{ duration: 0.7, delay: 0.12, ease }}
                                >
                                    {/* Blob décoratif derrière l'image */}
                                    <div className="absolute -inset-6 bg-brand-primary/6 rounded-[2rem] blur-3xl -z-10" />

                                    {/* Accent corner — détail visuel */}
                                    <div className={`absolute -top-3 ${reverse ? "-right-3" : "-left-3"} w-16 h-16 rounded-2xl border-2 border-brand-primary/20 -z-10`} />
                                    <div className={`absolute -bottom-3 ${reverse ? "-left-3" : "-right-3"} w-10 h-10 rounded-xl bg-brand-primary/10 -z-10`} />

                                    {/* Image */}
                                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/[0.06] dark:ring-white/[0.06]">
                                        {feat.image ? (
                                            <Image
                                                src={`${urlImages}/${feat.image}`}
                                                alt={feat.title}
                                                width={600}
                                                height={400}
                                                className="w-full h-auto transition-transform duration-700 hover:scale-[1.03]"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-[300px] md:h-[400px] bg-muted flex items-center justify-center">
                                                <span className="text-muted-foreground text-sm">Image à venir</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
