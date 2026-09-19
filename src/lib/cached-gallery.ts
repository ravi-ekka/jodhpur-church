import { cacheLife, cacheTag } from "next/cache";
import cloudinary from "@/lib/cloudinary/cloudinary-server";

type CloudinaryResource = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
};

export async function getGalleryImages(
  category: string | undefined,
  limit: number,
  cursor?: string
) {
  "use cache";

  cacheLife({
    stale: 86400,
    revalidate: 86400,
    expire: 86400,
  });

  cacheTag("church-gallery");

  const prefix = category
    ? `jodhpur-church/photo/${category}/`
    : "jodhpur-church/photo/";

  const options: {
    type: "upload";
    resource_type: "image";
    prefix: string;
    max_results: number;
    next_cursor?: string;
  } = {
    type: "upload",
    resource_type: "image",
    prefix,
    max_results: Math.min(limit, 50),
  };

  if (cursor) {
    options.next_cursor = cursor;
  }

  const result = await cloudinary.api.resources(options);

  const resources = result.resources as CloudinaryResource[];

  return {
    images: resources.map((resource) => ({
      url: resource.secure_url,
      publicId: resource.public_id,
      width: resource.width,
      height: resource.height,
    })),

    nextCursor: result.next_cursor || null,
  };
}