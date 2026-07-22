import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const limitDate = new Date(Date.now() - SEVEN_DAYS_MS);

export default function ProductCard({ product }) {
  const price = Number(product.price);
  const isPromo = product.discountPercent > 0;

  const finalPrice = isPromo
    ? price - (price * product.discountPercent) / 100
    : price;

  const isNew =
    product.createdAt && new Date(product.createdAt) > limitDate;

 const mainImage =
  product.images?.find(
    image => image.typeImage === "main"
  ) || product.images?.[0];

  const rating = product.averageRating || 0;

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.round(rating);

    return (
      <img
        key={i}
        src={
          filled
            ? "/icons/star-solid-full.svg"
            : "/icons/star-regular-full.svg"
        }
        alt="star"
        className="h-5"
      />
    );
  });

  const ImageNotFound = '/ImageNotFound.webp'


const imageUrl = mainImage?.imagePath
    ? `${API_BASE_URL}${mainImage.imagePath}`
    : ImageNotFound;

  return (
    <div className="rounded-lg shadow-lg h-min bg-gray-50 hover:scale-105 transition-transform duration-300">
      <div className="overflow-hidden rounded-t-lg">
        <Link to={`/products/${product.id}`}>
          <div className="relative flex items-center justify-center bg-white">
            <img
              src={imageUrl}
              alt={product.name}
              className="sm:h-60 h-40 object-cover"
              onError={(e) => {
                e.currentTarget.src = ImageNotFound;
              }}
            />

            {isNew && (
              <span className="absolute top-2 left-2 font-bold uppercase text-white text-xs px-2 py-1 rounded-3xl"
                style={{ backgroundColor: "var(--color-primary)" }} >
                Nouveau
              </span>
            )}

            {isPromo && (
              <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-3xl">
                -{product.discountPercent}%
              </span>
            )}
          </div>
        </Link>
      </div>
      <div className="p-3 flex flex-col h-full gap-2 justify-between items-center rounded-b-lg">
        <div className="text-yellow-400 text-sm flex gap-2 w-full justify-center">
          {stars}
        </div>

        <h2 className="font-semibold text-center sm:text-lg">{product.name}</h2>

        <div className="flex flex-col items-center gap-1">

          <div className="flex items-end gap-2">
            <span className="font-bold text-lg"
              style={{ color: "var(--color-primary)" }}>
              {finalPrice.toFixed(2)}€
            </span>

            {isPromo && (
              <span className="line-through text-sm text-gray-500">
                {price.toFixed(2)}€
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
