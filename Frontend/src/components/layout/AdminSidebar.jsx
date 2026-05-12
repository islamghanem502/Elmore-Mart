import { Link, useLocation } from "react-router-dom";
import { COLORS } from "../../constants/theme";
import { LayoutDashboard, Package, ShoppingCart, Layers, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { label: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { label: "Categories", path: "/admin/categories", icon: <Layers size={20} /> },
  ];

  return (
    <div style={{ 
      width: 260, 
      background: COLORS.white, 
      height: "100vh", 
      position: "sticky", 
      top: 0, 
      borderRight: `2px solid ${COLORS.grayLight}`,
      display: "flex",
      flexDirection: "column",
      padding: "32px 16px"
    }} className="admin-sidebar">
      {/* Admin Logo */}
      <div style={{ padding: "0 16px 40px" }}>
        <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 24, color: COLORS.teal }}>ELMORE</div>
        <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 14, color: COLORS.orange, marginTop: -4 }}>ADMIN PANEL ⚙️</div>
      </div>

      <div style={{ display: "grid", gap: 8, flex: 1 }}>
        {menuItems.map(item => (
          <Link key={item.path} to={item.path}>
            <motion.div 
              whileHover={{ x: 5 }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                padding: "14px 16px", 
                borderRadius: 14,
                background: isActive(item.path) ? COLORS.tealPale : "transparent",
                color: isActive(item.path) ? COLORS.teal : COLORS.textLight,
                fontWeight: 800,
                fontFamily: "'Nunito',sans-serif",
                transition: "all 0.2s"
              }}
            >
              {item.icon}
              {item.label}
            </motion.div>
          </Link>
        ))}
      </div>

      <Link to="/home">
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12, 
          padding: "14px 16px", 
          borderRadius: 14,
          color: COLORS.orange,
          fontWeight: 800,
          fontFamily: "'Nunito',sans-serif",
          marginTop: "auto"
        }}>
          <ArrowLeft size={20} /> Exit Admin
        </div>
      </Link>

      <style>{`
        @media(max-width: 900px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
