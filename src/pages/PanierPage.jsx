import { useEffect, useState } from "react";
import cartAPI from "../api/cartAPI";
import PanierBanner from "../components/Banners/PanierBanner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PanierPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = "http://localhost:8000";
  const items = cart?.items ?? [];

  const loadCart = () => {
    cartAPI.getCart()
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalItems = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const subtotal = items.reduce((acc, item) => {
    const product = item?.product;

    const price = Number(product?.price ?? 0);
    const discount = product?.discountPercent ?? 0;

    const finalPrice =
      discount > 0
        ? price - (price * discount) / 100
        : price;

    return acc + finalPrice * item.quantity;
  }, 0);

  const originalSubtotal = items.reduce((acc, item) => {
    const product = item?.product;

    const price = Number(product?.price ?? 0);

    return acc + price * item.quantity;
  }, 0);

  if (loading) return <p>Chargement...</p>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div>
        <PanierBanner />
        <div className="flex justify-center items-center w-full h-64">
          <p>Votre panier est vide</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PanierBanner />

      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-5">
          <div className="flex flex-col gap-5 flex-1">
            {/* En-tête */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_50px] gap-4 p-4 bg-amber-300 rounded-xl font-bold">
              <p>Produit</p>
              <p>Prix</p>
              <p>Quantité</p>
              <p>Sous-total</p>
              <p>Réduction</p>
              <p></p>
            </div>

            {/*  (version desktop) */}
            {cart.items.map(item => {
              const product = item.product;

              const price = Number(product.price);
              const isPromo = product.discountPercent > 0;

              const finalPrice = isPromo
                ? price - (price * product.discountPercent) / 100
                : price;

              const subtotal = finalPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_50px] items-center gap-4 p-4 bg-white rounded-xl shadow-md"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={`${API_BASE}${product.images?.[0]?.imagePath}`}
                        alt={product.name}
                      />
                    </div>

                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-green-600 font-light">
                        {product.category?.name}
                      </p>
                    </div>
                  </div>

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

                  <div className="flex gap-2 items-center">
                    <button
                      className="w-8 h-8 rounded border"
                      onClick={() => {
                        const newQty = item.quantity - 1;
                        if (newQty <= 0) return;

                        cartAPI.updateItem(item.id, newQty).then(loadCart);
                      }}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="w-8 h-8 rounded border"
                      onClick={() => {
                        cartAPI.updateItem(item.id, item.quantity + 1)
                          .then(loadCart);
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold">
                      {subtotal.toFixed(2)} €
                    </span>

                    {isPromo && (
                      <span className="text-gray-500 line-through text-sm">
                        {(price * item.quantity).toFixed(2)} €
                      </span>
                    )}
                  </div>

                  <div>
                    {isPromo && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        await cartAPI.removeItem(item.id);
                        toast.success(`${product.name} retiré du panier`);
                        loadCart();
                      } catch {
                        toast.error("Erreur lors de la suppression");
                      }
                    }}
                  >
                    ❌
                  </button>
                </div>
              );
            })}

            {/*  (version mobile) */}
            {cart.items.map(item => {
              const product = item.product;
              const price = Number(product?.price ?? 0);
              const discount = Number(product?.discountPercent ?? 0);
              const isPromo = discount > 0;

              const LigneInfos = ({ label, children }) => (
                <div className="flex justify-between items-center">
                  <span>{label}</span>
                  <div className="flex items-center flex-1 mx-3">
                    <div className="border-b border-dotted border-gray-400 flex-1"></div>
                  </div>
                  <div className="text-right">{children}</div>
                </div>
              );

              const finalPrice = isPromo
                ? price - (price * discount) / 100
                : price;

              return (
                <div key={item.id} className="md:hidden flex items-center flex-col bg-white rounded-xl shadow-md p-4 relative">

                  <div className="w-50 h-50 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={`${API_BASE}${product.images?.[0]?.imagePath}`}
                      alt={product.name}
                    />
                  </div>

                  <div className="flex-1 text-center mt-3">
                    <p className="font-bold">{product.name}</p>
                    <p className="text-green-600 font-semibold">{product.category?.name}</p>
                  </div>

                  <button
                    className="absolute top-2 right-2"
                    onClick={async () => {
                      try {
                        await cartAPI.removeItem(item.id);
                        toast.success(`${product.name} retiré du panier`);
                        loadCart();
                      } catch {
                        toast.error("Erreur lors de la suppression");
                      }
                    }}
                  >
                    ❌
                  </button>

                  <div className="mt-4 space-y-3 w-full">

                    <LigneInfos label="Prix">
                      <div className="flex flex-col items-end leading-tight">
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

                    <div className="flex justify-between items-center">
                      <span>Quantité</span>
                      <div className="border-b border-dotted border-gray-400 flex-1 mx-4"></div>

                      <div className="flex gap-2 items-center">
                        <button onClick={() => cartAPI.updateItem(item.id, item.quantity - 1).then(loadCart)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => cartAPI.updateItem(item.id, item.quantity + 1).then(loadCart)}>+</button>
                      </div>
                    </div>

                    <LigneInfos label="Sous-total">
                      <div className="flex flex-col items-end leading-tight">
                        <span className="font-semibold">
                          {(finalPrice * item.quantity).toFixed(2)} €
                        </span>

                        {isPromo && (
                          <span className="text-gray-400 line-through text-sm">
                            {(price * item.quantity).toFixed(2)} €
                          </span>
                        )}
                      </div>
                    </LigneInfos>

                  </div>
                </div>
              );
            })}

            <button
              onClick={() => {
                if (!window.confirm("êtes-vous sûr de vouloir vider le panier ?")) return;
                cartAPI.clear().then(() => {
                  loadCart();
                });
              }}
              className="text-green-600 flex justify-end"
            >
              Effacer le panier
            </button>
          </div>

          {/* Résumé */}
          <div
            className="w-full lg:w-96 shrink-0 min-h-65 rounded-xl border-2 border-green-600 bg-white shadow-md p-4 flex flex-col justify-between"
            style={{
              backgroundImage: "url('/motif.svg')",
              backgroundRepeat: "repeat",
              backgroundSize: "350px 350px",
            }}
          >
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold">Résumé</h3>

              <div className="flex justify-between">
                <p className="text-gray-500">Nombre d'articles</p>
                <p className="font-bold">{totalItems}</p>
              </div>

              <div className="flex justify-between items-start">
                <p className="text-gray-500">Sous-total</p>

                <div className="flex flex-col items-end leading-tight">
                  <span className="font-bold text-green-600">
                    {subtotal.toFixed(2)} €
                  </span>

                  {originalSubtotal > subtotal && (
                    <span className="text-gray-400 line-through text-sm">
                      {originalSubtotal.toFixed(2)} €
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-500">Livraison</p>
                <p className="font-bold">Gratuit</p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex justify-between">
                <p className="text-gray-500">Total</p>
                <p className="font-bold text-lg">{subtotal.toFixed(2)} €</p>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full text-center"
              >
                Passer au paiement
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PanierPage;