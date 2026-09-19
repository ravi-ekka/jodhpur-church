import { NextResponse } from "next/server";

import { getPublicMembers } from "@/lib/members/members";

export async function GET() {
    try {
        const members = await getPublicMembers();

        return NextResponse.json({
            success: true,
            members,
        });
    } catch (error) {
        console.error("PUBLIC MEMBERS API ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch members",
            },
            { status: 500 }
        );
    }
}