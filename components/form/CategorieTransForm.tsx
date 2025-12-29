"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorieTransaction } from "@/types/interfaces";
import {
    fetchAllCategorieTransaction,
    createCategoryTransaction,
    updateCategoryTransaction,
    deleteCategoryTransaction
} from "@/service/transactionServices";
import { Filters } from "@/types/Filters";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CirclePlus,
    CircleX,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import DeleteDialog from "../modal/DeleteDialog";

// ✅ Schémas de validation Zod
const categorieSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    label: z.string() .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    defautPrice: z.string()
        .min(1, "Le prix est requis")
        .regex(/^\d+(\.\d{1,2})?$/, "Format invalide (ex: 10 ou 10.99)"),
});

const categorieBulkSchema = z.array(
    z.object({
        label: z.string()
            .min(2, "Le nom doit contenir au moins 2 caractères")
            .max(100, "Le nom ne peut pas dépasser 100 caractères"),
        defautPrice: z.string()
            .min(1, "Le prix est requis")
            .regex(/^\d+(\.\d{1,2})?$/, "Format invalide (ex: 10 ou 10.99)"),
    })
).min(1, "Au moins une catégorie est requise");

type CategorieFormData = z.infer<typeof categorieSchema>;

interface CategoryInput {
    label: string;
    defautPrice: string;
}

interface CategorieTransFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CategorieTransForm({ isOpen, onClose }: CategorieTransFormProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [categories, setCategories] = useState<CategorieTransaction[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState<CategoryInput[]>([{ label: '', defautPrice: '' }]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [selectedIdToDelete, setSelectedIdToDelete] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errors, setErrors] = useState<Record<number, string[]>>({});

    // Récupérer le token
    const token = localStorage.getItem('token') || '';

    // Formulaire pour validation unique
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors: formErrors },
        reset,
        setValue,
    } = useForm<CategorieFormData>({
        resolver: zodResolver(categorieSchema),
        defaultValues: {
            label: '',
            defautPrice: '',
        }
    });

    // Charger les catégories
    const loadCategories = async (page: number, limit: number, search: string = '') => {
        setLoading(true);
        try {
            const filters: Filters = {
                page,
                limit,
                search: search || undefined
            };

            const response = await fetchAllCategorieTransaction(filters);

            if (response.statusCode === 200 && response.data) {
                setCategories(response.data.data || []);
                setTotalItems(response.data.total || 0);
            } else {
                toast.error(response.message || 'Erreur lors du chargement');
            }
        } catch (error) {
            toast.error('Erreur lors du chargement des catégories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadCategories(currentPage, itemsPerPage, search);
        }
    }, [currentPage, search, isOpen]);

    // Gestion des inputs multiples
    const handleAddInput = () => {
        setInputs([...inputs, { label: '', defautPrice: '' }]);
    };

    const handleRemoveInput = (index: number) => {
        if (inputs.length > 1) {
            const updated = [...inputs];
            updated.splice(index, 1);
            setInputs(updated);

            // Nettoyer les erreurs pour cet index
            const newErrors = { ...errors };
            delete newErrors[index];
            setErrors(newErrors);
        }
    };

    const handleInputChange = (index: number, field: keyof CategoryInput, value: string) => {
        const updated = [...inputs];
        updated[index][field] = value;
        setInputs(updated);

        // Valider l'input en temps réel
        validateInput(index, updated[index]);
    };

    // Validation d'un input
    const validateInput = (index: number, input: CategoryInput) => {
        try {
            // Utiliser le schéma sans .element
            const singleItemSchema = z.object({
                label: z.string()
                    .min(2, "Le nom doit contenir au moins 2 caractères")
                    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
                defautPrice: z.string()
                    .min(1, "Le prix est requis")
                    .regex(/^\d+(\.\d{1,2})?$/, "Format invalide (ex: 10 ou 10.99)"),
            });

            singleItemSchema.parse(input);
            const newErrors = { ...errors };
            delete newErrors[index];
            setErrors(newErrors);
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = { ...errors };
                // ✅ Utiliser .issues au lieu de .errors
                newErrors[index] = error.issues.map(err => err.message);
                setErrors(newErrors);
            }
            return false;
        }
    };

    // Validation de tous les inputs
    const validateAllInputs = () => {
        const allErrors: Record<number, string[]> = {};
        let isValid = true;

        const singleItemSchema = z.object({
            label: z.string()
                .min(2, "Le nom doit contenir au moins 2 caractères")
                .max(100, "Le nom ne peut pas dépasser 100 caractères"),
            defautPrice: z.string()
                .min(1, "Le prix est requis")
                .regex(/^\d+(\.\d{1,2})?$/, "Format invalide (ex: 10 ou 10.99)"),
        });

        inputs.forEach((input, index) => {
            try {
                singleItemSchema.parse(input);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    // ✅ Utiliser .issues au lieu de .errors
                    allErrors[index] = error.issues.map(err => err.message);
                    isValid = false;
                }
            }
        });

        setErrors(allErrors);
        return isValid;
    };

    // Soumission du formulaire
    const handleSubmit = async () => {
        try {
            if (editingIndex !== null) {
                // Mode édition - une seule catégorie
                const category = categories[editingIndex];
                const validationResult = categorieSchema.safeParse({
                    id: category.id,
                    label: inputs[0].label,
                    defautPrice: inputs[0].defautPrice,
                });

                if (!validationResult.success) {
                    // ✅ Utiliser .issues au lieu de .errors
                    validationResult.error.issues.forEach(issue => {
                        toast.error(issue.message);
                    });
                    return;
                }

                const data = validationResult.data;
                const result = await updateCategoryTransaction(category.id, data);

                if (result.statusCode !== 200) {
                    toast.error(result.message);
                } else {
                    toast.success('Catégorie mise à jour avec succès');
                    handleClose();
                    loadCategories(currentPage, itemsPerPage, search);
                }
            } else {
                // Mode création - multiples catégories
                if (!validateAllInputs()) {
                    toast.error('Veuillez corriger les erreurs dans le formulaire');
                    return;
                }

                const validationResult = categorieBulkSchema.safeParse(inputs);

                if (!validationResult.success) {
                    // ✅ Utiliser .issues au lieu de .errors
                    validationResult.error.issues.forEach(issue => {
                        toast.error(issue.message);
                    });
                    return;
                }

                const payload = validationResult.data;
                const result = await createCategoryTransaction(payload);

                if (result.statusCode !== 200) {
                    toast.error(result.message);
                } else {
                    toast.success(`${payload.length} catégorie(s) créée(s) avec succès`);
                    handleClose();
                    loadCategories(currentPage, itemsPerPage, search);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error('Erreur lors de la soumission');
        }
    };

    // Édition d'une catégorie
    const handleEdit = (index: number) => {
        const category = categories[index];

        setInputs([{
            label: category.label,
            defautPrice: category.defautPrice.toString()
        }]);

        setEditingIndex(index);
    };

    // Fermeture de la modal
    const handleClose = () => {
        setInputs([{ label: '', defautPrice: '' }]);
        setEditingIndex(null);
        setErrors({});
        // onClose();
    };

    // Suppression d'une catégorie
    const handleDeleteClick = (id: number) => {
        setSelectedIdToDelete(Number(id));
        setDialogOpen(true);
    };

    const confirmDelete = async (id: string | number) => {
        try {
            const result = await deleteCategoryTransaction(Number(id));

            if (result.statusCode !== 200) {
                toast.error(result.message);
            } else {
                toast.success('Catégorie supprimée avec succès');
                loadCategories(currentPage, itemsPerPage, search);
            }
        } catch (err) {
            console.error(err);
            toast.error('Erreur lors de la suppression');
        } finally {
            setDialogOpen(false);
            setSelectedIdToDelete(null);
        }
    };

    // Navigation par pagination
    const onPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const onNextPage = () => {
        if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800  ">
                <h5 className="inline-flex items-center mb-4 text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {editingIndex !== null ? 'Modifier' : 'Créer'} Catégorie(s)
                </h5>

                <div className="mt-4 space-y-4">
                    <div className="p-4 md:p-5 space-y-4">
                        {inputs.map((input, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex space-x-2 items-center">
                                    <button
                                        onClick={() => handleRemoveInput(index)}
                                        disabled={inputs.length === 1}
                                        className="text-red-600 font-bold px-2"
                                    >
                                        <CircleX className="w-4 h-4" />
                                    </button>
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Nom de la catégorie"
                                            value={input.label}
                                            onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                                            className={`border rounded px-3 py-2 ${errors[index] ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Prix par défaut"
                                            value={input.defautPrice}
                                            onChange={(e) => handleInputChange(index, 'defautPrice', e.target.value)}
                                            className={`border rounded px-3 py-2 ${errors[index] ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                </div>

                                {errors[index] && errors[index].length > 0 && (
                                    <div className="ml-8 space-y-1">
                                        {errors[index].map((error, errorIndex) => (
                                            <p key={errorIndex} className="text-red-500 text-sm">
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {editingIndex === null && (
                            <button  onClick={handleAddInput}  className="text-font-bold flex items-center text-blue-600 hover:text-blue-800" >
                                <CirclePlus className="w-4 h-4 mr-1" />
                                Ajouter une catégorie
                            </button>
                        )}
                    </div>

                    <div className="flex items-center p-4 md:p-5 border-t dark:border-gray-600 space-x-2">
                        <Button
                            className="w-full md:w-auto text-white px-5 py-2 rounded"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Chargement...' : editingIndex !== null ? 'Mettre à jour' : 'Créer'}
                        </Button>
                        <button
                            onClick={handleClose}
                            className="bg-gray-200 px-5 py-2 rounded hover:bg-gray-300"
                        >
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">
                                            Chargement...
                                        </TableCell>
                                    </TableRow>
                                ) : categories.length > 0 ? (
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
                                                <Button   variant="secondary"   size="sm"   onClick={() => handleDeleteClick(cat.id)}  className="text-red-400 hover:text-gray-900"  >
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onPreviousPage}
                                disabled={currentPage <= 1}
                                className="text-xs sm:text-sm"
                            >
                                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Précédent</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onNextPage}
                                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                                className="text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">Suivant</span>
                                <ChevronRight className="h-4 w-4 sm:ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>


            <DeleteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    if (selectedIdToDelete) {
                        confirmDelete(selectedIdToDelete);
                    }
                }}
            />
        </>
    );
}