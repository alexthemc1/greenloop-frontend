export default function Pagination({ page, pages, setPage }) {
  const pageBouton = (active) =>
    `w-9 h-9 rounded-md text-sm ${active ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
    }`;

  const navBouton = (disabled) =>
    `px-3 py-1 rounded-md text-sm ${disabled
      ? " text-gray-400"
      : " text-gray-600 cursor-pointer hover:bg-gray-200"
    }`;

  return (
    <div className="flex gap-2 mt-6 justify-center items-center">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={navBouton(page === 1)}
      >
        Précédent
      </button>

      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={pageBouton(p === page)}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === pages}
        className={navBouton(page === pages)}
      >
        Suivant
      </button>
    </div>
  );
}