import { useState } from "react";

export default function FiltersBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  setPage,
  total,
  currentCategory,
  sort,
  setSort,
  onlyPromo,
  setOnlyPromo,
   setSearchParams,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full mb-4">
      <div className="flex w-full items-center gap-2">
        <div className="relative w-full">
          <img
            src="/icons/magnifying-glass-solid-full.svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5"
          />
          <input
            value={search}
            onChange={e => {
              setPage(1);
              setSearch(e.target.value);
            }}
            type="search"
            placeholder="Que cherchez-vous..."
            className="w-full pl-10 pr-3 py-2 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>


        <button
          onClick={() => {
            setPage(1);
            setSearch("");
            setSelectedCategory(null);
            setSort("");
            setOnlyPromo(false);
            setOpen(false);
            setSearchParams({});
          }}
          className="px-3 py-2 border rounded-md flex items-center justify-center hover:bg-[#ffb5b593] "
        >
          Reset
        </button>

        <button
          onClick={() => setOpen(p => !p)}
          className="px-3 py-2 border rounded-md flex items-center justify-center"
        >
          <img
            src="/icons/sliders-solid-full.svg"
            alt="filters"
            className="w-10 h-6"
          />
        </button>

      </div>

      <div className="flex gap-5 flex-wrap justify-center mt-3">
        {["fruits", "legumes", "paniers"].map(cat => {
          const active = selectedCategory === cat;
          return (
            <button key={cat} onClick={() => { setPage(1); setSelectedCategory(cat); }}
              className={`text-lg font-semibold pb-1 relative ${active ? "text-green-600" : "text-gray-600"
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {active && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-green-600"></span>
              )}
            </button>
          );
        })}
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-2 border p-3 rounded-md">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border px-2 py-2"
          >
            <option value="">Trier</option>
            <option value="price_asc">Prix ↓</option>
            <option value="price_desc">Prix ↑</option>
            <option value="alpha_asc">A → Z</option>
            <option value="alpha_desc">Z → A</option>
          </select>

          <button onClick={() => { setPage(1); setOnlyPromo(p => !p); }}
            className={`px-3 py-2 border text-sm flex items-center justify-center gap-2 ${onlyPromo ? "bg-yellow-400" : ""
              }`}
          >
            <img src="/icons/tags-solid-full.svg" alt="promo" className="w-5 h-5" />
            Promo
          </button>

          <div className="px-3 py-2 bg-gray-100 text-sm font-bold text-center">
            {total} {currentCategory ? currentCategory.toLowerCase() : "articles"}
          </div>

        </div>
      )}

    </div>
  );
}