import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("elmore-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    localStorage.setItem("elmore-cart", JSON.stringify(cart));
  }, [cart]);

  const getPid = (p) => p?._id || p?.id;

  const addToCart = (product, quantity = 1) => {
    const pid = getPid(product);
    setCart(prev => {
      const existing = prev.find(item => getPid(item) === pid);
      if (existing) {
        return prev.map(item =>
          getPid(item) === pid ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { ...product, qty: quantity }];
    });
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => getPid(item) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const item = prev.find(i => getPid(i) === id);
      if (!item) return prev;
      if (item.qty + delta <= 0) return prev.filter(i => getPid(i) !== id);
      return prev.map(i => getPid(i) === id ? { ...i, qty: i.qty + delta } : i);
    });
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartOpen,
      setCartOpen,
      cartBump,
      subtotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
