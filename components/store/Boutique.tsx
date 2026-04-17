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
    const [isFilterVisible, setIsFilterVisible] = useState(false);

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
    const renderCardSkeleton = () =>
        Array(8).fill(0).map((_, i) => (
            <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                <div className="space-y-2 px-1">
                    <Skeleton className="h-3.5 w-3/4 rounded-lg" />
                    <Skeleton className="h-3 w-1/2 rounded-lg" />
                    <Skeleton className="h-3.5 w-1/3 rounded-lg" />
                </div>
            </div>
        ));

    const heroSlides: HeroSlide[] = [
        {
            id: 1,
            image: "/ads/images.jpg",
            titleLines: [
                "Personnalisation à votre image",
                "Mode, accessoires et déco avec une touche africaine, pour entreprises et particuliers.",
            ],
        },
    ];

    const totalPages = Math.ceil(totalItemsCount / limit);

    return (
        <div className="relative min-h-screen bg-background">

            {/* Floating Cart Button */}
            <div className="fixed bottom-7 right-5 z-[900]">
                <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={() => setIsCartModalOpen(true)} className="relative p-3.5 bg-brand-primary text-white rounded-2xl shadow-2xl shadow-brand-primary/40">
                    <Icon icon="solar:cart-large-bold" width={22} />
                    {totalItems > 0 && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-white text-brand-primary min-w-[1.4rem] h-[1.4rem] flex items-center justify-center rounded-full text-[10px] font-black shadow border-2 border-brand-primary px-1">
                            {totalItems}
                        </motion.span>
                    )}
                </motion.button>
            </div>

            {/* Hero */}
            <div className="px-4 sm:px-6 pt-14 md:pt-6 max-w-7xl mx-auto">
                <ProductHero data={heroSlides} />
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-32">

                {/* Section Header */}
                <div className="mb-10 text-center md:text-left">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-brand-primary font-bold text-[10px] uppercase tracking-[0.2em]">Excellence Crafts</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-none mb-4">
                        Boutique <span className="text-brand-primary">Tarafé</span>
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl font-medium leading-relaxed">
                        Découvrez une collection exclusive où l'artisanat traditionnel rencontre le design contemporain.
                    </p>
                </div>

                {/* Search + Sort + Filter Toggle */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="relative flex-1 w-full">
                        <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                        <input type="text" placeholder="Rechercher l'exceptionnel..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchData()} className="w-full bg-background/50 border rounded-xl pl-12 pr-4 h-10 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium" />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button onClick={() => setIsFilterVisible(!isFilterVisible)} className={`flex-1 md:flex-none h-10 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm transition-all border ${isFilterVisible ? "bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20" : "bg-background/50 text-foreground border-border/50 hover:bg-background"}`} >
                            <Icon icon={isFilterVisible ? "solar:filter-cross-bold-duotone" : "solar:filter-bold-duotone"} width={20} />
                            Filtres
                        </button>

                        <div className="relative flex-1 md:flex-none">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'date' | 'stock')} className="w-full h-10 pl-10 pr-6 bg-background/50 border border-border/50 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer" >
                                <option value="date">Plus récents</option>
                                <option value="price">Par prix</option>
                                <option value="name">Par nom</option>
                                <option value="stock">Par stock</option>
                            </select>
                            <Icon icon="solar:sort-vertical-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Categories & Subcategories (Collapsible) */}
                <AnimatePresence>
                    {isFilterVisible && (
                        <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 20 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="backdrop-blur-sm p-4 md:p-6 overflow-hidden" >
                            <div className="space-y-4">
                                {/* Main Categories */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Icon icon="solar:tag-bold-duotone" className="text-brand-primary w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégories</span>
                                    </div>
                                    <div className="flex overflow-x-auto md:flex-wrap gap-2 pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                                        <button onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setCurrentPage(1); }} className={`shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${!selectedCategory ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/50"}`} >
                                            <Icon icon="solar:widget-add-bold-duotone" width={18} />
                                            Tous les produits
                                        </button>
                                        {categories.map((cat) => (
                                            <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory(null); setCurrentPage(1); }} className={`shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${selectedCategory === cat.id ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/50"}`} >
                                                <Icon icon="solar:tag-bold-duotone" width={18} />
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sub Categories */}
                                <AnimatePresence>
                                    {subCategories.length > 0 && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="pt-4 border-t" >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon icon="solar:layers-minimalistic-bold-duotone" className="text-brand-primary w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sous-Catégories</span>
                                            </div>
                                            <div className="flex overflow-x-auto md:flex-wrap gap-2 pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                                                {subCategories.map((sub) => (
                                                    <button key={sub.id} onClick={() => { setSelectedSubCategory(sub.id); setCurrentPage(1); }} className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${selectedSubCategory === sub.id ? "bg-foreground text-background shadow-lg shadow-foreground/20" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`} >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Section */}
                <div className="mt-8">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {renderCardSkeleton()}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-8 px-1">
                                {totalItemsCount} produit{totalItemsCount > 1 ? "s" : ""} d'exception trouvé{totalItemsCount > 1 ? "s" : ""}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 leading-normal">
                                {products.map((product, index) => {
                                    const currentPrice = parseFloat(product.price);
                                    const oldPrice = product.old_price ? parseFloat(product.old_price) : null;
                                    const hasDiscount = oldPrice && oldPrice > currentPrice;
                                    const discountPercentage = hasDiscount ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

                                    return (
                                        <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }} className="group relative flex flex-col h-full backdrop-blur-sm  p-2 hover:bg-card/60 transition-all duration-300" >
                                            {/* Image Container */}
                                            <div className="relative aspect-[4/5] rounded-[1rem] overflow-hidden bg-muted cursor-pointer" onClick={() => openProductDetail(product)} >
                                                {/* Status Badges */}
                                                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                                    {product.tag && (
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md ${product.tag === "NEW ARRIVAL" ? "bg-white text-black" : "bg-brand-primary text-white"}`}>
                                                            {product.tag}
                                                        </span>
                                                    )}
                                                    {hasDiscount && (
                                                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg shadow-emerald-500/30">
                                                            -{discountPercentage}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Main Image */}
                                                <Image src={`${urlImages}/${product.image}`} alt={product.name} fill className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" unoptimized />

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                                    <motion.button initial={false} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500" >
                                                        <Icon icon="solar:eye-bold" width={16} />
                                                        Aperçu rapide
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="mt-5 space-y-3 px-3 pb-4">
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <Icon icon="solar:tag-bold-duotone" className="text-brand-primary w-3 h-3" />
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {product.category?.name || "Premium Collection"}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-extrabold text-base text-foreground line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors cursor-pointer" onClick={() => openProductDetail(product)}>
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                <div className="flex items-end justify-between gap-4 pt-2">
                                                    <div className="flex flex-col">
                                                        {oldPrice && (
                                                            <span className="text-xs text-muted-foreground/60 line-through font-bold mb-0.5">
                                                                {oldPrice.toLocaleString()} <span className="text-[8px]">FCFA</span>
                                                            </span>
                                                        )}
                                                        <span className="font-black text-xl text-brand-primary leading-none flex items-baseline gap-1">
                                                            {currentPrice.toLocaleString()}
                                                            <span className="text-[10px] font-black tracking-tighter">FCFA</span>
                                                        </span>
                                                    </div>

                                                    <button onClick={(e) => handleAddToCart(e, product)} className="w-11 h-11 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all duration-300 active:scale-90" aria-label="Ajouter au panier" >
                                                        <Icon icon="solar:cart-large-bold-duotone" width={22} />
                                                    </button>
                                                </div>

                                                {/* Meta Info */}
                                                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Icon icon="solar:star-bold" className="text-yellow-400 w-3 h-3" />
                                                        <span className="text-[10px] text-muted-foreground font-black">
                                                            {product.rating || "4.5"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-emerald-500">
                                                        <Icon icon="solar:box-minimalistic-bold-duotone" width={12} />
                                                        <span className="text-[9px] font-bold">En Stock</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center mb-6">
                                <Icon icon="solar:box-bold-duotone" width={44} className="text-brand-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-foreground mb-3">Aucun produit trouvé</h3>
                            <p className="text-muted-foreground text-sm max-w-xs font-medium leading-relaxed">
                                Nous n'avons pas trouvé de pépites correspondant à votre recherche. Essayez d'ajuster vos filtres.
                            </p>
                            <button onClick={() => { setSelectedCategory(null); setSearchTerm(""); fetchData(); }} className="mt-8 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/25 active:scale-95" >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalItemsCount > limit && (
                    <div className="mt-14 flex items-center justify-center gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border/50 text-muted-foreground hover:bg-brand-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm" >
                            <Icon icon="solar:alt-arrow-left-bold" width={18} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all ${currentPage === page ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-accent border border-border/30"}`} >
                                {page}
                            </button>
                        ))}

                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border/50 text-muted-foreground hover:bg-brand-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm" >
                            <Icon icon="solar:alt-arrow-right-bold" width={18} />
                        </button>
                    </div>
                )}

            </section>

            {/* Modals */}
            <ProductDetailModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} product={selectedProduct} />
            <CartDetailModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
        </div>
    );
}
