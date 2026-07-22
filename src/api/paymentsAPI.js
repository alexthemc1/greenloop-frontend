import api from "../services/api";

const paymentsAPI = {
  createIntent: () => api.post("/payments/create-intent"),
};

export default paymentsAPI;