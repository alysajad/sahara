"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "./layout/Container";

const NAV_LINKS = [
  { name: "Alumni", href: "/alumni" },
  { name: "Events", href: "/events" },
  { name: "About", href: "/about" },
  { name: "Admin", href: "/admin/login" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 bg-[#131517]/80 backdrop-blur-xl border-b border-white/[0.06]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Container className="flex justify-between items-center py-4">
        <Link href="/">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-2 h-2 rounded-full bg-[#00cc68] shadow-[0_0_8px_rgba(0,204,104,0.6)]" />
            <span className="text-lg font-bold text-white tracking-tight">
              Sahara Connect
            </span>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[#a4a4a4] hover:text-white text-sm font-medium transition-colors duration-300"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="inline-block"
              >
                {item.name}
              </motion.span>
            </Link>
          ))}
          <Link href="/batches/join">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00cc68] hover:bg-[#00ff82] text-[#131517] text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-300"
            >
              Join Us
            </motion.button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </Container>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#131517]/95 backdrop-blur-xl border-t border-white/[0.06]"
          >
            <Container className="py-4 flex flex-col space-y-1">
              {NAV_LINKS.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-[#a4a4a4] hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: NAV_LINKS.length * 0.08 }}
                className="pt-2"
              >
                <Link
                  href="/batches/join"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-[#00cc68] hover:bg-[#00ff82] text-[#131517] font-semibold px-4 py-3 rounded-lg transition-all duration-300"
                >
                  Join Us
                </Link>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}