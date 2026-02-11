"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Feature } from "@/types/interfaces";
import { Eye, Edit, Trash2 } from "lucide-react";
import { getImagesUrl } from "@/types/baseUrl";
import { activateFeature, deleteFeature, getAllFeatures } from "@/service/managementServices";
import { toast } from "sonner";
import MyModal from "../modal/MyModal";
import DeleteDialog from "../modal/DeleteDialog";
import FeatureForm from "../form/FeatureForm";


export default function FeatureManagement() {

    const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
    const urlImages = getImagesUrl();
    const [featuresList, setFeaturesList] = useState<Feature[]>([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<Feature | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const fetchData = async () => {
        const response = await getAllFeatures();
        if (response.statusCode === 200 && response.data) {
            setFeaturesList(response.data.data);
        } else {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getActiveImage = (feature: Feature) => {
        return { filles_img_realisations: feature.image || "" };
    };

    const handleToggleActive = async (id: number, current: number | boolean) => {
        try {
            await activateFeature(id, current ? 1 : 0); // backend gère l'activation unique
            fetchData();
        } catch (error) {
            toast.error("Impossible de changer le statut actif.");
        }
    };


    const addNewFeature = () => {
        setInitialValues(undefined);
        setOpen(true);
    };

    const editFeature = (feature: Feature) => {
        setInitialValues(feature);
        setOpen(true);
    };

    const deleteFeatureAPI = async (id: number) => {
        setSelectedId(id);
        setDialogOpen(true);
    };


    // Delete Realisation deleteProduct
    const handleDeleteClick = async (id: number): Promise<void> => {
        try {
            const response = await deleteFeature(id);
            if (response.statusCode === 200) {
                toast.success("Feature supprimé !");
                fetchData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression du Feature.");
        }
    };

    return (

        <>

            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <button onClick={addNewFeature}  className="px-4 py-1.5 bg-brand-primary2 text-white rounded-lg font-semibold hover:bg-brand-secondary2 transition" >
                        + Créer une caractéristique
                    </button>
                </div>

                {featuresList.length === 0 && <p className="text-gray-500">Aucune fonctionnalité disponible.</p>}

                {featuresList.map((feature) => {
                    const activeImage = getActiveImage(feature);
                    const isActive = Number(feature.active) === 1; // 0 ou 1 → boolean

                    return (
                        <div key={feature.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-lg shadow-sm transition-all"  >
                            {/* Image */}
                            <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {feature.image && (
                                    <Image src={`${urlImages}/${feature.image}`} alt={feature.title} fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, 128px"
                                        unoptimized
                                    />
                                )}
                                {isActive && (
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            ★ Actif
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start sm:items-center">
                                    <div>
                                        <h3 className="font-semibold text-sm md:text-base truncate">{feature.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1">Position: {feature.order}</p>

                                        {feature.description && (<p className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: feature.description }} />)}

                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="flex gap-2">
                                        <button className="p-1 hover:bg-gray-100 rounded" onClick={() => editFeature(feature)}>
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-100 rounded" onClick={() => deleteFeatureAPI(feature.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="mt-3 flex flex-wrap gap-4 items-center">
                                    {/* Statut */}
                                    <div className="flex items-center">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={String(feature.active) === "1"} // 0 ou 1
                                                onChange={() => handleToggleActive(feature.id, feature.active)}
                                            />
                                            <div className="relative w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-800"></div>
                                            <span className="select-none ms-2 text-sm font-medium">
                                                {String(feature.active) === "1" ? "Actif" : "Inactif"}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}

            </div>


            {/* Modal pour créer / éditer */}
            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <FeatureForm
                    featureData={initialValues}
                    onClose={() => setOpen(false)}
                    fetchData={fetchData}
                    isOpen={open}
                />
            </MyModal>

            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (selectedId) handleDeleteClick(selectedId); }} />


        </>
    );
}
