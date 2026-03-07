"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Icon } from "@iconify/react";
import { Partenaire } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { createPartner, updatePartner } from "@/service/managementServices";
import { Input } from "../ui/input";

const partnerSchema = z.object({
    libelle_partenaires: z.string().min(1, { message: "Le nom du partenaire est requis." }),
    status_partenaires: z.boolean(),
    images: z.array(z.string()).optional(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

interface PartnerFormProps {
    partnerData?: Partial<Partenaire>;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function PartnerForm({ isOpen, onClose, partnerData, fetchData }: PartnerFormProps) {
    const urlImages = getImagesUrl();

    // État pour les images (prévisualisation)
    const [images, setImages] = useState<string[]>([]);

    // État pour les nouveaux fichiers image
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!partnerData?.id;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<PartnerFormValues>({
        resolver: zodResolver(partnerSchema),
        defaultValues: {
            libelle_partenaires: partnerData?.libelle_partenaires || "",
            status_partenaires: partnerData?.status_partenaires === "1" ? true : false,
            images: partnerData?.path_partenaires ? [partnerData.path_partenaires] : [],
        },
    });

    // Chargement de l'image existante
    useEffect(() => {
        if (partnerData?.path_partenaires) {
            const imageUrl = `${urlImages}/${partnerData.path_partenaires}`;
            setImages([imageUrl]);
            setValue("images", [partnerData.path_partenaires], { shouldValidate: true });
        } else {
            setImages([]);
            setValue("images", [], { shouldValidate: true });
        }
        setNewImageFiles([]);
    }, [partnerData, urlImages, setValue]);

    const handleImageUpload = (files: FileList) => {
        const filesArray = Array.from(files);

        if (images.length + filesArray.length > 1) {
            toast.error("Vous ne pouvez ajouter qu'une seule image maximum");
            return;
        }

        filesArray.forEach(file => {
            if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
                toast.error("L'image doit être au format PNG, JPEG, JPG, WEBP ou SVG.");
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setImages([imageUrl]);
            setNewImageFiles([file]);
        });
    };

    const removeImage = () => {
        setImages([]);
        setNewImageFiles([]);
        setValue("images", [], { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<PartnerFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("libelle_partenaires", data.libelle_partenaires);
            formData.append("status_partenaires", data.status_partenaires ? "1" : "0");

            // Gestion des images
            if (newImageFiles.length > 0) {
                formData.append("path_partenaires", newImageFiles[0]);
            } else if (images.length === 0 && partnerData?.path_partenaires) {
                // Si on a supprimé l'image existante
                formData.append("remove_image", "true");
            } else if (partnerData?.path_partenaires) {
                // Si l'image n'a pas changé
                formData.append("path_partenaires", partnerData.path_partenaires);
            }

            let result;
            if (isEditMode && partnerData?.id) {
                result = await updatePartner(Number(partnerData.id), formData);
            } else {
                result = await createPartner(formData);
            }

            if (result.statusCode === 200 || result.statusCode === 201) {
                toast.success(isEditMode ? "Partenaire mis à jour !" : "Partenaire créé !");
                fetchData();
                onClose();
            } else {
                toast.error(result.message || "Erreur lors de l'enregistrement.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-brand-primary2/10 rounded-lg">
                    <Icon icon="solar:users-group-two-rounded-bold" className="w-6 h-6 text-brand-primary2" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? "Modifier le Partenaire" : "Ajouter un Partenaire"}
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nom du Partenaire *</label>
                    <Input
                        {...register("libelle_partenaires")}
                        type="text"
                        placeholder="Ex: Google, Microsoft..."
                        className={`h-12 ${errors.libelle_partenaires ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.libelle_partenaires && (
                        <p className="text-red-500 text-xs font-medium mt-1">{errors.libelle_partenaires.message}</p>
                    )}
                </div>

                {/* Section Image - Style FeatureForm original */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Icon icon="solar:upload-minimalistic-bold" className="w-5 h-5" />
                            Logo du partenaire
                        </h3>
                        <span className="text-sm text-gray-500">
                            {images.length}/1 image
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {/* Upload Button */}
                        <label className={`relative h-48 rounded-lg border-2 border-dashed ${images.length >= 1 ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 hover:border-blue-500 cursor-pointer'} transition-colors flex flex-col items-center justify-center bg-gray-50`}>
                            <Icon icon="solar:upload-minimalistic-bold" className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-600 font-semibold">Ajouter un logo</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, WEBP</span>
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
                            <div key={index} className="relative h-48 rounded-lg border border-gray-100 overflow-hidden group shadow-inner">
                                <Image src={image} alt={`Partner Logo`} fill className="object-contain p-4" unoptimized />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Supprimer l'image"
                                >
                                    <Icon icon="solar:close-square-bold" className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1.5 text-center backdrop-blur-sm">
                                    Logo sélectionné
                                </div>
                            </div>
                        ))}
                    </div>

                    {errors.images && (
                        <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Statut de visibilité</span>
                        <span className="text-xs text-gray-500 italic">Afficher ou masquer ce partenaire sur le site</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("status_partenaires")}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:after:translate-x-7 shadow-sm"></div>
                    </label>
                </div>

                <div className="flex gap-4 justify-end pt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="ghost"
                        className="px-6 text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-brand-primary2 hover:bg-brand-primary2/90 text-white px-8 font-bold h-12 shadow-lg shadow-brand-primary2/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:refresh-bold" className="w-5 h-5 animate-spin" />
                                <span>Action en cours...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Icon icon={isEditMode ? "solar:diskette-bold" : "solar:add-square-bold"} className="w-5 h-5" />
                                <span>{isEditMode ? "Sauvegarder les modifications" : "Sauvegarder"}</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
