import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import cloudinary from "@/lib/cloudinary/cloudinary-server";

const CONTRIBUTOR_FOLDER =
    "jodhpur-church/contributors";

const CONTRIBUTOR_PHOTOS_COLLECTION =
    "contributorPhotos";

const GALLERY_COLLECTION =
    "gallery";

const GALLERY_CACHE_TAG =
    "church-gallery";

const MAX_SIZE =
    10 * 1024 * 1024;

/* -------------------------------------------------------
 * AUTHENTICATION
 * ----------------------------------------------------- */

async function getAuthenticatedUser(
    request: NextRequest,
) {
    const authorization =
        request.headers.get("Authorization");

    if (
        !authorization ||
        !authorization.startsWith("Bearer ")
    ) {
        throw new Error(
            "Authorization token is required.",
        );
    }

    const idToken =
        authorization.substring(7);

    const decodedToken =
        await adminAuth.verifyIdToken(idToken);

    const uid =
        decodedToken.uid;

    const userSnapshot =
        await adminDb
            .collection("users")
            .doc(uid)
            .get();

    if (!userSnapshot.exists) {
        throw new Error(
            "User profile not found.",
        );
    }

    const userData =
        userSnapshot.data() ?? {};

    if (
        userData.active === false
    ) {
        throw new Error(
            "Your account is inactive.",
        );
    }

    if (
        userData.contributor !== true
    ) {
        throw new Error(
            "You do not have Contributor access.",
        );
    }

    return {
        uid,

        email:
            decodedToken.email ??
            userData.email ??
            "",

        displayName:
            decodedToken.name ??
            userData.displayName ??
            "",
    };
}

/* -------------------------------------------------------
 * GET
 *
 * Load only the logged-in contributor's photos.
 *
 * IMPORTANT:
 * Approved photos get their viewCount from
 * the linked public gallery document.
 *
 * contributorPhotos.galleryId
 *          ↓
 * gallery/{galleryId}.viewCount
 *
 * This guarantees the contributor and public
 * gallery use the SAME view count.
 * ----------------------------------------------------- */

export async function GET(
    request: NextRequest,
) {
    try {
        const user =
            await getAuthenticatedUser(
                request,
            );

        const snapshot =
            await adminDb
                .collection(
                    CONTRIBUTOR_PHOTOS_COLLECTION,
                )
                .where(
                    "uid",
                    "==",
                    user.uid,
                )
                .orderBy(
                    "createdAt",
                    "desc",
                )
                .get();

        /*
         * Build the contributor photo list.
         *
         * For approved photos we will later
         * read the linked gallery document.
         */
        const photos =
            await Promise.all(
                snapshot.docs.map(
                    async (doc) => {
                        const data =
                            doc.data();

                        let viewCount = 0;

                        /*
                         * Only approved photos have
                         * a public gallery document.
                         */
                        if (
                            data.status ===
                                "approved" &&
                            typeof data.galleryId ===
                                "string" &&
                            data.galleryId.trim()
                        ) {
                            try {
                                const gallerySnapshot =
                                    await adminDb
                                        .collection(
                                            GALLERY_COLLECTION,
                                        )
                                        .doc(
                                            data.galleryId,
                                        )
                                        .get();

                                if (
                                    gallerySnapshot.exists
                                ) {
                                    const galleryData =
                                        gallerySnapshot.data();

                                    viewCount =
                                        typeof galleryData?.viewCount ===
                                        "number"
                                            ? galleryData.viewCount
                                            : 0;
                                }
                            } catch (
                                galleryError
                            ) {
                                console.error(
                                    "Failed to load gallery view count:",
                                    galleryError,
                                );

                                /*
                                 * Keep the submission available
                                 * even if the gallery count cannot
                                 * be loaded.
                                 */
                                viewCount = 0;
                            }
                        }

                        return {
                            id: doc.id,

                            ...data,

                            /*
                             * Current public gallery view count.
                             *
                             * Pending/rejected = 0
                             * Approved = gallery.viewCount
                             */
                            viewCount,
                        };
                    },
                ),
            );

        return NextResponse.json({
            success: true,
            photos,
        });
    } catch (error) {
        console.error(
            "Contributor photos GET error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load your photos.",
            },
            {
                status: 401,
            },
        );
    }
}

/* -------------------------------------------------------
 * POST
 *
 * Upload a new contributor photo.
 * New photos always start as pending.
 * ----------------------------------------------------- */

export async function POST(
    request: NextRequest,
) {
    let uploadedPublicId:
        | string
        | null = null;

    try {
        const user =
            await getAuthenticatedUser(
                request,
            );

        const formData =
            await request.formData();

        const file =
            formData.get("file");

        if (
            !(file instanceof File)
        ) {
            return NextResponse.json(
                {
                    error:
                        "Image file is required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            !file.type.startsWith(
                "image/",
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Only image files are allowed.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            file.size > MAX_SIZE
        ) {
            return NextResponse.json(
                {
                    error:
                        "Image size must be less than 10 MB.",
                },
                {
                    status: 400,
                },
            );
        }

        const title =
            String(
                formData.get("title") ||
                    "",
            ).trim();

        const description =
            String(
                formData.get(
                    "description",
                ) || "",
            ).trim();

        if (!title) {
            return NextResponse.json(
                {
                    error:
                        "Photo title is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const buffer =
            Buffer.from(
                await file.arrayBuffer(),
            );

        const uploadResult =
            await new Promise<any>(
                (
                    resolve,
                    reject,
                ) => {
                    const uploadStream =
                        cloudinary
                            .uploader
                            .upload_stream(
                                {
                                    folder:
                                        CONTRIBUTOR_FOLDER,

                                    resource_type:
                                        "image",
                                },

                                (
                                    error,
                                    result,
                                ) => {
                                    if (
                                        error
                                    ) {
                                        reject(
                                            error,
                                        );
                                    } else {
                                        resolve(
                                            result,
                                        );
                                    }
                                },
                            );

                    uploadStream.end(
                        buffer,
                    );
                },
            );

        uploadedPublicId =
            uploadResult.public_id;

        const photoRef =
            adminDb
                .collection(
                    CONTRIBUTOR_PHOTOS_COLLECTION,
                )
                .doc();

        await photoRef.set({
            uid:
                user.uid,

            email:
                user.email,

            displayName:
                user.displayName,

            title,

            description,

            url:
                uploadResult.secure_url,

            publicId:
                uploadResult.public_id,

            width:
                uploadResult.width ??
                null,

            height:
                uploadResult.height ??
                null,

            format:
                uploadResult.format ??
                null,

            bytes:
                uploadResult.bytes ??
                null,

            folder:
                CONTRIBUTOR_FOLDER,

            resourceType:
                uploadResult.resource_type ??
                "image",

            /*
             * Contributor workflow:
             *
             * pending
             *     ↓
             * Admin review
             *     ↓
             * approved / rejected
             */
            status:
                "pending",

            /*
             * Created only after admin
             * approves the photo.
             */
            galleryId:
                null,

            /*
             * View count is NOT stored separately
             * here.
             *
             * It will come from:
             * gallery/{galleryId}.viewCount
             */
            createdAt:
                FieldValue.serverTimestamp(),

            updatedAt:
                FieldValue.serverTimestamp(),

            reviewedAt:
                null,

            reviewedBy:
                null,

            rejectionReason:
                null,
        });

        /*
         * Firestore succeeded.
         * Do not delete Cloudinary image.
         */
        uploadedPublicId =
            null;

        return NextResponse.json(
            {
                success: true,

                message:
                    "Photo submitted successfully. It is waiting for admin review.",

                photo: {
                    id:
                        photoRef.id,

                    title,

                    description,

                    url:
                        uploadResult.secure_url,

                    publicId:
                        uploadResult.public_id,

                    status:
                        "pending",

                    viewCount:
                        0,
                },
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "Contributor photo upload error:",
            error,
        );

        /*
         * If Cloudinary succeeded but
         * Firestore failed, remove the
         * Cloudinary asset.
         */
        if (
            uploadedPublicId
        ) {
            try {
                await cloudinary
                    .uploader
                    .destroy(
                        uploadedPublicId,
                        {
                            resource_type:
                                "image",
                        },
                    );
            } catch (
                cleanupError
            ) {
                console.error(
                    "Contributor Cloudinary cleanup error:",
                    cleanupError,
                );
            }
        }

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to submit photo.",
            },
            {
                status: 400,
            },
        );
    }
}

/* -------------------------------------------------------
 * PATCH
 *
 * Update title + description only.
 *
 * Image cannot be replaced.
 *
 * If approved:
 *   contributorPhotos is updated
 *   gallery document is also updated
 * ----------------------------------------------------- */

export async function PATCH(
    request: NextRequest,
) {
    try {
        const user =
            await getAuthenticatedUser(
                request,
            );

        const body =
            await request.json();

        const id =
            typeof body.id === "string"
                ? body.id.trim()
                : "";

        const title =
            typeof body.title === "string"
                ? body.title.trim()
                : "";

        const description =
            typeof body.description ===
            "string"
                ? body.description.trim()
                : "";

        if (!id) {
            return NextResponse.json(
                {
                    error:
                        "Photo ID is required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (!title) {
            return NextResponse.json(
                {
                    error:
                        "Photo title is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const photoRef =
            adminDb
                .collection(
                    CONTRIBUTOR_PHOTOS_COLLECTION,
                )
                .doc(id);

        const photoSnapshot =
            await photoRef.get();

        if (
            !photoSnapshot.exists
        ) {
            return NextResponse.json(
                {
                    error:
                        "Photo not found.",
                },
                {
                    status: 404,
                },
            );
        }

        const photo =
            photoSnapshot.data();

        /*
         * SECURITY:
         * Contributor can update only
         * their own photo.
         */
        if (
            !photo ||
            photo.uid !== user.uid
        ) {
            return NextResponse.json(
                {
                    error:
                        "You are not allowed to update this photo.",
                },
                {
                    status: 403,
                },
            );
        }

        const now =
            FieldValue.serverTimestamp();

        await photoRef.update({
            title,

            description,

            updatedAt:
                now,
        });

        /*
         * If approved, synchronize the
         * public gallery document.
         */
        if (
            photo.status ===
                "approved" &&
            photo.galleryId
        ) {
            const galleryRef =
                adminDb
                    .collection(
                        GALLERY_COLLECTION,
                    )
                    .doc(
                        photo.galleryId,
                    );

            const gallerySnapshot =
                await galleryRef.get();

            if (
                gallerySnapshot.exists
            ) {
                await galleryRef.update({
                    title,

                    description,

                    updatedAt:
                        now,
                });

                revalidateTag(
                    GALLERY_CACHE_TAG,
                    "max",
                );
            }
        }

        return NextResponse.json({
            success: true,

            message:
                "Photo updated successfully.",
        });
    } catch (error) {
        console.error(
            "Contributor photo PATCH error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to update photo.",
            },
            {
                status: 400,
            },
        );
    }
}

/* -------------------------------------------------------
 * DELETE
 *
 * Delete only the contributor's own photo.
 *
 * Pending:
 *   Delete contributorPhotos record.
 *
 * Rejected:
 *   Delete contributorPhotos record.
 *
 * Approved:
 *   Delete public gallery record
 *   Delete contributorPhotos record
 *
 * Cloudinary image is intentionally kept.
 * ----------------------------------------------------- */

export async function DELETE(
    request: NextRequest,
) {
    try {
        const user =
            await getAuthenticatedUser(
                request,
            );

        const body =
            await request.json();

        const id =
            typeof body.id === "string"
                ? body.id.trim()
                : "";

        if (!id) {
            return NextResponse.json(
                {
                    error:
                        "Photo ID is required.",
                },
                {
                    status: 400,
                },
            );
        }

        const photoRef =
            adminDb
                .collection(
                    CONTRIBUTOR_PHOTOS_COLLECTION,
                )
                .doc(id);

        const photoSnapshot =
            await photoRef.get();

        if (
            !photoSnapshot.exists
        ) {
            return NextResponse.json(
                {
                    error:
                        "Photo not found.",
                },
                {
                    status: 404,
                },
            );
        }

        const photo =
            photoSnapshot.data();

        /*
         * SECURITY:
         * Contributor can delete only
         * their own photo.
         */
        if (
            !photo ||
            photo.uid !== user.uid
        ) {
            return NextResponse.json(
                {
                    error:
                        "You are not allowed to delete this photo.",
                },
                {
                    status: 403,
                },
            );
        }

        /*
         * If approved, remove the
         * corresponding public gallery
         * document.
         */
        if (
            photo.status ===
                "approved" &&
            photo.galleryId
        ) {
            const galleryRef =
                adminDb
                    .collection(
                        GALLERY_COLLECTION,
                    )
                    .doc(
                        photo.galleryId,
                    );

            const gallerySnapshot =
                await galleryRef.get();

            if (
                gallerySnapshot.exists
            ) {
                await galleryRef.delete();
            }

            /*
             * Refresh public gallery cache.
             */
            revalidateTag(
                GALLERY_CACHE_TAG,
                "max",
            );
        }

        /*
         * Delete contributor submission.
         */
        await photoRef.delete();

        /*
         * IMPORTANT:
         *
         * Cloudinary asset is intentionally
         * NOT deleted.
         */
        return NextResponse.json({
            success: true,

            message:
                "Photo deleted successfully.",
        });
    } catch (error) {
        console.error(
            "Contributor photo DELETE error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to delete photo.",
            },
            {
                status: 400,
            },
        );
    }
}