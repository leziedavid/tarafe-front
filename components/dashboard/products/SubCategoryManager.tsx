"use client";

import React, { useEffect, useState } from "react";
import { CategoryProduct, SubCategoryProduct } from "@/types/interfaces";
import { Table } from "@/components/table/tables/table";
import { toast } from "sonner";
import { SubCategoryProductColumns } from "@/components/table/columns/tableColumns";
import { deleteSubCategory, getAllCategoriesIn, getAllSubCategories } from "@/service/categoryServices";
import MyModal from "@/components/modal/MyModal";
import SubCategoryForm from "@/components/form/SubCategoryForm";
import DeleteDialog from "@/components/modal/DeleteDialog";


export default function SubCategoryManager() {

    const [subCategories, setSubCategories] = useState<SubCategoryProduct[]>([]);
    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<SubCategoryProduct | undefined>(undefined);
    const [idCategory, setIdCategory] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const fetchSubCategories = async () => {
        try {
            setLoading(true);

            const response = await getAllSubCategories(currentPage, limit);
            if (response.statusCode === 200 && response.data) {
                setSubCategories(response.data.data || []);
                setTotalItems(response.data.total || 0);
            } else {
                toast.error(response.message || 'Erreur lors du chargement');
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des sous-catégories");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSubCategories();
        fetchAllCategoriesIn()
    }, [currentPage, limit]);


    const fetchAllCategoriesIn = async () => {
        try {
            setLoading(true);

            const response = await getAllCategoriesIn();
            if (response.statusCode === 200 && response.data) {
                setCategories(response.data || []);
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
        fetchAllCategoriesIn()
    }, []);


    const addCategory = (category: SubCategoryProduct) => {
        setIdCategory(category.id);
        setOpen(true);
        setInitialValues(category);
    }


    const deleteMyCategory = (row: SubCategoryProduct) => {
        setIdCategory(row.id);
        setDialogOpen(true);
    };


    const handleDeleteClick = async (id: number): Promise<void> => {
        const response = await deleteSubCategory(Number(id));
        if (response.statusCode === 200 && response.data) {
            toast.success("Store supprimé avec succès !");
            fetchSubCategories();
        } else {
            toast.error(response.message);
            fetchSubCategories();
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
                <h2 className="text-2xl font-bold">Sous-catégories</h2>
                <button onClick={() => { setInitialValues(undefined); setOpen(true); }} className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Ajouter une sous-catégorie</button>
            </div>

            <Table<SubCategoryProduct>
                data={subCategories}
                columns={SubCategoryProductColumns()}
                getRowId={(subCategories) => subCategories.id}
                onDelete={deleteMyCategory}
                onUpdate={addCategory}
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
            />

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <SubCategoryForm
                    initialValues={initialValues} // <-- passer l'objet directement
                    onClose={() => setOpen(false)}
                    onSubmitSuccess={fetchSubCategories} // pour rafraîchir la liste après création/modification
                    categoryOptions={categories} />
            </MyModal>


            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (idCategory) handleDeleteClick(idCategory); }} />

        </div>
    );
}
