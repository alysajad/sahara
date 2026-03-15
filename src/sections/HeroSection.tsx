"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

// Simple SVG Peace Logo built inline
const PeaceLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-12 h-12 text-[#6b8e73] mx-auto mb-6 opacity-90"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20" />
    <path d="M12 12 4.93 19.07" />
    <path d="m12 12 7.07 7.07" />
  </svg>
);

export default function HeroSection() {
  return (
    <section className="relative h-screen flex border-b border-[#dcd8d0] items-center justify-center overflow-hidden bg-[#F9F6F0]">
      {/* Background Image: The Pencil Drawing */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: "url('/image.png')",
          filter: "sepia(0.2) contrast(1.1) brightness(1.05)"
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      {/* Warm Gradient Overlay to wash out the drawing slightly and ensure text readability */}
      <div className="absolute inset-0 z-[1] hero-image-overlay" />

      {/* Radial warm glow */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(249,246,240,0.1)_0%,#F9F6F0_100%)] opacity-60" />

      {/* Content */}
      <Container className="flex flex-col items-center text-center relative z-10 w-full max-w-[100vw] px-4 overflow-visible">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mt-20 mb-8"
        >
          {/* Hugely scaled up and colored Branding Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-32 h-32 text-[#6b8e73] mx-auto opacity-90 filter drop-shadow-md"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20" />
            <path d="M12 12 4.93 19.07" />
            <path d="m12 12 7.07 7.07" />
          </svg>
        </motion.div>

        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#6b8e73]/30 bg-[#F9F6F0]/80 backdrop-blur-md text-[#4A5D4E] text-xs uppercase tracking-widest font-semibold mb-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#bb8d62]" />
          Reconnect. Remember. Rise Together.
        </motion.div>

        <motion.div
          className="relative flex flex-col items-center justify-center w-full max-w-[100vw] mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {/* Dual-tone stylized branding: Charcoal & Sage - Forced to single line */}
          <h1 className="text-5xl md:text-7xl lg:text-[10rem] font-serif font-bold mb-6 tracking-tight leading-none text-[#333333] whitespace-nowrap overflow-visible flex items-center justify-center w-fit mx-auto">
            Sahara<span className="text-[#6b8e73] italic ml-4 lg:ml-8">Connect</span>
          </h1>
          {/* Hand-drawn underline - Terracotta */}
          <svg
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-10 text-[#bb8d62] opacity-70 z-[-1]"
            viewBox="0 0 300 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M5 15Q75 5 150 12T295 8"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-[#646464] mb-12 mt-12 max-w-2xl mx-auto font-serif italic"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Where Memories Stay and New Stories Begin.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="relative">
            {/* Hand-drawn arrow */}
            <svg
              className="hidden sm:block absolute -top-14 -left-12 w-16 h-16 text-[#6b8e73] opacity-80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M80 20 Q50 10 20 60 T35 85 M20 60 L10 50 M20 60 L45 55"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
              />
            </svg>
            <motion.div
              whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px -10px rgba(107, 142, 115, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/batches/join"
                className="inline-block bg-[#6b8e73] hover:bg-[#5a7a61] text-white px-10 py-5 rounded-md text-lg font-medium transition-all duration-300 w-full sm:w-auto shadow-lg text-center"
              >
                Find Your Batch
              </Link>
            </motion.div>
          </div>
          <motion.div
            whileHover={{
              y: -5,
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              boxShadow: "0 0 35px rgba(255, 255, 255, 0.2), inset 0 0 10px rgba(255,255,255,0.1)",
              borderColor: "rgba(255, 255, 255, 0.6)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/events"
              className="inline-block relative bg-transparent backdrop-blur-none text-[#2C2C2C] border border-[#dcd8d0] px-10 py-5 rounded-md text-lg font-medium transition-all duration-500 w-full sm:w-auto overflow-hidden group hover:backdrop-blur-xl text-center"
            >
              {/* High-end acrylic shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-[-1]" />
              Upcoming Programs
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      {/* Cinematic Dust wrapper handled conceptually, can add later if wanted */}
    </section>
  );
}