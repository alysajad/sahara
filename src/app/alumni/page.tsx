"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { MapPin, Briefcase, Linkedin, User as UserIcon, Loader2 } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { supabase } from "@/lib/supabase";

/* ================= TYPES ================= */

interface Alumnus {
  id: string | number;
  name: string;
  role: string;
  company: string;
  location: string;
  image: string;
  batch: string;
  linkedin: string;
}

/* ================= PAGE ================= */

export default function AlumniDirectoryPage() {
  const [alumni, setAlumni] = useState<Alumnus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [batches, setBatches] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const { data, error } = await supabase
          .from('batch_members')
          .select('*')
          .order('batch', { ascending: false })
          .order('name', { ascending: true });

        if (error) throw error;

        const formattedAlumni: Alumnus[] = (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          role: item.job_title || "Member",
          company: item.company || "Sahara Connect",
          location: item.country || "Earth",
          image: item.profile_image_url || "",
          batch: item.batch,
          linkedin: item.linkedin_url || "#",
        }));

        setAlumni(formattedAlumni);

        // Derive batches
        const uniqueBatches = Array.from(new Set((data || []).map(item => item.batch))).sort((a, b) => b.localeCompare(a));
        setBatches(["All", ...uniqueBatches]);

      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const filteredAlumni =
    selectedBatch === "All"
      ? alumni
      : alumni.filter((a) => a.batch === selectedBatch);

  return (
    <Section className="min-h-screen pt-32 bg-background">
      <Container>

        {/* HEADER */}

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold font-serif text-gray-900">
            Alumni <span className="text-black">Directory</span>
          </h1>

          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Connect with members of the Sahara community and explore where
            your batchmates are today.
          </p>
        </motion.div>

        {/* FILTER */}

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {batches.map((batch) => (
            <Button
              key={batch}
              variant="outline"
              className={`rounded-full px-6 transition-all duration-300 ${
                selectedBatch === batch
                  ? "bg-black text-white border-black hover:bg-gray-800"
                  : "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-black hover:border-gray-400"
              }`}
              onClick={() => setSelectedBatch(batch)}
            >
              {batch === "All" ? "All Batches" : `Batch ${batch}`}
            </Button>
          ))}
        </div>

        {/* ALUMNI GRID */}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredAlumni.map((person) => (
                <motion.div
                  key={person.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition border-gray-100 shadow-sm">
                    <div className="relative h-64 bg-gray-50 flex items-center justify-center">
                      {person.image ? (
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <UserIcon className="w-20 h-20 text-gray-200" />
                      )}

                      <Badge className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border-0">
                        Batch of {person.batch}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {person.name}
                      </h3>

                      <div className="space-y-3 text-muted-foreground">
                        <div className="flex gap-2 items-start">
                          <Briefcase className="w-4 h-4 mt-1 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-800">{person.role}</p>
                            <p className="text-sm text-gray-500">{person.company}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{person.location}</span>
                        </div>
                      </div>

                      {person.linkedin && person.linkedin !== "#" && (
                        <Button
                          className="w-full mt-6 bg-black hover:bg-gray-800 text-white rounded-xl h-12"
                          asChild
                        >
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 justify-center"
                          >
                            <Linkedin className="w-4 h-4" />
                            Connect
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* EMPTY STATE */}

        {!loading && filteredAlumni.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-xl italic bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            No alumni found for this batch yet.
          </div>
        )}

      </Container>
    </Section>
  );
}
