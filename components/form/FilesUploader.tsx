"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, File, FileText, Image as ImageIcon } from "lucide-react"; // Importation des icônes
import { toast } from "sonner";  // Pour les notifications de succès ou d'erreur

// Définir le type des props attendues par le composant
interface FilesUploaderProps {
    // Callback pour notifier les fichiers sélectionnés au parent
    onFilesChange: (files: File[]) => void;

    // Permettre ou non la sélection de plusieurs fichiers (par défaut false)
    multiple?: boolean;
}

export function FilesUploader({
    onFilesChange,
    multiple = false,
}: FilesUploaderProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Fichiers sélectionnés pour l'aperçu

    // Fonction qui gère la sélection de fichiers
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;

        if (files && files.length > 0) {
            const newFiles = Array.from(files); // Convertir FileList en tableau
            
            // Vérification des formats de fichier
            const invalidFiles = newFiles.filter((file) => {
                const extension = file.name.split(".").pop()?.toLowerCase();
                return !(extension === "csv" || extension === "xlsx");
            });

            if (invalidFiles.length > 0) {
                // Afficher une alerte si des fichiers invalides sont sélectionnés
                toast.error("Veuillez télécharger uniquement des fichiers CSV ou Excel.");
            } else {
                setSelectedFiles(newFiles); // Mettre à jour les fichiers sélectionnés
                onFilesChange(newFiles); // Notifier le parent des nouveaux fichiers sélectionnés
            }
        }
    };

    // Fonction pour supprimer une image ou fichier sélectionné
    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, idx) => idx !== index); // Retirer le fichier à l'index donné
        setSelectedFiles(newFiles); // Mettre à jour les fichiers après suppression
        onFilesChange(newFiles); // Notifier le parent des fichiers mis à jour
    };

    // Fonction pour déterminer le type de fichier (Excel ou CSV)
    const getFileIcon = (file: File) => {
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (extension === "csv") {
            return <File size={24} color="#4CAF50" />;
        } else if (extension === "xlsx") {
            return <FileText size={24} color="#2196F3" />;
        } else {
            return <ImageIcon size={24} color="#555" />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 hover:bg-gray-50 transition-colors duration-300">
            <input
                type="file"
                accept=".csv, .xlsx" // Limiter l'acceptation aux fichiers CSV et Excel uniquement
                multiple={multiple} // Permet la sélection multiple si "multiple" est vrai
                onChange={onChange}
                className="hidden"
                id="file-input"
            />
            <label htmlFor="file-input" className="text-center text-gray-700 font-medium text-sm cursor-pointer">
                <p className="text-sm text-gray-500">Cliquez pour sélectionner ou glissez-déposez</p>
            </label>
            <div className="mt-2 grid grid-cols-4 gap-4">
                {/* Afficher les aperçus ou icônes des fichiers sélectionnés */}
                {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 cursor-pointer" onClick={() => removeFile(idx)} >
                        {/* Affichage des icônes pour CSV ou Excel */}
                        {getFileIcon(file)}

                        {/* Icône de suppression */}
                        <button onClick={() => removeFile(idx)} // Supprimer le fichier au clic
                            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
                            <Trash2 size={16} color="red" /> {/* Icône poubelle */}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
