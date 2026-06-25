import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(form);

      toast.success("Connexion réussie");
      navigate("/");
    } catch (e) {
      console.error(e)
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-4 p-6 bg-gray-100 rounded-3xl shadow"
    >
      <h1 className="text-2xl font-bold text-center">Se connecter</h1>

      <div>
        <h2 className="text-sm font-bold pb-1">Email :</h2>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="johndoe@email.com..."
          className="w-full bg-white rounded-3xl p-2"
        />
      </div>

      <div>
        <h2 className="text-sm font-bold pb-1">Mot de passe :</h2>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-white rounded-3xl p-2 pr-10"
          />

          <img
            src={showPassword ? "/icons/ouvert.svg" : "/icons/fermer.svg"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-2 rounded-3xl"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}