import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Gallery from "@/components/gallery/Gallery";
import { getBaseUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type GalleryApiResponse = {
  success?: boolean;
  photos?: unknown;
  videos?: unknown;
};
export const instant = false
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "gallery",
  });

  return {
    title: `${t("title")} | Jodhpur Church`,
    description: t("description"),
  };
}

export default async function GalleryPage() {
  const baseUrl = await getBaseUrl();

  try {
    const response = await fetch(
      `${baseUrl}/api/gallery`,
      {
        next: {
          /*
           * Keep the main Gallery page fast.
           *
           * Gallery data is regenerated every
           * 5 minutes or when the cache tag
           * is explicitly revalidated.
           */
          revalidate: 300,
          tags: ["church-gallery"],
        },
      },
    );

    if (!response.ok) {
      return (
        <Gallery
          initialPhotos={[]}
          initialVideos={[]}
          initialError
        />
      );
    }

    const data: GalleryApiResponse =
      await response.json();

    const photos = Array.isArray(
      data.photos,
    )
      ? data.photos
      : [];

    const videos = Array.isArray(
      data.videos,
    )
      ? data.videos
      : [];

    return (
      <Gallery
        initialPhotos={photos}
        initialVideos={videos}
      />
    );
  } catch (error) {
    console.error(
      "Gallery page failed to load:",
      error,
    );

    return (
      <Gallery
        initialPhotos={[]}
        initialVideos={[]}
        initialError
      />
    );
  }
}