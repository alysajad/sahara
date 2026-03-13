import BatchNetworkSection from "../../sections/BatchNetworkSection";

export default function BatchesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="pt-24">
        <div className="text-center py-16">
          <h1 className="text-5xl font-serif font-bold text-gray-800 mb-6">
            Our <span className="text-black">Batches</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with your batchmates and discover the stories of batches that came before and after yours.
          </p>
        </div>
        <BatchNetworkSection />
      </div>
    </main>
  );
}