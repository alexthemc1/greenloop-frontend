import { Link } from "react-router-dom";

const scrollHautPage = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export default function Footer() {
  return (
    <footer
      className="bg-white w-full flex flex-col items-center text-center justify-center"
      style={{
        backgroundImage: "url('/motif.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
      }}
    >
      <div className="w-full max-w-7xl px-4 pt-10 grid gap-8 text-center md:text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex md:max-w-xs flex-col items-center md:items-start text-center md:text-left">
          <img src="/logo.svg" alt="logo greenloop" />
          <p className="mt-2 text-sm">
            GREENLOOP est votre marché en ligne de fruits et légumes frais BELGE,
            sélectionnés avec soin et livrés sans intermédiaires. Commandez
            simplement et profitez du meilleur de la nature, le frais, sans détour.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="mb-2 text-lg font-bold uppercase">
            Liens rapides
          </h3>
          <ul className="space-y-1">
            <li><Link className="hover:underline transition-colors hover:text-green-600" to="/">Accueil</Link></li>
            <li><Link className="hover:underline transition-colors hover:text-green-600" to="/products?category=legumes">Légumes</Link></li>
            <li><Link className="hover:underline transition-colors hover:text-green-600" to="/products?category=fruits">Fruits</Link></li>
            <li><Link className="hover:underline transition-colors hover:text-green-600" to="/products?category=paniers">Paniers</Link></li>
            <li><Link className="hover:underline transition-colors hover:text-green-600" to="/contact">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-bold uppercase">
            Contact
          </h3>
          <ul className="space-y-1 text-sm flex sm:block items-center flex-col">
            <li className="flex items-center">
              <img src="/icons/phone-solid-full (1).svg" alt="telephone" className="w-6" />
              <p>+32 123 45 67 89</p>
            </li>
            <li className="flex items-center">
              <img src="/icons/envelope-solid-full.svg" alt="email" className="w-6" />
              <p>contact@greenloop.be</p>
            </li>
            <li className="flex items-center">
              <img src="/icons/location-dot-solid-full.svg" alt="adresse" className="w-6" />
              <p>123 Rue de la Greenloop, 1000 Bruxelles</p>
            </li>
          </ul>
        </div>

        <div className="md:max-w-xs">
          <h3 className="mb-2 text-lg font-bold uppercase">
            Newsletter
          </h3>
          <form className="flex flex-col sm:flex-row gap-2 w-full md:max-w-sm">
            <input
              type="email"
              placeholder="Votre email"
              className="sm:w-3/4 pl-2 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="sm:w-2/5 px-1 py-2 text-white bg-(--color-primary) hover:bg-(--color-primary-dark)"
            >
              S'inscrire
            </button>
          </form>
          <p className="mt-2 text-sm">
            Recevez nos meilleures offres, des produits de saison et des idées
            fraîches directement dans votre boîte mail.
          </p>
        </div>
      </div>
      <div className="flex w-full px-4 p-4 xl:max-w-7xl items-center justify-center lg:justify-end">
        <button
          onClick={scrollHautPage}
          className="group bg-white text-green-600 px-3 rounded-md text-sm hover:bg-gray-200 transition"
        >
          <img
            src="/icons/angle-up-solid-full.svg"
            alt="arrow up"
            className="h-10 transition-transform duration-300 group-hover:-translate-y-1"
          />
        </button>
      </div>
      <div className="flex w-full py-3 items-center justify-center text-sm bg-(--color-primary)">
        <div className="flex flex-col md:flex-row w-full max-w-7xl px-4 py-1 items-center justify-between gap-2 text-white">
          <p>&copy; 2026 GREENLOOP. Tous droits réservés.</p>
          <p>Transactions sécurisées via Visa, Mastercard et Bancontact</p>

        </div>

      </div>
    </footer>
  );
}