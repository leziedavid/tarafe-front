
"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";  // Importation de Zod pour la validation
import { toast } from "sonner";  // Pour les notifications de succès ou d'erreur
import { ImageUploader } from '../ui/ImageUploader';
import { Button } from '../ui/button';
import { Toaster } from "@/components/ui/sonner";
import { addGallery, fetchGalleryCategory } from '@/servives/AdminService';
import useAuth from '@/servives/useAuth';
import { MultiSelect } from '../Select2/MultiSelect';
import { GalleryCategory } from '@/interfaces/AdminInterface';

// Définir la validation Zod pour plusieurs fichiers (max 5 fichiers et format png/jpg/jpeg)
const filesValidationSchema = z.array(
    z.instanceof(File).refine((file) => ['image/png', 'image/jpeg'].includes(file.type), { message: 'Les fichiers doivent être des images de type PNG ou JPEG.', }).refine((file) => file.size <= 5 * 1024 * 1024, {  // Taille max : 5 Mo
        message: 'Chaque fichier ne doit pas dépasser 5 Mo.',
    })
).refine((files) => files.length > 0, {
    message: 'Veuillez télécharger au moins une image.',
});


interface ImageUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fetchData: () => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({ open, onOpenChange, fetchData }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const token = useAuth();  // Récupérer le token à l'aide du hook
    const onFilesChange = (files: File[]) => {
        setSelectedFiles(files); // Mise à jour des fichiers sélectionnés
    };

    const [selectedSkills, setSelectedSkills] = useState<{ id: string; libelle: string }[]>([]);
    const [selectOptions, setSelectOptions] = useState<{ id: string; libelle: string }[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);


    const fetchDataCategory = async () => {

        const result = await fetchGalleryCategory(token);

        if (result.statusCode !== 200) {
            toast.error(result.message);

        } else {
            toast.success("Catégories récupérées avec succès !");
            setCategories(result.data);

            // ✅ Transformation directe ici
            const options = result.data.map((cat: GalleryCategory) => ({
                id: String(cat.idcategories_gallery),
                libelle: cat.libelle,
            }));
            // Utilise setOptions si tu stockes ces options dans un autre state
            setSelectOptions(options);

        }
    };

    useEffect(() => {
        fetchDataCategory();
    }, []);


    const handleSubmit = async () => {
        // Validation des fichiers avec Zod
        try {
            filesValidationSchema.parse(selectedFiles);
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error(error.errors[0].message);
                return;
            }
        }

        // ⚠️ Vérifie qu'au moins une catégorie est sélectionnée
        if (selectedSkills.length === 0) {
            toast.error("Veuillez sélectionner au moins une catégorie.");
            return;
        }

        const formData = new FormData();

        // Ajoute les fichiers au FormData
        selectedFiles.forEach((file) => formData.append("files", file));
        const categoryIds = selectedSkills.map((cat) => Number(cat.id));
        formData.append("categoryIds", JSON.stringify(categoryIds));

        setIsUploading(true);

        try {
            const result = await addGallery(token, formData);

            if (result.statusCode === 200) {
                toast.success("Images téléchargées avec succès !");
                onOpenChange(false);
                fetchData();

            } else {
                toast.error("Erreur lors de la soumission des images.");
                fetchData();
            }

        } catch (error) {

            console.error("Erreur lors de l'envoi des données :", error);
            toast.error("Une erreur s'est produite pendant la soumission.");
            fetchData();

        } finally {
            setIsUploading(false);
        }
    };


    return (
        <>
        
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg" style={{ maxHeight: '80vh', overflowY: 'auto' }} >
                <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl tracking-tighter max-w-xl font-bold">
                        Télécharger des images
                    </DialogTitle>
                    <DialogDescription>
                        Sélectionnez plusieurs images (PNG, JPG, JPEG) à télécharger.
                    </DialogDescription>
                </DialogHeader>


                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 w-full">
                        {/* MultiSelect */}
                        <div className="flex-1 w-full">
                            <MultiSelect options={selectOptions} selected={selectedSkills} onChange={setSelectedSkills} placeholder="Select skills..."
                            />
                        </div>
                    </div>

                {/* Section de téléchargement des fichiers */}
                <div className="grid w-full items-center gap-1">
                    <Label className="font-bold" htmlFor="otherFiles">Télécharger une ou plusieurs images (png, jpg, jpeg)</Label>
                    <ImageUploader onFilesChange={onFilesChange} multiple={true} />  {/* Permet de sélectionner plusieurs fichiers */}
                </div>

                {/* Boutons d'action */}
                <div className="mt-4 flex justify-end gap-2">
                    <Button type="button" onClick={() => onOpenChange(false)} className="text-sm px-4 py-2 rounded-md" >
                        Annuler
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isUploading || selectedFiles.length === 0} className={`text-sm px-4 py-2 rounded-md ${isUploading ? 'opacity-50' : ''}`}  >
                        {isUploading ? "Téléchargement..." : "Soumettre"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        
        </>
    );
};

export default ImageUploadDialog;
