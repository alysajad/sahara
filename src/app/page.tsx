"use client";

import { useEffect, useState } from "react";
import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import BatchNetworkSection from "../sections/BatchNetworkSection";
import FestSection from "../sections/FestSection";
import AlumniSpotlightSection from "../sections/AlumniSpotlightSection";
import MemoryQuoteSection from "../sections/MemoryQuoteSection";
import CTASection from "../sections/CTASection";
import { supabase } from "@/lib/supabase";

interface Alumni {
  name: string
  role: string
  image: string
  batch: string
}

export default function Home() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    async function fetchSpotlight() {
      try {
        const { data, error } = await supabase
          .from('batch_members')
          .select('name, job_title, profile_image_url, batch')
          .limit(10); // Fetch up to 10 for the spotlight

        if (error) throw error;

        if (data) {
          const formatted = data.map(m => ({
            name: m.name,
            role: m.job_title || "Member",
            image: m.profile_image_url || "/memories/Acer_Wallpaper_01_3840x2400.jpg", // Fallback image
            batch: m.batch
          }));
          setAlumni(formatted);
        }
      } catch (err) {
        console.error("Error fetching spotlight alumni:", err);
      }
    }

    fetchSpotlight();
  }, []);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FestSection />
      <AlumniSpotlightSection alumni={alumni} />
      <MemoryQuoteSection />
      <CTASection />
    </main>
  );
}