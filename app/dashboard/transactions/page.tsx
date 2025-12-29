"use client";

import React, { useState, useEffect, useTransition } from "react";

import { Table } from "@/components/table/tables/table";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { CategorieTransaction, Demande, GraphData, OrderDetails, TotalTransaction, Transaction } from "@/types/interfaces";
import { TransactionsColumns } from "@/components/table/columns/tableColumns";
import { deleteTransaction, DownloadFiles, fetchCategorieTransaction, getAlltransactions, getAllTransactionTotals, getdetailCommandes, getTransactionDataGraphe } from "@/service/transactionServices";
import { Filters } from "@/types/Filters";
import { toast } from "sonner";
import MyModal from "@/components/modal/MyModal";
import CategorieTransForm from "@/components/form/CategorieTransForm";
import { BarGraph } from './bar-graph';
import { AreaGraph } from './area-graph';
import { PieGraph } from './pie-graph';
import { Download, Heading, List, Upload } from "lucide-react";
import { Button } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Select2 } from "@/components/form/Select2";
import { CalendarDateRangePicker } from "@/components/form/date-range-picker";
import { cn } from "@/lib/utils";
import DeleteDialog from "@/components/modal/DeleteDialog";
import ImportData from "@/components/modal/ImportData";
import TransacModal from "@/components/modal/TransacModal";

export default function Page() {

    const [isReady, setIsReady] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [search, setSearch] = useState(''); // Recherche
    const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [open, setOpen] = useState(false)

    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
    const [donnees, setTransaction] = useState<Transaction[]>([]); // Données des commandes
    const [listecategorie, seListecategorie] = useState<CategorieTransaction[]>([]); // Données des commandes
    const [total, setTotal] = useState<TotalTransaction | null>(null); // Initialiser avec null pour indiquer qu'il n'y a pas encore de données
    const [isLoading, startTransition] = useTransition();

    // Corriger les initialisations des états
    const [category, setCategory] = useState<string | null>(null);
    const [payment, setPayment] = useState<string | null>(null);
    const [selectedYears, setSelectedYears] = useState<string | null>(null);
    const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);

    const [barGraphByDate, setBarGraphByDate] = useState<GraphData[]>([]);
    const [barGraphByTypeOperation, setBarGraphByTypeOperation] = useState<GraphData[]>([]);
    const [barGraphByCategorieTransactions, setBarGraphByCategorieTransactions] = useState<GraphData[]>([]);

    const [pieGraphByDate, setPieGraphByDate] = useState<GraphData[]>([]);
    const [pieGraphByTypeOperation, setPieGraphByTypeOperation] = useState<GraphData[]>([]);
    const [pieGraphByCategorieTransactions, setPieGraphByCategorieTransactions] = useState<GraphData[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isFormUpdateOpen, setIsUpdateFormOpen] = useState(false);
    const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<Transaction>();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);


    // Fonction pour générer les années depuis 2010 jusqu'à l'année actuelle
    const getYears = (): string[] => {
        const currentYear = new Date().getFullYear();
        const years: string[] = []; // Déclare le tableau des années
        for (let year = 2010; year <= currentYear; year++) {
            years.push(year.toString());
        }
        return years;
    };

    // Types de transactions possibles
    const transactionTypes = [
        { value: 'sortie_caisse', label: 'Sortie Caisse' },
        { value: 'sortie_banque', label: 'Sortie Banque' },
        { value: 'entree_caisse', label: 'Entrée Caisse' },
        { value: 'entree_banque', label: 'Entrée Banque' }
    ];

    // Types de paiement possibles
    const paymentTypes = [
        { value: 'wave', label: 'Wave' },
        { value: 'orange Money', label: 'Orange money' },
        { value: 'moov Money', label: 'Moov money' },
        { value: 'espèces', label: 'Espèces' },
        { value: 'chèque', label: 'Chèque' },
        { value: 'virement', label: 'Virement' }
    ];


    const handleCategoryChange = (selected: string | null) => {
        setCategory(selected);
    };

    const handlePaymentChange = (selected: string | null) => {
        setPayment(selected);
    };

    const handleCategorieChange = (selected: string | null) => {
        setSelectedCategorie(selected);
    };

    const handleYearChange = (selected: string | null) => {
        setSelectedYears(selected);
    };


    // Fonction pour récupérer les données avec les filtres
    const fetchData = async () => {
        const filters: Filters = { page: currentPage, limit: 10, search: search || undefined, };

        const response = await getAlltransactions(filters, category, payment, selectedYears, selectedCategorie);

        if (response.statusCode === 200 && response.data) {
            setTransaction(response.data.data); // Mettre à jour les commandes
            // setCurrentPage(response.data.page);
            // setTotalItems(response.data.total);
            setTotalItems(response.data.total || 0);
            setIsReady(true);
        } else {
            toast.error(response.message);
        };
    };

    // Fonction pour récupérer les données des graphiques
    const fetchGraphData = async () => {
        const filters: Filters = { page: currentPage, limit: 10, search: search || undefined };

        try {
            const result = await getTransactionDataGraphe(filters, category, payment, selectedYears, selectedCategorie);

            if (result.statusCode === 200 && result.data) {

                setBarGraphByDate(result.data.BarGraphByDate);
                setBarGraphByTypeOperation(result.data.BarGraphByTypeOperation);
                setBarGraphByCategorieTransactions(result.data.BarGraphByCategorieTransactions);
                setPieGraphByDate(result.data.PieGraphByDate);
                setPieGraphByTypeOperation(result.data.PieGraphByTypeOperation);
                setPieGraphByCategorieTransactions(result.data.PieGraphByCategorieTransactions);

            } else {
                toast.error(result.message); // Afficher une erreur si le statut n'est pas 200
            }
        } catch (error) {

            // toast.error('Erreur lors de la récupération des données des graphiques.');
        }
    };

    const chargerCategories = async () => {
        try {
            const result = await fetchCategorieTransaction(); // Renomme ici si ton service a un nom différent
            if (result.statusCode == 200 && result.data) {
                seListecategorie(result.data)

            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération des catégories.");
        }
    };

    const getTransactionTotal = async () => {
        const filters: Filters = { page: currentPage, limit: 10, search: search || undefined, };
        const response = await getAllTransactionTotals(filters, category, payment, selectedYears);
        if (response.statusCode === 200 && response.data) {
            setTotal(response.data.totals); // Mettre à jour les commandes

        } else {
            toast.error(response.message);
        }
    };

    const Downloads = async () => {
        // Utilisation de l'opérateur ?? qui retourne la droite seulement si gauche est null ou undefined
        const pageToUse = currentPage ?? 1;
        const filters: Filters = { page: pageToUse, limit: 10, search: search || undefined, };
        const response = await DownloadFiles(filters, category ?? null, payment ?? null, selectedYears ?? null);

        if (response.statusCode === 200 && response.data) {
            toast.success("Fichier téléchargé avec succès !");
            window.open(response.data.url, '_blank');
        } else {
            toast.error(response.message);
        }
    };

    const isDataEmpty = !donnees || donnees.length <= 0;

    // Callback pour mettre à jour `search` avec la plage de dates sélectionnée
    const handleDateRangeChange = (formattedDateRange: string) => {
        setSearch(formattedDateRange);
    };

    useEffect(() => {
        fetchData(); fetchGraphData(); getTransactionTotal(); chargerCategories();
    }, [currentPage, search, category, payment, selectedYears, selectedCategorie]);

    const openOrderDetails = async (orderId: number) => {
        try {
            const details = await getdetailCommandes(orderId);
            setOrderDetails(details.data);

        } catch (error) {

        }

    };



    function handleUpdate(row: any) {
        setIsUpdateFormOpen(true);
        setIsDialogOpen(false);
        setIsFormOpen(false);
        setOpen(true);
        setInitialValues(row)
    }

    const openCategorieForm = () => {
        setIsFormOpen(true);
        setIsDialogOpen(false);
        setOpen(true);
    };

    const openImportDialog = () => {
        setIsDialogOpen(true);
        setIsFormOpen(false);
        setOpen(true);
    };

    const closeAllModals = () => {
        setIsDialogOpen(false);
        setIsFormOpen(false);
        setOpen(false);
        setIsUpdateFormOpen(false);
    };


    // Gestion des actions (peut-être adapté selon ta logique)
    function handleChangeState(row: any, newStates: string[]) {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    }


    function closehandleUpdate() {
        setIsUpdateFormOpen(false);
    }
    async function handleDelete(row: any) {
        setSelectedId(row.id);
        setDialogOpen(true);
    }

    const handleDeleteClick = async (id: string): Promise<void> => {
        const response = await deleteTransaction(Number(id));
        if (response.statusCode === 200 && response.data) {
            toast.success("Transaction supprimé avec succès !");
            fetchData();
        } else {
            toast.error(response.message);
            fetchData();
        }
    };

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };


    const handleDeleteMultiple = (data: Transaction[]) => {
        console.log("🧹 Supprimer plusieurs:", data);
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
        <>

            <AdminLayout>


                <div className="space-y-2 mt-4 mb-2">

                    <div className="grid w-full gap-4 mt-4">

                        {/* Section des critères avec grille responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            <div>
                                <Label className="font-bold mt-4" htmlFor="years">Par années</Label>
                                <Select2
                                    options={getYears().map(year => ({ value: year, label: year }))}
                                    selectedItem={selectedYears}  // Utilisation de selectedItem (singulier)
                                    onSelectionChange={handleYearChange}  // gère la sélection d'un seul item
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.value}
                                    placeholder="Sélectionner une année"
                                    mode="single" // Optionnel car c'est la valeur par défaut

                                />
                            </div>

                            {/* Sélecteur de types de transaction */}
                            <div>
                                <Label className="font-bold mt-4" htmlFor="category">Types de transaction</Label>
                                <Select2
                                    options={transactionTypes}
                                    selectedItem={category}  // Utilisation de selectedItem (singulier)
                                    onSelectionChange={handleCategoryChange}  // gère la sélection d'un seul item
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.value}
                                    placeholder="Sélectionner un type de transaction"
                                    mode="single" // Optionnel car c'est la valeur par défaut

                                />
                            </div>

                            <div>
                                <Label className="font-bold mt-4" htmlFor="payment">Moyen de paiement</Label>
                                <Select2
                                    options={paymentTypes}
                                    selectedItem={payment}  // Utilisation de selectedItem (singulier)
                                    onSelectionChange={handlePaymentChange}  // gère la sélection d'un seul item
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.value}
                                    placeholder="Sélectionner un type de paiement"
                                    mode="single" // Optionnel car c'est la valeur par défaut

                                />
                            </div>


                            <div>
                                <Label className="font-bold mt-4" htmlFor="categorie">Catégorie de transaction</Label>
                                <Select2
                                    options={listecategorie.map(cat => ({ value: cat.id, label: cat.label }))}
                                    selectedItem={selectedCategorie}
                                    onSelectionChange={handleCategorieChange}
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.label}
                                    placeholder="Sélectionner une catégorie"
                                    mode="single" // Optionnel car c'est la valeur par défaut
                                />
                            </div>

                        </div>


                        <div>
                            <Label className="font-bold mt-4" htmlFor="payment">Par tranche de date</Label>
                            <CalendarDateRangePicker className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse', 'mb-4')} onDateChange={handleDateRangeChange} />
                        </div>

                    </div>

                    {/* <pre> {JSON.stringify(total, null, 2)} </pre>  */}

                    <div className="space-y-4">
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Carte Solde Caisse */}
                                <div className="bg-green-700 text-white rounded-lg border p-6">
                                    <div className="flex flex-row items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium">Solde Caisse</h3>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {total?.total_general?.toLocaleString() ?? 0} FCFA
                                    </div>
                                </div>

                                {/* Carte Total Entrée Caisse */}
                                <div className="bg-white rounded-lg border p-6">
                                    <div className="flex flex-row items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium">Total Entrée Caisse</h3>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {total?.total_entree_caisse?.toLocaleString() ?? 0} FCFA
                                    </div>
                                </div>

                                {/* Carte Total Sortie Caisse */}
                                <div className="bg-white rounded-lg border p-6">
                                    <div className="flex flex-row items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium">Total Sortie Caisse</h3>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {total?.total_sortie_caisse?.toLocaleString() ?? 0} FCFA
                                    </div>
                                </div>

                                {/* Carte Total Sortie Banque */}
                                <div className="bg-white rounded-lg border p-6">
                                    <div className="flex flex-row items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium">Total Sortie Banque</h3>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {total?.total_sortie_banque?.toLocaleString() ?? 0} FCFA
                                    </div>
                                </div>


                                {/* Carte Total Sortie Banque */}
                                <div className="bg-white rounded-lg border p-6">
                                    <div className="flex flex-row items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium">Total Entrée Banque</h3>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {total?.total_entree_banque?.toLocaleString() ?? 0} FCFA
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {barGraphByDate?.length > 0 ? (
                            <BarGraph data={barGraphByDate} title="Graphique par date" types="date" />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="bg-muted rounded-md aspect-square" />
                            </div>
                        )}

                        {barGraphByTypeOperation?.length > 0 ? (
                            <BarGraph data={barGraphByTypeOperation} title="Graphique par type d'opération" types="operation" />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="bg-muted rounded-md aspect-square" />
                            </div>
                        )}

                        {barGraphByCategorieTransactions?.length > 0 ? (
                            <BarGraph data={barGraphByCategorieTransactions} title="Graphique par catégories" types="categories" />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="bg-muted rounded-md aspect-square" />
                            </div>
                        )}

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {pieGraphByDate?.length > 0 ? (
                            <PieGraph data={pieGraphByDate as unknown as any} title="Graphique à secteurs par date" />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="bg-muted rounded-md aspect-square" />
                            </div>
                        )}

                        {pieGraphByTypeOperation?.length > 0 ? (
                            <PieGraph data={pieGraphByTypeOperation  as unknown as any} title="Graphique à secteurs par type d'opération" />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="bg-muted rounded-md aspect-square" />
                            </div>
                        )}

                        {pieGraphByCategorieTransactions?.length > 0 ? (
                            <PieGraph data={pieGraphByCategorieTransactions  as unknown as any} title="Graphique à secteurs par catégories" />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="bg-muted rounded-md aspect-square" />
                            </div>
                        )}
                    </div>

                </div>

                <div className="max-w-full mx-auto px-4 py-12">
                    {/* Ici ton composant de liste de services */}
                    {/* Gestion des transactions */}
                    <div className="w-full p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            {/* Titre */}
                            <h1 className="text-3xl font-bold">
                                Gestion des transactions
                            </h1>

                            {/* Actions */}


                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={openCategorieForm}
                                    className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    <List className="w-4 h-4" />
                                    <span>Liste des catégories</span>
                                </button>

                                <button
                                    onClick={openImportDialog}
                                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Importer les transactions</span>
                                </button>


                                <button onClick={Downloads} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"  >
                                    <Download className="w-4 h-4" />
                                    <span>Exporter</span>
                                </button>
                            </div>

                        </div>
                    </div>


                    {/* <pre> {JSON.stringify(donnees, null, 2)} </pre> */}

                    <div className="w-full p-4">
                        <Table<Transaction>
                            data={donnees}
                            columns={TransactionsColumns()}
                            getRowId={(transactions) => transactions.id}   // ✅ OBLIGATOIRE
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


            {isDialogOpen && (
                <MyModal open={open} onClose={closeAllModals} mode="mobile" typeModal="large">
                    <ImportData isOpen={open} onClose={closeAllModals} />
                </MyModal>
            )}

            {isFormOpen && (
                <MyModal open={open} onClose={closeAllModals} mode="mobile" typeModal="large">
                    <CategorieTransForm isOpen={open} onClose={closeAllModals} />
                </MyModal>
            )}


            {isFormUpdateOpen && (
                <MyModal open={open} onClose={closeAllModals} mode="mobile" typeModal="large">
                    <TransacModal isOpen={open} onClose={closeAllModals} fetchData={fetchData} initialValues={initialValues} />
                </MyModal>
            )}


            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (selectedId) handleDeleteClick(selectedId); }} />

        </>
    );
}
