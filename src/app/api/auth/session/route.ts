import { NextRequest, NextResponse } from "next/server";

import {
    adminAuth,
    adminDb,
} from "@/lib/firebase/admin";

const SESSION_COOKIE =
    "jodhpur_church_session";

const EXPIRES_IN =
    1000 * 60 * 60 * 24 * 5; // 5 days

export async function POST(
    request: NextRequest
) {
    try {
        // --------------------------------------------------------
        // Get ID token
        // --------------------------------------------------------

        const { idToken } =
            await request.json();

        if (!idToken) {
            return NextResponse.json(
                {
                    error:
                        "ID token is required",
                },
                {
                    status: 400,
                }
            );
        }

        // --------------------------------------------------------
        // Verify Firebase ID token
        // --------------------------------------------------------

        const decodedToken =
            await adminAuth.verifyIdToken(
                idToken
            );

        // --------------------------------------------------------
        // Create secure session cookie
        // --------------------------------------------------------

        const sessionCookie =
            await adminAuth.createSessionCookie(
                idToken,
                {
                    expiresIn:
                        EXPIRES_IN,
                }
            );

        // --------------------------------------------------------
        // Get Firestore user
        // --------------------------------------------------------

        const userRef =
            adminDb
                .collection("users")
                .doc(decodedToken.uid);

        const userSnapshot =
            await userRef.get();

        // --------------------------------------------------------
        // Create user profile if it doesn't exist
        // --------------------------------------------------------

        if (!userSnapshot.exists) {
            const roleId =
                decodedToken.email ===
                process.env.SUPER_ADMIN_EMAIL
                    ? "super-admin"
                    : "user";

            await userRef.set({
                uid: decodedToken.uid,

                email:
                    decodedToken.email ??
                    "",

                displayName:
                    decodedToken.name ??
                    "",

                roleId,

                active: true,

                createdAt:
                    new Date(),

                updatedAt:
                    new Date(),
            });
        }

        // --------------------------------------------------------
        // Create response
        // --------------------------------------------------------

        const response =
            NextResponse.json({
                success: true,
            });

        // --------------------------------------------------------
        // Set secure HTTP-only cookie
        // --------------------------------------------------------

        response.cookies.set({
            name:
                SESSION_COOKIE,

            value:
                sessionCookie,

            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                "strict",

            path: "/",

            maxAge:
                60 * 60 * 24 * 5,
        });

        return response;
    } catch (error) {
        console.error(
            "Session creation error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Unable to create session",
            },
            {
                status: 401,
            }
        );
    }
}