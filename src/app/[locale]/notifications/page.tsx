import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ShareButton from "@/components/common/ShareButton";
import NotificationAttachmentViewer from "@/components/notifications/NotificationAttachmentViewer";
import {
    Bell,
    CalendarDays,
    Pin,
    ArrowLeft,
} from "lucide-react";
import { getBaseUrl } from "@/lib/site-url";

type Attachment = {
    type: "image" | "pdf";
    url: string;
    publicId: string;
    fileName: string;
    resourceType: string;
};

type Notification = {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
    isPinned: boolean;
    attachment: Attachment | null;
    createdAt: string | null;
    updatedAt: string | null;
};

type Props = {
    params: Promise<{
        locale: string;
    }>;
};

async function getNotifications(): Promise<Notification[]> {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/notifications`, {
        next: {
            revalidate: 86400,
            tags: ["church-notifications"],
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch notifications");
    }

    const data: unknown = await response.json();

    if (
        typeof data === "object" &&
        data !== null &&
        "notifications" in data &&
        Array.isArray(data.notifications)
    ) {
        return data.notifications as Notification[];
    }

    return [];
}

function formatDate(date: string | null, locale: string) {
    if (!date) return "";

    return new Intl.DateTimeFormat(
        locale === "hi" ? "hi-IN" : "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    ).format(new Date(date));
}

export const instant = false;

export default async function NotificationsPage({
    params,
}: Props) {
    const { locale } = await params;

    const notifications = await getNotifications();
    const t = await getTranslations("notifications");

    return (
        <main className="min-h-screen bg-[#fbf6eb] dark:bg-[#1f1815]">
            {/* =========================================================
                PAGE HEADER
            ========================================================== */}
            <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]">
                <div
                    className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                    aria-hidden="true"
                />

                <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/40 to-transparent dark:from-[#5a4030]/20"
                    aria-hidden="true"
                />

                <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                    <div className="relative flex min-h-[110px] items-center justify-center">
                        <div className="min-w-0 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                                 {t("label")}
                            </p>

                            <h1 className="mt-1 flex items-center justify-center gap-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                <Bell
                                    className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a] sm:h-6 sm:w-6"
                                    aria-hidden="true"
                                />

                                <span>{t("title")}</span>
                            </h1>

                            <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-[#65584e] dark:text-[#c9bca9] sm:text-sm">
                                {t("subtitle")}
                            </p>
                        </div>
                    </div>

                    {/* SHARE */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-3 lg:right-2">
                        <ShareButton
                            title={t("shareTitle")}
                            text={t("shareDescription")}
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
                NOTIFICATIONS
            ========================================================== */}
            <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="mb-5 flex items-center gap-3">
                    <div
                        className="h-px flex-1 bg-[#d8c9a8] dark:bg-[#4a3c34]"
                        aria-hidden="true"
                    />

                    <h2 className="shrink-0 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                        {t("all")}
                    </h2>

                    <div
                        className="h-px flex-1 bg-[#d8c9a8] dark:bg-[#4a3c34]"
                        aria-hidden="true"
                    />
                </div>

                {notifications.length === 0 ? (
                    <div className="overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] px-5 py-12 text-center shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d] sm:px-8">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d8c9a8] bg-[#f7f0e2] text-[#762f2f] dark:border-[#5a483c] dark:bg-[#352923] dark:text-[#d8b56a]">
                            <Bell
                                className="h-6 w-6"
                                aria-hidden="true"
                            />
                        </div>

                        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                            {t("noNotifications")}
                        </p>

                        <Link
                            href={`/${locale}`}
                            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-[#762f2f] bg-[#762f2f] px-5 text-sm font-semibold text-[#fffaf1] transition-colors hover:bg-[#5f2525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:border-[#a9574f] dark:bg-[#762f2f] dark:hover:bg-[#8b3939] dark:focus-visible:ring-offset-[#1f1815]"
                        >
                            <ArrowLeft
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            {t("backHome")}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {notifications.map((notification) => (
                            <article
                                key={notification.id}
                                className={`group min-w-0 overflow-hidden border bg-[#fffaf1] shadow-sm transition-shadow hover:shadow-md dark:bg-[#2a211d] ${notification.isPinned
                                    ? "border-[#c29a52] dark:border-[#8f6c38]"
                                    : "border-[#d8c9a8] dark:border-[#4a3c34]"
                                    }`}
                            >
                                {/* Gold top line for pinned notifications */}
                                {notification.isPinned && (
                                    <div
                                        className="h-1 bg-[#c29a52]"
                                        aria-hidden="true"
                                    />
                                )}

                                <div className="min-w-0 p-5 sm:p-6">
                                    <div
                                        className={`grid min-w-0 gap-6 ${notification.attachment
                                            ? "md:grid-cols-[minmax(0,1fr)_220px]"
                                            : "grid-cols-1"
                                            } md:items-start`}
                                    >
                                        {/* =================================================
                                            TEXT
                                        ================================================== */}
                                        <div className="min-w-0">
                                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                {notification.isPinned && (
                                                    <span className="inline-flex min-h-7 max-w-full items-center gap-1.5 border border-[#d8b56a] bg-[#f4e6c8] px-2.5 py-1 text-[11px] font-semibold text-[#6f4b20] dark:border-[#806334] dark:bg-[#3c3022] dark:text-[#e0c17b]">
                                                        <Pin
                                                            className="h-3 w-3 shrink-0"
                                                            aria-hidden="true"
                                                        />

                                                        <span className="break-words">
                                                            {t("pinned")}
                                                        </span>
                                                    </span>
                                                )}

                                                {notification.createdAt && (
                                                    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-xs text-[#8b765f] dark:text-[#b9a897]">
                                                        <CalendarDays
                                                            className="h-3.5 w-3.5 shrink-0 text-[#9a7740] dark:text-[#c29a52]"
                                                            aria-hidden="true"
                                                        />

                                                        <span className="break-words [overflow-wrap:anywhere]">
                                                            {formatDate(
                                                                notification.createdAt,
                                                                locale
                                                            )}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-3 min-w-0 break-words font-serif text-xl font-semibold leading-snug text-[#4b2823] [overflow-wrap:anywhere] dark:text-[#f3dfbc] sm:text-2xl">
                                                {notification.title}
                                            </h3>

                                            <div className="mt-3 min-w-0 whitespace-pre-wrap break-words text-justify text-sm leading-7 text-[#65584e] [overflow-wrap:anywhere] dark:text-[#c9bca9] sm:text-base">
                                                {notification.content}
                                            </div>
                                        </div>

                                        {/* =================================================
                                            ATTACHMENT
                                        ================================================== */}
                                        {notification.attachment && (
                                            <div className="min-w-0 w-full">
                                                <div className="border border-[#d8c9a8] bg-[#f7f0e2] p-2 dark:border-[#4a3c34] dark:bg-[#241b18]">
                                                    <NotificationAttachmentViewer
                                                        notificationId={
                                                            notification.id
                                                        }
                                                        type={
                                                            notification
                                                                .attachment
                                                                .type
                                                        }
                                                        fileName={
                                                            notification
                                                                .attachment
                                                                .fileName
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom decorative line */}
                                <div
                                    className="h-px bg-[#eadfc9] dark:bg-[#3d302a]"
                                    aria-hidden="true"
                                />
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}