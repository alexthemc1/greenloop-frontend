import { Outlet } from "react-router-dom";
import AdminNavabar from "../components/AdminComponents/AdminNavbar";
import AdminHeader from "../components/AdminComponents/AdminHeader";


export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex  flex-col sm:flex-row flex-1">
        <AdminNavabar />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}