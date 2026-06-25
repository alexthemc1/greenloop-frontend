export default function AdminButton({
  children,
  variant = "principal",
  onClick,
  desactive,
}) {
  const base =
    "inline-flex items-center w-fit justify-center gap-2 px-5 py-2 rounded-full font-semibold text-sm leading-none transition-all duration-200 shadow-md";

  const categories = {
    principal: "bg-green-600 hover:bg-green-700 text-white",
    modifier: "bg-blue-500 hover:bg-blue-700 text-white",
    supprimer: "bg-red-500 hover:bg-red-700 text-white",
    retour: "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      onClick={onClick} desactive={desactive} className={`${base} ${categories[variant]} ${ desactive ? "opacity-50 cursor-not-allowed" : "" }`} > {children}
    </button>
  );
}