// ProductForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { X, Upload, Package, Tag, DollarSign, Layers, Palette, Ruler, Star, Hash, HandCoins } from "lucide-react";
import { CategoryProduct, SubCategoryProduct, Product } from "@/types/interfaces";
import { Select2 } from "./Select2";
import { FormSwitch } from "./FormSwitch";
import { getSubCategoriesbyCategory } from "@/service/categoryServices";
import { toast } from "sonner";
import { getStoreId, getUserInfos, useAuthMiddleware } from "@/app/middleware";


// ================= VALIDATION ZOD =================
export const productSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").max(200, "Le nom est trop long"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    price: z.number().min(0.01, "Le prix doit être supérieur à 0").max(1000000, "Le prix est trop élevé"),
    oldPrice: z.number().min(0, "Le prix ancien doit être positif").optional().nullable(),
    sku: z.string().min(3, "Le SKU doit contenir au moins 3 caractères").max(50, "Le SKU est trop long").regex(/^[A-Z0-9-]+$/, "Le SKU ne doit contenir que des lettres majuscules, chiffres et tirets"),
    categoryId: z.number().min(1, "La catégorie est requise"),
    subCategoryId: z.number().min(1, "La sous-catégorie est requise"),
    stock: z.number().int("Le stock doit être un nombre entier").min(0, "Le stock ne peut pas être négatif").max(10000, "Le stock est trop élevé"),
    available: z.boolean(),
    featured: z.boolean(),
    rating: z.number().min(0, "La note ne peut pas être négative").max(5, "La note maximale est 5").optional(),
    reviewCount: z.number().int("Le nombre d'avis doit être un entier").min(0, "Le nombre d'avis ne peut pas être négatif").optional(),
    tag: z.enum(["NEW ARRIVAL", "GET OFF 20%", "BEST SELLER", "LIMITED"]).optional().nullable(),
    colors: z.array(z.string()).min(1, "Au moins une couleur est requise").max(10, "Maximum 10 couleurs"),
    sizes: z.array(z.string()).min(1, "Au moins une taille est requise").max(10, "Maximum 10 tailles"),
    images: z.array(z.string()).min(1, "Au moins une image est requise").max(8, "Maximum 8 images"),
});

// ================= TYPES =================
export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialValue?: Partial<Product>;
    categories: CategoryProduct[];
    subCategories: SubCategoryProduct[];
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting: boolean;
    onClose: () => void;
}

// ================= COMPOSANT PRINCIPAL =================
export default function ProductForm({ initialValue, categories, subCategories, onSubmit, isSubmitting, onClose }: ProductFormProps) {

    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        initialValue?.categoryId ? initialValue.categoryId.toString() : null
    );
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
        initialValue?.subCategoryId ? initialValue.subCategoryId.toString() : null
    );
    const [selectedTag, setSelectedTag] = useState<string | null>(
        initialValue?.tag || null
    );
    const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategoryProduct[]>([]);
    const [images, setImages] = useState<string[]>(initialValue?.images || []);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    const [availableColors, setAvailableColors] = useState<string[]>([
        "#000000", "#FFFFFF", "#FF3B30", "#007AFF", "#34C759",
        "#FF9500", "#5856D6", "#AF52DE", "#8B4513", "#FFD700"
    ]);
    const [selectedColors, setSelectedColors] = useState<string[]>(initialValue?.colors || []);
    const [newColor, setNewColor] = useState("#000000");
    const [isAddingColor, setIsAddingColor] = useState(false);

    const [availableSizes, setAvailableSizes] = useState<string[]>([
        "XS", "S", "M", "L", "XL", "XXL",
        "38", "39", "40", "41", "42", "43",
        "128GB", "256GB", "512GB", "1TB"
    ]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(initialValue?.sizes || []);
    const [newSize, setNewSize] = useState("");
    const [isAddingSize, setIsAddingSize] = useState(false);
    const [storeId, setStoreId] = useState<number | null>(null);
    const [added_by, setAdded_by] = useState<number | null>(null);

    // ================= FORM SETUP =================
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialValue?.name || "",
            description: initialValue?.description || "",
            price: initialValue?.price || 0,
            oldPrice: initialValue?.oldPrice || null,
            sku: initialValue?.sku || "",
            categoryId: initialValue?.categoryId || 0,
            subCategoryId: initialValue?.subCategoryId || 0,
            stock: initialValue?.stock || 0,
            available: initialValue?.available !== undefined ? initialValue.available : true,
            featured: initialValue?.featured !== undefined ? initialValue.featured : false,
            rating: initialValue?.rating,
            reviewCount: initialValue?.reviewCount,
            tag: initialValue?.tag || null,
            colors: initialValue?.colors || [],
            sizes: initialValue?.sizes || [],
            images: initialValue?.images || [],
        },
    });

    const getStorebyId = async (position: number = 1) => {
        // position = 1 => premier élément (index 0)
        const storeId = await getStoreId()
        const userid = await getUserInfos()

        console.log("Store ID récupéré dans le formulaire produit :", storeId)
        if (storeId) {
            setStoreId(storeId)
        }
        if (userid) {
            setAdded_by(userid.id)
        }
    }
    useEffect(() => {
        getStorebyId()
    }, [])

    // ================= EFFETS =================
    useEffect(() => {
        if (initialValue?.categoryId) {
            const catId = initialValue.categoryId.toString();
            setSelectedCategory(catId);
            filterSubCategories(Number(catId));
        }
    }, [initialValue?.categoryId]);

    useEffect(() => {
        if (selectedColors.length > 0) {
            setValue("colors", selectedColors, { shouldValidate: true });
        }
    }, [selectedColors, setValue]);

    useEffect(() => {
        if (selectedSizes.length > 0) {
            setValue("sizes", selectedSizes, { shouldValidate: true });
        }
    }, [selectedSizes, setValue]);

    useEffect(() => {
        if (images.length > 0) {
            setValue("images", images, { shouldValidate: true });
        }
    }, [images, setValue]);

    // ================= FONCTIONS =================
    // ================= FONCTIONS =================
    const filterSubCategories = async (categoryId: number) => {
        try {
            const res = await getSubCategoriesbyCategory(categoryId);

            let filtered: SubCategoryProduct[] = [];

            if (res.statusCode === 200 && Array.isArray(res.data)) {
                // Filtrer les sous-catégories pour la catégorie sélectionnée
                filtered = res.data.filter(sub => sub.category_id === categoryId);
                setFilteredSubCategories(filtered);
            } else {
                toast.error(res?.message || "Erreur lors du chargement des sous-catégories");
                setFilteredSubCategories([]);
            }

            // Vérifier si la sous-catégorie actuelle est toujours valide
            const currentSubCategory = getValues("subCategoryId");
            if (currentSubCategory && !filtered.some(sub => sub.id === currentSubCategory)) {
                setValue("subCategoryId", 0);
                setSelectedSubCategory(null);
            }
        } catch (error: any) {
            console.error("Erreur filterSubCategories:", error);
            toast.error(error.message || "Erreur inattendue");
            setFilteredSubCategories([]);
            setValue("subCategoryId", 0);
            setSelectedSubCategory(null);
        }
    };


    const handleCategoryChange = (selectedItem: string | null) => {
        console.log("Category changed:", selectedItem);
        setSelectedCategory(selectedItem);

        if (selectedItem) {
            const catId = Number(selectedItem);
            setValue("categoryId", catId, { shouldValidate: true });
            filterSubCategories(catId);
        } else {
            setValue("categoryId", 0);
            setFilteredSubCategories([]);
        }

        // Réinitialiser la sous-catégorie
        setValue("subCategoryId", 0);
        setSelectedSubCategory(null);
    };

    const handleSubCategoryChange = (selectedItem: string | null) => {
        console.log("SubCategory changed:", selectedItem);
        setSelectedSubCategory(selectedItem);

        if (selectedItem) {
            const subCatId = Number(selectedItem);
            setValue("subCategoryId", subCatId, { shouldValidate: true });
        } else {
            setValue("subCategoryId", 0);
        }
    };

    const handleTagChange = (selectedItem: string | null) => {
        console.log("Tag changed:", selectedItem);
        setSelectedTag(selectedItem);

        const tagValue = selectedItem as "NEW ARRIVAL" | "GET OFF 20%" | "BEST SELLER" | "LIMITED" | null;
        setValue("tag", tagValue, { shouldValidate: true });
    };

    const handleImageUpload = (files: FileList) => {
        const file = files[0];
        if (!file || images.length >= 8) return;

        const imageUrl = URL.createObjectURL(file);
        setImages(prev => [...prev, imageUrl]);
        setNewImageFile(file);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const addColor = () => {
        if (newColor && !availableColors.includes(newColor)) {
            // Ajouter la couleur à la liste des couleurs disponibles
            setAvailableColors(prev => [...prev, newColor]);
            // Sélectionner automatiquement la nouvelle couleur
            setSelectedColors(prev => [...prev, newColor]);
        } else if (newColor && !selectedColors.includes(newColor)) {
            // Si la couleur existe déjà dans availableColors, juste la sélectionner
            setSelectedColors(prev => [...prev, newColor]);
        }
        setIsAddingColor(false);
        setNewColor("#000000");
    };

    const removeColor = (color: string) => {
        setSelectedColors(prev => prev.filter(c => c !== color));
    };

    const toggleColor = (color: string, checked: boolean) => {
        if (checked) {
            setSelectedColors(prev => [...prev, color]);
        } else {
            removeColor(color);
        }
    };

    const addSize = () => {
        const trimmedSize = newSize.trim().toUpperCase();
        if (trimmedSize) {
            if (!availableSizes.includes(trimmedSize)) {
                // Ajouter la taille à la liste des tailles disponibles
                setAvailableSizes(prev => [...prev, trimmedSize]);
                // Sélectionner automatiquement la nouvelle taille
                setSelectedSizes(prev => [...prev, trimmedSize]);
            } else if (!selectedSizes.includes(trimmedSize)) {
                // Si la taille existe déjà dans availableSizes, juste la sélectionner
                setSelectedSizes(prev => [...prev, trimmedSize]);
            }
        }
        setIsAddingSize(false);
        setNewSize("");
    };

    const removeSize = (size: string) => {
        setSelectedSizes(prev => prev.filter(s => s !== size));
    };

    const toggleSize = (size: string, checked: boolean) => {
        if (checked) {
            setSelectedSizes(prev => [...prev, size]);
        } else {
            removeSize(size);
        }
    };

    const handleFormSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        try {
            const formData = new FormData();

            // Champs simples
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price.toString());

            if (storeId !== null && storeId !== undefined) {
                formData.append("storeId", storeId.toString());
            }
            if (added_by !== null && added_by !== undefined) {
                formData.append("added_by", added_by.toString());
            }
            if (data.oldPrice !== null && data.oldPrice !== undefined) {
                formData.append("oldPrice", data.oldPrice.toString());
            }
            formData.append("sku", data.sku);
            formData.append("categoryId", data.categoryId.toString());
            formData.append("subCategoryId", data.subCategoryId.toString());
            formData.append("stock", data.stock.toString());
            formData.append("available", data.available ? "1" : "0");
            formData.append("featured", data.featured ? "1" : "0");

            if (data.rating !== undefined && data.rating !== null) {
                formData.append("rating", data.rating.toString());
            }
            if (data.reviewCount !== undefined && data.reviewCount !== null) {
                formData.append("reviewCount", data.reviewCount.toString());
            }
            if (data.tag) {
                formData.append("tag", data.tag);
            }

            // Couleurs et tailles
            data.colors.forEach(color => formData.append("colors[]", color));
            data.sizes.forEach(size => formData.append("sizes[]", size));

            // Images : plusieurs fichiers
            if (newImageFile) {
                // Si tu ne gères qu'une seule image modifiée à la fois
                formData.append("images[]", newImageFile);
            } else {
                // Si tu veux renvoyer les images existantes (URL string) au backend
                // selon ton backend, tu peux soit ignorer, soit envoyer les URLs
                // ici on suppose que seules les nouvelles images uploadées sont envoyées
            }

            console.log("FormData prêt :", formData);

            // Passer le FormData à onSubmit
            await onSubmit(formData as any);
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
        }
    };


    const formatPrice = (price: number | null | undefined): string => {
        if (price === null || price === undefined) return "0,00 ₣";
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
    };


    const watchedPrice = watch("price");
    const watchedOldPrice = watch("oldPrice");
    const watchedDescription = watch("description");

    // ================= OPTIONS POUR LES SELECT =================
    const categoryOptions = categories.map(category => ({
        value: category.id.toString(),
        label: category.name
    }));

    const subCategoryOptions = filteredSubCategories.map(sub => ({
        value: sub.id.toString(),
        label: sub.name
    }));

    const tagOptions = [
        { value: "NEW ARRIVAL", label: "Nouveauté" },
        { value: "GET OFF 20%", label: "Promo -20%" },
        { value: "BEST SELLER", label: "Meilleure vente" },
        { value: "LIMITED", label: "Édition limitée" }
    ];

    // ================= RENDER =================
    return (
        <div className="min-h-screen ">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {initialValue?.id ? "Modifier le produit" : "Créer un nouveau produit"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Remplissez les informations ci-dessous pour {initialValue?.id ? "modifier" : "ajouter"} un produit
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Images Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Images du produit
                            </h2>
                            <span className="text-sm text-gray-500">
                                {images.length}/8 images
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                            {/* Upload Button */}
                            <label className={`relative h-48 rounded-lg border-2 border-dashed ${images.length >= 8 ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 hover:border-brand-primary cursor-pointer'} transition-colors flex flex-col items-center justify-center bg-gray-50`}>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-600">Ajouter une image</span>
                                <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                    disabled={images.length >= 8}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>

                            {/* Image Preview */}
                            {images.map((image, index) => (
                                <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                                    <Image
                                        src={ image}
                                        alt={`Produit ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                        unoptimized
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Supprimer l'image ${index + 1}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                                        Image {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.images && (
                            <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>
                        )}
                    </div>

                    {/* Informations de base */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                            <Package className="w-5 h-5" />
                            Informations de base
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nom du produit */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du produit *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    placeholder="Ex: iPhone 15 Pro Max"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* SKU */}
                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                                    Référence (SKU) *
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="sku"
                                        type="text"
                                        {...register("sku")}
                                        placeholder="Ex: IPH15PM-001"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent uppercase"
                                    />
                                </div>
                                {errors.sku && (
                                    <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
                                )}
                            </div>

                            {/* Prix */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Prix de vente *
                                </label>
                                <div className="relative">
                                    <HandCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        {...register("price", { valueAsNumber: true })}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatPrice(watchedPrice)}
                                </p>
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                )}
                            </div>

                            {/* Ancien prix */}
                            <div>
                                <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 mb-2">
                                    Ancien prix (optionnel)
                                </label>
                                <div className="relative">
                                    <HandCoins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="oldPrice"
                                        type="number"
                                        step="0.01"
                                        {...register("oldPrice", { valueAsNumber: true })}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {watchedOldPrice ? formatPrice(watchedOldPrice) : "Non défini"}
                                </p>
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantité en stock *
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    {...register("stock", { valueAsNumber: true })}
                                    placeholder="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                                {errors.stock && (
                                    <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                                )}
                            </div>

                            {/* Tag */}
                            <div>
                                <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
                                    Étiquette promotionnelle
                                </label>
                                <Select2
                                    options={tagOptions}
                                    selectedItem={selectedTag}
                                    onSelectionChange={handleTagChange}
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.value}
                                    placeholder="Sélectionner une étiquette"
                                    mode="single"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                                    Note (optionnel)
                                </label>
                                <input
                                    id="rating"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    {...register("rating", { valueAsNumber: true })}
                                    placeholder="0.0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>

                            {/* Review Count */}
                            <div>
                                <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre d'avis (optionnel)
                                </label>
                                <input
                                    id="reviewCount"
                                    type="number"
                                    {...register("reviewCount", { valueAsNumber: true })}
                                    placeholder="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Catégories */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                            <Layers className="w-5 h-5" />
                            Catégories
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Catégorie */}
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie principale *
                                </label>
                                <Select2
                                    options={categoryOptions}
                                    selectedItem={selectedCategory}
                                    onSelectionChange={handleCategoryChange}
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.value}
                                    placeholder="Sélectionnez une catégorie"
                                    mode="single"
                                />
                                {errors.categoryId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                                )}
                            </div>

                            {/* Sous-catégorie */}
                            <div>
                                <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Sous-catégorie *
                                </label>
                                <Select2
                                    options={subCategoryOptions}
                                    selectedItem={selectedSubCategory}
                                    onSelectionChange={handleSubCategoryChange}
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.value}
                                    placeholder="Sélectionnez une sous-catégorie"
                                    mode="single"
                                    disabled={!selectedCategory}
                                />
                                {errors.subCategoryId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subCategoryId.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variantes */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                            <Palette className="w-5 h-5" />
                            Variantes
                        </h2>

                        {/* Couleurs */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Couleurs disponibles *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingColor(true)}
                                    className="text-sm text-brand-primary hover:text-blue-800"
                                >
                                    + Ajouter une couleur
                                </button>
                            </div>

                            {isAddingColor && (
                                <div className="flex items-center gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="color"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        className="w-10 h-10 cursor-pointer"
                                        aria-label="Sélecteur de couleur"
                                    />
                                    <input
                                        type="text"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                                        placeholder="#000000"
                                    />
                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary"
                                    >
                                        Ajouter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingColor(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {availableColors.map((color) => (
                                    <label
                                        key={color}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${selectedColors.includes(color)
                                            ? 'bg-blue-50 border-brand-primary'
                                            : 'border-gray-300 hover:border-blue-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedColors.includes(color)}
                                            onChange={(e) => toggleColor(color, e.target.checked)}
                                            className="hidden"
                                        />
                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-sm">{color}</span>
                                        {selectedColors.includes(color) && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeColor(color);
                                                }}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                aria-label={`Supprimer la couleur ${color}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </label>
                                ))}
                            </div>
                            {errors.colors && (
                                <p className="text-red-500 text-sm mt-2">{errors.colors.message}</p>
                            )}
                        </div>

                        {/* Tailles */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tailles disponibles *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingSize(true)}
                                    className="text-sm text-brand-primary hover:text-blue-800"
                                >
                                    + Ajouter une taille
                                </button>
                            </div>

                            {isAddingSize && (
                                <div className="flex items-center gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="text"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="Ex: XL, 38, 256GB"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSize}
                                        className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary"
                                    >
                                        Ajouter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingSize(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map((size) => (
                                    <label
                                        key={size}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${selectedSizes.includes(size)
                                            ? 'bg-blue-50 border-brand-primary'
                                            : 'border-gray-300 hover:border-blue-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSizes.includes(size)}
                                            onChange={(e) => toggleSize(size, e.target.checked)}
                                            className="hidden"
                                        />
                                        <span className="text-sm">{size}</span>
                                        {selectedSizes.includes(size) && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeSize(size);
                                                }}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                aria-label={`Supprimer la taille ${size}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </label>
                                ))}
                            </div>
                            {errors.sizes && (
                                <p className="text-red-500 text-sm mt-2">{errors.sizes.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Options avancées */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                            <Tag className="w-5 h-5" />
                            Options avancées
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSwitch<ProductFormValues>
                                name="available"
                                register={register}
                                label="Disponible à la vente"
                                description="Le produit sera visible par les clients"
                                color="green"
                            />

                            <FormSwitch<ProductFormValues>
                                name="featured"
                                register={register}
                                label="Mettre en vedette"
                                description="Le produit sera mis en avant"
                                color="blue"
                            />
                        </div>
                    </div>


                    {/* Description */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                            <Star className="w-5 h-5" />
                            Description détaillée
                        </h2>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description du produit *
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                rows={8}
                                placeholder="Décrivez votre produit en détail..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                {watchedDescription?.length || 0} caractères
                            </p>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                        <button type="button" onClick={() => onClose()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" disabled={isSubmitting} >
                            Annuler
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enregistrement...
                                </>
                            ) : initialValue?.id ? ("Mettre à jour le produit") : ("Créer le produit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}