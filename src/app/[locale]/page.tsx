
import "server-only";

import Hero from "@/components/home/Hero";
import TodaysBible from "@/components/home/TodaysBible";
import HeroSlider, {
  type SliderItem,
} from "@/components/home/HeroSlider";
import { getChurchSettings } from "@/lib/settings/church-settings";
import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache } from "next/cache";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const getCachedSliders = unstable_cache(
  async (): Promise<SliderItem[]> => {
    try {
      const snapshot = await adminDb
        .collection("sliders")
        .where("isActive", "==", true)
        .orderBy("displayOrder", "asc")
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,

          title: {
            en: data.title?.en ?? "",
            hi: data.title?.hi ?? "",
            kru: data.title?.kru ?? "",
          },

          description: {
            en: data.description?.en ?? "",
            hi: data.description?.hi ?? "",
            kru: data.description?.kru ?? "",
          },

          buttonText: {
            en: data.buttonText?.en ?? "",
            hi: data.buttonText?.hi ?? "",
            kru: data.buttonText?.kru ?? "",
          },

          imageUrl: data.imageUrl ?? "",
          publicId: data.publicId ?? "",
          buttonUrl: data.buttonUrl ?? "",
          displayOrder: data.displayOrder ?? 0,
        };
      });
    } catch (error) {
      console.error("GET SLIDERS ERROR:", error);
      return [];
    }
  },
  ["home-sliders"],
  {
    revalidate: 3600,
    tags: ["home-sliders"],
  }
);

async function getSliders() {
  return getCachedSliders();
}

export default async function HomePage({
  params,
}: HomePageProps) {
  const { locale } = await params;

  const [settings, sliderItems] = await Promise.all([
    getChurchSettings(),
    getSliders(),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f0e2] text-[#3f302b] dark:bg-[#1d1715] dark:text-[#f3dfbc]">
      <Hero
        locale={locale}
        sundayWorship={settings.sundayWorship}
      />

      <TodaysBible />

      <HeroSlider
        locale={locale}
        sliderItems={sliderItems}
      />
    </main>
  );
}

