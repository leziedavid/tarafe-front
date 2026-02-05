"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

    // ⛔ Important : aucun rendu avant le montage client
    if (!mounted) return null;

    return (
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-sm-lg my-section py-10">

            {/* ---- COLONNE GAUCHE ---- */}
            <div className="bg-white text-gray-900 p-10 md:p-14 flex flex-col justify-center space-y-6">
                <h2 className="text-4xl font-bold text-[#242078] uppercase">
                    Contactez-nous
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed">
                    Votre adresse électronique ne sera pas publiée. <br />
                    Les champs obligatoires sont marqués (
                    <span className="text-[#fd980e]">*</span>)
                </p>

                <div className="mt-6 space-y-6 text-gray-700 text-base">
                    <p>📍 <span className="font-bold">Abidjan, Côte d’Ivoire</span></p>
                    <p>📞 <span className="font-bold">+225 0747003450</span></p>
                    <p>✉️ <span className="font-bold">contact@tarafe.com</span></p>
                    <p>🕓 <span className="font-bold">9h à 20h (lundi au samedi)</span></p>
                </div>
            </div>

            {/* ---- FORMULAIRE ---- */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-gray-50 p-10 flex flex-col justify-center space-y-5"
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

                            <input
                                {...register(field.name as keyof ContactFormData)}
                                type={field.type ?? "text"}
                                placeholder={field.placeholder}
                                className="w-full border border-gray-300 rounded-sm p-2 text-gray-800 text-sm
                                           focus:outline-none focus:ring-1 focus:ring-[#242078]
                                           focus:border-[#242078] hover:border-gray-400
                                           transition-all duration-300"
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
                        className="w-full border border-gray-300 rounded-sm p-2 text-gray-800 text-sm
                                   focus:outline-none focus:ring-1 focus:ring-[#242078]
                                   focus:border-[#242078] hover:border-gray-400
                                   transition-all duration-300"
                    />

                    {errors.contents && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.contents.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#fd980e] text-white rounded-pill py-3.5 px-8 font-semibold
                               hover:bg-[#242078] hover:scale-105 transition-all duration-300
                               disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>

                {success && (
                    <p className="text-green-600 text-sm text-center mt-2">
                        ✅ Message envoyé avec succès !
                    </p>
                )}
            </form>
        </section>
    );
}
