import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import { getAllOrders, updateOrderStatus } from "../../api/orders";
import { motion } from "framer-motion";
import { Search, Filter, Eye, CheckCircle, Clock, Truck, Loader, ChevronDown } from "lucide-react";

export default function OrdersAdmin() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrders,
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(["admin-orders"]),
  });

  const filteredOrders = orders.filter(o => 
    o._id.includes(searchTerm) || 
    o.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "done": return { bg: COLORS.green + "15", text: COLORS.green, icon: <CheckCircle size={14} />, label: "Delivered" };
      case "confirmed": return { bg: COLORS.orange + "15", text: COLORS.orange, icon: <Clock size={14} />, label: "Processing" };
      case "delivering": return { bg: COLORS.teal + "15", text: COLORS.teal, icon: <Truck size={14} />, label: "Shipped" };
      default: return { bg: COLORS.coral + "15", text: COLORS.coral, icon: <Clock size={14} />, label: "Pending" };
    }
  };

  const handleStatusChange = (id, newStatus) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) return (
    <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader size={48} color={COLORS.teal} />
      </motion.div>
    </div>
  );

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 20 }}>
          <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 32, color: COLORS.text, margin: 0 }}>Order Management 📋</h2>
          
          <div style={{ display: "flex", gap: 12, flex: "1 1 auto", maxWidth: 500 }}>
            <div style={{ flex: 1, background: COLORS.white, borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Search size={20} color={COLORS.textLight} />
              <input 
                type="text" 
                placeholder="Search orders, customers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", width: "100%", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.white, borderRadius: 28, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.grayLight}` }}>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Order ID</th>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Customer</th>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Items</th>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Total</th>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Status</th>
                <th style={{ padding: "16px", textAlign: "right", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusStyle(order.status);
                const shortId = `EM-${order._id.slice(-5).toUpperCase()}`;
                
                return (
                  <tr key={order._id} style={{ borderBottom: `1px solid ${COLORS.grayLight}` }}>
                    <td style={{ padding: "16px", fontWeight: 800, color: COLORS.teal, fontSize: 13 }}>{shortId}</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{order.userId?.name || "Guest"}</div>
                      <div style={{ fontSize: 12, color: COLORS.textLight }}>{order.userId?.email || "No email"}</div>
                    </td>
                    <td style={{ padding: "16px", fontWeight: 700, color: COLORS.text }}>{order.items?.length || 0} items</td>
                    <td style={{ padding: "16px", fontWeight: 800, color: COLORS.text }}>${order.total?.toFixed(2)}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ 
                        background: statusInfo.bg, 
                        color: statusInfo.text, 
                        padding: "6px 14px", 
                        borderRadius: 20, 
                        fontSize: 12, 
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        width: "fit-content"
                      }}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={statusMutation.isPending}
                          style={{
                            appearance: "none",
                            background: COLORS.grayLight,
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 32px 8px 12px",
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: "'Nunito',sans-serif",
                            color: COLORS.text,
                            cursor: "pointer",
                            outline: "none"
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivering">Out for Delivery</option>
                          <option value="done">Delivered</option>
                        </select>
                        <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: COLORS.textLight }}>No orders found yet.</div>}
        </div>
      </div>
    </div>
  );
}
