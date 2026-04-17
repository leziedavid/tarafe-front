"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from 'next/image';
import { Product } from "@/types/interfaces";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getImagesUrl } from "@/types/baseUrl";
import { useCart } from "../providers/CartProvider";

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
    const [mounted, setMounted] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const urlImages = getImagesUrl();

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;
    if (!product && mounted) return null;
    const images = (product?.images && product.images.length > 0) ? product.images.map(img => img.path) : product?.image ? [product.image] : [];
    const currentPrice = parseFloat(product?.price || "0");

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        toast.success(`"${product.name}" ajouté au panier`);
        onClose();
    };

    const handleNegotiate = async () => {
        if (!product) return;
        setIsNegotiating(true);
        try {
            // envoyer un message whatsapp
            const message = `Bonjour, je suis intéressé par votre produit "${product.name}" (Prix: ${currentPrice.toLocaleString()} FCFA). Pouvons-nous en discuter ?`;
            const phone = product.store?.phone || "22500000000";
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
        } finally {
            setIsNegotiating(false);
        }
    };

    const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return createPortal(
        <AnimatePresence>
            {isOpen && product && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
                    />
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-0 flex items-center justify-center z-[1001] pointer-events-none p-4"
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl h-full md:h-[85vh] rounded-[2.5rem] pointer-events-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring", damping: 25 }}
                        >
                            {/* Close Button Mobile */}
                            <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-all md:hidden">
                                <Icon icon="solar:close-circle-bold" width={24} className="text-white" />
                            </button>

                            {/* Left: Image Slider */}
                            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-100 dark:bg-gray-800">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative w-full h-full"
                                    >
                                        {images[activeImageIndex] ? (
                                            <Image
                                                src={`${urlImages}/${images[activeImageIndex]}`}
                                                fill
                                                className="object-cover"
                                                alt={product.name}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                                                <Icon icon="solar:gallery-bold" width={48} className="text-gray-400" />
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Image Navigation */}
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all shadow-xl">
                                            <Icon icon="solar:alt-arrow-left-bold" width={24} />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all shadow-xl">
                                            <Icon icon="solar:alt-arrow-right-bold" width={24} />
                                        </button>

                                        {/* Pagination dots */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Right: Content */}
                            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                                <div className="p-8 md:p-12 space-y-8">
                                    {/* Header Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[11px] font-bold uppercase tracking-wider rounded-full">
                                                    {product.category?.name || "Catégorie"}
                                                </span>
                                                {product.stock > 0 ? (
                                                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                        En stock ({product.stock})
                                                    </span>
                                                ) : (
                                                    <span className="px-4 py-1.5 bg-red-500/10 text-red-600 text-[11px] font-bold uppercase tracking-wider rounded-full">Rupture</span>
                                                )}
                                            </div>
                                            <button onClick={onClose} className="hidden md:block p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                <Icon icon="solar:close-circle-bold" width={32} />
                                            </button>
                                        </div>

                                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                                            {product.name}
                                        </h2>

                                        <div className="flex items-baseline gap-3">
                                            <span className="text-3xl font-black text-brand-primary">
                                                {currentPrice.toLocaleString()} FCFA
                                            </span>
                                            {product.old_price && (
                                                <span className="text-xl text-gray-400 line-through">
                                                    {parseFloat(product.old_price).toLocaleString()} FCFA
                                                </span>
                                            )}
                                        </div>

                                        {/* Store Info */}
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                                <Icon icon="solar:shop-bold-duotone" width={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Proposé par</p>
                                                <p className="text-base font-bold text-gray-900 dark:text-white">{product.store?.name || "Boutique Officielle"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Description du produit</h3>
                                        <div dangerouslySetInnerHTML={{ __html: product.description || "Aucune description détaillée n'est disponible pour ce produit." }} className="text-base text-gray-600 dark:text-gray-400 leading-relaxed" />
                                    </div>

                                    {/* Product Options (placeholder if needed) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Référence SKU</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{product.sku || `PRD-${product.id}`}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Livraison</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Dispo. 24h/48h</p>
                                        </div>
                                    </div>

                                    {/* Quantity and Actions */}
                                    <div className="space-y-6 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold tracking-widest uppercase text-gray-400">Quantité</span>
                                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
                                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500  hover:text-brand-primary transition-colors" >
                                                    <Icon icon="solar:minus-circle-outline" width="24" height="24" />                                                </button>
                                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                                <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} className="w-10 h-10 flex items-center justify-center text-gray-500  hover:text-brand-primary transition-colors" >
                                                    <Icon icon="solar:add-circle-broken" width="24" height="24" />                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button onClick={handleNegotiate} disabled={isNegotiating} className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-[1.5rem] font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700" >
                                                {isNegotiating ? (
                                                    <Icon icon="line-md:loading-twotone-loop" width={20} />
                                                ) : (
                                                    <Icon icon="solar:chat-round-dots-bold-duotone" width={22} className="text-brand-primary" />
                                                )}
                                                Négocier
                                            </button>
                                            <button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-[1.5] py-3 px-6 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-[1.5rem] font-bold text-sm active:scale-95 transition-all shadow-xl shadow-brand-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" >
                                                <Icon icon="solar:cart-large-bold-duotone" width={22} />
                                                Ajouter au panier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
