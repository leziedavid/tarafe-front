// src/components/ui/file-upload.tsx
"use client";

import { useState } from 'react';
import { XCircle } from 'lucide-react'; // Import de l'icône de suppression de lucide-react

// Composant FileInput : champ d'entrée pour sélectionner les fichiers
export const FileInput = ({ onChange }: { onChange: (files: FileList | null) => void }) => {
    return (
        <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
            <input
                type="file"
                onChange={(e) => onChange(e.target.files)}
                className="hidden"
                id="file-input"
                multiple
            />
            <label htmlFor="file-input" className="text-lg font-semibold text-gray-700 hover:text-blue-500">
                Cliquez pour télécharger des fichiers
            </label>
        </div>
    );
};

// Composant FileUploaderContent : gestion de l'affichage des fichiers téléchargés
export const FileUploaderContent = ({ children }: { children: React.ReactNode }) => {
    return <div className="mt-4 space-y-2">{children}</div>;
};

// Composant FileUploaderItem : affichage individuel d'un fichier sélectionné
export const FileUploaderItem = ({ file, onRemove }: { file: File; onRemove: (file: File) => void }) => {
    return (
        <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg bg-gray-50">
            <span className="text-sm text-gray-700">{file.name}</span>
            <button
                type="button"
                onClick={() => onRemove(file)}
                className="text-red-500 hover:text-red-700"
            >
                <XCircle className="h-5 w-5" />
            </button>
        </div>
    );
};

// Composant FileUploader : Combine les composants FileInput et FileUploaderContent
export const FileUploader = ({ files, onRemove }: { files: File[]; onRemove: (file: File) => void }) => {
    return (
        <FileUploaderContent>
            {files.map((file, index) => (
                <FileUploaderItem key={index} file={file} onRemove={onRemove} />
            ))}
        </FileUploaderContent>
    );
};

// Composant FileUpload : Combine les composants FileInput, FileUploader et la gestion des fichiers

export const FileUpload = () => {
    
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
        }
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    };

    return (
        <div className="max-w-lg mx-auto p-4 border border-gray-200 rounded-lg shadow-sm">
            <FileInput onChange={handleFileChange} />
            <FileUploader files={files} onRemove={handleRemoveFile} />
        </div>
    );
};
