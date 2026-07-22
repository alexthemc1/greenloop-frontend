import { useEffect, useState } from "react";
import api from "../../services/api";
import Pagination from "../../components/Pagination";
import AdminButton from "../../components/button/AdminButton";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function CommentairesAdminPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchComments = async (pageNumber = 1) => {
    setLoading(true);

    try {
      const res = await api.get(
        `/comments?page=${pageNumber}&status=${statusFilter}`
      );
      setComments(res.data.data || []);
      setPages(res.data.pages || 1);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Supprimer ce commentaire ? Cette action est irréversible."
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Commentaire supprimé");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);



  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl p-3 flex sm:flex-row text-center sm:text-start flex-col justify-between items-center">
        <div className="pb-2">
          <h1 className="text-3xl font-bold">Commentaires</h1>
          <p>
            Page {page} / {pages}
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg px-2 py-1  border-2 bg-amber-300 text-center "
        >
          <option value="all">Tous les statuts</option>
          <option value="en attente">En attente</option>
          <option value="approuvé">Approuvé</option>
          <option value="refusé">Refusé</option>
        </select>
      </div>

      {/* version mobile */}
      <div className="xl:hidden space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-xl shadow p-3 space-y-3"
          >
            <div className="flex justify-between gap-3">
              {/* utilisateur */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      comment.user?.profileImage?.trim()
                        ? comment.user.profileImage
                        : "/icons/user-regular-full.svg"
                    }
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>

                <div>
                  <p className="font-bold text-sm">
                    {comment.user?.firstname} {comment.user?.lastname}
                  </p>

                  <p className="text-xs text-gray-500">
                    {comment.product?.name}
                  </p>
                </div>
              </div>

              {/* status */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold text-white h-fit ${comment.status === "approuvé"
                  ? "bg-green-600"
                  : comment.status === "en attente"
                    ? "bg-orange-500"
                    : "bg-red-600"
                  }`}
              >
                {comment.status}
              </span>
            </div>

            {/* note */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <span className="font-medium">
                  {comment.rating || "-"}
                </span>
                <img
                  src="/icons/star-solid-full.svg"
                  className="w-4"
                  alt="star"
                />
              </div>

              <div className="text-xs text-gray-500">
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleDateString("fr-BE")
                  : "-"}
              </div>
            </div>

            {/* commentaire */}
            <p className="text-sm text-gray-700 line-clamp-3">
              {comment.content}
            </p>

            {/* action */}
            <div className="flex gap-2 pt-2">
              <Link
                to={`/admin/commentaires/${comment.id}`}
                className="flex-1"
              >
                <AdminButton variant="modifier">
                  Voir
                </AdminButton>
              </Link>

              <AdminButton
                variant="supprimer"
                onClick={() => handleDelete(comment.id)}
              >
                Supprimer
              </AdminButton>
            </div>
          </div>
        ))}
      </div>

      {/* version ordinateur */}
      <div className="hidden xl:grid grid-cols-[250px_150px_80px_120px_1fr_150px_140px] gap-4 bg-amber-300 rounded-xl p-3 font-bold">
        <p>Utilisateur</p>
        <p>Produit</p>
        <p>Note</p>
        <p>Statut</p>
        <p>Commentaire</p>
        <p>Date</p>
        <p>Actions</p>
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="hidden lg:grid grid-cols-[250px_150px_80px_120px_1fr_150px_140px] gap-4 items-center bg-white rounded-xl shadow-sm p-3"
        >
          {/* utilisateur */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <img
                src={
                  comment.user?.profileImage?.trim()
                    ? comment.user.profileImage
                    : "/icons/user-regular-full.svg"
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="font-bold">
                {comment.user?.firstname} {comment.user?.lastname}
              </p>
            </div>
          </div>

          {/* produit */}
          <div>
            <p className="font-medium">{comment.product?.name}</p>
          </div>

          {/* note */}
          <div className="flex flex-row gap-1 items-center">
            {comment.rating || "-"}
            <img src="/icons/star-solid-full.svg" className="w-6" alt="star-solid-full" />
          </div>

          {/* statut */}
          <div>
            <span
              className={`px-3 py-2 rounded-full text-xs font-bold text-white ${comment.status === "approuvé"
                ? "bg-green-600" : comment.status === "en attente" ? "bg-orange-500" : "bg-red-600"
                }`}
            >
              {comment.status}
            </span>
          </div>

          {/* commentaire */}
          <div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {comment.content}
            </p>
          </div>

          {/* date */}
          <div>
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString("fr-BE")
              : "-"}
          </div>

          {/* actions */}
          <div className="flex flex-col gap-2">
            <Link to={`/admin/commentaires/${comment.id}`}>
              <AdminButton asChild variant="modifier">
                Voir
              </AdminButton>
            </Link>
            <AdminButton
              variant="supprimer"
              onClick={() => handleDelete(comment.id)}>
              Supprimer
            </AdminButton>
          </div>
        </div>
      ))}

      <Pagination page={page} pages={pages} setPage={setPage} />
    </div>
  );
}