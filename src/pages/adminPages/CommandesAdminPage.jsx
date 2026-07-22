import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderAdminAPI from "../../api/OrderAdminApi";
import Pagination from "../../components/Pagination";

export default function CommandesAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      setLoading(true);

      try {
        const res = await OrderAdminAPI.findAll({
          page,
          itemsPerPage: 12,
          "order[createdAt]": "desc"
        });
        if (!cancelled) {
          setOrders(res.data);
          setPages(res.pages);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [page]);

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

  const statusColor = status => {
    switch (status) {
      case "delivered":
        return "bg-green-600 text-white";
      case "shipped":
        return "bg-blue-600 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-300";
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl p-4 shadow">
        <h1 className="text-3xl font-bold">Commandes</h1>
        <p>Page {page} / {pages}</p>
      </div>

      {/* version ordinateur */}
      <div className="hidden lg:block space-y-3">
        <div className="grid grid-cols-[80px_1fr_2fr_120px_120px_80px] gap-4 bg-amber-300 rounded-xl p-3 font-bold">
          <p>ID</p>
          <p>Clients</p>
          <p className="text-center">Date</p>
          <p>Total</p>
          <p>Statut</p>
          <p></p>
        </div>

        {orders.map(order => (
          <div
            key={order.id}
            className="grid grid-cols-[80px_1fr_2fr_120px_120px_80px] gap-4 items-center bg-white rounded-xl shadow p-4"
          >
            <p className="font-bold">#{order.id}</p>

            <div>
              <p className="font-bold">{order.user?.firstname} {order.user?.lastname}</p>
              <p className="text-sm text-gray-500">{order.user?.email}</p>
            </div>

            <p className="text-center">
              {new Date(order.createdAt).toLocaleDateString("fr-BE")}
            </p>

            <p className="font-bold text-green-600">
              {Number(order.totalPrice).toFixed(2)} €
            </p>

            <span className={`rounded-full px-3 py-1 text-sm font-bold text-center ${statusColor(order.status)}`}>
              {translateStatus(order.status)}
            </span>

            <Link
              to={`/admin/orders/${order.id}`}
              className="text-green-600 font-bold"
            >
              Voir
            </Link>
          </div>
        ))}
      </div>

      {/* version mobile */}
      <div className="lg:hidden space-y-3">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">Commande #{order.id}</p>
                <p className="text-gray-600">{order.user?.firstname} {order.user?.lastname}</p>
                <p className="text-sm text-gray-500 break-all">{order.user?.email}</p>
              </div>

              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor(order.status)}`}>
                {translateStatus(order.status)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span>{new Date(order.createdAt).toLocaleDateString("fr-BE")}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-green-600">
                {Number(order.totalPrice).toFixed(2)} €
              </span>
            </div>


            <div className="flex items-center justify-end text-sm">
            <Link
              to={`/admin/orders/${order.id}`}
              className="text-center bg-green-600 text-white rounded-lg py-1 px-4 font-bold"
            >
              Voir la commande
            </Link>
          </div>
          </div>
        ))}
      </div>

      <Pagination page={page} pages={pages} setPage={setPage} />
    </div>
  );
}
