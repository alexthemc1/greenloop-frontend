import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, isAdmin } = useContext(AuthContext);



  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="relative w-full h-40 overflow-hidden">
        <img src="/legume_banner.png" className="w-full h-full relative bg-green-white object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="flex flex-col items-center text-center">
          <img src={user?.profileImage?.trim() ? user.profileImage : "/icons/user-regular-full.svg"} className="w-32 h-32 bg-linear-to-b from-lime-400 to-green-600 relative rounded-full border-4 border-white object-cover shadow-lg" />

      
              {isAdmin && (
                <div className="mt-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  Administrateur
                </div>
              )}
              <h1 className="mt-4 text-2xl font-bold">{user?.firstname} {user?.lastname}</h1>
              <p className="text-gray-500">{user?.email}</p>
 

          <div className="mt-4 flex gap-3">

            <Link to="/profile/edit" className="btn-primary mt-3 bg-green-600 text-white px-4 py-2 rounded-full" >Modifier le profil</Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="btn-secondary mt-3 bg-black text-white px-4 py-2 rounded-full"
              >
                Accéder à l’administration
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-4">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Informations</h2>

            <div className="text-gray-500">
              <p>Nom : {user?.firstname} {user?.lastname}</p>
              <p>Email : {user?.email}</p>
              {user.addresses.map((addr) => (
                <div key={addr.id}>
                  <p className="text-gray-500">{addr.phone}</p>
                </div>
              ))}
            </div>

          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Adresses</h2>

            {user?.addresses?.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div key={addr.id ?? addr.street}>
                    <p className="font-medium">
                      {addr.number} {addr.street}
                    </p>
                    <p className="text-gray-500">
                      {addr.postalCode} {addr.city}
                    </p>
                    <p className="text-gray-500">{addr.country}</p>

                    {addr.isDefault && (
                      <span className="text-green-600 text-sm font-semibold">
                        Adresse principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune adresse enregistrée</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Commandes</h2>
            <p className="text-gray-500">Contenu à venir...</p>
          </div>
        </div>
      </div>
    </div>
  );
}