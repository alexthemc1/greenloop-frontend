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
      } catch (error) {
        console.error("Erreur dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Accès rapides</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/products"
            className="group flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <p className="font-bold text-green-600">Produits</p>
              <p className="mt-1 text-xs text-gray-500">Gérer le catalogue</p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="group flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <p className="font-bold text-green-600">Utilisateurs</p>
              <p className="mt-1 text-xs text-gray-500">Gérer les comptes</p>
            </div>
          </Link>

          <Link
            to="/admin/commentaires"
            className="group flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <p className="font-bold text-green-600">Commentaires</p>
              <p className="mt-1 text-xs text-gray-500">Modérer les avis</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="group flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <p className="font-bold text-green-600">Commandes</p>
              <p className="mt-1 text-xs text-gray-500">Suivre les commandes</p>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold">Activité récente</h2>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-2 py-4">
              <div>
                <h2 className="text-lg font-bold">Nouveaux utilisateurs</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Les derniers comptes créés
                </p>
              </div>

              <Link to="/admin/users" className="btn-primary">
                Voir tout
              </Link>
            </div>

            <div className="p-4">
              {derniersUtilisateurs.length === 0 && (
                <p className="text-sm text-gray-500">Aucun utilisateur</p>
              )}

              <div className="space-y-1">
                {derniersUtilisateurs.map((u) => (
                  <Link
                    key={u.id}
                    to={`/admin/users/${u.id}/edit`}
                    className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                      <img
                        src={u.profileImage?.trim() ? u.profileImage : "/icons/user-regular-full.svg"}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {u.firstname} {u.lastname}
                      </p>
                      <p className="truncate text-xs text-gray-500">{u.email}</p>
                      <p className="text-xs text-gray-400">
                        Inscrit le {u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-BE") : "-"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <div>
                <h2 className="text-lg font-bold">Derniers commentaires</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Les derniers avis laissés par les clients
                </p>
              </div>

              <Link to="/admin/commentaires" className="btn-primary">
                Voir tout
              </Link>
            </div>

            <div className="p-4">
              {derniersCommentaires.length === 0 && (
                <p className="text-sm text-gray-500">Aucun commentaire</p>
              )}

              <div className="space-y-1">
                {derniersCommentaires.map((c) => (
                  <Link
                    key={c.id}
                    to={`/admin/commentaires/${c.id}`}
                    className="block rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100">
                        <img
                          src={c.user?.profileImage?.trim() ? c.user.profileImage : "/icons/user-regular-full.svg"}
                          className="h-full w-full object-cover"
                          alt=""
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {c.user?.firstname} {c.user?.lastname}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {c.product?.name}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-gray-400">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString("fr-BE") : "-"}
                      </p>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                      {c.content}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}