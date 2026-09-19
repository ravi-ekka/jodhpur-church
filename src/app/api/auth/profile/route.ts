import { NextResponse } from "next/server";

import {
    adminAuth,
    adminDb,
} from "@/lib/firebase/admin";

async function getAuthenticatedUser(
    request: Request
) {
    const authorization =
        request.headers.get("authorization");

    if (
        !authorization?.startsWith(
            "Bearer "
        )
    ) {
        throw new Error("Unauthorized");
    }

    const idToken =
        authorization.substring(7);

    return adminAuth.verifyIdToken(idToken);
}

export async function POST(
    request: Request
) {
    try {
        const decodedToken =
            await getAuthenticatedUser(request);

        const userRef =
            adminDb
                .collection("users")
                .doc(decodedToken.uid);

        const userSnapshot =
            await userRef.get();

        // ========================================================
        // EXISTING USER
        // ========================================================

        if (userSnapshot.exists) {
            const existingUser =
                userSnapshot.data();

            // IMPORTANT:
            // Do NOT change contributor here.
            // If admin has set contributor: false,
            // it must remain false.

            await userRef.update({
                email:
                    decodedToken.email ??
                    existingUser?.email ??
                    "",

                displayName:
                    decodedToken.name ??
                    existingUser?.displayName ??
                    "",

                updatedAt: new Date(),
            });

            return NextResponse.json({
                success: true,
                created: false,

                user: {
                    uid: decodedToken.uid,

                    email:
                        decodedToken.email ??
                        existingUser?.email ??
                        "",

                    displayName:
                        decodedToken.name ??
                        existingUser?.displayName ??
                        "",

                    roleId:
                        existingUser?.roleId ??
                        "user",

                    active:
                        existingUser?.active !== false,

                    contributor:
                        existingUser?.contributor === true,
                },
            });
        }

        // ========================================================
        // NEW USER
        // ========================================================

        const newUser = {
            uid: decodedToken.uid,

            email:
                decodedToken.email ?? "",

            displayName:
                decodedToken.name ?? "",

            roleId: "user",

            active: true,

            // Every new frontend user gets
            // contributor access by default.
            contributor: true,

            createdAt: new Date(),

            updatedAt: new Date(),
        };

        await userRef.set(newUser);

        return NextResponse.json({
            success: true,
            created: true,

            user: {
                uid: newUser.uid,
                email: newUser.email,
                displayName: newUser.displayName,
                roleId: newUser.roleId,
                active: newUser.active,
                contributor: newUser.contributor,
            },
        });
    } catch (error) {
        console.error(
            "Create user profile error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Unable to create user profile";

        return NextResponse.json(
            {
                error: message,
            },
            {
                status:
                    message === "Unauthorized"
                        ? 401
                        : 500,
            }
        );
    }
}

// ============================================================
// GET USER PROFILE
// ============================================================

export async function GET(
    request: Request
) {
    try {
        const decodedToken =
            await getAuthenticatedUser(request);

        const userRef =
            adminDb
                .collection("users")
                .doc(decodedToken.uid);

        const userSnapshot =
            await userRef.get();

        if (!userSnapshot.exists) {
            return NextResponse.json(
                {
                    error:
                        "User profile not found",
                },
                {
                    status: 404,
                }
            );
        }

        const userData =
            userSnapshot.data();

        return NextResponse.json({
            success: true,

            user: {
                uid: decodedToken.uid,

                email:
                    userData?.email ??
                    decodedToken.email ??
                    "",

                displayName:
                    userData?.displayName ??
                    decodedToken.name ??
                    "",

                roleId:
                    userData?.roleId ??
                    "user",

                active:
                    userData?.active !== false,

                contributor:
                    userData?.contributor === true,
            },
        });
    } catch (error) {
        console.error(
            "Get user profile error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Unable to load user profile";

        return NextResponse.json(
            {
                error: message,
            },
            {
                status:
                    message === "Unauthorized"
                        ? 401
                        : 500,
            }
        );
    }
}