"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

export default function MemoryQuoteSection() {
  return (
    <Section className="bg-[#131517] py-32 relative">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(50%_50%_at_50%_50%,#7662fc,transparent)] opacity-15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(50%_50%_at_50%_50%,#01f77e,transparent)] opacity-8 blur-[120px]" />
      </div>

      {/* Subtle background image */}
      <div className="absolute inset-0 bg-[url('/memories/Acer_Wallpaper_05_3840x2400.jpg')] bg-cover bg-center opacity-[0.03]"></div>

      <Container className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <blockquote className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-white tracking-tight">
            &quot;VENI <span className="text-[#00cc68]">VEDI VICI&quot;</span>
          </blockquote>

          <motion.div
            className="w-24 h-1 bg-[#00cc68] mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            style={{ boxShadow: "0 0 20px rgba(0, 204, 104, 0.4)" }}
          />
        </motion.div>
      </Container>
    </Section>
  );
}