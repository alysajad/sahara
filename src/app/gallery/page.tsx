"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Loader2, ImageIcon, X } from "lucide-react";

type GalleryPhoto = {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
};

// Slight random rotations for each card to give a scattered feel
const ROTATIONS = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2.5];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Close lightbox on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedPhoto(null);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery_photos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPhotos(data || []);
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <main className="min-h-screen bg-[#F9F6F0] pt-32 pb-20 px-4 md:px-8">
      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.p
          className="text-[#6b8e73] font-marker text-sm uppercase tracking-[0.3em] mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Moments
        </motion.p>
        <motion.h1
          className="text-4xl md:text-5xl font-serif font-bold text-[#2C2C2C] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Gallery
        </motion.h1>
        <motion.p
          className="text-[#757575] font-serif italic text-lg max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Memories captured in time — each frame tells a story of togetherness.
        </motion.p>

        {/* decorative divider */}
        <motion.div
          className="mt-6 mx-auto w-20 h-[2px] bg-[#bb8d62]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </div>

      {/* ── Loading / Empty / Photo Grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#757575]">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#6b8e73]" />
          <p className="font-serif italic">Loading gallery...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#757575]">
          <ImageIcon className="w-16 h-16 mb-4 text-[#dcd8d0]" />
          <p className="font-serif italic text-lg">No photos yet</p>
          <p className="text-sm mt-1">
            Photos will appear here once added from the admin portal.
          </p>
        </div>
      ) : (
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              variants={cardVariants}
              className="group flex justify-center"
            >
              <div
                className="polaroid relative bg-white p-3 pb-14 shadow-md transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:scale-105 cursor-pointer"
                style={{
                  transform: `rotate(${ROTATIONS[index % ROTATIONS.length]}deg)`,
                }}
                onClick={() => setSelectedPhoto(photo)}
              >
                {/* Tape decoration */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-[#e8dcc8]/80 rounded-sm shadow-sm z-10" />

                {/* Photo */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#ebe6dc]">
                  <Image
                    src={photo.image_url}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                    unoptimized
                  />

                  {/* Hover overlay with title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                    <span className="text-white font-marker text-lg tracking-wide drop-shadow-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                      {photo.title}
                    </span>
                  </div>
                </div>

                {/* Caption area (below photo, classic polaroid style) */}
                <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center">
                  <span className="text-[#757575] font-caveat text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {photo.title}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image container */}
            <motion.div
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[75vh] flex items-center justify-center">
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-sm shadow-2xl"
                />
              </div>
              <p className="mt-4 text-white font-marker text-xl tracking-wide text-center drop-shadow-lg">
                {selectedPhoto.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
