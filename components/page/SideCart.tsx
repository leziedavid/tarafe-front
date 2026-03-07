"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { useCart } from "@/components/providers/CartProvider";
import { useEffect, useState } from "react";
import { getUserAllData } from "@/service/security";
import { getImagesUrl } from "@/types/baseUrl";

interface Props {
  visible?: boolean;
  onRequestClose?(): void;
}

const SideCart: React.FC<Props> = ({ visible, onRequestClose }) => {

  const urlImages = getImagesUrl();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getIsAuthenticated = async () => {
    const res = await getUserAllData()
    if (res.statusCode === 200 && res.data?.user) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    getIsAuthenticated();
  }, []);

  const { cart: cartItems, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const router = useRouter();

  return (
    <Sheet open={visible} onOpenChange={() => { if (onRequestClose) onRequestClose(); }}>
      <SheetContent side="right" className="flex flex-col h-full overflow-y-auto md:max-w-full w-full md:w-1/3">
        {/* Header */}
        <div className="p-4 flex justify-between">
          <SheetHeader>
            <SheetTitle className="font-bold">Votre panier</SheetTitle>
          </SheetHeader>
          <Button onClick={clearCart} variant="ghost" className="text-xs">
            Vider le panier
          </Button>
        </div>

        {/* Panier vide */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <Image src="/ads/empty-cart.webp" alt="Panier vide" className="rounded object-cover" width={200} height={200} />
            <p className="mt-4 text-center text-gray-500 text-lg">Votre panier est vide</p>
          </div>
        ) : (
          cartItems.map((cartItem) => (
            <div key={cartItem.id} className="p-4 flex space-x-4 border-b">
              {/* Image */}
              <div className="relative w-[60px] h-[60px] flex-shrink-0">
                <Image src={cartItem.image ? `${urlImages}/${cartItem.image}` : "/astronaut-grey-scale.svg"} alt={cartItem.name} fill className="rounded object-cover" unoptimized />
              </div>

              {/* Infos produit */}
              <div className="flex-1">
                <h2 className="font-semibold line-clamp-1">{cartItem.name}</h2>
                <div className="flex text-gray-400 text-sm space-x-1">
                  <span>{cartItem.quantity}</span>
                  <span>x</span>
                  <span className="font-bold text-sm">{(cartItem.quantity * Number(cartItem.price)).toLocaleString()} Fcfa</span>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-auto flex flex-col items-end">
                <button
                  onClick={() => removeFromCart(cartItem.id)}
                  className="text-xs text-red-500 font-bold hover:underline mb-2"
                >
                  Retirer
                </button>

                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)} className="w-6 h-6 flex items-center justify-center border rounded-full hover:bg-gray-100">
                    -
                  </button>

                  <span className="w-8 text-center text-sm font-bold">{cartItem.quantity}</span>

                  <button onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)} className="w-6 h-6 flex items-center justify-center border rounded-full hover:bg-gray-100">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Footer */}
        <div className="mt-auto p-4">
          <div className="py-4">
            <h1 className="font-bold text-black text-xl uppercase">Total</h1>
            <p className="font-semibold">
              <span className="text-gray-400 text-black font-normal">Montant total:</span> {totalAmount.toLocaleString()} Fcfa
            </p>
          </div>

          <Button onClick={() => {
            if (isAuthenticated) {
              router.push("/checkout");
              if (onRequestClose) onRequestClose();
            }
          }}
            disabled={!isAuthenticated || cartItems.length === 0} className={`border py-2 w-full rounded uppercase mt-4 ${!isAuthenticated ? "bg-[#B07B5E]/50 text-gray-500 cursor-not-allowed" : "bg-[#B07B5E] hover:bg-[#B07B5E]/50"}`}  >
            Passer au paiement
          </Button>

          {!isAuthenticated && (
            <p
              onClick={() => {
                router.push("/auth/login");
                if (onRequestClose) onRequestClose();
              }}
              className="text-red-500 text-sm mt-2 text-center cursor-pointer hover:underline" >
              Vous devez vous connecter pour continuer.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideCart;
