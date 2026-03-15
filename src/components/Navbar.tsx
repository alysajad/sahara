"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Alumni", href: "/alumni" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 bg-[#F9F6F0]/80 backdrop-blur-xl border-b border-[#dcd8d0] shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-[95%] xl:w-[98%] max-w-[1920px] mx-auto flex justify-between items-center py-5 relative z-10 px-4 md:px-8">
        <Link href="/">
          <motion.div
            className="flex items-center gap-3 cursor-pointer relative group"
            whileHover={{ scale: 1.02 }}
          >
            {/* Branding Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-[#6b8e73] opacity-90 transition-transform group-hover:rotate-12"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20" />
              <path d="M12 12 4.93 19.07" />
              <path d="m12 12 7.07 7.07" />
            </svg>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-[#2C2C2C] tracking-tight leading-none">
                Sahara
              </span>
              <span className="text-sm font-marker text-[#6b8e73] transform -rotate-1 transition-transform group-hover:rotate-0">
                Connect
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Links & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-10 mr-4">
            {NAV_LINKS.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#646464] hover:text-[#2C2C2C] text-sm font-serif italic transition-all duration-300 relative group overflow-hidden"
              >
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="inline-block"
                >
                  {item.name}
                </motion.span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6b8e73] transform translate-x-[-105%] transition-transform duration-300 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4 border-l border-[#dcd8d0] pl-8">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/batches/join"
                className="inline-block bg-[#6b8e73] hover:bg-[#5a7a61] text-white text-sm font-medium px-6 py-2.5 rounded-sm transition-all duration-300 shadow-sm"
              >
                Join Us
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            className="p-2 rounded-lg hover:bg-[#ebe6dc] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-[#2C2C2C]" />
            ) : (
              <Menu className="w-6 h-6 text-[#2C2C2C]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#F9F6F0] border-t border-[#dcd8d0]"
          >
            <div className="w-[95%] xl:w-[98%] max-w-[1920px] mx-auto py-6 flex flex-col space-y-2 px-4 md:px-8">
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
                    className="block px-4 py-3 rounded-lg text-lg font-serif italic text-[#646464] hover:text-[#2C2C2C] hover:bg-[#ebe6dc] transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: NAV_LINKS.length * 0.08 }}
                className="pt-4"
              >
                <Link
                  href="/batches/join"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-[#6b8e73] hover:bg-[#5a7a61] text-white font-medium px-4 py-4 rounded-sm transition-all duration-300"
                >
                  Join Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}