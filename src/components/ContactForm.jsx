import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ContactForm() {

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.message) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/contact", form);

      toast.success("Message envoyé avec succès !");
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-100 p-6 md:rounded-xl sm:shadow">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex-col w-full">
          <h2 className="text-lg font-bold pb-2">Prénom :</h2>
          <input name="firstname" value={form.firstname} onChange={handleChange} placeholder="John..." className="input w-full bg-white rounded-3xl p-2 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
        <div className="flex-col w-full">
          <h2 className="text-xl font-bold pb-2">Nom :</h2>
          <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Doe..." className="input w-full bg-white rounded-3xl p-2 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex-col w-full">
          <h2 className="text-lg font-bold pb-2">Email :</h2>
          <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="johndoe@email.com..." className="input w-full bg-white rounded-3xl p-2 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
        <div className="flex-col w-full">
          <h2 className="text-xl font-bold pb-2">Téléphone :</h2>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+32 02 44..." className="input w-full bg-white rounded-3xl p-2 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
      </div>
      <div className="flex-col w-full">
        <h2 className="text-xl font-bold pb-2">Questions :</h2>
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Question sur ma commande..." className="input w-full bg-white rounded-3xl p-2 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
      </div>
      <div className="flex-col w-full">
        <h2 className="text-xl font-bold pb-2">Taper votre message ici : </h2>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Quand arrivera ma commande, comment saurais-je quand elle arrivera ?"
          rows="5"
          className="input resize-none w-full bg-white rounded-3xl p-2 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}