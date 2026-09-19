import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

import { adminDb } from "@/lib/firebase/admin";

const CACHE_TAG = "church-slider";

async function getSliders() {
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
}

const getCachedSliders = unstable_cache(
    getSliders,
    ["public", "sliders"],
    {
        tags: [CACHE_TAG],
    }
);

export async function GET() {
    try {
        const sliders = await getCachedSliders();

        return NextResponse.json(
            {
                success: true,
                sliders,
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("Public slider error:", error);

        return NextResponse.json(
            {
                success: false,
                sliders: [],
                error: "Failed to load sliders",
            },
            { status: 500 }
        );
    }
}