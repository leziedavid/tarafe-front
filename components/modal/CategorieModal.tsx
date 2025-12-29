'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { getBaseUrlImg } from '@/servives/baseUrl';
import { createCategoryTransaction, deleteCategoryTransaction, fetchAllCategorieTransaction, updateCategoryTransaction } from '@/servives/AdminService';
import { toast } from "sonner";
import { CategorieTransaction } from '@/interfaces/AdminInterface';
import React, { useState, useEffect } from 'react';
import { CirclePlus, CircleX, Pencil, Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import DeleteDialog from "@/components/Modals/DeleteDialog";


type OrderDetail = {
    id_orders: number;
    transaction_id: string;
    total: number;
    date_orders: string;
    heurs_orders: string;
    Mode_paiement: string;
    email_orders: string;
    nomUsers_orders: string;
    status_orders: number;
    personnalise: number;
    codeAchat: string;
    NomPrenomAchats: string;
    EntrepriseAchats: string;
    emailAchats: string;
    couleursAchats: string | null;
    texteAchats: string | null;
    PositionsFiles: string;
    policeAchats: string;
    imgLogosAchats: string | null;
    libelle_realisations: string;
    descript_real: string;
    images_realisations: string;
};

type CategorieProps = {
    isOpen: boolean;
    onClose: () => void;
};

const formatStatus = (status: number) => {
    switch (status) {
        case 0:
            return <Badge className="bg-yellow-100 text-yellow-700">En attente</Badge>;
        case 1:
            return <Badge className="bg-green-100 text-green-700">Confirmée</Badge>;
        case 2:
            return <Badge className="bg-blue-100 text-blue-700">Expédiée</Badge>;
        case 3:
            return <Badge className="bg-red-100 text-red-700">Annulée</Badge>;
        default:
            return <Badge>Inconnue</Badge>;
    }
};

export default function CategorieModal({ isOpen, onClose }: CategorieProps) {

    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState<CategorieTransaction[]>([]);
    const [inputs, setInputs] = useState([{ label: '', defautPrice: '' }]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedIndexToDelete, setSelectedIndexToDelete] = useState<number | null>(null);
    const token = 'votre_token'; // Remplace ceci par ton système d'auth
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const itemsPerPage = limit; // pour affichage dans l’UI
    const [search, setSearch] = useState(''); // Recherche
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages

    const [deleteDialog, setDeleteDialogOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    
    const loadCategories = async ( page: number, limit: number, search: string | null) => {

        try {
            const result = await fetchAllCategorieTransaction(token,{ page: page, limit: limit, search: search || undefined });
           setCategories(result.data.data); // Mettre à jour les commandes
          setTotalPages(result.data.last_page); // Mettre à jour le nombre total de pages
          setTotalItems(result.data.total); // Mettre à jour le total des commandes
        } catch (error) {
            toast.error('Erreur lors du chargement des catégories');
        }
    };

    useEffect(() => {

        loadCategories(currentPage, limit, search);
    }, [
        currentPage,
        limit,
        search
    ]);

    const handleAddInput = () => {
        setInputs([...inputs, { label: '', defautPrice: '' }]);
    };

    const handleRemoveInput = (index: number) => {
        const updated = [...inputs];
        updated.splice(index, 1);
        setInputs(updated);
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const updated = [...inputs];
        updated[index][field as 'label' | 'defautPrice'] = value;
        setInputs(updated);
    };

    const handleSubmit = async () => {
        try {
            if (editingIndex !== null) {
                const cat = categories[editingIndex];
                const data = {
                    id: cat.id,
                    label: inputs[0].label,
                    defautPrice: inputs[0].defautPrice,
                };
                const result = await updateCategoryTransaction(token, cat.id, data);
                if (result.statusCode !== 200) {
                    toast.error(result.message);
                } else {
                    toast.success('Catégorie mise à jour');
                    loadCategories(currentPage, limit, search);
                }

            } else {
                const payload = inputs.map((input) => ({
                    label: input.label,
                    defautPrice: input.defautPrice,
                }));
                const result = await createCategoryTransaction(token, payload);
                if (result.statusCode !== 200) {
                    toast.error(result.message);
                    loadCategories(currentPage, limit, search);

                } else {
                    toast.success('Catégories créées');
                    loadCategories(currentPage, limit, search);
                }
            }

            setInputs([{ label: '', defautPrice: '' }]);
            setEditingIndex(null);
            setShowModal(false);
        } catch (err) {
            toast.error('Erreur lors de la soumission');
        }
    };

    const handleEdit = (index: number) => {
        const cat = categories[index];
        setInputs([{ label: cat.label, defautPrice: cat.defautPrice }]);
        setEditingIndex(index);
        setShowModal(true);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedIndexToDelete(id);
        setDialogOpen(true);
    };

    const confirmDelete = async (id: number) => {
        try {
            if (selectedIndexToDelete !== null) {
                const result = await deleteCategoryTransaction(token,id);
                if (result.statusCode !== 200) {
                    toast.error(result.message);
                } else {
                    toast.success('Catégorie supprimée');
                    loadCategories(currentPage, limit, search);
                }
            }
            setShowAlert(false);
            setSelectedIndexToDelete(null);
        } catch (err) {
            toast.error('Erreur lors de la suppression');
        }
    };

    function onPreviousPage() {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    }

    function onNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage((prev) => prev + 1);
        }
    }

    return (

        <>

        <div className={`fixed inset-0 bg-black/50 z-50 ${!isOpen && 'hidden'}`}>
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform ${isOpen ? 'translate-x-0 w-full md:w-[50vw]' : 'translate-x-full'} bg-white dark:bg-gray-800 shadow-xl duration-300 ease-in-out`}
                aria-labelledby="drawer-right-label">
                <h5 className="inline-flex items-center mb-4 text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {editingIndex !== null ? 'Modifier' : 'Créer'} Catégorie(s)
                </h5>

                <Button type="button" className="text-gray-400 bg-red-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => { onClose(); setInputs([{ label: '', defautPrice: '' }]); setEditingIndex(null); }} >
                        X
                    <span className="sr-only">Fermer</span>
                </Button>

                <div className="mt-4 space-y-4">

                    <div className="p-4 md:p-5 space-y-4">
                        {inputs.map((input, index) => (
                            <div key={index} className="flex space-x-2 items-center">
                                <button
                                    onClick={() => handleRemoveInput(index)}
                                    disabled={inputs.length === 1}
                                    className="text-red-600  font-bold px-2"
                                >
                                    <CircleX className='w-4 h-4' />
                                </button>
                                <Input
                                    type="text"
                                    placeholder="Nom de la catégorie"
                                    value={input.label}
                                    onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                                    className="border rounded px-3 py-2 w-1/2"
                                />
                                <Input
                                    type="text"
                                    placeholder="Prix par défaut"
                                    value={input.defautPrice}
                                    onChange={(e) => handleInputChange(index, 'defautPrice', e.target.value)}
                                    className="border rounded px-3 py-2 w-1/2"
                                />
                            </div>
                        ))}
                        {editingIndex === null && (
                            <button onClick={handleAddInput} className=" text-font-bold flex items-center">
                                <CirclePlus className='w-4 h-4 mr-1' />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center p-4 md:p-5 border-t dark:border-gray-600">
                        <Button className="w-full md:w-auto text-white px-5 py-2 rounded mr-2" onClick={handleSubmit}>
                            {editingIndex !== null ? 'Mettre à jour' : 'Créer'}
                        </Button>
                        <button onClick={() => { setShowModal(false); setInputs([{ label: '', defautPrice: '' }]); setEditingIndex(null); }} className="bg-gray-200 px-5 py-2 rounded"  >
                            Annuler
                        </button>
                    </div>


                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((cat, index) => (
                                        <TableRow key={cat.id}>
                                            <TableCell>{cat.id}</TableCell>
                                            <TableCell>{cat.label}</TableCell>
                                            <TableCell>{cat.defautPrice} FCFA</TableCell>
                                            <TableCell className="text-center space-x-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleEdit(index)}
                                                    className="text-gray-400 hover:text-gray-900"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(cat.id)}
                                                    className="text-gray-400 hover:text-gray-900">
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                            Aucune catégorie
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-4">
                        <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                            Page {currentPage} sur {Math.ceil(totalItems / itemsPerPage)}
                        </div>
                        <div className="flex justify-center sm:justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={onPreviousPage} disabled={currentPage <= 1} className="text-xs sm:text-sm" >
                                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Précédent</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={onNextPage} disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)} className="text-xs sm:text-sm" >
                                <span className="hidden sm:inline">Suivant</span>
                                <ChevronRight className="h-4 w-4 sm:ml-1" />
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => {  if (selectedIndexToDelete) confirmDelete(selectedIndexToDelete);}}/>

        </>

    );
}
