import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ordersAPI from "../api/ordersAPI";
import { API_BASE_URL } from "../config/api";

export default function CommandeDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI
      .findById(id)
      .then((res) => {
        setOrder(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-gray-500">Chargement de la commande...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-4 p-6">
        <p className="text-gray-600">
          Impossible de trouver cette commande.
        </p>

        <Link
          to="/commandes"
          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          Retour à mes commandes
        </Link>
      </div>
    );
  }

  const totalItems =
    order.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-5 py-8">

        <Link
          to="/commandes"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-green-600"
        >
          <span>←</span>
          Retour à mes commandes
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">
              Détails de votre commande
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Commande n°{order.id}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Passée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-BE")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
                order.status
              )}`}
            >
              {translateStatus(order.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${paymentStyle(
                order.paymentStatus
              )}`}
            >
              {translatePayment(order.paymentStatus)}
            </span>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${statusStyle(
                order.status
              )}`}
            >
              {order.status === "delivered" && "✓"}
              {order.status === "shipped" && "→"}
              {order.status === "pending" && "…"}
              {order.status === "cancelled" && "×"}
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                {translateStatus(order.status)}
              </h2>

              {order.status === "pending" && (
                <p className="mt-1 text-sm text-gray-500">
                  Votre commande est actuellement en préparation.
                </p>
              )}

              {order.status === "shipped" && (
                <p className="mt-1 text-sm text-gray-500">
                  Votre commande a été expédiée.
                </p>
              )}

              {order.status === "delivered" && (
                <p className="mt-1 text-sm text-gray-500">
                  Votre commande a été livrée.
                </p>
              )}

              {order.status === "cancelled" && (
                <p className="mt-1 text-sm text-gray-500">
                  Cette commande a été annulée.
                </p>
              )}

              {order.shippedAt && (
                <p className="mt-2 text-xs text-gray-400">
                  Expédiée le{" "}
                  {new Date(order.shippedAt).toLocaleDateString("fr-BE")}
                </p>
              )}

              {order.deliveredAt && (
                <p className="text-xs text-gray-400">
                  Livrée le{" "}
                  {new Date(order.deliveredAt).toLocaleDateString("fr-BE")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Articles commandés
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {totalItems} article
                  {totalItems > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => {
                const product = item.product;

                const image =
                  product?.images?.find(
                    (img) => img.typeImage === "main"
                  ) || product?.images?.[0];

                const imageUrl = image?.imagePath
                  ? `${API_BASE_URL}${image.imagePath}`
                  : "/ImageNotFound.webp";

                const itemTotal =
                  item.quantity * Number(item.priceAtPurchase);

                return (
                  <div
                    key={item["@id"] || product.id}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "/ImageNotFound.webp";
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantité : {item.quantity}
                      </p>

                      <p className="text-sm text-gray-500">
                        Prix unitaire :{" "}
                        {Number(item.priceAtPurchase).toFixed(2)} €
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-bold text-gray-900">
                        {itemTotal.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Récapitulatif
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Articles</span>
                <span className="font-medium text-gray-900">
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Paiement</span>
                <span className="font-medium text-gray-900">
                  {translatePaymentMethod(order.paymentMethod)}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-green-600">
                    {Number(order.totalPrice).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.address && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Adresse de livraison
              </h2>

              <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                {order.user && (
                  <p className="font-semibold text-gray-900">
                    {order.user.firstname} {order.user.lastname}
                  </p>
                )}

                <p>
                  {order.address.street} {order.address.number}
                </p>

                <p>
                  {order.address.postalCode} {order.address.city}
                </p>

                <p>{order.address.country}</p>
              </div>
            </div>
          )}

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Paiement
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Méthode</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {translatePaymentMethod(order.paymentMethod)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Statut</p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentStyle(
                    order.paymentStatus
                  )}`}
                >
                  {translatePayment(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/commandes"
            className="btn-primary"
          >
            Voir toutes mes commandes
          </Link>
        </div>
      </div>
    </div>
  );
}