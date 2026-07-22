import api from "../services/api";

function findAll(params = {}) {
  return api.get("/orders", { params }).then((res) => {
    const member =
      res.data.member ??
      res.data["hydra:member"] ??
      [];

    const total =
      res.data.totalItems ??
      res.data["hydra:totalItems"] ??
      0;

    return {
      data: member,
      total,
      pages: Math.ceil(
        total / (params.itemsPerPage || 12)
      )
    };
  });
}

function findById(id) {
  return api
    .get(`/orders/${id}`)
    .then((res) => res.data);
}

export default {
  findAll,
  findById,
};