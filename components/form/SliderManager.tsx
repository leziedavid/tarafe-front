'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SliderFormValues, sliderSchema } from '@/types/ApiRequest/Allinterfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Edit, Save, X, Plus, Image as ImageIcon, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { Slider } from '@/types/ApiReponse/adminApi';
import { createSlider, deleteSlider, getAllSliders, updateSlider } from '@/api/services/reglageServices';
import RichTextEditor from '../rich-text-editor'; // ✅ ton éditeur riche
import Image from "next/image";

interface SliderData extends SliderFormValues {
    id: string;
    imageUrl?: string;
}

export default function SliderManager() {

    const [sliders, setSliders] = useState<Slider[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const fetchSliders = async () => {
        try {
            const res = await getAllSliders(currentPage, limit);
            if (res.data) {
                setSliders(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            } else {
                setSliders([]);
                toast.error('Aucun slider trouvé');
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des sliders');
        }
    };

    useEffect(() => {
        fetchSliders();
    }, [currentPage]);

    const onSubmitHandler = async (sliderData: SliderFormValues, sliderId?: string) => {
        const formData = new FormData();

        formData.append('label', sliderData.label);

        if (sliderData.description) {
            formData.append('description', sliderData.description);
        }

        if (sliderData.image && sliderData.image.length > 0) {
            formData.append('image', sliderData.image[0]);
        }

        try {
            let res;
            if (sliderId) {
                res = await updateSlider(sliderId, formData);
            } else {
                res = await createSlider(formData);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (sliderId ? 'Slider mis à jour' : 'Slider créé'));
                fetchSliders();
                setEditingId(null);
                setCreating(false);
            } else {
                toast.error(res.message || 'Erreur serveur');
            }
        } catch (error) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error('Erreur lors du submit slider :', error);
        }
    };

    // Nouvelle fonction pour supprimer
    const handleDeleteSlider = async (sliderId: string) => {

        if (!confirm("Voulez-vous vraiment supprimer ce slider ?")) return;

        try {
            const res = await deleteSlider(sliderId);
            if (res.statusCode === 200) {
                toast.success(res.message || "Slider supprimé avec succès");
                fetchSliders();
            } else {
                toast.error(res.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            toast.error("Erreur serveur lors de la suppression");
            console.error("Erreur delete slider :", error);
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
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B07B5E] rounded-lg">
                        <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des Sliders</h1>
                        <p className="text-gray-500">Gérez vos sliders d'accueil</p>
                    </div>
                </div>
                <Button onClick={() => { setCreating(true); setEditingId(null); }} className="bg-[#B07B5E] hover:bg-green-800" >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un slider
                </Button>
            </div>

            {creating && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
                    <SliderForm
                        slider={{ id: 'new', label: '', description: '', imageUrl: undefined }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-4">

                {sliders.map((slider) => (
                    <div key={slider.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between">

                                <div className="flex items-center space-x-3">
                                    {slider.imageUrl && (
                                        // Miniature (ex: dans une liste ou preview)
                                        <div className="relative h-24 w-24">
                                            <Image src={slider.imageUrl || "/placeholder.jpg"} alt="Miniature" className="object-cover w-16 h-16 rounded-full" width={30} height={30} unoptimized />
                                        </div>
                                    )}
                                    <div className='space-x-2'>
                                        <h3 className="text-lg font-semibold text-gray-900">{slider.label}</h3>
                                        <p className="text-white bg-[#B07B5E]/50 space-x-2">
                                            {slider.description ? (
                                                <span dangerouslySetInnerHTML={{ __html: slider.description }} />
                                            ) : 'Pas de description'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Boutons collés */}
                            <div className="flex items-center space-x-3 mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setEditingId(editingId === slider.id ? null : slider.id)
                                    }
                                    className="flex items-center gap-2"
                                >
                                    {editingId === slider.id ? (
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
                                    onClick={() => handleDeleteSlider(slider.id)}
                                    className="flex items-center gap-2"
                                >
                                    <Trash className="h-4 w-4" />
                                    Supprimer
                                </Button>
                            </div>

                            {editingId === slider.id && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <SliderForm slider={{ ...slider, label: slider.label || '', description: slider.description || '', imageUrl: slider.imageUrl || undefined, }}
                                        onSubmit={(data) => onSubmitHandler(data, slider.id)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {sliders.length > 0 && (

                    <div className="flex flex-col items-center justify-center space-y-2 py-4">
                        <div className="text-muted-foreground text-xs sm:text-sm text-center">
                            Page {currentPage} sur {Math.ceil(totalItems / limit)}
                        </div>

                        <div className="flex justify-center space-x-2">
                            <Button variant="outline"  size="sm"  onClick={handlePreviousPage}  disabled={currentPage <= 1} className="text-xs sm:text-sm" >
                                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Précédent</span>
                            </Button>

                            <Button variant="outline"  size="sm" onClick={handleNextPage}  disabled={currentPage >= Math.ceil(totalItems / limit)} className="text-xs sm:text-sm">
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

function SliderForm({ slider, onSubmit, onCancel }: { slider: SliderData; onSubmit: (data: SliderFormValues) => void; onCancel: () => void; }) {

    const { control, register, handleSubmit, watch } = useForm<SliderFormValues>({
        resolver: zodResolver(sliderSchema),
        defaultValues: {
            label: slider.label,
            description: slider.description,
            image: undefined,
        },
    });

    const imageFile = watch('image');

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Libellé</label>
                    <Input {...register('label')} placeholder="Libellé du slider" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Controller name="description" control={control}
                        render={({ field }) => (
                            <RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />
                        )} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    {slider.imageUrl && !imageFile && (
                        <Image src={slider.imageUrl} alt="Photo utilisateur" className="h-24 w-24 object-cover rounded-lg mb-2 border border-gray-200" width={30} height={30} unoptimized />
                        // <img  src={slider.imageUrl} className="h-24 w-24 object-cover rounded-lg mb-2 border border-gray-200"/>
                    )}
                    <input type="file" {...register('image')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}> Annuler  </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700"> <Save className="h-4 w-4 mr-2" /> Sauvegarder </Button>
            </div>
        </form>

    );
}
