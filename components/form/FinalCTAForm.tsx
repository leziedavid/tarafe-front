"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FinalCTA } from "@/types/interfaces";
import { createFinalCTA, updateFinalCTA } from "@/service/managementServices";
import { FileText } from "lucide-react";
import RichTextEditor from "../rich-text-editor";

const finalCTASchema = z.object({
    title: z.string().min(1, { message: "Le titre est requis." }),
    description: z.string().min(1, { message: "La description est requise." }),
    button_text: z.string().optional(),
    button_link: z.string().optional(),
    active: z.boolean(),
});

export type FinalCTAFormValues = z.infer<typeof finalCTASchema>;

interface FinalCTAFormProps {
    ctaData?: Partial<FinalCTA>;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function FinalCTAForm({ isOpen, onClose, ctaData, fetchData }: FinalCTAFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!ctaData?.id;

    const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FinalCTAFormValues>({
        resolver: zodResolver(finalCTASchema),
        defaultValues: {
            title: ctaData?.title || "",
            description: ctaData?.description || "",
            button_text: ctaData?.button_text || "",
            button_link: ctaData?.button_link || "",
            active: ctaData?.active === 1 ? true : false,            // Initialiser avec les images existantes
        },
    });

    const onSubmit: SubmitHandler<FinalCTAFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("button_text", data.button_text || "");
            formData.append("button_link", data.button_link || "");
            formData.append("active", data.active ? "1" : "0");

            let result;
            if (isEditMode && ctaData?.id) result = await updateFinalCTA(ctaData.id, formData);
            else result = await createFinalCTA(formData);

            if (result.statusCode === 200 || result.statusCode === 201) {
                toast.success(isEditMode ? "CTA mis à jour !" : "CTA créé !");
                fetchData();
                onClose();
            } else toast.error(result.message || "Erreur lors de l'enregistrement.");
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue pendant la soumission.");
        } finally { setIsSubmitting(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800  p-6 space-y-6">

                <h2 className="text-xl font-bold">{isEditMode ? "Modifier la CTA finale" : "Créer une nouvelle CTA"}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Titre *</label>
                        <input {...register("title")} type="text" className="w-full px-3 py-2 border rounded-lg" />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Texte du bouton</label>
                        <input {...register("button_text")} type="text" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Lien du bouton</label>
                        <input {...register("button_link")} type="text" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">

                        <div className="flex-1">
                            <label htmlFor="active" className="block text-sm font-medium text-gray-900 dark:text-white mb-1 cursor-pointer">
                                Actif
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Affiche la feature sur le site
                            </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input id="active" type="checkbox" {...register("active")} className="sr-only peer" />
                            <div className=" w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-green-500/30
                                peer-checked:bg-green-500
                                after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                                after:bg-white after:rounded-full after:h-5 after:w-5
                                after:transition-all peer-checked:after:translate-x-full
                                peer-checked:after:border-white transition-colors duration-200" />
                        </label>
                    </div>


                    {/* Description avec RichTextEditor */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5" />
                            Description détaillée
                        </h3>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <Controller name="description" control={control}
                                render={({ field }) => (<RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />)}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button type="button" onClick={onClose}
                            className="px-6 py-3 border border-red-300 dark:border-gray-600 bg-red-500 dark:bg-red-800 text-white dark:text-white-300 rounded-lg hover:bg-red-500 dark:hover:bg-red-700 transition-colors"
                            disabled={isSubmitting} >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-brand-primary2 text-white rounded-lg hover:bg-brand-secondary2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enregistrement...
                                </>
                            ) : isEditMode ? ("Mettre à jour") : ("Créer")}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
