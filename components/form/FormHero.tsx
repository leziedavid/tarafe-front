"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { X, Upload, Tag, FileText } from "lucide-react";
import { Hero } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { createHero, deleteHeroImage, updateHero } from "@/service/managementServices";
import RichTextEditor from "../rich-text-editor";

// ================= ZOD VALIDATION =================
// Schéma de base pour les héros - is_active est REQUIS (pas optional)
const baseHeroSchema = z.object({
    title: z.string().min(1, { message: "Le titre est requis." }),
    highlight_text: z.string().optional(),
    description: z.string().optional(),
    primary_button_text: z.string().optional(),
    primary_button_link: z.string().optional(),
    secondary_button_text: z.string().optional(),
    secondary_button_link: z.string().optional(),
    images: z.array(z.string()).optional(),
    is_active: z.boolean(),
});

// On crée un type qui force is_active à être toujours présent
type HeroFormValues = {
    title: string;
    highlight_text?: string;
    description?: string;
    primary_button_text?: string;
    primary_button_link?: string;
    secondary_button_text?: string;
    secondary_button_link?: string;
    images?: string[];
    is_active: boolean; // Toujours requis
};

interface FormHeroProps {
    heroData?: Partial<Hero>;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function FormHero({ isOpen, onClose, heroData, fetchData }: FormHeroProps) {
    const urlImages = getImagesUrl();

    // État pour les images (prévisualisation)
    const [images, setImages] = useState<string[]>([]);

    // État pour les nouveaux fichiers image
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!heroData?.id;

    const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm<HeroFormValues>({
        resolver: zodResolver(baseHeroSchema),
        defaultValues: {
            title: heroData?.title || "",
            highlight_text: heroData?.highlight_text || "",
            description: heroData?.description || "",
            primary_button_text: heroData?.primary_button_text || "",
            primary_button_link: heroData?.primary_button_link || "",
            secondary_button_text: heroData?.secondary_button_text || "",
            secondary_button_link: heroData?.secondary_button_link || "",
            images: heroData?.image ? [heroData.image] : [],
            is_active: heroData?.is_active === 1 ? true : false,
        },
    });

    // Observer la valeur de is_active pour l'affichage
    const isActiveValue = watch("is_active");

    // Chargement de l'image existante
    useEffect(() => {
        if (heroData?.image) {
            const imageUrl = `${urlImages}/${heroData.image}`;
            setImages([imageUrl]);
            setValue("images", [heroData.image], { shouldValidate: true });
        } else {
            setImages([]);
            setValue("images", [], { shouldValidate: true });
        }
        setNewImageFiles([]);
    }, [heroData, urlImages, setValue]);

    // Mettre à jour le form lorsque images change
    useEffect(() => {
        if (images.length > 0) {
            const imageNames = images.map(img => {
                if (img.startsWith('blob:')) {
                    return img;
                }
                return img.replace(`${urlImages}/`, '');
            });
            setValue("images", imageNames, { shouldValidate: true });
        } else {
            setValue("images", [], { shouldValidate: true });
        }
    }, [images, setValue, urlImages]);

    const handleImageUpload = (files: FileList) => {
        const filesArray = Array.from(files);

        if (images.length + filesArray.length > 1) {
            toast.error("Vous ne pouvez ajouter qu'une seule image maximum pour le Hero");
            return;
        }

        filesArray.forEach(file => {
            if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
                toast.error("L'image doit être au format PNG, JPEG ou WEBP.");
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setImages([imageUrl]);
            setNewImageFiles([file]);
        });
    };

    const removeImage = async () => {
        setImages([]);
        setNewImageFiles([]);
        setValue("images", [], { shouldValidate: true });
        if (heroData?.id) {
            await deleteHeroImage(heroData.id);
        }
    };

    const onSubmit: SubmitHandler<HeroFormValues> = async (data) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("highlight_text", data.highlight_text || "");
            formData.append("description", data.description || "");
            formData.append("primary_button_text", data.primary_button_text || "");
            formData.append("primary_button_link", data.primary_button_link || "");
            formData.append("secondary_button_text", data.secondary_button_text || "");
            formData.append("secondary_button_link", data.secondary_button_link || "");

            // Convertir le boolean en "1" ou "0" pour l'API
            formData.append("is_active", data.is_active ? "1" : "0");

            if (newImageFiles.length > 0) {
                formData.append("image", newImageFiles[0]);
            } else if (images.length === 0 && heroData?.image) {
                formData.append("remove_image", "true");
            }

            let result;

            if (isEditMode && heroData?.id) {
                result = await updateHero(heroData.id, formData);
            } else {
                result = await createHero(formData);
            }

            if (result.statusCode === 200 || result.statusCode === 201) {
                toast.success(isEditMode ? "Hero mis à jour !" : "Hero créé !");
                fetchData();
                onClose();
            } else {
                toast.error(result.message || "Erreur lors de l'enregistrement.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
            toast.error("Une erreur est survenue pendant la soumission.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? "Modifier le Hero" : "Créer un nouveau Hero"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Image du Hero
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {images.length}/1 image
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            {/* Upload Button */}
                            <label className={`relative h-48 rounded-lg border-2 border-dashed ${images.length >= 1 ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer'} transition-colors flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700`}>
                                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Ajouter une image</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, WEBP</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                    disabled={images.length >= 1}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>

                            {/* Image Preview */}
                            {images.map((image, index) => (
                                <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                                    <Image
                                        src={image}
                                        alt={`Hero ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                        unoptimized
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Supprimer l'image ${index + 1}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                                        Image {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.images && (
                            <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>
                        )}
                    </div>

                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Titre *</label>
                        <input
                            {...register("title")}
                            type="text"
                            placeholder="Titre du Hero"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    {/* Highlight text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texte de mise en avant</label>
                        <input
                            {...register("highlight_text")}
                            type="text"
                            placeholder="Ex: Wahou !"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Boutons primaire et secondaire */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texte bouton primaire</label>
                            <input {...register("primary_button_text")} type="text" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lien bouton primaire</label>
                            <input {...register("primary_button_link")} type="text" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texte bouton secondaire</label>
                            <input {...register("secondary_button_text")} type="text" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lien bouton secondaire</label>
                            <input {...register("secondary_button_link")} type="text" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
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
                                    <label
                                        htmlFor="is_active"
                                        className="block text-sm font-medium text-gray-900 dark:text-white mb-1 cursor-pointer"
                                    >
                                        Statut du Hero
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isActiveValue
                                            ? "Le Hero sera visible sur le site"
                                            : "Le Hero sera masqué sur le site"}
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={isActiveValue}
                                        onChange={(e) => {
                                            setValue("is_active", e.target.checked, { shouldValidate: true });
                                        }}
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
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        content={field.value || ""}
                                        onChange={field.onChange}
                                        editable={true}
                                    />
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
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-red-300 dark:border-gray-600 bg-red-500 dark:bg-red-800 text-white dark:text-white-300 rounded-lg hover:bg-red-500 dark:hover:bg-red-700 transition-colors"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-brand-primary2 text-white rounded-lg hover:bg-brand-secondary2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enregistrement...
                                </>
                            ) : isEditMode ? (
                                "Mettre à jour le Hero"
                            ) : (
                                "Créer le Hero"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}