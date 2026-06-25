import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Accueil";
import ProductsPage from "../pages/ProductsPage";
import ProductPage from "../pages/ProductPage";
import PanierPage from "../pages/PanierPage";
import Contact from "../pages/Contact";
import ScrollToTop from "./ScrollToTop";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import ProfileEditPage from "../pages/ProfileEditPage";
import WhishListPage from "../pages/WishListPage";
// ------------ADMIN------------------
import DashboardPage from "../pages/adminPages/DashboardPage";
import ProductsAdminPage from "../pages/adminPages/ProductsAdminPage";
import ProductsAddAdminPage from "../pages/adminPages/ProductsAddAdminPage";
import ProductsEditAdminPage from "../pages/adminPages/ProductsEditAdminPage";
import UsersAdminPage from "../pages/adminPages/UsersAdminPage";
import UsersEditAdminPage from "../pages/adminPages/UsersEditAdminPage";
import CommentairesAdminPage from "../pages/adminPages/CommentairesAdminPage";
import CommentEditPage from "../pages/adminPages/CommentEditPage";


import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

export default function AppRouter() {
  return (
    <BrowserRouter basename="/greenloop">
      <ScrollToTop />
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishList" element={<WhishListPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <ProfileEditPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/panierPage"
            element={
              <PrivateRoute>
                <PanierPage />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsAdminPage />} />
          <Route path="products/" element={<ProductsAdminPage />} />
          <Route path="/admin/produits/ajouter" element={<ProductsAddAdminPage />} />
          <Route path="/admin/products/:id" element={<ProductsEditAdminPage />} />
          <Route path="users" element={<UsersAdminPage />} />
          <Route path="/admin/users/:id/edit" element={<UsersEditAdminPage />} />
          <Route path="commentaires" element={<CommentairesAdminPage />} />
          <Route path="commentaires/:id" element={<CommentEditPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}