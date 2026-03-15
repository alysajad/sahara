import BatchNetworkSection from "../../sections/BatchNetworkSection";

export default function BatchesPage() {
  return (
    <main className="min-h-screen bg-[#F9F6F0]">
      <div className="pt-24">
        <div className="text-center py-16 relative">
          {/* Subtle background texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(44,44,44,0.04) 40px)",
            }}
          />

          <div className="relative z-10">
            <h1 className="font-serif text-5xl font-bold text-[#2C2C2C] mb-6 tracking-tight">
              Our{" "}
              <span className="italic text-[#6b8e73]">Batches</span>
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-16 bg-[#dcd8d0]" />
              <span className="text-[#bb8d62] text-xs tracking-[0.3em] uppercase font-semibold">
                Alumni Network
              </span>
              <span className="h-px w-16 bg-[#dcd8d0]" />
            </div>

            <p className="text-xl text-[#646464] max-w-3xl mx-auto font-serif italic">
              Connect with your batchmates and discover the stories of batches
              that came before and after yours.
            </p>
          </div>
        </div>
        <BatchNetworkSection />
      </div>
    </main>
  );
}