import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setupAxios() {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const jwtData = jwtDecode(token);

      if (jwtData.exp * 1000 > Date.now()) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("authToken");
      }
    } catch {
      localStorage.removeItem("authToken");
    }
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const jwtData = jwtDecode(token);

      if (jwtData.exp * 1000 > Date.now()) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem("authToken");
      }
    } catch {
      localStorage.removeItem("authToken");
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
    }

    return Promise.reject(error);
  }
);

export default api;