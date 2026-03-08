"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import CartDetailModal from "../store/CartDetailModal";

const NAV_LINKS = [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: "/realisations" },
    { label: "Réalisations", href: "/gallerie" },
    { label: "Boutique", href: "/boutique" },
    { label: "A propos", href: "/apropos" },
];

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false); // ← important
    const { totalItems } = useCart();
    const cartItems = totalItems;
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true); // active le rendu client-only
    }, []);

    return (
        <>

            <nav className="flex items-center justify-between py-6 px-6 md:px-10">
                {/* ==== LEFT : MENU (mobile) + LOGO ==== */}
                <div className="flex items-center space-x-3">
                    {/* Menu Mobile */}
                    <div className="md:hidden">
                        {mounted && ( // ← rendu seulement après montage
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <button className="p-2 rounded-md hover:bg-gray-100 transition" type="button">
                                        <Icon icon="solar:hamburger-menu-bold" className="w-5 h-5" />
                                    </button>
                                </SheetTrigger>

                                <SheetContent side="top" className="w-full p-6 bg-white text-[#242078] rounded-b-2xl shadow-md border-none text-left">
                                    <SheetHeader>
                                        <SheetTitle>
                                            <VisuallyHidden>Navigation Menu</VisuallyHidden>
                                        </SheetTitle>
                                    </SheetHeader>

                                    {/* Menu Mobile */}
                                    <ul className="flex flex-col space-y-4 text-lg font-semibold mt-2 uppercase">
                                        {NAV_LINKS.map((link) => (
                                            <li key={link.label}>
                                                <a href={link.href} className="transition-colors duration-200 hover:text-[#fd980e] block py-2" onClick={() => setIsOpen(false)} >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>

                    {/* ✅ Logo */}
                    <div className="flex items-center">
                        <Image
                            src="/ads/logos2.png"
                            alt="Tarafé Logo"
                            width={120}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* ==== CENTER : MENU (desktop) ==== */}
                <ul className="hidden md:flex space-x-10 font-bold text-[#242078] uppercase ">
                    {NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                className="transition-colors duration-200 hover:text-[#fd980e]"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* ==== RIGHT : ACTIONS ==== */}
                <div className="flex items-center space-x-4">
                    {/* <Icon icon="solar:magnifer-bold" className="w-5 h-5 cursor-pointer hover:text-[#fd980e] transition-colors duration-200" /> */}
                    {/* Panier avec badge */}
                    <div className="relative">
                        <Icon icon="solar:cart-3-bold" onClick={() => setIsCartModalOpen(true)} className="w-5 h-5 cursor-pointer text-[#23207f] hover:text-[#fd980e] transition-colors duration-200" />
                        {cartItems > 0 && (<span className="absolute -top-2 -right-2 text-[10px] text-white bg-[#B07B5E]  w-5 h-5 rounded-full flex items-center justify-center font-semibold"> {cartItems >= 9 ? "9+" : cartItems}  </span>)}
                    </div>
                    <Link href="/auth/login">
                        <Icon icon="solar:user-bold" className="w-5 h-5 cursor-pointer text-[#23207f] hover:text-[#fd980e] transition-colors duration-200" />
                    </Link>
                </div>

            </nav>

            <CartDetailModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
        </>
    );
}
