import { Link } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UserMenu from "../components/UserMenu";
import { useEffect } from "react";
import searchAPI from "../api/searchAPI";
import { API_BASE_URL } from "../config/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const ImageNotFound = "/ImageNotFound.webp";

  const getImageUrl = (product) => {
    if (!product.image) {
      return ImageNotFound;
    }
    return `${API_BASE_URL}${product.image}`;
  };

  useEffect(() => {

    if (search.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const data = await searchAPI.searchProducts(search);
        setResults(data);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <header className="bg-white shadow-md z-30">

      <div
        className="w-full flex items-center justify-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="flex px-4 py-1 w-full max-w-7xl items-center justify-between text-white text-sm">

          <p><strong>GREENLOOP </strong>Le frais sans détour</p>

          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1">
              <img src="/icons/phone-solid-full.svg" alt="Téléphone" className="w-4" />
              +32 123 45 67 89</span>

            <Link className="hover:underline" to="/contact">
              Contact
            </Link>

            <Link to="/wishList" className="group flex items-center border-2 border-white hover:border-[#FF8D8D] rounded-md px-1 py-1 hover:scale-105">
              <div className="relative w-5 h-5">
                <img src="/icons/heart-regular-full.svg" className="absolute inset-0 w-5 group-hover:opacity-0" />
                <img src="/icons/heart-solid-full.svg" className="absolute inset-0 w-5 opacity-0 group-hover:opacity-100" />
              </div>
            </Link>

            <Link to="/panierPage" className="group flex items-center border-2 border-white hover:border-[#facc15] rounded-md px-1 py-1">
              <div className="relative w-5 h-5">
                <img src="/icons/bag-shopping-solid-full.svg" className="absolute inset-0 w-5 group-hover:opacity-0" />
                <img src="/icons/bag-shopping-solid-full (1).svg" className="absolute inset-0 w-5 opacity-0 group-hover:opacity-100" />
              </div>
            </Link>

            <UserMenu
              isAuthenticated={isAuthenticated}
              user={user}
              logout={logout}
            />
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center px-6 py-4">

        <div className="flex-1 flex justify-center md:justify-start">
          <Link to="/">
            <img src="/logo.svg" alt="logo greenloop" className="h-10 md:h-12" />
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">

          <Link className="hover:underline" to="/">Accueil</Link>

          <div className="relative group">
            <Link className="hover:underline" to="/products">
              <div className="flex items-center gap-1">
                Catégories
                <img src="/icons/angle-down-solid-full.svg" className="w-5 transition-transform group-hover:translate-y-0.5" />
              </div>
            </Link>

            <div className="absolute left-0 top-full bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition">
              <Link className="block px-4 py-2 hover:bg-gray-100" to="/products?category=legumes">Légumes</Link>
              <Link className="block px-4 py-2 hover:bg-gray-100" to="/products?category=fruits">Fruits</Link>
              <Link className="block px-4 py-2 hover:bg-gray-100" to="/products?category=paniers">Paniers</Link>
            </div>
          </div>

          <div className="md:max-w-xs relative">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 w-full md:max-w-sm">
              <div className="relative w-full">
                <img
                  src="/icons/magnifying-glass-solid-full.svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder="Que cherchez-vous..."
                  className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                {showResults && results.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-md bg-white shadow-lg">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        onClick={() => {
                          setSearch("");
                          setResults([]);
                          setShowResults(false);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100"
                      >
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src = ImageNotFound;
                          }}
                        />

                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.price} €</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="sm:w-2/5 px-2 py-2 text-white hover:bg-green-600"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Rechercher
              </button>
            </form>
          </div>
        </nav>
      </div>

      {/* VERSION MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 py-5 space-y-6 flex w-full justify-center flex-col items-center text-center">

          <Link to="/" onClick={() => setIsOpen(false)} className="py-2 w-full font-medium border-b border-gray-200" > Accueil </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="py-2 w-full font-medium border-b border-gray-200" > Contact </Link>

          <div className="pb-4 border-b w-full border-gray-200 flex justify-center flex-col items-center text-center">
            <p className="font-semibold text-gray-800 mb-2">Catégories</p>

            <div className="flex flex-col gap-2 pl-2 text-gray-600">
              <Link to="/products?category=legumes" onClick={() => setIsOpen(false)}>Légumes</Link>
              <Link to="/products?category=fruits" onClick={() => setIsOpen(false)}>Fruits </Link>
              <Link to="/products?category=paniers" onClick={() => setIsOpen(false)}>Paniers </Link>
            </div>
          </div>
          <div className="pb-4 border-b w-full border-gray-200">
            <div className="relative w-full">
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Que cherchez-vous..."
                className="w-full text-center px-3 py-2 bg-gray-100 rounded-md"
              />

              {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-md z-50">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={() => {
                        setSearch("");
                        setResults([]);
                        setShowResults(false);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100"
                    >
                      <img
                        src={getImageUrl(product)}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = ImageNotFound;
                        }}
                      />
                      <div className="text-start">
                        <p>{product.name}</p>
                        <p>{product.price} €</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-2 px-2">

            <Link
              to="/wishList"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2.5 flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <img src="/icons/heart-regular-full.svg" className="w-5 shrink-0" />
            </Link>

            <Link
              to="/panierPage"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2.5 flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <img src="/icons/bag-shopping-solid-full.svg" className="w-5 shrink-0" />
            </Link>

            <div>
              <UserMenu
                isAuthenticated={isAuthenticated}
                user={user}
                logout={logout}
                onCloseMobile={() => setIsOpen(false)}
              />
            </div>

          </div>

        </div>
      )}

    </header>
  );
}