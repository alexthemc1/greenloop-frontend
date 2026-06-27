import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api  from "../../services/api";
import ProductAdminApi from "../../services/ProductAdminApi";
import AdminButton from "../../components/button/AdminButton";

import { toast } from "react-toastify";

export default function ProductsEditAdminPage() {
  const { id } = useParams();

  const API_BASE_URL = api.defaults.baseURL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [icons, setIcons] = useState([]);

  const [product, setProduct] = useState(null);

  const [newImageType, setNewImageType] = useState("gallery");

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes, iconsRes] =
          await Promise.all([
            ProductAdminApi.getOne(id),
            ProductAdminApi.getCategories(),
            ProductAdminApi.getNutritionalIcons(),
          ]);
        const data = productRes.data;
        setProduct({
          ...data,
          category: data.category?.id || "",
        });
        setCategories(
          categoriesRes.data.member ??
          categoriesRes.data["hydra:member"] ??
          []
        );
        setIcons(
          iconsRes.data.member ??
          iconsRes.data["hydra:member"] ??
          []
        );
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger le produit");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleIcons = (icon) => {
    const alreadySelected =
      product.productNutritionalIcons?.some(
        (pivot) =>
          pivot.nutritionalIcon?.["@id"] === icon["@id"]
      );

    console.log(product.productNutritionalIcons);
    if (alreadySelected) {
      setProduct({
        ...product,
        productNutritionalIcons:
          product.productNutritionalIcons.filter(
            (pivot) =>
              pivot.nutritionalIcon?.["@id"] !== icon["@id"]
          ),
      });
    } else {
      if (product.productNutritionalIcons.length >= 3) {
        toast.warning("Maximum 3 icônes nutritionnelles");
        return;
      }

      setProduct({
        ...product,
        productNutritionalIcons: [
          ...product.productNutritionalIcons,
          {
            nutritionalIcon: icon,
          },
        ],
      });
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await ProductAdminApi.deleteImage(imageId);

      setProduct({
        ...product,
        images: product.images.filter(
          (image) => image.id !== imageId
        ),
      });

      toast.success("Image supprimée");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de supprimer l'image");
    }
  };


  const handleAddImage = async () => {

    if (!selectedFile) {
      toast.warning("Choisissez une image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("productId", id);
      formData.append("typeImage", newImageType);
      const response =
        await ProductAdminApi.uploadImage(
          formData
        );

      setProduct({
        ...product,
        images: [
          ...product.images,
          response.data,
        ],
      });

      setSelectedFile(null);
      setNewImageType("gallery");
      toast.success("Image uploadée");
    } catch (error) {
      console.error(error);
      toast.error("Erreur upload image");
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await ProductAdminApi.update(id, {
        name: product.name,
        slug: product.slug,
        descriptionShort: product.descriptionShort,
        descriptionLong: product.descriptionLong,
        price: String(product.price),
        stock: Number(product.stock),
        weight: product.weight
          ? Number(product.weight)
          : null,
        discountPercent: product.discountPercent
          ? Number(product.discountPercent)
          : null,
        origin: product.origin,
        taste: product.taste,
        usageAdvice: product.usageAdvice,
        conservation: product.conservation,
        keywords: product.keywords,
        isPopular: product.isPopular,
        isFeatured: product.isFeatured,
        category: `/api/categories/${product.category}`,

        productNutritionalIcons:
          product.productNutritionalIcons.map((pivot) => ({
            nutritionalIcon:
              pivot.nutritionalIcon["@id"],
          })),
      });

      toast.success("Produit mis à jour");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }

  if (!product) {
    return <p className="p-6">Produit introuvable</p>;
  }

  return (
    <div className="sm:p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Modifier {product.name}
        </h1>

        <AdminButton
          variant="retour"
          onClick={() => navigate("/admin/products")}
        >
          Retour
        </AdminButton>
      </div>

      <div className="bg-white rounded-xl shadow sm:p-6 p-2 space-y-4 flex flex-col ">
        {/* nom */}
        <div>
          <label className="font-bold block mb-2">
            Nom
          </label>

          <input
            name="name"
            value={product.name || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* slug */}
        <div>
          <label className="font-bold block mb-2">
            Slug
          </label>

          <input
            name="slug"
            value={product.slug || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* liste des catégories */}
        <div>
          <label className="font-bold block mb-2">
            Catégorie
          </label>

          <select
            name="category"
            value={product.category || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                category: Number(e.target.value),
              })
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="">
              Choisir une catégorie
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {/* description courte */}
        <div>
          <label className="font-bold block mb-2">
            Description courte
          </label>

          <textarea
            rows={4}
            name="descriptionShort"
            value={product.descriptionShort || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* description longue  */}
        <div>
          <label className="font-bold block mb-2">
            Description longue
          </label>

          <textarea
            rows={8}
            name="descriptionLong"
            value={product.descriptionLong || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 ">
          {/* prix */}
          <div>
            <label className="font-bold block mb-2">
              Prix
            </label>

            <input
              type="number"
              step="0.01"
              name="price"
              value={product.price || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          {/* stock */}
          <div>
            <label className="font-bold block mb-2">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={product.stock || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          {/* réduction */}
          <div>
            <label className="font-bold block mb-2">
              Réduction %
            </label>

            <input
              type="number"
              name="discountPercent"
              value={product.discountPercent || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          {/* poid */}
          <div>
            <label className="font-bold block mb-2">
              Poids (kg)
            </label>

            <input
              type="number"
              step="0.01"
              name="weight"
              value={product.weight || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>
        {/* origine */}
        <div>
          <label className="font-bold block mb-2">
            Origine
          </label>

          <textarea
            rows={3}
            name="origin"
            value={product.origin || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* goût */}
        <div>
          <label className="font-bold block mb-2">
            Goût
          </label>

          <textarea
            rows={3}
            name="taste"
            value={product.taste || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* conseil d'utilisation */}
        <div>
          <label className="font-bold block mb-2">
            Conseils d'utilisation
          </label>

          <textarea
            rows={3}
            name="usageAdvice"
            value={product.usageAdvice || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* Conservation */}
        <div>
          <label className="font-bold block mb-2">
            Conservation
          </label>

          <textarea
            rows={3}
            name="conservation"
            value={product.conservation || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* les mots-clés */}
        <div>
          <label className="font-bold block mb-2">
            Mots-clés
          </label>

          <input
            value={product.keywords?.join(", ") || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                keywords: e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean),
              })
            }
            className="w-full border rounded-lg p-2"
          />
        </div>
        {/* popularité, mise en avant */}
        <div className="flex gap-8">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={product.isPopular || false}
              onChange={(e) =>
                setProduct({
                  ...product,
                  isPopular: e.target.checked,
                })
              }
            />
            Produit populaire
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={product.isFeatured || false}
              onChange={(e) =>
                setProduct({
                  ...product,
                  isFeatured: e.target.checked,
                })
              }
            />
            Produit mis en avant
          </label>

        </div>

        {/* Icônes nutritionnelles */}
        <div>
          <h3 className="font-bold mb-3">
            Icônes nutritionnelles (max 3)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {icons.map((icon) => (
              <label key={icon.id} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={
                    product.productNutritionalIcons?.some(
                      (pivot) =>
                        pivot.nutritionalIcon?.["@id"] === icon["@id"]
                    ) || false
                  }
                  onChange={() => toggleIcons(icon)}
                />

                {icon.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-3">
            Images du produit
          </h3>

          <div className="space-y-3">
            <div className="border rounded-lg p-4 mb-4 space-y-3">

              <input
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  const isJpg =
                    file.type === "image/jpeg" ||
                    file.name.toLowerCase().endsWith(".jpg") ||
                    file.name.toLowerCase().endsWith(".jpeg");

                  if (!isJpg) {
                    toast.error("Seuls les fichiers JPG sont autorisés");
                    e.target.value = null;
                    return;
                  }

                  setSelectedFile(file);
                }}
                className="w-full border rounded-lg p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés : JPG, JPEG
              </p>

              <select
                value={newImageType}
                onChange={(e) =>
                  setNewImageType(e.target.value)
                }
                className="w-full border rounded-lg p-2"
              >
                <option value="main">Main</option>
                <option value="gallery">Gallery</option>
                <option value="info">Info</option>
              </select>

              <AdminButton
                type="button"
                onClick={handleAddImage}
              >
                Ajouter l'image
              </AdminButton>

            </div>

            {product.images?.map((image) => (
              <div
                key={image.id}
                className="flex items-center gap-4 border rounded-lg p-3"
              >
                <img
                  src={`${API_BASE_URL}${image.imagePath}`}
                  alt=""
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="text-sm break-all">
                    {image.imagePath}
                  </p>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {image.typeImage}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>


        <div className="flex sm:justify-end justify-center py-5">
          <AdminButton onClick={handleSave} disabled={saving} >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </AdminButton>
        </div>

      </div>

    </div>
  );
}