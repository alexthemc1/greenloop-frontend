import api from "../services/api";

function searchProducts(query) {
    return api
        .get("/search/products", {
            params: {
                q: query
            }
        })
        .then((res) => res.data);
}

export default {
    searchProducts
};