"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { X, Upload, FileText } from "lucide-react";
import { Feature } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { createFeature, updateFeature } from "@/service/managementServices";
import RichTextEditor from "../rich-text-editor";

// ================= ZOD VALIDATION =================
const featureSchema = z.object({
    title: z.string().min(1, { message: "Le titre est requis." }),
    description: z.string().min(1, { message: "La description est requise." }),
    link: z.string().optional(),
    reverse: z.boolean(),
    order: z.number().min(0, { message: "L'ordre doit être positif." }),
    active: z.boolean(),
    // Changement : accepter un tableau de string pour les images existantes
    images: z.array(z.string()).optional(),
});

export type FeatureFormValues = z.infer<typeof featureSchema>;

interface FeatureFormProps {
    featureData?: Partial<Feature>;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function FeatureForm({ isOpen, onClose, featureData, fetchData }: FeatureFormProps) {
    const urlImages = getImagesUrl();

    // État pour les images (prévisualisation)
    const [images, setImages] = useState<string[]>([]);

    // État pour les nouveaux fichiers image
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!featureData?.id;

    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FeatureFormValues>({
        resolver: zodResolver(featureSchema),
        defaultValues: {
            title: featureData?.title || "",
            description: featureData?.description || "",
            link: featureData?.link || "",
            reverse: featureData?.reverse === 1 ? true : false,            // Initialiser avec les images existantes
            order: featureData?.order || 0,
            active: featureData?.active === 1 ? true : false,            // Initialiser avec les images existantes
            images: featureData?.image ? [featureData.image] : [],
        },
    });

    // Chargement de l'image existante
    useEffect(() => {
        if (featureData?.image) {
            const imageUrl = `${urlImages}/${featureData.image}`;
            setImages([imageUrl]);
            setValue("images", [featureData.image], { shouldValidate: true });
        } else {
            setImages([]);
            setValue("images", [], { shouldValidate: true });
        }
        setNewImageFiles([]);
    }, [featureData, urlImages, setValue]);

    // Mettre à jour le form lorsque images change
    useEffect(() => {
        if (images.length > 0) {
            // Extraire seulement les noms de fichiers des URLs complètes
            const imageNames = images.map(img => {
                if (img.startsWith('blob:')) {
                    return img; // Garder les blobs temporaires
                }
                // Extraire le nom de fichier de l'URL complète
                return img.replace(`${urlImages}/`, '');
            });
            setValue("images", imageNames, { shouldValidate: true });
        } else {
            setValue("images", [], { shouldValidate: true });
        }
    }, [images, setValue, urlImages]);

    const handleImageUpload = (files: FileList) => {
        const filesArray = Array.from(files);

        // Pour Feature, on limite à 1 image
        if (images.length + filesArray.length > 1) {
            toast.error("Vous ne pouvez ajouter qu'une seule image maximum");
            return;
        }

        filesArray.forEach(file => {
            // Vérification du type de fichier
            if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
                toast.error("L'image doit être au format PNG, JPEG, JPG ou WEBP.");
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setImages([imageUrl]); // Remplace l'image existante
            setNewImageFiles([file]); // Remplace les fichiers existants
        });
    };

    const removeImage = () => {
        setImages([]);
        setNewImageFiles([]);
        setValue("images", [], { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<FeatureFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("link", data.link || "");
            formData.append("order", String(data.order));
            formData.append("active", data.active ? "1" : "0");
            formData.append("reverse", data.reverse ? "1" : "0");

            // Gestion des images
            if (newImageFiles.length > 0) {
                // Ajouter la nouvelle image
                formData.append("image", newImageFiles[0]);
            } else if (images.length === 0 && featureData?.image) {
                // Si on a supprimé l'image existante
                formData.append("remove_image", "true");
            }

            let result;
            if (isEditMode && featureData?.id) result = await updateFeature(featureData.id, formData);
            else result = await createFeature(formData);

            if (result.statusCode === 200 || result.statusCode === 201) {
                toast.success(isEditMode ? "Caractéristique mise à jour !" : "Caractéristique créée !");
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
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800  dark:border-gray-700 p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? "Modifier la caractéristique" : "Créer une nouvelle caractéristique"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Section - Similaire à ProductForm */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Image de la caractéristique
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
                                <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files)} disabled={images.length >= 1} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>

                            {/* Image Preview */}
                            {images.map((image, index) => (
                                <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                                    <Image src={image} alt={`Feature ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" unoptimized />
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

                    {/* Informations de la Feature */}
                    <div className="space-y-4">
                        {/* Titre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Titre *
                            </label>
                            <input {...register("title")} type="text" placeholder="Titre de la feature"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>


                        {/* Lien */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lien (optionnel)
                            </label>
                            <input  {...register("link")}
                                type="text"
                                placeholder="https://example.com"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Options avancées */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Options
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Reverse */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex-1">
                                        <label
                                            htmlFor="reverse"
                                            className="block text-sm font-medium text-gray-900 dark:text-white mb-1 cursor-pointer"
                                        >
                                            Image à gauche (reverse)
                                        </label>

                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Positionne l'image à gauche du texte
                                        </p>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id="reverse"
                                            type="checkbox"
                                            {...register("reverse")}
                                            className="sr-only peer"
                                        />

                                        <div className="
                                                w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer
                                                peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-500/30
                                                peer-checked:bg-blue-500
                                                after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                                                after:bg-white after:rounded-full after:h-5 after:w-5
                                                after:transition-all peer-checked:after:translate-x-full
                                                peer-checked:after:border-white transition-colors duration-200
                                            " />
                                    </label>
                                </div>

                                {/* Active */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex-1">
                                        <label
                                            htmlFor="active"
                                            className="block text-sm font-medium text-gray-900 dark:text-white mb-1 cursor-pointer"
                                        >
                                            Actif
                                        </label>

                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Affiche la feature sur le site
                                        </p>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id="active"
                                            type="checkbox"
                                            {...register("active")}
                                            className="sr-only peer"
                                        />

                                        <div className="
                                                w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer
                                                peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-green-500/30
                                                peer-checked:bg-green-500
                                                after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                                                after:bg-white after:rounded-full after:h-5 after:w-5
                                                after:transition-all peer-checked:after:translate-x-full
                                                peer-checked:after:border-white transition-colors duration-200
                                            " />
                                    </label>
                                </div>

                            </div>
                        </div>


                        {/* Ordre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ordre d'affichage
                            </label>
                            <input
                                {...register("order", { valueAsNumber: true })}
                                type="number"
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Détermine l'ordre d'affichage des features (plus petit = premier)
                            </p>
                            {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>}
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
                            <Controller name="description" control={control}
                                render={({ field }) => (
                                    <RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />
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
                            ) : isEditMode ? (
                                "Mettre à jour la Feature"
                            ) : (
                                "Créer la Feature"
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}