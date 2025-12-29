'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { getBaseUrlImg } from '@/servives/baseUrl';
import { getImagesByRealisation, uploadImages, deleteImage } from '@/servives/AdminService';
import { Label } from '@/components/ui/label';

type Props = {
    id_realisations: number;
    isOpen: boolean;
    onClose: () => void;
};

type ImgRealisation = {
    id_img_realisations: number;
    filles_img_realisations: string;
};

export default function RealisationImages({ id_realisations, isOpen, onClose }: Props) {
    const [images, setImages] = useState<ImgRealisation[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const result = await getImagesByRealisation(id_realisations);
            setImages(result.data || []);
        } catch (err) {
            toast.error('Erreur lors du chargement des images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id_realisations && isOpen) fetchImages();
    }, [id_realisations, isOpen]);

    // ✅ Lance l'upload uniquement quand on clique sur le bouton
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Veuillez sélectionner au moins une image");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            // selectedFiles.forEach((file) => formData.append('fileData', file));
            selectedFiles.forEach((file) => formData.append('fileData[]', file));
            formData.append('id_realisations', id_realisations.toString());

            const res = await uploadImages(formData);
            if (res.statusCode === 201) {
                toast.success('Images ajoutées avec succès');
                setSelectedFiles([]); // reset sélection
                fetchImages();
            } else {
                toast.error('Erreur lors de l’upload des images');
            }
        } catch (err) {
            toast.error('Erreur serveur pendant l’upload');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id_img: number) => {
        try {
            const res = await deleteImage(id_img);
            if (res.statusCode === 200) {
                toast.success('Image supprimée');
                setImages((prev) => prev.filter((img) => img.id_img_realisations !== id_img));
            } else {
                toast.error('Impossible de supprimer cette image');
            }
        } catch (err) {
            toast.error('Erreur serveur lors de la suppression');
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/50 z-50 ${!isOpen && 'hidden'}`}>
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform
                ${isOpen ? 'translate-x-0 w-full md:w-[50vw]' : 'translate-x-full'} bg-white dark:bg-gray-800 shadow-xl duration-300 ease-in-out`} >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 uppercase">
                        Gestion des images
                    </h5>
                    <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-sm w-8 h-8 flex items-center justify-center"
                        onClick={onClose}
                    >
                        ✕
                    </Button>
                </div>

                {/* Upload */}
                <div className="space-y-4">
                    <Label className="font-bold">Ajouter des images</Label>

                    {/* Sélection de fichiers */}
                    <ImageUploader
                        onFilesChange={(files) => setSelectedFiles(files)}
                        multiple={true}
                    />

                    {/* Bouton télécharger */}
                    {selectedFiles.length > 0 && (
                        <Button type="button" className="text-white mt-2" onClick={handleUpload} disabled={uploading} >
                            {uploading ? "Téléchargement..." : "Télécharger"}
                        </Button>
                    )}

                    {/* Images existantes */}
                    {loading ? (
                        <p className="text-sm text-gray-500">Chargement des images...</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10">
                            {images.map((img) => (
                                <div key={img.id_img_realisations} className="relative group">
                                    <Image
                                        src={`${getBaseUrlImg()}/${img.filles_img_realisations}`}
                                        alt="realisation"
                                        width={150}
                                        height={150}
                                        className="rounded border object-cover shadow w-full h-32"
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-sm px-2 py-1 opacity-80 group-hover:opacity-100"
                                        onClick={() => handleDelete(img.id_img_realisations)}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
