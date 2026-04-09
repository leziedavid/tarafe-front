"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useCart } from "@/components/providers/CartProvider";
import CartDetailModal from "../store/CartDetailModal";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const NAV_LINKS = [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: "/realisations" },
    { label: "Réalisations", href: "/gallerie" },
    { label: "Boutique", href: "/boutique" },
    { label: "A propos", href: "/apropos" },
];

export default function Navbar() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { totalItems } = useCart();
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isTabActive = (tabPath: string): boolean => {
        if (tabPath === "/") return pathname === "/";
        return pathname.startsWith(tabPath);
    };

    const currentTheme = mounted ? resolvedTheme : "light";
    const logoSrc = (currentTheme === "dark")
        ? "/ads/Logo_blanc.png"
        : (isScrolled || pathname !== "/")
            ? "/ads/logos2.png"
            : "/ads/Logo_blanc.png";

    return (
        <>
            {/* Mobile Header (Logo Only) */}
            <div className={`fixed top-6 left-6 z-50 md:hidden pointer-events-none transition-all duration-500 ${isScrolled ? "opacity-0 -translate-y-10" : "opacity-100 translate-y-0"}`}>
                <Link href="/" className="pointer-events-auto block transition-transform active:scale-95">
                    <div className="relative w-40 h-12">
                        <Image src={logoSrc} alt="Tarafe Logo" fill className="object-contain" priority />
                    </div>
                </Link>
            </div>

            {/* Desktop Navbar */}
            <header className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1600px] flex items-center justify-center hidden md:flex pointer-events-none px-12">

                {/* Left: Logo (Simple & Responsive) */}
                <div className={`absolute left-12 top-1/2 -translate-y-1/2 transition-all duration-500 ${isScrolled ? "opacity-0 -translate-x-10 pointer-events-none" : "opacity-100 translate-x-0"}`}>
                    <Link href="/" className="pointer-events-auto block transition-transform duration-300 hover:scale-105 active:scale-95 origin-left">
                        <div className="relative w-36 h-10 md:w-48 md:h-12">
                            <Image src={logoSrc} alt="Tarafe Logo" fill className="object-contain" priority unoptimized />
                        </div>
                    </Link>
                </div>

                {/* Center: Menu + Cart + Login Pill (Orange on scroll or non-hero pages) */}
                <div className={`flex items-center gap-6 px-4 py-2 rounded-full border transition-all duration-500 pointer-events-auto shadow-lg  ${isScrolled ? "bg-white border-brand-primary scale-95" : "bg-background/20 backdrop-blur-md border-white/10 hover:bg-background/30"}`} >
                    <nav className="flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const active = isTabActive(link.href);
                            const isOtherPage = pathname !== "/";
                            return (
                                <Link key={link.label} href={link.href} className={`uppercase px-5 py-2 rounded-full text-xs font-bold transition-all duration-300  ${active ? (isScrolled ? "bg-[#242078] text-white shadow-md" : (isOtherPage ? "bg-brand-secondary text-brand-primary shadow-md" : "bg-white text-brand-primary shadow-md")) : (isScrolled ? "text-[#242078] hover:bg-[#242078]/10" : (isOtherPage ? "text-brand-secondary hover:bg-brand-secondary/10" : "text-white hover:bg-white/10"))}`}  >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                        <ThemeToggle />
                        {/* Bouton Panier */}
                        <button onClick={() => setIsCartModalOpen(true)} className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm ${isScrolled ? "bg-[#242078] text-white" : (pathname !== "/" ? "bg-brand-secondary text-brand-primary" : "bg-white/10 text-white hover:bg-white/20")}`} >
                            <Icon icon="solar:cart-large-minimalistic-bold" className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full border-2 animate-in zoom-in ${isScrolled ? "bg-red-500 text-white border-white" : (pathname !== "/" ? "bg-red-500 text-white border-brand-secondary" : "bg-brand-primary text-white border-[#0a1a10]")}`} >
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Bouton Login (même style que panier) */}
                        <Link href="/account" className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm ${isScrolled ? "bg-[#242078] text-white" : (pathname !== "/" ? "bg-brand-secondary text-brand-primary" : "bg-white/10 text-white hover:bg-white/20")} flex items-center justify-center`} >
                            <Icon icon="solar:user-minus-bold" className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </header>

            {/* Mobile Bottom Navigation (Inspired by in-seach) */}
            <nav className="fixed md:hidden bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[500px] bg-background/80 dark:bg-black/60 backdrop-blur-2xl border border-border/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar transition-all duration-500">

                <div className="flex items-center flex-1">
                    {NAV_LINKS.map((link) => {
                        const active = isTabActive(link.href);
                        // Match icons to links
                        let icon = "solar:reorder-bold";
                        if (link.href === "/") icon = "solar:home-2-bold";
                        if (link.href === "/realisations") icon = "solar:box-bold";
                        if (link.href === "/gallerie") icon = "solar:gallery-bold";
                        if (link.href === "/boutique") icon = "solar:shop-bold";
                        if (link.href === "/apropos") icon = "solar:info-circle-bold";

                        return (
                            <Link key={link.label} href={link.href} className={`flex flex-col items-center justify-center p-3 rounded-full transition-all shrink-0 ${active ? "text-brand-primary bg-brand-primary/10 scale-110" : "text-muted-foreground hover:text-foreground"}`} >
                                <Icon icon={icon} className="w-6 h-6" />
                            </Link>);
                    })}
                </div>

                <div className="flex items-center gap-3 border-l border-border/50 pl-3 shrink-0">
                    <ThemeToggle />

                    {/* Bouton Panier Mobile */}
                    <button onClick={() => setIsCartModalOpen(true)} className="relative p-2.5 rounded-full bg-brand-primary/10 text-brand-primary transition-all duration-300 active:scale-95 shadow-sm" >
                        <Icon icon="solar:cart-large-minimalistic-bold" className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-brand-primary text-white border-2 border-background animate-in zoom-in" >
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Bouton Compte Mobile */}
                    <Link href="/account" className="relative p-2.5 rounded-full bg-brand-primary/10 text-brand-primary transition-all duration-300 active:scale-95 shadow-sm flex items-center justify-center" >
                        <Icon icon="solar:user-bold" className="w-6 h-6" />
                    </Link>
                </div>

            </nav>

            {/* Spacing spacer for pages where navbar shouldn't overlap content directly (non-hero pages) */}
            {pathname !== "/" && (<div className="hidden md:block h-32 w-full" />)}
            <CartDetailModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />

        </>
    );
}
