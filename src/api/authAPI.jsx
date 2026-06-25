import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "authToken";

/**
 * LOGIN
 */
async function authenticate(credentials) {
  const res = await api.post("/login_check", {
    email: credentials.email,
    password: credentials.password
  });

  const token = res.data.token;

  localStorage.setItem(TOKEN_KEY, token);

  return token;
}

/**
 * LOGOUT
 */
function logout() {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common["Authorization"];
}

/**
 * SETUP
 */
function setup() {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 > Date.now()) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      logout();
    }
  } catch {
    logout();
  }
}

/**
 * AUTH CHECK
 */
function isAuthenticated() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/**
 * GET TOKEN USER (minimal info only)
 */
function getTokenUser() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      email: decoded.username,
      roles: decoded.roles || []
    };
  } catch {
    return null;
  }
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
  getTokenUser
};