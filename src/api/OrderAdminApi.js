import api from "../services/api";

function findAll(params = {}) {
  return api.get("/admin/orders", { params }).then(res => {
    const orders = res.data.member ?? res.data["hydra:member"] ?? [];
    const total = res.data.totalItems ?? res.data["hydra:totalItems"] ?? orders.length;

    return {
      data: orders,
      total,
      pages: Math.ceil(total / (params.itemsPerPage || 12))
    };
  });
}

function findById(id) {
  return api.get(`/admin/orders/${id}`).then(res => res.data);
}

function updateStatus(id, status) {
  return api.patch(`/orders/${id}/status`, { status })
    .then(res => res.data);
}

export default {
  findAll,
  findById,
  updateStatus
};