import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import ProductCard from "../../components/ui/ProductCard";
import { getProducts, getProductsByCategory } from "../../api/products";
import { getCategories } from "../../api/categories";
import { motion } from "framer-motion";
import { Loader, Search } from "lucide-react";

export default function Categories() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCat = queryParams.get("cat") || "All";
  const [selectedCat, setSelectedCat] = useState(initialCat);

  useEffect(() => {
    setSelectedCat(queryParams.get("cat") || "All");
  }, [location.search]);

  // Fetch Categories
  const { data: dbCategories, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Fetch Products (either All or by Category)
  const { data: dbProducts, isLoading: prodLoading, isFetching: prodFetching } = useQuery({
    queryKey: ["products", selectedCat],
    queryFn: () => selectedCat === "All" ? getProducts() : getProductsByCategory(selectedCat),
    keepPreviousData: true,
  });

  const categoriesWithAll = [{ name: "All", emoji: "🛍️", _id: "all" }, ...(dbCategories || [])];
  const products = dbProducts || [];

  if (catLoading) {
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
        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(24px, 5vw, 32px)", color: COLORS.text, marginBottom: 28 }}>
          Categories 📦
        </h2>

        {/* Category Pills */}
        <div style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 24,
          marginBottom: 12,
        }}
          className="no-scrollbar"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          {categoriesWithAll.map((cat, i) => {
            const catName = typeof cat.name === 'object' ? cat.name.en : cat.name;
            const isSelected = selectedCat === catName;
            const isImageUrl = cat.image?.startsWith('http');

            return (
              <motion.button
                key={cat._id || catName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCat(catName)}
                style={{
                  background: isSelected ? COLORS.teal : COLORS.white,
                  color: isSelected ? COLORS.white : COLORS.text,
                  padding: "10px 18px",
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: 14,
                  fontFamily: "'Nunito',sans-serif",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: isSelected ? `0 6px 16px ${COLORS.teal}44` : "0 4px 10px rgba(0,0,0,0.05)",
                  border: `2px solid ${isSelected ? COLORS.teal : "transparent"}`,
                  cursor: "pointer"
                }}
              >
                <span style={{ fontSize: 20, display: "flex", alignItems: "center" }}>
                  {isImageUrl ? (
                    <img src={cat.image} alt={catName} style={{ width: 24, height: 24, objectFit: "contain" }} />
                  ) : (
                    cat.image || cat.emoji || "📦"
                  )}
                </span>
                {catName}
              </motion.button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(16px, 4vw, 22px)", color: COLORS.text }}>
              {selectedCat === "All" ? "All Products" : selectedCat}
            </h3>
            <span style={{ fontSize: 16, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>
              ({products.length} items)
            </span>
            {prodFetching && (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Loader size={16} color={COLORS.teal} />
              </motion.div>
            )}
          </div>
        </div>

        {prodLoading && !dbProducts ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: "inline-block" }}>
              <Loader size={40} color={COLORS.teal} />
            </motion.div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid-products">
            {products.map((p, i) => (
              <motion.div
                key={p._id || p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard p={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", background: COLORS.white, borderRadius: 32 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Fredoka One',sans-serif", color: COLORS.teal, fontSize: 24 }}>No products in this category</h3>
            <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontSize: 16 }}>Larry hasn't stocked these shelves yet!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCat("All")}
              style={{ marginTop: 20, background: COLORS.teal, color: "white", border: "none", borderRadius: 12, padding: "10px 24px", fontFamily: "'Fredoka One',sans-serif", cursor: "pointer" }}
            >
              Browse All Products
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
