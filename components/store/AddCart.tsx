"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartProvider";
import { Product } from "@/types/interfaces";

interface Props {
    product: Product;
}

const AddCart = ({ product }: Props) => {
    const { updateCart } = useCart();
    const router = useRouter();

    return (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 sm:group-hover:opacity-100 transition z-10">
            {/* ADD TO CART */}
            <button onClick={() => updateCart(product, 1)} className="bg-white text-black px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold mb-2" >
                ADD TO CART
            </button>

            {/* BUY NOW */}
            <button onClick={() => { updateCart(product, 1); router.push("/checkout");  }}  className="border border-white text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-semibold" >
                BUY NOW
            </button>

        </div>
    );
};

export default AddCart;
