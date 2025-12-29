// app/admin/stores/page.tsx
"use client";

import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import Image from "next/image";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Store } from "@/types/interfaces";
import { fakeStores } from "@/data/fakeStores";
import MyModal from "@/components/modal/MyModal";
import StoreForm from "@/components/form/StoreForm";
import { toast } from "sonner";
import { createStore, deleteStore, getAllStores, updateStore } from "@/service/storeServices";
import { getImagesUrl } from "@/types/baseUrl";
import DeleteDialog from "@/components/modal/DeleteDialog";

export default function StoresPage() {

    const [stores, setStores] = useState<Store[]>([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<Store | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [idStore, setIdStore] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [isReady, setIsReady] = useState(false);
    const urlImages = getImagesUrl();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const fetchData = async () => {
        const response = await getAllStores();
        if (response.statusCode === 200 && response.data) {
            setStores(response.data.data);
            setCurrentPage(response.data.page);
            setTotalItems(response.data.total);
            setIsReady(true);
        } else {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const handleDeleteClick = async (id: number): Promise<void> => {
        const response = await deleteStore(Number(id));
        if (response.statusCode === 200 && response.data) {
            toast.success("Store supprimé avec succès !");
            fetchData();
        } else {
            toast.error(response.message);
            fetchData();
        }
    };


    const deleteStores = (id: number) => {
        setIdStore(id);
        setDialogOpen(true);
    };

    const toggleActive = (id: number) => {
        setStores(prev => prev.map(store => store.id === id ? { ...store, active: store.active === 1 ? 0 : 1 } : store)
        );
    };

    const AddStores = (store: Store) => {
        setIdStore(store.id);
        setOpen(true);
        setInitialValues(store);
    }

    const handleSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        console.log("Données du formulaire à soumettre :");
        // Utilisation de for...of pour parcourir FormData
        for (const [key, value] of data.entries()) {
            console.log(key, value);
        }

        try {
            let result;

            if (idStore) {
                // Mise à jour
                result = await updateStore(idStore, data);
                if (result.statusCode === 200) {
                    toast.success("Store mis à jour avec succès !");
                    fetchData();
                    setOpen(false);
                } else {
                    toast.error("Erreur lors de la mise à jour.");
                }
            } else {
                // Création
                result = await createStore(data);
                if (result.statusCode === 200) {
                    toast.success("Store créé avec succès !");
                    fetchData();
                    setOpen(false);
                } else {
                    toast.error("Erreur lors de la création.");
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'opération:", error);
            toast.error("Une erreur est survenue lors de la création ou mise à jour du store");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Stores</h1>
                    <button onClick={() => AddStores({} as Store)} className="bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Nouveau Store
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {stores.map(store => (
                        <div key={store.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden p-4 flex flex-col justify-between">
                            <div>
                                <div className="relative h-32 w-full mb-4">
                                    {store.logo && (
                                        <Image src={`${urlImages}/${store.logo}`} alt={store.name} fill className="object-cover rounded-md" sizes="(max-width: 340px) 50vw, 25vw" unoptimized />
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">Slug: {store.slug}</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                {/* Switch actif/inactif cliquable */}
                                <label
                                    className="flex items-center gap-3 cursor-pointer select-none"
                                    onClick={() => toggleActive(store.id)}
                                >
                                    <div
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${store.active ? "bg-brand-primary" : "bg-brand-secondary"
                                            }`}
                                    >
                                        <span
                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${store.active ? "translate-x-6" : "translate-x-0"
                                                }`}
                                        ></span>
                                    </div>
                                    <span className={`text-sm font-medium ${store.active ? "text-brand-primary" : "text-gray-500"}`}>
                                        {store.active ? "Actif" : "Inactif"}
                                    </span>
                                </label>

                                <div className="flex gap-2">
                                    <button onClick={() => AddStores(store)} className="p-2 hover:bg-gray-100 rounded" title="Voir">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => AddStores(store)} className="p-2 hover:bg-gray-100 rounded" title="Éditer">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded" title="Supprimer" onClick={() => handleDeleteClick(store.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <StoreForm
                    initialValue={initialValues}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    onClose={() => setOpen(false)}
                    currentUserId={21}
                />
            </MyModal>

            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (idStore) handleDeleteClick(idStore); }} />


        </AdminLayout>
    );
}
