"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { Reglage } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { motion } from "framer-motion";
import Link from "next/link";

interface reglagesProps {
    reglages: Reglage[];
}

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// =============================
// Static data
// =============================
const services = [
    { label: "Personnalisation de vêtements", href: "#", icon: "solar:t-shirt-bold" },
    { label: "Accessoires personnalisés", href: "#", icon: "solar:watch-square-bold" },
    { label: "Solutions entreprises (B2B)", href: "#", icon: "solar:buildings-bold" },
    { label: "Pack cadeaux personnalisés", href: "#", icon: "solar:gift-bold" },
    { label: "Design & impression sur mesure", href: "#", icon: "solar:palette-bold" },
];

const quickLinks = [
    { label: "Accueil", href: "/", icon: "solar:home-bold" },
    { label: "Boutique", href: "/boutique", icon: "solar:shop-bold" },
    { label: "Nos réalisations", href: "/#realisations", icon: "solar:gallery-bold" },
    { label: "À propos", href: "/#about", icon: "solar:info-circle-bold" },
    { label: "Contact", href: "/#contact", icon: "solar:letter-bold" },
];

const socialIcons = [
    { icon: "ri:facebook-fill", key: "lienFacebbook_reglages", label: "Facebook" },
    { icon: "ri:instagram-fill", key: "lienInstagram_reglages", label: "Instagram" },
    { icon: "ri:linkedin-fill", key: "lienLikedin_reglages", label: "LinkedIn" },
    { icon: "ri:youtube-fill", key: "liensYoutub_reglages", label: "YouTube" },
] as const;

// =============================
// Skeleton
// =============================
function FooterSkeleton() {
    return (
        <footer className="w-full bg-[#242078] text-white py-16 md:py-24 border-t border-white/5">
            <div className="container mx-auto px-6 md:px-10 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
                    <div className="lg:col-span-5 space-y-4">
                        <div className="h-10 w-40 bg-white/10 rounded-xl" />
                        <div className="space-y-2">
                            <div className="h-3.5 bg-white/10 rounded-lg w-full" />
                            <div className="h-3.5 bg-white/10 rounded-lg w-5/6" />
                            <div className="h-3.5 bg-white/10 rounded-lg w-4/6" />
                        </div>
                        <div className="flex gap-2 pt-2">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-9 h-9 rounded-xl bg-white/10" />)}
                        </div>
                    </div>
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="lg:col-span-3 space-y-3">
                            <div className="h-4 w-24 bg-white/10 rounded-lg" />
                            {[...Array(5)].map((_, j) => (
                                <div key={j} className="h-3 bg-white/10 rounded-lg w-full" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}

// =============================
// Footer
// =============================
const Footer = ({ reglages }: reglagesProps) => {
    const isLoading = !reglages || reglages.length === 0;
    if (isLoading) return <FooterSkeleton />;

    const urlImages = getImagesUrl();
    const reg = reglages[0];
    const photoUrl = reg?.logo_footer ?? "Logos/Logo_blanc.png";

    const handleClick = (url: string) => window.open(url, "_blank");

    return (
        <footer className="relative w-full bg-[#242078] text-white overflow-hidden border-t border-white/5">

            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-brand-primary/8 blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-white/3 blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-brand-primary/50 pointer-events-none" />
            <div className="absolute top-16 left-1/3 w-1 h-1 rounded-full bg-white/20 pointer-events-none" />
            <div className="absolute bottom-20 right-1/3 w-2 h-2 rounded-full bg-brand-primary/30 pointer-events-none" />

            {/* Top separator gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="relative z-10 container mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

                    {/* ── Col 1 : Brand ── */}
                    <motion.div
                        className="lg:col-span-5 flex flex-col gap-6"
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease }}
                    >
                        {/* Logo */}
                        <Image
                            src={`${urlImages}/${photoUrl}`}
                            alt="Tarafé Logo"
                            width={160}
                            height={40}
                            className="object-contain"
                            priority
                            unoptimized
                        />

                        {/* Description */}
                        <p className="text-sm md:text-base leading-relaxed text-white/60 max-w-sm">
                            {reg?.desc_footer || "Plateforme digitale de personnalisation des produits mode, accessoires et déco, avec une touche africaine."}
                        </p>

                        {/* Contact info */}
                        <div className="space-y-3">
                            {reg?.email_reglages && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                                        <Icon icon="solar:letter-bold" className="text-brand-primary w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-white/60 text-sm">{reg.email_reglages}</span>
                                </div>
                            )}
                            {reg?.phone1_reglages && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                                        <Icon icon="solar:phone-calling-bold" className="text-brand-primary w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-white/60 text-sm">{reg.phone1_reglages}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                                    <Icon icon="solar:map-point-bold" className="text-brand-primary w-3.5 h-3.5" />
                                </div>
                                <span className="text-white/60 text-sm">Abidjan, Côte d'Ivoire</span>
                            </div>
                        </div>

                        {/* Social icons */}
                        <div className="flex items-center gap-2 pt-1">
                            {socialIcons.map(({ icon, key, label }) => {
                                const href = (reg as any)?.[key] ?? "#";
                                return (
                                    <button
                                        key={label}
                                        onClick={() => handleClick(href)}
                                        title={label}
                                        className="w-9 h-9 rounded-xl bg-white/8 hover:bg-brand-primary flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                                    >
                                        <Icon icon={icon} className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* ── Col 2 : Services ── */}
                    <motion.div
                        className="lg:col-span-4 flex flex-col gap-4"
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.1, ease }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-4 h-px bg-brand-primary" />
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Services</h3>
                        </div>

                        <ul className="space-y-2.5">
                            {services.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease }}
                                >
                                    <div
                                        onClick={() => handleClick(item.href)}
                                        className="flex items-center gap-2.5 text-white/55 hover:text-white text-sm cursor-pointer group transition-colors duration-200"
                                    >
                                        <Icon
                                            icon={item.icon}
                                            className="w-3.5 h-3.5 text-brand-primary/60 group-hover:text-brand-primary transition-colors shrink-0"
                                        />
                                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                                            {item.label}
                                        </span>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* ── Col 3 : Liens rapides ── */}
                    <motion.div
                        className="lg:col-span-3 flex flex-col gap-4"
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.2, ease }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-4 h-px bg-brand-primary" />
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Navigation</h3>
                        </div>

                        <ul className="space-y-2.5">
                            {quickLinks.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease }}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2.5 text-white/55 hover:text-white text-sm group transition-colors duration-200"
                                    >
                                        <Icon
                                            icon={item.icon}
                                            className="w-3.5 h-3.5 text-brand-primary/60 group-hover:text-brand-primary transition-colors shrink-0"
                                        />
                                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                                            {item.label}
                                        </span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* ── Copyright bar ── */}
                <motion.div
                    className="border-t border-white/10 mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <p className="text-white/35 text-xs">
                        © {new Date().getFullYear()} <span className="text-white/60 font-semibold">Tarafé</span> — Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-white/35 hover:text-white/65 text-xs transition-colors duration-200">
                            Mentions légales
                        </a>
                        <span className="text-white/15">·</span>
                        <a href="#" className="text-white/35 hover:text-white/65 text-xs transition-colors duration-200">
                            Confidentialité
                        </a>
                        <span className="text-white/15">·</span>
                        <a href="#" className="text-white/35 hover:text-white/65 text-xs transition-colors duration-200">
                            CGU
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
