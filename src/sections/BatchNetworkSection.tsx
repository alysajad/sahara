"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Aesthetic configurations we can map dynamic batches to
const aestheticConfigs = [
  {
    avatars: ["/memories/Acer_Wallpaper_01_3840x2400.jpg", "/memories/Acer_Wallpaper_02_3840x2400.jpg", "/memories/Acer_Wallpaper_03_3840x2400.jpg"],
    backgroundImage: "/memories/Acer_Wallpaper_01_3840x2400.jpg",
  },
  {
    avatars: ["/memories/Acer_Wallpaper_02_3840x2400.jpg", "/memories/Acer_Wallpaper_03_3840x2400.jpg", "/memories/Acer_Wallpaper_04_3840x2400.jpg"],
    backgroundImage: "/memories/Acer_Wallpaper_02_3840x2400.jpg",
  },
  {
    avatars: ["/memories/Acer_Wallpaper_03_3840x2400.jpg", "/memories/Acer_Wallpaper_04_3840x2400.jpg", "/memories/Acer_Wallpaper_05_3840x2400.jpg"],
    backgroundImage: "/memories/Acer_Wallpaper_03_3840x2400.jpg",
  },
  {
    avatars: ["/memories/Acer_Wallpaper_01_3840x2400.jpg", "/memories/Acer_Wallpaper_04_3840x2400.jpg", "/memories/Acer_Wallpaper_05_3840x2400.jpg"],
    backgroundImage: "/memories/Acer_Wallpaper_04_3840x2400.jpg",
  },
];

type BatchData = {
  year: string;
  members: number;
  active: number;
  avatars: string[];
  backgroundImage: string;
};

export default function BatchNetworkSection() {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const { data: membersData, error: membersError } = await supabase
          .from('batch_members')
          .select('batch');

        if (membersError) throw membersError;

        const batchCounts: Record<string, number> = {};
        membersData?.forEach((row) => {
          batchCounts[row.batch] = (batchCounts[row.batch] || 0) + 1;
        });

        const { data: explicitBatches } = await supabase
          .from('batches')
          .select('year')
          .order('year', { ascending: false });

        const uniqueYears = new Set<string>();
        if (explicitBatches && explicitBatches.length > 0) {
          explicitBatches.forEach(b => uniqueYears.add(b.year));
        }
        Object.keys(batchCounts).forEach(year => uniqueYears.add(year));

        const sortedYears = Array.from(uniqueYears).sort().reverse();

        const formattedBatches = sortedYears.map((year, index) => {
          const config = aestheticConfigs[index % aestheticConfigs.length];
          const count = batchCounts[year] || 0;
          return {
            year,
            members: count,
            active: count,
            avatars: config.avatars,
            backgroundImage: config.backgroundImage,
          };
        });

        setBatches(formattedBatches);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBatches();
  }, []);

  return (
    <section className="py-24 px-6 bg-[#131517] relative overflow-hidden flex flex-col items-center">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(50%_50%_at_50%_50%,#7662fc,transparent)] opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[radial-gradient(50%_50%_at_50%_50%,#01f77e,transparent)] opacity-8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#00cc68]/10 border border-[#00cc68]/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-7 h-7 text-[#00cc68]" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Batch <span className="text-[#00cc68]">Network</span>
          </h2>
          <p className="text-lg text-[#a4a4a4] max-w-3xl mx-auto leading-relaxed">
            Connect with your batchmates and relive the memories that shaped your journey.
            Each batch represents a unique chapter in Sahara&apos;s legendary story.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20 min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-[#00cc68]/50" />
            <span className="ml-3 text-lg text-[#a4a4a4] font-medium">Loading network...</span>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.03] border border-white/[0.08] rounded-2xl min-h-[300px] flex flex-col justify-center items-center h-full">
            <Users className="w-16 h-16 text-[#a4a4a4]/30 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Batches Yet</h3>
            <p className="text-[#a4a4a4] max-w-md mx-auto">Be the first to create a network for your batch by joining!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {batches.map((batch, index) => (
              <motion.div
                key={batch.year}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <Card className="group relative overflow-hidden h-full">
                  {/* Background Image Overlay */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <img
                      src={batch.backgroundImage}
                      alt={`Batch ${batch.year} memories`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardHeader className="text-center pb-4 relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00cc68]/10 group-hover:border-[#00cc68]/20 transition-all duration-500"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Calendar className="w-8 h-8 text-[#a4a4a4] group-hover:text-[#00cc68] transition-colors duration-500" />
                    </motion.div>

                    <CardTitle className="text-3xl text-white mb-2 group-hover:text-[#00cc68] transition-colors duration-300">
                      {batch.year}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-center space-y-4 relative z-10">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3">
                        <Users className="w-4 h-4 text-[#a4a4a4] mx-auto mb-1" />
                        <div className="font-bold text-white">{batch.members}</div>
                        <div className="text-[#a4a4a4] text-xs">Total</div>
                      </div>
                      <div className="bg-[#00cc68]/5 border border-[#00cc68]/10 rounded-lg p-3">
                        <div className="w-4 h-4 mx-auto mb-1 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-[#00cc68] rounded-full shadow-[0_0_8px_rgba(0,204,104,0.5)]" />
                        </div>
                        <div className="font-bold text-white">{batch.active}</div>
                        <div className="text-[#a4a4a4] text-xs">Active</div>
                      </div>
                    </div>

                    {/* Avatar Stack */}
                    <div className="flex justify-center -space-x-3 mb-4">
                      {batch.avatars.map((avatar, i) => (
                        <motion.div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-[#131517] overflow-hidden"
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={avatar}
                            alt={`Member ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                      {batch.members > 3 && (
                        <div className="w-10 h-10 rounded-full bg-white/[0.08] border-2 border-[#131517] flex items-center justify-center text-[#a4a4a4] text-xs font-bold">
                          +{batch.members - 3}
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white/[0.06] hover:bg-[#00cc68]/10 text-white hover:text-[#00cc68] border border-white/[0.08] hover:border-[#00cc68]/20 font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <Heart className="w-4 h-4" />
                      Connect
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-[#a4a4a4] mb-6">Can&apos;t find your batch? Help us grow the network!</p>
          <Link href="/batches/join">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 204, 104, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00cc68] hover:bg-[#00ff82] text-[#131517] font-bold px-8 py-3.5 rounded-lg transition-all duration-300"
            >
              Add Your Batch
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}