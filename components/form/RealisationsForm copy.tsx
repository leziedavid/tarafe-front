'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { X, Upload, Package, Hash, FileText } from "lucide-react";
import { Realisation } from "@/types/interfaces";
import { createRealisation, getCategories, getCategoriesById, getCategoryById, updateRealisation } from "@/service/realisationServices";
import { Select2 } from "./Select2";
import RichTextEditor from "@/components/rich-text-editor";
import { getImagesUrl } from "@/types/baseUrl";

// ================= VALIDATION ZOD =================
export const realisationSchema = z.object({
    id_realisations: z.number().optional(),
    category: z.array(z.string()).min(1, { message: "La catégorie est requise." }),
    libelle: z.string().min(1, { message: "Le libellé est requis." }),
    description: z.string().min(1, { message: "La description est requise." }),
    images: z.array(z.instanceof(File)).min(1, { message: "Veuillez télécharger au moins une image." }).refine((files) =>
        files.every(file => ['image/png', 'image/jpeg'].includes(file.type)), { message: 'Les fichiers doivent être des images PNG ou JPEG.', })
        .refine((files) => files.every(file => file.size <= 50 * 1024 * 1024), { message: 'Chaque fichier ne doit pas dépasser 5 Mo.', })
});

// ================= TYPES =================
export type RealisationFormValues = z.infer<typeof realisationSchema>;

type RealisationFormProps = {
    isOpen: boolean;
    onClose: () => void;
    datas?: Realisation | null;
    fetchdatas: () => void;
};

// ================= COMPOSANT PRINCIPAL =================
export default function RealisationsForm({ isOpen, onClose, datas, fetchdatas }: RealisationFormProps) {

    const urlImages = getImagesUrl();
    const [isUploading, setIsUploading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ value: number; label: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[] | null>(null);

    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [existingImageUrls, setExistingImageUrls] = useState<{ url: string, name: string }[]>([]);

    // ================= FORM SETUP =================
    const { register, handleSubmit, setValue, watch, control, formState: { errors }, } = useForm<RealisationFormValues>({

        resolver: zodResolver(realisationSchema),
        defaultValues: {
            category: [],
            libelle: datas?.libelle_realisations || "",
            description: datas?.descript_real || "",
            images: [],
        },
    });

    // ================= CHARGEMENT DES CATÉGORIES =================

    const fetchCategories = async () => {
        try {
            const result = await getCategories();
            if (result.statusCode === 200 && result.data) {
                const options = result.data.map((cat) => ({
                    value: cat.id_option_reaalisation,
                    label: cat.libelleOption_reaalisation,
                }));
                setCategoryOptions(options);
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des catégories.");
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {

        fetchCategories();

    }, [isOpen]);

    // ================= REMPLISSAGE DES DONNÉES =================
    // Effet pour remplir automatiquement les données si datas est défini
    useEffect(() => {

        const fetchCategoriesById = async () => {
            try {
                if (!datas?.id_realisations) return;

                const result = await getCategoriesById(
                    Number(datas.id_realisations)
                );

                if (result.statusCode === 200 && Array.isArray(result.data)) {
                    const categoryIds = result.data
                        .map(cat => cat.idoption_realis_op_realisation)
                        .filter(Boolean)
                        .map(String);

                    // Select2
                    setSelectedCategory(categoryIds);

                    // React Hook Form
                    setValue("category", categoryIds, {
                        shouldValidate: true,
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error(
                    "Erreur lors du chargement des catégories associées."
                );
            }
        };

        if (datas?.id_realisations) {
            // Champs texte
            setValue("libelle", datas.libelle_realisations ?? "");
            setValue("description", datas.descript_real ?? "");

            // Images existantes
            const imageUrls: { url: string; name: string }[] = [];

            if (datas.images_realisations) {
                imageUrls.push({
                    url: `${urlImages}/${datas.images_realisations}`,
                    name: datas.libelle_realisations ?? "image",
                });
            }

            if (Array.isArray(datas.images)) {
                datas.images.forEach(img => {
                    if (img.filles_img_realisations) {
                        imageUrls.push({
                            url: `${urlImages}/${img.filles_img_realisations}`,
                            name: img.filles_img_realisations,
                        });
                    }
                });
            }

            setExistingImageUrls(imageUrls);

            fetchCategoriesById();
        } else {
            // Reset création
            setValue("libelle", "");
            setValue("description", "");
            setValue("category", []);
            setSelectedCategory(null);
            setImages([]);
            setImagePreviews([]);
            setExistingImageUrls([]);
        }
    }, [datas?.id_realisations, urlImages]);



    // Mettre à jour les images dans le formulaire
    useEffect(() => {
        if (images.length > 0) {
            setValue("images", images, { shouldValidate: true });
        }
    }, [images, setValue]);

    // ================= FONCTIONS =================
    const handleImageUpload = (files: FileList) => {
        const newFiles = Array.from(files);

        // Vérifier le nombre maximal d'images (8 par exemple)
        if (images.length + newFiles.length > 8) {
            toast.error("Maximum 8 images autorisées");
            return;
        }

        // Vérifier les types de fichiers
        const validFiles = newFiles.filter(file =>
            ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
        );

        if (validFiles.length !== newFiles.length) {
            toast.error("Seuls les fichiers PNG, JPG et JPEG sont autorisés");
        }

        setImages(prev => [...prev, ...validFiles]);

        // Créer des prévisualisations
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number, isExistingImage: boolean = false) => {
        if (isExistingImage) {
            // Supprimer une image existante du tableau
            setExistingImageUrls(prev => prev.filter((_, i) => i !== index));

            // Si l'image supprimée était l'image principale, on devrait peut-être gérer cela différemment
            // Pour l'instant, on la supprime simplement de l'affichage
        } else {
            // Supprimer une nouvelle image
            setImages(prev => prev.filter((_, i) => i !== index));
            setImagePreviews(prev => {
                // Libérer l'URL de prévisualisation
                URL.revokeObjectURL(prev[index]);
                return prev.filter((_, i) => i !== index);
            });
        }
    };

    const handleCategoryChange = (values: string[] | null) => {
        setSelectedCategory(values);
        setValue("category", values ?? [], { shouldValidate: true });
    };

    const handleFormSubmit: SubmitHandler<RealisationFormValues> = async (formData) => {

        // Vérifier si c'est une création et qu'il n'y a pas d'images
        if (!datas?.id_realisations && formData.images.length === 0) {
            toast.error("Veuillez télécharger au moins une image");
            return;
        }

        // Vérifier si on a des images existantes OU des nouvelles images pour la modification
        if (datas?.id_realisations && formData.images.length === 0 && existingImageUrls.length === 0) {
            toast.error("Veuillez télécharger au moins une image");
            return;
        }

        // Créer FormData pour l'envoi des données
        const formDataToSend = new FormData();
        // Ajouter les nouvelles images si elles existent
        formData.images.forEach((file) => formDataToSend.append("filedatas", file));
        // Ajouter les autres données
        formDataToSend.append("states", formData.images.length > 0 || existingImageUrls.length > 0 ? "1" : "0");
        formDataToSend.append("libelle", formData.libelle);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("usersid", "21");
        formDataToSend.append("positions", "2");

        if (datas?.id_realisations) {
            formDataToSend.append("id_realisations", datas.id_realisations.toString());
        }

        formDataToSend.append("selected", formData.category.join(","));
        setIsUploading(true);

        try {
            if (datas?.id_realisations) {
                const result = await updateRealisation(Number(datas.id_realisations), formDataToSend);
                if (result.statusCode === 200) {
                    toast.success("Réalisation mise à jour avec succès !");
                    fetchdatas();
                    onClose();
                } else {
                    toast.error("Erreur lors de la mise à jour.");
                }
            } else {
                const result = await createRealisation(formDataToSend);
                if (result.statusCode === 200) {
                    toast.success("Réalisation créée avec succès !");
                    fetchdatas();
                    onClose();
                } else {
                    toast.error("Erreur lors de la création.");
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
            toast.error("Une erreur s'est produite pendant la soumission.");
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="min-h-screen ">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {datas?.id_realisations ? `Modifier la réalisation` : "Ajouter une nouvelle réalisation"}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Remplissez les informations ci-dessous pour {datas?.id_realisations ? "modifier" : "ajouter"} une réalisation
                        </p>
                    </div>


                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Images Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Images de la réalisation
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {existingImageUrls.length + images.length}/8 images
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                            {/* Upload Button */}
                            <label className={`relative h-32 rounded-lg border-2 border-dashed ${existingImageUrls.length + images.length >= 8 ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer'} transition-colors flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900`}>
                                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Ajouter une image</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">JPG, PNG</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                    disabled={existingImageUrls.length + images.length >= 8}
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>

                            {/* Afficher les images existantes */}
                            {existingImageUrls.map((imageUrl, index) => (
                                <div key={`existing-${index}`} className="relative h-32 rounded-lg overflow-hidden group">
                                    <Image
                                        src={imageUrl.url}
                                        alt={`Image existante ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                        unoptimized // Pour les images blob
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index, true)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Supprimer l'image existante ${index + 1}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                                        {index === 0 ? "Image principale" : `Image ${index + 1}`}
                                    </div>
                                </div>
                            ))}

                            {/* Afficher les nouvelles images */}
                            {imagePreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="relative h-32 rounded-lg overflow-hidden group">
                                    <Image
                                        src={preview}
                                        alt={`Nouvelle image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                        unoptimized // Pour les images blob
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index, false)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Supprimer la nouvelle image ${index + 1}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                                        Nouvelle image {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.images && (
                            <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>
                        )}
                    </div>

                    {/* Informations de base */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <Package className="w-5 h-5" />
                            Informations de base
                        </h3>

                        <div className="space-y-4">
                            {/* Libellé */}
                            <div>
                                <label htmlFor="libelle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Libellé *
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="libelle"
                                        {...register("libelle")}
                                        type="text"
                                        placeholder="Ex: Projet de construction"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                {errors.libelle && (
                                    <p className="text-red-500 text-sm mt-1">{errors.libelle.message}</p>
                                )}
                            </div>

                            {/* Catégories */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Catégories *
                                </label>
                                <Select2
                                    options={categoryOptions}
                                    selectedItem={selectedCategory}
                                    onSelectionChange={handleCategoryChange}
                                    labelExtractor={(item: { value: number; label: string }) => item.label}
                                    valueExtractor={(item: { value: number; label: string }) => item.value.toString()}
                                    placeholder="Sélectionnez des catégories"
                                    mode="multiple"
                                // disabled={loadingCategories}
                                />
                                {loadingCategories && (
                                    <p className="text-sm text-gray-500 mt-1">Chargement des catégories...</p>
                                )}
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5" />
                            Description détaillée
                        </h3>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description *
                            </label>
                            <Controller name="description" control={control} render={({ field }) => (<RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />)} />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button type="button" onClick={onClose} className="px-6 py-3 border bg-white border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" disabled={isUploading} >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isUploading} className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enregistrement...
                                </>
                            ) : datas?.id_realisations ? ("Mettre à jour") : ("Créer la réalisation")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}