import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    _request: Request,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const notificationRef = adminDb
            .collection("notifications")
            .doc(id);

        const notificationSnap = await notificationRef.get();

        if (!notificationSnap.exists) {
            return NextResponse.json(
                {
                    error: "Notification not found",
                },
                {
                    status: 404,
                }
            );
        }

        const data = notificationSnap.data();

        if (!data?.isPublished) {
            return NextResponse.json(
                {
                    error: "Notification not found",
                },
                {
                    status: 404,
                }
            );
        }

        const attachment = data.attachment;

        if (!attachment?.url) {
            return NextResponse.json(
                {
                    error: "Attachment not found",
                },
                {
                    status: 404,
                }
            );
        }

        const cloudinaryResponse = await fetch(
            attachment.url,
            {
                cache: "no-store",
            }
        );

        if (!cloudinaryResponse.ok) {
            console.error(
                "Cloudinary response:",
                cloudinaryResponse.status,
                cloudinaryResponse.statusText
            );

            return NextResponse.json(
                {
                    error: "Failed to fetch attachment",
                    status: cloudinaryResponse.status,
                },
                {
                    status: 502,
                }
            );
        }

        const contentType =
            attachment.type === "pdf"
                ? "application/pdf"
                : cloudinaryResponse.headers.get(
                      "content-type"
                  ) || "application/octet-stream";

        const fileBuffer =
            await cloudinaryResponse.arrayBuffer();

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": "inline",
            },
        });
    } catch (error) {
        console.error(
            "Notification attachment error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to load attachment",
            },
            {
                status: 500,
            }
        );
    }
}