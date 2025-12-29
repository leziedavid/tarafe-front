'use client';

import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryProduct } from "@/types/interfaces";
import { createCategory, updateCategory } from "@/service/categoryServices";

type CategoryFormState = {
    id?: number;
    name: string;
    slug: string;
};

type CategoryFormProps = {
    initialValues?: CategoryProduct; // pour modification
    onClose: () => void;
    onSubmitSuccess: () => void;
};

export default function CategoryForm({ initialValues, onClose, onSubmitSuccess }: CategoryFormProps) {
    const isEdit = initialValues?.id != null; // true si on modifie une ligne existante

    // Tableau interne pour gérer plusieurs lignes en création
    const [categories, setCategories] = useState<CategoryFormState[]>(
        initialValues
            ? [{ id: initialValues.id, name: initialValues.name ?? "", slug: initialValues.slug ?? "" }]
            : [{ name: "", slug: "" }]
    );

    // Ajouter une ligne (uniquement en création)
    const addRow = () => setCategories(prev => [...prev, { name: "", slug: "" }]);

    // Supprimer une ligne (uniquement en création)
    const removeRow = (index: number) => setCategories(prev => prev.filter((_, i) => i !== index));

    // Mise à jour d’un champ
    const handleChange = (index: number, field: keyof CategoryFormState, value: string) => {
        setCategories(prev => {
            const updated = [...prev];

            if (field === "name") {
                updated[index] = {
                    ...updated[index],
                    name: value ?? "",
                    slug: generateSlug(value ?? "")
                };
            } else {
                updated[index] = {
                    ...updated[index],
                    [field]: value ?? ""
                };
            }

            return updated;
        });
    };


    const generateSlug = (value: string): string => {
        return value
            .toLowerCase()
            .normalize("NFD")                     // enlève les accents
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")         // enlève caractères spéciaux
            .trim()
            .replace(/\s+/g, "-")                 // espaces → tirets
            .replace(/-+/g, "-");                 // évite les --
    };


    // Soumission du formulaire
    const handleSubmit = async () => {
        try {
            // Validation simple
            for (const cat of categories) {
                if (!cat.name.trim()) throw new Error("Le nom est requis");
                if (!cat.slug.trim()) throw new Error("Le slug est requis");
            }

            // Séparer les lignes à créer et celles à modifier
            const toUpdate = categories.filter(cat => cat.id);
            const toCreate = categories.filter(cat => !cat.id).map(cat => ({ name: cat.name, slug: cat.slug }));

            // Mise à jour des existantes
            for (const cat of toUpdate) {
                await updateCategory(cat.id!, { name: cat.name, slug: cat.slug });
                toast.success(`Catégorie "${cat.name}" mise à jour`);
            }

            // Création des nouvelles en une seule fois (tableau)
            if (toCreate.length > 0) {
                const toCreateWithUser = toCreate.map(cat => ({
                    ...cat,
                    added_by: 21, // 👈 on ajoute le champ ici
                }));
                // Ici, adapte createCategory pour accepter un tableau
                await createCategory(toCreateWithUser);
                toast.success(`${toCreate.length} catégorie(s) créée(s)`);
            }

            onSubmitSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de l'enregistrement");
        }
    };


    return (
        <div className="space-y-4">
            {/* <pre> {JSON.stringify(initialValues, null, 2)} </pre> */}
            {categories.map((cat, index) => (
                <div key={index} className="flex gap-2 items-end">
                    <Input
                        value={cat.name}
                        placeholder="Nom"
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                    />
                    <Input
                        value={cat.slug}
                        placeholder="Slug"
                        onChange={(e) => handleChange(index, "slug", e.target.value)}
                    />
                    {/* Bouton supprimer uniquement si création multiple */}
                    {!isEdit && categories.length > 1 && (
                        <Button type="button" variant="destructive" onClick={() => removeRow(index)}>Supprimer</Button>
                    )}
                </div>
            ))}

            <div className="flex gap-2">
                {/* Ajouter une ligne uniquement en création */}
                {!isEdit && (
                    <Button type="button" onClick={addRow}>+ Ajouter une ligne</Button>
                )}
                <Button type="button" onClick={handleSubmit} className="bg-brand-primary text-white">Enregistrer</Button>
                <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
            </div>
        </div>
    );
}
