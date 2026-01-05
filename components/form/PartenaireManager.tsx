'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import Image from 'next/image';
import { Edit, X, Plus, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { PartenaireFormValues, partenaireSchema } from '@/types/ApiRequest/Allinterfaces';
import { Partenaire, Status } from '@/types/ApiReponse/adminApi';
import { createPartenaire, deletePartenaire, getAllPartenaires, updatePartenaire } from '@/api/services/reglageServices';

interface PartenaireData extends PartenaireFormValues {
    id: string;
    logoUrl?: string;
}

export default function PartenaireManager() {
    const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const fetchPartenaires = async () => {
        try {

            const res = await getAllPartenaires(currentPage, limit);
            if (res.data) {
                setPartenaires(res.data.data);
            } else {
                setPartenaires([]);
                toast.error('Aucune publicité trouvée');
            }
        } catch (err) {
            toast.error("Erreur lors du chargement des partenaires");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPartenaires();
    }, [currentPage]);

    const onSubmitHandler = async (data: PartenaireFormValues, id?: string) => {
        const formData = new FormData();
        formData.append('libeller', data.libeller);
        if (data.description) formData.append('description', data.description);
        if (data.status) formData.append('status', data.status);
        if (data.logo && data.logo.length > 0) formData.append('logo', data.logo[0]);

        try {
            let res;
            if (id) {
                res = await updatePartenaire(id, formData);
            } else {
                res = await createPartenaire(formData);
            }
            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (id ? 'Partenaire mis à jour' : 'Partenaire créé'));
                fetchPartenaires();
                setEditingId(null);
                setCreating(false);
            } else toast.error(res.message || 'Erreur serveur');
        } catch (err) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;
        try {
            const res = await deletePartenaire(id);
            if (res.statusCode === 200) {
                toast.success(res.message || "Partenaire supprimé");
                fetchPartenaires();
            } else toast.error(res.message || "Erreur lors de la suppression");
        } catch (err) {
            toast.error("Erreur serveur lors de la suppression");
            console.error(err);
        }
    };

    function handleNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            alert("Vous êtes déjà sur la dernière page.");
        }
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            alert("Vous êtes déjà sur la première page.");
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Partenaires</h1>
                <Button onClick={() => { setCreating(true); setEditingId(null); }} className="bg-[#B07B5E] hover:bg-green-800">
                    <Plus className="h-4 w-4 mr-2" /> Créer un partenaire
                </Button>
            </div>

            {creating && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
                    <PartenaireForm
                        partenaire={{ id: 'new', libeller: '', status: 'ACTIVE', description: '' }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-4">
                {partenaires.map((p) => (
                    <div key={p.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-lg font-semibold">{p.libeller}</h3>
                                <p className="text-sm text-gray-500">{p.description || 'Non défini'}</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {p.status}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setEditingId(editingId === p.id ? null : p.id)} className="flex items-center gap-2">
                                    {editingId === p.id ? <><X className="h-4 w-4" /> Annuler</> : <><Edit className="h-4 w-4" /> Modifier</>}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)} className="flex items-center gap-2">
                                    <X className="h-4 w-4" /> Supprimer
                                </Button>
                            </div>
                        </div>

                        {p.logo && <Image src={p.logo} alt={p.libeller} className="h-16 w-16 object-cover rounded-lg mb-2 border border-gray-200" width={30} height={30} unoptimized />}

                        {editingId === p.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <PartenaireForm
                                    partenaire={p}
                                    onSubmit={(data) => onSubmitHandler(data, p.id)}
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        )}
                    </div>
                ))}

                {partenaires.length > 0 && (
                    <div className="flex flex-col items-center justify-center space-y-2 py-4">
                        <div className="text-muted-foreground text-xs sm:text-sm text-center">
                            Page {currentPage} sur {Math.ceil(totalItems / limit)}
                        </div>

                        <div className="flex justify-center space-x-2">
                            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage <= 1} className="text-xs sm:text-sm" >
                                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Précédent</span>
                            </Button>

                            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalItems / limit)} className="text-xs sm:text-sm">
                                <span className="hidden sm:inline">Suivant</span>
                                <ChevronRight className="h-4 w-4 sm:ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function PartenaireForm({ partenaire, onSubmit, onCancel }: {
    partenaire: PartenaireData;
    onSubmit: (data: PartenaireFormValues) => void;
    onCancel: () => void;
}) {
    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<PartenaireFormValues>({
        resolver: zodResolver(partenaireSchema),
        defaultValues: {
            libeller: partenaire.libeller,
            description: partenaire.description || '',
            logo: undefined,
            // status volontairement omis pour laisser le backend mettre "ACTIVE"
        }
    });

    const file = watch('logo');
    const status = watch('status'); // optionnel, mais peut être utilisé si besoin

    const submit: SubmitHandler<PartenaireFormValues> = (data) => onSubmit(data);

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Libellé</label>
                    <Input {...register('libeller')} placeholder="Libellé" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Description" />}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Statut (optionnel)</label>
                    <Select value={status} onValueChange={(val) => setValue('status', val as Status)}>
                        <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Logo</label>
                    {partenaire.logo && !file && (
                        <Image src={partenaire.logo} alt={partenaire.libeller} className="h-16 w-16 object-cover rounded-lg mb-2 border border-gray-200" width={30} height={30} unoptimized />
                    )}
                    <input type="file" {...register('logo')} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
                <Button type="submit" className="bg-[#B07B5E] hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" /> Sauvegarder
                </Button>
            </div>
        </form>
    );
}

