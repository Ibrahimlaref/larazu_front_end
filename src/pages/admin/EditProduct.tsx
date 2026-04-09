import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi, updateProduct } from "@/api/admin";
import { toast } from "sonner";
import ProductForm, { type ProductFormData, defaultFormData } from "@/components/admin/ProductForm";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [initialData, setInitialData] = useState<ProductFormData>(defaultFormData);

  useEffect(() => {
    if (!id) return;
    adminApi.get(`/api/admin/products/`, { params: { pageSize: 500 } })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        const p = list.find((x: any) => String(x.id) === id);
        if (p) {
          setInitialData({
            name: String(p.name ?? ""),
            category: String(p.category ?? "women"),
            price: String(p.price ?? ""),
            sale_price: p.sale_price !== null && p.sale_price !== undefined ? String(p.sale_price) : "",
            badge: String(p.badge ?? ""),
            description: String(p.description ?? ""),
            details: String(p.details ?? ""),
            is_active: Boolean(p.is_active ?? true),
            track_stock: Boolean(p.track_stock ?? true),
            stock_quantity: Number(p.stock_quantity ?? 0),
            ref: String(p.ref ?? ""),
            sku: String(p.sku ?? ""),
            tags: Array.isArray(p.tags) ? p.tags : [],
            publish_at: p.publish_at ? String(p.publish_at) : null,
            unpublish_at: p.unpublish_at ? String(p.unpublish_at) : null,
            meta_title: String(p.meta_title ?? ""),
            meta_description: String(p.meta_description ?? ""),
            variants: Array.isArray(p.variants) ? p.variants : [],
            images: Array.isArray(p.images) ? p.images : [],
          });
        } else {
            // Since GET /api/admin/products/:id doesn't exist for GET, if we can't find it here we'll error.
            toast.error("Product not found in recent pages");
        }
      })
      .catch((e) => toast.error("Failed to load product details", e))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (form: ProductFormData) => {
    if (!id || !form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setLoading(true);
    try {
      await updateProduct(
        id,
        {
          name: form.name,
          category: form.category,
          price: parseFloat(String(form.price)),
          sale_price: form.sale_price ? parseFloat(String(form.sale_price)) : null,
          badge: form.badge || null,
          description: form.description,
          details: form.details,
          in_stock: form.track_stock ? form.stock_quantity > 0 || form.variants.some(v => v.stock > 0) : true,
          track_stock: form.track_stock,
          stock_quantity: form.stock_quantity,
          is_active: form.is_active,
          ref: form.ref || null,
          sku: form.sku || null,
          tags: form.tags,
          publish_at: form.publish_at,
          unpublish_at: form.unpublish_at,
          meta_title: form.meta_title,
          meta_description: form.meta_description,
          variants: form.variants,
        },
        form.images
      );
      toast.success("Product updated");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-mist">Loading product details...</p>;

  return (
    <ProductForm 
       title="Edit Product"
       initialData={initialData}
       onSubmit={handleSubmit}
       isSubmitting={loading}
    />
  );
}
