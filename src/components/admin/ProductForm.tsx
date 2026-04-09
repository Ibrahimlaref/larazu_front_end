import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Info, Globe, Calendar, RefreshCcw, Tag } from "lucide-react";
import ImageUploader from "@/pages/admin/ImageUploader";
import type { ImageItem } from "@/api/admin";

const CATEGORIES = ["women", "men", "kids", "streetwear", "accessories", "shoes", "beauty"];
const BADGES = ["", "new", "sale", "bestseller", "limited"];

export interface Variant {
  id?: string;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: string | number;
  sale_price: string | number | null;
  badge: string;
  description: string;
  details: string;
  is_active: boolean;
  track_stock: boolean;
  stock_quantity: number;
  ref: string;
  sku: string;
  tags: string[];
  publish_at: string | null;
  unpublish_at: string | null;
  meta_title: string;
  meta_description: string;
  variants: Variant[];
  images: ImageItem[];
}

export const defaultFormData: ProductFormData = {
  name: "",
  category: "women",
  price: "",
  sale_price: "",
  badge: "",
  description: "",
  details: "",
  is_active: true,
  track_stock: true,
  stock_quantity: 0,
  ref: "",
  sku: "",
  tags: [],
  publish_at: null,
  unpublish_at: null,
  meta_title: "",
  meta_description: "",
  variants: [],
  images: []
};

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
  title: string;
}

export default function ProductForm({ initialData, onSubmit, isSubmitting = false, title }: ProductFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductFormData>({ ...defaultFormData, ...initialData });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (k: keyof ProductFormData, v: any) => {
    setForm(f => ({ ...f, [k]: v }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        handleChange("tags", [...form.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    handleChange("tags", form.tags.filter(t => t !== tag));
  };

  const discountMatch = () => {
    const p = Number(form.price);
    const s = Number(form.sale_price);
    if (!p || !s || s >= p) return null;
    const diff = p - s;
    const pct = Math.round((diff / p) * 100);
    return `${pct}% off`;
  };

  // Variants handlers
  const addVariantRow = () => {
    const newVariant: Variant = {
      id: Math.random().toString(36).substr(2, 9),
      size: "M",
      colorName: "Black",
      colorHex: "#000000",
      stock: 10,
      sku: form.sku ? `${form.sku}-VAR` : ""
    };
    handleChange("variants", [...form.variants, newVariant]);
  };

  const updateVariant = (index: number, key: keyof Variant, value: any) => {
    const updated = [...form.variants];
    updated[index] = { ...updated[index], [key]: value };
    handleChange("variants", updated);
  };

  const removeVariant = (index: number) => {
    handleChange("variants", form.variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent, is_active: boolean) => {
    e.preventDefault();
    onSubmit({ ...form, is_active });
  };

  return (
    <div className="pb-32 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-semibold text-ink">{title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg border border-stone shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-ink border-b border-stone pb-2">Basic Info</h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Product Name *</label>
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">SKU</label>
                <Input value={form.sku} onChange={(e) => handleChange("sku", e.target.value)} placeholder="e.g. TSHIRT-123" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Reference</label>
                <Input value={form.ref} onChange={(e) => handleChange("ref", e.target.value)} placeholder="Internal DB ref" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Category</label>
                <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="w-full bg-white border border-stone px-3 py-2 text-sm rounded-md">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Badge</label>
                <select value={form.badge} onChange={(e) => handleChange("badge", e.target.value)} className="w-full bg-white border border-stone px-3 py-2 text-sm rounded-md">
                  {BADGES.map(b => <option key={b} value={b}>{b || "None"}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Short Description</label>
              <textarea 
                value={form.description} onChange={(e) => handleChange("description", e.target.value)} 
                rows={2} className="w-full border border-stone px-3 py-2 text-sm bg-white rounded-md placeholder:text-stone-400"
                placeholder="Brief summary visible on product cards..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Detailed Description</label>
              <textarea 
                value={form.details} onChange={(e) => handleChange("details", e.target.value)} 
                rows={5} className="w-full border border-stone px-3 py-2 text-sm bg-white rounded-md placeholder:text-stone-400"
                placeholder="Full product details, materials, care instructions..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-lg border border-stone shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-ink border-b border-stone pb-2">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Regular Price (DZD) *</label>
                <Input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} required min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Sale Price (DZD)</label>
                <div className="relative">
                  <Input type="number" value={form.sale_price || ""} onChange={(e) => handleChange("sale_price", e.target.value)} placeholder="0.00" min="0" />
                  {discountMatch() && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {discountMatch()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-6 rounded-lg border border-stone shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-ink border-b border-stone pb-2">Media</h2>
            <ImageUploader images={form.images} onChange={(imgs) => handleChange("images", imgs)} />
          </div>

          {/* Inventory & Variants */}
          <div className="bg-white p-6 rounded-lg border border-stone shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone pb-2">
              <h2 className="text-lg font-semibold text-ink">Inventory & Variants</h2>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="track" 
                  checked={form.track_stock} 
                  onCheckedChange={(c) => handleChange("track_stock", !!c)} 
                />
                <label htmlFor="track" className="text-sm cursor-pointer select-none">Track inventory</label>
              </div>
            </div>

            {form.track_stock ? (
               <div className="space-y-6">
                 {form.variants.length === 0 ? (
                   <div className="bg-stone/20 p-4 rounded-lg flex items-center justify-between">
                     <div>
                       <label className="block text-sm font-medium text-ink mb-1">Flat Stock Quantity</label>
                       <p className="text-xs text-mist">Stock used when there are no variants.</p>
                     </div>
                     <Input 
                        type="number" 
                        value={form.stock_quantity} 
                        onChange={(e) => handleChange("stock_quantity", Number(e.target.value))} 
                        className="w-32" min="0" 
                     />
                   </div>
                 ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      Flat stock is ignored when variants exist. Stock is auto-calculated from variants.
                    </div>
                 )}

                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <h3 className="font-medium text-sm text-ink">Product Variants</h3>
                     <Button type="button" variant="outline" size="sm" onClick={addVariantRow} className="h-8">
                       <Plus className="w-3 h-3 mr-1" /> Add Variant
                     </Button>
                   </div>
                   
                   {form.variants.length > 0 ? (
                     <div className="border border-stone rounded-lg overflow-x-auto">
                       <table className="w-full text-sm">
                         <thead className="bg-stone/20 text-mist text-xs">
                           <tr>
                             <th className="p-2 text-left font-medium">Size</th>
                             <th className="p-2 text-left font-medium">Color Name</th>
                             <th className="p-2 text-left font-medium">Color (Hex)</th>
                             <th className="p-2 text-left font-medium w-24">Stock</th>
                             <th className="p-2 text-left font-medium">SKU (Opt)</th>
                             <th className="p-2 text-center font-medium w-10"></th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-stone">
                           {form.variants.map((v, i) => (
                             <tr key={v.id || i}>
                               <td className="p-2"><Input className="h-8 text-xs" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} /></td>
                               <td className="p-2"><Input className="h-8 text-xs" value={v.colorName} onChange={(e) => updateVariant(i, "colorName", e.target.value)} /></td>
                               <td className="p-2 flex items-center gap-1">
                                 <input type="color" className="w-6 h-6 p-0 border-0 rounded" value={v.colorHex} onChange={(e) => updateVariant(i, "colorHex", e.target.value)} />
                                 <Input className="h-8 text-xs w-20 uppercase" value={v.colorHex} onChange={(e) => updateVariant(i, "colorHex", e.target.value)} />
                               </td>
                               <td className="p-2"><Input className="h-8 text-xs" type="number" min="0" value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} /></td>
                               <td className="p-2"><Input className="h-8 text-xs" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} /></td>
                               <td className="p-2 text-center">
                                 <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeVariant(i)}>
                                   <Trash2 className="w-4 h-4" />
                                 </Button>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   ) : (
                     <div className="border border-dashed border-stone rounded-lg py-8 text-center bg-stone/5">
                       <p className="text-sm text-mist">No variants added yet. Add variants for sizes and colors.</p>
                     </div>
                   )}
                 </div>
               </div>
            ) : (
               <div className="p-4 bg-stone/10 rounded-lg">
                 <p className="text-sm text-mist">Inventory tracking is disabled. This product will always appear "In Stock".</p>
               </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Organization */}
          <div className="bg-white p-6 rounded-lg border border-stone shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-ink border-b border-stone pb-2">Organization</h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Tags</label>
              <Input 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Press Enter to add tags..." 
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone/20 text-xs font-medium text-ink">
                    <Tag className="w-3 h-3 text-mist" /> {t}
                    <button type="button" onClick={() => removeTag(t)} className="ml-1 text-mist hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility & Scheduling */}
          <div className="bg-white p-6 rounded-lg border border-stone shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-ink border-b border-stone pb-2">Visibility</h2>
            <div className="p-4 rounded-lg border border-stone bg-stone/10 flex items-start gap-3">
               <div className="mt-0.5">
                 <Checkbox 
                   id="is_active_check" 
                   checked={form.is_active} 
                   onCheckedChange={(c) => handleChange("is_active", !!c)} 
                 />
               </div>
               <div>
                 <label htmlFor="is_active_check" className="font-medium text-sm text-ink cursor-pointer">Active on Storefront</label>
                 <p className="text-xs text-mist mt-1">When unchecked, this product acts as a draft and is completely hidden.</p>
               </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <h3 className="font-medium text-sm text-ink flex items-center gap-2"><Calendar className="w-4 h-4"/> Schedule</h3>
              <div>
                <label className="block text-xs text-mist mb-1">Publish Date (Auto-activates)</label>
                <Input type="datetime-local" value={form.publish_at ? form.publish_at.slice(0, 16) : ""} onChange={(e) => handleChange("publish_at", e.target.value || null)} />
              </div>
              <div>
                <label className="block text-xs text-mist mb-1">Unpublish Date (Auto-deactivates)</label>
                <Input type="datetime-local" value={form.unpublish_at ? form.unpublish_at.slice(0, 16) : ""} onChange={(e) => handleChange("unpublish_at", e.target.value || null)} />
              </div>
            </div>
          </div>

          {/* SEO Preview */}
          <div className="bg-white p-6 rounded-lg border border-stone shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-ink border-b border-stone pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-mist" /> SEO Settings
            </h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Meta Title</label>
              <Input value={form.meta_title} onChange={(e) => handleChange("meta_title", e.target.value)} placeholder="Max 60 chars" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Meta Description</label>
              <textarea 
                value={form.meta_description} onChange={(e) => handleChange("meta_description", e.target.value)} 
                rows={3} className="w-full border border-stone px-3 py-2 text-sm bg-white rounded-md"
                placeholder="Max 160 chars"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-stone p-4 flex items-center justify-between z-40">
        <Button type="button" variant="outline" onClick={() => navigate("/admin/products")} disabled={isSubmitting}>
          Discard Changes
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, false)} disabled={isSubmitting}>
            {isSubmitting ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : "Save as Draft"}
          </Button>
          <Button type="button" className="bg-emerald-600 hover:bg-emerald-700" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
            {isSubmitting ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : "Save & Activate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
