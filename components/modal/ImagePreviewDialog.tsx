"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Skeleton from "react-loading-skeleton"; // Pour afficher le skeleton pendant le chargement
import "react-loading-skeleton/dist/skeleton.css"; // Importation du CSS du skeleton
import { Toaster } from "@/components/ui/sonner";
import Image from 'next/image';

interface ImagePreviewDialogProps {
    imageUrl: string;  // URL de l'image à afficher
    open: boolean;  // Contrôle l'ouverture du Dialog
    onOpenChange: (open: boolean) => void;  // Fonction pour gérer l'ouverture et la fermeture du Dialog
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ imageUrl, open, onOpenChange }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Utilisation de useEffect pour simuler un délai avant de masquer le Skeleton
    useEffect(() => {
        if (open) {
            setIsLoading(true);  // Réinitialiser le skeleton au moment de l'ouverture du dialog

            // Simuler un délai de chargement pour l'image (par exemple, 500ms)
            const timeout = setTimeout(() => {
                setIsLoading(false); // Après un délai, masquer le Skeleton
            }, 500); // Ajuste ce délai si nécessaire

            return () => clearTimeout(timeout); // Nettoyer le timer au démontage
        }
    }, [open, imageUrl]);

    const handleImageLoad = () => {
        setIsLoading(false); // Lorsque l'image est chargée, on masque le Skeleton
    };

    // Vérifie si l'URL de l'image est valide (non vide)
    if (!imageUrl) {
        return null; // Si l'URL est vide, ne pas afficher l'image
    }

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className='text-2xl md:text-3xl tracking-tighter max-w-xl font-bold'>{"Aperçu de l'image"}</DialogTitle>
                    <DialogDescription>{"Voici l'image en haute résolution."}</DialogDescription>
                </DialogHeader>

                {/* Affichage du skeleton pendant le chargement */}
                {isLoading ? (
                    <div className="w-full h-96">
                        <Skeleton height="100%" />
                    </div>
                ) : (
                    <Image  src={imageUrl} alt="Preview"
                        className="object-contain w-full max-h-[70vh] mx-auto"
                        onLoad={handleImageLoad}
                        width={500}
                        height={300}
                    />
                )}
            </DialogContent>
        </Dialog>
        </>
    );
};

export default ImagePreviewDialog;
