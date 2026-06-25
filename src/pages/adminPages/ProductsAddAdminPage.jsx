import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProductAdminApi from "../../services/ProductAdminApi";
import AdminButton from "../../components/button/AdminButton";

import { toast } from "react-toastify";

export default function ProductsAddAdminPage() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [icons, setIcons] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    category: "",
    descriptionShort: "",
    descriptionLong: "",
    price: "",
    stock: "",
    discountPercent: "",
    weight: "",
    origin: "",
    taste: "",
    usageAdvice: "",
    conservation: "",
    keywords: [],
    isPopular: false,
    isFeatured: false,
    productNutritionalIcons: [],
    images: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, iconRes] = await Promise.all([
          ProductAdminApi.getCategories(),
          ProductAdminApi.getNutritionalIcons(),
        ]);

        setCategories(catRes.data.member ?? catRes.data["hydra:member"] ?? []);
        setIcons(iconRes.data.member ?? iconRes.data["hydra:member"] ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Erreur chargement données");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const toggleIcons = (icon) => {
    const alreadySelected = product.productNutritionalIcons.some(
      (i) => i.nutritionalIcon?.["@id"] === icon["@id"]
    );

    if (alreadySelected) {
      setProduct({
        ...product,
        productNutritionalIcons: product.productNutritionalIcons.filter(
          (i) => i.nutritionalIcon?.["@id"] !== icon["@id"]
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
          { nutritionalIcon: icon },
        ],
      });
    }
  };



  const handleSave = async () => {
    setSaving(true);

    try {
      await ProductAdminApi.create({
        name: product.name,
        slug: product.slug,
        category: `/api/categories/${product.category}`,
        descriptionShort: product.descriptionShort,
        descriptionLong: product.descriptionLong,
        price: String(product.price),
        stock: Number(product.stock),
        discountPercent: product.discountPercent
          ? Number(product.discountPercent)
          : null,
        weight: product.weight ? Number(product.weight) : null,
        origin: product.origin,
        taste: product.taste,
        usageAdvice: product.usageAdvice,
        conservation: product.conservation,
        keywords: product.keywords,
        isPopular: product.isPopular,
        isFeatured: product.isFeatured,
        productNutritionalIcons: product.productNutritionalIcons.map(
          (pivot) => ({
            nutritionalIcon: pivot.nutritionalIcon["@id"],
          })
        ),
      });

      toast.success("Produit créé");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Erreur création produit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sm:p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ajouter un produit</h1>

        <AdminButton variant="retour" onClick={() => navigate("/admin/products")}>
          Retour
        </AdminButton>
      </div>

      <div className="bg-white rounded-xl shadow sm:p-6 p-2 space-y-4">

        <input name="name" value={product.name} onChange={handleChange} placeholder="Nom" className="w-full border p-2 rounded" />
        <input name="slug" value={product.slug} onChange={handleChange} placeholder="Slug" className="w-full border p-2 rounded" />

        <select name="category" value={product.category} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <textarea name="descriptionShort" value={product.descriptionShort} onChange={handleChange} placeholder="Description courte" className="w-full border p-2 rounded" />
        <textarea name="descriptionLong" value={product.descriptionLong} onChange={handleChange} placeholder="Description longue" className="w-full border p-2 rounded" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Prix" className="border p-2 rounded" />
          <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Stock" className="border p-2 rounded" />
          <input type="number" name="discountPercent" value={product.discountPercent} onChange={handleChange} placeholder="Réduction" className="border p-2 rounded" />
          <input type="number" name="weight" value={product.weight} onChange={handleChange} placeholder="Poids" className="border p-2 rounded" />

        </div>

        <input name="origin" value={product.origin} onChange={handleChange} placeholder="Origine" className="w-full border p-2 rounded" />
        <input name="taste" value={product.taste} onChange={handleChange} placeholder="Goût" className="w-full border p-2 rounded" />
        <textarea name="usageAdvice" value={product.usageAdvice} onChange={handleChange} placeholder="Utilisation" className="w-full border p-2 rounded" />
        <textarea name="conservation" value={product.conservation} onChange={handleChange} placeholder="Conservation" className="w-full border p-2 rounded" />

        <input
          value={product.keywords.join(", ")}
          onChange={(e) =>
            setProduct({
              ...product,
              keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
            })
          }
          placeholder="Mots-clés"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-6">
          <label>
            <input type="checkbox" checked={product.isPopular} onChange={(e) =>
              setProduct({ ...product, isPopular: e.target.checked })
            } />
            Populaire
          </label>

          <label>
            <input type="checkbox" checked={product.isFeatured} onChange={(e) =>
              setProduct({ ...product, isFeatured: e.target.checked })
            } />
            Vedette
          </label>
        </div>

        <div>
          <h3 className="font-bold">Icônes nutritionnelles</h3>

          <div className="grid grid-cols-2 gap-2">
            {icons.map((icon) => (
              <label key={icon.id} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={product.productNutritionalIcons.some(
                    (i) => i.nutritionalIcon?.["@id"] === icon["@id"]
                  )}
                  onChange={() => toggleIcons(icon)}
                />
                {icon.name}
              </label>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50 text-sm text-gray-600">
          <p>
            Vous pouvez ajouter une image JPG après la création du produit.
          </p>
        </div>

        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? "Création..." : "Créer produit"}
        </AdminButton>

      </div>
    </div>
  );
}