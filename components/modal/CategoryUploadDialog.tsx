
"use client";

import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from '../ui/button';
import { toast, Toaster } from "sonner";  // Pour les notifications de succès ou d'erreur
import useAuth from '@/servives/useAuth';
import { saveCategory } from '@/servives/AdminService';
import { z } from 'zod';  // Import de Zod pour la validation
import { Input } from '../ui/input';
import { CircleX, Plus } from 'lucide-react';
import { OptionRealisation } from '@/interfaces/HomeInterface';
import { useRouter } from 'next/navigation'

interface CategoryUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId?: number | null;
    datas?: OptionRealisation | null;
    fetchData?: () => void;
}

// Validation Zod pour les noms de catégories
const categorySchema = z.array(z.string().min(1, "Le nom de la catégorie ne peut pas être vide"));

const CategoryUploadDialog: React.FC<CategoryUploadDialogProps> = ({ open, onOpenChange, categoryId,datas,fetchData}) => {

    const [categoryNames, setCategoryNames] = useState<string[]>(['']); // Un tableau pour gérer plusieurs catégories
    const [isUploading, setIsUploading] = useState(false);
    const token = useAuth();  // Récupérer le token à l'aide du hook
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    // Utiliser l'ID pour modifier une catégorie
    useEffect(() => {

        if (categoryId) {
            setIsEditing(true);
            setCategoryNames(datas ? [datas.libelleOption_reaalisation] : ['']); // Mettre à jour les noms des catégories
        } else {
            setIsEditing(false);
        }
    }, [categoryId,datas]);

    const handleCategoryNameChange = (index: number, value: string) => {
        const updatedCategories = [...categoryNames];
        updatedCategories[index] = value;
        setCategoryNames(updatedCategories);
    };

    const handleAddCategory = () => {
        setCategoryNames([...categoryNames, '']);
    };

    const handleRemoveCategory = (index: number) => {
        const updatedCategories = categoryNames.filter((_, i) => i !== index);
        setCategoryNames(updatedCategories);
    };

    const handleSubmit = async () => {
        try {
            // Validation avec Zod
            const result = categorySchema.safeParse(categoryNames);
            if (!result.success) {
                toast.error(result.error.errors[0].message);
                return;
            }

            setIsUploading(true);

            // Appel à la fonction saveCategory (ajout ou mise à jour)
            const resultApi = await saveCategory(token, categoryNames, typeof categoryId === "number" ? categoryId : undefined);  // Le categoryId est optionnel

            if (resultApi.statusCode === 200) {

                toast.success(isEditing ? "Catégorie mise à jour avec succès !" : "Catégories ajoutées avec succès !");
                onOpenChange(false);
                if (fetchData) {
                    fetchData();
                }
            } else {
                toast.error("Erreur lors de la soumission des catégories.");
            }
        } catch (error) {

            console.error("Erreur pendant la soumission:", error);
            toast.error("Une erreur s'est produite pendant la soumission.");

        } finally {
            setIsUploading(false);
        }
    };

    // Fonction de réinitialisation
    const resetForm = () => {
        setCategoryNames(['']);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg" style={{ maxHeight: '80vh', overflowY: 'auto' }} >
                    <DialogHeader>
                        <DialogTitle className="text-2xl md:text-3xl tracking-tighter max-w-xl font-bold">
                            {isEditing ? "Modifier la catégorie" : "Ajouter des catégories"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? "Modifiez les catégories existantes." : "Entrez les noms des catégories à ajouter."}
                        </DialogDescription>
                    </DialogHeader>

                    {categoryId}
                    {/* Section de saisie des catégories */}
                    <div className="space-y-4">
                        {categoryNames.map((categoryName, index) => (
                            <div key={index} className="flex items-center space-x-2">

                                <Input type="text" value={categoryName} onChange={(e) => handleCategoryNameChange(index, e.target.value)} className="border px-2 py-1 rounded-md w-full" placeholder="Nom de la catégorie" />

                                <Button type="button" onClick={() => handleRemoveCategory(index)}  className="text-white p-2 rounded-md">
                                    <CircleX className="w-4 h-4" />
                                </Button>
                                {index === categoryNames.length - 1 && (
                                    <Button  type="button" onClick={handleAddCategory}  className="text-white p-2 rounded-md"  >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Boutons d'action */}
                    <div className="mt-4 flex justify-end gap-2">
                        <Button  type="button"  onClick={() => onOpenChange(false)} className="text-sm px-4 py-2 rounded-md">
                            Annuler
                        </Button>
                        <Button type="button" onClick={handleSubmit} disabled={isUploading || categoryNames.some(name => !name.trim())}
                            className={`text-sm px-4 py-2 rounded-md ${isUploading ? 'opacity-50' : ''}`}>
                            {isUploading ? "Enregistrement..." : "Soumettre"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        
        </>
    );
};

export default CategoryUploadDialog;


