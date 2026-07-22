export default function AdminButton({
  children,
  variant = "principal",
  onClick,
  disabled,
}) {
  const base =
    "inline-flex items-center justify-center w-fit gap-2 px-5 py-2 rounded-full font-semibold text-sm leading-none transition-all duration-200 shadow-md";

  const categories = {
    principal: "bg-green-600 hover:bg-green-700 text-white",
    modifier: "bg-blue-500 hover:bg-blue-700 text-white",
    supprimer: "bg-red-500 hover:bg-red-700 text-white",
    retour: "bg-green-600 hover:bg-green-700 text-white",

    // Statuts de commande
    pending: "bg-yellow-500 hover:bg-yellow-600 text-white",
    shipped: "bg-blue-600 hover:bg-blue-700 text-white",
    delivered: "bg-green-600 hover:bg-green-700 text-white",
    cancelled: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${categories[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}
