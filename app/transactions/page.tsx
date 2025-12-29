// app/components/TransactionForm.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, HandCoins } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { transactionSchema } from '@/types/schemas/transactionSchema';
import { CategorieTransaction } from '@/types/interfaces';
import { fetchCategorieTransaction, submitTransaction } from '@/service/transactionServices';
import { Select2 } from '@/components/form/Select2';

const typeOperationOptions = [
    { label: 'MOOV MONEY', value: 'MOOV MONEY' },
    { label: 'ORANGE MONEY', value: 'ORANGE MONEY' },
    { label: 'MTN MONEY', value: 'MTN MONEY' },
    { label: 'WAVE', value: 'WAVE' },
    { label: 'BANQUE', value: 'BANQUE' },
    { label: 'NSP', value: 'NSP' }
];

const transactionTypeOptions = [
    { label: 'Entrée caisse', value: 'entree_caisse' },
    { label: 'Entrée banque', value: 'entree_banque' },
    { label: 'Sortie caisse', value: 'sortie_caisse' },
    { label: 'Sortie banque', value: 'sortie_banque' }
];

export default function TransactionForm() {

    const [listecategorie, seListecategorie] = useState<CategorieTransaction[]>([]);
    const inputDateRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const [categorieFilter, setCategorieFilter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // État pour le loader

    const [formData, setFormData] = useState({
        date: '',
        libelle: '',
        categorieTransactionsId: '',
        autreCategorie: '',
        typeTransaction: '',
        somme: '',
        type_operation: '',
        details: "Transaction du jour faite par Bénédicte"
    });

    const [error, setError] = useState<string | null>(null);

    const chargerCategories = async () => {
        try {
            const res = await fetchCategorieTransaction();

            if (res.statusCode === 200 && res.data) {
                seListecategorie(res.data);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération des catégories.");
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Gestionnaire pour Select2 - Catégorie
    const handleCategoryChange = (selectedItem: any) => {
        if (selectedItem) {
            if (selectedItem === 'autre') {
                handleChange('categorieTransactionsId', 'autre');
            } else {
                handleChange('categorieTransactionsId', selectedItem);
            }
        } else {
            handleChange('categorieTransactionsId', '');
        }
    };

    // Gestionnaire pour Select2 - Type de transaction
    const handleTypeTransactionChange = (selectedItem: any) => {
        if (selectedItem) {
            handleChange('typeTransaction', selectedItem);
        } else {
            handleChange('typeTransaction', '');
        }
    };

    // Gestionnaire pour Select2 - Type d'opération
    const handleTypeOperationChange = (selectedItem: any) => {
        if (selectedItem) {
            handleChange('type_operation', selectedItem);
        } else {
            handleChange('type_operation', '');
        }
    };

    // Préparer les options pour Select2 - Catégorie
    const categorieOptions = [
        ...listecategorie
            .filter((cat) => cat.label.toLowerCase().includes(categorieFilter.toLowerCase()))
            .map((cat) => ({
                label: cat.label,
                value: String(cat.id)
            })),
        { label: 'Autre', value: 'autre' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Empêcher les soumissions multiples
        if (isSubmitting) return;

        setIsSubmitting(true);

        const dataToSave = {
            ...formData,
            categorieFinale:
                formData.categorieTransactionsId === 'autre'
                    ? formData.autreCategorie
                    : formData.categorieTransactionsId
        };

        // Validation avec Zod
        const result = transactionSchema.safeParse(dataToSave);

        if (!result.success) {
            const errorMessages = result.error.issues
                .map(issue => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');
            setError(errorMessages);
            console.error('Validation échouée :', errorMessages);
            setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
            return;
        }

        setError(null); // Réinitialiser l'erreur

        try {
            const response = await submitTransaction(result.data);

            if (response.statusCode === 201) {
                chargerCategories();
                toast.success(response.message || "Transaction enregistrée avec succès!");

                // Réinitialiser le formulaire
                const today = new Date().toISOString().split('T')[0];
                setFormData({
                    date: today,
                    libelle: '',
                    categorieTransactionsId: '',
                    autreCategorie: '',
                    typeTransaction: '',
                    somme: '',
                    type_operation: '',
                    details: 'Transaction du jour faite par Bénédicte'
                });
                setIsSubmitting(false); // Réactiver le bouton après succès
                // Rediriger après un court délai pour voir le message de succès
                setTimeout(() => {  router.push('/transactions');}, 1000);
            } else {
                toast.error(response.message || "Une erreur est survenue lors de l'enregistrement.");
                setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
            }
        } catch (error) {
            toast.error("Erreur lors de l'envoi des données.");
            setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
        }
    };

    useEffect(() => {
        chargerCategories();

        const today = new Date().toISOString().split('T')[0];
        setFormData((prev) => ({
            ...prev,
            date: today,
        }));
    }, []);

    return (
        <>
            <div className={`min-h-[calc(100vh_-_56px)] py-3 px-3 lg:px-6 mt-[4rem] md:mt-[4rem]`}>
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    {/* Icône au centre et agrandie */}
                    <div className="flex justify-center mb-4">
                        <HandCoins className="text-[#242078] w-24 h-24 " />
                    </div>

                    {/* Titre sous l'icône */}
                    <h2 className="text-3xl font-bold text-center mb-6 uppercase">Enregistrement de Transaction</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <div className="relative">
                            <Input
                                ref={inputDateRef}
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                            />
                            <CalendarIcon
                                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                                size={20}
                                onClick={() => inputDateRef.current?.showPicker()}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Libellé</label>
                        <Input
                            value={formData.libelle}
                            onChange={(e) => handleChange('libelle', e.target.value)}
                            placeholder="Ex: Achat essence"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Catégorie</label>
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Rechercher une catégorie..."
                                value={categorieFilter}
                                onChange={(e) => setCategorieFilter(e.target.value)}
                                className="w-full"
                            />

                            <Select2
                                options={categorieOptions}
                                selectedItem={formData.categorieTransactionsId}
                                onSelectionChange={handleCategoryChange}
                                labelExtractor={(item) => item.label}
                                valueExtractor={(item) => item.value}
                                placeholder="Choisir une catégorie"
                                mode="single"
                            />
                        </div>

                        {categorieOptions.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">Aucune catégorie trouvée</div>
                        )}
                    </div>

                    {formData.categorieTransactionsId === 'autre' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Autre catégorie (optionnel)</label>
                            <Input
                                value={formData.autreCategorie}
                                onChange={(e) => handleChange('autreCategorie', e.target.value)}
                                placeholder="Nom de la catégorie"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Type de transaction</label>
                        <Select2
                            options={transactionTypeOptions}
                            selectedItem={formData.typeTransaction}
                            onSelectionChange={handleTypeTransactionChange}
                            labelExtractor={(item) => item.label}
                            valueExtractor={(item) => item.value}
                            placeholder="Choisir un type"
                            mode="single"
                        />
                    </div>

                    {formData.typeTransaction && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Montant</label>
                            <Input
                                type="number"
                                placeholder="Entrez le montant"
                                value={formData.somme}
                                onChange={(e) => handleChange('somme', e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Type d&apos;opération</label>
                        <Select2
                            options={typeOperationOptions}
                            selectedItem={formData.type_operation}
                            onSelectionChange={handleTypeOperationChange}
                            labelExtractor={(item) => item.label}
                            valueExtractor={(item) => item.value}
                            placeholder="Sélectionner le type"
                            mode="single"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Détails</label>
                        <Textarea
                            value={formData.details}
                            onChange={(e) => handleChange('details', e.target.value)}
                        />
                    </div>

                    <Button  type="submit"  className="w-full" disabled={isSubmitting} >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Enregistrement en cours...
                            </span>
                        ) : (
                            'Enregistrer la transaction'
                        )}
                    </Button>
                </form>
            </div>
        </>
    );
}