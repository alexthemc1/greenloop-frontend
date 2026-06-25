import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminButton from "../../components/button/AdminButton";
import { toast } from "react-toastify";

export default function CommentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "approuvé":
        return "bg-green-600";
      case "en attente":
        return "bg-orange-500";
      case "refusé":
        return "bg-red-600";
    }
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await api.get(`/comments/${id}`);
        setComment(res.data);
      } catch {
        toast.error("Impossible de charger le commentaire");
      } finally {
        setLoading(false);
      }
    };
    fetchComment();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(
        `/comments/${id}`,
        {
          content: comment.content,
          status: comment.status,
          rating: comment.rating,
        },
        {
          headers: {
            "Content-Type": "application/merge-patch+json",
          },
        }
      );

      toast.success("Commentaire mis à jour !");

      setTimeout(() => {
        navigate("/admin/commentaires");
      }, 800);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-5">Chargement...</p>;
  if (!comment) return <p className="p-5">Commentaire introuvable</p>;

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commentaire #{comment.id}</h1>
        <AdminButton variant="retour" onClick={() => navigate("/admin/commentaires")}>
          Retour
        </AdminButton>
      </div>

      {/*rappel des informations de l'utilisateur, produits */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow">
        <div>
          <p className="font-bold">Utilisateur</p>
          <p>{comment.user?.firstname} {comment.user?.lastname}</p>
        </div>

        <div>
          <p className="font-bold">Produit</p>
          <p>{comment.product?.name}</p>
        </div>

        <div>
          <p className="font-bold">Étoiles</p>
          <p>
            <div className="flex items-center gap-1">
              {Array.from({ length: comment.rating || 0 }).map((_, index) => (
                <img src="/icons/star-solid-full.svg" key={index} className="w-5" alt="star-solid-full" />
              ))}
            </div>
          </p>
        </div>

        <div>
          <p className="font-bold mb-2">Statut</p>
          <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getStatusColor(comment.status)}`}>
            {comment.status}
          </span>
        </div>
      </div>

      {/* contenue du commentaire */}
      <div>
        <p className="font-bold mb-2">Commentaire</p>
        <textarea
          className="w-full border p-3 rounded-lg"
          rows={5}
          value={comment.content || ""}
          onChange={(e) => setComment({ ...comment, content: e.target.value })}
        />
      </div>

      <div className="flex w-full gap-2 justify-between items-end flex-wrap">

        {/* liste du status */}
        <div>
          <p className="font-bold mb-2">Modifier le statut</p>
          <select
            className="border p-2 rounded-lg"
            value={comment.status || ""}
            onChange={(e) => setComment({ ...comment, status: e.target.value })}
          >
            <option value="en attente">En attente</option>
            <option value="approuvé">Approuvé</option>
            <option value="refusé">Refusé</option>
          </select>
        </div>

        {/* nombre d'étoiles */}
        <div>
          <p className="font-bold mb-2">Étoiles</p>
          <select
            className="border p-2 rounded-lg w-24"
            value={comment.rating || ""}
            onChange={(e) =>
              setComment({ ...comment, rating: parseInt(e.target.value) })
            }
          >
            <option value="1">⭐ 1</option>
            <option value="2">⭐ 2</option>
            <option value="3">⭐ 3</option>
            <option value="4">⭐ 4</option>
            <option value="5">⭐ 5</option>
          </select>
        </div>

        {/* bouton de sauvegarde */}
        <div className="py-1">
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}