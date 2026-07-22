import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ordersAPI from "../api/ordersAPI";
import { Link } from "react-router-dom";

export default function CommandeDetailPage() {
  const { id } = useParams();
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
  const [order, setOrder] = useState(null);

  useEffect(() => {
    ordersAPI
      .findById(id)
      .then(res => {
        setOrder(res);
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]);

  if (!order) {
    return <p className="p-10">Chargement...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Commande n°{order.id}
      </h1>

      <div className="rounded-xl bg-white p-6 shadow">
        <p>
          Statut :
          <span className="ml-2 font-bold">
            {translateStatus(order.status)}
          </span>
        </p>

        {order.shippedAt && (
          <p className="text-sm text-gray-500 mt-2">
            Expédiée le :
            {" "}
            {new Date(order.shippedAt).toLocaleDateString("fr-BE")}
          </p>
        )}

        {order.deliveredAt && (
          <p className="text-sm text-gray-500">
            Livrée le :
            {" "}
            {new Date(order.deliveredAt).toLocaleDateString("fr-BE")}
          </p>
        )}

        <p>
          Total :
          <span className="ml-2 font-bold">
            {Number(order.totalPrice).toFixed(2)} €
          </span>
        </p>

        <h2 className="mt-6 mb-3 font-bold">Articles</h2>

        {order.items.map(item => (
          <div key={item["@id"]} className="border-b py-3">
            <p className="font-semibold">{item.product.name}</p>
            <p>Quantité : {item.quantity}</p>
            <p>Prix : {Number(item.priceAtPurchase).toFixed(2)} €</p>
          </div>
        ))}
      </div>
      <Link to="/commandes" className="col-span-full block text-center font-semibold text-green-600">
        Voir toutes mes commandes
      </Link>
    </div>
  );
}