"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { FormSwitch } from "./FormSwitch";
import RichTextEditor from "../rich-text-editor";
import { getImagesUrl } from "@/types/baseUrl";

// ================= VALIDATION ZOD =================
export const storeSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").max(200, "Le nom est trop long"),
    slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères").max(200, "Le slug est trop long"),
    logo: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    active: z.number().min(0).max(1),
    added_by: z.number(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

interface StoreFormProps {
    initialValue?: Partial<StoreFormValues>;
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting: boolean;
    onClose: () => void;
    currentUserId?: number;
}

// ================= COMPOSANT =================
export default function StoreForm({ initialValue, onSubmit, isSubmitting, onClose, currentUserId }: StoreFormProps) {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const urlImages = getImagesUrl();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: initialValue?.name || "",
            slug: initialValue?.slug || "",
            logo: initialValue?.logo || null,
            description: initialValue?.description || "",
            active: initialValue?.active ?? 1, // 1 par défaut au lieu de false
            added_by: initialValue?.added_by || currentUserId,
        },
    });

    const watchedName = watch("name");
    const watchedActive = watch("active");

    // Utilitaire pour retirer les accents
    const normalizeString = (str: string) =>
        str
            .normalize("NFD")                // décomposer les accents
            .replace(/[\u0300-\u036f]/g, "") // retirer les diacritiques
            .replace(/[^\w\s-]/g, "")        // retirer caractères spéciaux
            .trim()
            .replace(/\s+/g, "-");           // espaces → tirets

    // Générer le slug automatiquement seulement si c'est une création
    useEffect(() => {
        if (!initialValue?.id && watchedName) {
            const generatedSlug = `Boutique-${normalizeString(watchedName).toLowerCase()}`;
            setValue("slug", generatedSlug);
        }
    }, [watchedName, initialValue?.id, setValue]);

    useEffect(() => {
        if (logoPreview) {
            setValue("logo", logoPreview, { shouldValidate: true });
        }
    }, [logoPreview, setValue]);

    const handleLogoUpload = (files: FileList) => {
        const file = files[0];
        if (!file) return;

        setLogoPreview(URL.createObjectURL(file)); // blob preview
        setLogoFile(file);
    };

    const removeLogo = () => {
        if (logoPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview(null);
        setLogoFile(null);
        setValue("logo", null);
    };

    useEffect(() => {
        if (initialValue?.logo) {
            setLogoPreview(`${urlImages}/${initialValue.logo}`);
        }
    }, [initialValue?.logo, urlImages]);

    // Fonction pour gérer le changement du switch
    const handleActiveChange = (checked: boolean) => {
        setValue("active", checked ? 1 : 0, { shouldValidate: true });
    };

    const handleFormSubmit: SubmitHandler<StoreFormValues> = async (data) => {
        console.log("Données soumises:", data); // Debug
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("slug", data.slug);
            formData.append("active", String(data.active));
            formData.append("added_by", String(data.added_by ?? 21));
            formData.append("description", data.description ?? "");

            // Gestion du logo
            if (logoFile) {
                formData.append("logo", logoFile);
            } else if (data.logo && typeof data.logo === 'string') {
                // Si c'est une chaîne (URL), on l'ajoute comme chaîne
                formData.append("logo", data.logo);
            } else {
                // Si pas de logo, on envoie une chaîne vide
                formData.append("logo", "");
            }

            await onSubmit(formData);
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {initialValue?.id ? "Modifier le store" : "Créer un nouveau store"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Remplissez les informations ci-dessous pour {initialValue?.id ? "modifier" : "ajouter"} un store
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Logo */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <Upload className="w-5 h-5" /> Logo du store
                        </h2>
                        <div className="flex items-center gap-4">
                            <label className="relative h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer bg-gray-50">
                                <Upload className="w-6 h-6 text-gray-400" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleLogoUpload(e.target.files)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>
                            {logoPreview && (
                                <div className="relative h-32 w-32 rounded-lg overflow-hidden">
                                    <Image src={logoPreview} alt="Logo" fill className="object-cover" unoptimized />
                                    <button
                                        type="button"
                                        onClick={removeLogo}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.logo && <p className="text-red-500 text-sm mt-2">{errors.logo.message}</p>}
                    </div>

                    {/* Informations de base */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nom */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du store *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    placeholder="Ex: Mon Super Store"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Slug */}
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug *
                                </label>
                                <input
                                    id="slug"
                                    type="text"
                                    {...register("slug")}
                                    placeholder="Ex: mon-super-store"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                            </div>

                            {/* Active - Version simplifiée sans utiliser register directement */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <label htmlFor="active" className="block text-sm font-medium text-gray-900 mb-1 cursor-pointer">
                                            Store actif
                                        </label>
                                        <p className="text-sm text-gray-600">
                                            Le store sera visible par les utilisateurs
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={watchedActive === 1}
                                            onChange={(e) => handleActiveChange(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className={`w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-brand-primary peer-checked:bg-green-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white transition-colors duration-200`}></div>
                                    </label>
                                </div>
                                {errors.active && <p className="text-red-500 text-sm mt-1">{errors.active.message}</p>}
                            </div>

                            {/* Description */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />
                                    )}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Enregistrement..." : initialValue?.id ? "Mettre à jour" : "Créer le store"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}