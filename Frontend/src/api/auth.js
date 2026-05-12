import api from "./axios";

// Register a new user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Login user
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
