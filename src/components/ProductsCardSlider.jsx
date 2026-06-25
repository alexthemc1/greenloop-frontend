import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productsAPI from "../api/productsAPI";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function ProductsCardSlider({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const produitAleatoire = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryFilter =
          typeof categoryId === "string"
            ? categoryId
            : categoryId?.["@id"];
        const response = await productsAPI.findAll({
          category: categoryFilter,
          page: 1,
          itemsPerPage: 9
        });

        const data = response?.data ?? [];
        const filtered = currentProductId
          ? data.filter((p) => p.id !== currentProductId)
          : data;

        setProducts(produitAleatoire(filtered));

      } catch (error) {
        console.error("Erreur chargement produits :", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [categoryId, currentProductId]);

  if (loading) {
    return <p className="mt-10">Chargement des suggestions...</p>;
  }

  if (!products.length) return null;

  return (
    <div className="w-full flex overflow-hidden py-5 px-1">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".products-next",
          prevEl: ".products-prev"
        }}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
        className="w-full"
      >
        {products.map((product) => {
          return (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          );
        })}

        <button
          className="products-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Produit précédent"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <img
            src="/icons/chevron-left-solid-full.svg"
            alt="précédent"
          />
        </button>

        <button
          className="products-next absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 flex items-center justify-center "
          aria-label="Produit suivant"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <img
            src="/icons/chevron-right-solid-full.svg"
            alt="suivant"
          />
        </button>
      </Swiper>
    </div>
  );
}