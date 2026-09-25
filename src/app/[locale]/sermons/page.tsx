
import { getTranslations } from "next-intl/server";
import { getBaseUrl } from "@/lib/site-url";
import ShareButton from "@/components/common/ShareButton";
import {
    CalendarDays,
    Mic2,
    Play,
    Video,
} from "lucide-react";
import MarkNotificationsSeen from "@/components/notifications/MarkNotificationsSeen";

type Sermon = {
    id: string;
    title: string;
    description: string;
    preacher: string;
    sermonDate: string | null;
    youtubeUrl: string;
    imageUrl: string | null;
};

type SermonsResponse = {
    success: boolean;
    sermons: Sermon[];
};

type PageProps = {
    params: Promise<{
        locale: string;
    }>;
};

function getYouTubeEmbedUrl(url: string): string | null {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.toLowerCase();

        // youtu.be/VIDEO_ID
        if (hostname === "youtu.be") {
            const videoId = parsedUrl.pathname
                .replace(/^\/+/, "")
                .split("/")[0];

            return videoId
                ? `https://www.youtube.com/embed/${videoId}`
                : null;
        }

        // youtube.com/watch?v=VIDEO_ID
        if (
            hostname === "youtube.com" ||
            hostname === "www.youtube.com" ||
            hostname === "m.youtube.com" ||
            hostname === "youtube-nocookie.com" ||
            hostname === "www.youtube-nocookie.com"
        ) {
            const watchId = parsedUrl.searchParams.get("v");

            if (watchId) {
                return `https://www.youtube.com/embed/${watchId}`;
            }

            // youtube.com/embed/VIDEO_ID
            // youtube.com/shorts/VIDEO_ID
            const match = parsedUrl.pathname.match(
                /^\/+(?:embed|shorts)\/([^/?]+)/
            );

            if (match?.[1]) {
                return `https://www.youtube.com/embed/${match[1]}`;
            }
        }

        return null;
    } catch {
        return null;
    }
}

function formatDate(
    date: string | null,
    locale: string
): string {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    const localeMap: Record<string, string> = {
        en: "en-IN",
        hi: "hi-IN",
        kru: "en-IN",
    };

    return new Intl.DateTimeFormat(
        localeMap[locale] ?? "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    ).format(parsedDate);
}

export const instant = false;

export default async function SermonsPage({
    params,
}: PageProps) {
    const { locale } = await params;

    const t = await getTranslations("sermons");

    const baseUrl = await getBaseUrl();

    let sermons: Sermon[] = [];
    let error = false;

    try {
        const response = await fetch(
            `${baseUrl}/api/sermons`,
            {
                next: {
                    revalidate: 86400,
                    tags: ["church-sermons"],
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch sermons");
        }

        const data =
            (await response.json()) as SermonsResponse;

        if (!data.success) {
            throw new Error("Failed to fetch sermons");
        }

        sermons = data.sermons ?? [];
    } catch (fetchError) {
        console.error(
            "SERMONS PAGE ERROR:",
            fetchError
        );

        error = true;
    }

    return (
        <main className="min-h-screen bg-[#fbf6eb] dark:bg-[#1f1815]">
            <MarkNotificationsSeen
                section="sermons"
                ids={sermons.map(
                    (sermon) => sermon.id
                )}
            />
            {/* PAGE HEADER */}
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
                                {t("churchName")}
                            </p>

                            <h1 className="mt-1 flex items-center justify-center gap-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                <Mic2
                                    className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a] sm:h-6 sm:w-6"
                                    aria-hidden="true"
                                />

                                <span>{t("title")}</span>
                            </h1>

                            <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-[#65584e] dark:text-[#c9bca9] sm:text-sm">
                                {t("description")}
                            </p>
                        </div>

                        {/* Share button */}
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 sm:-right-3 lg:-right-6">
                            <ShareButton
                                title={t("title")}
                                text={t("description")}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {error ? (
                    <div className="mx-auto max-w-xl overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] text-center shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
                        <div
                            className="h-1 bg-[#762f2f]"
                            aria-hidden="true"
                        />

                        <div className="p-8">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#d8c9a8] bg-[#f7f0e2] text-[#762f2f] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#d8b56a]">
                                <Video
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="mt-4 text-sm leading-6 text-[#762f2f] dark:text-[#d8b56a]">
                                {t("loadError")}
                            </p>
                        </div>
                    </div>
                ) : sermons.length === 0 ? (
                    <div className="mx-auto max-w-xl overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] text-center shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
                        <div
                            className="h-1 bg-[#c29a52]"
                            aria-hidden="true"
                        />

                        <div className="p-10">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d8c9a8] bg-[#f7f0e2] text-[#762f2f] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#d8b56a]">
                                <Mic2
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="mt-4 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                {t("noSermons")}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
                        {sermons.map((sermon) => {
                            const embedUrl =
                                getYouTubeEmbedUrl(
                                    sermon.youtubeUrl
                                );

                            return (
                                <article
                                    key={sermon.id}
                                    className="group min-w-0 overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm transition-shadow hover:shadow-md dark:border-[#4a3c34] dark:bg-[#2a211d]"
                                >
                                    {/* MEDIA */}
                                    {embedUrl ? (
                                        <div className="relative aspect-video w-full overflow-hidden bg-[#1b1513]">
                                            <iframe
                                                src={embedUrl}
                                                title={sermon.title}
                                                className="absolute inset-0 h-full w-full border-0"
                                                loading="lazy"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />

                                            <div
                                                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1 bg-[#c29a52]"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    ) : sermon.imageUrl ? (
                                        <div className="relative aspect-video overflow-hidden bg-[#e8decb] dark:bg-[#1d1714]">
                                            <img
                                                src={sermon.imageUrl}
                                                alt={sermon.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                            />

                                            <div
                                                className="absolute inset-x-0 bottom-0 h-1 bg-[#c29a52]"
                                                aria-hidden="true"
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center bg-[#3b211d]/20">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8b56a] bg-[#762f2f]/90 text-[#f7e8c5]">
                                                    <Play
                                                        className="ml-0.5 h-5 w-5"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* DETAILS */}
                                    <div className="min-w-0 p-5 sm:p-6">
                                        <h2 className="min-w-0 break-words font-serif text-xl font-semibold leading-snug text-[#4b2823] [overflow-wrap:anywhere] dark:text-[#f3dfbc] sm:text-2xl">
                                            {sermon.title}
                                        </h2>

                                        <div className="mt-4 flex min-w-0 flex-wrap gap-x-5 gap-y-2 text-sm text-[#8b765f] dark:text-[#b9a897]">
                                            {sermon.preacher && (
                                                <div className="flex min-w-0 items-start gap-1.5">
                                                    <Mic2
                                                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                                        aria-hidden="true"
                                                    />

                                                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                                        {t("preacher")}:{" "}
                                                        {
                                                            sermon.preacher
                                                        }
                                                    </span>
                                                </div>
                                            )}

                                            {sermon.sermonDate && (
                                                <div className="flex min-w-0 items-start gap-1.5">
                                                    <CalendarDays
                                                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                                        aria-hidden="true"
                                                    />

                                                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                                        {formatDate(
                                                            sermon.sermonDate,
                                                            locale
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {sermon.description && (
                                            <p className="mt-4 min-w-0 line-clamp-4 break-words text-sm leading-6 text-[#65584e] [overflow-wrap:anywhere] dark:text-[#c9bca9]">
                                                {
                                                    sermon.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className="h-px bg-[#eadfc9] dark:bg-[#3d302a]"
                                        aria-hidden="true"
                                    />
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main >
    );
}

