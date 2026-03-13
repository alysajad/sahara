"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"

// Dynamically import Masonry to avoid SSR issues with GSAP and window/measurements
const Masonry = dynamic(() => import("@/components/ui/Masonry"), { ssr: false })

interface Alumni {
  name: string
  role: string
  image: string
  batch: string
}

export default function AlumniSpotlightSection({ alumni = [] }: { alumni: Alumni[] }) {
  const masonryItems = useMemo(() => {
    return alumni.map((profile, i) => ({
      // We encode the details into the ID since the Masonry component renders the ID on hover
      // We use a pipe '|' instead of newlines because newlines break GSAP's document.querySelectorAll('[data-key="..."]')
      // We also append the index to ensure the ID is absolutely unique even if multiple rows have the same mock data
      id: `${profile.name}|${profile.role}|Batch ${profile.batch}|-${i}`, 
      img: profile.image,
      // Create varied heights for the masonry layout to look natural (400, 500, 600, etc)
      height: 400 + (i % 4) * 80, 
    }))
  }, [alumni])

  return (
    <section className="relative py-24 bg-[#0a0b0c] overflow-hidden min-h-screen">

      {/* Subtle gradient blob */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(50%_50%_at_50%_50%,#7662fc,transparent)] opacity-10 blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative px-6 z-10">

        {/* TEXT OVERLAY */}
        {/* We use z-20 and absolute positioning to overlay text nicely over the masonry grid on desktop */}
        <div className="mb-12 lg:absolute lg:left-10 lg:top-1/3 lg:z-20 lg:mb-0 pointer-events-none">
          <h2 className="text-white font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            This<br/>
            is<br/>
            <span className="text-[#00cc68]">Us</span>
          </h2>
        </div>

        {/* MASONRY GRID */}
        {masonryItems.length > 0 ? (
          <div className="lg:pl-[25%] pt-10">
            <Masonry 
              items={masonryItems} 
              animateFrom="bottom" 
              colorShiftOnHover={true}
              scaleOnHover={true}
              hoverScale={1.03}
              blurToFocus={true}
            />
          </div>
        ) : (
          <div className="min-h-[500px] flex items-center justify-center">
            <p className="text-[#a4a4a4]">Loading alumni...</p>
          </div>
        )}

      </div>

    </section>
  )
}