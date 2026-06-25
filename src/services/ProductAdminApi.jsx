import api from "./api";

function get(id) {
  return api.get(`/products/${id}`);
}

function create(productData) {
  return api.post(
    "/products",
    productData,
    {
      headers: {
        "Content-Type": "application/ld+json",
      },
    }
  );
}

function update(id, productData) {
  return api.patch(
    `/products/${id}`,
    productData,
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );
}

function remove(id) {
  return api.delete(`/products/${id}`);
}
function getOne(id) {
  return api.get(`/products/${id}`);
}

function getCategories() {
  return api.get("/categories");
}

function getNutritionalIcons() {
  return api.get("/nutritional_icons");
}

function deleteImage(id) {
  return api.delete(`/product_images/${id}`);
}

function createImage(imageData) {
  return api.post(
    "/product_images",
    imageData,
    {
      headers: {
        "Content-Type": "application/ld+json",
      },
    }
  );
}

function uploadImage(formData) {
  return api.post(
    "/product_images/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export default {
  get,
  create,
  update,
  remove,
  getOne,
  getCategories,
  getNutritionalIcons,
  deleteImage,
  createImage,
  uploadImage
};