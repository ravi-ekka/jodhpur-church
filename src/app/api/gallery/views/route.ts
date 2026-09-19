import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";

const MAX_IDS = 100;

function getViewCount(value: unknown): number {
    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(
            request.url,
        );

        const idsParam =
            searchParams.get("ids");

        if (!idsParam) {
            return NextResponse.json(
                {
                    success: true,
                    views: {},
                },
            );
        }

        const ids = Array.from(
            new Set(
                idsParam
                    .split(",")
                    .map((id) => id.trim())
                    .filter(
                        (id) =>
                            id.length > 0,
                    ),
            ),
        ).slice(0, MAX_IDS);

        if (ids.length === 0) {
            return NextResponse.json({
                success: true,
                views: {},
            });
        }

        /*
         * Firestore getAll() lets us read multiple
         * gallery documents efficiently.
         */

        const refs = ids.map((id) =>
            adminDb
                .collection("gallery")
                .doc(id),
        );

        const snapshots =
            await adminDb.getAll(...refs);

        const views: Record<
            string,
            number
        > = {};

        snapshots.forEach(
            (snapshot, index) => {
                if (!snapshot.exists) {
                    return;
                }

                const data =
                    snapshot.data();

                /*
                 * Only return view counts.
                 *
                 * This endpoint NEVER increments
                 * the view count.
                 */

                views[ids[index]] =
                    getViewCount(
                        data?.viewCount,
                    );
            },
        );

        return NextResponse.json({
            success: true,
            views,
        });
    } catch (error) {
        console.error(
            "Gallery view counts API error:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    "Failed to load view counts",
                views: {},
            },
            {
                status: 500,
            },
        );
    }
}