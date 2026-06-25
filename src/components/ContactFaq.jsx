import { useState } from "react";

export default function FAQContact() {
  const [indexOuvert, setIndexOuvert] = useState(null);

  const questions = [
    {
      question: "Quels sont les délais de livraison ?",
      réponse: "La livraison est généralement effectuée entre 24 et 72 heures ouvrées selon votre localisation en Belgique ou en Europe. Vous recevez un email de confirmation avec suivi dès l’expédition de votre commande."
    },
    {
      question: "Livrez-vous à l’international ?",
      réponse: "Oui, nous livrons dans toute l’Europe. Les délais peuvent varier selon le pays de destination et les conditions logistiques locales. Les frais de livraison sont calculés automatiquement au moment de la commande."
    },
    {
      question: "Quelle est votre politique de retour ?",
      réponse: "Vous disposez de 7 jours après réception pour retourner un produit non conforme ou endommagé. Les articles doivent être non utilisés et dans leur emballage d’origine. Une fois le retour validé, le remboursement est effectué sous quelques jours."
    },
    {
      question: "Comment garantissez-vous la fraîcheur des produits ?",
      réponse: "Nos produits sont sélectionnés chaque jour auprès de producteurs locaux partenaires. Ils sont préparés et expédiés rapidement après récolte afin de garantir une fraîcheur optimale à la livraison."
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      réponse: "Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal ainsi que les paiements sécurisés en ligne. Toutes les transactions sont cryptées pour garantir la sécurité de vos données."
    },
    {
      question: "Comment suivre ma commande ?",
      réponse: "Dès validation de votre commande, vous recevez un lien de suivi par email. Vous pouvez également retrouver le statut en temps réel dans votre espace client GREENLOOP."
    }
  ];

  const basculer = (index) => {
    setIndexOuvert(indexOuvert === index ? null : index);
  };

  return (
    <div className="w-full mx-auto space-y-3">
      {questions.map((faq, index) => (
        <div key={index} className="rounded-lg overflow-hidden border"
         style={{ borderColor: "var(--color-primary)" }}>
          <button onClick={() => basculer(index)} className="w-full flex justify-between items-center font-medium text-left p-2 text-white"
            style={{ backgroundColor: "var(--color-primary)" }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-white text-white text-sm font-bold">{index + 1}</span>
              <span>{faq.question}</span>
            </div>
            <span>
              {indexOuvert === index ? (
                <img src="icons/chevron-left-solid-full.svg" className="w-8 h-8" />
              ) : (
                <img src="icons/chevron-right-solid-full.svg" className="w-8 h-8" />
              )}
            </span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${indexOuvert === index ? "max-h-40" : "max-h-0"}`}>
            <div className="bg-white text-black p-4">
              <p className="text-gray-600">{faq.réponse}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}