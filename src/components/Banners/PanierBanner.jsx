export default function ProductBanner() {
  return (
     <div
    className="relative w-full min-h-40 overflow-hidden grid place-items-center px-4"
    style={{
      background: "radial-gradient(circle, #FCFCF4 0%, #FFF9C9 100%)",
    }}
  >
    <img src="/banner-panier1.png" alt="tas de légumes" className="absolute sm:-left-10 top-10 lg:left-0 sm:h-100 h-dvw sm:top-10 object-contain pointer-events-none" />
    <div className="relative z-10 sm:max-w-3xl w-full">
      
      <div className="bg-white/60 backdrop-blur-sm rounded-xl xl:h-full sm:px-6 sm:py-4 py-2 px-1 shadow-sm text-center">
        <h2 className="text-xl md:text-2xl font-bold sm:mb-1">
          Votre panier de courses
        </h2>
        <p className="text-sm md:text-base">
          Explorez une sélection de fruits et légumes frais, prêts à croquer,
          à cuisiner ou partager, toute l'année.
        </p>
      </div>
    </div>
    <img src="/banner-panier2.png" alt="tas de légumes"className="absolute -right-15 lg:right-0 sm:h-100 h-40 top-3 object-contain pointer-events-none sm:visible invisible" />
  </div>
  );
}