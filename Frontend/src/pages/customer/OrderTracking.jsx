import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import Larry from "../../components/layout/Larry";
import { motion } from "framer-motion";
import { Package, Check, Truck, Home, MapPin, Loader } from "lucide-react";
import { getOrderById } from "../../api/orders";

const STATUS_STEPS = [
  { key: "pending",    label: "Order Confirmed", icon: <Package size={16} /> },
  { key: "confirmed",  label: "Preparing",       icon: <Check size={16} /> },
  { key: "delivering", label: "Out for Delivery", icon: <Truck size={16} /> },
  { key: "done",       label: "Delivered",        icon: <Home size={16} /> },
];

function getStepState(stepKey, orderStatus) {
  const order = ["pending", "confirmed", "delivering", "done"];
  const orderIdx = order.indexOf(orderStatus);
  const stepIdx  = order.indexOf(stepKey);
  return {
    done:   stepIdx <= orderIdx,
    active: stepIdx === orderIdx,
  };
}

export default function OrderTracking() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: 15000, // Poll every 15 seconds for status updates
  });

  const currentStatus = order?.status || "pending";
  const shortId = orderId ? `EM-${orderId.slice(-6).toUpperCase()}` : "EM-DEMO";

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: 650, margin: "0 auto", padding: "28px 16px 60px" }}>

        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(24px, 6vw, 32px)", color: COLORS.text, marginBottom: 28, textAlign: "center" }}>
          Track Order 📦
        </h2>

        {/* Order ID card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <div style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Order #{shortId}
            </div>
            <div style={{ fontWeight: 800, fontSize: "clamp(16px, 4vw, 20px)", fontFamily: "'Fredoka One',sans-serif", marginTop: 6, color: COLORS.teal }}>
              {currentStatus === "done"
                ? "Delivered! 🎉"
                : currentStatus === "delivering"
                ? "Arriving soon..."
                : "Getting your order ready"}
            </div>
            {order?.address && (
              <div style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 4 }}>
                📍 {order.address}
              </div>
            )}
          </div>
          <div style={{ background: COLORS.tealPale, padding: 12, borderRadius: 16 }}>
            {isLoading ? <Loader color={COLORS.teal} size={24} /> : <MapPin color={COLORS.teal} size={24} />}
          </div>
        </motion.div>

        {/* Larry animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: `linear-gradient(135deg,${COLORS.cream},${COLORS.creamDark})`,
            borderRadius: 32, padding: "40px 24px", textAlign: "center", marginBottom: 24,
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden",
          }}
          className="larry-section"
        >
          <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: COLORS.white, opacity: 0.3, borderRadius: "50%" }} />
          <motion.div
            animate={currentStatus !== "done" ? { x: [-10, 10, -10] } : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Larry size={80} />
          </motion.div>
          <h3 style={{ margin: "16px 0 8px", fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(18px, 5vw, 26px)", color: COLORS.teal }}>
            {currentStatus === "done" ? "Order Delivered! 🎊" : "Larry is on the way! 🥔"}
          </h3>
          <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontSize: 16, maxWidth: 400, margin: "0 auto" }}>
            {currentStatus === "done"
              ? "Your order has been delivered. Enjoy your Elmore goodies!"
              : "Larry is driving his famous ice cream truck to your house!"}
          </p>
        </motion.div>

        {/* Status timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: COLORS.white, borderRadius: 28, padding: "32px 40px", marginBottom: 32, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
          className="track-timeline"
        >
          {isError && (
            <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", textAlign: "center", fontSize: 14 }}>
              Could not load live status — showing last known state.
            </p>
          )}

          {STATUS_STEPS.map((step, i) => {
            const { done, active } = getStepState(step.key, currentStatus);
            return (
              <div key={step.key} style={{ display: "flex", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: active ? COLORS.teal : done ? COLORS.green : COLORS.grayLight,
                      border: active ? `6px solid ${COLORS.teal}33` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxSizing: "border-box", flexShrink: 0,
                      color: done || active ? "white" : COLORS.textLight, zIndex: 1,
                    }}
                  >
                    {active
                      ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{step.icon}</motion.div>
                      : step.icon
                    }
                  </motion.div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ width: 4, flex: 1, background: done ? COLORS.green : COLORS.grayLight, minHeight: 40, margin: "4px 0" }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < STATUS_STEPS.length - 1 ? 32 : 0, paddingTop: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, fontFamily: "'Nunito',sans-serif", color: active ? COLORS.teal : done ? COLORS.text : COLORS.textLight }}>
                    {step.label}
                  </div>
                  {active && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: "inline-block", marginTop: 4, background: COLORS.teal + "18", color: COLORS.teal, borderRadius: 8, padding: "2px 10px", fontSize: 12, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}
                    >
                      Current Status
                    </motion.span>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Order items summary */}
        {order?.items?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: COLORS.white, borderRadius: 24, padding: 24, marginBottom: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
          >
            <h4 style={{ margin: "0 0 16px", fontFamily: "'Fredoka One',sans-serif", fontSize: 18, color: COLORS.text }}>
              Your Items
            </h4>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Nunito',sans-serif", fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: COLORS.text, fontWeight: 700 }}>{item.qty}x {item.productId?.name || "Item"}</span>
                <span style={{ fontWeight: 800, color: COLORS.teal }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: `2px dashed ${COLORS.gray}`, paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between", fontFamily: "'Fredoka One',sans-serif", fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: COLORS.teal }}>${order.total?.toFixed(2)}</span>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }} className="action-btns">
          <Link to="/home">
            <motion.button
              whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
              style={{ background: "white", color: COLORS.teal, border: `2.5px solid ${COLORS.teal}`, borderRadius: 16, padding: "14px 32px", cursor: "pointer", fontFamily: "'Fredoka One',sans-serif", fontSize: 16 }}
            >
              Back to Home
            </motion.button>
          </Link>
          <Link to="/orders">
            <motion.button
              whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
              style={{ background: COLORS.teal, color: "white", border: "none", borderRadius: 16, padding: "14px 32px", cursor: "pointer", fontFamily: "'Fredoka One',sans-serif", fontSize: 16 }}
            >
              My Orders
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
