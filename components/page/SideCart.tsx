"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { useCart } from "@/app/context/CartProvider";
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

  const { items: cartItems, updateCart, removeFromCart, countTotalPrice, clearCart } = useCart();
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
            <div key={cartItem.product.id} className="p-4 flex space-x-4 border-b">
              {/* Image */}
              <Image src={ cartItem.product.image ? `${urlImages}/${cartItem.product.image}` : "/astronaut-grey-scale.svg" } alt="" className="rounded object-cover" width={60} height={60} unoptimized/>

              {/* Infos produit */}
              <div className="flex-1">
                <h2 className="font-semibold">{cartItem.product.name}</h2>
                <div className="flex text-gray-400 text-sm space-x-1">
                  <span>{cartItem.count}</span>
                  <span>x</span>
                  <span className="font-bold text-sm">{cartItem.count * Number(cartItem.product.price)} Fcfa</span>
                </div>
              </div>

              {/* Actions */}
              <div className="ml-auto">
                <button
                  onClick={() => removeFromCart(cartItem.product)}
                  className="text-xs text-black font-bold hover:underline"
                >
                  Retirer
                </button>

                <div className="flex items-center justify-between mt-2 space-x-2">
                  <button onClick={() => updateCart(cartItem.product, -1)} className="text-lg">
                    -
                  </button>

                  {/* Input modifiable */}
                  <input type="number"  min={0}  className="w-14 text-center border rounded text-sm"  value={cartItem.count}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 0;
                      const diff = newQty - cartItem.count; // on calcule la différence
                      updateCart(cartItem.product, diff); // on ajuste avec le contexte
                    }}  />

                  <button onClick={() => updateCart(cartItem.product, 1)} className="text-lg">  +  </button>
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
              <span className="text-gray-400 text-black font-normal">Montant total:</span> {countTotalPrice()} Fcfa
            </p>
          </div>

          <Button onClick={() => {
            if (isAuthenticated) {
              router.push("/checkout");
              if (onRequestClose) onRequestClose();
            }
          }}
            disabled={!isAuthenticated} className={`border py-2 w-full rounded uppercase mt-4 ${!isAuthenticated ? "bg-[#B07B5E]/50 text-gray-500 cursor-not-allowed" : "bg-[#B07B5E] hover:bg-[#B07B5E]/50"}`}  >
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
