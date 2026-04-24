"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from 'next/image';
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getImagesUrl } from "@/types/baseUrl";
import { useCart } from "../providers/CartProvider";
import { createOrder } from "@/service/orders";
import { useAuth } from "@/lib/proxy";

interface CartDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MOBILE_PROVIDERS = [
    { id: "WAVE", name: "Wave", icon: "simple-icons:wave", color: "bg-blue-500" },
    { id: "ORANGE", name: "Orange", icon: "simple-icons:orange", color: "bg-orange-500" },
    { id: "MTN", name: "MTN", icon: "simple-icons:mtn", color: "bg-yellow-500" },
    { id: "MOOV", name: "Moov", icon: "simple-icons:moov", color: "bg-blue-800" },
];

export default function CartDetailModal({ isOpen, onClose }: CartDetailModalProps) {

    const [mounted, setMounted] = useState(false);
    const { cart, updateQuantity, removeFromCart, totalAmount, clearCart, totalItems } = useCart();
    const router = useRouter();
    const urlImages = getImagesUrl();

    const [showPaymentSection, setShowPaymentSection] = useState(false);
    const [paymentType, setPaymentType] = useState<"LIVRAISON" | "MOBILE_MONEY">("LIVRAISON");
    const [selectedMobileProvider, setSelectedMobileProvider] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // get userid
    const { user } = useAuth();

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    const handleValidateOrder = async () => {
        if (!user) {
            toast.error("Veuillez vous connecter pour valider votre commande");
            router.push("/auth/login");
            onClose();
            return;
        }

        if (cart.length === 0) return;

        const paymentMethod = paymentType === "LIVRAISON" ? "LIVRAISON" : selectedMobileProvider;

        if (paymentType === "MOBILE_MONEY" && !selectedMobileProvider) {
            toast.warning("Veuillez sélectionner un opérateur Mobile Money");
            return;
        }

        setIsLoading(true);
        try {
            const items = cart.map(item => ({ productId: item.id, quantity: item.quantity, user_id: user.id }));
            const res = await createOrder({ items, paymentMethod: paymentMethod! });
            if (res.statusCode === 200 || res.statusCode === 201) {

                toast.success("Commande validée avec succès !");
                clearCart();
                onClose();
                router.push("/dashboard/commandes");

            } else { toast.error(res.message || "Erreur lors de la validation"); }

        } catch (error) {

            console.error("Order error:", error);
            toast.error("Une erreur est survenue");

        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]" />
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-950 z-[1001] shadow-2xl flex flex-col pointer-events-auto">

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                                    <Icon icon="solar:cart-large-bold-duotone" width={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">Votre Panier</h2>
                                    <p className="text-xs text-gray-400 font-medium">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <Icon icon="solar:close-circle-bold" width={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-200">
                                        <Icon icon="solar:cart-large-minimalistic-bold-duotone" width={64} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold dark:text-white">Panier vide</p>
                                        <p className="text-sm text-gray-400 max-w-[200px]">Votre sélection apparaîtra ici dès que vous aurez choisi vos articles.</p>
                                    </div>
                                    <button onClick={onClose} className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform active:scale-95">
                                        Découvrir boutique
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {!showPaymentSection ? (
                                        <>
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 group hover:border-brand-primary/20 transition-all">
                                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-700">
                                                        <Image src={`${urlImages}/${item.image}`} fill className="object-cover" alt={item.name} unoptimized />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors" >
                                                                <Icon icon="solar:trash-bin-minimalistic-bold" width={18} />
                                                            </button>
                                                        </div>
                                                        <p className="text-brand-primary font-bold text-sm">
                                                            {parseFloat(item.price).toLocaleString()} FCFA
                                                        </p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="flex items-center bg-background rounded-lg border border-border/50 p-1">
                                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-200 flex items-center justify-center rounded-md hover:bg-secondary transition-colors" >
                                                                    <Icon icon="solar:minus-circle-outline" width="24" height="24" />
                                                                </button>
                                                                <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-200 flex items-center justify-center rounded-md hover:bg-secondary transition-colors">
                                                                    <Icon icon="solar:add-circle-broken" width="24" height="24" />
                                                                </button>
                                                            </div>
                                                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                                {(parseFloat(item.price) * item.quantity).toLocaleString()} FCFA
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Mode de paiement</h3>
                                                <button onClick={() => setShowPaymentSection(false)} className="text-xs font-bold text-brand-primary hover:underline">
                                                    Modifier panier
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <button onClick={() => setPaymentType("LIVRAISON")} className={`w-full flex items-center justify-between p-4 rounded-3xl border-2 transition-all ${paymentType === "LIVRAISON" ? "border-brand-primary bg-brand-primary/5 shadow-md" : "border-gray-100 dark:border-gray-800 hover:border-brand-primary/30"}`}  >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-2xl ${paymentType === "LIVRAISON" ? "bg-brand-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                                                            <Icon icon="solar:delivery-bold-duotone" width={24} />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold dark:text-white">Payer à la livraison</p>
                                                            <p className="text-[10px] text-gray-400 font-medium">Frais de livraison à prévoir</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentType === "LIVRAISON" ? "border-brand-primary" : "border-gray-200"}`}>
                                                        {paymentType === "LIVRAISON" && <div className="w-3 h-3 bg-brand-primary rounded-full" />}
                                                    </div>
                                                </button>

                                                <button onClick={() => setPaymentType("MOBILE_MONEY")} className={`w-full flex items-center justify-between p-4 rounded-3xl border-2 transition-all ${paymentType === "MOBILE_MONEY" ? "border-brand-primary bg-brand-primary/5 shadow-md" : "border-gray-100 dark:border-gray-800 hover:border-brand-primary/30"}`} >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-2xl ${paymentType === "MOBILE_MONEY" ? "bg-brand-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                                                            <Icon icon="solar:smartphone-bold-duotone" width={24} />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold dark:text-white">Mobile Money</p>
                                                            <p className="text-[10px] text-gray-400 font-medium">Wave, Orange, MTN, Moov</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentType === "MOBILE_MONEY" ? "border-brand-primary" : "border-gray-200"}`}>
                                                        {paymentType === "MOBILE_MONEY" && <div className="w-3 h-3 bg-brand-primary rounded-full" />}
                                                    </div>
                                                </button>
                                            </div>

                                            {paymentType === "MOBILE_MONEY" && (
                                                <div className="grid grid-cols-4 gap-3 animate-in fade-in zoom-in-95 duration-200">
                                                    {MOBILE_PROVIDERS.map((provider) => (
                                                        <button key={provider.id} onClick={() => setSelectedMobileProvider(provider.id)} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${selectedMobileProvider === provider.id ? "border-brand-primary bg-brand-primary/10" : "border-transparent bg-gray-50 dark:bg-gray-900"}`}>
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${provider.color} shadow-lg`}>
                                                                <Icon icon={provider.icon} width={20} />
                                                            </div>
                                                            <span className="text-[9px] font-bold uppercase tracking-tighter dark:text-white">{provider.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Summary */}
                        {cart.length > 0 && (
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                        <span>Sous-total</span>
                                        <span className="dark:text-white">{totalAmount.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                        <span>Livraison</span>
                                        <span className="text-emerald-500 font-bold uppercase text-[10px]">Calculé à l'étape suivante</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                        <span className="text-lg font-bold dark:text-white">Total</span>
                                        <span className="text-2xl font-black text-brand-primary">{totalAmount.toLocaleString()} FCFA</span>
                                    </div>
                                </div>

                                <button disabled={isLoading} onClick={showPaymentSection ? handleValidateOrder : () => setShowPaymentSection(true)} className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-brand-primary/25 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50" >
                                    {isLoading ? (
                                        <Icon icon="line-md:loading-twotone-loop" width={20} />
                                    ) : (
                                        <>
                                            <Icon icon={showPaymentSection ? "solar:wallet-check-bold" : "solar:wad-of-money-bold"} width={22} />
                                            {showPaymentSection ? "Confirmer la commande" : "Procéder au paiement"}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
