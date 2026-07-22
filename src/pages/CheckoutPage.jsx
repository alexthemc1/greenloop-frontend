import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import ordersAPI from "../api/ordersAPI";
import cartAPI from "../api/cartAPI";
import StripeCheckoutForm from "../components/StripeCheckoutForm";

export default function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addressId, setAddressId] = useState(user?.addresses?.find(a => a.isDefault)?.id || null);
  const [paymentMethod] = useState("card");

  const createOrder = async (paymentIntentId) => {
    if (!addressId) {
      toast.error("Veuillez choisir une adresse");
      return;
    }

    if (!paymentMethod) {
      toast.error("Veuillez choisir un moyen de paiement");
      return;
    }

    try {
      const response = await ordersAPI.create({
        addressId,
        paymentMethod,
        paymentIntentId
      });

      await cartAPI.clear();

      toast.success("Commande créée");

      navigate(`/commandes/${response.data.orderId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la commande");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Paiement</h1>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 font-bold">Adresse de livraison</h2>

        <div className="space-y-3">
          {user?.addresses?.map(address => (
            <label key={address.id} className="flex gap-3 rounded-lg border p-4">
              <input
                type="radio"
                checked={addressId === address.id}
                onChange={() => setAddressId(address.id)}
              />

              <div>
                <p className="font-semibold">
                  {address.number} {address.street}
                </p>

                <p>
                  {address.postalCode} {address.city}
                </p>

                <p>{address.country}</p>
              </div>
            </label>
          ))}
        </div>

        <h2 className="mt-8 mb-4 font-bold">Paiement</h2>

        <StripeCheckoutForm onSuccess={createOrder} />
      </div>
    </div>
  );
}