import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

const MAX_PHOTOS = 100;
const MAX_VIDEOS = 50;

type GalleryPhoto = {
    id: string;
    type: "photo";
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    width: number | null;
    height: number | null;
    createdAt: string | null;

    // Used by the public Gallery page
    // to separate official photos from
    // approved contributor photos.
    source: string | null;

    // Number of times this photo has been opened/viewed.
    // Old gallery documents without this field return 0.
    viewCount: number;
};

type GalleryVideo = {
    id: string;
    type: "video";
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string | null;
    duration: string | null;
    viewCount: string | null;
    likeCount: string | null;
    commentCount: string | null;
    liveBroadcastContent: string | null;
};

type YouTubeSearchItem = {
    id?: {
        videoId?: string;
    };
};

type YouTubeSearchResponse = {
    items?: YouTubeSearchItem[];
};

type YouTubeVideoItem = {
    id?: string;

    snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;

        thumbnails?: {
            high?: {
                url?: string;
            };

            medium?: {
                url?: string;
            };

            default?: {
                url?: string;
            };
        };

        liveBroadcastContent?: string;
    };

    contentDetails?: {
        duration?: string;
    };

    statistics?: {
        viewCount?: string;
        likeCount?: string;
        commentCount?: string;
    };

    status?: {
        privacyStatus?: string;
    };
};

type YouTubeVideosResponse = {
    items?: YouTubeVideoItem[];
};

function timestampToISOString(
    value: unknown,
): string | null {
    if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (
            value as {
                toDate?: unknown;
            }
        ).toDate === "function"
    ) {
        return (
            value as {
                toDate: () => Date;
            }
        )
            .toDate()
            .toISOString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === "string") {
        return value;
    }

    return null;
}

function getViewCount(
    value: unknown,
): number {
    if (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
}

export async function GET() {
    try {
        /*
         * --------------------------------------------------------
         * LOAD PHOTOS FROM FIRESTORE
         * --------------------------------------------------------
         */

        const photoSnapshot =
            await adminDb
                .collection("gallery")
                .orderBy(
                    "createdAt",
                    "desc",
                )
                .limit(MAX_PHOTOS)
                .get();

        const photos: GalleryPhoto[] =
            photoSnapshot.docs.map(
                (doc) => {
                    const data =
                        doc.data();

                    return {
                        id: doc.id,

                        type: "photo",

                        title:
                            typeof data.title ===
                            "string"
                                ? data.title
                                : "",

                        description:
                            typeof data.description ===
                            "string"
                                ? data.description
                                : "",

                        url:
                            typeof data.url ===
                            "string"
                                ? data.url
                                : "",

                        thumbnail:
                            typeof data.url ===
                            "string"
                                ? data.url
                                : "",

                        width:
                            typeof data.width ===
                            "number"
                                ? data.width
                                : null,

                        height:
                            typeof data.height ===
                            "number"
                                ? data.height
                                : null,

                        createdAt:
                            timestampToISOString(
                                data.createdAt,
                            ),

                        /*
                         * ------------------------------------------------
                         * PHOTO SOURCE
                         * ------------------------------------------------
                         *
                         * Contributor photos approved by admin have:
                         *
                         * source: "contributor"
                         *
                         * Official church photos normally have no
                         * source field.
                         */

                        source:
                            typeof data.source ===
                            "string"
                                ? data.source
                                : null,

                        /*
                         * ------------------------------------------------
                         * PHOTO VIEW COUNT
                         * ------------------------------------------------
                         *
                         * New photos start with viewCount: 0.
                         *
                         * Existing/old gallery documents may not have
                         * this field, so they safely return 0.
                         */

                        viewCount:
                            getViewCount(
                                data.viewCount,
                            ),
                    };
                },
            );

        /*
         * --------------------------------------------------------
         * LOAD PUBLIC YOUTUBE VIDEOS
         * --------------------------------------------------------
         */

        let videos: GalleryVideo[] =
            [];

        if (
            YOUTUBE_API_KEY &&
            YOUTUBE_CHANNEL_ID
        ) {
            const playlistUrl =
                new URL(
                    "https://www.googleapis.com/youtube/v3/search",
                );

            playlistUrl.searchParams.set(
                "part",
                "snippet",
            );

            playlistUrl.searchParams.set(
                "channelId",
                YOUTUBE_CHANNEL_ID,
            );

            playlistUrl.searchParams.set(
                "maxResults",
                String(MAX_VIDEOS),
            );

            playlistUrl.searchParams.set(
                "order",
                "date",
            );

            playlistUrl.searchParams.set(
                "type",
                "video",
            );

            playlistUrl.searchParams.set(
                "key",
                YOUTUBE_API_KEY,
            );

            const searchResponse =
                await fetch(
                    playlistUrl.toString(),
                    {
                        cache: "no-store",
                    },
                );

            if (!searchResponse.ok) {
                throw new Error(
                    `YouTube search request failed: ${searchResponse.status}`,
                );
            }

            const searchData =
                (await searchResponse.json()) as YouTubeSearchResponse;

            const videoIds: string[] =
                searchData.items
                    ?.map(
                        (item) =>
                            item.id
                                ?.videoId,
                    )
                    .filter(
                        (
                            id,
                        ): id is string =>
                            typeof id ===
                                "string" &&
                            id.length > 0,
                    ) ?? [];

            if (
                videoIds.length > 0
            ) {
                const videosUrl =
                    new URL(
                        "https://www.googleapis.com/youtube/v3/videos",
                    );

                videosUrl.searchParams.set(
                    "part",
                    "snippet,contentDetails,statistics,status",
                );

                videosUrl.searchParams.set(
                    "id",
                    videoIds.join(","),
                );

                videosUrl.searchParams.set(
                    "key",
                    YOUTUBE_API_KEY,
                );

                const videosResponse =
                    await fetch(
                        videosUrl.toString(),
                        {
                            cache: "no-store",
                        },
                    );

                if (
                    !videosResponse.ok
                ) {
                    throw new Error(
                        `YouTube videos request failed: ${videosResponse.status}`,
                    );
                }

                const videosData =
                    (await videosResponse.json()) as YouTubeVideosResponse;

                videos =
                    videosData.items
                        ?.filter(
                            (video) =>
                                video
                                    .status
                                    ?.privacyStatus ===
                                "public",
                        )
                        .map(
                            (
                                video,
                            ): GalleryVideo => ({
                                id:
                                    video.id ??
                                    "",

                                type: "video",

                                title:
                                    video
                                        .snippet
                                        ?.title ??
                                    "",

                                description:
                                    video
                                        .snippet
                                        ?.description ??
                                    "",

                                thumbnail:
                                    video
                                        .snippet
                                        ?.thumbnails
                                        ?.high
                                        ?.url ??
                                    video
                                        .snippet
                                        ?.thumbnails
                                        ?.medium
                                        ?.url ??
                                    video
                                        .snippet
                                        ?.thumbnails
                                        ?.default
                                        ?.url ??
                                    "",

                                publishedAt:
                                    video
                                        .snippet
                                        ?.publishedAt ??
                                    null,

                                duration:
                                    video
                                        .contentDetails
                                        ?.duration ??
                                    null,

                                /*
                                 * YouTube's own view count.
                                 */
                                viewCount:
                                    video
                                        .statistics
                                        ?.viewCount ??
                                    null,

                                likeCount:
                                    video
                                        .statistics
                                        ?.likeCount ??
                                    null,

                                commentCount:
                                    video
                                        .statistics
                                        ?.commentCount ??
                                    null,

                                liveBroadcastContent:
                                    video
                                        .snippet
                                        ?.liveBroadcastContent ??
                                    null,
                            }),
                        ) ?? [];
            }
        }

        /*
         * --------------------------------------------------------
         * COMBINE MEDIA
         * --------------------------------------------------------
         */

        const media = [
            ...photos,
            ...videos,
        ];

        return NextResponse.json({
            success: true,
            photos,
            videos,
            media,
        });
    } catch (error) {
        console.error(
            "Public gallery API error:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error: "Failed to load gallery",
                photos: [],
                videos: [],
                media: [],
            },
            {
                status: 500,
            },
        );
    }
}