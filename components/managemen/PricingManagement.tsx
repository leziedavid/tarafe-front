"use client";

import { useEffect, useState } from "react";
import { Pricing } from "@/types/interfaces";
import { Icon } from "@iconify/react";
import { activatePricing, getAllPricing, deletePricing } from "@/service/managementServices";
import { getImagesUrl } from "@/types/baseUrl";
import { toast } from "sonner";
import MyModal from "../modal/MyModal";
import PricingForm from "../form/PricingForm";
import DeleteDialog from "../modal/DeleteDialog";
import ImagePreview from "../shared/ImagePreview";
import Image from "next/image";

export default function PricingManagement() {
    const [pricingList, setPricingList] = useState<Pricing[]>([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<Pricing | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedPricingFiles, setSelectedPricingFiles] = useState<any[]>([]);
    const [initialIndex, setInitialIndex] = useState<number | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const urlImages = getImagesUrl();

    const fetchData = async () => {
        try {
            const response = await getAllPricing();
            if (response.statusCode === 200 && response.data) {
                setPricingList(Array.isArray(response.data.data) ? response.data.data : []);
            } else {
                setPricingList([]);
                if (response.message) toast.error(response.message);
            }
        } catch (error) {
            setPricingList([]);
            toast.error("Erreur lors de la récupération des tarifs.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addNewPricing = () => {
        setInitialValues(undefined);
        setOpen(true);
    };

    const editPricing = (pricing: Pricing) => {
        setInitialValues(pricing);
        setOpen(true);
    };

    const handleDeleteRequest = (id: number) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    const handleToggleActive = async (id: number, currentStatus: number) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            await activatePricing(id, newStatus);
            fetchData();
            toast.success("Statut mis à jour !");
        } catch (error) {
            toast.error("Impossible de changer le statut.");
        }
    };

    const confirmDelete = async () => {
        if (!selectedId) return;
        try {
            const response = await deletePricing(selectedId);
            if (response.statusCode === 200) {
                toast.success("Tarif supprimé !");
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
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Gestion des Tarifs</h3>
                        <p className="text-xs text-gray-500">Gérez les prix affichés sur la plateforme</p>
                    </div>
                    <button onClick={addNewPricing} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary2 text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
                        <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                        Ajouter un Tarif
                    </button>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-950 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Produit</th>
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] text-center">Quantité</th>
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] text-right">Prix</th>
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] text-center">Statut</th>
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {(!pricingList || pricingList.length === 0) ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-gray-400 italic">
                                            Aucun tarif trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    pricingList.map((pricing: Pricing) => (
                                        <tr key={pricing.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    {pricing.files && pricing.files.length > 0 ? (
                                                        <div className="w-10 h-10 flex-shrink-0 cursor-pointer hover:opacity-80 transition-all group/img relative overflow-hidden rounded-lg shadow-sm"
                                                            onClick={() => {
                                                                setSelectedPricingFiles(pricing.files || []);
                                                                setInitialIndex(0);
                                                                setPreviewOpen(true);
                                                            }} >
                                                            <Image src={`${urlImages}/${pricing.files[0].file_path}`} alt={pricing.files[0].file_path} fill className="object-contain p-2" unoptimized />
                                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                                <Icon icon="solar:eye-bold" className="w-3 h-3 text-white" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                                            <Icon icon="solar:box-bold" className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">{pricing.product_name}</div>
                                                        {pricing.description && <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{pricing.description}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">{pricing.quantity}</span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="text-sm font-bold text-brand-secondary">{pricing.unit_price}</div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button onClick={() => handleToggleActive(pricing.id, pricing.is_active)} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${pricing.is_active === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`} >
                                                    {pricing.is_active === 1 ? 'Actif' : 'Inactif'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => editPricing(pricing)} className="p-1.5 hover:bg-brand-primary2/10 rounded-md text-brand-primary2 transition" title="Modifier">
                                                        <Icon icon="solar:pen-new-square-bold-duotone" className="w-4.5 h-4.5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteRequest(pricing.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-red-500 transition" title="Supprimer">
                                                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-4.5 h-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <PricingForm
                    pricingData={initialValues}
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

            {
                previewOpen && selectedPricingFiles && (
                    <ImagePreview
                        data={selectedPricingFiles}
                        imageKey="file_path"
                        initialIndex={initialIndex}
                        onClose={() => {
                            setPreviewOpen(false);
                            setInitialIndex(null);
                        }}
                    />
                )
            }
        </>
    );
}
