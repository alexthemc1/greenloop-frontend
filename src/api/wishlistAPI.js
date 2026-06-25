import api from "../services/api";

const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),

  add: (productId) =>
    api.post("/wishlist/add", { productId }),

  removeItem: (id) =>
    api.delete(`/wishlist/item/${id}`),

  clear: () =>
    api.delete("/wishlist"),
};

export default wishlistAPI;