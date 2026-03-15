"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/* ─── Peace SVG (inline watermark) ─────────────────────── */
const PeaceLogo = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="8" />
    <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="8" />
    <line x1="100" y1="100" x2="28" y2="168" stroke="currentColor" strokeWidth="8" />
    <line x1="100" y1="100" x2="172" y2="168" stroke="currentColor" strokeWidth="8" />
  </svg>
);

type BatchData = {
  year: string;
  members: number;
  active: number;
  memberAvatars: { name: string; image: string | null }[];
};

export default function BatchNetworkSection() {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const { data: membersData, error: membersError } = await supabase
          .from("batch_members")
          .select("batch, name, profile_image_url");

        if (membersError) throw membersError;

        // Group members by batch
        const batchMap: Record<string, { name: string; image: string | null }[]> = {};
        membersData?.forEach((row) => {
          if (!batchMap[row.batch]) batchMap[row.batch] = [];
          batchMap[row.batch].push({
            name: row.name || "Member",
            image: row.profile_image_url || null,
          });
        });

        // Also fetch explicit batches table
        const { data: explicitBatches } = await supabase
          .from("batches")
          .select("year")
          .order("year", { ascending: false });

        const uniqueYears = new Set<string>();
        explicitBatches?.forEach((b) => uniqueYears.add(b.year));
        Object.keys(batchMap).forEach((year) => uniqueYears.add(year));

        const sortedYears = Array.from(uniqueYears).sort().reverse();

        const formattedBatches: BatchData[] = sortedYears.map((year) => {
          const members = batchMap[year] || [];
          return {
            year,
            members: members.length,
            active: members.length,
            memberAvatars: members.slice(0, 4),
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
    <section className="py-24 px-6 bg-[#F9F6F0] relative overflow-hidden flex flex-col items-center">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(44,44,44,0.04) 40px)",
        }}
      />

      {/* Soft glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#6b8e73]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#bb8d62]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Corner ornaments */}
      <span className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-[#bb8d62]/30 pointer-events-none" />
      <span className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-[#bb8d62]/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 border-2 border-[#bb8d62] mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <PeaceLogo className="w-8 h-8 text-[#bb8d62]" />
          </motion.div>

          <h2 className="font-serif text-4xl md:text-6xl font-bold text-[#2C2C2C] mb-6 tracking-tight">
            Batch <span className="italic text-[#6b8e73]">Network</span>
          </h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-16 bg-[#dcd8d0]" />
            <span className="text-[#bb8d62] text-xs tracking-[0.3em] uppercase font-semibold">
              Est. Sahara
            </span>
            <span className="h-px w-16 bg-[#dcd8d0]" />
          </div>

          <p className="text-lg text-[#646464] max-w-3xl mx-auto leading-relaxed font-serif italic">
            Connect with your batchmates and relive the memories that shaped your journey.
            Each batch represents a unique chapter in Sahara&apos;s legendary story.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20 min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-[#bb8d62]/50" />
            <span className="ml-3 text-lg text-[#646464] font-serif italic">
              Loading network...
            </span>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-20 bg-[#fdf9f4] border border-[#dcd8d0] min-h-[300px] flex flex-col justify-center items-center"
            style={{ boxShadow: "4px 4px 0 #dcd8d0" }}
          >
            <Users className="w-16 h-16 text-[#dcd8d0] mb-4" />
            <h3 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-2">
              No Batches Yet
            </h3>
            <p className="text-[#646464] font-serif italic max-w-md mx-auto">
              Be the first to create a network for your batch by joining!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {batches.map((batch, index) => (
              <motion.div
                key={batch.year}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <div
                  className="group relative bg-[#fdf9f4] border border-[#dcd8d0] overflow-hidden h-full flex flex-col"
                  style={{ boxShadow: "4px 4px 0 #dcd8d0" }}
                >
                  {/* Heritage top accent */}
                  <div className="h-1 bg-gradient-to-r from-[#6b8e73] via-[#bb8d62] to-[#2C2C2C] w-full" />

                  {/* Corner fold */}
                  <span className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] border-l-transparent border-b-[#dcd8d0]" />

                  {/* Header */}
                  <div className="text-center pt-8 pb-4 px-6">
                    <motion.div
                      className="w-14 h-14 border-2 border-[#dcd8d0] flex items-center justify-center mx-auto mb-4 group-hover:border-[#bb8d62] transition-all duration-500"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Calendar className="w-7 h-7 text-[#bb8d62] group-hover:text-[#6b8e73] transition-colors duration-500" />
                    </motion.div>

                    <h3 className="font-serif text-3xl font-bold text-[#2C2C2C] group-hover:text-[#6b8e73] transition-colors duration-300">
                      {batch.year}
                    </h3>
                  </div>

                  {/* Stats */}
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-[#F9F6F0] border border-[#dcd8d0] p-3 text-center">
                        <Users className="w-4 h-4 text-[#bb8d62] mx-auto mb-1" />
                        <div className="font-bold text-[#2C2C2C] font-serif">
                          {batch.members}
                        </div>
                        <div className="text-[#646464] text-xs font-serif">Total</div>
                      </div>
                      <div className="bg-[#6b8e73]/5 border border-[#6b8e73]/20 p-3 text-center">
                        <div className="w-4 h-4 mx-auto mb-1 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-[#6b8e73] rounded-full shadow-[0_0_8px_rgba(107,142,115,0.4)]" />
                        </div>
                        <div className="font-bold text-[#2C2C2C] font-serif">
                          {batch.active}
                        </div>
                        <div className="text-[#646464] text-xs font-serif">Active</div>
                      </div>
                    </div>
                  </div>

                  {/* Avatar Stack */}
                  <div className="flex justify-center -space-x-3 px-6 pb-4">
                    {batch.memberAvatars.map((member, i) => (
                      <motion.div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-[#fdf9f4] overflow-hidden bg-[#ebe6dc]"
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#bb8d62]/20 text-[#bb8d62] font-serif font-bold text-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {batch.members > 4 && (
                      <div className="w-10 h-10 rounded-full bg-[#ebe6dc] border-2 border-[#fdf9f4] flex items-center justify-center text-[#646464] text-xs font-bold font-serif">
                        +{batch.members - 4}
                      </div>
                    )}
                  </div>

                  {/* Connect Button */}
                  <div className="px-6 pb-6 mt-auto">
                    <Link href={`/batches/join?batch=${batch.year}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#2C2C2C] hover:bg-[#1a1a1a] text-[#F9F6F0] font-serif font-semibold py-2.5 border-2 border-[#2C2C2C] transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide uppercase shadow-[3px_3px_0_#bb8d62] hover:shadow-[1px_1px_0_#bb8d62]"
                      >
                        <Heart className="w-4 h-4" />
                        Connect
                      </motion.div>
                    </Link>
                  </div>
                </div>
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
          <p className="text-[#646464] mb-6 font-serif italic">
            Can&apos;t find your batch? Help us grow the network!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/batches/join"
              className="inline-block bg-[#2C2C2C] hover:bg-[#1a1a1a] text-[#F9F6F0] font-serif font-bold px-8 py-3.5 border-2 border-[#2C2C2C] tracking-[0.1em] uppercase text-sm transition-all duration-300 shadow-[4px_4px_0_#bb8d62] hover:shadow-[2px_2px_0_#bb8d62]"
            >
              Add Your Batch
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}