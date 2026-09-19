import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";

type Attachment = {
    type: "image" | "pdf";
    url: string;
    publicId: string;
    fileName: string;
    resourceType: string;
};

function serializeNotification(
    id: string,
    data: FirebaseFirestore.DocumentData
) {
    return {
        id,
        title: data.title ?? "",
        content: data.content ?? "",
        isPublished: data.isPublished ?? false,
        isPinned: data.isPinned ?? false,

        attachment: data.attachment
            ? (data.attachment as Attachment)
            : null,

        createdAt:
            data.createdAt?.toDate?.()?.toISOString() ?? null,

        updatedAt:
            data.updatedAt?.toDate?.()?.toISOString() ?? null,
    };
}

export async function GET() {
    try {
        const snapshot = await adminDb
            .collection("notifications")
            .where("isPublished", "==", true)
            .orderBy("createdAt", "desc")
            .get();

        const notifications = snapshot.docs.map((doc) =>
            serializeNotification(doc.id, doc.data())
        );

        // Pinned notifications first.
        notifications.sort((a, b) => {
            if (a.isPinned === b.isPinned) {
                return 0;
            }

            return a.isPinned ? -1 : 1;
        });

        return NextResponse.json({
            notifications,
        });
    } catch (error) {
        console.error(
            "Public notifications GET error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to fetch notifications",
            },
            {
                status: 500,
            }
        );
    }
}