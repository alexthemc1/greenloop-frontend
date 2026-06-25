import api from "../services/api";

const cartAPI = {
  getCart: () => api.get("/cart"),

  add: (productId, quantity) =>
    api.post("/cart/add", { productId, quantity }),

  updateItem: (id, quantity) =>
    api.patch(`/cart/item/${id}`, { quantity }),

  removeItem: (id) =>
    api.delete(`/cart/item/${id}`),

  clear: () => 
    api.delete("/cart"),
};

export default cartAPI;