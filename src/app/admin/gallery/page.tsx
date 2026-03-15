"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Loader2,
  ImageIcon,
  Plus,
  Upload,
  X,
  CheckCircle2,
  Search,
  Info,
} from "lucide-react";

type GalleryPhoto = {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
};

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err: unknown) {
      console.error("Error fetching gallery photos:", err);
      setError(
        "Failed to load gallery photos. Make sure you have created the 'gallery_photos' table in Supabase."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("resourceType", "image");
      formData.append("folder", "gallery");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Upload failed";
      alert(msg);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a photo title.");
      return;
    }
    if (!imageUrl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const { error } = await supabase
        .from("gallery_photos")
        .insert({ title: title.trim(), image_url: imageUrl });

      if (error) throw error;

      // Reset form
      setTitle("");
      setImageUrl("");
      setPreview(null);
      setShowUploadForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchPhotos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save photo.";
      setError(msg);
    }
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!confirm(`Delete "${photo.title}"? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", photo.id);

      if (error) throw error;
      await fetchPhotos();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete photo.";
      setError(msg);
    }
  };

  const resetForm = () => {
    setTitle("");
    setImageUrl("");
    setPreview(null);
    setShowUploadForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredPhotos = photos.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-black">
            Manage Gallery
          </h1>
          <p className="text-gray-500 mt-1">
            Upload and manage photos for the public gallery.
          </p>
        </div>

        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-black text-white hover:bg-gray-800"
        >
          {showUploadForm ? (
            <>
              <X className="w-4 h-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Add Photo
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="p-6 bg-white border-gray-100 shadow-md space-y-5">
          <h2 className="text-lg font-semibold text-black flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Photo
          </h2>

          {/* Resolution hint */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Recommended Resolution</p>
              <p className="mt-0.5">
                <strong>720 × 960 px</strong> (3:4 portrait ratio) for best
                polaroid display. Images will be cropped to fit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image upload area */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Photo
              </label>
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-black/20 hover:bg-gray-100 transition-all overflow-hidden group shadow-sm ${
                  uploading ? "opacity-60 cursor-not-allowed" : ""
                } ${
                  preview
                    ? "border-solid border-transparent bg-transparent shadow-md"
                    : ""
                }`}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Change Image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8 space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm mx-auto w-fit text-gray-400 group-hover:text-black transition-colors">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-black italic">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400">
                        Portrait ratio (3:4) · 720×960 px
                      </p>
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-black" />
                      <p className="text-sm font-bold tracking-tight text-black uppercase">
                        Uploading...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {preview && !uploading && (
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100/50 w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Image Uploaded
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>

            {/* Title input + submit */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Photo Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g. "Onam 2025"'
                  className="h-12 text-base border-gray-200"
                />
                <p className="text-xs text-gray-400">
                  This title will appear on hover in the public gallery.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!imageUrl || !title.trim() || uploading}
                  className="bg-black text-white hover:bg-gray-800 flex-1"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Save to Gallery
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Gallery List */}
      <Card className="shadow-md border-gray-100 overflow-hidden bg-white text-gray-900">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-black">Gallery Photos</h3>
            <span className="bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-bold">
              {photos.length} Photos
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-white w-full border-gray-200 text-black"
            />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-300" />
              Loading gallery photos...
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No photos found</p>
              <p className="text-sm mt-1">
                Upload your first photo to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-3 border-t border-gray-50">
                    <p className="text-sm font-medium text-black truncate">
                      {photo.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(photo)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 shadow-sm"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
