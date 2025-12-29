"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";  // Pour les notifications de succès ou d'erreur
import { ImageUploader } from '../ui/ImageUploader';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import { z } from "zod";
import { createRealisation, getCategories, getCategoriesById, updateRealisations } from '@/servives/AdminService';
import useAuth from '@/servives/useAuth';
import { ApiDataCategories } from '@/interfaces/AdminInterface';
import { ComboboxMultiSelect } from '../Select2/ComboboxMultiSelect';
import { ApiResponse } from '@/interfaces/ApiResponse';
import { Realisation } from '@/interfaces/HomeInterface';
import { Toaster } from "@/components/ui/sonner";

// Chargement dynamique de l'éditeur Quill
const QuillEditor = dynamic(() => import("@/components/ui/QuillEditor"), { ssr: false });

// Définition du schéma de validation avec Zod
const formSchema = z.object({
    category: z.array(z.string()).min(1, { message: "La catégorie est requise." }),
    libelle: z.string().min(1, { message: "Le libellé est requis." }),
    description: z.string().min(1, { message: "Le message est requis." }),
    files: z.array(z.instanceof(File)).min(1, { message: "Veuillez télécharger au moins une image." }).refine((files) =>
        files.every(file => ['image/png', 'image/jpeg'].includes(file.type)),
        {
            message: 'Les fichiers doivent être des images PNG ou JPEG.',
        }
    ).refine((files) =>
        files.every(file => file.size <= 50 * 1024 * 1024),
        {
            message: 'Chaque fichier ne doit pas dépasser 5 Mo.',
        }
    )
});

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    datas: Realisation | null;
}

const FormDialog: React.FC<FormDialogProps> = ({ open, onOpenChange, datas }) => {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [deblockBtn, seDeblockBtn] = useState(false);
    const [description, setDescription] = useState<string>(''); // Etat pour gérer le message
    const [libelle, setLibelle] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [loadingCategories, setLoadingCategories] = useState<boolean>(true); // Indicateur de chargement des catégories
    const [categoriesError, setCategoriesError] = useState<string | null>(null); // Erreur lors du chargement des catégories
    const token = useAuth();  // Récupérer le token à l'aide du hook

    const [category, setCategory] = useState<string[]>([]);  // Tableau pour gérer les catégories sélectionnées
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const result = await getCategories(token);
                setCategoryOptions(result.data.map((category) => ({
                    value: category.id_option_reaalisation.toString(),  // La valeur est une chaîne
                    label: category.libelleOption_reaalisation,  // Le label est une chaîne
                })));
            } catch (error) {
                setCategoriesError("Erreur lors de la récupération des catégories.");
                toast.error("Erreur lors du chargement des catégories.");  // Affichage du toast d'erreur
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [token]);

    // Effet pour remplir automatiquement description et libellé si datas est défini
    useEffect(() => {

        if (datas && datas.id_realisations) {

            setLibelle(datas.libelle_realisations);  // Remplir le libellé
            setDescription(datas.descript_real);  // Remplir la description

            const fetchCategoriesById = async () => {
                try {
                    const result = await getCategoriesById(token, datas.id_realisations);
                    // Mettre à jour l'état avec les catégories de cet élément
                    setCategory(result.data.map((cat) => cat.idoption_realis_op_realisation.toString()));
                } catch (error) {
                    toast.error("Erreur lors du chargement des catégories associées.");
                }
            };
            fetchCategoriesById();
            seDeblockBtn(true)
        }
    }, [datas && datas.id_realisations]);

    const onFilesChange = (files: File[]) => {
        setSelectedFiles(files); // Mise à jour des fichiers sélectionnés
    };

    const validateForm = () => {
        const result = formSchema.safeParse({
            category,
            libelle,
            description,
            files: selectedFiles,
        });

        if (result.success) {
            setErrors({}); // Aucune erreur
            return true;
        } else {
            const newErrors: { [key: string]: string } = {};
            result.error.errors.forEach((err) => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async () => {

        if (!(datas && datas.id_realisations) && !validateForm()) return;

        // Créer FormData pour l'envoi des données
        const formData = new FormData();

        selectedFiles.forEach((file) => formData.append("fileData", file));
        // Utilisation de la condition ternaire pour définir "states" selon la taille de `selectedFiles`
        formData.append("states", selectedFiles.length > 0 ? "1" : "0");
        formData.append("libelle", libelle);
        formData.append("description", description);
        formData.append("usersid", "21");
        formData.append("positions", "2");
        // Utilisation de la condition ternaire pour ajouter id_realisations
        formData.append("id_realisations", datas && datas.id_realisations ? datas.id_realisations.toString() : "");
        formData.append("selected", category.join(","));

        setIsUploading(true);

        try {
            // : ApiResponse<any>
            if(datas && datas.id_realisations){
                
                const result = await updateRealisations(token, formData);  // Attente d'une réponse de type ApiResponse<any>
                
                if (result.statusCode === 200) {
                    toast.success("produit mise à jour avec succès !");
                    onOpenChange(false);
                } else {
                    toast.error("Erreur lors de l'envoi des données.");
                }

            }else{
                const result = await createRealisation(token, formData);  // Attente d'une réponse de type ApiResponse<any>

                if (result.statusCode === 200) {
                    toast.success("Produit creé avec succès !");
                    onOpenChange(false);
                } else {
                    toast.error("Erreur lors de l'envoi des données.");
                }

            }
            

        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
            toast.error("Une erreur s'est produite pendant la soumission.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl tracking-tighter max-w-xl font-bold">
                        Ajouter un nouveau produit
                    </DialogTitle>
                    <DialogDescription>
                        {/* Sélectionnez plusieurs images (PNG, JPG, JPEG) à télécharger. */}
                    </DialogDescription>
                </DialogHeader>

                {/* Champ catégorie */}
                <div className="grid w-full items-center gap-1 mt-4">
                    <Label className="font-bold" htmlFor="category">Choisir une ou plusieurs catégories</Label>
                    <ComboboxMultiSelect
                        options={categoryOptions}
                        selectedItems={category}
                        onSelectionChange={setCategory}
                        labelExtractor={(item) => item.label}  // Extraire le label de l'option
                        valueExtractor={(item) => item.value}  // Extraire la valeur de l'option
                        placeholder="Sélectionner des catégories"
                    />
                    {errors.category && <p className="text-red-500">{errors.category}</p>}
                </div>

                {/* Champ libellé */}
                <div className="grid w-full items-center gap-1 mt-4">
                    <Label className="font-bold" htmlFor="libelle">Libellé *</Label>
                    <Input id="libelle" value={libelle} onChange={(e) => setLibelle(e.target.value)} />
                    {errors.libelle && <p className="text-red-500">{errors.libelle}</p>}
                </div>

                {/* Champ message */}
                <div className="grid w-full items-center gap-1 mt-4">
                    <Label className="font-bold" htmlFor="Description">Votre message</Label>
                    <QuillEditor value={description} onChange={setDescription} />
                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                </div>

                {/* Champ pour télécharger des images */}
                <div className="grid w-full items-center gap-1 mt-4">
                    <Label className="font-bold" htmlFor="otherFiles">Télécharger une ou plusieurs images (png, jpg, jpeg)</Label>
                    <ImageUploader onFilesChange={onFilesChange} multiple={true} />  {/* Permet de sélectionner plusieurs fichiers */}
                    {errors.files && <p className="text-red-500">{errors.files}</p>}
                </div>

                {/* Boutons d'action */}
                <div className="mt-4 flex justify-end gap-2">
                    <Button type="button"  onClick={() => onOpenChange(false)}  className="text-sm px-4 py-2 rounded-md" >
                        Annuler
                    </Button>

                    {deblockBtn ? (
                        <Button type="button" onClick={handleSubmit} className={`text-sm px-4 py-2 rounded-md `}> Modifier</Button>
                    ) : (
                        <Button type="button" onClick={handleSubmit} disabled={isUploading || selectedFiles.length === 0} className={`text-sm px-4 py-2 rounded-md ${isUploading ? 'opacity-50' : ''}`}>
                            {isUploading ? "Téléchargement..." : "Soumettre"}
                        </Button>
                    )}

                </div>
                
            </DialogContent>
        </Dialog>

        </>
    );
};

export default FormDialog;
