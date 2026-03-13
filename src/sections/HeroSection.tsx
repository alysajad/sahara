"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import DecryptedText from "@/components/ui/DecryptedText";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background space for global ribbons */}
      <div className="absolute inset-0 z-0 bg-transparent" />

      {/* Dark Gradient Overlay (ensures text readability) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#131517]/40 via-transparent to-[#131517]/80" />

      {/* Content */}
      <Container className="text-center relative z-10">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#a4a4a4] text-sm font-medium mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00cc68] animate-pulse" />
          Reconnect. Remember. Rise Together.
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight text-white leading-[0.95]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <DecryptedText
            text="Sahara "
            animateOn="view"
            revealDirection="start"
            speed={120}
            maxIterations={50}
            sequential={true}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            encryptedClassName="text-[#00cc68]"
            className="text-white"
          />
          <span className="text-gradient-green">
            <DecryptedText
              text="Connect"
              animateOn="view"
              revealDirection="start"
              speed={120}
              maxIterations={50}
              sequential={true}
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              encryptedClassName="opacity-50"
              className=""
            />
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-[#a4a4a4] mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Building lifelong connections across generations
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <Link href="/batches/join">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 204, 104, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00cc68] hover:bg-[#00ff82] text-[#131517] font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
            >
              Join Us
            </motion.button>
          </Link>
          <Link href="/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300"
            >
              Explore Events
            </motion.button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}