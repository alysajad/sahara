"use client"

import { motion } from "framer-motion"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { Users, History, Lightbulb, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-16">
      {/* Hero Section */}
      <Section className="py-12 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              About <span className="text-primary italic">Sahara</span> Connect
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              We are a passionate community of alumni bringing together generations of talent,
              memories, and professional brilliance.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section className="bg-secondary/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <Container className="relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sahara Connect was forged with a singular goal: to ensure the bonds forged during
                our most formative years never dilute. We strive to create an ecosystem
                where alumni can mentor the next generation, collaborate on pioneering projects,
                and celebrate collective milestones.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By bridging the gap between various batches, we ensure that every member of the Sahara 
                family has access to an incredible network of professionals spanning the globe.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: Users, label: "Community", desc: "10,000+ Members Worldwide" },
                { icon: History, label: "Legacy", desc: "Decades of Shared History" },
                { icon: Lightbulb, label: "Innovation", desc: "Collaborative Ventures" },
                { icon: Heart, label: "Giving Back", desc: "Mentorship & Scholarships" },
              ].map((item, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border text-center group hover:border-primary transition-colors">
                  <div className="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* History/Story */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">The Sahara Story</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
              <p>
                What started as a small annual gathering in the late 90s has evolved into a global force. 
                The Sahara Connect platform was built by alumni, for alumni. It represents our 
                commitment to keeping the spirit of our institution alive, no matter where life
                takes us.
              </p>
              <br />
              <p>
                Today, Sahara Connect orchestrates major events, facilitates career opportunities, 
                and serves as the central hub for our incredible community narrative. We invite you 
                to explore, engage, and enrich this platform with your own story.
              </p>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
