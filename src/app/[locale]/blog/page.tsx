
import Link from "next/link";
import { BookOpen, CalendarDays, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getBaseUrl } from "@/lib/site-url";
import ShareButton from "@/components/common/ShareButton";
import MarkNotificationsSeen from "@/components/notifications/MarkNotificationsSeen";

type BlogPost = {
    id: string;
    title: string;
    content: string;
    url: string;
    published: string | null;
    updated: string | null;
    labels: string[];
    images: {
        url: string;
    }[];
};

type BlogResponse = {
    success: boolean;
    posts: BlogPost[];
    error?: string;
};
export const instant = false
async function getPosts(): Promise<BlogPost[]> {
    const baseUrl = await getBaseUrl();

    const response = await fetch(
        `${baseUrl}/api/blogger/posts`,
        {
            next: {
                revalidate: 604800,
                tags: ["blogger-posts"],
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
    }

    const data: BlogResponse = await response.json();

    if (!data.success) {
        throw new Error(
            data.error || "Failed to fetch blog posts"
        );
    }

    return data.posts;
}

function getExcerpt(html: string, length = 300) {
    const text = html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

    if (text.length <= length) {
        return text;
    }

    return `${text.slice(0, length).trim()}...`;
}

function formatDate(
    date: string | null,
    locale: string
) {
    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat(
        locale === "hi" ? "hi-IN" : "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    ).format(new Date(date));
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    const t = await getTranslations({
        locale,
        namespace: "blog",
    });

    const posts = await getPosts();

    return (
        <main className="min-h-screen bg-[#fffdf7] text-[#33251d] dark:bg-[#1b1513] dark:text-[#f5ead8]">
            <MarkNotificationsSeen
                section="blog"
                ids={posts.map(
                    (post) => post.id
                )}
            />
            {/* =====================================================
                PAGE HEADER
            ===================================================== */}


            <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]">
                {/* Gold top line */}
                <div
                    className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                    aria-hidden="true"
                />

                {/* Decorative background */}
                <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/40 to-transparent dark:from-[#5a4030]/20"
                    aria-hidden="true"
                />

                <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                    <div className="relative flex min-h-[110px] items-center justify-center">

                        {/* Centered Page Title */}
                        <div className="min-w-0 text-center">

                            {/* Label */}
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                                {t("label")}
                            </p>

                            {/* Icon + Title */}
                            <h1 className="mt-1 flex items-center justify-center gap-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                <BookOpen
                                    className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a] sm:h-6 sm:w-6"
                                    aria-hidden="true"
                                />

                                <span>{t("title")}</span>
                            </h1>

                            {/* Description */}
                            <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-[#65584e] dark:text-[#c9bca9] sm:text-sm">
                                {t("description")}
                            </p>

                        </div>

                        {/* Share Button */}
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 sm:-right-3 lg:-right-6">
                            <ShareButton
                                title={t("title")}
                                text={t("description")}
                            />
                        </div>

                    </div>
                </div>
            </section>



            {/* =====================================================
                BLOG POSTS
            ===================================================== */}

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

                {posts.length === 0 ? (
                    /* =================================================
                       EMPTY STATE
                    ================================================= */

                    <div className="mx-auto max-w-2xl border border-[#d8c9a8] bg-[#f7f0e2] px-6 py-12 text-center dark:border-[#4a3c34] dark:bg-[#241d19] sm:px-8">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c29a52]/50 bg-[#fffaf0] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
                            <BookOpen className="h-5 w-5" />
                        </div>

                        <h2 className="mt-4 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                            {t("noPosts")}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                            {t("noPostsDescription")}
                        </p>
                    </div>
                ) : (
                    /* =================================================
                       POSTS
                    ================================================= */

                    <div className="space-y-8">
                        {posts.map((post) => {
                            const image =
                                post.images?.[0]?.url;

                            return (
                                <article
                                    key={post.id}
                                    className="group overflow-hidden border border-[#d8c9a8] bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[#4a3c34] dark:bg-[#241d19]"
                                >
                                    <div className="flex flex-col md:flex-row">

                                        {/* =================================================
                                            IMAGE
                                        ================================================= */}

                                        {image && (
                                            <div className="relative w-full shrink-0 overflow-hidden bg-[#eee5d4] md:w-[320px] lg:w-[380px]">

                                                <img
                                                    src={image}
                                                    alt={post.title}
                                                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] md:h-full md:min-h-[280px]"
                                                />

                                                {/* Image bottom accent */}

                                                <div
                                                    className="absolute inset-x-0 bottom-0 h-1 bg-[#c29a52]"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        )}

                                        {/* =================================================
                                            CONTENT
                                        ================================================= */}

                                        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-7 lg:p-8">

                                            {/* Date */}

                                            {post.published && (
                                                <div className="flex items-center gap-2 text-xs font-medium text-[#927c65] dark:text-[#b9aa96]">
                                                    <CalendarDays className="h-4 w-4 text-[#a77a32] dark:text-[#d8b56a]" />

                                                    <span>
                                                        {formatDate(
                                                            post.published,
                                                            locale
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Title */}

                                            <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                                {post.title}
                                            </h2>

                                            {/* Decorative line */}

                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="h-px w-8 bg-[#c29a52]" />

                                                <span
                                                    className="text-[9px] text-[#a77a32] dark:text-[#d8b56a]"
                                                    aria-hidden="true"
                                                >
                                                    ✦
                                                </span>
                                            </div>

                                            {/* Excerpt */}

                                            <p className="mt-4 max-w-4xl text-sm leading-7 text-[#65584e] dark:text-[#c9bca9] sm:text-base">
                                                {getExcerpt(
                                                    post.content
                                                )}
                                            </p>

                                            {/* Labels */}

                                            {post.labels.length > 0 && (
                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    {post.labels.map(
                                                        (label) => (
                                                            <span
                                                                key={
                                                                    label
                                                                }
                                                                className="border border-[#d8c9a8] bg-[#f7f0e2] px-3 py-1 text-xs font-medium text-[#6d5947] dark:border-[#4a3c34] dark:bg-[#2a211c] dark:text-[#c9bca9]"
                                                            >
                                                                {
                                                                    label
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {/* Read More */}

                                            <div className="mt-6 pt-1">
                                                <Link
                                                    href={`/${locale}/blog/${post.id}`}
                                                    className="group/link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#762f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:text-[#d8b56a] dark:focus-visible:ring-offset-[#241d19]"
                                                >
                                                    {t("readMore")}

                                                    <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

