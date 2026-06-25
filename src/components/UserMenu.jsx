import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserMenu({
  isAuthenticated,
  user,
  logout,
  onCloseMobile
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    onCloseMobile?.();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        onClick={onCloseMobile}
        className="flex items-center border-2 border-white rounded-full  md:p-1 p-2.5" style={{ backgroundColor: "var(--color-primary)" }}>
        <img
          src="/icons/user-regular-full.svg"
          className="w-5 shrink-0"
        />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center rounded-full px-2"
      >
        <img
          src={user?.profileImage?.trim() ? user.profileImage : "/icons/user-regular-full.svg"}
          className="w-10 h-10 rounded-full bg-linear-to-b from-lime-400 to-green-600 object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="flex flex-col items-center justify-center text-center gap-3 py-5">
            <div className="w-full flex flex-col items-center justify-center py-2">
              <img
                src={user?.profileImage?.trim() ? user.profileImage : "/icons/user-regular-full.svg"}
                className="w-15 h-15 rounded-full bg-linear-to-b from-lime-400 to-green-600  object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-gray-700">
                {user?.firstname} {user?.lastname}
              </span>
              <span className="text-xs text-gray-600">
                {user?.email}
              </span>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="btn-primary "
              >
                Voir mon profil
              </Link>
            </div>
          </div>

  

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium border-t"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}