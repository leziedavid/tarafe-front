"use client";

import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import Image from "next/image";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Grid3x3, List, Star, Package, Tag, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryProduct, Product, ProductStats, SubCategoryProduct } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import MyModal from "@/components/modal/MyModal";
import ProductForm from "@/components/form/ProductForm";
import { toast } from "sonner";
import { Select2 } from "@/components/form/Select2";
import Link from "next/link";
import { getAllCategoriesIn, getSubCategoriesbyCategory } from "@/service/categoryServices";
import { createProduct, getAllProducts, getProductStats } from "@/service/productsServices";
import { updateStore } from "@/service/storeServices";
import { prepareProductParams } from "@/types/prepareProductParams";
import { getImagesUrl } from "@/types/baseUrl";

export default function ProductsPage() {
    const router = useRouter();

    // États
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryProduct[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(false);
    const [stateLoading, setStateLoading] = useState(false);

    const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'stock'>('date');
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<Product | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [idproducts, setIdproducts] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const urlImages = getImagesUrl();
    const [productStats, setProductStats] = useState<ProductStats | null>(null);

    // getAllProducts avec filtres
    const fetchData = async () => {
        setLoading(true);
        try {
            const params = prepareProductParams({
                currentPage,
                limit,
                searchTerm,
                selectedCategory,
                selectedSubCategory,
                sortBy
            });

            const result = await getAllProducts(params);

            if (result.statusCode === 200 && result.data?.data) {
                // Les données sont déjà filtrées et triées par l'API
                setProducts(result.data.data || []);
                setTotalItems(result.data.total || 0);
            } else {
                toast.error(result.message || "Erreur lors du chargement");
            }

        } catch (error) {
            console.error("Erreur fetchData:", error);
            toast.error("Erreur lors du chargement des produits");
        } finally {
            setLoading(false);
        }
    };

    // getProductStats
    const fetchProductStats = async () => {
        setStateLoading(true);
        try {
            const params = prepareProductParams({
                currentPage,
                limit,
                searchTerm,
                selectedCategory,
                selectedSubCategory,
                sortBy
            });

            const res = await getProductStats(params);
            if (res.statusCode === 200 && res.data) {
                setProductStats(res.data);
                setStateLoading(false);
            } else {
                toast.error(res.message);
                setStateLoading(false);
            }
        } catch (error) {
            console.error("Erreur fetchData:", error);
            toast.error("Erreur lors du chargement des statistiques");
        } finally {
            setStateLoading(false);
        }
    };

    // Relance fetchData à chaque changement de filtres ou tri
    useEffect(() => {
        fetchData();
        fetchProductStats();
    }, [currentPage, selectedCategory, selectedSubCategory, searchTerm, sortBy]);

    // getAllCategoriesIn
    const fetchCategories = async () => {
        const res = await getAllCategoriesIn()
        if (res.statusCode === 200 && res.data) {
            setCategories(res.data)
        } else {
            toast.error(res.message)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, []);

    const fetchSubCategoriesbyCategory = async (categoryId: number) => {
        const res = await getSubCategoriesbyCategory(categoryId)
        if (res.statusCode === 200 && res.data) {
            setSubCategories(res.data)
        } else {
            toast.error(res.message)
        }
    }

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategoriesbyCategory(selectedCategory)
        } else {
            setSubCategories([]);
            setSelectedSubCategory(null);
        }
    }, [selectedCategory]);

    // Navigation des images
    const nextImage = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product || product.images.length <= 1) return;

        const currentIndex = activeImageIndex[productId] || 0;
        const nextIndex = (currentIndex + 1) % product.images.length;
        setActiveImageIndex(prev => ({ ...prev, [productId]: nextIndex }));
    };

    const prevImage = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product || product.images.length <= 1) return;

        const currentIndex = activeImageIndex[productId] || 0;
        const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        setActiveImageIndex(prev => ({ ...prev, [productId]: prevIndex }));
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);

        try {
            let result;
            if (idproducts) {
                // Mise à jour
                result = await updateStore(idproducts, formData);
                if (result.statusCode === 200) {
                    toast.success("Store mis à jour avec succès !");
                    fetchData();
                    setOpen(false);
                } else {
                    toast.error("Erreur lors de la mise à jour.");
                }
            } else {
                // Création
                result = await createProduct(formData);
                if (result.statusCode === 200) {
                    toast.success("Store créé avec succès !");
                    fetchData();
                    setOpen(false);
                } else {
                    toast.error("Erreur lors de la création.");
                }
            }

        } catch (error) {
            console.error("Erreur handleSubmit:", error);
            toast.error("Erreur lors de l'ajout du produit");
        } finally {
            setIsSubmitting(false);
        }
    };

    const AddProduct = (product: Product) => {
        setOpen(true);
        setInitialValues(product);
        if (product.id) {
            setIdproducts(product.id);
        } else {
            setIdproducts(null);
        }
    };

    // Toggle featured
    const toggleFeatured = async (productId: number) => {
        // Note: Cette fonction modifie localement, mais devrait aussi appeler l'API
        setProducts(prev => prev.map(product => product.id === productId ? { ...product, featured: product.featured === 1 ? 0 : 1 } : product
        ));
    };

    // Toggle available
    const toggleAvailable = async (productId: number) => {
        // Note: Cette fonction modifie localement, mais devrait aussi appeler l'API
        setProducts(prev => prev.map(product => product.id === productId ? { ...product, available: product.available === 1 ? 0 : 1 } : product
        ));
    };

    // Delete product
    const deleteProduct = (productId: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            setProducts(prev => prev.filter(product => product.id !== productId));
            // Note: Ajouter ici l'appel API pour supprimer réellement
        }
    };

    // Format price
    const formatPrice = (price: string) => {
        const priceNumber = parseFloat(price);
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(priceNumber);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Render stars
    const renderStars = (rating: string) => {
        const ratingNumber = parseFloat(rating);
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(ratingNumber) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
                <span className="ml-1 text-xs text-gray-600">{ratingNumber.toFixed(1)}</span>
            </div>
        );
    };

    // Mode Grid
    const renderGridView = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => {
                const currentIndex = activeImageIndex[product.id] || 0;
                const totalImages = product.images.length;

                // Récupérer le chemin de l'image actuelle
                const currentImage = product.images[currentIndex]?.path || product.image;

                return (
                    <div key={product.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        {/* Image Container */}
                        <div className="relative h-40 md:h-48 overflow-hidden bg-gray-100">
                            {currentImage && (
                                <Image src={`${urlImages}/${currentImage}`}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                    unoptimized
                                />
                            )}

                            {/* Tags */}
                            {product.tag && (
                                <div className="absolute top-2 left-2">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.tag === "NEW ARRIVAL" ? "bg-green-800 text-white" :
                                        product.tag === "GET OFF 20%" ? "bg-red-500 text-white" :
                                            product.tag === "BEST SELLER" ? "bg-purple-500 text-white" :
                                                "bg-brand-primary text-white"
                                        }`}>
                                        {product.tag}
                                    </span>
                                </div>
                            )}

                            {/* Featured Badge */}
                            {product.featured === 1 && (
                                <div className="absolute top-2 right-2">
                                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                        <Star className="w-3 h-3 mr-1" />
                                        Vedette
                                    </span>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="absolute bottom-2 left-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.stock > 20 ? "bg-green-100 text-green-800" :
                                    product.stock > 5 ? "bg-yellow-100 text-yellow-800" :
                                        "bg-red-100 text-red-800"
                                    }`}>
                                    Stock: {product.stock}
                                </span>
                            </div>

                            {/* Image Navigation */}
                            {totalImages > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage(product.id);
                                        }}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage(product.id);
                                        }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                        {currentIndex + 1}/{totalImages}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-sm truncate" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate">
                                        {product.category?.name || 'N/A'} › {product.sub_category?.name || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-1 ml-2">
                                    <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => AddProduct(product)}>
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => AddProduct(product)}>
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={() => deleteProduct(product.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                                {product.old_price && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(product.old_price)}
                                    </span>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center justify-between mb-3">
                                {renderStars(product.rating)}
                                <span className="text-xs text-gray-500">{product.review_count} avis</span>
                            </div>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-3">
                                    <div className="flex gap-1">
                                        {product.colors.slice(0, 4).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-6 h-6 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color }}
                                                title={`Couleur ${index + 1}`}
                                            />
                                        ))}
                                        {product.colors.length > 4 && (
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                +{product.colors.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* SKU */}
                            <div className="text-xs text-gray-500 mb-3">
                                SKU: {product.sku}
                            </div>

                            {/* Toggles */}
                            <div className="flex flex-col gap-2 pt-3 border-t">
                                {/* Available Toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Disponible</span>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={product.available === 1}
                                            onChange={() => toggleAvailable(product.id)}
                                        />
                                        <div className="relative w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-800"></div>
                                    </label>
                                </div>

                                {/* Featured Toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">En vedette</span>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={product.featured === 1}
                                            onChange={() => toggleFeatured(product.id)}
                                        />
                                        <div className="relative w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Mode List
    const renderListView = () => (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produit
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Catégorie
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 relative">
                                            <Image
                                                src={`${urlImages}/${product.image}`}
                                                alt={product.name}
                                                fill
                                                className="rounded-md object-cover"
                                                sizes="40px"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.sku}
                                            </div>
                                            {renderStars(product.rating)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.category?.name || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">{product.sub_category?.name || 'N/A'}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatPrice(product.price)}
                                    </div>
                                    {product.old_price && (
                                        <div className="text-sm text-gray-500 line-through">
                                            {formatPrice(product.old_price)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 20 ? "bg-green-100 text-green-800" :
                                        product.stock > 5 ? "bg-yellow-100 text-yellow-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                        {product.stock} unités
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-sm">Disponible</span>
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={product.available === 1}
                                                    onChange={() => toggleAvailable(product.id)}
                                                />
                                                <div className="relative w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-800"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2 text-sm">Vedette</span>
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={product.featured === 1}
                                                    onChange={() => toggleFeatured(product.id)}
                                                />
                                                <div className="relative w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button type="button" className="text-brand-primary hover:text-blue-900" onClick={() => AddProduct(product)}>
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="text-green-600 hover:text-green-900" onClick={() => AddProduct(product)}>
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button type="button" className="text-red-600 hover:text-red-900" onClick={() => deleteProduct(product.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const SkeletonCard = () => (
        <div className="bg-white rounded-lg border border-gray-100 p-4 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <p className="h-4 bg-gray-200 rounded w-24 mb-2"></p>
                    <p className="h-6 bg-gray-200 rounded w-12"></p>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );

    const stats: ProductStats = productStats || {
        total_items: 0,
        featured: 0,
        out_of_stock: 0,
        average_stock: 0,
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
                        <p className="text-gray-600 mt-1">
                            {products.length} produits trouvés
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
                        {/* View Mode */}
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`px-2 sm:px-3 py-1 sm:py-2 ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600'}`}
                            >
                                <Grid3x3 className="w-4 sm:w-5 h-4 sm:h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`px-2 sm:px-3 py-1 sm:py-2 ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600'}`}
                            >
                                <List className="w-4 sm:w-5 h-4 sm:h-5" />
                            </button>
                        </div>

                        {/* Add Product Button */}
                        <button
                            type="button"
                            onClick={() => AddProduct({} as Product)}
                            className="bg-brand-primary hover:bg-brand-secondary text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                        >
                            <Package className="w-4 sm:w-5 h-4 sm:h-5" />
                            <span className="truncate">Nouveau Produit</span>
                        </button>

                        {/* Link Button */}
                        <Link href="/dashboard/category-manager">
                            <button className="bg-black hover:bg-brand-secondary text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap">
                                <Package className="w-4 sm:w-5 h-4 sm:h-5" />
                                <span className="truncate">Catégories de produits</span>
                            </button>
                        </Link>
                    </div>

                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Recherche
                            </label>
                            <input
                                type="text"
                                placeholder="Nom, SKU, description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>

                        {/* Category Filter avec Select2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catégorie
                            </label>
                            <Select2
                                options={[{ id: "", name: "Toutes les catégories", productCount: 0 }, ...categories]}
                                selectedItem={selectedCategory?.toString() || ""}
                                onSelectionChange={(selected) => {
                                    const value = selected ? Number(selected) : null;
                                    setSelectedCategory(value);
                                    setSelectedSubCategory(null);
                                    setCurrentPage(1);
                                }}
                                labelExtractor={(item) => {
                                    if (item.id === "") {
                                        return item.name;
                                    }
                                    return `${item.name}`;
                                }}
                                valueExtractor={(item) => item.id.toString()}
                                placeholder="Toutes les catégories"
                                mode="single"
                            />
                        </div>

                        {/* SubCategory Filter avec Select2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sous-catégorie
                            </label>
                            <Select2
                                options={[
                                    { id: "", name: "Toutes les sous-catégories", category_id: 0, productCount: 0 },
                                    ...subCategories
                                ]}
                                selectedItem={selectedSubCategory?.toString() || ""}
                                onSelectionChange={(selected) => {
                                    const value = selected ? Number(selected) : null;
                                    setSelectedSubCategory(value);
                                    setCurrentPage(1);
                                }}
                                labelExtractor={(item) => {
                                    if (item.id === "") {
                                        return item.name;
                                    }
                                    return `${item.name}`;
                                }}
                                valueExtractor={(item) => item.id.toString()}
                                placeholder="Toutes les sous-catégories"
                                mode="single"
                                disabled={!selectedCategory}
                            />
                        </div>

                        {/* Sort By avec Select2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trier par
                            </label>
                            <Select2
                                options={[
                                    { value: "date", label: "Date (récent)" },
                                    { value: "name", label: "Nom (A-Z)" },
                                    { value: "price", label: "Prix (élevé)" },
                                    { value: "stock", label: "Stock (élevé)" }
                                ]}
                                selectedItem={sortBy}
                                onSelectionChange={(selected) => setSortBy(selected as any)}
                                labelExtractor={(item) => item.label}
                                valueExtractor={(item) => item.value}
                                placeholder="Trier par"
                                mode="single"
                            />
                        </div>
                    </div>

                    {/* Reset Filters */}
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedSubCategory(null);
                                setSearchTerm("");
                                setCurrentPage(1);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <>
                    {stateLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {/* Produits totaux */}
                            <div className="bg-white rounded-lg border border-gray-100 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Produits totaux</p>
                                        <p className="text-2xl font-bold">{stats.total_items}</p>
                                    </div>
                                    <Package className="w-8 h-8 text-brand-primary" />
                                </div>
                            </div>

                            {/* En vedette */}
                            <div className="bg-white rounded-lg border border-gray-100 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">En vedette</p>
                                        <p className="text-2xl font-bold">{stats.featured}</p>
                                    </div>
                                    <Star className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>

                            {/* En rupture */}
                            <div className="bg-white rounded-lg border border-gray-100 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">En rupture</p>
                                        <p className="text-2xl font-bold">{stats.out_of_stock}</p>
                                    </div>
                                    <Tag className="w-8 h-8 text-red-500" />
                                </div>
                            </div>

                            {/* Stock moyen */}
                            <div className="bg-white rounded-lg border border-gray-100 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Stock moyen</p>
                                        <p className="text-2xl font-bold">{stats.average_stock}</p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-green-800" />
                                </div>
                            </div>
                        </div>
                    )}
                </>


                {/* Products Display */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                        <p className="mt-2 text-gray-600">Chargement des produits...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                        <Package className="w-12 h-12 text-gray-400 mx-auto" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
                        <p className="mt-2 text-gray-600">
                            Aucun produit ne correspond à vos critères de recherche.
                        </p>
                    </div>
                ) : viewMode === 'grid' ? renderGridView() : renderListView()}

                {/* Pagination */}
                {totalItems > limit && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4 mt-8">
                        <div className="text-gray-600 text-sm">
                            Affichage {Math.min((currentPage - 1) * limit + 1, totalItems)}-
                            {Math.min(currentPage * limit, totalItems)} sur {totalItems} produits
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Précédent
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, Math.ceil(totalItems / limit)) }, (_, i) => {
                                    const totalPages = Math.ceil(totalItems / limit);
                                    let pageNum;

                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            type="button"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm ${currentPage === pageNum ? 'bg-brand-primary text-white' : 'border border-gray-300 hover:bg-gray-50'}`}  >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalItems / limit)))}
                                disabled={currentPage === Math.ceil(totalItems / limit)}
                            >
                                Suivant
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile" typeModal="large">
                <ProductForm
                    initialValue={initialValues}
                    categories={categories}
                    subCategories={subCategories}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    onClose={() => setOpen(false)}
                />
            </MyModal>
        </AdminLayout>
    );
}