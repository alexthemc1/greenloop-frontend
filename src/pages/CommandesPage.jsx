import { useEffect, useState } from "react";
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
      .then(({ data }) => {
        setOrders(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const translateStatus = status => {
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

  const translatePayment = status => {
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

  const translatePaymentMethod = method => {
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

  const statusColor = status => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "shipped":
        return "bg-blue-600 text-white";
      case "delivered":
        return "bg-green-600 text-white";
      case "cancelled":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-300";
    }
  };

  const paymentColor = status => {
    switch (status) {
      case "paid":
        return "bg-green-600 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "unpaid":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-300";
    }
  };

  if (loading) return <p className="mt-10 text-center">Chargement...</p>;

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

      <div className="max-w-7xl mx-auto p-5">
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
                className={`rounded-xl bg-white p-4 shadow-sm transition-all ${index === 0 ? "border shadow-lg lg:col-span-3" : "border"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {index === 0 && (
                      <div className="mb-3 inline-flex rounded-full bg-green-600 px-3 py-1 text-sm font-bold text-white">
                        Dernière commande
                      </div>
                    )}

                    <p className="font-bold">Commande n°{order.id}</p>
                    <p className="text-sm text-gray-500">
                      Passée le {new Date(order.createdAt).toLocaleDateString("fr-BE")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {Number(order.totalPrice).toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500">
                      {totalItems} article{totalItems > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor(order.status)}`}>
                    {translateStatus(order.status)}
                  </span>

                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${paymentColor(order.paymentStatus)}`}>
                    {translatePayment(order.paymentStatus)}
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {translatePaymentMethod(order.paymentMethod)}
                  </span>
                </div>

                <div className="mt-5 border-t pt-5">
                  <h3 className="mb-2 font-semibold">Adresse de livraison</h3>

                  <div className="text-sm text-gray-600">
                    <p>{order.user.firstname} {order.user.lastname}</p>
                    <p>{order.address.street} {order.address.number}</p>
                    <p>{order.address.postalCode} {order.address.city}</p>
                    <p>{order.address.country}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 border-t pt-5">
                  {order.items?.map(item => {
                    const product = item.product;
                    const image =
                      product?.images?.find(img => img.typeImage === "main") ||
                      product?.images?.[0];

                    const imageUrl = image?.imagePath
                      ? `${API_BASE_URL}${image.imagePath}`
                      : "/ImageNotFound.webp";

                    return (
                      <div
                        key={item["@id"] || product.id}
                        className="grid grid-cols-2 gap-4 sm:flex sm:items-center"
                      >
                        <div className="order-1 h-20 overflow-hidden rounded-md sm:order-0 sm:w-20">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full object-cover"
                            onError={e => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/ImageNotFound.webp";
                            }}
                          />
                        </div>

                        <div className="order-2 sm:order-0 sm:flex-1">
                          <p className="font-bold">{product.name}</p>
                          <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                          <p className="text-sm text-gray-500">
                            Prix unitaire : {Number(item.priceAtPurchase).toFixed(2)} €
                          </p>
                        </div>

                        <div className="order-3 col-span-2 text-center font-bold text-green-600 sm:order-0 sm:ml-auto sm:text-right">
                          {(item.quantity * Number(item.priceAtPurchase)).toFixed(2)} €
                        </div>
                      </div>
                    );
                  })}
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
