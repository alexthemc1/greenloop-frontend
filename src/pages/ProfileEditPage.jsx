import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function ProfileEditPage() {
  const { user, setUser } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    addresses: user?.addresses?.length > 0 ? user.addresses
      : [
        {
          street: "",
          number: "",
          postalCode: "",
          city: "",
          country: "",
          phone: "",
          isDefault: false
        }
      ]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.patch("/me", {
        firstname: form.firstname,
        lastname: form.lastname
      });
      for (const addr of form.addresses) {
        if (addr.id) {
          await api.patch(`/addresses/${addr.id}`, addr);
        } else {
          await api.post(`/addresses`, addr);
        }
      }
      const res = await api.get("/me");
      setUser(res.data);

      toast.success("Profil mis à jour");
      navigate("/profile");

    } catch (err) {
      console.error(err);
      toast.error("Erreur de sauvegarde");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Modifier mon profil</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold mt-6 mb-3">Informations principales</h2>

        <input
          type="text"
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
          placeholder="Prénom"
          className="input w-full bg-gray-100 rounded-3xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <input
          type="text"
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
          placeholder="Nom"
          className="input w-full bg-gray-100 rounded-3xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        {form.addresses.map((addr, index) => (
          <div key={addr.id ?? `address-${index}`}>

            <input
              className="input w-full bg-gray-100 rounded-3xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              value={addr.phone}
              onChange={(e) => {
                const updated = [...form.addresses];
                updated[index].phone = e.target.value;
                setForm({ ...form, addresses: updated });
              }}
              placeholder="Téléphone"
            />

          </div>
        ))}

        <h2 className="text-xl font-semibold mt-6 mb-3">Adresses</h2>

        {form.addresses.map((addr, index) => (
          <div className="space-y-4" key={addr.id ?? `address-${index}`}>
            <input
              className="input w-full bg-gray-100 rounded-3xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              value={addr.street}
              onChange={(e) => {
                const updated = [...form.addresses];
                updated[index].street = e.target.value;
                setForm({ ...form, addresses: updated });
              }}
              placeholder="Rue"
            />

            <input
              className="input w-full bg-gray-100 rounded-3xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              value={addr.city}
              onChange={(e) => {
                const updated = [...form.addresses];
                updated[index].city = e.target.value;
                setForm({ ...form, addresses: updated });
              }}
              placeholder="Ville"
            />

            <input
              className="input w-full bg-gray-100 rounded-3xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              value={addr.postalCode}
              onChange={(e) => {
                const updated = [...form.addresses];
                updated[index].postalCode = e.target.value;
                setForm({ ...form, addresses: updated });
              }}
              placeholder="Code postal"
            />
          </div>
        ))}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Sauvegarder
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="btn-secondary"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}