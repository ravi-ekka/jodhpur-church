import { NextResponse } from "next/server";

const ADMIN_API_URL = process.env.ADMIN_API_URL;
const PUBLIC_BLOG_API_KEY = process.env.PUBLIC_BLOG_API_KEY;

export async function GET() {
    try {
        if (!ADMIN_API_URL) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ADMIN_API_URL is not configured",
                },
                { status: 500 }
            );
        }

        if (!PUBLIC_BLOG_API_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: "PUBLIC_BLOG_API_KEY is not configured",
                },
                { status: 500 }
            );
        }

        const response = await fetch(
            `${ADMIN_API_URL}/api/public/blogger/posts`,
            {
                headers: {
                    "x-public-blog-key": PUBLIC_BLOG_API_KEY,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error(
                "Admin Blogger API error:",
                response.status,
                errorText
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to fetch Blogger posts",
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Public Blogger API error:", error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch Blogger posts",
            },
            { status: 500 }
        );
    }
}