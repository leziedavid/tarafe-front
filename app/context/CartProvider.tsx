"use client";

import { useAlert } from "@/contexts/AlertContext";
import { Product } from "@/types/interfaces";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type cartItem = {
  product: Product;
  count: number;
};

interface CartContext {
  items: cartItem[];
  updateCart(product: Product, qty: number): void;
  removeFromCart(product: Product): void;
  countAllItems(): number;
  countTotalPrice(): string;
  clearCart(): void;
}

const updateCartInLS = (products: cartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(products));
};

const CartContext = createContext<CartContext>({} as CartContext);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const { showAlert } = useAlert();

  // 🗑 SUPPRIMER UN PRODUIT
  const removeFromCart = (product: Product) => {
    const newProducts = cartItems.filter(
      (item) => item.product.id !== product.id
    );

    setCartItems(newProducts);
    updateCartInLS(newProducts);
    showAlert(`❌ ${product.name} retiré du panier`, "success");
  };

  // 🧹 VIDER LE PANIER
  const clearCart = () => {
    setCartItems([]);
    updateCartInLS([]);
    showAlert("🧹 Panier vidé avec succès", "success");
  };

  // ➕ AJOUT / MISE À JOUR PANIER
  const updateCart = (product: Product, qty: number) => {
    const finalCartItems = [...cartItems];
    const index = finalCartItems.findIndex(
      (item) => item.product.id === product.id
    );

    // 🆕 Nouveau produit
    if (index === -1) {
      if (qty > product.stock) {
        showAlert(  `Stock insuffisant : seulement ${product.stock} disponible(s)`, "error"  );
        return;
      }

      finalCartItems.push({ count: qty, product });
      setCartItems(finalCartItems);
      updateCartInLS(finalCartItems);

      showAlert(`✅ ${product.name} ajouté au panier`, "success");
      return;
    }

    // 🔁 Produit existant
    const newQty = finalCartItems[index].count + qty;

    if (newQty > product.stock) {
      showAlert( `Stock insuffisant : seulement ${product.stock} disponible(s)`,  "error" );
      return;
    }

    if (newQty <= 0) {
      removeFromCart(product);
      return;
    }

    finalCartItems[index].count = newQty;
    setCartItems(finalCartItems);
    updateCartInLS(finalCartItems);
    showAlert( `🔄 Quantité mise à jour (${newQty}) pour ${product.name}`, "success" );
  };

  // 📊 COMPTE ARTICLES
  const countAllItems = () =>
    cartItems.reduce((total, item) => total + item.count, 0);

  // 💰 TOTAL PRIX
  const countTotalPrice = () =>
    cartItems
      .reduce(
        (total, item) =>
          total + Number(item.product.price) * item.count,
        0
      )
      .toFixed(2);

  // ♻️ Charger depuis le localStorage
  useEffect(() => {
    const result = localStorage.getItem("cartItems");
    if (result) {
      setCartItems(JSON.parse(result));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        updateCart,
        removeFromCart,
        clearCart,
        countAllItems,
        countTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
