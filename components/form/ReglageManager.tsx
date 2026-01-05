'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Edit, Plus, Save, Settings, X, Globe, Building, Mail, Phone, MapPin, Clock, Palette, Eye, Users, MessageSquare, Image as ImageIcon, Trash2 } from 'lucide-react';
import RichTextEditor from '../rich-text-editor';
import Image from "next/image";
import { reglageSchema, ReglageFormValues } from '@/types/schemas/reglageSchema';
import { createReglage, deleteReglage, getAllReglagesIn, updateReglage } from '@/service/reglagesServices';
import { Reglage } from '@/types/interfaces';
import { getImagesUrl } from '@/types/baseUrl';

// Type pour les props du formulaire
interface ReglageFormProps {
    reglage: Partial<Reglage>;
    onSubmit: (data: ReglageFormValues) => void;
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
            <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <Image src={fullSrc} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
            </div>
            {showRemove && onRemove && (
                <button type="button" onClick={onRemove} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export default function ReglageManager() {
    // On stocke uniquement le tableau de reglages
    const [reglages, setReglages] = useState<Reglage[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const fetchReglages = async () => {
        try {
            const res = await getAllReglagesIn();

            // Vérifie que l'objet contient bien la clé 'reglages'
            if (res.data && res.data.reglages && res.data.reglages.length > 0) {
                setReglages(res.data.reglages); // <-- juste le tableau
                setTotalItems(res.data.reglages.length);
            } else {
                setReglages([]);
                setTotalItems(0);
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des réglages');
            setReglages([]);
            setTotalItems(0);
        }
    };

    useEffect(() => {
        fetchReglages();
    }, [currentPage]);

    const prepareFormData = (data: ReglageFormValues): FormData => {
        const formData = new FormData();

        // Ajouter tous les champs texte
        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                return;
            }

            // Traitement spécial pour les champs de type fichier
            const fileFields = [
                'logoSite_reglages',
                'logo_footer',
                'desc_reglagesImg1',
                'desc_reglagesImg2',
                'images1_reglages',
                'images2_reglages',
                'images3_reglages'
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

    const onSubmitHandler = async (data: ReglageFormValues, id?: string) => {
        const formData = prepareFormData(data);

        try {
            let res;
            if (id) {
                res = await updateReglage(Number(id), formData);
            } else {
                res = await createReglage(formData);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (id ? 'Réglage mis à jour' : 'Réglage créé'));
                fetchReglages();
                setEditingId(null);
                setCreating(false);
            } else {
                toast.error(res.message || 'Erreur serveur');
            }
        } catch (error) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error('Erreur lors du submit réglage :', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ces réglages ?")) return;

        try {
            const res = await deleteReglage(Number(id));
            if (res.statusCode === 200) {
                toast.success(res.message || "Réglages supprimés avec succès");
                fetchReglages();
            } else {
                toast.error(res.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            toast.error("Erreur serveur lors de la suppression");
            console.error("Erreur delete réglages :", error);
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

    // Convertir les valeurs string en nombre pour les comparaisons
    const isActive = (active: string) => active === "1";

    // Fonction pour afficher les images d'une bannière
    const renderBannerImages = (images: string[], bannerTitle: string) => {
        if (!images || images.length === 0) return null;

        return (
            <div className="space-y-2">
                <span className="text-sm font-medium text-gray-500">Images {bannerTitle}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        image && (
                            <div key={index} className="space-y-2">
                                <ImagePreview
                                    src={image}
                                    alt={`${bannerTitle} - Image ${index + 1}`}
                                />
                                <p className="text-xs text-gray-500 text-center truncate">
                                    Image {index + 1}
                                </p>
                            </div>
                        )
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B07B5E] rounded-lg">
                        <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Configuration du site</h1>
                        <p className="text-gray-500">Gérez tous les paramètres du site</p>
                    </div>
                </div>

                <Button
                    onClick={() => { setCreating(true); setEditingId(null); }}
                    className="bg-[#B07B5E] hover:bg-[#9C6B52]"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle configuration
                </Button>
            </div>

            {creating && (
                <div className="bg-white  p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Créer une nouvelle configuration</h2>
                    <ReglageFormComponent
                        reglage={{
                            id_reglages: 'new',
                            entreprise_reglages: '',
                            description_reglages: '',
                            email_reglages: '',
                            phone1_reglages: '',
                            localisation_reglages: '',
                            desc_footer: '',
                            texteHeader1: '',
                            texteHeader2: '',
                            active: "0",
                            addby_partenaires: "0"
                        }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-6">
                {reglages.slice((currentPage - 1) * limit, currentPage * limit).map((reglage) => (
                    <div key={reglage.id_reglages} className="bg-white overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* En-tête avec nom d'entreprise et statut */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Building className="h-5 w-5 text-gray-400" />
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {displayValue(reglage.entreprise_reglages)}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${isActive(reglage.active) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {isActive(reglage.active) ? 'Actif' : 'Inactif'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingId(editingId === reglage.id_reglages ? null : reglage.id_reglages)}
                                        className="flex items-center gap-2"
                                    >
                                        {editingId === reglage.id_reglages ? (
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
                                        onClick={() => handleDelete(reglage.id_reglages)}
                                        className="flex items-center gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Supprimer
                                    </Button>
                                </div>
                            </div>

                            {/* Informations principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">Email</span>
                                    </div>
                                    <p className="font-medium">{displayValue(reglage.email_reglages)}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">Téléphone principal</span>
                                    </div>
                                    <p className="font-medium">{displayValue(reglage.phone1_reglages)}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">Localisation</span>
                                    </div>
                                    <p className="font-medium">{displayValue(reglage.localisation_reglages)}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">Horaires</span>
                                    </div>
                                    <p className="font-medium">{displayValue(reglage.ouverture_reglages)}</p>
                                </div>
                            </div>

                            {/* Description */}
                            {reglage.description_reglages && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="text-sm font-medium">Description</span>
                                    </div>
                                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: reglage.description_reglages }} />
                                </div>
                            )}

                            {/* Footer description */}
                            {reglage.desc_footer && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Globe className="h-4 w-4" />
                                        <span className="text-sm font-medium">Description Footer</span>
                                    </div>
                                    <div className="text-gray-700 prose prose-sm max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: reglage.desc_footer }} />
                                    </div>
                                </div>
                            )}

                            {/* Textes header */}
                            {(reglage.texteHeader1 || reglage.texteHeader2) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reglage.texteHeader1 && (
                                        <div className="space-y-1">
                                            <span className="text-sm font-medium text-gray-500">Texte Header 1</span>
                                            <p className="text-gray-700">{reglage.texteHeader1}</p>
                                        </div>
                                    )}
                                    {reglage.texteHeader2 && (
                                        <div className="space-y-1">
                                            <span className="text-sm font-medium text-gray-500">Texte Header 2</span>
                                            <p className="text-gray-700">{reglage.texteHeader2}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Bannières avec images */}
                            {(reglage.titre_banner1 || reglage.titre_banner2 || reglage.titre_banner3) && (
                                <div className="space-y-6 pt-4 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold">Bannières</h4>

                                    {reglage.titre_banner1 && (
                                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                                            <h5 className="font-medium">Bannière 1: {reglage.titre_banner1}</h5>
                                            {reglage.texte_banner1 && (
                                                <p className="text-gray-600">{reglage.texte_banner1}</p>
                                            )}
                                            {/* Afficher les 3 images de la bannière 1 */}
                                            {renderBannerImages([
                                                reglage.images1_reglages,
                                                reglage.images2_reglages,
                                                reglage.images3_reglages
                                            ].filter(Boolean), "Bannière 1")}
                                        </div>
                                    )}

                                    {reglage.titre_banner2 && (
                                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                                            <h5 className="font-medium">Bannière 2: {reglage.titre_banner2}</h5>
                                            {reglage.texte_banner2 && (
                                                <p className="text-gray-600">{reglage.texte_banner2}</p>
                                            )}
                                            {/* Pour la bannière 2, on pourrait ajouter d'autres champs d'images si disponibles */}
                                            <div className="text-sm text-gray-500 italic">
                                                Images pour la bannière 2
                                            </div>
                                        </div>
                                    )}

                                    {reglage.titre_banner3 && (
                                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                                            <h5 className="font-medium">Bannière 3: {reglage.titre_banner3}</h5>
                                            {reglage.texte_banner3 && (
                                                <p className="text-gray-600">{reglage.texte_banner3}</p>
                                            )}
                                            {/* Pour la bannière 3, on pourrait ajouter d'autres champs d'images si disponibles */}
                                            <div className="text-sm text-gray-500 italic">
                                                Images pour la bannière 3
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Réseaux sociaux */}
                            {(reglage.lienFacebbook_reglages || reglage.lienLikedin_reglages || reglage.lienInstagram_reglages) && (
                                <div className="space-y-2">
                                    <span className="text-sm font-medium text-gray-500">Réseaux sociaux</span>
                                    <div className="flex gap-4">
                                        {reglage.lienFacebbook_reglages && (
                                            <a
                                                href={reglage.lienFacebbook_reglages}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Facebook
                                            </a>
                                        )}
                                        {reglage.lienLikedin_reglages && (
                                            <a
                                                href={reglage.lienLikedin_reglages}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 hover:text-blue-900 text-sm"
                                            >
                                                LinkedIn
                                            </a>
                                        )}
                                        {reglage.lienInstagram_reglages && (
                                            <a
                                                href={reglage.lienInstagram_reglages}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-pink-600 hover:text-pink-800 text-sm"
                                            >
                                                Instagram
                                            </a>
                                        )}
                                        {reglage.liensYoutub_reglages && (
                                            <a
                                                href={reglage.liensYoutub_reglages}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                YouTube
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Statistiques */}
                            {(reglage.nb_views_site || reglage.nb_views_fb || reglage.nb_views_insta) && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Eye className="h-4 w-4" />
                                            <span className="text-sm">Vues site</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{displayValue(reglage.nb_views_site)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Users className="h-4 w-4" />
                                            <span className="text-sm">Vues Facebook</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{displayValue(reglage.nb_views_fb)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Users className="h-4 w-4" />
                                            <span className="text-sm">Vues Instagram</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{displayValue(reglage.nb_views_insta)}</p>
                                    </div>
                                </div>
                            )}

                            {/* Prévisualisation des logos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                {reglage.logoSite_reglages && (
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium text-gray-500">Logo du site</span>
                                        <ImagePreview
                                            src={reglage.logoSite_reglages}
                                            alt="Logo du site"
                                        />
                                    </div>
                                )}
                                {reglage.logo_footer && (
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium text-gray-500">Logo footer</span>
                                        <ImagePreview
                                            src={reglage.logo_footer}
                                            alt="Logo footer"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Formulaire d'édition */}
                            {editingId === reglage.id_reglages && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold mb-4">Modifier la configuration</h4>
                                    <ReglageFormComponent
                                        reglage={reglage}
                                        onSubmit={(data) => onSubmitHandler(data, reglage.id_reglages)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Pagination */}
                {reglages.length > 0 && (
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
function ReglageFormComponent({ reglage, onSubmit, onCancel }: ReglageFormProps) {
    const urlImages = getImagesUrl();
    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ReglageFormValues>({
        resolver: zodResolver(reglageSchema),
        defaultValues: {
            entreprise_reglages: reglage.entreprise_reglages || '',
            description_reglages: reglage.description_reglages || '',
            desc_footer: reglage.desc_footer || '',
            email_reglages: reglage.email_reglages || '',
            phone1_reglages: reglage.phone1_reglages || '',
            phone2_reglages: reglage.phone2_reglages || '',
            localisation_reglages: reglage.localisation_reglages || '',
            ouverture_reglages: reglage.ouverture_reglages || '',
            lienFacebbook_reglages: reglage.lienFacebbook_reglages || '',
            lienLikedin_reglages: reglage.lienLikedin_reglages || '',
            lienInstagram_reglages: reglage.lienInstagram_reglages || '',
            liensYoutub_reglages: reglage.liensYoutub_reglages || '',
            texteHeader1: reglage.texteHeader1 || '',
            texteHeader2: reglage.texteHeader2 || '',
            titre_banner1: reglage.titre_banner1 || '',
            texte_banner1: reglage.texte_banner1 || '',
            titre_banner2: reglage.titre_banner2 || '',
            texte_banner2: reglage.texte_banner2 || '',
            titre_banner3: reglage.titre_banner3 || '',
            texte_banner3: reglage.texte_banner3 || '',
            couleur1: reglage.couleur1 || '#B07B5E',
            couleur2: reglage.couleur2 || '#C19A7B',
            couleur3: reglage.couleur3 || '#D4B699',
            couleur4: reglage.couleur4 || '#E7D2BE',
            active: Number(reglage.active ?? 0),
            addby_partenaires: Number(reglage.addby_partenaires ?? 0),
            nb_views_site: Number(reglage.nb_views_site ?? 0),
            nb_views_fb: Number(reglage.nb_views_fb ?? 0),
            nb_views_insta: Number(reglage.nb_views_insta ?? 0),
            images1_reglages: reglage.images1_reglages || '',
            images2_reglages: reglage.images2_reglages || '',
            images3_reglages: reglage.images3_reglages || '',
        },
    });

    // Observer les valeurs des fichiers
    const images1File = watch('images1_reglages');
    const images2File = watch('images2_reglages');
    const images3File = watch('images3_reglages');

    // Fonction pour supprimer une image
    const handleRemoveImage = (fieldName: keyof ReglageFormValues) => {
        setValue(fieldName, '');
    };

    // Fonction pour rendre un champ d'image
    const renderImageField = (
        fieldName: keyof ReglageFormValues,
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
                {/* Informations de base */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations de base</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'entreprise *
                        </label>
                        <Input
                            {...register('entreprise_reglages')}
                            placeholder="Nom de l'entreprise"
                            className={errors.entreprise_reglages ? 'border-red-500' : ''}
                        />
                        {errors.entreprise_reglages && (
                            <p className="text-red-500 text-sm mt-1">{errors.entreprise_reglages.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <Input
                            {...register('email_reglages')}
                            type="email"
                            placeholder="contact@entreprise.com"
                            className={errors.email_reglages ? 'border-red-500' : ''}
                        />
                        {errors.email_reglages && (
                            <p className="text-red-500 text-sm mt-1">{errors.email_reglages.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone principal
                        </label>
                        <Input {...register('phone1_reglages')} placeholder="+33 1 23 45 67 89" />
                    </div>
                </div>

                {/* Localisation et horaires */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Localisation & Horaires</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Localisation
                        </label>
                        <Input {...register('localisation_reglages')} placeholder="Adresse complète" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Horaires d'ouverture
                        </label>
                        <Input {...register('ouverture_reglages')} placeholder="Lun-Ven: 9h-18h" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone secondaire
                        </label>
                        <Input {...register('phone2_reglages')} placeholder="Téléphone supplémentaire" />
                    </div>

                    <div >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Statut
                            </label>
                            <select  {...register('active')} className="w-full p-2 border border-gray-300 rounded-md"  >
                                <option value="0">Inactif</option>
                                <option value="1">Actif</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Textes header */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Textes Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input {...register('texteHeader1')} placeholder="Texte header 1" />
                    </div>
                    <div>
                        <Input {...register('texteHeader2')} placeholder="Texte header 2" />
                    </div>
                </div>
            </div>

            {/* Description footer */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description du site page apropos
                </label>

                <Controller name="description_reglages" control={control} render={({ field }) => (<RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />)} />
                {errors.description_reglages && (
                    <p className="text-red-500 text-sm mt-1">{errors.description_reglages.message}</p>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description Footer</h3>
                <Controller name="desc_footer" control={control} render={({ field }) => (<RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />)} />
            </div>

            {/* Bannières avec images */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Bannières</h3>

                {/* Bannière 1 avec 3 images */}
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Bannière 1</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre bannière 1
                            </label>
                            <Input {...register('titre_banner1')} placeholder="Titre bannière 1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texte bannière 1
                            </label>
                            <Textarea
                                {...register('texte_banner1')}
                                placeholder="Texte bannière 1"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* 3 images pour la bannière 1 */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium">Images pour la bannière 1 (3 images maximum)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {renderImageField('images1_reglages', 'Image banner 1',
                                reglage.images1_reglages,
                                images1File
                            )}
                            {renderImageField( 'images2_reglages',  'Image banner 2',
                                reglage.images2_reglages,
                                images2File
                            )}
                            {renderImageField( 'images3_reglages', 'Image banner 3 ',
                                reglage.images3_reglages,
                                images3File
                            )}
                        </div>
                    </div>
                </div>

                {/* Bannière 2 */}
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Bannière 2</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre bannière 2
                            </label>
                            <Input {...register('titre_banner2')} placeholder="Titre bannière 2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texte bannière 2
                            </label>
                            <Textarea
                                {...register('texte_banner2')}
                                placeholder="Texte bannière 2"
                                rows={2}
                            />
                        </div>
                    </div>

                </div>

                {/* Bannière 3 */}
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium">Bannière 3</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre bannière 3
                            </label>
                            <Input {...register('titre_banner3')} placeholder="Titre bannière 3" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texte bannière 3
                            </label>
                            <Textarea
                                {...register('texte_banner3')}
                                placeholder="Texte bannière 3"
                                rows={2}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                        <Input {...register('lienFacebbook_reglages')} placeholder="URL Facebook" />
                        {errors.lienFacebbook_reglages && (
                            <p className="text-red-500 text-sm mt-1">{errors.lienFacebbook_reglages.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <Input {...register('lienLikedin_reglages')} placeholder="URL LinkedIn" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <Input {...register('lienInstagram_reglages')} placeholder="URL Instagram" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                        <Input {...register('liensYoutub_reglages')} placeholder="URL YouTube" />
                    </div>
                </div>
            </div>

            {/* Couleurs */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Couleurs du thème</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur 1</label>
                        <div className="flex gap-2">
                            <Input {...register('couleur1')} placeholder="#B07B5E" />
                            <input
                                type="color"
                                {...register('couleur1')}
                                className="w-10 h-10 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur 2</label>
                        <div className="flex gap-2">
                            <Input {...register('couleur2')} placeholder="#C19A7B" />
                            <input
                                type="color"
                                {...register('couleur2')}
                                className="w-10 h-10 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur 3</label>
                        <div className="flex gap-2">
                            <Input {...register('couleur3')} placeholder="#D4B699" />
                            <input
                                type="color"
                                {...register('couleur3')}
                                className="w-10 h-10 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur 4</label>
                        <div className="flex gap-2">
                            <Input {...register('couleur4')} placeholder="#E7D2BE" />
                            <input
                                type="color"
                                {...register('couleur4')}
                                className="w-10 h-10 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Fichiers - Logos */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Logos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo du site
                        </label>
                        {renderImageField(
                            'logoSite_reglages',
                            'Logo du site',
                            reglage.logoSite_reglages,
                            watch('logoSite_reglages')
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo footer
                        </label>
                        {renderImageField(
                            'logo_footer',
                            'Logo footer',
                            reglage.logo_footer,
                            watch('logo_footer')
                        )}
                    </div>
                </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={onCancel} className="px-6" disabled={isSubmitting}>
                    Annuler
                </Button>

                <Button type="submit" className="bg-[#B07B5E] hover:bg-[#9C6B52] px-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>Chargement...</>
                    ) : (
                        <> <Save className="h-4 w-4 mr-2" /> Sauvegarder  </>
                    )}
                </Button>
            </div>
        </form>
    );
}