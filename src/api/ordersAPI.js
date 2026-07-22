import api from "../services/api";

const ordersAPI = {

  create: (data) =>
    api.post("/orders", data),

  findById: (id) =>
    api.get(`/orders/${id}`)
      .then(res => res.data),

};

export default ordersAPI;