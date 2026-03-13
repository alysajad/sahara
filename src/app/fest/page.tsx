import FestSection from "../../sections/FestSection";

export default function FestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="pt-24">
        <div className="text-center py-16">
          <h1 className="text-5xl font-serif font-bold text-gray-800 mb-6">
            Sahara <span className="text-black">Fest</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for the most anticipated event of the year. Contribute and be part of the celebration.
          </p>
        </div>
        <FestSection />
      </div>
    </main>
  );
}