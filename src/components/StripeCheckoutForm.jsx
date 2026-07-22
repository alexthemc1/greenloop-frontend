import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import paymentsAPI from "../api/paymentsAPI";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {

  e.preventDefault();

  if (loading) {
    return;
  }
    setLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    });
    if (result.error) {
      console.error("ERREUR STRIPE :", result.error);
      toast.error(result.error.message);
      setLoading(false);
      return;
    }
    console.log(
      "PaymentIntent avant création commande :",
      result.paymentIntent
    );
    if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      console.log(result.paymentIntent);

      await onSuccess(
        result.paymentIntent.id
      );
    } else {

      toast.error(
        "Le paiement n'est pas confirmé"
      );

    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <button disabled={!stripe || loading} className="btn-primary mt-6 w-full">
        {loading ? "Paiement en cours..." : "Payer"}
      </button>
    </form>
  );
}

export default function StripeCheckoutForm({ onSuccess }) {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    paymentsAPI.createIntent()
      .then(({ data }) => {
        setClientSecret(data.clientSecret);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (!clientSecret) {
    return <p>Initialisation du paiement...</p>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm onSuccess={onSuccess} />
    </Elements>
  );
}