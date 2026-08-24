import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import commandesAPI from "../api/commandesAPI";

export default function ProfileOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  useEffect(() => {
    commandesAPI
      .findAll({
        page: 1,
        itemsPerPage: 3,
        "order[createdAt]": "desc",
      })
      .then(({ data }) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="mt-4 text-sm text-gray-500">Chargement des commandes...</p>;
  }

  if (!orders.length) {
    return (
      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-gray-500">Vous n'avez encore passé aucune commande.</p>
        <Link to="/" className="mt-3 inline-block font-semibold text-green-600 hover:underline">
          Découvrir nos produits →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {orders.map((order, index) => {
          const totalItems = order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

          return (
            <div
              key={order.id}
              className={`p-4 transition-colors hover:bg-gray-50 ${index !== orders.length - 1 ? "border-b border-gray-200" : ""}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-gray-900">Commande n°{order.id}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-gray-500">
                    <span>{new Date(order.createdAt).toLocaleDateString("fr-BE")}</span>
                    <span>•</span>
                    <span>{totalItems} article{totalItems > 1 ? "s" : ""}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <p className="shrink-0 font-bold text-gray-900">{Number(order.totalPrice).toFixed(2)} €</p>
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

      <div className="mt-4 text-center">
        <Link to="/commandes" className="font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline">
          Voir toutes mes commandes →
        </Link>
      </div>
    </div>
  );
}