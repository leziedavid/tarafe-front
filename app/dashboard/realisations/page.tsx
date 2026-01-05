"use client";

import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import Image from "next/image";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Grid3x3, List } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllRealisationsByAdmin, updateRealisationStatut, updateRealisationActive, deleteRealisation } from "@/service/realisationServices";
import { getImagesUrl } from "@/types/baseUrl";
import { Realisation } from "@/types/interfaces";
import MyModal from "@/components/modal/MyModal";
import RealisationsForm from "@/components/form/RealisationsForm";
import { toast } from "sonner";
import DeleteDialog from "@/components/modal/DeleteDialog";

export default function Page() {
    // État pour suivre l'image active pour chaque réalisation
    const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});
    // État pour le mode d'affichage (grid ou liste)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    // État pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10; // Nombre d'éléments par page
    const [realisations, setRealisations] = useState<Realisation[]>([]);
    const [loading, setLoading] = useState(false);
    const urlImages = getImagesUrl();
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<Realisation | undefined>(undefined);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    // Fonction pour charger les réalisations depuis l'API
    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getAllRealisationsByAdmin({ page: currentPage, limit: itemsPerPage });
            if (result.statusCode === 200 && result.data) {
                setRealisations(result.data.data || []);
                setTotalItems(result.data.total || 0);
                const calculatedTotalPages = Math.ceil((result.data.total || 0) / itemsPerPage);
                setTotalPages(calculatedTotalPages || 1);
                setLoading(false);
            } else {
                console.error("Erreur API:", result.message);
                setRealisations([]);
            }
        } catch (error) {
            setRealisations([]);
            setLoading(false);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]); // Recharger quand la page change

    // Fonctions pour la pagination

    // === Fonctions de pagination ===
    const onNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const onPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Fonction pour naviguer dans les images
    const nextImage = (realisationId: string) => {
        const realisation = realisations.find(r => r.id_realisations === realisationId);
        if (!realisation || !realisation.images || realisation.images.length <= 1) return;

        const currentIndex = activeImageIndex[realisationId] || 0;
        const nextIndex = (currentIndex + 1) % realisation.images.length;
        setActiveImageIndex(prev => ({ ...prev, [realisationId]: nextIndex }));
    };

    const prevImage = (realisationId: string) => {
        const realisation = realisations.find(r => r.id_realisations === realisationId);
        if (!realisation || !realisation.images || realisation.images.length <= 1) return;

        const currentIndex = activeImageIndex[realisationId] || 0;
        const prevIndex = (currentIndex - 1 + realisation.images.length) % realisation.images.length;
        setActiveImageIndex(prev => ({ ...prev, [realisationId]: prevIndex }));
    };

    // Fonction pour gérer le toggle de statut avec appel API
    const handleToggleStatut = async (id: string, currentValue: string) => {
        const newValue = currentValue === "1" ? "0" : "1";

        try {
            // Optimistic update
            setRealisations(prev => prev.map(real => real.id_realisations === id ? { ...real, statut_realisations: newValue } : real));
            // Appel API
            const result = await updateRealisationStatut(Number(id), newValue);
            if (result.statusCode !== 200) {
                // Rollback en cas d'erreur
                setRealisations(prev => prev.map(real => real.id_realisations === id ? { ...real, statut_realisations: currentValue } : real));
                console.error("Erreur lors de la mise à jour du statut:", result.message);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
            // Rollback en cas d'erreur
            setRealisations(prev => prev.map(real => real.id_realisations === id ? { ...real, statut_realisations: currentValue } : real));
            fetchData();
        }
    };

    // Fonction pour gérer le toggle d'active avec appel API
    const handleToggleActive = async (id: string, currentValue: string) => {
        const newValue = currentValue === "1" ? "0" : "1";

        try {
            // Optimistic update
            setRealisations(prev => prev.map(real => real.id_realisations === id ? { ...real, isActive: newValue } : real));
            // Appel API
            const result = await updateRealisationActive(Number(id), newValue);
            if (result.statusCode !== 200) {
                // Rollback en cas d'erreur
                setRealisations(prev => prev.map(real => real.id_realisations === id ? { ...real, isActive: currentValue } : real));
                console.error("Erreur lors de la mise à jour de l'état actif:", result.message);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'état actif:", error);
            // Rollback en cas d'erreur
            setRealisations(prev => prev.map(real => real.id_realisations === id ? { ...real, isActive: currentValue } : real));
            fetchData();
        }

    };

    // Fonction pour obtenir l'image active
    const getActiveImage = (realisation: Realisation) => {
        const activeIndex = activeImageIndex[realisation.id_realisations] || 0;
        if (realisation.images && realisation.images.length > 0) {
            return realisation.images[activeIndex];
        }
        return {
            filles_img_realisations: realisation.images_realisations,
            id_img_realisations: 0
        };
    };

    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        } catch {
            return dateString;
        }
    };

    const AddProduct = (item: Realisation) => {
        setOpen(true);
        setInitialValues(item);
    }

    const deleteProduct = async (productId: number) => {
        setSelectedId(productId);
        setDialogOpen(true);
    };

    // Delete Realisation deleteProduct
    const handleDeleteClick = async (productId: number) => {

        const result = await deleteRealisation(Number(productId));
        if (result.statusCode === 200 && result.data) {
            toast.success("Réalisation supprimée avec succès !");
            fetchData();
            setOpen(false);
        } else {
            toast.error(result.message);
            fetchData();
        }
    };


    // Mode Grid (optimisé pour mobile)
    const renderGridView = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-2">
            {realisations.map((realisation) => {
                const activeImage = getActiveImage(realisation);
                const totalImages = realisation.images?.length || 0;
                const currentIndex = activeImageIndex[realisation.id_realisations] || 0;

                return (
                    <div key={realisation.id_realisations} className="p-2 md:p-3 transition-all bg-white">
                        {/* Section Image avec slider */}
                        <div className="relative h-32 md:h-40 rounded-lg overflow-hidden mb-2 md:mb-3 bg-gray-100">
                            <Image
                                src={`${urlImages}/${activeImage.filles_img_realisations}`}
                                alt={realisation.libelle_realisations}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                unoptimized
                            />

                            {/* Indicateur en vedette (mobile friendly) */}
                            {realisation.isActive === "1" && (
                                <div className="absolute top-1 left-1">
                                    <span className="bg-yellow-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded-full">
                                        ★
                                    </span>
                                </div>
                            )}

                            {/* Boutons de navigation du slider (seulement si >1 image) */}
                            {totalImages > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage(realisation.id_realisations);
                                        }}
                                        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white"
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage(realisation.id_realisations);
                                        }}
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white"
                                    >
                                        <ChevronRight className="w-3 h-3" />
                                    </button>

                                    {/* Compteur d'images (simplifié sur mobile) */}
                                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                        {currentIndex + 1}/{totalImages}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Informations de base */}
                        <div className="space-y-1.5 md:space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-xs md:text-sm truncate">
                                        {realisation.libelle_realisations}
                                    </h3>
                                    {/* Description masquée sur mobile */}
                                </div>

                                {/* Boutons d'action (icônes seulement sur mobile) */}
                                <div className="flex gap-1 ml-1">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Eye onClick={() => AddProduct(realisation)} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Edit onClick={() => AddProduct(realisation)} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Trash2 onClick={() => deleteProduct(Number(realisation.id_realisations))} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Code et date (sur une seule ligne sur mobile) */}
                            <div className="flex justify-between items-center text-[10px] md:text-xs text-neutral-500">
                                <span className="truncate mr-1">{realisation.code_realisation}</span>
                                <span className="whitespace-nowrap">{formatDate(realisation.created_at)}</span>
                            </div>

                            {/* Toggles pour statut et vedette (stackés verticalement sur mobile) */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-0 mt-2 md:mt-3 pt-2 md:pt-3 border-t">
                                {/* Toggle Statut */}
                                <div className="flex items-center w-full sm:w-auto">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={realisation.statut_realisations === "1"}
                                            onChange={() => handleToggleStatut(realisation.id_realisations, realisation.statut_realisations)}
                                            disabled={loading}
                                        />
                                        <div className="relative w-8 h-4 md:w-9 md:h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] md:after:top-[2px] after:start-[1px] md:after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 md:after:h-4 md:after:w-4 after:transition-all peer-checked:bg-green-800"></div>
                                        <span className="select-none ms-2 text-[10px] md:text-xs font-medium truncate">
                                            {realisation.statut_realisations === "1" ? "Actif" : "Inactif"}
                                        </span>
                                    </label>
                                </div>

                                {/* Toggle Vedette */}
                                <div className="flex items-center w-full sm:w-auto">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={String(realisation.isActive) === "1"}
                                            onChange={() => handleToggleActive(realisation.id_realisations, realisation.isActive)}
                                            disabled={loading}
                                        />
                                        <div className="relative w-8 h-4 md:w-9 md:h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] md:after:top-[2px] after:start-[1px] md:after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 md:after:h-4 md:after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                                        <span className="select-none ms-2 text-[10px] md:text-xs font-medium truncate">
                                            {String(realisation.isActive) === "1" ? "Vedette" : "Normal"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Miniatures des images (optionnel sur mobile) */}
                            {totalImages > 1 && (
                                <div className="mt-1 md:mt-2 pt-1 md:pt-2 border-t">
                                    <div className="flex gap-1 overflow-x-auto">
                                        {realisation.images?.slice(0, 3).map((image, index) => (
                                            <button
                                                key={image.id_img_realisations}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveImageIndex(prev => ({
                                                        ...prev,
                                                        [realisation.id_realisations]: index
                                                    }));
                                                }}
                                                className={`relative w-8 h-8 md:w-10 md:h-10 rounded overflow-hidden flex-shrink-0 ${index === currentIndex ? 'ring-1 md:ring-2 ring-brand-primary' : 'opacity-70 hover:opacity-100'
                                                    }`}
                                            >
                                                <Image
                                                    src={`${urlImages}/${image.filles_img_realisations}`}
                                                    alt={`Miniature ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="32px"
                                                    unoptimized
                                                />
                                            </button>
                                        ))}
                                        {totalImages > 3 && (
                                            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded bg-gray-200 flex items-center justify-center text-[10px] md:text-xs">
                                                +{totalImages - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Mode Liste
    const renderListView = () => (
        <div className="space-y-3">
            {realisations.map((realisation) => {
                const activeImage = getActiveImage(realisation);
                const totalImages = realisation.images?.length || 0;
                const currentIndex = activeImageIndex[realisation.id_realisations] || 0;

                return (
                    <div
                        key={realisation.id_realisations}
                        className="flex flex-col sm:flex-row gap-2 md:gap-2 p-3 transition-all bg-white"
                    >
                        {/* Image */}
                        <div className="relative w-full sm:w-32 md:w-40 h-40 sm:h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                                src={`${urlImages}/${activeImage.filles_img_realisations}`}
                                alt={realisation.libelle_realisations}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 160px"
                                unoptimized
                            />
                            {realisation.isActive === "1" && (
                                <div className="absolute top-2 left-2">
                                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        ★ Vedette
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-sm md:text-base truncate">
                                        {realisation.libelle_realisations}
                                    </h3>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex gap-2 self-start sm:self-center">
                                    <button className="p-1.5 hover:bg-gray-100 rounded">
                                        <Eye onClick={() => AddProduct(realisation)} className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded">
                                        <Edit onClick={() => AddProduct(realisation)} className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded">
                                        <Trash2 onClick={() => deleteProduct(Number(realisation.id_realisations))} className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Informations secondaires */}
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-neutral-500">Code</p>
                                    <p className="font-medium">{realisation.code_realisation}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500">Date</p>
                                    <p className="font-medium">{realisation.created_at}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500">Position</p>
                                    <p className="font-medium">#{realisation.position}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500">Images</p>
                                    <p className="font-medium">{totalImages}</p>
                                </div>
                            </div>

                            {/* Toggles et miniatures */}
                            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t">
                                {/* Toggles */}
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={realisation.statut_realisations === "1"}
                                                onChange={() => handleToggleStatut(realisation.id_realisations, realisation.statut_realisations)}
                                                disabled={loading}
                                            />
                                            <div className="relative w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-800"></div>
                                            <span className="select-none ms-2 text-sm font-medium">
                                                {realisation.statut_realisations === "1" ? "Actif" : "Inactif"}
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" 
                                                checked={String(realisation.isActive) === "1"}
                                                onChange={() => handleToggleActive(realisation.id_realisations, realisation.isActive)}
                                                disabled={loading} />
                                            <div className="relative w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                                            <span className="select-none ms-2 text-sm font-medium">
                                                {String(realisation.isActive) === "1" ? "Vedette" : "Normal"}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Miniatures */}
                                {totalImages > 0 && (
                                    <div className="flex gap-1">
                                        {realisation.images?.slice(0, 4).map((image, index) => (
                                            <button key={image.id_img_realisations}
                                                onClick={() => setActiveImageIndex(prev => ({ ...prev, [realisation.id_realisations]: index }))}
                                                className={`relative w-10 h-10 rounded overflow-hidden ${index === currentIndex ? 'ring-2 ring-brand-primary' : 'opacity-70 hover:opacity-100'}`}  >
                                                <Image src={`${urlImages}/${image.filles_img_realisations}`}
                                                    alt={`Miniature ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                    unoptimized
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <AdminLayout>

            <div className="p-3 md:p-6">
                {/* En-tête avec titre, bouton d'ajout et sélecteur de vue */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                    <h1 className="text-xl md:text-2xl font-bold">Réalisations</h1>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Sélecteur de mode d'affichage */}
                        <div className="flex overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600'}`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <button onClick={() => AddProduct({} as Realisation)} className="bg-brand-primary hover:bg-brand-secondary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm whitespace-nowrap flex-shrink-0">
                            + Ajouter
                        </button>
                    </div>
                </div>

                {/* Affichage selon le mode sélectionné */}
                {loading ? (
                    <div className="text-center py-8">Chargement...</div>
                ) : realisations.length === 0 ? (
                    <div className="text-center py-8">Aucune réalisation trouvée</div>
                ) : viewMode === 'grid' ? renderGridView() : renderListView()}

                {/* Pagination */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4 mt-8">
                    <div className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                        Page {currentPage} sur {totalPages}
                    </div>

                    <div className="flex gap-2 justify-center">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center" onClick={onPreviousPage} disabled={currentPage <= 1} >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Précédent
                        </button>

                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center" onClick={onNextPage} disabled={currentPage >= totalPages} >
                            Suivant
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <RealisationsForm
                    datas={initialValues}
                    onClose={() => setOpen(false)}
                    fetchdatas={() => fetchData()}
                    isOpen={false} />
            </MyModal>

            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (selectedId) handleDeleteClick(selectedId); }} />


        </AdminLayout>
    );
}