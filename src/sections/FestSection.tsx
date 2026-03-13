"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { supabase } from "@/lib/supabase";

interface FestEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue?: string;
  image_url?: string;
}

export default function FestSection() {
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchFestEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('type', 'Sahara Fest')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching fest events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFestEvents();
  }, []);

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (loading) {
    return (
      <Section className="bg-[#131517] min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#00cc68]" />
      </Section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  const currentEvent = events[currentIndex];

  return (
    <Section className="bg-[#0e1012] overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -mr-48 -mt-48 bg-[radial-gradient(50%_50%_at_50%_50%,#7662fc,transparent)] opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] -ml-48 -mb-48 bg-[radial-gradient(50%_50%_at_50%_50%,#01f77e,transparent)] opacity-8 pointer-events-none" />

      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00cc68]/10 border border-[#00cc68]/20 text-[#00cc68] text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Upcoming Fest Events
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Experience the <span className="text-[#00cc68]">Spirit</span> of Sahara
          </h2>
          <p className="text-lg text-[#a4a4a4] max-w-2xl mx-auto">
            Join us for a series of unforgettable events celebrating our community&apos;s
            vibrant culture and enduring connections.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                {/* Event Image */}
                <div className="relative h-[300px] md:h-full min-h-[400px]">
                  <Image
                    src={currentEvent.image_url || "/memories/Acer_Wallpaper_03_3840x2400.jpg"}
                    alt={currentEvent.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131517]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#131517]/30" />
                  <div className="absolute bottom-6 left-6 md:hidden">
                    <h3 className="text-2xl font-bold text-white">{currentEvent.title}</h3>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-white/[0.02]">
                  <div className="hidden md:block mb-4">
                    <h3 className="text-3xl font-bold text-white leading-tight">
                      {currentEvent.title}
                    </h3>
                  </div>

                  <p className="text-base text-[#a4a4a4] mb-8 leading-relaxed line-clamp-4">
                    {currentEvent.description || "Be part of this amazing celebration and create memories that will last a lifetime."}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#00cc68]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#a4a4a4]/60">Date</span>
                        <span className="font-medium text-white">{new Date(currentEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#00cc68]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#a4a4a4]/60">Time</span>
                        <span className="font-medium text-white">{currentEvent.time || "10:00 AM onwards"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#00cc68]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#a4a4a4]/60">Venue</span>
                        <span className="font-medium text-white">{currentEvent.venue || "Sahara Campus Grounds"}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/events" className="mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 204, 104, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-auto bg-[#00cc68] hover:bg-[#00ff82] text-[#131517] font-bold rounded-lg py-4 px-10 text-base transition-all duration-300"
                    >
                      Explore All Events
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          {events.length > 1 && (
            <div className="flex justify-center md:justify-end gap-4 mt-8">
              <button
                onClick={prevEvent}
                className="rounded-full w-11 h-11 border border-white/[0.1] hover:border-[#00cc68]/50 hover:bg-white/[0.06] text-white/60 hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-4 bg-white/[0.04] rounded-full text-sm font-medium text-[#a4a4a4]">
                <span className="text-[#00cc68] font-bold">{currentIndex + 1}</span> / {events.length}
              </div>
              <button
                onClick={nextEvent}
                className="rounded-full w-11 h-11 border border-white/[0.1] hover:border-[#00cc68]/50 hover:bg-white/[0.06] text-white/60 hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}