import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../api/orders";
import { COLORS } from "../../constants/theme";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MapPin, CreditCard, Wallet, Truck, CheckCircle2, AlertCircle } from "lucide-react";

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user, selectAddress } = useAuth();
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();
      navigate("/track", { state: { orderId: data._id } });
    },
  });

  if (cart.length === 0) {
    return (
      <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.grayLight }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 80 }}>🛒</div>
          <h2 style={{ fontFamily: "'Fredoka One',sans-serif", color: COLORS.teal, marginTop: 16 }}>Your cart is empty</h2>
          <Link to="/home">
            <button style={{ marginTop: 20, padding: "12px 24px", background: COLORS.teal, color: "white", borderRadius: 12, fontFamily: "'Fredoka One',sans-serif", border: "none", cursor: "pointer" }}>
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    mutation.mutate({
      items: cart.map((i) => ({ productId: i._id || i.id, qty: i.qty, price: i.price })),
      total: subtotal + 2,
      paymentMethod: method === "cod" ? "cash" : "online",
      address: user?.address || "123 Cartoon St, Elmore",
    });
  };

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div className="page-wrap" style={{ maxWidth: 800 }}>

        <Link to="/home">
          <button style={{ background: COLORS.white, border: "none", borderRadius: 12, padding: "8px 18px", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.07)", cursor: "pointer" }}>
            <ChevronLeft size={18} /> Back
          </button>
        </Link>

        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(24px, 6vw, 32px)", color: COLORS.text, marginBottom: 28 }}>Checkout 🏁</h2>

        {/* API Error */}
        <AnimatePresence>
          {mutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: "#FFF0F0", border: `2px solid ${COLORS.coral}`, borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Nunito',sans-serif", fontSize: 14, color: COLORS.coral, fontWeight: 700 }}
            >
              <AlertCircle size={18} />
              {mutation.error?.response?.data?.message || "Failed to place order. Please try again."}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "grid", gap: 24 }} className="checkout-grid">
          {/* Delivery Address */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.white, borderRadius: 24, padding: 28, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }} className="card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <MapPin color={COLORS.teal} size={22} />
              <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Fredoka One',sans-serif" }}>Delivery Address</h3>
            </div>

            {/* Current selected address */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: (user?.addresses?.length > 1) ? 14 : 0 }}>
              <div>
                <div style={{ fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 16 }}>{user?.name || "Your Address"}</div>
                <div style={{ fontSize: 14, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 4 }}>
                  📍 {user?.address || "No address on file"}
                </div>
              </div>
              <Link to="/add-address" state={{ from: { pathname: "/checkout" } }} style={{ color: COLORS.teal, fontWeight: 800, fontSize: 13, fontFamily: "'Nunito',sans-serif", flexShrink: 0 }}>
                Manage
              </Link>
            </div>

            {/* Quick address switcher */}
            {user?.addresses?.length > 1 && (
              <div style={{ display: "grid", gap: 8 }}>
                {user.addresses.filter(a => a !== user.address).map((addr, i) => (
                  <div
                    key={i}
                    onClick={() => selectAddress(addr)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 14px", borderRadius: 12,
                      border: `1.5px solid ${COLORS.grayLight}`,
                      background: COLORS.grayLight,
                      cursor: "pointer", transition: "all 0.2s",
                      fontSize: 13, fontFamily: "'Nunito',sans-serif",
                      color: COLORS.textLight, fontWeight: 600,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.border = `1.5px solid ${COLORS.teal}`; e.currentTarget.style.background = COLORS.tealPale; }}
                    onMouseLeave={e => { e.currentTarget.style.border = `1.5px solid ${COLORS.grayLight}`; e.currentTarget.style.background = COLORS.grayLight; }}
                  >
                    <MapPin size={14} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{addr}</span>
                    <span style={{ color: COLORS.teal, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>Use</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Payment Method */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: COLORS.white, borderRadius: 24, padding: 28, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }} className="card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <CreditCard color={COLORS.teal} size={22} />
              <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Fredoka One',sans-serif" }}>Payment Method</h3>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { id: "cod", label: "Cash on Delivery", icon: <Truck size={20} />, sub: "Pay when you receive" },
                { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={20} />, sub: "Visa, Mastercard, Amex (Dummy)" },
                { id: "wallet", label: "Elmore Wallet", icon: <Wallet size={20} />, sub: "Instant & Secure (Dummy)" },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, border: `2px solid ${method === m.id ? COLORS.teal : COLORS.grayLight}`, cursor: "pointer", background: method === m.id ? COLORS.tealPale : COLORS.white, transition: "all .2s" }}
                  className="pay-item"
                >
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${method === m.id ? COLORS.teal : COLORS.gray}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {method === m.id && <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.teal }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="pay-label" style={{ fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 15 }}>{m.label}</div>
                    <div className="pay-sub" style={{ fontSize: 12, color: COLORS.textLight }}>{m.sub}</div>
                  </div>
                  <div style={{ color: method === m.id ? COLORS.teal : COLORS.textLight }}>{m.icon}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: COLORS.white, borderRadius: 24, padding: 28, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }} className="card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <CheckCircle2 color={COLORS.teal} size={22} />
              <h3 style={{ margin: 0, fontSize: 18, fontFamily: "'Fredoka One',sans-serif" }}>Order Summary</h3>
            </div>
            <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
              {cart.map((i) => {
                const itemName = typeof i.name === 'object' ? i.name.en : i.name;
                const itemId = i._id || i.id;
                return (
                  <div key={itemId} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Nunito',sans-serif", fontSize: 15 }}>
                    <span style={{ color: COLORS.text }}><span style={{ fontWeight: 800 }}>{i.qty}x</span> {i.emoji} {itemName}</span>
                    <span style={{ fontWeight: 800 }}>${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: `2px dashed ${COLORS.gray}`, paddingTop: 20, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "'Nunito',sans-serif", color: COLORS.textLight }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontFamily: "'Nunito',sans-serif", color: COLORS.textLight }}>
                <span>Delivery Fee</span><span>$2.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(18px, 4vw, 22px)" }}>Total Amount</span>
                <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(24px, 5vw, 32px)", color: COLORS.teal }} className="checkout-total">${(subtotal + 2).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={handlePlaceOrder}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={mutation.isPending}
            style={{
              width: "100%",
              padding: "16px 20px",
              background: mutation.isPending ? COLORS.textLight : `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`,
              color: "white",
              border: "none",
              borderRadius: 20,
              fontSize: "clamp(16px, 4vw, 20px)",
              fontFamily: "'Fredoka One',sans-serif",
              cursor: mutation.isPending ? "not-allowed" : "pointer",
              boxShadow: `0 12px 24px ${COLORS.teal}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 12,
            }}
          >
            {mutation.isPending ? "Placing Order..." : <> Place Order Now <Truck size={24} /> </>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
