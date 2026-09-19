
import "server-only";

import { unstable_cache } from "next/cache";

import { adminDb } from "@/lib/firebase/admin";

export type ChurchSettings = {
  churchName: string;
  phone: string;
  whatsapp: string;
  email: string;
  alternatePhone: string;
  address: string;

  sundayWorship: string;
  weekdayService: string;
  confessionTime: string;

  facebook: string;
  instagram: string;
  youtube: string;

  websiteTitle: string;
  websiteDescription: string;
  footerDescription: string;
};

const DEFAULT_SETTINGS: ChurchSettings = {
  churchName: "Jodhpur Church",
  phone: "",
  whatsapp: "",
  email: "",
  alternatePhone: "",
  address: "",
  sundayWorship: "",
  weekdayService: "",
  confessionTime: "",
  facebook: "",
  instagram: "",
  youtube: "",
  websiteTitle: "Jodhpur Church",
  websiteDescription:
    "Jodhpur Church, Balrampur, Chhattisgarh",
  footerDescription: "",
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSettings(
  data: Record<string, unknown>
): ChurchSettings {
  return {
    churchName:
      cleanString(data.churchName) ||
      DEFAULT_SETTINGS.churchName,

    phone: cleanString(data.phone),
    whatsapp: cleanString(data.whatsapp),
    email: cleanString(data.email),
    alternatePhone: cleanString(data.alternatePhone),
    address: cleanString(data.address),

    sundayWorship: cleanString(data.sundayWorship),
    weekdayService: cleanString(data.weekdayService),
    confessionTime: cleanString(data.confessionTime),

    facebook: cleanString(data.facebook),
    instagram: cleanString(data.instagram),
    youtube: cleanString(data.youtube),

    websiteTitle:
      cleanString(data.websiteTitle) ||
      DEFAULT_SETTINGS.websiteTitle,

    websiteDescription:
      cleanString(data.websiteDescription) ||
      DEFAULT_SETTINGS.websiteDescription,

    footerDescription: cleanString(
      data.footerDescription
    ),
  };
}

const getCachedChurchSettings = unstable_cache(
  async (): Promise<ChurchSettings> => {
    try {
      const snapshot = await adminDb
        .collection("settings")
        .doc("church")
        .get();

      if (!snapshot.exists) {
        return DEFAULT_SETTINGS;
      }

      return normalizeSettings(
        (snapshot.data() ?? {}) as Record<string, unknown>
      );
    } catch (error) {
      console.error(
        "GET CHURCH SETTINGS ERROR:",
        error
      );

      return DEFAULT_SETTINGS;
    }
  },
  ["church-settings"],
  {
    revalidate: 86400,
    tags: ["church-settings"],
  }
);

export async function getChurchSettings() {
  return getCachedChurchSettings();
}

