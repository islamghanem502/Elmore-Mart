import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import { getMyOrders } from "../../api/orders";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, Clock, ChevronRight, Loader, ShoppingBag } from "lucide-react";

const STATUS_CONFIG = {
  pending:    { label: "Pending",      color: COLORS.orange, icon: <Clock size={14} /> },
  confirmed:  { label: "Preparing",    color: COLORS.teal,   icon: <Package size={14} /> },
  delivering: { label: "On the Way",   color: "#3B82F6",     icon: <Truck size={14} /> },
  done:       { label: "Delivered",    color: COLORS.green,  icon: <CheckCircle2 size={14} /> },
};

export default function MyOrders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader size={48} color={COLORS.teal} />
        </motion.div>
      </div>
    );
  }

  // Sort: active orders first, then newest first
  const sorted = [...orders].sort((a, b) => {
    const aActive = a.status !== "done" ? 0 : 1;
    const bActive = b.status !== "done" ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div className="page-wrap" style={{ maxWidth: 700 }}>

        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(22px, 5vw, 30px)", color: COLORS.text, marginBottom: 24 }}>
          My Orders 📦
        </h2>

        {sorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: COLORS.white,
              borderRadius: 24,
              padding: "60px 24px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
            <h3 style={{ fontFamily: "'Fredoka One',sans-serif", color: COLORS.teal, marginBottom: 8 }}>
              No orders yet!
            </h3>
            <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontSize: 14, marginBottom: 24 }}>
              Start shopping and your orders will show up here.
            </p>
            <Link to="/home">
              <button style={{
                background: `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`,
                color: "white", border: "none", borderRadius: 14,
                padding: "12px 28px", fontFamily: "'Fredoka One',sans-serif",
                fontSize: 15, cursor: "pointer",
                boxShadow: `0 6px 16px ${COLORS.teal}33`
              }}>
                Start Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {sorted.map((order, i) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const shortId = `EM-${(order._id || "").slice(-6).toUpperCase()}`;
              const date = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "";
              const itemCount = order.items?.length || 0;
              const isActive = order.status !== "done";

              return (
                <Link to="/track" state={{ orderId: order._id }} key={order._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}
                    style={{
                      background: COLORS.white,
                      borderRadius: 20,
                      padding: "18px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                      border: isActive ? `2px solid ${status.color}22` : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    className="card-pad"
                  >
                    {/* Icon */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: status.color + "18",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: status.color, flexShrink: 0,
                    }}>
                      <ShoppingBag size={20} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 15, color: COLORS.text }}>
                          {shortId}
                        </span>
                        <span style={{
                          background: status.color + "18",
                          color: status.color,
                          padding: "2px 10px",
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 800,
                          fontFamily: "'Nunito',sans-serif",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>
                        {itemCount} item{itemCount !== 1 ? "s" : ""} · {date}
                      </div>
                    </div>

                    {/* Price + Arrow */}
                    <div style={{ textAlign: "right", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 16, color: COLORS.teal }}>
                        ${order.total?.toFixed(2)}
                      </span>
                      <ChevronRight size={18} color={COLORS.textLight} />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
