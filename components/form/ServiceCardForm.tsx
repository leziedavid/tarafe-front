"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ServiceCard } from "@/types/interfaces";
import { createServiceCard, updateServiceCard } from "@/service/managementServices";
import { FileText, Tag } from "lucide-react";
import RichTextEditor from "../rich-text-editor";

// ================= ZOD VALIDATION =================
const serviceCardSchema = z.object({
    title: z.string().min(1, { message: "Le titre est requis." }),
    description: z.string().optional(),
    bg_color: z.string().optional(),
    link: z.string().optional(),
    position: z.number().min(0, { message: "La position doit être un nombre positif." }),
    is_active: z.boolean(),
});

export type ServiceCardFormValues = z.infer<typeof serviceCardSchema>;

interface ServiceCardFormProps {
    cardData?: Partial<ServiceCard>;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function ServiceCardForm({ isOpen, onClose, cardData, fetchData }: ServiceCardFormProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!cardData?.id;

    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<ServiceCardFormValues>({
        resolver: zodResolver(serviceCardSchema),
        defaultValues: {
            title: cardData?.title || "",
            description: cardData?.description || "",
            bg_color: cardData?.bg_color || "",
            link: cardData?.link || "",
            position: cardData?.position || 0,
            is_active: cardData?.is_active === 1 ? true : false,
        },
    });

    // Observer la valeur de is_active pour l'affichage
    const isActiveValue = watch("is_active");

    const onSubmit: SubmitHandler<ServiceCardFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description || "");
            formData.append("bg_color", data.bg_color || "");
            formData.append("link", data.link || "");
            formData.append("position", String(data.position));
            // Convertir le boolean en "1" ou "0" pour l'API
            formData.append("is_active", data.is_active ? "1" : "0");

            let result;
            if (isEditMode && cardData?.id) {
                result = await updateServiceCard(cardData.id, formData);
            } else {
                result = await createServiceCard(formData);
            }

            if (result.statusCode === 200 || result.statusCode === 201) {
                toast.success(isEditMode ? "Service Card mis à jour !" : "Service Card créé !");
                fetchData();
                onClose();
            } else {
                toast.error(result.message || "Erreur lors de l'enregistrement.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue pendant la soumission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{isEditMode ? "Modifier le Service" : "Créer un nouveau Service"}</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Titre *</label>
                        <input {...register("title")} type="text" className="w-full px-3 py-2 border rounded-lg" />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Couleur (ex: tarafe-blue)</label>
                        <input {...register("bg_color")} type="text" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Lien</label>
                        <input {...register("link")} type="text" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <input {...register("position", { valueAsNumber: true })} type="number" className="w-full px-3 py-2 border rounded-lg" />
                        {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
                    </div>

                    {/* Options avancées */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <Tag className="w-5 h-5" />
                            Options avancées
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex-1">
                                    <label htmlFor="is_active" className="block text-sm font-medium text-gray-900 dark:text-white mb-1 cursor-pointer"  >
                                        Statut du Service Card
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isActiveValue ? "Le Service Card sera visible sur le site" : "Le Service Card sera masqué sur le site"}
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="is_active"
                                        checked={isActiveValue}
                                        onChange={(e) => { setValue("is_active", e.target.checked, { shouldValidate: true }); }}
                                        className="sr-only peer"
                                    />
                                    <div className="
                                        w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer 
                                        peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-500/30
                                        peer-checked:bg-green-500
                                        after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                                        after:bg-white after:rounded-full after:h-5 after:w-5
                                        after:transition-all peer-checked:after:translate-x-full
                                        peer-checked:after:border-white transition-colors duration-200
                                    "></div>
                                </label>
                            </div>
                        </div>
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
                            <Controller  name="description"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor  content={field.value || ""}  onChange={field.onChange} editable={true} />
                                )}
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
                        <Button type="button" onClick={onClose} className="px-6 py-3 border border-red-300 dark:border-gray-600 bg-red-500 dark:bg-red-800 text-white dark:text-white-300 rounded-lg hover:bg-red-500 dark:hover:bg-red-700 transition-colors" disabled={isSubmitting}  >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-brand-primary2 text-white rounded-lg hover:bg-brand-secondary2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"  >
                            {isSubmitting ? (
                                <>  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enregistrement...
                                </>) : isEditMode ? ("Mettre à jour") : ("Créer")}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
