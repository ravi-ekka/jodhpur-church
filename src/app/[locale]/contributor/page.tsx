"use client";

import { useEffect, useState } from "react";
import {
    Image as ImageIcon,
    LayoutDashboard,
    Loader2,
    Send,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";

type ContributorData = {
    active: boolean;
    contributor: boolean;
};

export default function ContributorPage() {
    return (
        <RequireAuth>
            <ContributorDashboard />
        </RequireAuth>
    );
}

function ContributorDashboard() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();

    const locale =
        typeof params.locale === "string"
            ? params.locale
            : "en";

    const [checking, setChecking] = useState(true);

    const [contributorData, setContributorData] =
        useState<ContributorData | null>(null);

    useEffect(() => {
        let mounted = true;

        async function checkContributorAccess() {
            if (!user) {
                return;
            }

            try {
                setChecking(true);

                const idToken =
                    await user.getIdToken();

                /*
                 * The contributor photos API already
                 * verifies:
                 *
                 * - authenticated user
                 * - active account
                 * - contributor === true
                 *
                 * We use its GET endpoint only to verify
                 * contributor access.
                 */
                const response = await fetch(
                    "/api/contributors/photos",
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${idToken}`,
                        },
                        cache: "no-store",
                    },
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.error ||
                            "You do not have Contributor access.",
                    );
                }

                if (!mounted) {
                    return;
                }

                setContributorData({
                    active: true,
                    contributor: true,
                });
            } catch (error) {
                console.error(
                    "Contributor dashboard access error:",
                    error,
                );

                if (mounted) {
                    router.replace(
                        `/${locale}/profile`,
                    );
                }
            } finally {
                if (mounted) {
                    setChecking(false);
                }
            }
        }

        void checkContributorAccess();

        return () => {
            mounted = false;
        };
    }, [user, locale, router]);

    if (
        checking ||
        !contributorData
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-[#762f2f]" />

                    <p className="text-sm text-muted-foreground">
                        Loading contributor dashboard...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* HEADER */}

                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-[#762f2f]">
                                <LayoutDashboard className="h-5 w-5" />

                                <span className="text-sm font-semibold uppercase tracking-wide">
                                    Contributor
                                </span>
                            </div>

                            <h1 className="font-serif text-3xl font-bold text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
                                Contributor Dashboard
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                Share your church photos
                                with the Jodhpur Church
                                community.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/${locale}/profile`,
                                )
                            }
                            className="inline-flex min-h-11 items-center justify-center border border-[#d8c9a8] bg-[#f7f0e2] px-5 text-sm font-semibold text-[#4b2823] transition-colors hover:bg-[#eee3cf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#f3dfbc] dark:hover:bg-[#30231f]"
                        >
                            Back to Profile
                        </button>
                    </div>
                </div>

                {/* CONTRIBUTOR STATUS */}

                <div className="mb-8 border border-[#5d6f45]/30 bg-[#5d6f45]/5 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#5d6f45]">
                                Contributor Access
                            </p>

                            <h2 className="mt-1 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                Active
                            </h2>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 border border-[#5d6f45]/30 bg-[#5d6f45]/10 px-3 py-2 text-sm font-medium text-[#52643d] dark:text-[#a9c38a]">
                            <span className="h-2 w-2 rounded-full bg-[#5d6f45]" />

                            Contributor access enabled
                        </div>
                    </div>
                </div>

                {/* DASHBOARD CARDS */}

                <div className="grid gap-5 sm:grid-cols-2">
                    <DashboardCard
                        icon={ImageIcon}
                        title="My Photos"
                        description="Upload and manage the church photos you have submitted."
                        onClick={() =>
                            router.push(
                                `/${locale}/contributor/photos`,
                            )
                        }
                    />

                    <DashboardCard
                        icon={Send}
                        title="My Submissions"
                        description="Track the review status of your submitted photos."
                        onClick={() =>
                            router.push(
                                `/${locale}/contributor/submissions`,
                            )
                        }
                    />
                </div>

                {/* CONTRIBUTOR INFORMATION */}

                <div className="mt-8 border border-[#d8c9a8] bg-[#f7f0e2] p-6 dark:border-[#4a3c34] dark:bg-[#241b18]">
                    <h2 className="font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                        Your Contributor Workspace
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                        Upload photos from church
                        services, events,
                        celebrations, and other
                        church activities. Every
                        photo will be reviewed by
                        church administrators
                        before it appears in the
                        public gallery.
                    </p>
                </div>
            </div>
        </main>
    );
}

function DashboardCard({
    icon: Icon,
    title,
    description,
    onClick,
}: {
    icon: typeof ImageIcon;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group border border-[#d8c9a8] bg-[#f7f0e2] p-5 text-left transition-colors hover:border-[#762f2f] hover:bg-[#eee3cf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:border-[#4a3c34] dark:bg-[#241b18] dark:hover:border-[#762f2f] dark:hover:bg-[#30231f]"
        >
            <div className="flex h-11 w-11 items-center justify-center bg-[#762f2f] text-[#f7e8c5]">
                <Icon
                    className="h-5 w-5"
                    aria-hidden="true"
                />
            </div>

            <h3 className="mt-5 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                {description}
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-[#762f2f] dark:text-[#d8b56a]">
                Open →
            </span>
        </button>
    );
}