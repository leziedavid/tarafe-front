"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ProductHero, { HeroSlide } from "./ProductHero";
import { getAllCategoriesIn, getSubCategoriesbyCategory } from "@/service/categoryServices";
import { getAllProducts } from "@/service/productsServices";
import { prepareProductParams } from "@/types/prepareProductParams";
import { getImagesUrl } from "@/types/baseUrl";
import { toast } from "sonner";
import { CategoryProduct, Product, SubCategoryProduct } from "@/types/interfaces";
import { Icon } from "@iconify/react";
import { useCart } from "@/components/providers/CartProvider";
import ProductDetailModal from "./ProductDetailModal";
import CartDetailModal from "./CartDetailModal";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

export default function Store() {
    const { addToCart, totalItems } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryProduct[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [limit] = useState(12);
    const urlImages = getImagesUrl();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'stock'>('date');

    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // -----------------------------
    // Fetch Data
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
                setTotalItemsCount(result.data.total || 0);
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

    const fetchCategories = async () => {
        try {
            const res = await getAllCategoriesIn();
            if (res.statusCode === 200 && res.data) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Erreur fetchCategories:", error);
        }
    };

    const fetchSubCategories = async (categoryId: number) => {
        try {
            const res = await getSubCategoriesbyCategory(categoryId);
            if (res.statusCode === 200 && res.data) {
                setSubCategories(res.data);
            }
        } catch (error) {
            console.error("Erreur fetchSubCategories:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, selectedCategory, selectedSubCategory, sortBy]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchSubCategories(selectedCategory);
        } else {
            setSubCategories([]);
            setSelectedSubCategory(null);
        }
    }, [selectedCategory]);

    // -----------------------------
    // Handlers
    // -----------------------------
    const openProductDetail = (product: Product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`${product.name} ajouté au panier`);
    };

    // -----------------------------
    // Renders
    // -----------------------------
    const renderCardSkeleton = () => (
        Array(8).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-[2.5rem]" />
                <div className="space-y-2 px-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        ))
    );


    const heroSlides: HeroSlide[] = [
        {
            id: 1,
            image: "/ads/images.jpg",
            titleLines: [
                "Tarafé est une plateforme digitale de personnalisation",
                "des produits mode, accessoires et déco, avec une touche africaine,",
                "pour les entreprises et les particuliers. Bienvenue !"
            ],
        },
    ];

    return (

        <div className="relative min-h-screen bg-background  mt-12 md:mt-0">
            {/* Store Navigation Indicator (Floating Cart) */}
            <div className="fixed bottom-8 right-8 z-[900]">
                <button onClick={() => setIsCartModalOpen(true)} className="relative group p-4 bg-brand-primary text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300">
                    <Icon icon="solar:cart-large-bold" width={20} />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-brand-primary w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shadow-lg border-2 border-brand-primary animate-in zoom-in">
                            {totalItems}
                        </span>
                    )}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                        Voir mon panier
                    </div>
                </button>
            </div>

            <section className="max-w-7xl mx-auto px-6 py-8 pb-32">
                <ProductHero data={heroSlides} />

                <div className="mt-16 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-secondary dark:text-white leading-tight">
                            Notre Boutique <span className="text-brand-primary">Tarafé</span>
                        </h2>
                        <p className="text-gray-400 font-medium">Découvrez notre collection exclusive de produits premium.</p>
                    </div>

                    {/* Search & Sort (Simplified for now) */}
                    <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border">
                        <div className="relative">
                            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                                className="bg-background border-none rounded-xl pl-10 h-11 text-sm focus:ring-2 focus:ring-brand-primary/20 w-full md:w-64"
                            />
                        </div>
                        <button onClick={() => fetchData()} className="right-10 p-2 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">
                            <Icon icon="solar:filter-bold" className="w-5 h-5" />
                        </button>
                    </div>

                </div>

                {/* Categories Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <button onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${!selectedCategory ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 border-brand-primary" : "bg-card text-muted-foreground border-border hover:border-brand-primary/50"}`}  >
                        Tous les produits
                    </button>

                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory(null); setCurrentPage(1); }} className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${selectedCategory === cat.id ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 border-brand-primary" : "bg-card text-muted-foreground border-border hover:border-brand-primary/50"}`} >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Sub Categories (Nested) */}
                <AnimatePresence>
                    {subCategories.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-border" >
                            {subCategories.map((sub) => (
                                <button key={sub.id} onClick={() => { setSelectedSubCategory(sub.id); setCurrentPage(1); }} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedSubCategory === sub.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}  >
                                    {sub.name}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    {loading ? renderCardSkeleton() : (
                        products.map((product) => {
                            const price = parseFloat(product.price).toLocaleString();

                            return (
                                <div key={product.id} className="group cursor-pointer flex flex-col" onClick={() => openProductDetail(product)}  >
                                    <div className="relative aspect-[3/4] w-full rounded-2xl bg-muted overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                                        {/* Badges */}
                                        {product.tag && (
                                            <div className="absolute top-5 left-5 z-20">
                                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${product.tag === "NEW ARRIVAL" ? "bg-white text-black shadow-lg" : "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"}`}>
                                                    {product.tag}
                                                </span>
                                            </div>
                                        )}

                                        {/* Actions Overlay */}
                                        {/* Actions Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 p-6 z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex gap-2">

                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="flex-1 bg-white py-4 rounded-2xl text-black font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                                >
                                                    {/* Icon visible seulement sur mobile */}
                                                    <span className="md:hidden">
                                                        <Icon icon="solar:cart-plus-bold" width={20} />
                                                    </span>

                                                    {/* Texte visible seulement sur desktop */}
                                                    <span className="hidden md:inline">
                                                        Ajouter au panier
                                                    </span>
                                                </button>

                                                <div className="aspect-square w-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-brand-primary transition-all shadow-xl">
                                                    <Icon icon="solar:eye-bold" width={20} />
                                                </div>

                                            </div>
                                        </div>

                                        {/* Image */}
                                        <Image src={`${urlImages}/${product.image}`} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" unoptimized />

                                        {/* Decorative Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Info */}
                                    <div className="mt-4 px-2 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-brand-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <span className="shrink-0 text-sm font-black text-brand-primary">{price} FCFA</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground font-medium">{product.category?.name || "Premium"}</p>
                                            <div className="flex items-center gap-1">
                                                <Icon icon="solar:star-bold" className="text-yellow-400 w-3 h-3" />
                                                <span className="text-[10px] font-bold text-muted-foreground">{product.rating || "4.5"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
                            <Icon icon="solar:box-bold-duotone" width={64} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Aucun produit trouvé</h3>
                        <p className="text-muted-foreground max-w-sm">Désolé, nous n'avons trouvé aucun article correspondant à votre recherche ou catégorie.</p>
                        <button onClick={() => { setSelectedCategory(null); setSearchTerm(""); fetchData(); }} className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:opacity-90 transition-all" >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalItemsCount > limit && (
                    <div className="mt-20 flex items-center justify-center gap-4">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="flex items-center gap-2 px-6 py-3 border border-border rounded-2xl font-bold text-sm hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30"  >
                            <Icon icon="solar:alt-arrow-left-bold" />
                            Précédent
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(totalItemsCount / limit) }, (_, i) => i + 1).map((page) => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-sm transition-all ${currentPage === page ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25" : "text-muted-foreground hover:text-foreground"}`}>
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button disabled={currentPage === Math.ceil(totalItemsCount / limit)} onClick={() => setCurrentPage(p => p + 1)} className="flex items-center gap-2 px-6 py-3 border border-border rounded-2xl font-bold text-sm hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30"  >
                            Suivant
                            <Icon icon="solar:alt-arrow-right-bold" />
                        </button>
                    </div>
                )}
            </section>

            {/* Modals */}
            <ProductDetailModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={selectedProduct}
            />

            <CartDetailModal
                isOpen={isCartModalOpen}
                onClose={() => setIsCartModalOpen(false)}
            />
        </div>

    );
}
