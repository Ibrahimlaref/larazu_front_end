import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "@/api/admin";
import { toast } from "sonner";
import ProductForm, { type ProductFormData } from "@/components/admin/ProductForm";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form: ProductFormData) => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setLoading(true);
    try {
      await createProduct(
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
      toast.success("Product created");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm 
       title="Add New Product"
       onSubmit={handleSubmit}
       isSubmitting={loading}
    />
  );
}
