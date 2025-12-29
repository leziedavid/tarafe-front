"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";  // Importation de Zod pour la validation
import { toast } from "sonner";  // Pour les notifications de succès ou d'erreur
import { ImageUploader } from '../ui/ImageUploader';
import { Button } from '../ui/button';
import useAuth from '@/servives/useAuth';
import { addAllImagesForProductt, getAllImagesById } from '@/servives/AdminService';
import { getBaseUrlImg } from '@/servives/baseUrl';
import { Trash2 ,Trash} from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";
import Image from 'next/image';

// Définir la validation Zod pour plusieurs fichiers (max 5 fichiers et format png/jpg/jpeg)
const filesValidationSchema = z.array(
    z.instanceof(File).refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {message: 'Les fichiers doivent être des images de type PNG ou JPEG.',
    }).refine((file) => file.size <= 5 * 1024 * 1024, {  // Taille max : 5 Mo
        message: 'Chaque fichier ne doit pas dépasser 5 Mo.',
    })
).refine((files) => files.length > 0, {
    message: 'Veuillez télécharger au moins une image.',
});

interface AddImageDialogProps {
    open: boolean;
    id: number;
    code:string;
    onOpenChange: (open: boolean) => void;
}

const AddImageDialog: React.FC<AddImageDialogProps> = ({ open,id,code, onOpenChange }) => {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const token = useAuth();  // Récupérer le token à l'aide du hook
    const [images, setImages] = useState<any[]>([]); // État pour stocker les images récupérées


    const onFilesChange = (files: File[]) => {
        setSelectedFiles(files); // Mise à jour des fichiers sélectionnés
    };

    // Fonction appelée à l'ouverture pour récupérer les images
    useEffect(() => {
        if (open && id) {
            fetchImages();
        }
    }, [open, id]);


    // Fonction pour récupérer les images
    const fetchImages = async () => {
        try {
            const response = await getAllImagesById(token, id); // Appel du service
            if (response.statusCode === 200) {
                setImages(response.data); // Mise à jour des images
            } else {
                toast.error(response.message || 'Erreur lors de la récupération des images.');
            }
        } catch (error) {
            toast.error('Une erreur est survenue.');
        }
    };


    const handleSubmit = async () => {
        
        // Préparer les fichiers à envoyer dans le FormData
        const formData = new FormData();
        formData.append("id_realisation", id.toString()); // Conversion en chaîne
        formData.append("code_realisation", code);
        selectedFiles.forEach((file) => formData.append("files", file));

        setIsUploading(true);

        try {
            // Envoi des données pour créer une nouvelle commande
            const result = await addAllImagesForProductt(token, formData);  // Appel à la fonction pour créer une commande

            if (result.statusCode === 200) {
                toast.success("Images téléchargées avec succès !");
                onOpenChange(false);  // Fermer le dialog après le succès
            } else {
                toast.error("Erreur lors de la soumission des images.");
            }

        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
            toast.error("Une erreur s'est produite pendant la soumission.");
        } finally {
            setIsUploading(false);  // Restaure l'état de l'interface une fois l'upload terminé
        }
    };
        

    // Fonction pour supprimer l'image via l'API
    const handleDeleteImage = async (imageId: number) => {
        try {
            const response = await fetch(`/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'image.');
            }

            // Si la suppression réussit, mettre à jour l'état local pour supprimer l'image
            setImages((prevImages) => prevImages.filter(image => image.id_img_realisations !== imageId));

            toast.success('Image supprimée avec succès');
        } catch (error) {
            toast.error('Échec de la suppression de l\'image');
            console.error(error);
        }
    };

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}  // Ajout de scroll
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl tracking-tighter max-w-xl font-bold">
                        Télécharger des images : {code}
                    </DialogTitle>
                    <DialogDescription>
                        Sélectionnez plusieurs images (PNG, JPG, JPEG) à télécharger.
                    </DialogDescription>
                </DialogHeader>

                {/* Section de téléchargement des fichiers */}
                <div className="grid w-full items-center gap-1">
                    <Label className="font-bold" htmlFor="otherFiles">Télécharger une ou plusieurs images (png, jpg, jpeg)</Label>
                    <ImageUploader onFilesChange={onFilesChange} multiple={true} />  {/* Permet de sélectionner plusieurs fichiers */}
                </div>

                {/* Boutons d'action */}
                <div className="mt-4 flex justify-end gap-2">
                    <Button type="button"
                        onClick={() => onOpenChange(false)}
                        className="text-sm px-4 py-2 rounded-md" >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isUploading || selectedFiles.length === 0}
                        className={`text-sm px-4 py-2 rounded-md ${isUploading ? 'opacity-50' : ''}`}
                    >
                        {isUploading ? "Téléchargement..." : "Soumettre"}
                    </Button>
                </div>

                <div className="mt-4">
                    <div className="grid grid-cols-4 gap-2 mt-2 px-1">
                        {images.map((image) => (
                            // group pour gérer les styles de survol
                            <div key={image.id_img_realisations} className="relative group" >
                                {/* Afficher l'image si disponible */}
                                {image.filles_img_realisations ? (
                                    <Image src={`${getBaseUrlImg()}/${image.filles_img_realisations}`}
                                        alt={`Image ${image.id_img_realisations}`}
                                        className="object-cover w-40 h-40 rounded-lg"
                                        style={{ objectFit: 'cover' }}
                                        width={100}
                                        height={100}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                                        No image
                                    </div>
                                )}

                                {/* Icône de suppression qui apparaît au survol, centré sur l'image */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 onClick={() => handleDeleteImage(image.id_img_realisations)} // Appel à la fonction de suppression
                                        className="text-red-500 cursor-pointer"
                                        size={30} // Vous pouvez ajuster la taille de l'icône ici
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
        </>
    );
};

export default AddImageDialog;
