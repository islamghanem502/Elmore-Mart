import api from "./axios";

// Fetch all categories
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// Admin: Create category
export const createCategory = async (data) => {
  const res = await api.post("/categories", data);
  return res.data;
};

// Admin: Update category
export const updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

// Admin: Delete category
export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
