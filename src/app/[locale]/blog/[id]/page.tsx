
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButton from "@/components/common/ShareButton";
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getBaseUrl } from "@/lib/site-url";

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

async function getPosts(): Promise<BlogPost[]> {
    const baseUrl = await getBaseUrl();

    const response = await fetch(
        `${baseUrl}/api/blogger/posts`,
        {
            next: {
                revalidate: 86400,
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

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}) {
    const { locale, id } = await params;

    const t = await getTranslations({
        locale,
        namespace: "blog",
    });

    const posts = await getPosts();

    const post = posts.find(
        (item) => item.id === id
    );

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#fffdf7] text-[#33251d] dark:bg-[#1b1513] dark:text-[#f5ead8]">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

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

                <div className="relative mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">

                        {/* BACK TO BLOG */}
                        <Link
                            href={`/${locale}/blog`}
                            className="group inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-[#762f2f] transition-colors hover:text-[#a34b42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:text-[#d8b56a] dark:hover:text-[#f0d08b] dark:focus-visible:ring-offset-[#241b18]"
                        >
                            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />

                            <span className="hidden sm:inline">
                                {t("backToBlog")}
                            </span>
                        </Link>

                        {/* DIVIDER */}
                        <span
                            className="mt-1 h-6 w-px shrink-0 bg-[#d8c9a8] sm:mt-0 dark:bg-[#4a3c34]"
                            aria-hidden="true"
                        />

                        {/* BLOG POST TITLE */}
                        <div className="min-w-0 flex-1">
                            <h1 className="font-serif text-lg font-semibold leading-snug text-[#4b2823] dark:text-[#f3dfbc] sm:text-2xl">
                                {post.title}
                            </h1>
                        </div>

                        {/* SHARE */}
                        {/* SHARE */}
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 sm:-right-3 lg:-right-28">
                            <ShareButton
                                title={post.title}
                                text={t("description")}
                                url={post.url}
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* =====================================================
                ARTICLE
            ===================================================== */}

            <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

                {/* =================================================
                    ARTICLE HEADER
                ================================================= */}

                <header className="mb-8 sm:mb-10">

                    {/* Blog icon */}

                    <div className="mb-4 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
                            <BookOpen className="h-5 w-5" />
                        </div>

                        {post.published && (
                            <div className="flex items-center gap-2 text-xs font-medium text-[#927c65] dark:text-[#b9aa96] sm:text-sm">
                                <CalendarDays className="h-4 w-4 text-[#a77a32] dark:text-[#d8b56a]" />

                                <span>
                                    {formatDate(
                                        post.published,
                                        locale
                                    )}
                                </span>
                            </div>
                        )}
                    </div>



                    {post.labels.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {post.labels.map((label) => (
                                <span
                                    key={label}
                                    className="border border-[#d8c9a8] bg-[#f7f0e2] px-3 py-1 text-xs font-medium text-[#6d5947] dark:border-[#4a3c34] dark:bg-[#2a211c] dark:text-[#c9bca9]"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* =================================================
                    ARTICLE CONTENT
                ================================================= */}

                <div
                    className="
                        blog-content
                        max-w-none
                        text-[1rem]
                        leading-8
                        text-[#493d35]
                        dark:text-[#ded2c2]

                        sm:text-[1.08rem]

                        [&_h1]:mb-5
                        [&_h1]:mt-10
                        [&_h1]:font-serif
                        [&_h1]:text-3xl
                        [&_h1]:font-semibold
                        [&_h1]:leading-tight
                        [&_h1]:text-[#4b2823]
                        dark:[&_h1]:text-[#f3dfbc]

                        [&_h2]:mb-4
                        [&_h2]:mt-10
                        [&_h2]:font-serif
                        [&_h2]:text-2xl
                        [&_h2]:font-semibold
                        [&_h2]:leading-tight
                        [&_h2]:text-[#4b2823]
                        dark:[&_h2]:text-[#f3dfbc]

                        [&_h3]:mb-3
                        [&_h3]:mt-8
                        [&_h3]:font-serif
                        [&_h3]:text-xl
                        [&_h3]:font-semibold
                        [&_h3]:text-[#4b2823]
                        dark:[&_h3]:text-[#f3dfbc]

                        [&_p]:mb-6

                        [&_a]:font-medium
                        [&_a]:text-[#762f2f]
                        [&_a]:underline
                        [&_a]:underline-offset-4
                        dark:[&_a]:text-[#d8b56a]

                        [&_strong]:font-semibold
                        [&_strong]:text-[#33251d]
                        dark:[&_strong]:text-[#f5ead8]

                        [&_blockquote]:my-8
                        [&_blockquote]:border-l-4
                        [&_blockquote]:border-[#c29a52]
                        [&_blockquote]:bg-[#f7f0e2]
                        [&_blockquote]:px-5
                        [&_blockquote]:py-4
                        [&_blockquote]:font-serif
                        [&_blockquote]:italic
                        [&_blockquote]:text-[#65584e]
                        dark:[&_blockquote]:bg-[#2a211c]
                        dark:[&_blockquote]:text-[#c9bca9]

                        [&_ul]:mb-6
                        [&_ul]:ml-5
                        [&_ul]:list-disc

                        [&_ol]:mb-6
                        [&_ol]:ml-5
                        [&_ol]:list-decimal

                        [&_li]:mb-2

                        [&_img]:mx-auto
                        [&_img]:my-8
                        [&_img]:h-auto
                        [&_img]:max-w-full

                        [&_hr]:my-8
                        [&_hr]:border-[#d8c9a8]
                        dark:[&_hr]:border-[#4a3c34]

                        [&_table]:my-8
                        [&_table]:w-full
                        [&_table]:border-collapse

                        [&_th]:border
                        [&_th]:border-[#d8c9a8]
                        [&_th]:bg-[#f7f0e2]
                        [&_th]:px-3
                        [&_th]:py-2
                        [&_th]:text-left
                        dark:[&_th]:border-[#4a3c34]
                        dark:[&_th]:bg-[#2a211c]

                        [&_td]:border
                        [&_td]:border-[#d8c9a8]
                        [&_td]:px-3
                        [&_td]:py-2
                        dark:[&_td]:border-[#4a3c34]
                    "
                    dangerouslySetInnerHTML={{
                        __html: post.content,
                    }}
                />

                {/* =================================================
                    BOTTOM NAVIGATION
                ================================================= */}

                <div className="mt-10 border-t border-[#d8c9a8] pt-6 dark:border-[#4a3c34] sm:mt-12 sm:pt-8">

                    <Link
                        href={`/${locale}/blog`}
                        className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#762f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:text-[#d8b56a] dark:focus-visible:ring-offset-[#1b1513]"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

                        {t("backToBlog")}
                    </Link>

                </div>
            </article>
        </main>
    );
}

