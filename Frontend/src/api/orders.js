import api from "./axios";

// Place a new order
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

// Get my orders (Current user)
export const getMyOrders = async () => {
  const res = await api.get("/orders/me");
  return res.data;
};

// Get single order by ID
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// Update order status (Admin only)
export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
};
