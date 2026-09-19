import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
    try {
        const snapshot = await adminDb
            .collection("sermons")
            .where("published", "==", true)
            .orderBy("sermonDate", "desc")
            .get();

        const sermons = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
                id: doc.id,
                title: data.title ?? "",
                description: data.description ?? "",
                preacher: data.preacher ?? "",
                sermonDate: data.sermonDate ?? null,
                youtubeUrl: data.youtubeUrl ?? "",
                imageUrl: data.imageUrl ?? null,
                imagePublicId: data.imagePublicId ?? null,
                imageWidth: data.imageWidth ?? null,
                imageHeight: data.imageHeight ?? null,
            };
        });

        return NextResponse.json({
            success: true,
            sermons,
        });
    } catch (error) {
        console.error(
            "PUBLIC SERMONS API ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch sermons",
            },
            { status: 500 }
        );
    }
}