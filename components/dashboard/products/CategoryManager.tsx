"use client";

import React, { useEffect, useState } from "react";
import { CategoryProduct } from "@/types/interfaces";
import { Table } from "@/components/table/tables/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CategoryProductColumns } from "@/components/table/columns/tableColumns";
import MyModal from "@/components/modal/MyModal";
import CategoryForm from "@/components/form/CategoryForm";
import DeleteDialog from "@/components/modal/DeleteDialog";
import { deleteCategory, getAllCategories } from "@/service/categoryServices";


export default function CategoryManager() {

    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<CategoryProduct | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [idCategory, setIdCategory] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [isReady, setIsReady] = useState(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);


    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getAllCategories(currentPage, limit);
            if (response.statusCode === 200 && response.data) {
                setCategories(response.data.data || []);
                setTotalItems(response.data.total || 0);

            } else {
                toast.error(response.message || 'Erreur lors du chargement');
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des catégories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [currentPage, limit]);


    const addCategory = (category: CategoryProduct) => {
        setIdCategory(category.id);
        setOpen(true);
        setInitialValues(category);
    }


    const deleteMyCategory = (row: CategoryProduct) => {
        setIdCategory(row.id);
        setDialogOpen(true);
    };

    const handleDeleteClick = async (id: number): Promise<void> => {
        const response = await deleteCategory(Number(id));
        if (response.statusCode === 200 && response.data) {
            toast.success("Store supprimé avec succès !");
            fetchCategories();
        } else {
            toast.error(response.message);
            fetchCategories();
        }
    };


    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Catégories de produits</h2>
                <button onClick={() => addCategory({} as CategoryProduct)} className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Ajouter une catégorie</button>
            </div>

            <Table<CategoryProduct>
                data={categories}
                columns={CategoryProductColumns()}
                getRowId={(categories) => categories.id}
                onDelete={deleteMyCategory}
                onUpdate={addCategory}
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
            />


            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <CategoryForm
                    initialValues={initialValues} // <-- passer l'objet directement
                    onClose={() => setOpen(false)}
                    onSubmitSuccess={fetchCategories} // pour rafraîchir la liste après création/modification
                />
            </MyModal>


            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (idCategory) handleDeleteClick(idCategory); }} />

        </div>
    );
}
