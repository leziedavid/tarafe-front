"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartProvider";
import { Product } from "@/types/interfaces";
import { useState } from "react";
import ProductDetail from "./ProductDetail";
import { getImagesUrl } from "@/types/baseUrl";
import MyModal from "../modal/MyModal";

interface Props {
    product: Product;
}

const AddCart = ({ product }: Props) => {
    const { updateCart } = useCart();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selecteProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleBack = () => {
        setOpen(false);
    };

    const handleNegotiate = (product: Product) => {
        console.log('Négociation pour:', product.name);
        // Implémentez votre logique de négociation ici
        alert(`Négociation démarrée pour ${product.name}`);
    };

    const handleOrder = (product: Product) => {
        console.log('Commande pour:', product.name);
        // Implémentez votre logique de commande ici
        router.push(`/checkout?product=${product.id}`);
    };

    const openDetail = (items: Product) => {
        setSelectedProduct(items)
        setOpen(true)
    };


    return (

        <>


            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 sm:group-hover:opacity-100 transition z-10">
                {/* ADD TO CART */}
                <button onClick={() => updateCart(product, 1)} className="bg-white text-black px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold mb-2" >
                    AJOUTER AU PANIER 🛒
                </button>

                {/* BUY NOW */}
                <button onClick={() => { openDetail(product) }} className="border border-white text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold" >
                    DETAIL
                </button>

            </div>

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile">
                <ProductDetail product={selecteProduct} onBack={handleBack} onNegotiate={handleNegotiate} onOrder={handleOrder} imageBaseUrl={getImagesUrl()} />
            </MyModal>
        </>

    );
};

export default AddCart;
