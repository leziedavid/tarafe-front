"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Pricing } from "@/types/interfaces";
import { createPricing, updatePricing } from "@/service/managementServices";

const pricingSchema = z.object({
    product_name: z.string().min(1, { message: "Le nom du produit est requis." }),
    quantity: z.union([z.string(), z.number()]).refine(val => val !== "", { message: "La quantité est requise." }),
    unit_price: z.string().min(1, { message: "Le prix unitaire est requis." }),
    description: z.string().optional(),
    is_active: z.boolean(),
});

type PricingFormValues = {
    product_name: string;
    quantity: string | number;
    unit_price: string;
    description?: string;
    is_active: boolean;
};

interface PricingFormProps {
    pricingData?: Partial<Pricing>;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function PricingForm({ isOpen, onClose, pricingData, fetchData }: PricingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!pricingData?.id;

    const { register, handleSubmit, formState: { errors } } = useForm<PricingFormValues>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            product_name: pricingData?.product_name || "",
            quantity: pricingData?.quantity || "",
            unit_price: pricingData?.unit_price || "",
            description: pricingData?.description || "",
            is_active: pricingData?.is_active === 1 ? true : false,
        },
    });

    const onSubmit: SubmitHandler<PricingFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                is_active: data.is_active ? 1 : 0
            };

            let result;
            if (isEditMode && pricingData?.id) {
                result = await updatePricing(pricingData.id, payload);
            } else {
                result = await createPricing(payload);
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
