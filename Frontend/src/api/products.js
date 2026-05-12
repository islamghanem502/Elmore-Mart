import api from "./axios";

// Fetch all products
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// Fetch single product by ID
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// Fetch products by category
export const getProductsByCategory = async (cat) => {
  const res = await api.get(`/products/category/${encodeURIComponent(cat)}`);
  return res.data;
};

// Admin: Create product
export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

// Admin: Update product
export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

// Admin: Delete product
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
