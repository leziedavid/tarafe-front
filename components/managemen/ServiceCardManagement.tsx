"use client";

import { useEffect, useState } from "react";
import { ServiceCard } from "@/types/interfaces";
import { Eye, Edit, Trash2 } from "lucide-react";
import { activateServiceCard, deleteServiceCard, getAllServiceCards } from "@/service/managementServices";
import { toast } from "sonner";
import MyModal from "../modal/MyModal";
import DeleteDialog from "../modal/DeleteDialog";
import ServiceCardForm from "../form/ServiceCardForm";


export default function ServiceCardManagement() {

    const [cardList, setCardList] = useState<ServiceCard[]>([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<ServiceCard | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);


    const fetchData = async () => {

        const response = await getAllServiceCards();
        if (response.statusCode === 200 && response.data) {
            setCardList(response.data.data);
        } else {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleActive = async (id: number, current: number | boolean) => {
        try {
            await activateServiceCard(id, current ? 1 : 0); // backend gère l'activation unique
            fetchData();
        } catch (error) {
            toast.error("Impossible de changer le statut actif.");
        }
    };

    const addNewCard = () => {
        setInitialValues(undefined);
        setOpen(true);
    };

    const editCard = (card: ServiceCard) => {
        setInitialValues(card);
        setOpen(true);
    }


    const handleDeleteClick = async (id: number): Promise<void> => {
        try {
            const response = await deleteServiceCard(id);
            if (response.statusCode === 200) {
                toast.success("ServiceCard supprimé !");
                fetchData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression du ServiceCard.");
        }
    };

    const deleteCard = (id: number) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    return (

        <>


            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <button onClick={addNewCard}  className="px-4 py-1.5 bg-brand-primary2 text-white rounded-lg font-semibold hover:bg-brand-secondary2 transition" >
                        + Créer un  Service
                    </button>
                </div>

                {cardList.length === 0 && <p className="text-gray-500">Aucune carte de service disponible.</p>}

                {cardList.map((card) => (
                    <div key={card.id} className="flex flex-col sm:flex-row justify-between gap-3 p-4 bg-white rounded-lg shadow-sm transition-all" >


                        {/* Contenu */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start sm:items-center">
                                <div>
                                    <h3 className="font-semibold text-sm md:text-base truncate">{card.title}</h3>
                                    {card.description && (<p className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: card.description }} />)}

                                </div>

                                {/* Boutons d'action */}
                                <div className="flex gap-2">
                                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => editCard(card)}>
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => deleteCard(card.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="mt-3 flex flex-wrap gap-4 items-center">
                                {/* Statut */}
                                <div className="flex items-center">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={String(card.is_active) === "1"} // 0 ou 1
                                            onChange={() => handleToggleActive(card.id, card.is_active)}
                                        />
                                        <div className="relative w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-800"></div>
                                        <span className="select-none ms-2 text-sm font-medium">
                                            {String(card.is_active) === "1" ? "Actif" : "Inactif"}
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
                <ServiceCardForm
                    cardData={initialValues}
                    onClose={() => setOpen(false)}
                    fetchData={fetchData}
                    isOpen={open}
                />
            </MyModal>

            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (selectedId) handleDeleteClick(selectedId); }} />

        </>

    );

}
