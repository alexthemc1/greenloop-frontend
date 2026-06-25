import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", plainPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiErrors = {};

    try {
      setLoading(true);
      await axios.post("/api/users", form, {
        headers: {
          "Content-Type": "application/ld+json"
        }
      })
      await login({
        email: form.email,
        password: form.plainPassword
      });

      toast.success("Compte créé et connexion réussie !");
      navigate("/profile");
    } catch (error) {
      if (error.response?.data?.violations) {
        error.response.data.violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
      toast.error("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 p-6 bg-gray-100 rounded-3xl shadow">
      <h1 className="text-2xl font-bold text-center">S'inscrire à Greenloop</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm font-bold pb-1">Prénom :</h2>
          <input name="firstname" value={form.firstname} onChange={handleChange} placeholder="John..." className="w-full bg-white rounded-3xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
        </div>

        <div>
          <h2 className="text-sm font-bold pb-1">Nom :</h2>
          <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Doe..." className="w-full bg-white rounded-3xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold pb-1">Email :</h2>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="johndoe@email.com..." className="w-full bg-white rounded-3xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <h2 className="text-sm font-bold pb-1">Mot de passe :</h2>

        <div className="relative">
          <input type={showPassword ? "text" : "password"} name="plainPassword" value={form.plainPassword} onChange={handleChange} placeholder="••••••••" className="w-full bg-white rounded-3xl p-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          <img src={showPassword ? "/icons/ouvert.svg" : "/icons/fermer.svg"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100" />
        </div>

        {errors.plainPassword && <p className="text-red-500 text-sm">{errors.plainPassword}</p>}
      </div>

      <button type="submit" disabled={loading} className="bg-green-600 text-white py-2 rounded-3xl hover:bg-green-700 transition">
        {loading ? "Création..." : "S'inscrire"}
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-gray-500 text-sm">ou</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <button type="button" className="bg-white border rounded-3xl py-2 hover:bg-gray-50 transition">
        Continuer avec Google
      </button>
    </form>
  );
}