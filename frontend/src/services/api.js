import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_PUBLIC_APP_URL_API,
    withCredentials: true,
});

// Adiciona o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Public routes
export const getProducts = async (searchText = "", categoryId = null) => {
  let url = "/products";
  const params = [];

  if (searchText) {
    params.push(`search=${encodeURIComponent(searchText)}`);
  }
  if (categoryId) {
    params.push(`category=${categoryId}`);
  }

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Authenticated routes
export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/register", data);
    return response.data;
  } catch (error) {
    console.error("Register failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export const updateProduct = async (id, data) => {
  const response = await api.post(`/products/update/${id}`, data);
  return response.data;
};

export const storeProduct = async (data) => {
  const response = await api.post("/products/store", data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.post(`/products/delete/${id}`);
  return response.data;
};

export const storeCategory = async (data) => {
  const response = await api.post("/categories/store", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.post(`/categories/update/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.post(`/categories/delete/${id}`);
  return response.data;
};