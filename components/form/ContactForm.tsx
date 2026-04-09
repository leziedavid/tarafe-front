"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

// =============================
// Validation Zod
// =============================
const contactSchema = z.object({
    nomPrenom: z.string().min(2, "Le nom complet est requis"),
    email: z.string().email("Adresse e-mail invalide"),
    phone: z.string().min(8, "Numéro de téléphone invalide"),
    objets: z.string().min(2, "L'objet est requis"),
    contents: z.string().min(5, "Le message est requis"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// =============================
// Skeleton
// =============================
function ContactSkeleton() {
    return (
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl my-section py-10 shadow-2xl shadow-black/10 animate-pulse">
            <div className="bg-[#242078] p-10 md:p-14 flex flex-col justify-center space-y-6">
                <div className="h-3 w-16 bg-white/20 rounded-full" />
                <div className="h-10 w-3/4 bg-white/15 rounded-xl" />
                <div className="h-4 w-full bg-white/10 rounded-lg" />
                <div className="h-4 w-5/6 bg-white/10 rounded-lg" />
                <div className="space-y-4 pt-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-2.5 w-16 bg-white/10 rounded" />
                                <div className="h-3.5 w-32 bg-white/15 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-card p-10 md:p-14 flex flex-col justify-center space-y-5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                        <div className="h-3 w-20 bg-muted rounded" />
                        <div className="h-11 w-full bg-muted rounded-xl" />
                    </div>
                ))}
                <div className="space-y-1.5">
                    <div className="h-3 w-16 bg-muted rounded" />
                    <div className="h-28 w-full bg-muted rounded-xl" />
                </div>
                <div className="h-12 w-full bg-muted rounded-xl" />
            </div>
        </section>
    );
}

// =============================
// Contact Info Items
// =============================
const contactItems = [
    { icon: "solar:map-point-bold", label: "Adresse", value: "Abidjan, Côte d'Ivoire" },
    { icon: "solar:phone-calling-bold", label: "Téléphone", value: "+225 0747003450" },
    { icon: "solar:letter-bold", label: "Email", value: "contact@tarafe.com" },
    { icon: "solar:clock-circle-bold", label: "Horaires", value: "9h à 20h — Lun. au Sam." },
];

// =============================
// Form Fields Config
// =============================
const fields = [
    { label: "Nom complet", name: "nomPrenom", placeholder: "PROXIMITY KOUASSI", type: "text", icon: "solar:user-bold" },
    { label: "Email", name: "email", placeholder: "info@exemple.com", type: "email", icon: "solar:letter-bold" },
    { label: "Téléphone", name: "phone", placeholder: "+225 01 53 68 6819", type: "tel", icon: "solar:phone-bold" },
    { label: "Objet", name: "objets", placeholder: "Sujet du message", type: "text", icon: "solar:tag-bold" },
] as const;

// =============================
// Main Component
// =============================
export default function ContactForm() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

    const onSubmit = async (data: ContactFormData) => {
        setLoading(true);
        console.log("📤 Données envoyées :", data);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            reset();
            setTimeout(() => setSuccess(false), 4000);
        }, 1500);
    };

    if (!mounted) return <ContactSkeleton />;

    return (
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl my-section py-10 shadow-2xl shadow-black/8">

            {/* ── COLONNE GAUCHE — dark branded ── */}
            <motion.div
                className="relative bg-[#242078] text-white p-10 md:p-14 flex flex-col justify-center space-y-8 overflow-hidden"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, ease }}
            >
                {/* Decorative background elements */}
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
                <div className="absolute top-8 -right-8 w-40 h-40 rounded-full border border-white/8 pointer-events-none" />
                <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-36 h-36 rounded-full bg-white/4 blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-8 w-4 h-4 rounded-full bg-brand-primary/60 pointer-events-none" />
                <div className="absolute top-16 right-24 w-2 h-2 rounded-full bg-white/30 pointer-events-none" />

                {/* Label */}
                <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15, ease }}
                >
                    <span className="w-5 h-px bg-brand-primary" />
                    <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">
                        Nous contacter
                    </span>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.25, ease }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight text-white">
                        Discutons de <span className="text-brand-primary">votre projet</span>
                    </h2>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    className="text-white/60 text-base leading-relaxed"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.35, ease }}
                >
                    Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans vos projets de personnalisation.
                </motion.p>

                {/* Contact items */}
                <div className="space-y-4 pt-2">
                    {contactItems.map((item, i) => (
                        <motion.div
                            key={i}
                            className="flex items-start gap-4 group"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.4 + i * 0.09, ease }}
                        >
                            <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-brand-primary/20 transition-colors duration-300 shrink-0">
                                <Icon icon={item.icon} className="w-4 h-4 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-0.5">
                                    {item.label}
                                </p>
                                <p className="text-white font-semibold text-sm">{item.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ── COLONNE DROITE — formulaire ── */}
            <motion.div
                className="bg-card p-10 md:p-14 flex flex-col justify-center"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, ease }}
            >
                {/* Form header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease }}
                >
                    <h3 className="text-xl font-black text-foreground mb-1">Envoyer un message</h3>
                    <p className="text-muted-foreground text-sm">
                        Les champs marqués <span className="text-brand-primary font-bold">*</span> sont obligatoires.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Text fields */}
                    {fields.map((field, i) => {
                        const error = errors[field.name as keyof ContactFormData];
                        return (
                            <motion.div
                                key={field.name}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease }}
                            >
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    {field.label} <span className="text-brand-primary">*</span>
                                </label>
                                <div className="relative">
                                    <Icon
                                        icon={field.icon}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4 pointer-events-none"
                                    />
                                    <input
                                        {...register(field.name as keyof ContactFormData)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        className="w-full border border-border rounded-xl pl-10 pr-4 py-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/60 hover:border-border/80 transition-all duration-200 placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium"
                                        >
                                            <Icon icon="solar:danger-circle-bold" width={12} />
                                            {error.message?.toString()}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}

                    {/* Textarea */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.43, ease }}
                    >
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Message <span className="text-brand-primary">*</span>
                        </label>
                        <textarea
                            {...register("contents")}
                            rows={4}
                            placeholder="Décrivez votre projet ou posez votre question..."
                            className="w-full border border-border rounded-xl px-4 py-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/60 hover:border-border/80 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                        />
                        <AnimatePresence>
                            {errors.contents && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium"
                                >
                                    <Icon icon="solar:danger-circle-bold" width={12} />
                                    {errors.contents.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Submit button */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.5, ease }}
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary text-white rounded-xl py-3.5 font-bold text-sm hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-brand-primary/25"
                        >
                            {loading ? (
                                <>
                                    <Icon icon="solar:refresh-circle-bold" className="w-4 h-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    Envoyer le message
                                    <Icon icon="solar:plain-bold" className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Success message */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                transition={{ duration: 0.35, ease }}
                                className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                                    <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Message envoyé !</p>
                                    <p className="text-xs opacity-70">Nous vous répondrons dans les plus brefs délais.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </section>
    );
}
