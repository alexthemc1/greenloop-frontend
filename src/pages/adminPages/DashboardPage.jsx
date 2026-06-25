import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function DashboardPage() {
  const [derniersCommentaires, setDerniersCommentaires] = useState([]);
  const [derniersUtilisateurs, setDerniersUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const usersRes = await api.get("/users?page=1&order[createdAt]=desc");
    const commentsRes = await api.get("/comments?page=1&itemsPerPage=12&order[createdAt]=desc");
    const users = usersRes.data.member || [];
    const comments =
      commentsRes.data["hydra:member"] ||
      commentsRes.data.member ||
      commentsRes.data.data ||
      [];

    setDerniersUtilisateurs(users.slice(0, 5));
    setDerniersCommentaires(comments.slice(0, 5));
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        await fetchDashboard();
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* menu de navigation rapide */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Link className="bg-white rounded-xl p-4 shadow hover:shadow-lg flex justify-center" to="/admin/products">
          <p className="font-bold text-green-600">Produits</p>
        </Link>

        <Link className="bg-white rounded-xl p-4 shadow hover:shadow-lg flex justify-center" to="/admin/users">
          <p className="font-bold text-green-600">Utilisateurs</p>
        </Link>

        <Link className="bg-white rounded-xl p-4 shadow hover:shadow-lg flex justify-center" to="/admin/commentaires">
          <p className="font-bold text-green-600">Commentaires</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* les dernier utilisateurs */}
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <h2 className="font-bold text-lg">Nouveaux utilisateurs</h2>

          {derniersUtilisateurs.length === 0 && (
            <p className="text-sm text-gray-500">Aucun utilisateur</p>
          )}

          {derniersUtilisateurs.map((u) => (
            <div key={u.id} className="flex items-center gap-3 border-b pb-2 last:border-none">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={
                    u.profileImage?.trim()
                      ? u.profileImage
                      : "/icons/user-regular-full.svg"
                  }
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold">
                  {u.firstname} {u.lastname}
                </p>
                <p className="text-xs text-gray-500">{u.email}</p>
                <p className="text-xs text-gray-400">
                  Inscrit le{" "}
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("fr-BE")
                    : "-"}
                </p>
              </div>
            </div>
          ))}

          <Link to="/admin/users" className="text-green-600 text-sm font-bold">
            Voir tous →
          </Link>
        </div>

        {/* les derniers comentaire  */}
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <h2 className="font-bold text-lg">Derniers commentaires</h2>

          {derniersCommentaires.length === 0 && (
            <p className="text-sm text-gray-500">Aucun commentaire</p>
          )}

          {derniersCommentaires.map((c) => (
            <div key={c.id} className="border-b pb-2 last:border-none">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      c.user?.profileImage?.trim()
                        ? c.user.profileImage
                        : "/icons/user-regular-full.svg"
                    }
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <p className="text-sm font-semibold">
                  {c.user?.firstname} {c.user?.lastname}
                </p>
              </div>

              <p className="text-xs text-gray-500">{c.product?.name}</p>
              <p className="text-sm text-gray-700 line-clamp-2">{c.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString("fr-BE")
                  : "-"}
              </p>
            </div>
          ))}

          <Link to="/admin/commentaires" className="text-green-600 text-sm font-bold">
            Voir tous →
          </Link>
        </div>


      </div>
    </div>
  );
}