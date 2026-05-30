import { useQuery } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import { getCategories } from "../../api/categories";
import { motion } from "framer-motion";
import { ImageIcon, Loader, ShieldCheck } from "lucide-react";

export default function CategoriesAdmin() {
  // Fetch Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) return (
    <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader size={48} color={COLORS.teal} />
      </motion.div>
    </div>
  );

  return (
    <div style={{ background: COLORS.grayLight, minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 32, color: COLORS.text, margin: 0 }}>Product Categories 📂</h2>
            <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <ShieldCheck size={16} /> These categories are fixed for store consistency.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {categories.map((cat, i) => {
            const name = cat.name || "Category";
            const slug = cat.slug || "";
            
            return (
              <motion.div 
                key={cat._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  background: COLORS.white, borderRadius: 24, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  display: "flex", alignItems: "center", gap: 20
                }}
              >
                <div style={{ 
                  width: 70, height: 70, borderRadius: 20, background: COLORS.cream, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36
                }}>
                  {cat.image && cat.image.length < 5 ? cat.image : (
                    cat.image ? <img src={cat.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={30} color={COLORS.teal} />
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.text, fontFamily: "'Nunito',sans-serif" }}>{name}</div>
                  <div style={{ color: COLORS.textLight, fontSize: 13, textAlign: "left" }}>Slug: {slug}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
