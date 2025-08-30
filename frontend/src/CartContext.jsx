import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

const getAuthHeader = () => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const normalizeItems = (rawItems = []) => {
  return rawItems
    .map(item => {
      const id = item._id || item.productId || item.product?._id;
      const productId = item.productId || item.product?._id;
      const name = item.product?.name || item.name || "Unnamed";
      const price = item.price ?? item.product?.price ?? 0;
      const imageUrl = item.product?.imageUrl || item.imageUrl || "";

      return {
        ...item,
        id,
        productId,
        name,
        price,
        imageUrl,
        quantity: item.quantity || 0,
      };
    })
    .filter(item => item.id != null);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("https://groccery-app-backend.onrender.com/api/cart", {
        ...getAuthHeader(),
        withCredentials: true,
      });

      const rawItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : data.cart?.items || [];

      setCart(normalizeItems(rawItems));
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    try {
      const { data } = await axios.get(
        "https://groccery-app-backend.onrender.com/api/cart",
        getAuthHeader()
      );

      const rawItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : data.cart?.items || [];

      setCart(normalizeItems(rawItems));
    } catch (err) {
      console.error("Error refreshing cart:", err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        "https://groccery-app-backend.onrender.com/api/cart",
        { productId, quantity },
        getAuthHeader()
      );
      await refreshCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const updateQuantity = async (lineId, quantity) => {
    try {
      await axios.put(
        `https://groccery-app-backend.onrender.com/api/cart/${lineId}`,
        { quantity },
        getAuthHeader()
      );
      await refreshCart();
    } catch (err) {
      console.error("Error updating the cart:", err);
    }
  };

  const removeFromCart = async (lineId) => {
    try {
      await axios.delete(
        `https://groccery-app-backend.onrender.com/api/cart/${lineId}`,
        getAuthHeader()
      );
      await refreshCart();
    } catch (err) {
      console.error("Error removing from cart", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(
        "https://groccery-app-backend.onrender.com/api/cart/clear",
        {},
        getAuthHeader()
      );
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
