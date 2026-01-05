'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Edit, Plus, Save, Users, X, Mail, Briefcase, User, Image as ImageIcon, Trash2, Calendar, Clock } from 'lucide-react';
import Image from "next/image";
import { equipeSchema, EquipeFormValues } from '@/types/schemas/equipeSchema';
import { createEquipe, deleteEquipe, getAllEquipes, updateEquipe } from '@/service/reglagesServices';
import { Equipe } from '@/types/interfaces';
import { getImagesUrl } from '@/types/baseUrl';

// Type pour les props du formulaire
interface EquipeFormProps {
    equipe: Partial<Equipe>;
    onSubmit: (data: EquipeFormValues) => void;
    onCancel: () => void;
}

// Composant pour afficher une image avec option de suppression
interface ImagePreviewProps {
    src: string;
    alt: string;
    onRemove?: () => void;
    showRemove?: boolean;
}

function ImagePreview({ src, alt, onRemove, showRemove = false }: ImagePreviewProps) {
    const urlImages = getImagesUrl();
    const fullSrc = src.startsWith('http') ? src : `${urlImages}/${src}`;

    return (
        <div className="relative group">
            <div className="relative w-32 h-32 border-2 border-gray-200 rounded-full overflow-hidden bg-gray-50 mx-auto">
                <Image
                    src={fullSrc}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100px, 128px"
                    unoptimized
                />
            </div>
            {showRemove && onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1/2 translate-x-1/2 sm:right-2 sm:translate-x-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export default function EquipeManager() {
    const [equipes, setEquipes] = useState<Equipe[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const fetchEquipes = async () => {
        try {
            const res = await getAllEquipes(currentPage, limit);
            if (res.data && res.data.data) {
                setEquipes(res.data.data);
                setTotalItems(res.data.total || 0);
                setCurrentPage(res.data.page || 1);
            } else {
                setEquipes([]);
                setTotalItems(0);
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des membres de l\'équipe');
            console.error(err);
            setEquipes([]);
            setTotalItems(0);
        }
    };

    useEffect(() => {
        fetchEquipes();
    }, [currentPage]);

    const prepareFormData = (data: EquipeFormValues): FormData => {
        const formData = new FormData();

        // Ajouter tous les champs texte
        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                return;
            }

            // Traitement spécial pour le champ photo
            if (key === 'photo_equipe') {
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

    const onSubmitHandler = async (data: EquipeFormValues, id?: number) => {
        const formData = prepareFormData(data);

        try {
            let res;
            if (id) {
                res = await updateEquipe(id, formData);
            } else {
                res = await createEquipe(formData);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (id ? 'Membre mis à jour' : 'Membre créé'));
                fetchEquipes();
                setEditingId(null);
                setCreating(false);
            } else {
                toast.error(res.message || 'Erreur serveur');
            }
        } catch (error) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error('Erreur lors du submit équipe :', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce membre de l'équipe ?")) return;

        try {
            const res = await deleteEquipe(id);
            if (res.statusCode === 200) {
                toast.success(res.message || "Membre supprimé avec succès");
                fetchEquipes();
            } else {
                toast.error(res.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            toast.error("Erreur serveur lors de la suppression");
            console.error("Erreur delete équipe :", error);
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
    const displayValue = (value: any) => value || "Non renseigné";

    // Formater la date
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "Non disponible";

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Équipes à afficher pour la pagination actuelle
    const equipesToDisplay = equipes.slice((currentPage - 1) * limit, currentPage * limit);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B07B5E] rounded-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des Équipes</h1>
                        <p className="text-gray-500">Gérez les membres fondateurs de l'entreprise</p>
                    </div>
                </div>
                <Button
                    onClick={() => { setCreating(true); setEditingId(null); }}
                    className="bg-[#B07B5E] hover:bg-[#9C6B52]"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau membre
                </Button>
            </div>

            {creating && (
                <div className="bg-white p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau membre</h2>
                    <EquipeFormComponent
                        equipe={{
                            id_equipe: 0,
                            nomPren_equipe: '',
                            fonction_equipe: '',
                            email_equipe: '',
                            photo_equipe: ''
                        }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-6">
                {/* Une seule boucle map ici */}
                {equipesToDisplay.map((equipe) => (
                    <div key={equipe.id_equipe} className="bg-white overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* En-tête avec photo et informations */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex items-start gap-4 w-full sm:w-auto">
                                    {/* Photo */}
                                    {equipe.photo_equipe && (
                                        <div className="relative w-24 h-24 flex-shrink-0">
                                            <ImagePreview
                                                src={equipe.photo_equipe}
                                                alt={equipe.nomPren_equipe || "Membre"}
                                            />
                                        </div>
                                    )}

                                    {/* Conteneur texte */}
                                    <div className="flex-1 pl-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-gray-400" />
                                            <h3 className="text-xl font-bold text-gray-900 truncate">
                                                {displayValue(equipe.nomPren_equipe)}
                                            </h3>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Briefcase className="h-4 w-4" />
                                                <span className="text-sm">Fonction</span>
                                            </div>
                                            <p className="font-medium text-gray-700 truncate">
                                                {displayValue(equipe.fonction_equipe)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingId(editingId === equipe.id_equipe ? null : equipe.id_equipe)}
                                        className="flex items-center gap-2"
                                    >
                                        {editingId === equipe.id_equipe ? (
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
                                        onClick={() => handleDelete(equipe.id_equipe)}
                                        className="flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer
                                    </Button>
                                </div>
                            </div>

                            {/* Informations détaillées */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm font-medium">Email</span>
                                    </div>
                                    {equipe.email_equipe ? (
                                        <a
                                            href={`mailto:${equipe.email_equipe}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            {equipe.email_equipe}
                                        </a>
                                    ) : (
                                        <p className="text-gray-500 italic">Non renseigné</p>
                                    )}
                                </div>

                                {/* Informations système */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm font-medium">Dates</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500">Créé le</span>
                                            <p className="text-gray-700">{formatDate(equipe.created_at)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500">Mis à jour le</span>
                                            <p className="text-gray-700">{formatDate(equipe.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire d'édition */}
                            {editingId === equipe.id_equipe && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold mb-4">Modifier le membre</h4>
                                    <EquipeFormComponent
                                        equipe={equipe}
                                        onSubmit={(data) => onSubmitHandler(data, equipe.id_equipe)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Pagination - placé après la boucle */}
                {equipes.length > 0 && (
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

                {/* Message si vide - placé après la boucle */}
                {equipes.length === 0 && !creating && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre d'équipe</h3>
                        <p className="text-gray-500 mb-4">Commencez par ajouter les membres fondateurs de votre entreprise.</p>
                        <Button
                            onClick={() => setCreating(true)}
                            className="bg-[#B07B5E] hover:bg-[#9C6B52]"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un membre
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Composant formulaire séparé (identique au précédent)
function EquipeFormComponent({ equipe, onSubmit, onCancel }: EquipeFormProps) {
    const urlImages = getImagesUrl();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<EquipeFormValues>({
        resolver: zodResolver(equipeSchema),
        defaultValues: {
            nomPren_equipe: equipe.nomPren_equipe || '',
            fonction_equipe: equipe.fonction_equipe || '',
            email_equipe: equipe.email_equipe || '',
            photo_equipe: equipe.photo_equipe || '',
        },
    });

    // Observer la valeur du fichier photo
    const photoFile = watch('photo_equipe');

    // Fonction pour supprimer la photo
    const handleRemovePhoto = () => {
        setValue('photo_equipe', '');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations personnelles</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom complet *
                        </label>
                        <Input
                            {...register('nomPren_equipe')}
                            placeholder="Ex: Jean Dupont"
                            className={errors.nomPren_equipe ? 'border-red-500' : ''}
                        />
                        {errors.nomPren_equipe && (
                            <p className="text-red-500 text-sm mt-1">{errors.nomPren_equipe.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fonction *
                        </label>
                        <Input
                            {...register('fonction_equipe')}
                            placeholder="Ex: PDG, Directeur Technique"
                            className={errors.fonction_equipe ? 'border-red-500' : ''}
                        />
                        {errors.fonction_equipe && (
                            <p className="text-red-500 text-sm mt-1">{errors.fonction_equipe.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <Input
                            {...register('email_equipe')}
                            type="email"
                            placeholder="jean.dupont@entreprise.com"
                            className={errors.email_equipe ? 'border-red-500' : ''}
                        />
                        {errors.email_equipe && (
                            <p className="text-red-500 text-sm mt-1">{errors.email_equipe.message}</p>
                        )}
                    </div>
                </div>

                {/* Photo */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Photo</h3>

                    <div className="space-y-4">
                        {/* Aperçu de la photo existante ou nouvelle */}
                        {(equipe.photo_equipe || photoFile) && (
                            <div className="mb-4">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative w-48 h-48 border-2 border-gray-300 rounded-full overflow-hidden bg-gray-100">
                                        {photoFile && photoFile instanceof FileList && photoFile.length > 0 ? (
                                            // Aperçu du nouveau fichier
                                            <img
                                                src={URL.createObjectURL(photoFile[0])}
                                                alt="Nouvelle photo"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : equipe.photo_equipe ? (
                                            // Photo existante
                                            <Image
                                                src={`${urlImages}/${equipe.photo_equipe}`}
                                                alt={equipe.nomPren_equipe || "Membre"}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : null}
                                    </div>

                                    {/* Bouton pour supprimer la photo */}
                                    <div className="flex justify-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRemovePhoto}
                                            className="flex items-center gap-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Supprimer la photo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input file - masqué si on a déjà une photo */}
                        {!equipe.photo_equipe && !photoFile && (
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Cliquez pour upload une photo</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, JPEG jusqu'à 10MB
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Recommandé : 500x500px
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        {...register('photo_equipe')}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        )}

                        {/* Input file caché pour pouvoir ré-uploader */}
                        {(equipe.photo_equipe || photoFile) && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Changer la photo
                                </label>
                                <input
                                    type="file"
                                    {...register('photo_equipe')}
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                />
                            </div>
                        )}
                    </div>

                    {/* Conseils pour la photo */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Conseils pour la photo :</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Photo professionnelle de préférence</li>
                            <li>• Fond neutre (blanc ou uni)</li>
                            <li>• Bon éclairage, visage visible</li>
                            <li>• Format carré recommandé</li>
                            <li>• Taille max : 10MB</li>
                        </ul>
                    </div>
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