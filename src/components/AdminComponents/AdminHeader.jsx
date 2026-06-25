import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  const { user } = useContext(AuthContext);
  const hasImage = user?.profileImage?.trim();

  return (
    <div className="bg-green-700 shadow-md px-4 md:px-6 py-3 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-lg md:text-2xl font-bold uppercase">
            Greenloop
          </h1>
          <p className="text-xs md:text-sm text-white/90">
            Gestion de l'administration
          </p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={
                hasImage
                  ? user.profileImage
                  : "/icons/user-regular-full.svg"
              }
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-white border-2 border-white"
              alt="user"
            />

            <div className="text-xs md:text-sm leading-tight">
              <p className="font-bold">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-white/90 font-semibold">
                Administrateur
              </p>
            </div>
          </div>
          <Link to="/" className="bg-white text-green-600 px-3 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
            Retour site
          </Link>
        </div>
      </div>
    </div>
  );
}