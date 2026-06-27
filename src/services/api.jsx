import { jwtDecode } from "jwt-decode";
import { api } from "../config/api";

const client = api;

export function setupAxios() {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const jwtData = jwtDecode(token);

      if (jwtData.exp * 1000 > Date.now()) {
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("authToken");
      }
    } catch {
      localStorage.removeItem("authToken");
    }
  }
}

client.interceptors.request.use((config) => {
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

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      delete client.defaults.headers.common["Authorization"];
    }

    return Promise.reject(error);
  }
);

export default client;