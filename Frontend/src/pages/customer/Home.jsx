import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import ProductCard from "../../components/ui/ProductCard";
import { getProducts } from "../../api/products";
import { getCategories } from "../../api/categories";
import { getMyOrders } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Truck, ChevronRight } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedCatId, setSelectedCatId] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  // Fetch real categories
  const { data: dbCategories, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Fetch real products
  const { data: dbProducts, isLoading: prodLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categoriesList = dbCategories || [];
  const products = dbProducts || [];

  // Add "All" to categories list for filtering
  const categories = [{ _id: "all", name: "All", emoji: "🛍️" }, ...categoriesList];

  // Calculate product counts per category
  const getCount = (catName, catId) => {
    if (catName === "All") return products.length;
    return products.filter(p => p.categoryId === catId || p.categoryId?._id === catId).length;
  };

  // Filter products based on selection
  const filteredProducts = selectedCat === "All"
    ? products
    : products.filter(p => p.categoryId === selectedCatId || p.categoryId?._id === selectedCatId);

  // Slice visible products for "Show More"
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Reset visible count when category changes
  const handleCatSelect = (catName, catId) => {
    setSelectedCat(catName);
    setSelectedCatId(catId);
    setVisibleCount(8);
  };

  // Fetch active orders for the logged-in user
  const { data: myOrders = [] } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
    enabled: !!user,
  });
  const activeOrder = myOrders.find(o => o.status && o.status !== "done");

  const statusLabels = {
    pending: "Order confirmed",
    confirmed: "Being prepared",
    delivering: "On the way to you",
  };

  if (catLoading || prodLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader size={48} color={COLORS.teal} />
        </motion.div>
      </div>
    );
  }


  return (
    <div style={{ background: COLORS.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div className="page-wrap">

        {/* Active Order Card */}
        {activeOrder && (
          <Link to="/track" state={{ orderId: activeOrder._id }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`,
                borderRadius: 18,
                padding: "14px 18px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                boxShadow: `0 6px 20px ${COLORS.teal}33`,
              }}
            >
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Truck size={22} color="white" />
              </motion.div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 15, color: "white" }}>
                  Order is on its way! 🎉
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>
                  {statusLabels[activeOrder.status] || "In progress"} · Tap to track
                </div>
              </div>
              <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
            </motion.div>
          </Link>
        )}

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: `linear-gradient(135deg,${COLORS.orange},#F5C842)`,
            borderRadius: 24,
            padding: "24px",
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: `0 6px 24px ${COLORS.orange}44`,
            flexWrap: "wrap",
            gap: 16
          }}
          className="home-hero"
        >
          <div style={{ flex: "1 1 280px" }}>
            <h2 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(22px, 5vw, 36px)", color: COLORS.navy, lineHeight: 1.2 }}>Super deals from Elmore! 🎉</h2>
            <p style={{ margin: "8px 0 20px", color: COLORS.navy + "cc", fontFamily: "'Nunito',sans-serif", fontSize: 14, maxWidth: 450 }}>Fresh groceries delivered to your door in no time. Shop now and save big!</p>
            <button
              onClick={() => setSelectedCat("All")}
              style={{
                background: `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`,
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "10px 24px",
                cursor: "pointer",
                fontFamily: "'Fredoka One',sans-serif",
                fontSize: 15
              }}
            >
              Shop Now
            </button>
          </div>
          <div style={{ fontSize: "clamp(40px, 10vw, 90px)", display: "flex", gap: 10, flexShrink: 0 }}>🛒 🥦</div>
        </motion.div>

        {/* Categories Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(18px, 4vw, 24px)", color: COLORS.text }}>Shop by Category</h3>
          <Link to="/categories" style={{ color: COLORS.teal, fontWeight: 700, fontFamily: "'Nunito',sans-serif", fontSize: 15 }}>Manage Categories →</Link>
        </div>

        <div
          className="cat-scroll"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 40,
            overflowX: "auto",
            padding: "10px 4px",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {categories.map((cat, i) => {
            const catName = cat.name || "Category";
            const isImageUrl = cat.image?.startsWith('http');
            const isSelected = selectedCat === catName;
            const itemCount = getCount(catName, cat._id);

            return (
              <motion.div
                key={cat._id || catName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, boxShadow: "0 6px 16px rgba(0,0,0,.1)" }}
                onClick={() => handleCatSelect(catName, cat._id)}
                style={{
                  background: isSelected ? COLORS.teal : COLORS.white,
                  borderRadius: 20,
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  boxShadow: isSelected ? `0 6px 20px ${COLORS.teal}44` : "0 2px 8px rgba(0,0,0,.05)",
                  minWidth: 85,
                  flex: "0 0 auto",
                  border: `2px solid ${isSelected ? COLORS.teal : "transparent"}`,
                  transition: "all 0.2s"
                }}
                className="cat-card"
              >
                <div className="cat-emoji" style={{ fontSize: 32, marginBottom: 8, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isImageUrl ? (
                    <img src={cat.image} alt={catName} style={{ width: 32, height: 32, objectFit: "contain" }} />
                  ) : (
                    cat.image || cat.emoji || "📦"
                  )}
                </div>
                <div className="cat-name" style={{
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Cairo', 'Nunito', sans-serif",
                  color: isSelected ? "white" : COLORS.text,
                  lineHeight: 1.3,
                  marginTop: 4
                }}>
                  {catName}
                </div>
                <div className="cat-count" style={{
                  fontSize: 11,
                  color: isSelected ? "rgba(255,255,255,0.8)" : COLORS.textLight,
                  fontFamily: "'Cairo', 'Nunito', sans-serif",
                  fontWeight: 600
                }}>
                  {itemCount} العناصر
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Products Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(18px, 4vw, 24px)", color: COLORS.text }}>
            {selectedCat === "All" ? "Best Selling 🔥" : `${selectedCat} 🛒`}
          </h3>
          <span
            onClick={() => handleCatSelect("All")}
            style={{ color: COLORS.teal, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 15 }}
          >
            {selectedCat === "All" ? "See all →" : "Show All Products"}
          </span>
        </div>

        <div className="grid-products">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((p, i) => (
              <motion.div
                key={p._id || p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Fredoka One',sans-serif", color: COLORS.teal }}>No items in this category yet!</h3>
          </div>
        )}

        {hasMore && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount(v => v + 8)}
              style={{
                background: COLORS.white,
                border: `2px solid ${COLORS.teal}`,
                color: COLORS.teal,
                borderRadius: 16,
                padding: "14px 40px",
                fontFamily: "'Fredoka One',sans-serif",
                fontSize: 16,
                cursor: "pointer",
                boxShadow: `0 4px 16px ${COLORS.teal}22`
              }}
            >
              Show More ({filteredProducts.length - visibleCount} remaining)
            </motion.button>
          </div>
        )}
      </div>
      <style>{`
        .cat-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
