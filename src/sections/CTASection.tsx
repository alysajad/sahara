"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus, Globe, Users, GraduationCap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

export default function CTASection() {
  const [stats, setStats] = useState({
    members: 0,
    batches: 0,
    countries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('batch_members')
          .select('batch, country');

        if (error) throw error;

        if (data) {
          const uniqueBatches = new Set(data.map(m => m.batch).filter(Boolean));
          const uniqueCountries = new Set(data.map(m => m.country).filter(Boolean));

          setStats({
            members: data.length,
            batches: uniqueBatches.size,
            countries: uniqueCountries.size,
          });
        }
      } catch (err) {
        console.error("Error fetching CTA stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <Section className="bg-[#131517] relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,#7662fc,transparent)] opacity-10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(50%_50%_at_50%_50%,#01f77e,transparent)] opacity-5 blur-[120px] pointer-events-none" />

      <Container className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00cc68]/10 border border-[#00cc68]/20 text-[#00cc68] text-sm font-semibold mb-8">
            <Users className="w-4 h-4" />
            Join Our Global Community
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Ready to{" "}
            <span className="text-[#00cc68] italic">Reconnect?</span>
          </h2>

          <p className="text-lg text-[#a4a4a4] mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Saharians who are already part of this growing community.
            Whether you&apos;re looking to network, share memories, or contribute to our events,
            Sahara Connect is your home away from home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/batches/join">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 204, 104, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#00cc68] hover:bg-[#00ff82] text-[#131517] font-bold px-10 py-5 text-lg rounded-lg flex items-center gap-3 transition-all duration-300"
              >
                <UserPlus className="w-5 h-5" />
                Become a Member
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="col-span-1 md:col-span-3 flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#00cc68]/50" />
            </div>
          ) : (
            <>
              <motion.div
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-10 text-center group hover:border-[#00cc68]/20 transition-all duration-500"
                whileHover={{ y: -4 }}
              >
                <div className="w-14 h-14 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00cc68]/10 transition-colors duration-500">
                  <Users className="w-7 h-7 text-[#a4a4a4] group-hover:text-[#00cc68] transition-colors duration-500" />
                </div>
                <div className="text-4xl font-bold text-[#00cc68] mb-2">
                  {stats.members.toLocaleString()}+
                </div>
                <div className="text-[#a4a4a4] font-medium uppercase tracking-widest text-xs">Active Members</div>
              </motion.div>

              <motion.div
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-10 text-center group hover:border-[#00cc68]/20 transition-all duration-500"
                whileHover={{ y: -4 }}
              >
                <div className="w-14 h-14 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00cc68]/10 transition-colors duration-500">
                  <GraduationCap className="w-7 h-7 text-[#a4a4a4] group-hover:text-[#00cc68] transition-colors duration-500" />
                </div>
                <div className="text-4xl font-bold text-[#00cc68] mb-2">
                  {stats.batches}+
                </div>
                <div className="text-[#a4a4a4] font-medium uppercase tracking-widest text-xs">Batches Connected</div>
              </motion.div>

              <motion.div
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-10 text-center group hover:border-[#00cc68]/20 transition-all duration-500"
                whileHover={{ y: -4 }}
              >
                <div className="w-14 h-14 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00cc68]/10 transition-colors duration-500">
                  <Globe className="w-7 h-7 text-[#a4a4a4] group-hover:text-[#00cc68] transition-colors duration-500" />
                </div>
                <div className="text-4xl font-bold text-[#00cc68] mb-2">
                  {stats.countries}+
                </div>
                <div className="text-[#a4a4a4] font-medium uppercase tracking-widest text-xs">Countries Reached</div>
              </motion.div>
            </>
          )}
        </motion.div>
      </Container>
    </Section>
  );
}