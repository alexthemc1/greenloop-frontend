import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import commandesAPI from "../api/commandesAPI";

export default function ProfileOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

useEffect(() => {

  commandesAPI
    .findAll({
      page: 1,
      itemsPerPage: 3,
      "order[createdAt]": "desc"
    })
    .then(({ data }) => {
      setOrders(data);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });

}, []);

  if (loading) {
    return <p className="text-gray-500">Chargement des commandes...</p>;
  }

  if (!orders.length) {
    return <p className="text-gray-500">Vous n'avez aucune commande.</p>;
  }

  return (
    <div className="space-y-3 mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {orders.map(order => (
        <div key={order.id} className="flex items-center justify-between rounded-lg border p-2">
          <div>
            <p className="font-semibold">Commande n°{order.id}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("fr-BE")}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-green-600">
              {Number(order.totalPrice).toFixed(2)} €
            </p>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor(order.status)}`}>
              {translateStatus(order.status)}
            </span>
          </div>
        </div>
      ))}

      <Link to="/commandes" className="col-span-full block text-center font-semibold text-green-600">
        Voir toutes mes commandes
      </Link>
    </div>
  );
}