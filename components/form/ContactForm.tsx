"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Icon } from "@iconify/react";

// ✅ Validation Zod
const contactSchema = z.object({
    nomPrenom: z.string().min(2, "Le nom complet est requis"),
    email: z.string().email("Adresse e-mail invalide"),
    phone: z.string().min(8, "Numéro de téléphone invalide"),
    objets: z.string().min(2, "L’objet est requis"),
    contents: z.string().min(5, "Le message est requis"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // ✅ Anti-hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setLoading(true);
        console.log("📤 Données envoyées :", data);

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            reset();

            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    // ⛔ Aucun rendu avant le montage client
    if (!mounted) {
        // === Skeleton ===
        return (
            <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-sm-lg my-section py-10 animate-pulse gap-6">

                {/* ---- Colonne gauche skeleton ---- */}
                <div className="bg-white text-gray-900 p-10 md:p-14 flex flex-col justify-center space-y-4">
                    <div className="h-10 w-64 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                    <div className="space-y-2 mt-4">
                        <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-3 w-2/5 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* ---- Formulaire skeleton ---- */}
                <div className="bg-gray-50 p-10 flex flex-col justify-center space-y-4">
                    {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="h-10 w-full bg-gray-200 rounded"></div>
                    ))}
                    <div className="h-24 w-full bg-gray-200 rounded"></div>
                    <div className="h-12 w-1/3 bg-gray-300 rounded mt-2 mx-auto"></div>
                </div>

            </section>
        );
    }

    // === Formulaire réel ===
    return (
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-xl my-section py-10 ">

            {/* ---- COLONNE GAUCHE ---- */}
            <div className="bg-background text-foreground p-10 md:p-14 flex flex-col justify-center space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 text-brand-secondary leading-tight">
                    Contactez-nous
                </h2>

                <p className="text-muted-foreground text-lg leading-relaxed">
                    Votre adresse électronique ne sera pas publiée. <br />
                    Les champs obligatoires sont marqués (
                    <span className="text-brand-primary">*</span>)
                </p>

                <div className="mt-6 space-y-4 text-foreground/80 text-base font-medium">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-muted rounded-lg">
                            <Icon icon="solar:map-point-bold" className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <p>Abidjan, Côte d’Ivoire</p>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-muted rounded-lg">
                            <Icon icon="solar:phone-calling-bold" className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <p>+225 0747003450</p>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-muted rounded-lg">
                            <Icon icon="solar:letter-bold" className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <p>contact@tarafe.com</p>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-muted rounded-lg">
                            <Icon icon="solar:clock-circle-bold" className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <p>9h à 20h (lundi au samedi)</p>
                    </div>
                </div>
            </div>

            {/* ---- FORMULAIRE ---- */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-muted p-10 flex flex-col justify-center space-y-5"
            >
                {[
                    { label: "Nom complet", name: "nomPrenom", placeholder: "PROXIMITY KOUASSI" },
                    { label: "Email", name: "email", placeholder: "info@exemple.com", type: "email" },
                    { label: "Téléphone", name: "phone", placeholder: "+225 01 53 68 6819", type: "tel" },
                    { label: "Objet", name: "objets", placeholder: "Sujet du message" },
                ].map((field) => {
                    const error = errors[field.name as keyof ContactFormData];

                    return (
                        <div key={field.name}>
                            <label className="block text-sm font-bold mb-1">
                                {field.label} <span className="text-[#fd980e]">*</span>
                            </label>

                            <input  {...register(field.name as keyof ContactFormData)}
                                type={field.type ?? "text"}
                                placeholder={field.placeholder}
                                className="w-full border border-border rounded-lg p-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary hover:border-brand-primary/50 transition-all duration-300"
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-1">
                                    {error.message?.toString()}
                                </p>
                            )}
                        </div>
                    );
                })}

                <div>
                    <label className="block text-sm font-bold mb-1">
                        Message <span className="text-[#fd980e]">*</span>
                    </label>

                    <textarea
                        {...register("contents")}
                        rows={4}
                        placeholder="Écrivez votre message ici..."
                        className="w-full border border-border rounded-lg p-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary hover:border-brand-primary/50 transition-all duration-300" />

                    {errors.contents && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.contents.message}
                        </p>
                    )}
                </div>

                <button type="submit" disabled={loading} className="bg-brand-primary text-white rounded-full py-4 px-8 font-bold text-lg hover:bg-brand-secondary hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-brand-primary/20" >
                    {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>

                {success && (
                    <p className="text-green-600 text-sm flex items-center justify-center gap-2 mt-2">
                        <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                        Message envoyé avec succès !
                    </p>
                )}
            </form>

        </section>
    );
}
