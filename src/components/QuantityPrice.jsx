import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import wishlistAPI from "../api/wishlistAPI";
import { toast } from "react-toastify";

export default function QuantityPrice({ productId, finalPrice, price, isPromo, stock = Infinity, weight, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleIncrease = () => { if (quantity < stock) setQuantity(q => q + 1); };
  const handleDecrease = () => { if (quantity > 1) setQuantity(q => q - 1); };

  const totalPrice = finalPrice * quantity;
  const totalOldPrice = price * quantity;
  //calcule du prix au kilo
  const pricePerKg = weight ? finalPrice / weight : 0;

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await wishlistAPI.add(productId);
      toast.success("Ajouté à la liste de souhaits ❤️");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("Déjà dans la liste de souhaits");
        return;
      }

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      toast.error(
        err.response?.data?.message || "Erreur wishlist"
      );
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">


      <div className="flex items-end gap-2">
        <span className="text-[#3F9759] font-bold text-xl">{totalPrice.toFixed(2)}€</span>
        {isPromo && <span className="line-through font-bold text-md">{totalOldPrice.toFixed(2)}€</span>}
      </div>
      <span className="font-bold text-md"><p>soit {pricePerKg.toFixed(2)}€/kg</p></span>

      <div className="flex items-center gap-2">
        <button onClick={handleDecrease} disabled={quantity <= 1} className="bg-gray-200 px-4 py-1 text-xl font-bold rounded-lg disabled:opacity-50">-</button>
        <span className="text-lg font-bold w-6 text-center">{quantity}</span>
        <button onClick={handleIncrease} disabled={quantity >= stock} className="bg-gray-200 px-4 py-1 text-xl font-bold rounded-lg disabled:opacity-50">+</button>
      </div>
      <div className="flex justify-between">

        <button className="btn-primary w-fit" style={{ backgroundColor: "var(--color-primary)" }} onClick={() => onAddToCart?.(quantity)} disabled={stock <= 0}>
          <p>Ajouter au panier</p>
          <div className="shrink-0 flex items-center justify-center w-5">
            <img src="/icons/bag-shopping-solid-full.svg" className="h-5" />
            +
          </div>
        </button>
        <button
          onClick={handleWishlist}
          className="shrink-0 text-2xl hover:scale-110 transition"
          title="Ajouter à la wishlist"
        >
        <img src="/icons/heart-solid-full.svg" className="w-8" />
        </button>
      </div>
    </div>
  );
}