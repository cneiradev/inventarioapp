import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para token JWT (preparado para microservicios Java)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productosApi = {
  getAll: () => api.get("/api/productos"),
  getById: (id: string) => api.get(`/api/productos/${id}`),
  create: (data: any) => api.post("/api/productos", data),
  update: (id: string, data: any) => api.put(`/api/productos/${id}`, data),
  delete: (id: string) => api.delete(`/api/productos/${id}`),
};

export const movimientosApi = {
  getAll: () => api.get("/api/movimientos"),
  create: (data: any) => api.post("/api/movimientos", data),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),
};

export const dashboardApi = {
  resumen: () => api.get("/api/dashboard/resumen"),
};
