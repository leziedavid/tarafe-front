"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Partenaire } from "@/types/interfaces";
import { Icon } from "@iconify/react";
import { getImagesUrl } from "@/types/baseUrl";
import { activatePartner, getAllPartners, deletePartner as deletePartnerAPI } from "@/service/managementServices";
import { toast } from "sonner";
import MyModal from "../modal/MyModal";
import PartnerForm from "../form/PartnerForm";
import DeleteDialog from "../modal/DeleteDialog";

export default function PartnersManagement() {
    const urlImages = getImagesUrl();
    const [partnerList, setPartnerList] = useState<Partenaire[]>([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<Partenaire | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const response = await getAllPartners();
            if (response.statusCode === 200 && response.data) {
                setPartnerList(response.data.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération des partenaires.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addNewPartner = () => {
        setInitialValues(undefined);
        setOpen(true);
    };

    const editPartner = (partner: Partenaire) => {
        setInitialValues(partner);
        setOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        setSelectedId(Number(id));
        setDialogOpen(true);
    };

    const handleToggleActive = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === "1" ? 0 : 1;
            await activatePartner(Number(id), newStatus);
            fetchData();
            toast.success("Statut mis à jour !");
        } catch (error) {
            toast.error("Impossible de changer le statut.");
        }
    };

    const confirmDelete = async () => {
        if (!selectedId) return;
        try {
            const response = await deletePartnerAPI(selectedId);
            if (response.statusCode === 200) {
                toast.success("Partenaire supprimé !");
                fetchData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression.");
        } finally {
            setDialogOpen(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <button onClick={addNewPartner} className="px-4 py-1.5 bg-brand-primary2 text-white rounded-lg font-semibold hover:bg-brand-secondary2 transition">
                        + Ajouter un Partenaire
                    </button>
                </div>

                {partnerList.length === 0 && <p className="text-gray-500">Aucun partenaire disponible.</p>}

                {partnerList.map((partner) => {

                    const isActive = partner.status_partenaires === "1";

                    return (
                        <div key={partner.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm transition-all border border-gray-100">
                            {/* Image */}
                            <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border">

                                {partner.path_partenaires && (
                                    <>
                                        <Image src={`${urlImages}/${partner.path_partenaires}`} alt={partner.libelle_partenaires} fill className="object-contain p-2" unoptimized />
                                    </>
                                )}

                                {isActive && (
                                    <div className="absolute top-2 left-2">
                                        <span className="bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            ★ Actif
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate text-lg">{partner.libelle_partenaires}</h3>
                                        <p className="text-xs text-gray-400 mt-1 italic">ID: {partner.id}</p>
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => editPartner(partner)}
                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                            title="Modifier"
                                        >
                                            <Icon icon="solar:pen-new-square-bold" className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRequest(partner.id)}
                                            className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors"
                                            title="Supprimer"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Toggle Statut */}
                                <div className="mt-4 flex items-center">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isActive}
                                            onChange={() => handleToggleActive(partner.id, partner.status_partenaires)}
                                        />
                                        <div className="relative w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                        <span className="ms-3 text-sm font-semibold text-gray-700">
                                            {isActive ? "Partenaire visible" : "Partenaire masqué"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <PartnerForm
                    partnerData={initialValues}
                    onClose={() => setOpen(false)}
                    fetchData={fetchData}
                    isOpen={open}
                />
            </MyModal>

            <DeleteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={confirmDelete}
            />
        </>
    );
}
