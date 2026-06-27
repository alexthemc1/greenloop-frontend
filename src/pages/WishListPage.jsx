import { useEffect, useState } from "react";
import WhishListBanner from "../components/Banners/WhishListBanner";
import wishlistAPI from "../api/wishlistAPI";
import cartAPI from "../api/cartAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { STATIC_BASE_URL } from "../config/api";

const WhishListPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = () => {
    wishlistAPI.getWishlist()
      .then(res => {
        setWishlist(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const clearWishlist = async () => {
    if (!window.confirm("Vider toute la wishlist ?")) return;

    try {
      await Promise.all(
        wishlist.map(item => wishlistAPI.removeItem(item.id))
      );
      loadWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (!wishlist || wishlist.length === 0) {
    return (
      <div>
        <WhishListBanner />
        <div className="flex justify-center items-center w-full h-64">
          <p>Votre wishlist est vide</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <WhishListBanner />

      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-5">

          <div className="flex flex-col gap-5 flex-1">

            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 bg-amber-300 rounded-xl font-bold">
              <p>Produit</p>
              <p>Prix</p>
              <p>Réduction</p>
              <p>Date d'ajout</p>
              <p></p>
              <p></p>
            </div>

            {/* version ordinateur */}
            {wishlist.map(item => {
              const product = item.product;

              const price = Number(product.price);
              const isPromo = product.discountPercent > 0;

              const finalPrice = isPromo
                ? price - (price * product.discountPercent) / 100
                : price;

              return (
                <div
                  key={item.id}
                  className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_2fr] items-center gap-4 p-4 bg-white rounded-xl shadow-md"
                >

                  {/* PRODUIT */}
                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={`${STATIC_BASE_URL}${product.images?.[0]?.imagePath}`}
                        alt={product.name}
                      />
                    </div>

                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-green-600 text-sm">
                        {product.category?.name}
                      </p>
                    </div>
                  </div>

                  {/* PRIX */}
                  <div className="flex flex-col leading-tight">
                    <span className="text-green-600 font-semibold">
                      {finalPrice.toFixed(2)} €
                    </span>

                    {isPromo && (
                      <span className="text-gray-500 line-through text-sm">
                        {price.toFixed(2)} €
                      </span>
                    )}
                  </div>

                  {/* RÉDUCTION */}
                  <div>
                    {isPromo ? (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        -{product.discountPercent}%
                      </span>
                    ) : (
                      <span className="text-gray-400"></span>
                    )}
                  </div>

                  {/* DATE */}
                  <div className="text-sm text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                  <div className="flex gap-4 justify-center">

                    {/* AJOUT PANIER */}
                    <button
                      className="btn-primary"
                      onClick={async () => {
                        try {
                          await cartAPI.add(product.id, 1);
                          toast.success(`${product.name} ajouté au panier`);
                        } catch (error) {
                          toast.error(
                            error.response?.data?.message ||
                            "Erreur lors de l'ajout au panier"
                          );
                        }
                      }}
                    >
                      <p>Ajouter au panier</p>
                      <div className="shrink-0 flex items-center justify-center w-5">
                        <img src="/icons/bag-shopping-solid-full.svg" className="h-5" />
                      +
                      </div>
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={async () => {
                        try {
                          await wishlistAPI.removeItem(item.id);
                          toast.success(`${product.name} retiré de la wishlist`);
                          loadWishlist();
                        } catch {
                          toast.error("Erreur lors de la suppression");
                        }
                      }}
                    >
                      ❌
                    </button>
                  </div>

                </div>
              );
            })}

            {/* version mobile */}
            {wishlist.map(item => {
              const product = item.product;

              const price = Number(product.price);
              const isPromo = product.discountPercent > 0;

              const finalPrice = isPromo
                ? price - (price * product.discountPercent) / 100
                : price;

              const LigneInfos = ({ label, children }) => (
                <div className="flex justify-between items-center">
                  <span>{label}</span>
                  <div className="flex-1 border-b border-dotted mx-3"></div>
                  <div>{children}</div>
                </div>
              );

              return (
                <div key={item.id} className="md:hidden flex items-center flex-col bg-white rounded-xl shadow-md p-4 gap-3 relative">
                  <div className="w-50 h-50 overflow-hidden rounded-md bg-gray-100">
                    <img
                     src={`${STATIC_BASE_URL}${product.images?.[0]?.imagePath}`}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 text-center mt-3">
                    <p className="font-bold">{product.name}</p>
                    <p className="text-green-600 font-semibold">
                      {product.category?.name}
                    </p>
                  </div>

                  <button
                    className="absolute top-2 right-2"
                    onClick={async () => {
                      try {
                        await wishlistAPI.removeItem(item.id);
                        toast.success(`${product.name} retiré de la wishlist`);
                        loadWishlist();
                      } catch {
                        toast.error("Erreur lors de la suppression");
                      }
                    }}
                  >
                    ❌
                  </button>

                  <div className="mt-4 space-y-3 w-full">

                    <LigneInfos label="Prix">
                      <div className="flex flex-col items-end">
                        <span className="text-green-600 font-semibold">
                          {finalPrice.toFixed(2)} €
                        </span>
                        {isPromo && (
                          <span className="text-gray-400 line-through text-sm">
                            {price.toFixed(2)} €
                          </span>
                        )}
                      </div>
                    </LigneInfos>

                    <LigneInfos label="Réduction">
                      {isPromo ? `-${product.discountPercent}%` : "-"}
                    </LigneInfos>

                    <LigneInfos label="Date d'ajout">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "-"}
                    </LigneInfos>

                  </div>

                  <div className="flex justify-between mt-2">

                    <button
                      className="btn-primary"
                      onClick={async () => {
                        try {
                          await cartAPI.add(product.id, 1);
                          toast.success(`${product.name} ajouté au panier`);
                        } catch (error) {
                          toast.error(
                            error.response?.data?.message ||
                            "Erreur lors de l'ajout au panier"
                          );
                        }
                      }}
                    >
                      <p>Ajouter au panier</p>
                          <div className="shrink-0 flex items-center justify-center w-5">
                        <img src="/icons/bag-shopping-solid-full.svg" className="h-5" />
                      +
                      </div>
                    </button>

                  </div>
                </div>
              );
            })}

            {/* CLEAR ALL */}
            <button
              onClick={clearWishlist}
              className="text-green-600 flex justify-end mt-4"
            >
              Vider la wishlist
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WhishListPage;