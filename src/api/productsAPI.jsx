import api from "../services/api";

function findAll(params = {}) {

  const apiParams = { ...params };

  if (params.sort === "price_asc") {
    apiParams["order[price]"] = "asc";
  }

  if (params.sort === "price_desc") {
    apiParams["order[price]"] = "desc";
  }

  if (params.sort === "alpha_asc") {
    apiParams["order[name]"] = "asc";
  }

  if (params.sort === "alpha_desc") {
    apiParams["order[name]"] = "desc";
  }

  delete apiParams.sort;

  if (params.search) {
    apiParams.name = params.search;
    delete apiParams.search;
  }

  if (params.onlyPromo) {
    apiParams["discountPercent[gt]"] = 0;
  }

  delete apiParams.onlyPromo;


  return api.get("/products", { params: apiParams }).then((res) => {
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
      ),
      category: null
    };
  });
}

function findById(id) {
  return api
    .get(`/products/${id}`)
    .then((res) => res.data);
}

export default {
  findAll,
  findById,
};