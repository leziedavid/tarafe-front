"use client";

import { useEffect, useState } from "react";
import { FinalCTA } from "@/types/interfaces";
import MyModal from "../modal/MyModal";
import DeleteDialog from "../modal/DeleteDialog";
import FinalCTAForm from "../form/FinalCTAForm";
import { activateFinalCTA, deleteFinalCTA, getAllFinalCTA } from "@/service/managementServices";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";


export default function FinalCTAManagement() {

    const [ctaList, setCtaList] = useState<FinalCTA[]>([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<FinalCTA | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const fetchData = async () => {
        const response = await getAllFinalCTA();
        if (response.statusCode === 200 && response.data) {
            setCtaList(response.data.data);
        } else {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    // Delete Realisation deleteProduct
    const handleDeleteClick = async (id: number): Promise<void> => {
        try {
            const response = await deleteFinalCTA(id);
            if (response.statusCode === 200) {
                toast.success("CTA supprimé !");
                fetchData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression du CTA.");
        }
    };


    const handleToggleActive = async (id: number, current: number | boolean) => {
        try {
            await activateFinalCTA(id, current ? 1 : 0); // backend gère l'activation unique
            fetchData();
        } catch (error) {
            toast.error("Impossible de changer le statut actif.");
        }
    };

    const addNewCTA = () => {
        setInitialValues(undefined);
        setOpen(true);
    };

    const editCard = (cta: FinalCTA) => {
        setInitialValues(cta);
        setOpen(true);
    };

    const deleteCTA = (id: number) => {
        setSelectedId(id);
        setDialogOpen(true);
    };


    return (
        <>

            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <button onClick={addNewCTA} className="px-4 py-1.5 bg-brand-primary2 text-white rounded-lg font-semibold hover:bg-brand-secondary2 transition" >
                        + Créer une nouvelle CTA
                    </button>
                </div>

                {ctaList.length === 0 && <p className="text-gray-500">Aucune CTA finale disponible.</p>}

                {ctaList.map((cta) => (
                    <div key={cta.id} className="flex flex-col sm:flex-row justify-between gap-3 p-4 bg-white rounded-lg shadow-sm transition-all" >

                        {/* Contenu */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start sm:items-center">
                                <div>
                                    <h3 className="font-semibold text-sm md:text-base truncate">{cta.title}</h3>
                                    {cta.description && (<p className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: cta.description }} />)}

                                </div>

                                {/* Boutons d'action */}
                                <div className="flex gap-2">
                                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => editCard(cta)}>
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => deleteCTA(cta.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                           {/* Toggles */}
                            <div className="mt-3 flex flex-wrap gap-4 items-center">
                                {/* Statut */}
                                <div className="flex items-center">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={String(cta.active) === "1"}  onChange={() => handleToggleActive(cta.id, cta.active)}/>
                                        <div className="relative w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-800"></div>
                                        <span className="select-none ms-2 text-sm font-medium">
                                            {String(cta.active) === "1" ? "Actif" : "Inactif"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal pour créer / éditer */}
            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <FinalCTAForm
                    ctaData={initialValues}
                    onClose={() => setOpen(false)}
                    fetchData={fetchData}
                    isOpen={open}
                />
            </MyModal>

            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (selectedId) handleDeleteClick(selectedId); }} />

        </>

    );
}
