"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    ImageIcon,
    Loader2,
    XCircle,
} from "lucide-react";

import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";

type ContributorPhotoStatus =
    | "pending"
    | "approved"
    | "rejected";

type ContributorPhoto = {
    id: string;
    title: string;
    description?: string;
    url: string;
    status: ContributorPhotoStatus;
    rejectionReason?: string;

    // Approved contributor photo's public gallery document
    galleryId?: string | null;

    // Same view count as Public Gallery
    viewCount?: number;

    createdAt?: unknown;
    updatedAt?: unknown;
};

function formatDate(
    value: unknown,
    fallback: string
) {
    if (!value) return fallback;

    try {
        if (
            typeof value === "object" &&
            value !== null &&
            "seconds" in value
        ) {
            const seconds = Number(
                (value as { seconds?: number }).seconds
            );

            if (!Number.isNaN(seconds)) {
                return new Date(
                    seconds * 1000
                ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
            }
        }

        const date = new Date(
            value as string | number | Date
        );

        if (Number.isNaN(date.getTime())) {
            return fallback;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return fallback;
    }
}

function StatusBadge({
    status,
    pendingLabel,
    approvedLabel,
    rejectedLabel,
}: {
    status: ContributorPhotoStatus;
    pendingLabel: string;
    approvedLabel: string;
    rejectedLabel: string;
}) {
    if (status === "pending") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dbc58d] bg-[#f8efd7] px-2.5 py-1 text-xs font-semibold text-[#8a6418] dark:border-[#66552f] dark:bg-[#3a3323] dark:text-[#e0c77c]">
                <Clock3 className="h-3.5 w-3.5" />
                {pendingLabel}
            </span>
        );
    }

    if (status === "approved") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8cba4] bg-[#e7efdf] px-2.5 py-1 text-xs font-semibold text-[#52643d] dark:border-[#536447] dark:bg-[#2d3828] dark:text-[#b9d39c]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {approvedLabel}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9aaa4] bg-[#f6e3e0] px-2.5 py-1 text-xs font-semibold text-[#762f2f] dark:border-[#68413c] dark:bg-[#382624] dark:text-[#e3aaa3]">
            <XCircle className="h-3.5 w-3.5" />
            {rejectedLabel}
        </span>
    );
}

function StatCard({
    label,
    count,
    icon: Icon,
    iconClassName,
    iconBackground,
}: {
    label: string;
    count: number;
    icon: typeof Clock3;
    iconClassName: string;
    iconBackground: string;
}) {
    return (
        <div className="border border-[#d8c9a8] bg-[#fffaf1] p-4 shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#b9a897]">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#4b2823] dark:text-[#f3dfbc]">
                        {count}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center ${iconBackground}`}
                >
                    <Icon
                        className={`h-5 w-5 ${iconClassName}`}
                    />
                </div>
            </div>
        </div>
    );
}

function ViewCount({
    count,
    viewLabel,
    viewsLabel,
}: {
    count: number;
    viewLabel: string;
    viewsLabel: string;
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d8c9a8] bg-[#fffaf1] px-2.5 py-1 text-xs font-semibold text-[#6f5d4d] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#c9bca9]">
            <Eye className="h-3.5 w-3.5" />
            {count}{" "}
            {count === 1 ? viewLabel : viewsLabel}
        </span>
    );
}

function SubmissionCard({
    photo,
    t,
}: {
    photo: ContributorPhoto;
    t: ReturnType<
        typeof useTranslations<"contributorSubmissions">
    >;
}) {
    const isApproved =
        photo.status === "approved";

    return (
        <article className="overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative aspect-video w-full shrink-0 bg-[#eee5d4] dark:bg-[#211a17] sm:aspect-square sm:w-52">
                    <img
                        src={photo.url}
                        alt={
                            photo.title ||
                            t("submittedPhoto")
                        }
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />

                    <div className="absolute left-3 top-3">
                        <StatusBadge
                            status={photo.status}
                            pendingLabel={t("pending")}
                            approvedLabel={t("approved")}
                            rejectedLabel={t("rejected")}
                        />
                    </div>

                    {/* View count on image */}
                    {isApproved && (
                        <div className="absolute bottom-3 right-3">
                            <ViewCount
                                count={
                                    typeof photo.viewCount ===
                                    "number"
                                        ? photo.viewCount
                                        : 0
                                }
                                viewLabel={t("view")}
                                viewsLabel={t("views")}
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <h3 className="line-clamp-2 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                {photo.title ||
                                    t("untitledPhoto")}
                            </h3>

                            <div className="mt-2 flex items-center gap-2 text-xs text-[#8b765f] dark:text-[#b9a897]">
                                <CalendarDays className="h-3.5 w-3.5 shrink-0" />

                                <span>
                                    {t("submitted")}{" "}
                                    {formatDate(
                                        photo.createdAt,
                                        t("dateUnavailable")
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            {isApproved && (
                                <ViewCount
                                    count={
                                        typeof photo.viewCount ===
                                        "number"
                                            ? photo.viewCount
                                            : 0
                                    }
                                    viewLabel={t("view")}
                                    viewsLabel={t("views")}
                                />
                            )}

                            <div className="hidden sm:block">
                                <StatusBadge
                                    status={photo.status}
                                    pendingLabel={t("pending")}
                                    approvedLabel={t("approved")}
                                    rejectedLabel={t("rejected")}
                                />
                            </div>
                        </div>
                    </div>

                    {photo.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#65584e] dark:text-[#c9bca9]">
                            {photo.description}
                        </p>
                    )}

                    {/* Status panel */}
                    <div className="mt-4 border border-[#d8c9a8] bg-[#f7f0e2] p-4 dark:border-[#4a3c34] dark:bg-[#241b18]">
                        {photo.status === "pending" && (
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f5e8c5] text-[#a66b00] dark:bg-[#3a3323] dark:text-[#e0c77c]">
                                    <Clock3 className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                        {t(
                                            "waitingForAdminReview"
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-[#65584e] dark:text-[#b9a897]">
                                        {t(
                                            "photoSubmittedSuccessfully"
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {photo.status === "approved" && (
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#dfe8d2] text-[#52643d] dark:bg-[#2d3828] dark:text-[#b9d39c]">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                            {t(
                                                "publishedInPublicGallery"
                                            )}
                                        </p>

                                        <ViewCount
                                            count={
                                                typeof photo.viewCount ===
                                                "number"
                                                    ? photo.viewCount
                                                    : 0
                                            }
                                            viewLabel={t("view")}
                                            viewsLabel={t("views")}
                                        />
                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-[#65584e] dark:text-[#b9a897]">
                                        {t(
                                            "photoApprovedAndAvailable"
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {photo.status === "rejected" && (
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f0d9d5] text-[#762f2f] dark:bg-[#382624] dark:text-[#e3aaa3]">
                                    <XCircle className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                        {t(
                                            "photoWasRejected"
                                        )}
                                    </p>

                                    {photo.rejectionReason ? (
                                        <p className="mt-1 text-xs leading-5 text-[#65584e] dark:text-[#b9a897]">
                                            <span className="font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {t("reason")}
                                            </span>{" "}
                                            {
                                                photo.rejectionReason
                                            }
                                        </p>
                                    ) : (
                                        <p className="mt-1 text-xs leading-5 text-[#65584e] dark:text-[#b9a897]">
                                            {t(
                                                "noRejectionReason"
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

function SubmissionsPageContent() {
    const t =
        useTranslations("contributorSubmissions");

    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const locale =
        typeof params.locale === "string"
            ? params.locale
            : "en";

    const [photos, setPhotos] = useState<
        ContributorPhoto[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] = useState("");

    const loadSubmissions = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const token =
                await user.getIdToken();

            const response = await fetch(
                "/api/contributors/photos",
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        "Unable to load submissions."
                );
            }

            setPhotos(
                Array.isArray(data.photos)
                    ? data.photos
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load contributor submissions:",
                err
            );

            setError(
                t("unableToLoadSubmissions")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadSubmissions();
    }, [user]);

    const pendingPhotos = useMemo(
        () =>
            photos.filter(
                (photo) =>
                    photo.status === "pending"
            ),
        [photos]
    );

    const approvedPhotos = useMemo(
        () =>
            photos.filter(
                (photo) =>
                    photo.status === "approved"
            ),
        [photos]
    );

    const rejectedPhotos = useMemo(
        () =>
            photos.filter(
                (photo) =>
                    photo.status === "rejected"
            ),
        [photos]
    );

    return (
        <main className="min-h-screen bg-[#fbf6eb] text-[#4b2823] dark:bg-[#1f1815] dark:text-[#f3dfbc]">
            {/* HEADER */}
            <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]">
                <div
                    className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                    aria-hidden="true"
                />

                <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/40 to-transparent dark:from-[#5a4030]/20"
                    aria-hidden="true"
                />

                <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/${locale}/dashboard`
                            )
                        }
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#762f2f] hover:underline dark:text-[#d8b56a]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("backToDashboard")}
                    </button>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#762f2f] text-[#f7e8c5] dark:bg-[#6b2b2b]">
                                <Clock3 className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b765f] dark:text-[#b9a897]">
                                    {t(
                                        "contributorDashboard"
                                    )}
                                </p>

                                <h1 className="mt-1 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                    {t(
                                        "mySubmissions"
                                    )}
                                </h1>

                                <p className="mt-1 text-sm text-[#65584e] dark:text-[#c9bca9]">
                                    {t(
                                        "trackReviewStatus"
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/${locale}/contributor/photos`
                                )
                            }
                            className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] transition-colors hover:bg-[#5f2525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:bg-[#d8b56a] dark:text-[#2a211d] dark:hover:bg-[#e7c77e]"
                        >
                            <ImageIcon className="h-4 w-4" />
                            {t("myPhotos")}
                        </button>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {error && (
                    <div className="mb-5 border border-[#d8aaa4] bg-[#f8e8e5] p-4 text-sm text-[#762f2f] dark:border-[#68413c] dark:bg-[#30211e] dark:text-[#e3a9a2]">
                        {error}
                    </div>
                )}

                {/* STATISTICS */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <StatCard
                        label={t("pending")}
                        count={
                            pendingPhotos.length
                        }
                        icon={Clock3}
                        iconClassName="text-[#a66b00]"
                        iconBackground="bg-[#f5e8c5]"
                    />

                    <StatCard
                        label={t("approved")}
                        count={
                            approvedPhotos.length
                        }
                        icon={CheckCircle2}
                        iconClassName="text-[#52643d]"
                        iconBackground="bg-[#dfe8d2]"
                    />

                    <StatCard
                        label={t("rejected")}
                        count={
                            rejectedPhotos.length
                        }
                        icon={XCircle}
                        iconClassName="text-[#762f2f]"
                        iconBackground="bg-[#f0d9d5]"
                    />
                </div>

                {/* REVIEW INFO */}
                <div className="mt-6 border border-[#d8c9a8] bg-[#f7f0e2] p-5 dark:border-[#4a3c34] dark:bg-[#241b18]">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#c29a52] text-[#fffaf1] dark:text-[#2a211d]">
                            <Clock3 className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                {t(
                                    "howPhotoReviewWorks"
                                )}
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                {t(
                                    "photoReviewExplanation"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="mt-6 flex min-h-64 items-center justify-center border border-[#d8c9a8] bg-[#fffaf1] dark:border-[#4a3c34] dark:bg-[#2a211d]">
                        <div className="flex items-center gap-3 text-sm text-[#8b765f] dark:text-[#b9a897]">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {t(
                                "loadingYourSubmissions"
                            )}
                        </div>
                    </div>
                )}

                {/* EMPTY */}
                {!loading &&
                    !error &&
                    photos.length === 0 && (
                        <div className="mt-6 border border-dashed border-[#d8c9a8] bg-[#fffaf1] px-5 py-14 text-center dark:border-[#4a3c34] dark:bg-[#2a211d]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#f0ded9] text-[#762f2f] dark:bg-[#382624] dark:text-[#d8b56a]">
                                <ImageIcon className="h-7 w-7" />
                            </div>

                            <h2 className="mt-4 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                {t(
                                    "noSubmissionsYet"
                                )}
                            </h2>

                            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                {t(
                                    "noSubmissionsDescription"
                                )}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/${locale}/contributor/photos`
                                    )
                                }
                                className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] hover:bg-[#5f2525]"
                            >
                                <ImageIcon className="h-4 w-4" />
                                {t(
                                    "goToMyPhotos"
                                )}
                            </button>
                        </div>
                    )}

                {/* SUBMISSIONS */}
                {!loading &&
                    !error &&
                    photos.length > 0 && (
                        <div className="mt-8 space-y-8">
                            {/* Pending */}
                            {pendingPhotos.length >
                                0 && (
                                <section>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center bg-[#f5e8c5] text-[#a66b00] dark:bg-[#3a3323] dark:text-[#e0c77c]">
                                            <Clock3 className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <h2 className="font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {t(
                                                    "pending"
                                                )}
                                            </h2>

                                            <p className="text-xs text-[#8b765f] dark:text-[#b9a897]">
                                                {t(
                                                    "waitingForAdmin"
                                                )}
                                            </p>
                                        </div>

                                        <span className="ml-auto rounded-full bg-[#f8efd7] px-2.5 py-1 text-xs font-semibold text-[#8a6418] dark:bg-[#3a3323] dark:text-[#e0c77c]">
                                            {
                                                pendingPhotos.length
                                            }
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {pendingPhotos.map(
                                            (
                                                photo
                                            ) => (
                                                <SubmissionCard
                                                    key={
                                                        photo.id
                                                    }
                                                    photo={
                                                        photo
                                                    }
                                                    t={
                                                        t
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Approved */}
                            {approvedPhotos.length >
                                0 && (
                                <section>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center bg-[#dfe8d2] text-[#52643d] dark:bg-[#2d3828] dark:text-[#b9d39c]">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <h2 className="font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {t(
                                                    "approved"
                                                )}
                                            </h2>

                                            <p className="text-xs text-[#8b765f] dark:text-[#b9a897]">
                                                {t(
                                                    "publishedInGallery"
                                                )}
                                            </p>
                                        </div>

                                        <span className="ml-auto rounded-full bg-[#e7efdf] px-2.5 py-1 text-xs font-semibold text-[#52643d] dark:bg-[#2d3828] dark:text-[#b9d39c]">
                                            {
                                                approvedPhotos.length
                                            }
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {approvedPhotos.map(
                                            (
                                                photo
                                            ) => (
                                                <SubmissionCard
                                                    key={
                                                        photo.id
                                                    }
                                                    photo={
                                                        photo
                                                    }
                                                    t={
                                                        t
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Rejected */}
                            {rejectedPhotos.length >
                                0 && (
                                <section>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center bg-[#f0d9d5] text-[#762f2f] dark:bg-[#382624] dark:text-[#e3aaa3]">
                                            <XCircle className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <h2 className="font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {t(
                                                    "rejected"
                                                )}
                                            </h2>

                                            <p className="text-xs text-[#8b765f] dark:text-[#b9a897]">
                                                {t(
                                                    "notApproved"
                                                )}
                                            </p>
                                        </div>

                                        <span className="ml-auto rounded-full bg-[#f6e3e0] px-2.5 py-1 text-xs font-semibold text-[#762f2f] dark:bg-[#382624] dark:text-[#e3aaa3]">
                                            {
                                                rejectedPhotos.length
                                            }
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {rejectedPhotos.map(
                                            (
                                                photo
                                            ) => (
                                                <SubmissionCard
                                                    key={
                                                        photo.id
                                                    }
                                                    photo={
                                                        photo
                                                    }
                                                    t={
                                                        t
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                {/* BOTTOM NAVIGATION */}
                <div className="mt-8 flex flex-col gap-3 border-t border-[#d8c9a8] pt-6 dark:border-[#4a3c34] sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/${locale}/dashboard`
                            )
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#d8c9a8] bg-[#fffaf1] px-5 text-sm font-semibold text-[#762f2f] transition hover:bg-[#f7f0e2] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#d8b56a] dark:hover:bg-[#241b18]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("backToDashboard")}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/${locale}/contributor/photos`
                            )
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] hover:bg-[#5f2525] dark:bg-[#d8b56a] dark:text-[#2a211d] dark:hover:bg-[#e7c77e]"
                    >
                        <ImageIcon className="h-4 w-4" />
                        {t("manageMyPhotos")}
                    </button>
                </div>
            </section>
        </main>
    );
}

export default function ContributorSubmissionsPage() {
    return (
        <RequireAuth>
            <SubmissionsPageContent />
        </RequireAuth>
    );
}