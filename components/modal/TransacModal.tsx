'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { HandCoins } from 'lucide-react';
import { CategorieTransaction, Transaction } from '@/types/interfaces';
import { fetchCategorieTransaction, submitTransaction, updateTransaction } from '@/service/transactionServices';
import { transactionSchema } from '@/types/schemas/transactionSchema';
import { Select2 } from '../form/Select2';

type TransacProps = {
    initialValues?: Transaction;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
};

export default function TransacModal({ initialValues, isOpen, onClose, fetchData }: TransacProps) {

    const [listecategorie, setListecategorie] = useState<CategorieTransaction[]>([]);
    const inputDateRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchCategorie, setSearchCategorie] = useState("");

    const [formData, setFormData] = useState({
        id: initialValues?.id || undefined,
        date: initialValues?.date || '',
        libelle: initialValues?.libelle || '',
        categorieTransactionsId: (initialValues as any)?.categorieTransactionsId?.toString() || '',
        autreCategorie: '',
        typeTransaction: determineType(initialValues),
        somme: initialValues ? determineSum(initialValues) : '',
        type_operation: initialValues?.type_operation || '',
        details: initialValues?.details || '',
    });

    function determineType(tr?: Transaction) {
        if (!tr) return '';
        if (tr.entree_caisse && +tr.entree_caisse > 0) return 'entree_caisse';
        if (tr.entree_banque && +tr.entree_banque > 0) return 'entree_banque';
        if (tr.sortie_caisse && +tr.sortie_caisse > 0) return 'sortie_caisse';
        if (tr.sortie_banque && +tr.sortie_banque > 0) return 'sortie_banque';
        return '';
    }
    type TransactionTypeKey = 'entree_caisse' | 'entree_banque' | 'sortie_caisse' | 'sortie_banque';

    function determineSum(tr: Transaction) {
        const type = determineType(tr) as TransactionTypeKey | '';
        if (type && ['entree_caisse', 'entree_banque', 'sortie_caisse', 'sortie_banque'].includes(type)) {
            return tr[type as keyof Pick<Transaction, TransactionTypeKey>] ?? '';
        }
        return '';
    }

    useEffect(() => {
        if (initialValues) {
            setFormData(f => ({
                ...f,
                id: initialValues.id,
                date: initialValues.date,
                libelle: initialValues.libelle,
                categorieTransactionsId: (initialValues as any)?.categorieTransactionsId?.toString() || '',
                typeTransaction: determineType(initialValues),
                somme: determineSum(initialValues),
                type_operation: initialValues.type_operation ?? '',
                details: initialValues.details ?? ''
            }));
        }
    }, [initialValues]);

    useEffect(() => {
        async function load() {
            const res = await fetchCategorieTransaction();

            if (res.statusCode === 200 && res.data) {
                setListecategorie(res.data);
            } else {
                toast.error(res.message);
            }
        }
        load();
    }, []);

    const handleChange = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

    // Gestionnaire de changement pour Select2 - Catégorie
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

    // Gestionnaire de changement pour Select2 - Type de transaction
    const handleTypeTransactionChange = (selectedItem: any) => {
        if (selectedItem) {
            handleChange('typeTransaction', selectedItem);
        } else {
            handleChange('typeTransaction', '');
        }
    };

    // Gestionnaire de changement pour Select2 - Mode de paiement
    const handlePaymentModeChange = (selectedItem: any) => {
        if (selectedItem) {
            handleChange('type_operation', selectedItem);
        } else {
            handleChange('type_operation', '');
        }
    };

    // Préparer les options pour Select2 - Catégorie
    const categorieOptions = [
        ...listecategorie
            .filter((c) => c.label.toLowerCase().includes(searchCategorie.toLowerCase()))
            .map((c) => ({
                label: c.label,
                value: c.id.toString()
            })),
        { label: 'Autre (spécifier)', value: 'autre' }
    ];

    // Options pour Type de transaction
    const transactionTypeOptions = [
        { label: 'Entrée caisse', value: 'entree_caisse' },
        { label: 'Entrée banque', value: 'entree_banque' },
        { label: 'Sortie caisse', value: 'sortie_caisse' },
        { label: 'Sortie banque', value: 'sortie_banque' }
    ];

    // Options pour Mode de paiement
    const paymentModeOptions = [
        { label: 'MOOV MONEY', value: 'MOOV MONEY' },
        { label: 'ORANGE MONEY', value: 'ORANGE MONEY' },
        { label: 'MTN MONEY', value: 'MTN MONEY' },
        { label: 'WAVE', value: 'WAVE' },
        { label: 'BANQUE', value: 'BANQUE' },
        { label: 'NSP', value: 'NSP' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            somme: formData.somme,
            categorieFinale: formData.categorieTransactionsId === 'autre' ? formData.autreCategorie : formData.categorieTransactionsId
        };

        const parsed = transactionSchema.safeParse(payload);
        // Solution 3 : Extraire directement le message de chaque issue
        if (!parsed.success) {
            const errorMessages = parsed.error.issues
                .map(issue => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');
            setError(errorMessages);
            setIsSubmitting(false);
            return;
        }

        try {
            let res;
            if (formData.id) {
                res = await updateTransaction(Number(formData.id), parsed.data);
            } else {
                res = await submitTransaction(parsed.data);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message);
                fetchData();
                onClose();
            } else toast.error(res.message);

        } catch (err) {
            toast.error("Erreur serveur");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {

        if (onClose) {

            onClose();

        } else {
            // Réinitialiser le formulaire si pas de callback spécifique
            if (!formData.id) {
                setFormData({
                    id: undefined,
                    date: '',
                    libelle: '',
                    categorieTransactionsId: '',
                    autreCategorie: '',
                    typeTransaction: '',
                    somme: '',
                    type_operation: '',
                    details: '',
                });
                setSearchCategorie('');
            }
        }
    };

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <HandCoins className="h-6 w-6 text-green-600" />
                    <h2 className="text-xl font-semibold">
                        {formData.id ? 'Modifier la transaction' : 'Nouvelle transaction'}
                    </h2>
                </div>

                {initialValues && formData.id && (
                    <div className="text-sm text-gray-500">
                        Transaction #{formData.id}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        <p className="font-medium">Erreurs de validation :</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                        type="date"
                        ref={inputDateRef}
                        value={formData.date}
                        onChange={e => handleChange('date', e.target.value)}
                        required
                        className="w-full"
                    />
                </div>

                {/* Libellé */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Libellé</label>
                    <Input
                        placeholder="Description de la transaction"
                        value={formData.libelle}
                        onChange={e => handleChange('libelle', e.target.value)}
                        required
                    />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Catégorie</label>

                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Rechercher une catégorie..."
                            value={searchCategorie}
                            onChange={(e) => setSearchCategorie(e.target.value)}
                            className="w-full"
                        />

                        <Select2
                            options={categorieOptions}
                            selectedItem={formData.categorieTransactionsId}
                            onSelectionChange={handleCategoryChange}
                            labelExtractor={(item) => item.label}
                            valueExtractor={(item) => item.value}
                            placeholder="Sélectionnez une catégorie"
                            mode="single"
                        />
                    </div>

                    {formData.categorieTransactionsId === 'autre' && (
                        <Input
                            placeholder="Précisez la nouvelle catégorie"
                            value={formData.autreCategorie}
                            onChange={e => handleChange('autreCategorie', e.target.value)}
                            required
                        />
                    )}
                </div>

                {/* Type de transaction */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type de transaction</label>
                    <Select2
                        options={transactionTypeOptions}
                        selectedItem={formData.typeTransaction}
                        onSelectionChange={handleTypeTransactionChange}
                        labelExtractor={(item) => item.label}
                        valueExtractor={(item) => item.value}
                        placeholder="Sélectionnez un type"
                        mode="single"
                    />
                </div>

                {/* Montant */}
                {formData.typeTransaction && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Montant</label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={formData.somme}
                            onChange={e => handleChange('somme', e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                )}

                {/* Type d'opération */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Mode de paiement</label>
                    <Select2
                        options={paymentModeOptions}
                        selectedItem={formData.type_operation}
                        onSelectionChange={handlePaymentModeChange}
                        labelExtractor={(item) => item.label}
                        valueExtractor={(item) => item.value}
                        placeholder="Sélectionnez un mode"
                        mode="single"
                    />
                </div>

                {/* Détails */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Détails supplémentaires (optionnel)</label>
                    <Textarea
                        placeholder="Informations complémentaires..."
                        value={formData.details}
                        onChange={e => handleChange('details', e.target.value)}
                        rows={3}
                    />
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        {formData.id ? 'Annuler' : 'Réinitialiser'}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Envoi...
                            </span>
                        ) : (
                            formData.id ? 'Mettre à jour' : 'Enregistrer'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}