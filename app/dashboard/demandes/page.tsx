"use client";

import React, { useState, useEffect } from "react";

import { Table } from "@/components/table/tables/table";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { Demande } from "@/types/interfaces";
import { DemandesColumns } from "@/components/table/columns/tableColumns";
import { getAllDemandes } from "@/service/demandeServices";

export default function Page() {

    const [myDemandes, setMyDemandes] = useState<Demande[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);


    const getMyDemandes = async () => {
        setIsReady(false); // afficher le loader
        try {
            const response = await getAllDemandes(currentPage, limit);
            if (response.statusCode === 200 && response.data) {
                setMyDemandes(response.data.data)
                setCurrentPage(response.data.page);
                setTotalItems(response.data.total);
                setIsReady(true);
            }
        } catch (error) {
            // console.error("Erreur lors de la récupération des demandes :");
        }
    };


    // Simuler le chargement
    useEffect(() => {
        getMyDemandes();
    }, [currentPage, limit]);

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (item: Demande) => { };

    const handleUpdate = (user: Demande) => { };

    const handleDeleteMultiple = (user: Demande[]) => {
        console.log("🧹 Supprimer plusieurs:", user);
    };

    if (!isReady) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="loader border-4 border-b-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-full mx-auto px-4 py-12">
                {/* Ici ton composant de liste de services */}
                <div className="w-full p-4">
                    <h1 className="text-3xl font-bold mb-2">Gestion des demandes</h1>
                </div>

                <div className="w-full p-4">
                    <Table<Demande>
                        data={myDemandes.slice((currentPage - 1) * limit, currentPage * limit)}
                        columns={DemandesColumns()}
                        getRowId={(demandes) => demandes.id}   // ✅ OBLIGATOIRE
                        enableMultiple={true}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        onDeleteMultiple={handleDeleteMultiple}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={limit}
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
