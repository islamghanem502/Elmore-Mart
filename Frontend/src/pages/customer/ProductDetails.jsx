import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { COLORS } from "../../constants/theme";

import ProductCard from "../../components/ui/ProductCard";
import { getProductById, getProductsByCategory } from "../../api/products";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus, ShoppingCart, Check, Loader } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);

  // Fetch real product details
  const { data: dbProduct, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id && id.length > 5, // Only run if it looks like a Mongo ID
  });

  // Use only real DB product
  const product = dbProduct;

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.categoryId?._id || product?.categoryId],
    queryFn: () => getProductsByCategory(product?.categoryId?._id || product?.categoryId),
    enabled: !!(product?.categoryId?._id || product?.categoryId),
  });

  const handleAdd = () => {
    addToCart(product, qty);
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  };

  if (isLoading) return (
    <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader size={48} color={COLORS.teal} />
      </motion.div>
    </div>
  );

  if (!product || isError) return (
    <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", color: COLORS.teal }}>Product Not Found</h2>
        <Link to="/home" style={{ color: COLORS.orange, fontWeight: 700 }}>Back to Home</Link>
      </div>
    </div>
  );

  const displayName = typeof product.name === 'object' ? product.name.en : product.name;
  const displayDesc = typeof product.description === 'object' ? product.description.en : (product.description || product.desc);
  const related = (relatedProducts || [])
    .filter(p => (p._id || p.id) !== (product._id || product.id))
    .slice(0, 4);

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 60px" }}>

        <Link to="/home">
          <motion.button
            whileHover={{ x: -5 }}
            style={{
              background: COLORS.white,
              border: "none",
              borderRadius: 12,
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Nunito',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,.07)",
              cursor: "pointer"
            }}
          >
            <ChevronLeft size={18} /> Back
          </motion.button>
        </Link>

        <div className="detail-grid">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: product.bg || COLORS.tealPale,
              borderRadius: 28,
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: product.image ? 0 : "clamp(80px, 15vw, 150px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              overflow: "hidden"
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={displayName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                display: product.image ? 'none' : 'flex',
                fontSize: 'clamp(80px, 15vw, 150px)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {product.emoji || '📦'}
            </motion.span>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span style={{
              background: COLORS.tealPale,
              color: COLORS.teal,
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              fontFamily: "'Nunito',sans-serif",
              textTransform: "uppercase",
              letterSpacing: 0.5
            }}>{product.categoryId?.name || product.categoryId}</span>

            <h1 style={{
              fontFamily: "'Fredoka One',sans-serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              color: COLORS.text,
              margin: "12px 0 8px"
            }}>{displayName}</h1>

            <p style={{
              color: COLORS.textLight,
              fontFamily: "'Nunito',sans-serif",
              lineHeight: 1.7,
              marginBottom: 24,
              fontSize: 16
            }}>{displayDesc}</p>

            <div style={{
              fontSize: "clamp(28px, 6vw, 42px)",
              fontWeight: 900,
              color: COLORS.teal,
              fontFamily: "'Fredoka One',sans-serif",
              marginBottom: 24
            }}>${product.price?.toFixed(2)}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 800, fontFamily: "'Nunito',sans-serif", fontSize: 15 }}>Quantity</div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: COLORS.white,
                borderRadius: 16,
                padding: "10px 20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: 36,
                    height: 36,
                    border: `2.5px solid ${COLORS.gray}`,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.text,
                    cursor: "pointer"
                  }}
                >
                  <Minus size={20} />
                </button>
                <span style={{ fontWeight: 800, fontSize: 20, fontFamily: "'Nunito',sans-serif", minWidth: 30, textAlign: "center" }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    border: `2.5px solid ${COLORS.teal}`,
                    background: COLORS.tealPale,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.teal,
                    cursor: "pointer"
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                maxWidth: 400,
                background: flash ? `linear-gradient(135deg,${COLORS.green},#5AAA45)` : `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`,
                color: "white",
                border: "none",
                borderRadius: 18,
                padding: "14px 24px",
                fontSize: "clamp(15px, 4vw, 18px)",
                fontFamily: "'Fredoka One',sans-serif",
                cursor: "pointer",
                boxShadow: `0 8px 24px ${flash ? COLORS.green : COLORS.teal}44`,
                transition: "background .4s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12
              }}
            >
              {flash ? (
                <><Check size={22} /> Added to Cart!</>
              ) : (
                <><ShoppingCart size={22} /> Add to Cart</>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h3 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 24, marginBottom: 24 }}>You Might Also Like 🍦</h3>
            <div className="grid-products">
              {related.map(p => (
                <ProductCard key={p._id || p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
