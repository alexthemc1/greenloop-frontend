import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import AdminButton from "../../components/button/AdminButton";
import Pagination from "../../components/Pagination";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);

    try {
      const res = await api.get(`/users?page=${pageNumber}`);
      setUsers(res.data.member || []);
      console.log(Object.keys(res.data));
      const totalItems = res.data.totalItems || 0;
      setPages(Math.ceil(totalItems / 8));
    } catch (err) {
      console.error("Erreur users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers(page);
  }, [page]);


  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="space-y-5">

      <div className="bg-white rounded-xl p-3 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Utilisateurs</h1>
          <p>Page {page} / {pages}</p>
        </div>
      </div>

      {/* zone mobile */}
      <div className="lg:hidden space-y-3">
        {users.map((user) => {
          const isAdmin = user.roles?.includes("ROLE_ADMIN");
          const userId = user["@id"]?.split("/").pop();

          return (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow p-3 space-y-3"
            >
              <div className="flex items-center gap-3">
                {/* l'avatar de l'utilisateur' */}

                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      user.profileImage?.trim()
                        ? user.profileImage
                        : "/icons/user-regular-full.svg"
                    }
                    className="w-full h-full object-cover"
                    alt="user"
                  />
                </div>

                {/* le prénom et nom de l'utilisateur */}
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {user.firstname} {user.lastname}
                  </p>

                  {/* l'adresse mail de l'utilisateur */}
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                {/* le role de l'utilisateur */}
                <span>
                  {isAdmin ? (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ADMIN
                    </span>
                  ) : (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      USER
                    </span>
                  )}
                </span>
                {/* date de création */}
                <span className="text-xs text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fr-BE")
                    : "-"}
                </span>
              </div>

              {/* zone d'actions boutons */}
              <div className="pt-2">
                {isAdmin ? (
                  <span className="text-red-500 text-xs font-bold flex justify-center">
                    ADMIN (protégé)
                  </span>
                ) : (
                  <div className="flex w-full justify-between gap-2">
                    <Link to={`/admin/users/${userId}/edit`}>
                      <AdminButton variant="modifier">
                        Modifier
                      </AdminButton>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* zone ordinateur */}
      <div className="hidden lg:grid grid-cols-[60px_2fr_2fr_1fr_1fr_160px] gap-4 bg-amber-300 rounded-xl p-3 font-bold">
        <p>Avatar</p>
        <p>Nom</p>
        <p>Email</p>
        <p>Rôle</p>
        <p>Date de création</p>
        <p>Actions</p>
      </div>

      {users.map((user) => {
        const isAdmin = user.roles?.includes("ROLE_ADMIN");
        const userId = user["@id"]?.split("/").pop();

        return (
          <div
            key={user.id}
            className="hidden lg:grid grid-cols-[60px_2fr_2fr_1fr_1fr_160px] gap-4 items-center bg-white rounded-xl shadow-sm p-3"
          >

            {/* l'avatar de l'utilisateur' */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img
                src={
                  user.profileImage?.trim()
                    ? user.profileImage
                    : "/icons/user-regular-full.svg"
                }
                className="w-full h-full object-cover"
                alt="user"
              />
            </div>

            {/* le prénom et nom de l'utilisateur */}
            <div>
              <p className="font-bold text-gray-800">
                {user.firstname} {user.lastname}
              </p>
            </div>

            {/* l'adresse mail de l'utilisateur */}
            <p className="text-gray-600 text-sm">
              {user.email}
            </p>

            {/* le role de l'utilisateur */}
            <div>
              {isAdmin ? (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ADMIN
                </span>
              ) : (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  USER
                </span>
              )}
            </div>

            {/* date de création */}
            <p className="text-gray-500 text-sm">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("fr-BE")
                : "-"}
            </p>

            {/* zone d'actions boutons */}
            <div className="flex flex-col gap-2">

              {isAdmin ? (
                <span className="text-red-500 text-xs font-bold">
                  ADMIN (protégé)
                </span>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to={`/admin/users/${userId}/edit`}>
                    <AdminButton variant="modifier">
                      Modifier
                    </AdminButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* PAGINATION */}
      <Pagination
        page={page}
        pages={pages}
        setPage={setPage}
      />
    </div>
  );
}