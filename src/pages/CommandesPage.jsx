import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import commandesAPI from "../api/commandesAPI";
import { API_BASE_URL } from "../config/api";
import ProductBanner from "../components/Banners/ProductBanner";

const CommandesPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const loadOrders = () => {
    commandesAPI
      .findAll()
      .then(({ data }) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "En préparation";
      case "shipped":
        return "Expédiée";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const translatePayment = (status) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "unpaid":
        return "Non payé";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  const translatePaymentMethod = (method) => {
    switch (method) {
      case "card":
        return "Carte bancaire";
      case "cash":
        return "Espèces";
      case "paypal":
        return "PayPal";
      case "bancontact":
        return "Bancontact";
      default:
        return method;
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";
      case "delivered":
        return "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200";
    }
  };

  const paymentStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
      case "unpaid":
        return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200";
    }
  };

  if (loading) {
    return <p className="mt-10 text-center">Chargement...</p>;
  }

  if (!orders.length) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Vous n'avez encore passé aucune commande.</p>
      </div>
    );
  }

  return (
    <div>
      <ProductBanner />

      <div className="mx-auto max-w-7xl p-5">
        <h1 className="mb-8 text-3xl font-bold">Mes commandes</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedOrders.map((order, index) => {
            const totalItems = order.items.reduce(
              (total, item) => total + item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${index === 0 ? "lg:col-span-3" : ""
                  }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {index === 0 && (
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-200">
                        Dernière commande
                      </div>
                    )}

                    <p className="font-bold">Commande n°{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Passée le {new Date(order.createdAt).toLocaleDateString("fr-BE")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {Number(order.totalPrice).toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500">
                      {totalItems} article{totalItems > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>

                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${paymentStyle(order.paymentStatus)}`}>
                    {translatePayment(order.paymentStatus)}
                  </span>

                  <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
                    {translatePaymentMethod(order.paymentMethod)}
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">
                    Adresse de livraison
                  </h3>

                  <div className="text-sm leading-6 text-gray-600">
                    <p>{order.user.firstname} {order.user.lastname}</p>
                    <p>{order.address.street} {order.address.number}</p>
                    <p>{order.address.postalCode} {order.address.city}</p>
                    <p>{order.address.country}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 font-semibold text-gray-900">Articles commandés</h3>

                  <div className="space-y-4">
                    {order.items?.map((item) => {
                      const product = item.product;
                      const image =
                        product?.images?.find((img) => img.typeImage === "main") ||
                        product?.images?.[0];

                      const imageUrl = image?.imagePath
                        ? `${API_BASE_URL}${image.imagePath}`
                        : "/ImageNotFound.webp";

                      return (
                        <div key={item["@id"] || product.id} className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/ImageNotFound.webp";
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-gray-900">{product.name}</p>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.quantity} x {Number(item.priceAtPurchase).toFixed(2)} €
                            </p>
                          </div>

                          <p className="shrink-0 font-bold text-gray-900">
                            {(item.quantity * Number(item.priceAtPurchase)).toFixed(2)} €
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                    <Link
                      to={`/commandes/${order.id}`}
                      className="btn-primary"
                    >
                      Voir le détail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommandesPage;