import { supabase } from "@/lib/supabase";
import { Metadata, ResolvingMetadata } from "next";
import EventDetailsClient from "@/app/events/[id]/EventDetailsClient";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const images = event.image_url ? [event.image_url] : ["/memories/Acer_Wallpaper_03_3840x2400.jpg"];

  return {
    title: `${event.title} | Sahara Connect`,
    description: event.tagline || event.description || "Join us for this amazing event at Sahara Connect.",
    openGraph: {
      title: event.title,
      description: event.tagline || event.description,
      images: images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.tagline || event.description,
      images: images,
    },
  };
}

export default function Page({ params }: Props) {
  return <EventDetailsClient />;
}
