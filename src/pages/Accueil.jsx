import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductsCardSlider from "../components/ProductsCardSlider";

export default function Accueil() {
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const parallax = document.getElementById("parallax");
    const layers = document.querySelectorAll(".layer");

    const handleMouseMove = (e) => {
      const rect = parallax.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach((layer) => {
        const speed = layer.dataset.speed;
        layer.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    parallax.addEventListener("mousemove", handleMouseMove);
    return () => parallax.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <div className="relative w-full h-screen overflow-hidden" style={{
        background: "radial-gradient(circle, #FCFCF4 0%, #FFF9C9 100%)",
      }}
      >
        <section
          id="parallax"
          className="relative w-full max-w-7xl mx-auto h-screen overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full lg:w-3/4 h-full z-0 overflow-hidden">
            <img src="fond1.png" data-speed="6" className="layer absolute top-0 left-0 w-full h-full object-cover pointer-events-none" />
            <img src="fond2.png" data-speed="12" className="layer absolute top-0 left-0 w-full h-full object-cover pointer-events-none" />
            <img src="fond3.png" data-speed="20" className="layer absolute top-0 left-0 w-full h-full object-cover pointer-events-none" />
          </div>

          <div className="absolute inset-0 lg:w-2/5 flex items-center justify-center px-6 z-10 text-center lg:text-left">
            <div className="max-w-lg bg-white/60 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none p-6 md:p-8 rounded-lg lg:rounded-none">
              <h1 className="text-4xl md:text-7xl font-bold mb-4 font-title">
                Le frais sans détour
              </h1>
              <p className="leading-relaxed">
                Commandez en ligne, recevez le meilleur de la nature, le frais, sans détour.
              </p>

              <Link className="hover:underline" to="/products">
                <button
                  className="mt-6 px-6 py-3 btn-primary"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Découvrir la boutique
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:h-175">
          <div className="relative col-span-1 md:col-span-1 lg:col-span-2 bg-[#F2D4C9] rounded-xl p-6 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition md:h-72.5 gap-5 lg:h-auto">
            <div className="relative z-10 w-full lg:max-w-[90%] md:max-w-full bg-white/60 backdrop-blur-sm p-3 rounded-md text-center lg:text-right ml-0 lg:ml-auto">
              <h3 className="font-bold font-title text-2xl mb-4">Fraîcheur d'agrumes</h3>
              <p>
                Retrouvez la fraîcheur et le peps de l’été, toute l’année, à chaque gorgée d’agrumes.
              </p>
            </div>
            <div className="flex lg:justify-end justify-center relative z-10">
              <Link to="/products/3" className="bg-black text-white px-4 py-2 rounded-md inline-block" >Oh oui, j'ai soif !</Link>
            </div>
            <img src="/agrume.png" className="absolute -left-15 bottom-0 h-full object-cover pointer-events-none z-0" />
          </div>

          <div className="relative col-span-1 md:col-span-1 lg:col-span-4 bg-[#D5E4D0] rounded-xl p-6 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition md:h-72.5 gap-5 lg:h-auto">
            <div className="relative z-10 w-full lg:max-w-[70%] md:max-w-full bg-white/60 backdrop-blur-sm p-3 rounded-md text-center lg:text-right ml-0 lg:ml-auto">
              <h3 className="font-bold font-title text-2xl mb-4">Faites le plein de fraîcheur</h3>
              <p>
                Fruits juteux ou légumes croquants, choisissez des produits de saison soigneusement sélectionnés pour leur goût et leur qualité, directement du producteur à votre table.
              </p>
            </div>
            <div className="flex lg:justify-end justify-center relative z-10">
              <Link to="/products?category=fruits" className="bg-black text-white px-4 py-2 rounded-md inline-block" >Voir produits</Link>
            </div>
            <img src="/fruit-fond.png" className="absolute -left-15 bottom-0 h-full object-cover pointer-events-none z-0" />
          </div>

          <div className="relative col-span-1 md:col-span-1 lg:col-span-4 bg-[#FFF9C9] rounded-xl p-6 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition md:h-72.5 gap-5 lg:h-auto">
            <div className="relative z-10 w-full lg:max-w-[70%] md:max-w-full bg-white/60 backdrop-blur-sm p-3 rounded-md text-center lg:text-right ml-0 lg:ml-auto">
              <h3 className="font-bold font-title text-2xl mb-4">Paniers plein de peps</h3>
              <p>
                Pour profiter de la variété et de la fraîcheur sans effort, découvrez nos multipacks de fruits, de légumes ou mixtes.
              </p>
            </div>
            <div className="flex lg:justify-end justify-center relative z-10">
              <Link to="/products?category=paniers" className="bg-black text-white px-4 py-2 rounded-md inline-block" >Voir les paniers</Link>
            </div>
            <img src="/sac-legumes.png" className="absolute -left-15 bottom-0 h-full object-cover pointer-events-none z-0" />
          </div>

          <div className="relative col-span-1 md:col-span-1 lg:col-span-2 bg-[#B2F3F7] rounded-xl p-6 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition md:h-72.5 gap-5 lg:h-auto">
            <div className="relative z-10 w-full lg:max-w-[70%] md:max-w-full bg-white/70 backdrop-blur-sm p-3 rounded-md text-center lg:text-right ml-0 lg:ml-auto">
              <div className=" text-[#FF8D8D] text-7xl font-title">
                -50%
              </div>
              <p>offre valable sur nos ananas !</p>
            </div>
            <div className="flex lg:justify-end justify-center relative z-10">
              <Link to="/products/9" className="bg-black text-white px-4 py-2 rounded-md inline-block" >Voir l'offre</Link>
            </div>
            <img src="/ananas.png" className="absolute -left-15 bottom-0 h-full object-cover pointer-events-none z-0" />
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 flex flex-col">
        <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 text-center">
          <h2 className="text-xl font-bold">Vous pourriez aussi aimer</h2>
          <Link to="/products" className="btn-primary">
            Voir plus
          </Link>
        </div>
        <ProductsCardSlider categoryId="/api/categories/1" />
        <ProductsCardSlider categoryId="/api/categories/2" />
      </section>

    </div>
  );
}