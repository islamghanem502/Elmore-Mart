import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Uses Vite proxy → http://localhost:5000/api
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("elmore-user");
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
