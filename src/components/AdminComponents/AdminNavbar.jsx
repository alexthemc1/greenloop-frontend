import { NavLink } from "react-router-dom";

export default function AdminNavabar() {
  const linkClass = ({ isActive }) =>
    `sm:px-4 text-center py-2 rounded-lg transition ${isActive
      ? "bg-white text-green-600 font-bold"
      : "text-white hover:font-bold hover:bg-green-700"
    }`;

  return (
    <div className="w-full p-0  sm:w-40 bg-green-600 text-white sm:p-4 rounded-b-3xl sm:rounded-b-none">

      <nav className="flex flex-col gap-2">
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          Produits
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          Utilisateurs
        </NavLink>

        <NavLink to="/admin/commentaires" className={linkClass}>
          Commentaires
        </NavLink>
      </nav>
    </div>
  );
}