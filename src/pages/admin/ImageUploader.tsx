import { useState, useRef, useCallback } from "react";
import { Upload, Link2, X, GripVertical, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ImageItem } from "@/api/admin";

interface ImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function getPreviewUrl(img: ImageItem): string {
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  return img;
}

function getImageName(img: ImageItem): string {
  if (img instanceof File) return img.name;
  const parts = img.split("/");
  return parts[parts.length - 1] || "image";
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlPreview, setUrlPreview] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImageItem[] = [];
      for (const file of Array.from(files)) {
        if (!ACCEPTED.includes(file.type)) {
          continue;
        }
        if (file.size > MAX_SIZE) {
          continue;
        }
        newImages.push(file);
      }
      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleRemove = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const handlePreviewUrl = () => {
    setUrlError(null);
    if (!urlInput.trim()) {
      setUrlError("Enter a URL");
      return;
    }
    setUrlPreview(urlInput.trim());
  };

  const handleAddUrl = () => {
    if (urlPreview) {
      onChange([...images, urlPreview]);
      setUrlInput("");
      setUrlPreview(null);
    }
  };

  // Drag-to-reorder handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    onChange(next);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div>
      <label className="block text-sm text-mist mb-2">Images</label>

      {/* Tab Buttons */}
      <div className="flex gap-1 bg-stone/40 p-1 rounded-lg mb-4 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 ${
            activeTab === "upload"
              ? "bg-ink text-chalk shadow-sm"
              : "text-mist hover:text-ink"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Photo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 ${
            activeTab === "url"
              ? "bg-ink text-chalk shadow-sm"
              : "text-mist hover:text-ink"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          Paste URL
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-ink bg-ink/5"
              : "border-stone hover:border-sand"
          }`}
        >
          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-mist" />
          <p className="text-sm text-mist">
            <span className="font-medium text-ink">Click to browse</span> or drag & drop
          </p>
          <p className="text-xs text-mist mt-1">JPG, PNG, WebP • Max 5MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                addFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />
        </div>
      )}

      {/* URL Tab */}
      {activeTab === "url" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError(null);
                setUrlPreview(null);
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-white"
            />
            <Button type="button" variant="outline" size="sm" onClick={handlePreviewUrl}>
              Preview
            </Button>
          </div>
          {urlError && <p className="text-xs text-red-500">{urlError}</p>}
          {urlPreview && (
            <div className="flex items-center gap-3 p-3 border border-stone rounded-lg">
              <img
                src={urlPreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
                onError={() => {
                  setUrlError("Failed to load image");
                  setUrlPreview(null);
                }}
              />
              <div className="flex-1">
                <p className="text-sm text-ink truncate">{urlPreview}</p>
              </div>
              <Button type="button" size="sm" onClick={handleAddUrl}>
                Add
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Thumbnails List */}
      {images.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-mist">
            {images.length} image{images.length !== 1 ? "s" : ""} — drag to reorder, first = main
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={`relative group border rounded-lg overflow-hidden w-24 h-24 flex-shrink-0 transition-shadow ${
                  dragIndex === i
                    ? "ring-2 ring-ink shadow-lg"
                    : "border-stone hover:border-ink/30"
                }`}
              >
                <img
                  src={getPreviewUrl(img)}
                  alt={getImageName(img)}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-ink text-chalk text-[10px] px-1.5 py-0.5 rounded font-medium">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute top-1 right-1 bg-ink/70 text-chalk p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity">
                  <GripVertical className="w-3.5 h-3.5 text-chalk" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
