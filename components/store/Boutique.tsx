"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ProductHero from "./ProductHero";

// -----------------------------
// Product Interface (enrichie)
// -----------------------------
export interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;             // correspond à "image" en BDD
    tag?: "NEW ARRIVAL" | "GET OFF 20%";
    colors: string[];          // de product_colors
    sizes?: string[];          // de product_sizes (manquant pour l'instant)
    stock: number;             // correspond à "stock"
    available: boolean;        // correspond à "available"
    category: string;          // category.name
    subCategory: string;       // sub_category.name
    store: string;             // store.name
    addedBy: string;           // user.name qui a ajouté le produit
}


// -----------------------------
// Fake Data (réaliste)
// -----------------------------
const products: Product[] = [
    {
        id: 1,
        name: "SHIRTS NEW ERA",
        price: 80.99,
        image: "/ads/coup.jpg",
        tag: "NEW ARRIVAL",
        colors: ["#6b7280", "#7c2d12", "#111827"],
        sizes: ["S", "M", "L"],
        stock: 12,
        available: true,
        category: "WINTER COLLECTION",
        subCategory: "SHIRTS",
        store: "Store One",
        addedBy: "Admin",
    },
    {
        id: 2,
        name: "JACKET BOMBER",
        price: 100,
        oldPrice: 120,
        image: "/ads/coup.jpg",
        tag: "GET OFF 20%",
        colors: ["#374151", "#a16207", "#14532d"],
        sizes: ["M", "L", "XL"],
        stock: 5,
        available: true,
        category: "WINTER COLLECTION",
        subCategory: "JACKETS",
        store: "Store Two",
        addedBy: "Admin",
    },
    {
        id: 3,
        name: "JACKET WINTER LONG",
        price: 150.3,
        image: "/ads/coup.jpg",
        colors: ["#d1d5db", "#374151", "#78350f"],
        sizes: ["M", "L", "XL"],
        stock: 0,
        available: false,
        category: "FLASH SALE",
        subCategory: "JACKETS",
        store: "Store Three",
        addedBy: "Admin",
    },
    {
        id: 4,
        name: "FLEECE JACKET",
        price: 95.5,
        image: "/ads/coup.jpg",
        colors: ["#166534", "#f97316"],
        sizes: ["M", "L", "XL"],
        stock: 8,
        available: true,
        category: "BEST SELLERS",
        subCategory: "FLEECE",
        store: "Store Four",
        addedBy: "Admin",
    },
    {
        id: 5,
        name: "PUFFER BLUE",
        price: 180,
        image: "/ads/coup.jpg",
        colors: ["#1e3a8a", "#93c5fd"],
        sizes: ["S", "M", "L"],
        stock: 3,
        available: true,
        category: "NEW ARRIVALS",
        subCategory: "PUFFERS",
        store: "Store Five",
        addedBy: "Admin",
    },
    {
        id: 6,
        name: "HOODIE CARDIGAN",
        price: 110,
        image: "/ads/coup.jpg",
        colors: ["#064e3b", "#facc15"],
        sizes: ["S", "M", "L"],
        stock: 0,
        available: false,
        category: "WINTER COLLECTION",
        subCategory: "HOODIES",
        store: "Store Six",
        addedBy: "Admin",
    },
];

// -----------------------------
// Component
// -----------------------------
export default function Store() {
    const [activeCategory, setActiveCategory] = useState<string>("ALL");
    const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
    const [maxPrice, setMaxPrice] = useState<number>(200);

    const categories = [
        "ALL",
        "WINTER COLLECTION",
        "NEW ARRIVALS",
        "BEST SELLERS",
        "FLASH SALE",
    ];

    const subCategories = useMemo(() => {
        if (activeCategory === "ALL") return [];
        return Array.from(
            new Set(
                products
                    .filter((p) => p.category === activeCategory)
                    .map((p) => p.subCategory)
            )
        );
    }, [activeCategory]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCategory =
                activeCategory === "ALL" || p.category === activeCategory;
            const matchSub = !activeSubCategory || p.subCategory === activeSubCategory;
            const matchPrice = p.price <= maxPrice;
            return matchCategory && matchSub && matchPrice;
        });
    }, [activeCategory, activeSubCategory, maxPrice]);

    return (
        <section className="max-w-7xl mx-auto px-6 py-2">

            <ProductHero />

            <h2 className="text-3xl font-medium mb-6 mt-12"> Notre boutique en ligne </h2>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setActiveCategory(cat);
                            setActiveSubCategory(null);
                        }}
                        className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${activeCategory === cat
                            ? "bg-black text-white"
                            : "bg-white text-black border-gray-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sub categories */}
            {subCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {subCategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => setActiveSubCategory(sub)}
                            className={`px-4 py-1.5 rounded-full font-medium text-xs border ${activeSubCategory === sub ? "bg-[#c08457] text-white" : "bg-white text-gray-600"}`} >
                            {sub}
                        </button>
                    ))}
                </div>
            )}

            {/* Price filter */}
            <div className="mb-10 max-w-xs">
                <label className="text-sm font-medium">Max price: ${maxPrice}</label>
                <input
                    type="range"
                    min={0}
                    max={200}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Grid (cards plus étroites comme le design) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="group">
                        <div className="relative rounded-3xl bg-[#efefec] overflow-hidden">
                            {/* Tag */}
                            {product.tag && (
                                <span
                                    className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold ${product.tag === "NEW ARRIVAL" ? "bg-white text-black" : "bg-[#c08457] text-white"
                                        }`}
                                >
                                    {product.tag}
                                </span>
                            )}

                            {/* Overlay Add / Buy */}
                            {product.oldPrice && product.available && (
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 sm:group-hover:opacity-100 transition">
                                    <button className="bg-white text-black px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold mb-2">
                                        ADD TO CART
                                    </button>
                                    <button className="border border-white text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold">
                                        BUY NOW
                                    </button>
                                </div>
                            )}

                            {/* Image */}
                            <div
                                className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] bg-center bg-cover rounded-3xl"
                                style={{ backgroundImage: `url(${product.image})` }}
                            />
                        </div>

                        {/* Card info */}
                        <div className="mt-2 sm:mt-3 px-1 sm:px-2">
                            <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>

                            <div className="flex items-center gap-2 mt-1">
                                {product.oldPrice && (
                                    <span className="line-through text-gray-400 text-sm">
                                        ${product.oldPrice.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-[#c08457] font-bold">${product.price.toFixed(2)}</span>
                            </div>

                            <p className={`text-xs mt-1 ${product.available ? "text-green-600" : "text-red-500"}`}>
                                {product.available ? `In stock (${product.stock})` : "Out of stock"}
                            </p>

                            {/* Couleurs */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {product.colors.map((color, i) => (
                                        <span
                                            key={i}
                                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Tailles */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="flex gap-2 mt-1 flex-wrap">
                                    {product.sizes.map((size, i) => (
                                        <span key={i} className="px-2 py-0.5 text-xs border rounded">
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>


        </section>
    );
}
