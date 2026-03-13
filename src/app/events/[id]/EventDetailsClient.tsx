"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  CalendarDays,
  Share2,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EventRegistrationForm } from "@/components/events/EventRegistrationForm";
import { FormField } from "@/components/admin/EventFormBuilder";

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
  is_registration_enabled: boolean;
  registration_form?: FormField[];
};

export default function EventDetailsClient() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  async function fetchEvent() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleShare = async () => {
    if (!event) return;

    // We include the image URL in the share text for devices that don't support file sharing
    // but the OG tags (Open Graph) handled in Page.tsx will provide the rich preview on most platforms.
    const shareData: ShareData = {
      title: event.title,
      text: `${event.tagline || event.description}\n\nCheck it out here:`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Event link copied to clipboard!");
      }
    } catch (err) {
      // Don't show error if user cancelled
      if ((err as Error).name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.venue || "");
    
    const dateStr = event.date.replace(/-/g, '');
    let startTime = "090000"; 
    let endTime = "100000";   
    
    if (event.time) {
        const [hours, minutes] = event.time.split(':');
        if (hours && minutes) {
            startTime = `${hours}${minutes}00`;
            const endHours = String(Number(hours) + 1).padStart(2, '0');
            endTime = `${endHours}${minutes}00`;
        }
    }

    const dates = `${dateStr}T${startTime}Z/${dateStr}T${endTime}Z`;
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    
    window.open(googleUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Link href="/events">
          <Button variant="default">Back to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image_url || "/memories/Acer_Wallpaper_03_3840x2400.jpg"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
        
        <Container className="relative z-10 h-full flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Events
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-accent text-accent-foreground px-3 py-0.5 rounded-full border-none font-bold">
                {event.type}
              </Badge>
              {event.category && (
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-none px-3 py-0.5 rounded-full">
                  {event.category}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
              {event.title}
            </h1>
            
            {event.tagline && (
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mb-8">
                {event.tagline}
              </p>
            )}
          </motion.div>
        </Container>
      </div>

      {/* Content Section */}
      <Section className="py-12">
        <Container>
          {/* Conditionally show registration sidebar only if enabled AND has fields */}
          {(() => {
            const showRegistration = event.is_registration_enabled && 
                                   event.registration_form && 
                                   event.registration_form.length > 0;
            
            return (
              <div className={`grid grid-cols-1 ${showRegistration ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-12`}>
                {/* Main Info */}
                <div className={`${showRegistration ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-10 order-2 lg:order-1`}>
                  <div className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-8">
                    <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                          <Calendar className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-wider">Date</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">
                          {event.date.includes('-') ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : event.date}
                        </p>
                      </div>
                      
                      {event.time && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                            <Clock className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Time</span>
                          </div>
                          <p className="text-lg font-semibold text-foreground">{event.time}</p>
                        </div>
                      )}
                      
                      {event.venue && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-primary">
                            <MapPin className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Venue</span>
                          </div>
                          <p className="text-lg font-semibold text-foreground">{event.venue}</p>
                        </div>
                      )}
                    </div>

                    <hr className="border-border" />

                    <div className="space-y-4">
                      <h3 className="text-2xl font-serif font-bold text-foreground">About the Event</h3>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {event.description || "No description provided for this event."}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full gap-2 border-border hover:bg-muted text-xs font-semibold px-4"
                        onClick={handleShare}
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share Event
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full gap-2 border-border hover:bg-muted text-xs font-semibold px-4"
                        onClick={handleAddToCalendar}
                      >
                        <CalendarDays className="w-3.5 h-3.5" /> Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Registration Sidebar */}
                {showRegistration && (
                  <div className="space-y-8 order-1 lg:order-2">
                    <div className="sticky top-24">
                      <EventRegistrationForm 
                          eventId={event.id}
                          eventTitle={event.title}
                          formSchema={event.registration_form!}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Container>
      </Section>
    </div>
  );
}
