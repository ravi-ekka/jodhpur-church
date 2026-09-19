import { NextRequest, NextResponse } from "next/server";
import { getGalleryImages } from "@/lib/cached-gallery";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedLimit = Number(
      searchParams.get("limit")
    );

    const limit = Math.min(
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? requestedLimit
        : 12,
      50
    );

    const category =
      searchParams.get("category") || undefined;

    const cursor =
      searchParams.get("cursor") || undefined;

    const data = await getGalleryImages(
      category,
      limit,
      cursor
    );

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Cloudinary gallery error:", error);

    return NextResponse.json(
      {
        error: "Unable to load gallery photos",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}