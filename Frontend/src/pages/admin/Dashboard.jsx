import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import { motion } from "framer-motion";
import { Users, ShoppingBag, DollarSign, Package, Star, ArrowUpRight, Loader, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../api/orders";
import { getProducts } from "../../api/products";
import { getCategories } from "../../api/categories";

export default function Dashboard() {
  // Fetch data
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrders,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Calculate stats
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalProducts = products.length;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: <DollarSign />, color: COLORS.teal, trend: "+100%" },
    { label: "Total Orders", value: orders.length.toString(), icon: <ShoppingBag />, color: COLORS.orange, trend: "Live" },
    { label: "Total Products", value: totalProducts.toString(), icon: <Package />, color: COLORS.coral, trend: "Active" },
    { label: "Categories", value: categories.length.toString(), icon: <Star />, color: COLORS.green, trend: "Menu" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "done": return COLORS.green;
      case "delivering": return COLORS.teal;
      case "confirmed": return COLORS.orange;
      default: return COLORS.coral;
    }
  };

  if (ordersLoading || productsLoading || catsLoading) return (
    <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader size={48} color={COLORS.teal} />
      </motion.div>
    </div>
  );

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 32, color: COLORS.text, margin: 0 }}>Admin Dashboard ⚙️</h2>
            <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 4 }}>Welcome back, Larry! Here's what's happening at Elmore Mart today.</p>
          </div>
          <Link to="/home">
            <button style={{ 
              background: COLORS.white, border: `2px solid ${COLORS.teal}`, color: COLORS.teal, 
              padding: "10px 20px", borderRadius: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: "pointer"
            }}>Go to Storefront 🛍️</button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: 20, marginBottom: 40 
        }}>
          {stats.map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                background: COLORS.white, borderRadius: 24, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                display: "flex", flexDirection: "column", gap: 16
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ background: s.color + "15", color: s.color, padding: 12, borderRadius: 16 }}>{s.icon}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: COLORS.green, fontSize: 14, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>
                  {s.trend} <ArrowUpRight size={14} />
                </div>
              </div>
              <div>
                <div style={{ color: COLORS.textLight, fontSize: 14, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>{s.label}</div>
                <div style={{ color: COLORS.text, fontSize: 28, fontFamily: "'Fredoka One',sans-serif", marginTop: 2 }}>{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }} className="admin-grid">
          {/* Recent Orders */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: COLORS.white, borderRadius: 28, padding: 32, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: 22 }}>Recent Orders</h3>
              <Link to="/admin/orders" style={{ color: COLORS.teal, fontWeight: 800, fontSize: 14 }}>View All</Link>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.grayLight}` }}>
                    <th style={{ padding: "12px 0", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Order ID</th>
                    <th style={{ padding: "12px 0", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Customer</th>
                    <th style={{ padding: "12px 0", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Total</th>
                    <th style={{ padding: "12px 0", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const statusColor = getStatusColor(order.status);
                    const shortId = order._id.slice(-5).toUpperCase();
                    return (
                      <tr key={order._id} style={{ borderBottom: `1px solid ${COLORS.grayLight}` }}>
                        <td style={{ padding: "16px 0", fontWeight: 800, color: COLORS.teal, fontSize: 14 }}>EM-{shortId}</td>
                        <td style={{ padding: "16px 0", fontWeight: 700, fontSize: 14 }}>{order.userId?.name || "Guest"}</td>
                        <td style={{ padding: "16px 0", fontWeight: 800, fontSize: 14 }}>${order.total?.toFixed(2)}</td>
                        <td style={{ padding: "16px 0" }}>
                          <span style={{ 
                            background: statusColor + "15", color: statusColor, 
                            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap"
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {recentOrders.length === 0 && <div style={{ padding: 20, textAlign: "center", color: COLORS.textLight }}>No orders yet.</div>}
            </div>
          </motion.div>

          {/* Quick Links / Cat Overview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: COLORS.white, borderRadius: 28, padding: 32, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
          >
            <h3 style={{ margin: "0 0 24px", fontFamily: "'Fredoka One',sans-serif", fontSize: 22 }}>Categories</h3>
            <div style={{ display: "grid", gap: 20 }}>
              {categories.slice(0, 6).map((cat, i) => {
                const name = typeof cat.name === 'object' ? cat.name.en : cat.name;
                return (
                  <div key={cat._id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 20, background: COLORS.grayLight, width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {cat.image ? <img src={cat.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (cat.emoji || "📦")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>{name}</span>
                        <span style={{ color: COLORS.teal, fontSize: 12, fontWeight: 700 }}>Live</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && <div style={{ color: COLORS.textLight }}>No categories created.</div>}
              <Link to="/admin/categories" style={{ marginTop: 10, textAlign: "center", color: COLORS.teal, fontWeight: 800, fontSize: 14 }}>Manage Categories →</Link>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ .admin-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
