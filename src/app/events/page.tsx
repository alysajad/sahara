"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Music,
  Trophy,
  Palette,
  Users,
  Mic2,
  Loader2,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

/* ── Types ────────────────────────────────────────────── */

type Event = {
  id: string;
  title: string;
  tagline?: string;
  description?: string;
  date: string;
  time?: string;
  venue?: string;
  category?: string;
  type: 'Sahara Fest' | 'Other Events';
  image_url?: string;
  is_featured: boolean;
  created_at: string;
};

/* ── Helpers ──────────────────────────────────────────── */

const getCategoryIcon = (category?: string) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("music")) return Music;
  if (cat.includes("sport") || cat.includes("cricket")) return Trophy;
  if (cat.includes("art") || cat.includes("creative")) return Palette;
  if (cat.includes("talk") || cat.includes("mentor") || cat.includes("career")) return Mic2;
  if (cat.includes("network") || cat.includes("community")) return Users;
  return CalendarDays;
};

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return { day: "??", month: "???" };
  
  // Try parsing YYYY-MM-DD
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return { day, month };
  }

  // Fallback for legacy "Month DD, YYYY" or other formats
  const dayMatch = dateStr.match(/\d+/);
  const monthMatch = dateStr.match(/[A-Za-z]+/);
  
  return {
    day: dayMatch ? dayMatch[0].padStart(2, '0') : "15",
    month: monthMatch ? monthMatch[0].slice(0, 3).toUpperCase() : "MAR"
  };
};

const formatDisplayTime = (timeStr?: string) => {
  if (!timeStr) return "";
  
  // If it's already in HH:MM format (from native picker)
  if (timeStr.match(/^\d{2}:\d{2}$/)) {
    const [hours, minutes] = timeStr.split(':');
    let hr = parseInt(hours);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12 || 12;
    return `${hr}:${minutes} ${ampm}`;
  }
  
  return timeStr;
};

const TABS = ["All", "Sahara Fest"];

/* ── Component ─────────────────────────────────────────── */

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }

  const featuredEvent = events.find(e => e.type === 'Sahara Fest' && e.is_featured) ||
    events.find(e => e.type === 'Sahara Fest') ||
  {
    title: "Sahara Fest 2026",
    tagline: "The Grand Annual Celebration",
    date: "March 15, 2026",
    time: "10:00 AM onwards",
    venue: "Sahara Campus Grounds",
    image_url: "/memories/Acer_Wallpaper_03_3840x2400.jpg"
  };

  const saharaFestEvents = events.filter(e => e.type === 'Sahara Fest' && !e.is_featured);
  const otherEventsList = events.filter(e => e.type === 'Other Events');

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero Banner ── */}
      <div className="relative h-[420px] md:h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredEvent.image_url || "/memories/Acer_Wallpaper_03_3840x2400.jpg"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />

        <Container className="relative z-10 flex flex-col justify-end h-full pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-accent text-accent-foreground mb-4 text-sm px-4 py-1 rounded-full shadow-md">
              <Sparkles className="w-4 h-4 mr-1 inline" /> Upcoming
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-3 drop-shadow-lg">
              {featuredEvent.title}
            </h1>
            {featuredEvent.tagline && (
              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                {featuredEvent.tagline}
              </p>
            )}
            <div className="flex flex-wrap gap-6 mt-6 text-white/90 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {featuredEvent.date && featuredEvent.date.includes('-') ? new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : featuredEvent.date}
              </span>
              {featuredEvent.time && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {formatDisplayTime(featuredEvent.time)}
                </span>
              )}
              {featuredEvent.venue && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {featuredEvent.venue}
                </span>
              )}
            </div>
          </motion.div>
        </Container>
      </div>

      {/* ── Main Content ── */}
      <Section className="pt-16">
        <Container>
          {/* Tab Filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {TABS.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                className={`rounded-full px-6 transition-all duration-300 ${activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ── Sahara Fest Section ── */}
            {(activeTab === "All" || activeTab === "Sahara Fest") && (
              <motion.div
                key="fest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Fest highlight header (only if we have fest events) */}
                {saharaFestEvents.length > 0 && (
                  <div className="mb-14">
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                      <Sparkles className="w-6 h-6 text-accent inline mr-2" />
                      More Sahara Fest Events
                    </h2>
                  </div>
                )}

                {/* Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                  {saharaFestEvents.map((event, i) => {
                    const Icon = getCategoryIcon(event.category);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        viewport={{ once: true }}
                      >
                        <Link href={`/events/${event.id}`}>
                          <Card className="group h-full border border-border bg-card hover:scale-[1.02] hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer">
                          {/* Colour accent bar */}
                          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

                          {/* Event Image */}
                          {event.image_url && (
                            <div className="aspect-[16/10] w-full overflow-hidden">
                              <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          )}


                          <CardContent className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Icon className="w-5 h-5" />
                              </div>
                              {event.category && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-medium"
                                >
                                  {event.category}
                                </Badge>
                              )}
                            </div>

                            <h4 className="text-lg font-bold text-foreground mb-2">
                              {event.title}
                            </h4>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                                {event.description}
                              </p>
                            )}

                            <div className="space-y-2 text-xs border-t border-border pt-4 mt-auto">
                              {event.date && (
                                <div className="flex items-center gap-2 text-foreground">
                                  <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />{" "}
                                  <span className="font-medium">
                                    {event.date.includes('-') ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : event.date}
                                  </span>
                                </div>
                              )}
                              {event.time && (
                                <div className="flex items-center gap-2 text-foreground">
                                  <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />{" "}
                                  <span className="font-medium">{formatDisplayTime(event.time)}</span>
                                </div>
                              )}
                              {event.venue && (
                                <div className="flex items-center gap-2 text-foreground">
                                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />{" "}
                                  <span className="font-medium">{event.venue}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Other Events Section ── */}
            {(activeTab === "All" || activeTab === "Other Events") && (
              <motion.div
                key="other"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {otherEventsList.length > 0 && (
                  <>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-8 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-primary" /> Upcoming
                      Community Events
                    </h2>

                    <div className="space-y-6">
                      {otherEventsList.map((event, i) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card className="group border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-500">
                            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                              {/* Date Block */}
                              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-primary/10 text-primary flex flex-col items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-center order-2 md:order-1">
                                <span className="text-2xl font-bold leading-none">
                                  {formatDisplayDate(event.date).day}
                                </span>
                                <span className="text-xs font-medium uppercase mt-1">
                                  {formatDisplayDate(event.date).month}
                                </span>
                              </div>

                              {/* Event Image (Small Square/Portrait for Community Events) */}
                              {event.image_url && (
                                <div className="flex-shrink-0 w-full md:w-32 aspect-[16/10] rounded-xl overflow-hidden shadow-sm order-1 md:order-2">
                                  <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                              )}


                              {/* Details */}
                              <div className="flex-grow order-3">

                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className="text-xl font-bold text-foreground">
                                    {event.title}
                                  </h4>
                                  {event.category && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs font-medium"
                                    >
                                      {event.category}
                                    </Badge>
                                  )}
                                </div>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {event.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-xs">
                                  {event.time && (
                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                      <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {formatDisplayTime(event.time)}
                                    </span>
                                  )}
                                  {event.venue && (
                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />{" "}
                                      {event.venue}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* CTA */}
                              <Link href={`/events/${event.id}`}>
                                <Button
                                  variant="outline"
                                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                                >
                                  Details <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Section>
    </div>
  );
}
