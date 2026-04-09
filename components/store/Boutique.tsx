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
                <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setIsCartModalOpen(true)}
                    className="relative p-3.5 bg-brand-primary text-white rounded-2xl shadow-2xl shadow-brand-primary/40"
                >
                    <Icon icon="solar:cart-large-bold" width={22} />
                    {totalItems > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-white text-brand-primary min-w-[1.4rem] h-[1.4rem] flex items-center justify-center rounded-full text-[10px] font-black shadow border-2 border-brand-primary px-1"
                        >
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
                <div className="mb-7">
                    <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">Notre Collection</span>
                    <h2 className="text-3xl md:text-4xl font-black text-foreground mt-1">
                        Boutique <span className="text-brand-primary">Tarafé</span>
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1.5">Découvrez notre collection exclusive de produits premium.</p>
                </div>

                {/* Search + Sort */}
                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                    <div className="relative flex-1">
                        <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchData()}
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'date' | 'stock')}
                            className="bg-card border border-border rounded-xl px-3 h-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
                        >
                            <option value="date">Plus récents</option>
                            <option value="price">Par prix</option>
                            <option value="name">Par nom</option>
                            <option value="stock">Par stock</option>
                        </select>
                        <button
                            onClick={fetchData}
                            className="px-4 h-11 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20 flex items-center gap-2 font-semibold text-sm"
                        >
                            <Icon icon="solar:magnifer-bold" width={16} />
                            <span className="hidden sm:inline">Chercher</span>
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="overflow-x-auto scrollbar-hide mb-2">
                    <div className="flex items-center gap-2 pb-1 min-w-max">
                        <button
                            onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); setCurrentPage(1); }}
                            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${!selectedCategory
                                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                                : "bg-card text-muted-foreground border border-border hover:border-brand-primary/40 hover:text-foreground"}`}
                        >
                            Tous les produits
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory(null); setCurrentPage(1); }}
                                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${selectedCategory === cat.id
                                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                                    : "bg-card text-muted-foreground border border-border hover:border-brand-primary/40 hover:text-foreground"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub Categories */}
                <AnimatePresence>
                    {subCategories.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="overflow-x-auto scrollbar-hide pt-3 mb-2">
                                <div className="flex items-center gap-2 pb-1 min-w-max">
                                    {subCategories.map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => { setSelectedSubCategory(sub.id); setCurrentPage(1); }}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${selectedSubCategory === sub.id
                                                ? "bg-foreground text-background"
                                                : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Count */}
                {!loading && products.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-4 mb-6">
                        {totalItemsCount} produit{totalItemsCount > 1 ? "s" : ""} trouvé{totalItemsCount > 1 ? "s" : ""}
                    </p>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {loading ? renderCardSkeleton() : (
                        products.map((product, index) => {
                            const price = parseFloat(product.price).toLocaleString();

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04, duration: 0.35 }}
                                    className="group cursor-pointer"
                                    onClick={() => openProductDetail(product)}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                                        {/* Tag */}
                                        {product.tag && (
                                            <span className={`absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${product.tag === "NEW ARRIVAL" ? "bg-white text-black" : "bg-brand-primary text-white"}`}>
                                                {product.tag}
                                            </span>
                                        )}

                                        {/* Image */}
                                        <Image
                                            src={`${urlImages}/${product.image}`}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            unoptimized
                                        />

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <motion.span
                                                initial={false}
                                                className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                                            >
                                                Voir le produit
                                            </motion.span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="mt-3 px-0.5">
                                        <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-brand-primary transition-colors leading-snug">
                                            {product.name}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {product.category?.name || "Premium"}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-black text-brand-primary text-sm">
                                                {price}
                                                <span className="text-[10px] font-bold ml-0.5">FCFA</span>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    <Icon icon="solar:star-bold" className="text-yellow-400 w-3 h-3" />
                                                    <span className="text-[10px] text-muted-foreground font-semibold">{product.rating || "4.5"}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    title="Ajouter au panier"
                                                    className="p-1.5 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                                                >
                                                    <Icon icon="solar:cart-plus-bold" width={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-5">
                            <Icon icon="solar:box-bold-duotone" width={38} className="text-brand-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Aucun produit trouvé</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Aucun article ne correspond à votre recherche ou à cette catégorie.
                        </p>
                        <button
                            onClick={() => { setSelectedCategory(null); setSearchTerm(""); fetchData(); }}
                            className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalItemsCount > limit && (
                    <div className="mt-14 flex items-center justify-center gap-1.5">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <Icon icon="solar:alt-arrow-left-bold" width={15} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold text-sm transition-all ${currentPage === page
                                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <Icon icon="solar:alt-arrow-right-bold" width={15} />
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
