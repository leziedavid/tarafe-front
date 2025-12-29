"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ProductHero from "./ProductHero";
import { getAllCategoriesIn, getSubCategoriesbyCategory } from "@/service/categoryServices";
import { getAllProducts } from "@/service/productsServices";
import { prepareProductParams } from "@/types/prepareProductParams";
import { getImagesUrl } from "@/types/baseUrl";
import { toast } from "sonner";
import { CategoryProduct, Product, SubCategoryProduct } from "@/types/interfaces";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddCart from "./AddCart";

export default function Store() {
    const [activeCategory, setActiveCategory] = useState<string>("ALL");
    const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
    const [maxPrice, setMaxPrice] = useState<number>(200);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryProduct[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const urlImages = getImagesUrl();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'stock'>('date');
    // Ajoutez cet état après les autres états
    const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
    // -----------------------------
    // Fetch Products
    // -----------------------------
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
                setProducts(result.data.data || []);
                setTotalItems(result.data.total || 0);
                setLoading(false);
            } else {
                toast.error(result.message || "Erreur lors du chargement");
                setLoading(false);
            }

        } catch (error) {
            console.error("Erreur fetchData:", error);
            toast.error("Erreur lors du chargement des produits");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, selectedCategory, selectedSubCategory, searchTerm, sortBy]);

    // -----------------------------
    // Fetch Categories
    // -----------------------------
    const fetchCategories = async () => {
        try {
            const res = await getAllCategoriesIn();
            if (res.statusCode === 200 && res.data) {
                setCategories(res.data);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Erreur fetchCategories:", error);
            toast.error("Erreur lors du chargement des catégories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // -----------------------------
    // Fetch SubCategories
    // -----------------------------
    const fetchSubCategoriesbyCategory = async (categoryId: number) => {
        try {
            const res = await getSubCategoriesbyCategory(categoryId);
            if (res.statusCode === 200 && res.data) {
                setSubCategories(res.data);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Erreur fetchSubCategoriesbyCategory:", error);
            toast.error("Erreur lors du chargement des sous-catégories");
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategoriesbyCategory(selectedCategory);
        } else {
            setSubCategories([]);
            setSelectedSubCategory(null);
        }
    }, [selectedCategory]);



    // Ajoutez ces fonctions après le fetchCategories()

    // Fonction pour obtenir l'image active
    const getActiveImage = (product: Product) => {
        const activeIndex = activeImageIndex[product.id] || 0;
        if (product.images && product.images.length > 0) {
            return product.images[activeIndex];
        }
        return {
            path: product.image,
            id: 0
        };
    };

    // Navigation des images
    const nextImage = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product || !product.images || product.images.length <= 1) return;

        const currentIndex = activeImageIndex[productId] || 0;
        const nextIndex = (currentIndex + 1) % product.images.length;
        setActiveImageIndex(prev => ({ ...prev, [productId]: nextIndex }));
    };

    const prevImage = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product || !product.images || product.images.length <= 1) return;

        const currentIndex = activeImageIndex[productId] || 0;
        const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        setActiveImageIndex(prev => ({ ...prev, [productId]: prevIndex }));
    };



    // -----------------------------
    // Render
    // -----------------------------
    return (
        <section className="max-w-7xl mx-auto px-6 py-2">
            <ProductHero />

            <h2 className="text-3xl font-medium mb-6 mt-12">Notre boutique en ligne</h2>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-6">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (<div key={i} className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />))) : (
                    <>
                        <button
                            key="all"
                            onClick={() => {
                                setActiveCategory("ALL");
                                setSelectedCategory(null);
                                setActiveSubCategory(null);
                                setSelectedSubCategory(null);
                            }}
                            className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${activeCategory === "ALL" ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}  >
                            Tous
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.name);
                                    setSelectedCategory(cat.id);
                                    setActiveSubCategory(null);
                                    setSelectedSubCategory(null);
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${activeCategory === cat.name ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}  >
                                {cat.name}
                            </button>
                        ))}
                    </>
                )}
            </div>

            {/* Sub categories */}
            <div className="flex flex-wrap gap-2 mb-8">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (<div key={i} className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />))) : (
                    subCategories.map((sub) => (
                        <button
                            key={sub.id}
                            onClick={() => {
                                setActiveSubCategory(sub.name);
                                setSelectedSubCategory(sub.id);
                            }}
                            className={`px-4 py-1.5 rounded-full font-medium text-xs border transition ${activeSubCategory === sub.name ? "bg-[#c08457] text-white" : "bg-white text-gray-600"}`}  >
                            {sub.name}
                        </button>
                    ))
                )}
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0 mb-8">
                {loading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-200 rounded-3xl h-[220px]" />
                    ))
                ) : (
                    products.map((product) => {
                        const activeImage = getActiveImage(product);
                        const totalImages = product.images?.length || 0;
                        const currentIndex = activeImageIndex[product.id] || 0;

                        return (
                            <div key={product.id} className="group">
                                <div className="relative rounded-3xl bg-[#efefec] overflow-hidden">
                                    {/* Tag */}
                                    {product.tag && (
                                        <span className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold ${product.tag === "NEW ARRIVAL" ? "bg-white text-black" : "bg-[#c08457] text-white"}`} >
                                            {product.tag}
                                        </span>
                                    )}

                                    {/* Boutons de navigation du slider (seulement si >1 image) */}
                                    {totalImages > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); prevImage(product.id);
                                                }}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white z-20"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); nextImage(product.id); }}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white z-20" >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>

                                            {/* Compteur d'images */}
                                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
                                                {currentIndex + 1}/{totalImages}
                                            </div>
                                        </>
                                    )}

                                    {/* Overlay Add / Buy */}
                                    {product.price && product.available && (
                                        <AddCart product={product} />

                                        // <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 sm:group-hover:opacity-100 transition z-10">
                                        //     <button className="bg-white text-black px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold mb-2">
                                        //         ADD TO CART
                                        //     </button>
                                        //     <button className="border border-white text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold">
                                        //         BUY NOW
                                        //     </button>
                                        // </div>
                                    )}

                                    {/* Image */}
                                    <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-center bg-cover rounded-3xl" style={{ backgroundImage: `url(${urlImages}/${activeImage.path})`, transition: 'background-image 0.3s ease' }} />
                                </div>

                                {/* Card info */}
                                <div className="mt-2 sm:mt-3 px-1 sm:px-2">
                                    <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>

                                    <div className="flex items-center gap-2 mt-1">
                                        {product.old_price && (
                                            <span className="line-through text-gray-400 text-sm">
                                                ${Number(product.old_price).toFixed(2)}
                                            </span>
                                        )}
                                        <span className="text-[#c08457] font-bold">${Number(product.price).toFixed(2)}</span>
                                    </div>

                                    <p className={`text-xs mt-1 ${product.available ? "text-green-600" : "text-red-500"}`}>
                                        {product.available ? `In stock (${product.stock})` : "En rupture de stock"}
                                    </p>

                                    {/* Miniatures des images (optionnel) */}
                                    {totalImages > 1 && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <div className="flex gap-1 overflow-x-auto py-1">
                                                {product.images?.slice(0, 3).map((image, index) => (
                                                    <button
                                                        key={image.id}
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => ({ ...prev, [product.id]: index })); }}
                                                        className={`relative w-8 h-8 rounded overflow-hidden flex-shrink-0 ${index === currentIndex ? 'ring-2 ring-[#c08457]' : 'opacity-70 hover:opacity-100'}`}  >
                                                        <Image
                                                            src={`${urlImages}/${image.path}`}
                                                            alt={`Miniature ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            sizes="32px"
                                                            unoptimized
                                                        />
                                                    </button>
                                                ))}
                                                {totalImages > 3 && (
                                                    <div className="relative w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-[10px]">
                                                        +{totalImages - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Couleurs */}
                                    {product.colors && product.colors.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {product.colors.map((color: any, i: number) => (
                                                <span
                                                    key={i}
                                                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border"
                                                    style={{ backgroundColor: color.value || color.color || '#000' }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Tailles */}
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="flex gap-2 mt-1 flex-wrap">
                                            {product.sizes.map((size: any, i: number) => (
                                                <span key={i} className="px-2 py-0.5 text-xs border rounded">
                                                    {size.value || size.size || size.name || size}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>


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

        </section>
    );
}
