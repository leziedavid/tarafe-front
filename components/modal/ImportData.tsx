"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getImagesUrl } from '@/types/baseUrl';
import { FilesUploader } from '../form/FilesUploader';
import { imports } from '@/service/transactionServices';

// Définir la validation Zod pour plusieurs fichiers (max 5 fichiers et format png/jpg/jpeg)
const filesValidationSchema = z.array(
    z.instanceof(File).refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
        message: 'Les fichiers doivent être des images de type PNG ou JPEG.',
    }).refine((file) => file.size <= 5 * 1024 * 1024, {  // Taille max : 5 Mo
        message: 'Chaque fichier ne doit pas dépasser 5 Mo.',
    })
).refine((files) => files.length > 0, {
    message: 'Veuillez télécharger au moins une image.',
});

interface ImportDataProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

const ImportData: React.FC<ImportDataProps> = ({ isOpen, onClose }) => {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const urlImages = getImagesUrl();
    const [images, setImages] = useState<any[]>([]); // État pour stocker les images récupérées


    const onFilesChange = (files: File[]) => {
        setSelectedFiles(files); // Mise à jour des fichiers sélectionnés
    };

    const handleSubmit = async () => {
        // Préparer les fichiers à envoyer dans le FormData
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));
        setIsUploading(true);

        try {
            // Envoi des données pour créer une nouvelle commande
            const result = await imports(formData);  // Appel à la fonction pour créer une commande

            if (result.statusCode === 200) {
                toast.success("Images fichier téléchargées avec succès !");
                onClose(false);  // Fermer le dialog après le succès
            } else {
                toast.error("Erreur lors de la soumission du fichier.");
            }

        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
            toast.error("Une erreur s'est produite pendant la soumission.");
        } finally {
            setIsUploading(false);  // Restaure l'état de l'interface une fois l'upload terminé
        }
    };


    // Fonction pour supprimer un fichier sélectionné (localement)
    const handleRemoveFile = (index: number) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    // Fonction pour supprimer l'image via l'API
    const handleDeleteImage = async (imageId: number) => {
        try {
            const response = await fetch(`/images/${imageId}`, {
                method: 'DELETE',
                headers: {
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
            <div className="bg-white">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                        Télécharger le fichier (excel, csv...) :
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Sélectionnez un fichier (excel, csv) à télécharger.
                    </p>
                </div>

                {/* Section de téléchargement des fichiers */}
                <div className="grid w-full items-center gap-1 mb-4">
                    <Label className="font-bold" htmlFor="otherFiles">
                        Télécharger un fichier (excel, csv)
                    </Label>
                    <FilesUploader onFilesChange={onFilesChange} multiple={true} />
                </div>

                {/* Liste des fichiers sélectionnés */}
                {selectedFiles.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Fichiers sélectionnés ({selectedFiles.length}) :</h3>
                        <div className="space-y-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm truncate">{file.name}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(index)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isUploading || selectedFiles.length === 0}
                        className={`text-sm px-4 py-2 rounded-md ${isUploading ? 'opacity-50' : ''}`}
                    >
                        {isUploading ? "Téléchargement..." : "Soumettre"}
                    </Button>
                </div>

                {/* Affichage des images existantes */}
                {images.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-medium mb-4">Images existantes :</h3>
                        <div className="grid grid-cols-4 gap-2 px-1">
                            {images.map((image) => (
                                <div key={image.id_img_realisations} className="relative group">
                                    {image.filles_img_realisations ? (
                                        <Image
                                            src={`${urlImages}/${image.filles_img_realisations}`}
                                            alt={`Image ${image.id_img_realisations}`}
                                            className="object-cover w-40 h-40 rounded-lg"
                                            style={{ objectFit: 'cover' }}
                                            width={100}
                                            height={100}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-400 border rounded-lg">
                                            No image
                                        </div>
                                    )}

                                    {/* Icône de suppression qui apparaît au survol */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteImage(image.id_img_realisations)}
                                            className="h-10 w-10"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ImportData;
