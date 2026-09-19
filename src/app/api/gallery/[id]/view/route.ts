import { NextResponse } from "next/server";

import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(
    _request: Request,
    context: RouteContext,
) {
    try {
        /*
         * --------------------------------------------------------
         * GET GALLERY PHOTO ID
         * --------------------------------------------------------
         */

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Photo ID is required",
                },
                {
                    status: 400,
                },
            );
        }

        /*
         * --------------------------------------------------------
         * FIND PHOTO
         * --------------------------------------------------------
         */

        const galleryRef =
            adminDb
                .collection("gallery")
                .doc(id);

        const gallerySnapshot =
            await galleryRef.get();

        if (!gallerySnapshot.exists) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Photo not found",
                },
                {
                    status: 404,
                },
            );
        }

        const data =
            gallerySnapshot.data();

        /*
         * --------------------------------------------------------
         * MAKE SURE THIS IS A PHOTO
         * --------------------------------------------------------
         *
         * The view counter is only for gallery photos.
         *
         * YouTube videos already have their own YouTube
         * view count.
         */

        if (
            data?.resourceType &&
            data.resourceType !== "image"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "View count is only available for photos",
                },
                {
                    status: 400,
                },
            );
        }

        /*
         * --------------------------------------------------------
         * INCREMENT VIEW COUNT
         * --------------------------------------------------------
         *
         * FieldValue.increment() performs an atomic increment.
         *
         * If viewCount does not exist yet, Firestore will
         * create it with the increment value.
         */

        await galleryRef.update({
            viewCount:
                FieldValue.increment(1),
        });

        /*
         * --------------------------------------------------------
         * READ UPDATED VALUE
         * --------------------------------------------------------
         */

        const updatedSnapshot =
            await galleryRef.get();

        const updatedData =
            updatedSnapshot.data();

        const viewCount =
            typeof updatedData?.viewCount ===
            "number"
                ? updatedData.viewCount
                : 0;

        /*
         * --------------------------------------------------------
         * RESPONSE
         * --------------------------------------------------------
         */

        return NextResponse.json({
            success: true,
            id,
            viewCount,
        });
    } catch (error) {
        console.error(
            "Gallery photo view API error:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error: "Failed to record photo view",
            },
            {
                status: 500,
            },
        );
    }
}