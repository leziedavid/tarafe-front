'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentMethodesSchema, PaymentMethodesFormValues } from '@/types/ApiRequest/Allinterfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Edit, FileText, Plus, Save, X } from 'lucide-react';
import { PaymentMethode } from '@/types/ApiReponse/adminApi';
import {createPaymentMethode,updatePaymentMethode,deletePaymentMethode,getAllPaymentMethodes,} from '@/api/services/reglageServices';
import Image from 'next/image';

export default function PaymentMethodeManager() {

    const [paymentMethodes, setPaymentMethodes] = useState<PaymentMethode[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    // Charger toutes les méthodes
    const fetchPaymentMethodes = async () => {
        try {
            const res = await getAllPaymentMethodes(1, 50);
            if (res.data) {
                setPaymentMethodes(res.data.data);
            } else {
                setPaymentMethodes([]);
                toast.error('Aucune méthode de paiement trouvée');
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des méthodes de paiement');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPaymentMethodes();
    }, []);

    // Submit
    const onSubmitHandler = async (data: PaymentMethodesFormValues, id?: string) => {
        
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.status) formData.append('status', data.status);
        if (data.logo && data.logo.length > 0) formData.append('logo', data.logo[0]);

        try {
            let res;
            if (id) {
                res = await updatePaymentMethode(id, formData);
            } else {
                res = await createPaymentMethode(formData);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (id ? 'Méthode mise à jour' : 'Méthode créée'));
                fetchPaymentMethodes();
                setEditingId(null);
                setCreating(false);
            } else {
                toast.error(res.message || 'Erreur serveur');
            }
        } catch (err) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error(err);
        }
    };

    // Supprimer
    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer cette méthode de paiement ?')) return;
        try {
            const res = await deletePaymentMethode(id);
            if (res.statusCode === 200) {
                toast.success(res.message || 'Méthode supprimée avec succès');
                fetchPaymentMethodes();
            } else {
                toast.error(res.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            toast.error('Erreur serveur lors de la suppression');
            console.error('Erreur delete méthode :', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B07B5E] rounded-lg">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des Méthodes de Paiement</h1>
                        <p className="text-gray-500">Ajoutez et gérez vos moyens de paiement</p>
                    </div>
                </div>
                <Button
                    onClick={() => {
                        setCreating(true);
                        setEditingId(null);
                    }}
                    className="bg-[#B07B5E] hover:bg-green-800"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une méthode
                </Button>
            </div>

            {creating && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
                    <PaymentMethodeForm
                        methode={{ id: 'new', name: '', status: 'ACTIVE' }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-4">
                {paymentMethodes.map((methode) => (
                    <div
                        key={methode.id}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                {methode.logo && (
                                    <Image
                                        src={methode.logo}
                                        alt={methode.name}
                                        className="h-12 w-12 object-cover rounded-lg border"
                                        width={48}
                                        height={48}
                                        unoptimized
                                    />
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{methode.name}</h3>
                                    <span
                                        className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${methode.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {methode.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setEditingId(editingId === methode.id ? null : methode.id)
                                    }
                                    className="flex items-center gap-2"
                                >
                                    {editingId === methode.id ? (
                                        <>
                                            <X className="h-4 w-4" /> Annuler
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="h-4 w-4" /> Modifier
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(methode.id)}
                                >
                                    <X className="h-4 w-4" /> Supprimer
                                </Button>
                            </div>
                        </div>

                        {editingId === methode.id && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <PaymentMethodeForm
                                    methode={methode}
                                    onSubmit={(data) => onSubmitHandler(data, methode.id)}
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Formulaire
function PaymentMethodeForm({ methode, onSubmit, onCancel,}: {
    methode: Partial<PaymentMethode>;
    onSubmit: (data: PaymentMethodesFormValues) => void;
    onCancel: () => void;}) {
    const { register, handleSubmit, watch,formState: { errors }, } = useForm<PaymentMethodesFormValues>({
        resolver: zodResolver(paymentMethodesSchema),
        defaultValues: {
            name: methode.name || '',
            status: methode.status || 'ACTIVE',
            logo: undefined,
        },
    });

    const logo = watch('logo');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <Input {...register('name')} placeholder="Ex: Orange Money" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select {...register('status')} className="block w-full border rounded-lg p-2">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    {methode.logo && !logo && ( <Image src={methode.logo} alt="Logo méthode" className="h-16 w-16 object-cover rounded-lg mb-2 border"  width={64} height={64} /> )}
                    <input type="file" {...register('logo')} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit" className="bg-[#B07B5E] hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" /> Sauvegarder
                </Button>
            </div>
        </form>
    );
}
