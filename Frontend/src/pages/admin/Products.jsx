import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { COLORS } from "../../constants/theme";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";
import { getCategories } from "../../api/categories";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Save, Image as ImageIcon, Loader, CheckCircle } from "lucide-react";

export default function ProductsAdmin() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Fetch Categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProduct(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const filteredProducts = products.filter(p => {
    const name = p.name || "";
    const catName = p.categoryId?.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           catName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this product from Elmore Mart?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      id: product._id,
      name: product.name || "",
      desc: product.description || "",
      price: product.price || 0,
      categoryId: product.categoryId?._id || product.categoryId || "",
      image: product.image || "",
      stock: product.stock || 0,
      available: product.available ?? true,
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct({
      name: "",
      desc: "",
      price: 0,
      categoryId: categories[0]?._id || "",
      image: "",
      stock: 50,
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      name: editingProduct.name,
      description: editingProduct.desc,
      price: editingProduct.price,
      categoryId: editingProduct.categoryId,
      image: editingProduct.image,
      stock: editingProduct.stock,
      available: editingProduct.available,
    };

    if (editingProduct.id) {
      updateMutation.mutate({ id: editingProduct.id, body: payload });
    } else {
      createMutation.mutate(payload);
    }
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
          <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 32, color: COLORS.text, margin: 0 }}>Manage Products 📦</h2>

          <div style={{ display: "flex", gap: 12, flex: "1 1 auto", maxWidth: 600 }}>
            <div style={{ flex: 1, background: COLORS.white, borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Search size={20} color={COLORS.textLight} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", width: "100%", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}
              />
            </div>
            <button
              onClick={handleAddNew}
              style={{
                background: COLORS.teal, color: "white", padding: "12px 24px", borderRadius: 14, fontWeight: 800, fontFamily: "'Fredoka One',sans-serif",
                display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 12px ${COLORS.teal}33`, cursor: "pointer"
              }}
            >
              <Plus size={20} /> Add New
            </button>
          </div>
        </div>

        <div style={{ background: COLORS.white, borderRadius: 28, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.grayLight}` }}>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Product</th>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Category</th>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Price</th>
                <th style={{ padding: "16px", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Stock</th>
                <th style={{ padding: "16px", textAlign: "right", color: COLORS.textLight, fontSize: 14, fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id} style={{ borderBottom: `1px solid ${COLORS.grayLight}` }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.tealPale, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {p.image ? <img src={p.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={20} color={COLORS.teal} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: COLORS.text }}>{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ background: COLORS.tealPale, color: COLORS.teal, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{p.categoryId?.name || p.categoryId}</span>
                  </td>
                  <td style={{ padding: "16px", fontWeight: 800, color: COLORS.text }}>${p.price?.toFixed(2)}</td>
                  <td style={{ padding: "16px", color: COLORS.textLight, fontWeight: 600 }}>{p.stock}</td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button onClick={() => handleEdit(p)} style={{ padding: 8, borderRadius: 10, background: COLORS.grayLight, color: COLORS.teal, cursor: "pointer" }}><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(p._id)} style={{ padding: 8, borderRadius: 10, background: COLORS.grayLight, color: COLORS.coral, cursor: "pointer" }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: COLORS.textLight }}>No products found. Add some to get started!</div>}
        </div>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: "fixed", top: "50%", left: "50%", x: "-50%", y: "-50%",
                width: 650, maxWidth: "95vw", background: "white", borderRadius: 32,
                padding: 32, zIndex: 1001, boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                maxHeight: "90vh", overflowY: "auto"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: 24 }}>{editingProduct?.id ? "Edit Product" : "New Product"}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} style={{ display: "grid", gap: 20 }}>
                {/* Names */}
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Product Name</label>
                  <input required value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} style={inputStyle} />
                </div>

                {/* Price & Category */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Price ($)</label>
                    <input type="number" step="0.01" required value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Category</label>
                    <select value={editingProduct.categoryId} onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })} style={inputStyle}>
                      {categories.map(c => {
                        const name = c.name || "Category";
                        return <option key={c._id} value={c._id}>{name}</option>;
                      })}
                      {categories.length === 0 && <option value="">No Categories</option>}
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Image URL</label>
                  <input placeholder="https://cloudinary.com/..." value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} style={inputStyle} />
                </div>

                {/* Stock & Availability */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                   <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Stock Level</label>
                    <input type="number" required value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 25 }}>
                    <input type="checkbox" id="avail" checked={editingProduct.available} onChange={e => setEditingProduct({ ...editingProduct, available: e.target.checked })} />
                    <label htmlFor="avail" style={{ fontSize: 14, fontWeight: 800 }}>Available for Sale</label>
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Description</label>
                  <textarea rows="3" value={editingProduct.desc} onChange={e => setEditingProduct({ ...editingProduct, desc: e.target.value })} style={inputStyle} />
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  style={{
                    marginTop: 12, width: "100%", padding: 16, background: COLORS.teal, color: "white",
                    borderRadius: 16, fontWeight: 800, fontFamily: "'Fredoka One',sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer"
                  }}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader size={20} className="spin" /> : <Save size={20} />}
                  Save Product
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px", borderRadius: 12, border: `2px solid ${COLORS.grayLight}`, background: COLORS.grayLight, outline: "none", fontFamily: "inherit", boxSizing: "border-box"
};
