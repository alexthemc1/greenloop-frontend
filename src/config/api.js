import axios from "axios";

const isDev = window.location.hostname === "localhost";

export const API_BASE_URL = isDev
  ? "http://localhost:8000"
  : "https://api.alexandreboutry.be";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});