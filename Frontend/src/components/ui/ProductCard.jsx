import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { COLORS } from "../../constants/theme";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export default function ProductCard({ p }) {
  const [flash, setFlash] = useState(false);
  const { addToCart, cart, updateQuantity } = useCart();

  const displayName = typeof p.name === 'object' ? p.name.en : p.name;
  const productId = p._id || p.id;

  // Find item in cart to show quantity
  const cartItem = cart.find(item => (item._id || item.id) === productId);
  const quantity = cartItem?.qty || 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  const handleQtyUpdate = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(productId, delta);
  };

  return (
    <Link to={`/product/${productId}`}>
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 8px 24px rgba(0,0,0,.12)" }}
        style={{
          background: COLORS.white,
          borderRadius: 18,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 2px 12px rgba(0,0,0,.07)",
          transition: "box-shadow .2s",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
      >
        {/* Quantity Badge */}
        <AnimatePresence>
          {quantity > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: COLORS.orange,
                color: "white",
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 900,
                fontFamily: "'Fredoka One',sans-serif",
                zIndex: 2,
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
              }}
            >
              {quantity}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="product-card-img" style={{
          background: p.bg || COLORS.tealPale,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
          overflow: "hidden",
          padding: p.image ? "10px" : 0,
        }}>
          {p.image ? (
            <img
              src={p.image}
              alt={displayName}
              style={{ width: "80%", height: "80%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <span style={{ display: p.image ? "none" : "block" }}>
            {p.emoji || "📦"}
          </span>
        </div>

        <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{
            fontWeight: 800,
            fontSize: 14,
            fontFamily: "'Nunito',sans-serif",
            color: COLORS.text,
            marginBottom: 2,
            lineHeight: 1.3,
            height: 36,
            overflow: "hidden"
          }}>{displayName}</div>
          <div style={{ fontSize: 11, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontWeight: 700, marginBottom: 10 }}>
            {p.unit || "Per unit"}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: COLORS.teal, fontFamily: "'Fredoka One',sans-serif" }}>${p.price?.toFixed(2)}</span>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {quantity > 0 && (
                <motion.button
                  onClick={(e) => handleQtyUpdate(e, -1)}
                  whileTap={{ scale: 0.8 }}
                  style={{
                    background: COLORS.grayLight,
                    border: "none",
                    color: COLORS.text,
                    borderRadius: 8,
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 900 }}>-</span>
                </motion.button>
              )}

              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.8 }}
                style={{
                  background: flash ? COLORS.green : `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`,
                  border: "none",
                  color: "white",
                  borderRadius: 10,
                  width: quantity > 0 ? 28 : 34,
                  height: quantity > 0 ? 28 : 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background .3s",
                  cursor: "pointer"
                }}
              >
                {flash ? <Check size={16} /> : <span style={{ fontSize: quantity > 0 ? 18 : 22, fontWeight: 700 }}>+</span>}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
