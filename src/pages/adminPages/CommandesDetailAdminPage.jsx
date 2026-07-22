import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderAdminApi from "../../api/OrderAdminApi";
import AdminButton from "../../components/button/AdminButton";

export default function CommandesDetailAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    OrderAdminApi.findById(id)
      .then(setOrder)
      .catch(console.error);
  }, [id]);
  
  const statusColor = {
    pending: "text-yellow-500",
    shipped: "text-blue-500",
    delivered: "text-green-600",
    cancelled: "text-red-500"
  };
  const translateStatus = status => {
    switch (status) {
      case "pending":
        return "En attente";
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

  const changeStatus = async status => {
    try {
      await OrderAdminApi.updateStatus(id, status);

      setOrder(prev => ({
        ...prev,
        status
      }));

      toast.success("Statut modifié");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du statut");
    }
  };

  if (!order) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Commande #{order.id}</h1>

        <AdminButton variant="retour" onClick={() => navigate("/admin/orders")}>
          Retour
        </AdminButton>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-xl mb-4">Client</h2>

        <p>
          {order.user?.firstname} {order.user?.lastname}
        </p>

        <p>{order.user?.email}</p>

        <h2 className="font-bold text-xl mt-8 mb-4">Produits</h2>

        {order.items?.map(item => (
          <div key={item.id} className="border-b py-3">
            <p className="font-bold">{item.product?.name}</p>
            <p>Quantité : {item.quantity}</p>
            <p>Prix : {Number(item.priceAtPurchase).toFixed(2)} €</p>
          </div>
        ))}

        <h2 className="font-bold text-xl mt-8">Statut actuel :</h2>

        <p className={`mt-2 text-lg font-bold ${statusColor[order.status]}`}>
          {translateStatus(order.status)}
        </p>


        <div className="flex gap-3 mt-6 flex-wrap">
          <AdminButton variant="pending" disabled={order.status === "pending"} onClick={() => changeStatus("pending")} >
            En attente
          </AdminButton>

          <AdminButton variant="shipped" disabled={order.status === "shipped"} onClick={() => changeStatus("shipped")}>
            Expédier
          </AdminButton>

          <AdminButton variant="delivered" disabled={order.status === "delivered"} onClick={() => changeStatus("delivered")}>
            Livrer
          </AdminButton>
        </div>
      </div>
    </div>
  );
}