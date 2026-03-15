"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

const aboutImages = [
  "/memories/crowd.jpeg",
  "/memories/lights.jpeg",
  "/memories/main.jpeg",
  "/memories/singer.jpeg",
];

export default function AboutSection() {
  return (
    <Section className="bg-[#F9F6F0] py-24">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#dcd8d0] bg-white/50 text-[#6b8e73] text-xs uppercase tracking-widest font-semibold mb-6 shadow-sm">
              Our Story
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#2C2C2C] mb-8 tracking-tight leading-[1.1]">
              About{" "}
              <span className="relative inline-block text-[#6b8e73] italic">
                Sahara
                {/* Hand-drawn circle */}
                <svg
                  className="absolute -top-3 -left-4 w-[130%] h-[160%] text-[#bb8d62] opacity-50 z-[-1]"
                  viewBox="0 0 100 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M50 5 C80 5 95 20 95 30 C95 45 60 48 40 45 C15 40 5 25 10 15 C15 5 40 2 60 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </svg>
              </span>
            </h2>

            <div className="space-y-6 text-lg text-[#646464] leading-relaxed">
              <p>
                Sahara Hostel isn&apos;t just a place to stay—it&apos;s where lifelong bonds are forged.
                From late-night conversations that turn into lifelong friendships, to shared
                adventures that create unforgettable memories, Sahara represents the essence
                of brotherhood and community.
              </p>

              <p>
                Our alumni network spans across the globe, working in diverse fields,
                yet united by the common thread of having called Sahara home. Whether
                you&apos;re a recent graduate or someone who stayed decades ago, the spirit
                of Sahara lives on in each of us.
              </p>

              <p>
                Through Sahara Connect, we maintain these connections, celebrate our
                shared history, and continue to support each other&apos;s journeys forward.
              </p>
            </div>
          </motion.div>

          {/* Image Grid styled like polaroids */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {aboutImages.map((img, i) => (
              <motion.div
                key={i}
                className={`relative h-56 rounded-sm bg-white p-2 shadow-md filter sepia-[0.1] ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'} transition-transform duration-300 hover:rotate-0 hover:z-10 hover:shadow-xl`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={img}
                    fill
                    className="object-cover"
                    alt={`Sahara memory ${i + 1}`}
                  />
                  <div className="absolute inset-0 bg-[#bb8d62]/10 mix-blend-overlay transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}