import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import { motion } from "framer-motion";
import { ClipboardList, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../api/orders";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch real order count with React Query
  const { data: orders = [] } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
    enabled: !!user, // only fetch when logged in
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { label: "My Orders", icon: <ClipboardList size={20} />, path: "/orders", badge: orders.length || null },
    { label: "Manage Addresses", icon: <MapPin size={20} />, path: "/add-address", state: { from: { pathname: "/profile" } }, badge: user?.addresses?.length || null },
    { label: "Payment Methods", icon: <CreditCard size={20} />, path: "/profile" },
    { label: "Notifications", icon: <Bell size={20} />, path: "/profile" },
    { label: "Help & Support", icon: <HelpCircle size={20} />, path: "/profile" },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "calc(100vh - 68px)" }}>
      {/* Profile Header */}
      <div style={{
        background: `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`,
        padding: "clamp(40px, 10vw, 60px) 20px clamp(30px, 8vw, 40px)",
        textAlign: "center",
        color: "white",
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: 110, height: 110,
            borderRadius: "50%",
            margin: "0 auto 16px",
            border: "4px solid rgba(255,255,255,0.5)",
            overflow: "hidden",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          className="profile-avatar"
        >
          {user?.gender ? (
            <img
              src={`/${user.gender}.png`}
              alt={user.gender}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 42, fontFamily: "'Fredoka One',sans-serif", color: "white" }}>
              {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          )}
        </motion.div>
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(22px, 5vw, 28px)" }}
        >
          {user?.gender === "male" ? "Mr. " : user?.gender === "female" ? "Ms. " : ""}{user?.name || "Guest"}
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ margin: "4px 0 0", color: "rgba(255,255,255,.8)", fontFamily: "'Nunito',sans-serif", fontSize: 16 }}
        >
          {user?.email}
        </motion.p>
        {user?.address && (
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ margin: "6px 0 0", color: "rgba(255,255,255,.65)", fontFamily: "'Nunito',sans-serif", fontSize: 13 }}
          >
            📍 {user.address}
          </motion.p>
        )}
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div style={{ display: "grid", gap: 12 }}>
          {menuItems.map((item, i) => (
            <Link key={item.label} to={item.path} state={item.state}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                style={{
                  background: COLORS.white,
                  borderRadius: 18,
                  padding: "18px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ color: COLORS.teal, background: COLORS.teal + "15", padding: 10, borderRadius: 12 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: COLORS.text }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {item.badge > 0 && (
                    <span style={{ background: COLORS.coral, color: "white", borderRadius: 10, padding: "2px 10px", fontSize: 12, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={20} color={COLORS.textLight} />
                </div>
              </motion.div>
            </Link>
          ))}

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: menuItems.length * 0.05 }}
            whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            onClick={handleLogout}
            style={{
              background: COLORS.white,
              borderRadius: 18,
              padding: "18px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,.04)",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ color: COLORS.coral, background: COLORS.coral + "15", padding: 10, borderRadius: 12 }}>
                <LogOut size={20} />
              </div>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: COLORS.coral }}>
                Logout
              </span>
            </div>
            <ChevronRight size={20} color={COLORS.textLight} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 40, textAlign: "center" }}
        >
          <p style={{ color: COLORS.textLight, fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>
            Version 2.4.0 (Elmore Edition)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
