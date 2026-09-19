"use client";

import { useEffect, useMemo, useState } from "react";
import {
    useParams,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useTranslations } from "next-intl";
import {
    ArrowLeft,
    Camera,
    CheckCircle2,
    Church,
    Clock3,
    ImageIcon,
    LogOut,
    Mail,
    ShieldCheck,
    UserRound,
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
    galleryId?: string | null;
    viewCount?: number;
    createdAt?: unknown;
    updatedAt?: unknown;
};

type UserProfile = {
    uid: string;
    email: string;
    displayName: string;
    roleId: string;
    active: boolean;
    contributor: boolean;
};

export default function Dashboard() {
    const t = useTranslations("dashboard");

    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const locale = params.locale as string;

    const { user, logout } = useAuth();

    const activeTab =
        searchParams.get("tab") === "profile"
            ? "profile"
            : "dashboard";

    const [profile, setProfile] =
        useState<UserProfile | null>(null);

    const [loadingProfile, setLoadingProfile] =
        useState(true);

    const [profileError, setProfileError] =
        useState("");

    const isContributor =
        profile?.contributor === true;

    const [photos, setPhotos] =
        useState<ContributorPhoto[]>([]);

    const [loadingPhotos, setLoadingPhotos] =
        useState(false);

    const [photoError, setPhotoError] =
        useState("");

    // ============================================================
    // LOAD FIRESTORE USER PROFILE
    // ============================================================

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoadingProfile(false);
            return;
        }

        let cancelled = false;

        const loadProfile = async () => {
            try {
                setLoadingProfile(true);
                setProfileError("");

                const token =
                    await user.getIdToken();

                const response =
                    await fetch(
                        "/api/auth/profile",
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
                            "Unable to load user profile."
                    );
                }

                if (!cancelled) {
                    setProfile(
                        data?.user ?? null
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load user profile:",
                    error
                );

                if (!cancelled) {
                    setProfile(null);

                    setProfileError(
                        error instanceof Error
                            ? error.message
                            : "Unable to load user profile."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingProfile(false);
                }
            }
        };

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, [user]);

    // ============================================================
    // TAB CHANGE
    // ============================================================

    const handleTabChange = (
        tab: "dashboard" | "profile"
    ) => {
        if (tab === "dashboard") {
            router.push(
                `/${locale}/dashboard`
            );
            return;
        }

        router.push(
            `/${locale}/dashboard?tab=profile`
        );
    };

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = async () => {
        try {
            await logout();

            router.push(`/${locale}`);
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
        }
    };

    // ============================================================
    // CONTRIBUTOR ACTIONS
    // ============================================================

    const handleUploadPhoto = () => {
        router.push(
            `/${locale}/contributor/photos`
        );
    };

    const handleMyPhotos = () => {
        router.push(
            `/${locale}/contributor/photos`
        );
    };

    const handleMySubmissions = () => {
        router.push(
            `/${locale}/contributor/submissions`
        );
    };

    // ============================================================
    // LOAD CONTRIBUTOR PHOTOS
    // ============================================================

    useEffect(() => {
        if (
            !user ||
            activeTab !== "dashboard" ||
            loadingProfile ||
            !isContributor
        ) {
            setPhotos([]);
            return;
        }

        let cancelled = false;

        const loadPhotos = async () => {
            try {
                setLoadingPhotos(true);
                setPhotoError("");

                const token =
                    await user.getIdToken();

                const response =
                    await fetch(
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
                            t(
                                "unableToLoadContributorPhotos"
                            )
                    );
                }

                if (!cancelled) {
                    setPhotos(
                        Array.isArray(
                            data.photos
                        )
                            ? data.photos
                            : []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load contributor photos:",
                    error
                );

                if (!cancelled) {
                    setPhotoError(
                        error instanceof Error
                            ? error.message
                            : t(
                                "unableToLoadContributorPhotos"
                            )
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingPhotos(false);
                }
            }
        };

        void loadPhotos();

        return () => {
            cancelled = true;
        };
    }, [
        user,
        activeTab,
        isContributor,
        loadingProfile,
        t,
    ]);

    const pendingCount = useMemo(
        () =>
            photos.filter(
                (photo) =>
                    photo.status === "pending"
            ).length,
        [photos]
    );

    const approvedCount = useMemo(
        () =>
            photos.filter(
                (photo) =>
                    photo.status === "approved"
            ).length,
        [photos]
    );

    const rejectedCount = useMemo(
        () =>
            photos.filter(
                (photo) =>
                    photo.status === "rejected"
            ).length,
        [photos]
    );

    return (
        <RequireAuth>
            <main className="min-h-screen bg-[#fbf6eb] text-[#4b2823] dark:bg-[#1f1815] dark:text-[#f3dfbc]">
                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]">
                    <div
                        className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                        aria-hidden="true"
                    />

                    <div
                        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/40 to-transparent dark:from-[#5a4030]/20"
                        aria-hidden="true"
                    />

                    <div className="relative mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#d8b56a] bg-[#762f2f] text-[#f7e8c5] dark:border-[#806334]">
                                <UserRound
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                                    Jodhpur Church
                                </p>

                                <h1 className="mt-1 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                    {activeTab ===
                                    "dashboard"
                                        ? t(
                                            "dashboard"
                                        )
                                        : t("title")}
                                </h1>

                                <p className="mt-1 text-xs leading-5 text-[#65584e] dark:text-[#c9bca9] sm:text-sm">
                                    {activeTab ===
                                    "dashboard"
                                        ? t(
                                            "manageAccount"
                                        )
                                        : t(
                                            "description"
                                        )}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    TABS
                ====================================================== */}

                <section className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 lg:px-8">
                    <div className="flex border-b border-[#d8c9a8] dark:border-[#4a3c34]">
                        <button
                            type="button"
                            onClick={() =>
                                handleTabChange(
                                    "dashboard"
                                )
                            }
                            className={`relative flex-1 px-4 py-3 text-sm font-semibold transition-colors sm:flex-none sm:min-w-32 ${
                                activeTab ===
                                "dashboard"
                                    ? "text-[#762f2f] dark:text-[#d8b56a]"
                                    : "text-[#8b765f] hover:text-[#4b2823] dark:text-[#b9a897] dark:hover:text-[#f3dfbc]"
                            }`}
                        >
                            {t("dashboard")}

                            {activeTab ===
                                "dashboard" && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#762f2f] dark:bg-[#d8b56a]" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleTabChange(
                                    "profile"
                                )
                            }
                            className={`relative flex-1 px-4 py-3 text-sm font-semibold transition-colors sm:flex-none sm:min-w-32 ${
                                activeTab ===
                                "profile"
                                    ? "text-[#762f2f] dark:text-[#d8b56a]"
                                    : "text-[#8b765f] hover:text-[#4b2823] dark:text-[#b9a897] dark:hover:text-[#f3dfbc]"
                            }`}
                        >
                            {t("profile")}

                            {activeTab ===
                                "profile" && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#762f2f] dark:bg-[#d8b56a]" />
                            )}
                        </button>
                    </div>
                </section>

                {/* =====================================================
                    DASHBOARD
                ====================================================== */}

                {activeTab ===
                    "dashboard" && (
                    <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                        {/* Welcome */}

                        <div className="overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
                            <div
                                className="h-1 bg-[#c29a52]"
                                aria-hidden="true"
                            />

                            <div className="p-5 sm:p-7">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#b9a897]">
                                        Jodhpur Church
                                    </p>

                                    <h2 className="mt-1 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                        {t(
                                            "welcome",
                                            {
                                                name:
                                                    profile?.displayName ||
                                                    user?.displayName ||
                                                    t(
                                                        "member"
                                                    ),
                                            }
                                        )}
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                        {t(
                                            "manageAccountContributions"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Loading */}

                        {loadingProfile && (
                            <div className="mt-5 border border-[#d8c9a8] bg-[#fffaf1] p-5 text-sm text-[#8b765f] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#b9a897]">
                                {t(
                                    "loadingContributorInformation"
                                )}
                            </div>
                        )}

                        {/* Profile Error */}

                        {!loadingProfile &&
                            profileError && (
                                <div className="mt-5 border border-[#d8aaa4] bg-[#f8e8e5] p-4 text-sm text-[#762f2f] dark:border-[#68413c] dark:bg-[#30211e] dark:text-[#e3a9a2]">
                                    {profileError}
                                </div>
                            )}

                        {/* =================================================
                            CONTRIBUTOR DASHBOARD
                        ================================================== */}

                        {!loadingProfile &&
                        isContributor ? (
                            <>
                                {/* Contributor Header */}

                                <div className="mt-5 overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
                                    <div
                                        className="h-1 bg-[#c29a52]"
                                        aria-hidden="true"
                                    />

                                    <div className="p-5 sm:p-7">
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#b9a897]">
                                                    {t(
                                                        "contributorDashboard"
                                                    )}
                                                </p>

                                                <h2 className="mt-1 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-2xl">
                                                    {t(
                                                        "shareChurchPhotos"
                                                    )}
                                                </h2>

                                                <p className="mt-1 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                                    {t(
                                                        "uploadPhotosForReview"
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleUploadPhoto
                                                }
                                                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] transition-colors hover:bg-[#5f2525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:bg-[#d8b56a] dark:text-[#2a211d] dark:hover:bg-[#e7c77e] dark:focus-visible:ring-offset-[#2a211d]"
                                            >
                                                <Camera
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />

                                                {t(
                                                    "uploadPhoto"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Cards */}

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <DashboardStatusCard
                                        icon={
                                            Clock3
                                        }
                                        label={t(
                                            "pending"
                                        )}
                                        count={
                                            pendingCount
                                        }
                                        iconClassName="text-[#a66b00]"
                                        iconBackground="bg-[#f5e8c5]"
                                    />

                                    <DashboardStatusCard
                                        icon={
                                            CheckCircle2
                                        }
                                        label={t(
                                            "approved"
                                        )}
                                        count={
                                            approvedCount
                                        }
                                        iconClassName="text-[#52643d]"
                                        iconBackground="bg-[#dfe8d2]"
                                    />

                                    <DashboardStatusCard
                                        icon={
                                            XCircle
                                        }
                                        label={t(
                                            "rejected"
                                        )}
                                        count={
                                            rejectedCount
                                        }
                                        iconClassName="text-[#762f2f]"
                                        iconBackground="bg-[#f0d9d5]"
                                    />
                                </div>

                                {/* Loading Photos */}

                                {loadingPhotos && (
                                    <div className="mt-5 border border-[#d8c9a8] bg-[#fffaf1] p-5 text-sm text-[#8b765f] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#b9a897]">
                                        {t(
                                            "loadingContributorInformation"
                                        )}
                                    </div>
                                )}

                                {/* Photo Error */}

                                {!loadingPhotos &&
                                    photoError && (
                                        <div className="mt-5 border border-[#d8aaa4] bg-[#f8e8e5] p-4 text-sm text-[#762f2f] dark:border-[#68413c] dark:bg-[#30211e] dark:text-[#e3a9a2]">
                                            {photoError}
                                        </div>
                                    )}

                                {/* Actions */}

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    {/* My Photos */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleMyPhotos
                                        }
                                        className="group border border-[#d8c9a8] bg-[#fffaf1] p-5 text-left shadow-sm transition hover:border-[#c29a52] hover:bg-[#fdf7ea] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:hover:border-[#806334] dark:hover:bg-[#30251f]"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#762f2f] text-[#f7e8c5] dark:bg-[#6b2b2b]">
                                                <ImageIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                    {t(
                                                        "myPhotos"
                                                    )}
                                                </h3>

                                                <p className="mt-1 text-sm leading-5 text-[#65584e] dark:text-[#c9bca9]">
                                                    {t(
                                                        "uploadUpdateManagePhotos"
                                                    )}
                                                </p>

                                                <span className="mt-3 inline-flex text-sm font-semibold text-[#762f2f] group-hover:underline dark:text-[#d8b56a]">
                                                    {t(
                                                        "openMyPhotos"
                                                    )}{" "}
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* My Submissions */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleMySubmissions
                                        }
                                        className="group border border-[#d8c9a8] bg-[#fffaf1] p-5 text-left shadow-sm transition hover:border-[#c29a52] hover:bg-[#fdf7ea] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:hover:border-[#806334] dark:hover:bg-[#30251f]"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#c29a52] text-[#fffaf1] dark:text-[#2a211d]">
                                                <Clock3
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                    {t(
                                                        "mySubmissions"
                                                    )}
                                                </h3>

                                                <p className="mt-1 text-sm leading-5 text-[#65584e] dark:text-[#c9bca9]">
                                                    {t(
                                                        "trackSubmissions"
                                                    )}
                                                </p>

                                                <span className="mt-3 inline-flex text-sm font-semibold text-[#762f2f] group-hover:underline dark:text-[#d8b56a]">
                                                    {t(
                                                        "viewSubmissions"
                                                    )}{" "}
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* Contributor Information */}

                                <div className="mt-5 border border-[#d8c9a8] bg-[#f7f0e2] p-5 dark:border-[#4a3c34] dark:bg-[#241b18]">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck
                                            className="mt-0.5 h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                            aria-hidden="true"
                                        />

                                        <div>
                                            <h3 className="text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {t(
                                                    "contributorAccess"
                                                )}
                                            </h3>

                                            <p className="mt-1 text-sm leading-5 text-[#65584e] dark:text-[#c9bca9]">
                                                {t(
                                                    "photosReviewedByAdmin"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            !loadingProfile && (
                                <div className="mt-5 border border-[#d8c9a8] bg-[#f7f0e2] p-5 dark:border-[#4a3c34] dark:bg-[#241b18] sm:p-6">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck
                                            className="mt-0.5 h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                            aria-hidden="true"
                                        />

                                        <div>
                                            <h3 className="text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {t(
                                                    "contributorAccess"
                                                )}
                                            </h3>

                                            <p className="mt-1 text-sm leading-5 text-[#65584e] dark:text-[#c9bca9]">
                                                {t(
                                                    "contributorAccessNotEnabled"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                        {/* Back Home */}

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/${locale}`
                                    )
                                }
                                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#d8c9a8] bg-[#fffaf1] px-4 text-sm font-semibold text-[#762f2f] transition-colors hover:bg-[#f7f0e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#d8b56a] dark:hover:bg-[#241b18] dark:focus-visible:ring-offset-[#1f1815]"
                            >
                                <ArrowLeft
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                {t(
                                    "backToHome"
                                )}
                            </button>
                        </div>
                    </section>
                )}

                {/* =====================================================
                    PROFILE
                ====================================================== */}

                {activeTab === "profile" && (
                    <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                        <div className="overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
                            <div
                                className="h-1 bg-[#c29a52]"
                                aria-hidden="true"
                            />

                            {/* Identity */}

                            <div className="border-b border-[#d8c9a8] p-5 dark:border-[#4a3c34] sm:p-7">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#c29a52] bg-[#762f2f] text-[#f7e8c5] dark:bg-[#6b2b2b]">
                                        <Church
                                            className="h-7 w-7"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="break-words font-serif text-xl font-semibold text-[#4b2823] [overflow-wrap:anywhere] dark:text-[#f3dfbc] sm:text-2xl">
                                            {profile?.displayName ||
                                                user?.displayName ||
                                                t(
                                                    "notAvailable"
                                                )}
                                        </h2>

                                        <p className="mt-1 break-words text-sm text-[#8b765f] [overflow-wrap:anywhere] dark:text-[#b9a897]">
                                            {profile?.email ||
                                                user?.email ||
                                                t(
                                                    "notAvailable"
                                                )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}

                            <div className="p-5 sm:p-7">
                                <div className="mb-5 flex items-center gap-3">
                                    <div
                                        className="h-px flex-1 bg-[#d8c9a8] dark:bg-[#4a3c34]"
                                        aria-hidden="true"
                                    />

                                    <h2 className="shrink-0 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                        {t(
                                            "accountInformation"
                                        )}
                                    </h2>

                                    <div
                                        className="h-px flex-1 bg-[#d8c9a8] dark:bg-[#4a3c34]"
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <ProfileInfo
                                        icon={
                                            UserRound
                                        }
                                        label={t(
                                            "name"
                                        )}
                                        value={
                                            profile?.displayName ||
                                            user?.displayName ||
                                            t(
                                                "notAvailable"
                                            )
                                        }
                                    />

                                    <ProfileInfo
                                        icon={Mail}
                                        label={t(
                                            "email"
                                        )}
                                        value={
                                            profile?.email ||
                                            user?.email ||
                                            t(
                                                "notAvailable"
                                            )
                                        }
                                    />

                                    <div className="min-w-0 border border-[#d8c9a8] bg-[#f7f0e2] p-4 dark:border-[#4a3c34] dark:bg-[#241b18] sm:col-span-2">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                                                    user?.emailVerified
                                                        ? "bg-[#5d6f45] text-[#f7f0e2]"
                                                        : "bg-[#762f2f] text-[#f7e8c5]"
                                                }`}
                                            >
                                                {user?.emailVerified ? (
                                                    <CheckCircle2
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <ShieldCheck
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#b9a897]">
                                                    {t(
                                                        "verification"
                                                    )}
                                                </p>

                                                <p
                                                    className={`mt-1 text-sm font-semibold ${
                                                        user?.emailVerified
                                                            ? "text-[#52643d] dark:text-[#a9c38a]"
                                                            : "text-[#762f2f] dark:text-[#d8b56a]"
                                                    }`}
                                                >
                                                    {user?.emailVerified
                                                        ? t(
                                                            "verified"
                                                        )
                                                        : t(
                                                            "notVerified"
                                                        )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout */}

                                <div className="mt-7 border-t border-[#d8c9a8] pt-6 dark:border-[#4a3c34]">
                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[#762f2f] bg-[#762f2f] px-5 text-sm font-semibold text-[#fffaf1] transition-colors hover:bg-[#5f2525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:border-[#8d403a] dark:bg-[#762f2f] dark:hover:bg-[#8b3939] dark:focus-visible:ring-offset-[#2a211d] sm:w-auto"
                                    >
                                        <LogOut
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />

                                        {t(
                                            "logout"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Back Home */}

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/${locale}`
                                    )
                                }
                                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#d8c9a8] bg-[#fffaf1] px-4 text-sm font-semibold text-[#762f2f] transition-colors hover:bg-[#f7f0e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#d8b56a] dark:hover:bg-[#241b18] dark:focus-visible:ring-offset-[#1f1815]"
                            >
                                <ArrowLeft
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                {t(
                                    "backToHome"
                                )}
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </RequireAuth>
    );
}

/* =========================================================
   DASHBOARD STATUS CARD
========================================================= */

function DashboardStatusCard({
    icon: Icon,
    label,
    count,
    iconClassName,
    iconBackground,
}: {
    icon: typeof Clock3;
    label: string;
    count: number;
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
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   PROFILE INFORMATION
========================================================= */

function ProfileInfo({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof UserRound;
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 border border-[#d8c9a8] bg-[#f7f0e2] p-4 dark:border-[#4a3c34] dark:bg-[#241b18]">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#762f2f] text-[#f7e8c5] dark:bg-[#6b2b2b]">
                    <Icon
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#b9a897]">
                        {label}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#4b2823] [overflow-wrap:anywhere] dark:text-[#f3dfbc]">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}