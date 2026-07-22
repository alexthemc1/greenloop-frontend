import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productsAPI from "../api/productsAPI";
import cartAPI from "../api/cartAPI";
import ProductBanner from "../components/Banners/ProductBanner";
import { toast } from "react-toastify";
import QuantityPrice from "../components/QuantityPrice";
import ProductGallery from "../components/ProductGallery";
import ProductsCardSlider from "../components/ProductsCardSlider";
import authAPI from "../api/authAPI";
import { Link, useNavigate } from "react-router-dom";
import Commentaire from "../components/Commentaires";
import ProductPageLoader from "../components/Loader/ProductPageLoader";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const LIMIT_DATE = new Date(Date.now() - SEVEN_DAYS_MS);

export default function ProductPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const rating = product?.averageRating || 0;

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
        className="h-4"
      />
    );
  });

  const [activeTab, setActiveTab] = useState("description");

  const { id } = useParams();

  useEffect(() => {
    productsAPI.findById(id)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ProductPageLoader />;
  if (!product) return <p className="text-center mt-10">Produit introuvable</p>;

  const isPromo = product.discountPercent > 0;
  const isNew = product.createdAt ? new Date(product.createdAt) > LIMIT_DATE : false;
  const price = Number(product.price);
  const finalPrice = isPromo ? price - (price * product.discountPercent) / 100 : price;
  return (
    <div>
      <ProductBanner />
      <div className=" w-full flex-col items-center justify-center md:py-10">
        <div className="md:max-w-7xl grid md:gap-10 md:grid-cols-2  mx-auto">
          <div className="w-full h-full max-w-full overflow-hidden order-2 md:order-1 md:rounded-lg md:shadow-lg pt-5 md:pt-0">
            <ProductGallery images={product.images} />
          </div>

          <div className="flex h-full flex-col gap-4 bg-white p-6 md:rounded-lg md:shadow-lg order-1 md:order-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <p className="text-green-600 font-bold">
                  {product.category?.name}
                </p>

                <div className="flex items-center gap-1 text-yellow-400">
                  {stars}
                </div>
              </div>
              <div className="flex gap-2">
                {isNew && (
                  <span className="text-white text-md px-4 py-1 rounded-3xl" style={{ backgroundColor: "var(--color-primary)" }}>
                    Nouveau !
                  </span>
                )}
                {isPromo && (
                  <span className="bg-black text-white text-md px-4 py-1 rounded-3xl">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>
            <QuantityPrice
              productId={product.id}
              finalPrice={finalPrice}
              price={price}
              isPromo={isPromo}
              stock={product.stock}
              weight={product.weight}
              onAddToCart={async (qty) => {
                if (!authAPI.isAuthenticated()) {
                  navigate("/login");
                  return;
                }

                try {
                  await cartAPI.add(product.id, qty);

                  toast.success(`+${qty} ${product.name} ajouté au panier`);
                } catch (error) {
                  if (error.response?.status === 401) {
                    navigate("/login");
                    return;
                  }

                  toast.error(
                    error.response?.data?.message ||
                    "Erreur lors de l'ajout au panier"
                  );
                }
              }}
            />

            <p className="text-gray-600 mt-4">{product.descriptionLong}</p>

            <p className="text-sm text-gray-500">
              {product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
              {product.weight} kg
            </p>
          </div>
        </div>

        <div className="md:max-w-7xl grid md:py-10 gap-10 mx-auto">
          <div className="w-full flex flex-col bg-white p-6 md:rounded-lg shadow-lg gap-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-8 py-1 rounded-full ${activeTab === "description" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("tips")}
                className={`px-8 py-1 rounded-full ${activeTab === "tips" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                Astuces
              </button>
              <button
                onClick={() => setActiveTab("nutrition")}
                className={`px-8 py-1 rounded-full ${activeTab === "nutrition" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                Infos nutritionnels
              </button>
            </div>

            {activeTab === "description" && (
              <div>
                <h3 className="font-bold">Origine</h3>
                <p>{product.origin}</p>
                <h3 className="font-bold mt-4">Goût</h3>
                <p>{product.taste}</p>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="flex justify-center items-center gap-4 flex-wrap">
                {product.productNutritionalIcons?.map((item) => {
                  const icon = item.nutritionalIcon;

                  return (
                    <div key={icon?.name} className="flex flex-col items-center gap-2" >
                      <img src={`/${icon?.iconPath}`} alt={icon?.name} className="w-30" />
                      <span>{icon?.name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "tips" && (
              <div>
                <h3 className="font-bold">Conseil</h3>
                <p>{product.usageAdvice}</p>
                <h3 className="font-bold mt-4">Conservation</h3>
                <p>{product.conservation}</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full mx-auto">
          <Commentaire productId={product.id} />
        </div>

        <div className="md:max-w-7xl xl:px-0 p-5 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 pt-5  mx-auto">
          <h2 className="text-xl font-bold">Vous pourriez aussi aimer</h2>
          <Link to="/products" className="btn-primary">
            Voir plus
          </Link>
        </div>

        <div className="md:max-w-7xl xl:p-0 p-5  w-full flex justify-center items-center gap-10 mx-auto">
          <ProductsCardSlider
            categoryId={product.category}
            currentProductId={product.id}
          />
        </div>
      </div>

    </div>
  );
}