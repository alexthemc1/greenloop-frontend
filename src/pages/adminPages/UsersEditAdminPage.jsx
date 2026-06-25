import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import AdminButton from "../../components/button/AdminButton";
import { toast } from "react-toastify";

export default function UsersEditAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger l'utilisateur");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...user.addresses];
    updated[index][field] = value;
    setUser({ ...user, addresses: updated });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await api.patch(`/users/${id}`, {
        firstname: user.firstname,
        lastname: user.lastname,
      }, {
        headers: { "Content-Type": "application/merge-patch+json", },
      });

      for (const addr of user.addresses || []) {
        if (addr.id) {
          await api.patch(`/addresses/${addr.id}`, addr);
        } else {
          await api.post(`/addresses`, {
            ...addr,
            user: `/api/users/${id}`,
          });
        }
      }

      toast.success("Utilisateur mis à jour");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Utilisateur introuvable</p>;

  const isAdmin = user.roles?.includes("ROLE_ADMIN");

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Modifier utilisateur
        </h1>

        <AdminButton
          variant="retour"
          onClick={() => navigate("/admin/users")}
        >
          Retour
        </AdminButton>
      </div>

      {/*les infos principales */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <div>
          <label className="font-bold">Prénom</label>
          <input
            name="firstname"
            value={user.firstname || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-bold">Nom</label>
          <input
            name="lastname"
            value={user.lastname || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-bold">Email (non modifiable)</label>
          <input
            value={user.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="font-bold">Rôle</label>
          <p className="text-sm">
            {isAdmin ? "ADMIN" : "USER"}
          </p>
        </div>
      </div>

      {/*les infos d'addresses */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h2 className="font-bold text-lg">Adresses</h2>

        {user.addresses?.map((addr, index) => (
          <div key={addr.id ?? index} className="space-y-2 border p-3 rounded">

            <input
              value={addr.street || ""}
              onChange={(e) =>
                handleAddressChange(index, "street", e.target.value)
              }
              className="w-full border p-2 rounded"
              placeholder="Rue"
            />

            <input
              value={addr.city || ""}
              onChange={(e) =>
                handleAddressChange(index, "city", e.target.value)
              }
              className="w-full border p-2 rounded"
              placeholder="Ville"
            />

            <input
              value={addr.postalCode || ""}
              onChange={(e) =>
                handleAddressChange(index, "postalCode", e.target.value)
              }
              className="w-full border p-2 rounded"
              placeholder="Code postal"
            />

            <input
              value={addr.phone || ""}
              onChange={(e) =>
                handleAddressChange(index, "phone", e.target.value)
              }
              className="w-full border p-2 rounded"
              placeholder="Téléphone"
            />
          </div>
        ))}
      </div>

      {/*menu des actions */}
      <div className="flex justify-end">
        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? "Sauvegarde..." : "Enregistrer"}
        </AdminButton>
      </div>

    </div>
  );
}