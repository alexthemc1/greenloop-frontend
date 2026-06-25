import { useEffect, useState } from "react";
import api from "../../services/api";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ProductAdminApi from "../../services/ProductAdminApi";
import { toast } from "react-toastify";

import Pagination from "../../components/Pagination";
import AdminButton from "../../components/button/AdminButton";

import {
  getFinalPrice,
  getOldPrice,
  getPricePerKg,
} from "../../utils/productPricing";

export default function ProduitsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const API_BASE = "http://localhost:8000";

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);

    try {
      const res = await api.get(`/products?page=${pageNumber}`);

      const products =
        res.data.member ??
        res.data["hydra:member"] ??
        [];

      const total =
        res.data.totalItems ??
        res.data["hydra:totalItems"] ??
        0;

      setProducts(products);
      setPages(Math.ceil(total / 12));

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Supprimer ce produit ?"
    );

    if (!confirmDelete) return;

    try {
      await ProductAdminApi.remove(id);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );

      toast.success("Produit supprimé");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(page);
  }, [page]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="space-y-5">

      <div className="bg-white rounded-xl p-3 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p>Page {page} / {pages}</p>
        </div>

        <Link to="/admin/produits/ajouter">
          <AdminButton variant="principal">
            Ajouter un produit
          </AdminButton>
        </Link>
      </div>

      {/* version ordinateur  */}
      <div className="hidden lg:grid grid-cols-[80px_3fr_1fr_1fr_1fr_1fr_160px] gap-4 bg-amber-300 rounded-xl p-3 font-bold">
        <p>Image</p>
        <p>Produit</p>
        <p>Prix</p>
        <p>Promo</p>
        <p>Prix kg</p>
        <p>Stock</p>
        <p>Actions</p>
      </div>

      {products.map((product) => {
        const finalPrice = getFinalPrice(product);
        const oldPrice = getOldPrice(product);
        const priceKg = getPricePerKg(product);
        const mainImage =
          product.images?.find(
            (image) => image.typeImage === "main"
          ) || product.images?.[0];

        return (
          <div key={product.id} className="hidden lg:grid grid-cols-[80px_3fr_1fr_1fr_1fr_1fr_160px] gap-4 items-center bg-white rounded-xl shadow-sm p-3" >

            {/* l'image principal du produit */}
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
              <img
                src={
                  mainImage?.imagePath
                    ? `http://127.0.0.1:8000${mainImage.imagePath}`
                    : "/placeholder-product.jpg"
                }
                className="w-full h-full object-cover"
              />
            </div>
            {/* le nom de produit */}
            <div>
              <p className="font-bold text-gray-800 text-lg">{product.name}</p>
              <p className="text-green-600 ">
                {product.category?.name}
              </p>
            </div>
            {/* le prix final (avec ou sans réduction) */}
            <div className="flex flex-col">
              <span className="text-green-600 font-bold">
                {finalPrice.toFixed(2)} €
              </span>
              {/* le prix de base sans réduction  */}
              {product.discountPercent > 0 && (
                <span className="line-through text-gray-400 ">
                  {oldPrice.toFixed(2)} €
                </span>
              )}
            </div>
            {/* le pourcentage de réduction */}
            <div>
              {product.discountPercent ? (
                <span className="bg-green-600 text-white py-2 px-3 font-bold rounded-full ">
                  - {product.discountPercent}%
                </span>
              ) : (
                ""
              )}
            </div>
            {/* le prix au kilo */}
            <div>
              {priceKg ? `${priceKg.toFixed(2)} €` : "-"}
            </div>
            {/* le stock */}
            <div>
              <span
                className="px-3 py-1 rounded-full ">
                {product.stock}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Link to={`/admin/products/${product.id}`}>
                <AdminButton variant="modifier">
                  Modifier
                </AdminButton>
              </Link>
              <AdminButton
                variant="supprimer"
                onClick={() => handleDelete(product.id)}
              >
                Supprimer
              </AdminButton>
            </div>
          </div>
        );
      })}

      {/* version mobile */}
      <div className="lg:hidden space-y-3">
        {products.map((product) => {
          const finalPrice = getFinalPrice(product);
          const oldPrice = getOldPrice(product);
          const mainImage =
            product.images?.find(
              (image) => image.typeImage === "main"
            ) || product.images?.[0];
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-3 space-y-2"
            >
              {/* l'image principal du produit */}
              <div className="flex gap-3">
                <img
                  src={
                    mainImage?.imagePath
                      ? `http://127.0.0.1:8000${mainImage.imagePath}`
                      : "/placeholder-product.jpg"
                  }
                  className="w-16 h-16 rounded object-cover"
                />

                {/* le nom de produit */}
                <div>
                  <p className="font-bold text-gray-800">
                    {product.name}
                  </p>
                  <p className="text-green-600 text-sm">
                    {product.category?.name}
                  </p>
                </div>
              </div>

              {/* le prix final (avec ou sans réduction) */}
              <div className="flex justify-between text-sm">
                <span className="font-bold text-green-600">
                  {finalPrice.toFixed(2)} €
                </span>
                {/* le prix de base sans réduction  */}
                {product.discountPercent > 0 && (
                  <span className="line-through text-gray-400">
                    {oldPrice.toFixed(2)} €
                  </span>
                )}
              </div>

              {/* le stock */}
              <div className="flex justify-between text-sm">
                {/* stock */}
                <span>Stock : {product.stock}</span>

                {/* le pourcentage de réduction */}
                {product.discountPercent ? (
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                    -{product.discountPercent}%
                  </span>
                ) : null}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-2">
                <Link
                  to={`/admin/products/${product.id}`}
                  className="flex-1"
                >
                  <AdminButton variant="modifier">
                    Modifier
                  </AdminButton>
                </Link>

                <AdminButton
                  variant="supprimer"
                  onClick={() => handleDelete(product.id)}
                >
                  Supprimer
                </AdminButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* la pagination */}
      <Pagination
        page={page}
        pages={pages}
        setPage={setPage}
      />
    </div>
  );
}