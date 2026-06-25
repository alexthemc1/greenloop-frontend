import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import productsAPI from "../api/productsAPI";
import ProductCard from "../components/ProductCard";
import Product from "../components/Loader/ProductsCardLoader";
import FiltersBar from "../components/FiltersBar";
import Pagination from "../components/Pagination";
import ProductBanner from "../components/Banners/ProductBanner";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [sort, setSort] = useState("");
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [sortDate, setSortDate] = useState("new");
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryMap = {
    fruits: "/api/categories/1",
    legumes: "/api/categories/2",
    paniers: "/api/categories/3"
  };

  useEffect(() => {
    const categoryFromURL = searchParams.get("category");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategory(categoryFromURL || null);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await productsAPI.findAll({
          page,
          search,
          category: selectedCategory
            ? categoryMap[selectedCategory]
            : undefined,
          sort,
          onlyPromo,
          sortDate
        });

        if (!ignore) {
          setProducts(response?.data ?? []);
          setPages(response?.pages ?? 1);
          setTotal(response?.total ?? 0);
          setCurrentCategory(response?.category?.name ?? null);
        }
      } catch (e) {
        console.error("Products fetch error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedCategory, sort, onlyPromo, sortDate]);



  return (
    <div className="w-full">
      <ProductBanner />
      <div className="p-4 flex flex-col max-w-7xl mx-auto">
        <FiltersBar
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setPage={setPage}
          total={total}
          currentCategory={currentCategory}
          sort={sort}
          setSort={setSort}
          onlyPromo={onlyPromo}
          setOnlyPromo={setOnlyPromo}
          sortDate={sortDate}
          setSortDate={setSortDate}
          setSearchParams={setSearchParams}
        />

        <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">

          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <Product key={i} />
            ))
            : (products ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          }

        </div>
        <Pagination page={page} pages={pages} setPage={setPage} />
      </div>
    </div>
  );
}