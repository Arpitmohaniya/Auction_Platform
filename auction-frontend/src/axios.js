import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
});

// Attach token automatically if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
