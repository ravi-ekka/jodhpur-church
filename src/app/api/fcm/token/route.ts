import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";

const TOKENS_COLLECTION = "fcmTokens";

const ALLOWED_PLATFORMS = [
    "android",
    "ios",
    "web",
];

const ALLOWED_LOCALES = [
    "en",
    "hi",
    "kru",
];

export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();

        const token =
            typeof body.token === "string"
                ? body.token.trim()
                : "";

        const platform =
            typeof body.platform === "string"
                ? body.platform.trim()
                : "";

        const locale =
            typeof body.locale === "string"
                ? body.locale.trim()
                : "en";

        const userId =
            typeof body.userId === "string"
                ? body.userId.trim()
                : null;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: "FCM token is required",
                },
                { status: 400 }
            );
        }

        if (
            !ALLOWED_PLATFORMS.includes(
                platform
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid platform",
                },
                { status: 400 }
            );
        }

        const safeLocale =
            ALLOWED_LOCALES.includes(locale)
                ? locale
                : "en";

        const tokenRef = adminDb
            .collection(TOKENS_COLLECTION)
            .doc(token);

        await tokenRef.set(
            {
                token,
                platform,
                userId,
                locale: safeLocale,
                active: true,
                updatedAt:
                    FieldValue.serverTimestamp(),
            },
            {
                merge: true,
            }
        );

        return NextResponse.json({
            success: true,
            message:
                "FCM token registered successfully",
        });
    } catch (error) {
        console.error(
            "FCM token registration error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to register FCM token",
            },
            { status: 500 }
        );
    }
}