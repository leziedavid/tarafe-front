'use client';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PubliciteFormValues, publiciteSchema } from '@/types/schemas/publiciteSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Edit, FileText, Plus, Save, Settings, Trash2, X, Image as ImageIcon, Link, Tag } from 'lucide-react';
import { Publicite } from '@/types/interfaces';
import { createPublicite, deletePublicite, getAllPublicites, updatePublicite } from '@/service/reglagesServices';
import Image from "next/image";
import { getImagesUrl } from '@/types/baseUrl';

// Type pour les props du formulaire
interface PubliciteFormProps {
    publicite: Partial<Publicite>;
    onSubmit: (data: PubliciteFormValues) => void;
    onCancel: () => void;
}

// Composant pour afficher une image
function ImagePreview({ src, alt }: { src: string; alt: string }) {
    const urlImages = getImagesUrl();
    const fullSrc = src.startsWith('http') ? src : `${urlImages}/${src}`;

    return (
        <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <Image
                src={fullSrc}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
            />
        </div>
    );
}

export default function PubliciteManager() {
    const [publicites, setPublicites] = useState<Publicite[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const urlImages = getImagesUrl();

    const fetchPublicites = async () => {
        try {
            const res = await getAllPublicites(currentPage, limit);
            if (res.data) {
                setPublicites(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            } else {
                setPublicites([]);
                setTotalItems(0);
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des publicités');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPublicites();
    }, [currentPage]);

    const prepareFormData = (data: PubliciteFormValues): FormData => {
        const formData = new FormData();

        // Ajouter tous les champs texte
        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                return;
            }

            // Traitement spécial pour les champs de type fichier
            const fileFields = [
                'files_publicite1',
                'files_publicite2',
                'files_publicite3'
            ];

            if (fileFields.includes(key)) {
                // Si c'est un FileList, prendre le premier fichier
                if (value instanceof FileList && value.length > 0) {
                    formData.append(key, value[0]);
                }
                // Si c'est déjà un File
                else if (value instanceof File) {
                    formData.append(key, value);
                }
                // Si c'est une string (URL existante), l'ajouter comme texte
                else if (typeof value === 'string') {
                    formData.append(key, value);
                }
            } else {
                // Pour tous les autres champs, convertir en string
                formData.append(key, String(value));
            }
        });

        return formData;
    };

    const onSubmitHandler = async (data: PubliciteFormValues, id?: string) => {
        const formData = prepareFormData(data);

        try {
            let res;
            if (id) {
                res = await updatePublicite(Number(id), formData);
            } else {
                res = await createPublicite(formData);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (id ? 'Publicité mise à jour' : 'Publicité créée'));
                fetchPublicites();
                setEditingId(null);
                setCreating(false);
            } else {
                toast.error(res.message || 'Erreur serveur');
            }
        } catch (error) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error('Erreur lors du submit publicité :', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette publicité ?")) return;

        try {
            const res = await deletePublicite(Number(id));
            if (res.statusCode === 200) {
                toast.success(res.message || "Publicité supprimée avec succès");
                fetchPublicites();
            } else {
                toast.error(res.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            toast.error("Erreur serveur lors de la suppression");
            console.error("Erreur delete publicité :", error);
        }
    };

    function handleNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            alert("Vous êtes déjà sur la dernière page.");
        }
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            alert("Vous êtes déjà sur la première page.");
        }
    }

    // Fonction pour afficher une valeur ou un placeholder
    const displayValue = (value: any) => value || "Non défini";

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B07B5E] rounded-lg">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des Publicités</h1>
                        <p className="text-gray-500">Gérez vos campagnes publicitaires</p>
                    </div>
                </div>
                <Button
                    onClick={() => { setCreating(true); setEditingId(null); }}
                    className="bg-[#B07B5E] hover:bg-[#9C6B52]"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle publicité
                </Button>
            </div>

            {creating && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Créer une nouvelle publicité</h2>
                    <PubliciteFormComponent
                        publicite={{
                            id_publicite: 'new',
                            typesCard1: '',
                            typesCard2: '',
                            libelle_publicite1: '',
                            libelle_publicite2: ''
                        }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-6">
                {publicites.map((publicite) => (
                    <div key={publicite.id_publicite} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* En-tête avec libellés et types */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-gray-400" />
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {displayValue(publicite.libelle_publicite1)}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {publicite.typesCard1 && (
                                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Type 1: {publicite.typesCard1}
                                            </div>
                                        )}
                                        {publicite.typesCard2 && (
                                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Type 2: {publicite.typesCard2}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingId(editingId === publicite.id_publicite ? null : publicite.id_publicite)}
                                        className="flex items-center gap-2"
                                    >
                                        {editingId === publicite.id_publicite ? (
                                            <>
                                                <X className="h-4 w-4" />
                                                Annuler
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="h-4 w-4" />
                                                Modifier
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(publicite.id_publicite)}
                                        className="flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer
                                    </Button>
                                </div>
                            </div>

                            {/* Libellés */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Tag className="h-4 w-4" />
                                        <span className="text-sm">Libellé 1</span>
                                    </div>
                                    <p className="font-medium">{displayValue(publicite.libelle_publicite1)}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Tag className="h-4 w-4" />
                                        <span className="text-sm">Libellé 2</span>
                                    </div>
                                    <p className="font-medium">{displayValue(publicite.libelle_publicite2)}</p>
                                </div>
                            </div>

                            {/* Liens */}
                            {(publicite.link1 || publicite.link2 || publicite.link3) && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Link className="h-4 w-4" />
                                        <span className="text-sm font-medium">Liens</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {publicite.link1 && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Lien 1</span>
                                                <a
                                                    href={publicite.link1}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                                                >
                                                    {publicite.link1}
                                                </a>
                                            </div>
                                        )}
                                        {publicite.link2 && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Lien 2</span>
                                                <a
                                                    href={publicite.link2}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                                                >
                                                    {publicite.link2}
                                                </a>
                                            </div>
                                        )}
                                        {publicite.link3 && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Lien 3</span>
                                                <a
                                                    href={publicite.link3}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                                                >
                                                    {publicite.link3}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Classes */}
                            {(publicite.class1 || publicite.class2 || publicite.class3) && (
                                <div className="space-y-3">
                                    <span className="text-sm font-medium text-gray-500">Classes CSS</span>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {publicite.class1 && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Classe 1</span>
                                                <p className="text-gray-700 text-sm font-mono bg-gray-50 p-2 rounded">
                                                    {publicite.class1}
                                                </p>
                                            </div>
                                        )}
                                        {publicite.class2 && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Classe 2</span>
                                                <p className="text-gray-700 text-sm font-mono bg-gray-50 p-2 rounded">
                                                    {publicite.class2}
                                                </p>
                                            </div>
                                        )}
                                        {publicite.class3 && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-500">Classe 3</span>
                                                <p className="text-gray-700 text-sm font-mono bg-gray-50 p-2 rounded">
                                                    {publicite.class3}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Images */}
                            {(publicite.files_publicite1 || publicite.files_publicite2 || publicite.files_publicite3) && (
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <ImageIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">Images Publicitaires</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {publicite.files_publicite1 && (
                                            <div className="space-y-2">
                                                <span className="text-xs text-gray-500">Image 1</span>
                                                <ImagePreview
                                                    src={publicite.files_publicite1}
                                                    alt="Publicité 1"
                                                />
                                            </div>
                                        )}
                                        {publicite.files_publicite2 && (
                                            <div className="space-y-2">
                                                <span className="text-xs text-gray-500">Image 2</span>
                                                <ImagePreview
                                                    src={publicite.files_publicite2}
                                                    alt="Publicité 2"
                                                />
                                            </div>
                                        )}
                                        {publicite.files_publicite3 && (
                                            <div className="space-y-2">
                                                <span className="text-xs text-gray-500">Image 3</span>
                                                <ImagePreview
                                                    src={publicite.files_publicite3}
                                                    alt="Publicité 3"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500">Créé le</span>
                                    <p className="text-gray-700">
                                        {new Date(publicite.created_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-gray-500">Mis à jour le</span>
                                    <p className="text-gray-700">
                                        {new Date(publicite.updated_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Formulaire d'édition */}
                            {editingId === publicite.id_publicite && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold mb-4">Modifier la publicité</h4>
                                    <PubliciteFormComponent
                                        publicite={publicite}
                                        onSubmit={(data) => onSubmitHandler(data, publicite.id_publicite)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Pagination */}
                {publicites.length > 0 && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-4">
                        <div className="text-muted-foreground text-xs sm:text-sm text-center">
                            Page {currentPage} sur {Math.ceil(totalItems / limit)}
                        </div>

                        <div className="flex justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={currentPage <= 1}
                                className="text-xs sm:text-sm"
                            >
                                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Précédent</span>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={currentPage >= Math.ceil(totalItems / limit)}
                                className="text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">Suivant</span>
                                <ChevronRight className="h-4 w-4 sm:ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Composant formulaire séparé
function PubliciteFormComponent({ publicite, onSubmit, onCancel }: PubliciteFormProps) {
    const urlImages = getImagesUrl();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<PubliciteFormValues>({
        resolver: zodResolver(publiciteSchema),
        defaultValues: {
            typesCard1: publicite.typesCard1 || '',
            typesCard2: publicite.typesCard2 || '',
            libelle_publicite1: publicite.libelle_publicite1 || '',
            libelle_publicite2: publicite.libelle_publicite2 || '',
            link1: publicite.link1 || '',
            link2: publicite.link2 || '',
            link3: publicite.link3 || '',
            class1: publicite.class1 || '',
            class2: publicite.class2 || '',
            class3: publicite.class3 || '',
            files_publicite1: publicite.files_publicite1 || '',
            files_publicite2: publicite.files_publicite2 || '',
            files_publicite3: publicite.files_publicite3 || '',
        },
    });

    // Observer les valeurs des fichiers
    const file1 = watch('files_publicite1');
    const file2 = watch('files_publicite2');
    const file3 = watch('files_publicite3');

    // Fonction pour supprimer une image
    const handleRemoveImage = (fieldName: keyof PubliciteFormValues) => {
        setValue(fieldName, '');
    };

    // Fonction pour rendre un champ d'image
    const renderImageField = (
        fieldName: keyof PubliciteFormValues,
        label: string,
        existingImage?: string,
        currentFile?: any
    ) => {
        const hasExistingImage = existingImage && typeof existingImage === 'string' && existingImage.trim() !== '';
        const hasNewFile = currentFile && currentFile instanceof FileList && currentFile.length > 0;

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                
                {/* Aperçu de l'image existante ou nouvelle */}
                {(hasExistingImage || hasNewFile) && (
                    <div className="mb-2">
                        <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            {hasNewFile ? (
                                // Aperçu du nouveau fichier
                                <img
                                    src={URL.createObjectURL(currentFile[0])}
                                    alt={`Aperçu ${label}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : hasExistingImage ? (
                                // Image existante
                                <Image
                                    src={`${urlImages}/${existingImage}`}
                                    alt={label}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : null}
                        </div>
                        
                        {/* Bouton pour supprimer l'image */}
                        <div className="mt-2 flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveImage(fieldName)}
                                className="flex items-center gap-1"
                            >
                                <Trash2 className="h-3 w-3" />
                                Supprimer
                            </Button>
                        </div>
                    </div>
                )}

                {/* Input file - masqué si on a déjà une image */}
                {!(hasExistingImage || hasNewFile) && (
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-1 text-sm text-gray-500">
                                    <span className="font-semibold">Cliquez pour upload</span>
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP</p>
                            </div>
                            <input
                                type="file"
                                {...register(fieldName)}
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                {/* Input file caché pour pouvoir ré-uploader */}
                {(hasExistingImage || hasNewFile) && (
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Changer l'image
                        </label>
                        <input
                            type="file"
                            {...register(fieldName)}
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Types de cartes */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Types de cartes</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de carte 1
                        </label>
                        <Input
                            {...register('typesCard1')}
                            placeholder="Ex: Banner, Sidebar, Popup"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de carte 2
                        </label>
                        <Input
                            {...register('typesCard2')}
                            placeholder="Ex: Mobile, Desktop, Tablet"
                        />
                    </div>
                </div>

                {/* Libellés */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Libellés</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Libellé publicité 1
                        </label>
                        <Input
                            {...register('libelle_publicite1')}
                            placeholder="Titre principal"
                            className={errors.libelle_publicite1 ? 'border-red-500' : ''}
                        />
                        {errors.libelle_publicite1 && (
                            <p className="text-red-500 text-sm mt-1">{errors.libelle_publicite1.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Libellé publicité 2
                        </label>
                        <Input
                            {...register('libelle_publicite2')}
                            placeholder="Sous-titre"
                        />
                    </div>
                </div>
            </div>

            {/* Liens */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Liens</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien 1
                        </label>
                        <Input
                            {...register('link1')}
                            placeholder="https://exemple.com"
                            className={errors.link1 ? 'border-red-500' : ''}
                        />
                        {errors.link1 && (
                            <p className="text-red-500 text-sm mt-1">{errors.link1.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien 2
                        </label>
                        <Input
                            {...register('link2')}
                            placeholder="https://exemple.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien 3
                        </label>
                        <Input
                            {...register('link3')}
                            placeholder="https://exemple.com"
                        />
                    </div>
                </div>
            </div>

            {/* Classes CSS */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Classes CSS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Classe 1
                        </label>
                        <Input
                            {...register('class1')}
                            placeholder="Ex: banner-large"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Classe 2
                        </label>
                        <Input
                            {...register('class2')}
                            placeholder="Ex: sidebar-ad"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Classe 3
                        </label>
                        <Input
                            {...register('class3')}
                            placeholder="Ex: mobile-only"
                        />
                    </div>
                </div>
            </div>

            {/* Images publicitaires */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Images Publicitaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderImageField(
                        'files_publicite1',
                        'Image publicitaire 1',
                        publicite.files_publicite1,
                        file1
                    )}
                    {renderImageField(
                        'files_publicite2',
                        'Image publicitaire 2',
                        publicite.files_publicite2,
                        file2
                    )}
                    {renderImageField(
                        'files_publicite3',
                        'Image publicitaire 3',
                        publicite.files_publicite3,
                        file3
                    )}
                </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="px-6"
                    disabled={isSubmitting}
                >
                    Annuler
                </Button>
                <Button
                    type="submit"
                    className="bg-[#B07B5E] hover:bg-[#9C6B52] px-6"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>Chargement...</>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}