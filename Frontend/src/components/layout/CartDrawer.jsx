import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/theme";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setCartOpen(false);
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    } else if (!user.address) {
      navigate("/add-address", { state: { from: { pathname: "/checkout" } } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            style={{ 
              position: "fixed", 
              inset: 0, 
              background: "rgba(0,0,0,.38)", 
              zIndex: 200, 
              backdropFilter: "blur(3px)" 
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed", 
              top: 0, 
              right: 0, 
              height: "100vh", 
              width: 400, 
              maxWidth: "100vw",
              background: COLORS.white, 
              zIndex: 201, 
              boxShadow: "-8px 0 40px rgba(0,0,0,.18)",
              display: "flex", 
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: "20px 24px", 
              borderBottom: `2px solid ${COLORS.creamDark}`, 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              flexShrink: 0 
            }}>
              <h2 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: 22, color: COLORS.text }}>My Cart 🛒</h2>
              <button 
                onClick={() => setCartOpen(false)} 
                style={{ 
                  background: COLORS.grayLight, 
                  border: "none", 
                  width: 36, 
                  height: 36, 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}>
                  <div style={{ fontSize: 70 }}>🛒</div>
                  <p style={{ 
                    color: COLORS.textLight, 
                    fontFamily: "'Nunito',sans-serif", 
                    fontSize: 15, 
                    marginTop: 12,
                    marginBottom: 24
                  }}>Your cart is empty</p>
                  <button 
                    onClick={() => setCartOpen(false)} 
                    style={{ 
                      background: COLORS.teal, 
                      color: "white", 
                      border: "none", 
                      borderRadius: 12, 
                      padding: "12px 24px", 
                      fontWeight: 700,
                      fontFamily: "'Fredoka One',sans-serif"
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => {
                  const itemName = typeof item.name === 'object' ? item.name.en : item.name;
                  const itemId = item._id || item.id;
                  const isImageUrl = item.image?.startsWith('http');

                  return (
                    <div key={itemId} style={{ 
                      display: "flex", 
                      gap: 12, 
                      alignItems: "center", 
                      padding: "14px 0", 
                      borderBottom: `1px solid ${COLORS.grayLight}` 
                    }}>
                      <div style={{ 
                        width: 65, 
                        height: 65, 
                        borderRadius: 14, 
                        background: item.bg || COLORS.tealPale, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: isImageUrl ? 0 : 32, 
                        flexShrink: 0,
                        overflow: "hidden"
                      }}>
                        {isImageUrl ? (
                          <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          item.image || item.emoji || "📦"
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: 14, 
                          fontFamily: "'Nunito',sans-serif", 
                          color: COLORS.text, 
                          overflow: "hidden", 
                          textOverflow: "ellipsis", 
                          whiteSpace: "nowrap" 
                        }}>{itemName}</div>
                        <div style={{ fontSize: 12, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif" }}>{item.unit}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.teal, fontFamily: "'Fredoka One',sans-serif" }}>${item.price?.toFixed(2)}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button 
                          onClick={() => updateQuantity(itemId, -1)} 
                          style={{ 
                            width: 28, 
                            height: 28, 
                            borderRadius: 8, 
                            border: `2px solid ${COLORS.gray}`, 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 800, fontFamily: "'Nunito',sans-serif", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(itemId, 1)} 
                          style={{ 
                            width: 28, 
                            height: 28, 
                            borderRadius: 8, 
                            border: `2px solid ${COLORS.teal}`, 
                            background: COLORS.tealPale, 
                            color: COLORS.teal,
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer totals */}
            {cart.length > 0 && (
              <div style={{ padding: "16px 24px 28px", borderTop: `2px solid ${COLORS.creamDark}`, flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'Nunito',sans-serif" }}>
                  <span style={{ color: COLORS.textLight }}>Subtotal</span><span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontFamily: "'Nunito',sans-serif" }}>
                  <span style={{ color: COLORS.textLight }}>Delivery</span><span style={{ fontWeight: 700 }}>$2.00</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  paddingTop: 12, 
                  borderTop: `2px solid ${COLORS.creamDark}`, 
                  marginBottom: 18 
                }}>
                  <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 18 }}>Total</span>
                  <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 24, color: COLORS.teal }}>${(subtotal + 2).toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`,
                    color: "white",
                    border: "none",
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "'Fredoka One',sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  Checkout Now <ShoppingBag size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
