"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Spinner } from "../spinner/Loader";

interface Product {
    id: number;
    name: string;
    price: number;
    colors: string;
    image: string;
    category: string;
}

const products: Product[] = [
    {
        id: 1,
        name: "The Classic Knit Polo",
        price: 12.0,
        colors: "7 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "MEN'S",
    },
    {
        id: 2,
        name: "Zip Jacket",
        price: 16.25,
        colors: "2 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "JACKET",
    },
    {
        id: 3,
        name: "The Utility Jacket",
        price: 25.0,
        colors: "3 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "WOMEN'S",
    },
    {
        id: 4,
        name: "The Suede Jacket",
        price: 18.75,
        colors: "7 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "SUITS",
    },
    {
        id: 5,
        name: "Casual Hoodie",
        price: 14.5,
        colors: "5 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "HOODIE",
    },
    {
        id: 6,
        name: "Urban Crewneck",
        price: 10.99,
        colors: "3 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "CREWNECK",
    },
    {
        id: 7,
        name: "Slim T-Shirt",
        price: 8.75,
        colors: "4 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "T-SHIRT",
    },
    {
        id: 8,
        name: "Elegant Dress",
        price: 21.0,
        colors: "2 Colors available",
        image: "/ads/fille-noir.jpg",
        category: "WOMEN'S",
    },
];

const categories = ["ALL", "WOMEN'S", "MEN'S", "T-SHIRT", "SUITS", "CREWNECK", "JACKET", "HOODIE"];

export default function ProductList() {
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [loading, setLoading] = useState(false);

    // Fonction de filtrage avec spinner
    const handleFilter = (category: string) => {
        setActiveCategory(category);
        setLoading(true);

        setTimeout(() => {
            if (category === "ALL") {
                setFilteredProducts(products);
            } else {
                setFilteredProducts(products.filter((p) => p.category === category));
            }
            setLoading(false);
        }, 700); // petit délai pour montrer le spinner
    };

    useEffect(() => {
        setFilteredProducts(products);
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    NOUVEAUTÉS
                </h2>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Voir plus
                </a>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleFilter(category)}
                        className={`px-5 py-2 rounded-full border font-medium text-sm sm:text-base transition-all duration-200 ${activeCategory === category
                                ? "bg-[#fd980e] text-white border-[#fd980e] scale-105"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Product Grid ou Spinner */}
            {loading ? (
                <div className="flex justify-center items-center h-60">
                    <Spinner />
                </div>
            ) : (
                <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-300 animate-fadeIn"
                    key={activeCategory}
                >
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col transform hover:scale-[1.02] transition-transform"
                        >
                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 rounded-md">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="mt-4 flex flex-col">
                                <h3 className="text-xl font-bold text-black hover:text-[#fd980e] transition-colors duration-200">
                                    {product.name}
                                </h3>
                                <div className="flex justify-between mt-1">
                                    <p className="text-gray-600 text-sm">{product.colors}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
