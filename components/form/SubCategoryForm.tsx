'use client';

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubCategoryProduct, CategoryProduct } from "@/types/interfaces";
import { createSubCategory, updateSubCategory } from "@/service/categoryServices";
import { subCategorySchema, SubCategoryFormValues } from "@/types/schemas/subCategorySchema";

type Props = {
    initialValues?: SubCategoryProduct;
    categoryOptions: CategoryProduct[];
    onClose: () => void;
    onSubmitSuccess: () => void;
};

export default function SubCategoryForm({
    initialValues,
    categoryOptions,
    onClose,
    onSubmitSuccess,
}: Props) {

    const isEdit = !!initialValues?.id;

    const form = useForm<SubCategoryFormValues>({
        resolver: zodResolver(subCategorySchema),
        defaultValues: {
            items: [
                { name: "", slug: "", categoryId: "" }
            ],
        },
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const generateSlug = (value: string): string =>
        value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");


    // ✅ AUTO-REMPLISSAGE EN ÉDITION
    useEffect(() => {
        if (initialValues) {
            reset({
                items: [{
                    name: initialValues.name ?? "",
                    slug: initialValues.slug ?? "",
                    categoryId: (
                        initialValues.category_id ?? ""
                    ).toString(),
                }],
            });
        }
    }, [initialValues, reset]);

    const onSubmit = async (values: SubCategoryFormValues) => {
        try {
            if (isEdit) {
                const item = values.items[0];
                await updateSubCategory(initialValues!.id, {
                    name: item.name,
                    category_id: Number(item.categoryId),
                });
                toast.success("Sous-catégorie mise à jour");
            } else {
                const payload = values.items.map(item => ({
                    name: item.name,
                    slug: item.slug,
                    category_id: Number(item.categoryId), // 👈 IMPORTANT
                    added_by: 21,
                }));

                await createSubCategory(payload);
                toast.success(`${payload.length} sous-catégorie(s) créée(s)`);
            }

            onSubmitSuccess();
            onClose();
        } catch (e: any) {
            toast.error(e.message || "Erreur");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">

                    {/* CATÉGORIE */}
                    <select
                        {...register(`items.${index}.categoryId`)}
                        className="border rounded px-2 py-1"
                    >
                        <option value="">Catégorie</option>
                        {categoryOptions.map(cat => (
                            <option key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* NOM */}
                    <Input
                        placeholder="Nom"
                        {...register(`items.${index}.name`, {
                            onChange: (e) =>
                                setValue(
                                    `items.${index}.slug`,
                                    generateSlug(e.target.value)
                                ),
                        })}
                    />

                    {/* SLUG */}
                    <Input
                        placeholder="Slug"
                        {...register(`items.${index}.slug`)}
                    />

                    {/* SUPPRIMER */}
                    {!isEdit && fields.length > 1 && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                        >
                            Supprimer
                        </Button>
                    )}
                </div>
            ))}

            {/* ACTIONS */}
            <div className="flex gap-2">
                {!isEdit && (
                    <Button
                        type="button"
                        onClick={() => append({ name: "", slug: "", categoryId: "" })}
                    >
                        + Ajouter une ligne
                    </Button>
                )}
                <Button type="submit" className="bg-brand-primary text-white">
                    Enregistrer
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                    Annuler
                </Button>
            </div>
        </form>
    );
}
