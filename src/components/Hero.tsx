import Image from "next/image";

const images = [
  "/memories/Acer_Wallpaper_01_3840x2400.jpg",
  "/memories/Acer_Wallpaper_02_3840x2400.jpg",
  "/memories/Acer_Wallpaper_03_3840x2400.jpg",
  "/memories/Acer_Wallpaper_04_3840x2400.jpg",
  "/memories/Acer_Wallpaper_05_3840x2400.jpg",
];

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-40">
        {images.map((img, i) => (
          <div key={i} className="relative h-64">
            <Image
              src={img}
              fill
              className="object-cover rounded-xl"
              alt="memory"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Text */}
      <div className="relative text-center max-w-3xl px-6">
        <h1 className="text-5xl font-bold mb-6">
          Reconnect. Remember. Rise Together.
        </h1>

        <p className="text-lg text-gray-200 mb-8">
          Sahara Connect brings together everyone who once called Sahara home —
          building lifelong friendships and opportunities.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold">
            Join the Network
          </button>

          <button className="border border-white px-6 py-3 rounded-lg">
            Explore Batches
          </button>
        </div>
      </div>

    </section>
  );
}