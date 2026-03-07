"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Pricing } from "@/types/interfaces";
import { createPricing, updatePricing } from "@/service/managementServices";
import { getImagesUrl } from "@/types/baseUrl";
import { Icon } from "@iconify/react";
import { X } from "lucide-react";

const pricingSchema = z.object({
    product_name: z.string().min(1, { message: "Le nom du produit est requis." }),
    quantity: z.union([z.string(), z.number()]).refine(val => val !== "", { message: "La quantité est requise." }),
    unit_price: z.string().min(1, { message: "Le prix unitaire est requis." }),
    description: z.string().optional(),
    is_active: z.boolean(),
    images: z.array(z.instanceof(File)).optional(),
});

type PricingFormValues = {
    product_name: string;
    quantity: string | number;
    unit_price: string;
    description?: string;
    is_active: boolean;
    images?: File[];
};

interface PricingFormProps {
    pricingData?: Partial<Pricing>;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function PricingForm({ isOpen, onClose, pricingData, fetchData }: PricingFormProps) {
    const urlImages = getImagesUrl();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<{ url: string; name: string }[]>([]);

    const isEditMode = !!pricingData?.id;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<PricingFormValues>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            product_name: pricingData?.product_name || "",
            quantity: pricingData?.quantity || "",
            unit_price: pricingData?.unit_price || "",
            description: pricingData?.description || "",
            is_active: pricingData?.is_active === 1 ? true : false,
            images: [],
        },
    });

    useEffect(() => {
        if (pricingData?.files && Array.isArray(pricingData.files)) {
            const urls = pricingData.files.map(file => ({
                url: `${urlImages}/${file.file_path}`,
                name: file.file_path
            }));
            setExistingImageUrls(urls);
        } else {
            setExistingImageUrls([]);
        }

        // Reset local images when pricingData changes or modal opens
        setImages([]);
        setImagePreviews([]);
    }, [pricingData, urlImages, isOpen]);

    useEffect(() => {
        setValue("images", images);
    }, [images, setValue]);

    const handleImageUpload = (files: FileList) => {
        const newFiles = Array.from(files);

        if (images.length + existingImageUrls.length + newFiles.length > 8) {
            toast.error("Maximum 8 images autorisées");
            return;
        }

        const validFiles = newFiles.filter(file =>
            ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
        );

        if (validFiles.length !== newFiles.length) {
            toast.error("Seuls les fichiers PNG, JPG et JPEG sont autorisés");
        }

        setImages(prev => [...prev, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number, isExisting: boolean = false) => {
        if (isExisting) {
            setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
            setImagePreviews(prev => {
                URL.revokeObjectURL(prev[index]);
                return prev.filter((_, i) => i !== index);
            });
        }
    };

    const onSubmit: SubmitHandler<PricingFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("product_name", data.product_name);
            formData.append("quantity", data.quantity.toString());
            formData.append("unit_price", data.unit_price);
            formData.append("description", data.description || "");
            formData.append("is_active", data.is_active ? "1" : "0");

            // Following RealisationsForm pattern for multi-file upload
            images.forEach((file) => {
                formData.append("filedatas", file); // Or "image_pricing[]"? RealisationsForm uses "filedatas"
            });

            // If the backend expects "image_pricing" for pricing, we should verify. 
            // In my previous edit I used "image_pricing".
            // However, RealisationsForm uses "filedatas". 
            // Let's use "filedatas" but keep "image_pricing" as fallback if that was the correct key.
            // Actually, let's stick to "filedatas" to match RealisationsForm pattern exactly as requested.
            // Correction: Previous edit used "image_pricing". Let's stick to it but as array if supported.
            // Wait, "like in RealisationsForm" usually means use "filedatas".

            let result;
            if (isEditMode && pricingData?.id) {
                result = await updatePricing(pricingData.id, formData);
            } else {
                result = await createPricing(formData);
            }

            if (result.statusCode === 200 || result.statusCode === 201) {
                toast.success(isEditMode ? "Tarif mis à jour !" : "Tarif créé !");
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

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-6">
                {isEditMode ? "Modifier le Tarif" : "Ajouter un Tarif"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Section Images - Style RealisationsForm (Multi-images) */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Icon icon="solar:camera-bold" className="w-4 h-4 text-brand-primary2" />
                            Images du produit
                        </label>
                        <span className="text-[10px] text-gray-500">
                            {existingImageUrls.length + images.length}/8 images
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Upload Button */}
                        {existingImageUrls.length + images.length < 8 && (
                            <label className="h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary2 transition-colors bg-white">
                                <Icon icon="solar:upload-minimalistic-bold" className="w-6 h-6 text-gray-400" />
                                <span className="text-[10px] text-gray-500 mt-1">Ajouter</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                />
                            </label>
                        )}

                        {/* Existing Images */}
                        {existingImageUrls.map((img, idx) => (
                            <div key={`exist-${idx}`} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                <NextImage
                                    src={img.url}
                                    alt={img.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx, true)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}

                        {/* New Previews */}
                        {imagePreviews.map((preview, idx) => (
                            <div key={`new-${idx}`} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                <NextImage
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx, false)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white p-1 text-center">Nouveau</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 text-[10px] text-gray-500 flex gap-2">
                        <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">JPG, PNG</span>
                        <span className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">Max 5Mo</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Produit *</label>
                        <input
                            {...register("product_name")}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Ex: Tote bag"
                        />
                        {errors.product_name && <p className="text-red-500 text-sm mt-1">{errors.product_name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Quantité *</label>
                        <input
                            {...register("quantity")}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Ex: 50"
                        />
                        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Prix unitaire (FCFA) *</label>
                    <input
                        {...register("unit_price")}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Ex: 3 900 FCFA"
                    />
                    {errors.unit_price && <p className="text-red-500 text-sm mt-1">{errors.unit_price.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description (optionnelle)</label>
                    <textarea
                        {...register("description")}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Détails supplémentaires..."
                        rows={3}
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span>Statut Actif</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("is_active")}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>

                <div className="flex gap-4 justify-end">
                    <Button type="button" onClick={onClose} variant="outline">Annuler</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-brand-primary2">
                        {isSubmitting ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
