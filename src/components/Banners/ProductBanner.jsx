export default function ProductBanner() {
  return (
     <div
    className="relative w-full min-h-40 overflow-hidden grid place-items-center px-4"
    style={{
      background: "radial-gradient(circle, #FCFCF4 0%, #FFF9C9 100%)",
    }}
  >
    <img src="/banner-products.png" alt="tas de légumes" className="absolute -left-30 md:-left-30 lg:-left-37.5 h-40 sm:h-40 md:h-52 lg:h-80 object-contain pointer-events-none" />
    <div className="relative z-10 sm:max-w-3xl w-full">
      
      <div className="bg-white/60 backdrop-blur-sm rounded-xl xl:h-full sm:px-6 sm:py-4 py-2 px-1 shadow-sm text-center">
        <h2 className="text-xl md:text-2xl font-bold sm:mb-1">
          Remplissez votre panier de fraîcheur
        </h2>
        <p className="text-sm md:text-base">
          Explorez une sélection de fruits et légumes frais, prêts à croquer,
          à cuisiner ou partager, toute l'année.
        </p>
      </div>
    </div>
    <img src="/banner-products.png" alt="tas de légumes"className="absolute -right-30 md:-right-30 lg:-right-37.5 h-40 md:h-52 lg:h-80 object-contain pointer-events-none" />
  </div>
  );
}