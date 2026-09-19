import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
    
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

const ALLOWED_TAGS = new Set([
    "church-sermons",
    "church-notifications",
    "church-events",
    "church-gallery",
    "blogger-posts",
    "church-slider",
    "church-members",
    "church-settings",
]);

export async function POST(request: NextRequest) {
    try {
        if (!REVALIDATION_SECRET) {
            console.error("REVALIDATION_SECRET is not configured");

            return NextResponse.json(
                {
                    success: false,
                    error: "Revalidation is not configured",
                },
                { status: 500 }
            );
        }

        const authorization =
            request.headers.get("authorization");

        const expectedAuthorization =
            `Bearer ${REVALIDATION_SECRET}`;

        if (authorization !== expectedAuthorization) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const tag = body?.tag;

        if (typeof tag !== "string" || !ALLOWED_TAGS.has(tag)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid cache tag",
                },
                { status: 400 }
            );
        }

        revalidateTag(tag, "max");

        return NextResponse.json({
            success: true,
            tag,
        });
    } catch (error) {
        console.error("PUBLIC REVALIDATION ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 }
        );
    }
}