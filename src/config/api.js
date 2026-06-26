import axios from "axios";

const isDev = window.location.hostname === "localhost";

export const api = axios.create({
  baseURL: isDev
    ? "http://localhost:8000"
    : "https://api.alexandreboutry.be",
});