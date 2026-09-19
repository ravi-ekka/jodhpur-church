import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    _request: NextRequest,
    { params }: Props
) {
    try {
        const { id } = await params;

        const doc = await adminDb
            .collection("notifications")
            .doc(id)
            .get();

        if (!doc.exists) {
            return NextResponse.json(
                { error: "Notification not found" },
                { status: 404 }
            );
        }

        const data = doc.data();

        if (!data?.isPublished) {
            return NextResponse.json(
                { error: "Notification not found" },
                { status: 404 }
            );
        }

        const attachment = data.attachment;

        if (!attachment?.url) {
            return NextResponse.json(
                { error: "Attachment not found" },
                { status: 404 }
            );
        }

        const response = await fetch(attachment.url, {
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch attachment" },
                { status: 502 }
            );
        }

        const contentType =
            attachment.type === "pdf"
                ? "application/pdf"
                : response.headers.get("content-type") ||
                  "application/octet-stream";

        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": "inline",
            },
        });
    } catch (error) {
        console.error(
            "Notification attachment GET error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to load attachment" },
            { status: 500 }
        );
    }
}