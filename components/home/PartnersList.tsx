"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Partenaire } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { motion, AnimatePresence } from "framer-motion";

interface PartnersListProps {
    partners: Partenaire[];
    isPaginate?: boolean;
    isLoading?: boolean;
}

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// =============================
// Skeleton
// =============================
function PartnerSkeleton() {
    return (
        <div className="w-full h-24 md:h-32 rounded-2xl bg-muted animate-pulse" />
    );
}

// =============================
// Main Component
// =============================
export default function PartnersList({ partners, isPaginate = false, isLoading = false }: PartnersListProps) {
    const urlImages = getImagesUrl();
    const [currentPage, setCurrentPage] = useState(0);
    const [cols, setCols] = useState(2);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setCols(5);
            else if (window.innerWidth >= 768) setCols(3);
            else setCols(2);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => { setCurrentPage(0); }, [cols]);

    const activePartners = partners.filter(p => p.status_partenaires === "1");
    const itemsPerPage = isPaginate ? cols * 2 : activePartners.length;
    const totalPages = Math.ceil(activePartners.length / itemsPerPage);

    const displayedPartners = isPaginate
        ? activePartners.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        : activePartners;

    return (
        <section className="py-18 px-6 md:px-10 bg-background transition-colors duration-500 relative overflow-hidden">

            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url('/ads/pattern.png')`, backgroundSize: "200px" }}
            />

            {/* Top separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* ── Header ── */}
                <div className="text-center mb-14">
                    <motion.div
                        className="flex items-center justify-center gap-3 mb-4"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease }}
                    >
                        <span className="h-px w-8 bg-brand-primary" />
                        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">
                            Partenaires
                        </span>
                        <span className="h-px w-8 bg-brand-primary" />
                    </motion.div>

                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-brand-secondary dark:text-white leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.55, delay: 0.1, ease }}
                    >
                        Ils nous font <span className="text-brand-primary">confiance</span>
                    </motion.h2>

                    <motion.p
                        className="text-muted-foreground text-base mt-3 max-w-lg mx-auto"
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, delay: 0.2, ease }}
                    >
                        Des entreprises et organisations qui nous font confiance pour leurs projets de personnalisation.
                    </motion.p>
                </div>

                {/* ── Partners Grid ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-center"
                    >
                        {isLoading
                            ? Array(5).fill(0).map((_, i) => <PartnerSkeleton key={i} />)
                            : displayedPartners.map((partner, i) => (
                                <motion.div
                                    key={partner.id}
                                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.45, delay: i * 0.07, ease }}
                                    className="group relative w-full h-24 md:h-32 flex items-center justify-center p-4 md:p-5 rounded-2xl bg-card border border-border hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-400 cursor-pointer"
                                >
                                    {partner.path_partenaires && (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={`${urlImages}/${partner.path_partenaires}`}
                                                alt={partner.libelle_partenaires}
                                                fill
                                                className="object-contain transition-transform duration-500 group-hover:scale-105"
                                                unoptimized
                                            />
                                        </div>
                                    )}

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 rounded-2xl bg-brand-primary/0 group-hover:bg-brand-primary/[0.03] transition-colors duration-400" />
                                </motion.div>
                            ))}
                    </motion.div>
                </AnimatePresence>

                {/* ── Pagination ── */}
                {isPaginate && totalPages > 1 && !isLoading && (
                    <motion.div
                        className="flex justify-center items-center mt-12 gap-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-1.5 px-1">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${currentPage === idx
                                        ? "w-7 bg-brand-primary"
                                        : "w-2 bg-border hover:bg-muted-foreground/40"
                                        }`}
                                    aria-label={`Page ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Bottom separator */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </section>
    );
}
