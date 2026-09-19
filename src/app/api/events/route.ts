import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";

function serializeEvent(
    id: string,
    data: FirebaseFirestore.DocumentData
) {
    return {
        id,
        title: data.title ?? "",
        description: data.description ?? "",
        eventDate: data.eventDate ?? "",
        startTime: data.startTime ?? "",
        endTime: data.endTime ?? "",
        location: data.location ?? "",
        published: data.published ?? false,

        imageUrl: data.imageUrl ?? null,
        imagePublicId: data.imagePublicId ?? null,
        imageWidth: data.imageWidth ?? null,
        imageHeight: data.imageHeight ?? null,

        createdAt:
            data.createdAt?.toDate?.()?.toISOString() ?? null,

        updatedAt:
            data.updatedAt?.toDate?.()?.toISOString() ?? null,
    };
}

export async function GET() {
    try {
        const snapshot = await adminDb
            .collection("events")
            .where("published", "==", true)
            .orderBy("eventDate", "asc")
            .get();

        const events = snapshot.docs.map((doc) =>
            serializeEvent(doc.id, doc.data())
        );

        return NextResponse.json({
            success: true,
            events,
        });
    } catch (error) {
        console.error("Public events GET error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch events",
            },
            { status: 500 }
        );
    }
}