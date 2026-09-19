
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Church,
  Heart,
  Users,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export const instant = false;

export default async function AboutPage() {
  const [t, locale] = await Promise.all([
    getTranslations("about"),
    getLocale(),
  ]);

  return (
    <main className="min-h-screen bg-[#fffdf7] text-[#33251d] dark:bg-[#1b1513] dark:text-[#f5ead8]">

      {/* ─────────────────────────────────────────
          Hero
      ───────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-[#d8c9a8] bg-[#3a211d] text-white dark:border-[#40342e]">
        <div
          className="absolute inset-0 bg-[#24130f]/60"
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
          aria-hidden="true"
        />

        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#5a3028]/40 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-3xl">

            {/* Label */}
            <div className="mb-6 inline-flex items-center gap-3 border border-[#d7b76e]/50 bg-[#2f1b17]/70 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f3dfb0] sm:text-sm">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d7b76e]/60 text-[#d7b76e]"
                aria-hidden="true"
              >
                <Church className="h-4 w-4" />
              </span>

              <span>{t("label")}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>

            {/* Decorative divider */}
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-12 bg-[#d1ad61]" />
              <span
                className="text-sm text-[#e1c17b]"
                aria-hidden="true"
              >
                ✦
              </span>
              <span className="h-px w-20 bg-[#d1ad61]/60" />
            </div>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#f1e7d9] sm:text-lg sm:leading-8">
              {t("description")}
            </p>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-px bg-[#c49a4e]/50"
          aria-hidden="true"
        />
      </section>

      {/* ─────────────────────────────────────────
          Who We Are
      ───────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">

          <div>
            <SectionLabel>{t("whoWeAreLabel")}</SectionLabel>

            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
              {t("whoWeAreTitle")}
            </h2>

            <div className="mt-5 flex items-center gap-2">
              <span className="h-px w-10 bg-[#c29a52]" />
              <span
                className="text-xs text-[#a77a32]"
                aria-hidden="true"
              >
                ✦
              </span>
              <span className="h-px w-16 bg-[#c29a52]/50" />
            </div>

            <p className="mt-6 leading-8 text-[#65584e] dark:text-[#c9bca9]">
              {t("whoWeAreDescription")}
            </p>

            <p className="mt-4 leading-8 text-[#65584e] dark:text-[#c9bca9]">
              {t("welcomeDescription")}
            </p>
          </div>

          {/* Belong Card */}
          <div className="relative overflow-hidden border border-[#d8c9a8] bg-[#f7f0e2] p-8 shadow-sm dark:border-[#4a3c34] dark:bg-[#28201c] sm:p-10">

            <div
              className="absolute right-0 top-0 h-24 w-24 border-l border-b border-[#c29a52]/20"
              aria-hidden="true"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#fffaf0] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
              <Church className="h-7 w-7" />
            </div>

            <h3 className="mt-6 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
              {t("belongTitle")}
            </h3>

            <div className="mt-3 h-px w-12 bg-[#c29a52]" />

            <p className="mt-4 leading-7 text-[#65584e] dark:text-[#c9bca9]">
              {t("belongDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          Mission / Vision / Community
      ───────────────────────────────────────── */}
      <section className="border-y border-[#d8c9a8] bg-[#f7f0e2] px-4 py-16 dark:border-[#40342e] dark:bg-[#241b18] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel centered>
              {t("valuesLabel")}
            </SectionLabel>

            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
              {t("valuesTitle")}
            </h2>

            <div className="mx-auto mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#c29a52]" />
              <span
                className="text-xs text-[#a77a32]"
                aria-hidden="true"
              >
                ✦
              </span>
              <span className="h-px w-10 bg-[#c29a52]" />
            </div>

            <p className="mt-5 leading-7 text-[#65584e] dark:text-[#c9bca9]">
              {t("valuesDescription")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Mission */}
            <ValueCard
              icon={<Heart className="h-6 w-6" />}
              title={t("missionTitle")}
              description={t("missionDescription")}
            />

            {/* Vision */}
            <ValueCard
              icon={<BookOpen className="h-6 w-6" />}
              title={t("visionTitle")}
              description={t("visionDescription")}
            />

            {/* Community */}
            <ValueCard
              icon={<Users className="h-6 w-6" />}
              title={t("communityTitle")}
              description={t("communityDescription")}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          Faith
      ───────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#2b211d] dark:text-[#d8b56a]">
            <BookOpen className="h-7 w-7" />
          </div>

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#c29a52]" />
            <span
              className="text-xs text-[#a77a32]"
              aria-hidden="true"
            >
              ✦
            </span>
            <span className="h-px w-10 bg-[#c29a52]" />
          </div>

          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
            {t("faithTitle")}
          </h2>

          <p className="mt-5 text-base leading-8 text-[#65584e] dark:text-[#c9bca9] sm:text-lg">
            {t("faithDescription")}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          Contact CTA
      ───────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden border border-[#8e6b35]/60 bg-[#3a211d] px-6 py-12 text-white shadow-md sm:px-10 sm:py-16 lg:px-14">

          {/* Decorative elements */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#5a3028]/50 to-transparent"
            aria-hidden="true"
          />

          <div
            className="absolute right-8 top-8 h-24 w-24 rounded-full border border-[#d8b56a]/20 sm:right-12 sm:top-10 sm:h-32 sm:w-32"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[#d8b56a]" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e5cb91]">
                  Jodhpur Church
                </span>
              </div>

              <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {t("ctaTitle")}
              </h2>

              <p className="mt-4 leading-7 text-[#eadfce]">
                {t("ctaDescription")}
              </p>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md border border-[#d4ae5e] bg-[#f4e7c8] px-6 py-3 font-semibold text-[#552521] shadow-lg transition-colors hover:bg-[#fff1d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c27b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a211d]"
            >
              {t("contactButton")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────
   Section Label
───────────────────────────────────────── */

function SectionLabel({
  children,
  centered = false,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={[
        "text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6428] dark:text-[#d8b56a]",
        centered ? "text-center" : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   Value Card
───────────────────────────────────────── */

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="group border border-[#d8c9a8] bg-[#fffdf7] p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c29a52] hover:shadow-md dark:border-[#4a3c34] dark:bg-[#2a211d] sm:p-8">

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] transition-colors group-hover:bg-[#762f2f] group-hover:text-[#f8e9c7] dark:bg-[#342720] dark:text-[#d8b56a] dark:group-hover:bg-[#762f2f]">
        {icon}
      </div>

      <h3 className="mt-6 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
        {title}
      </h3>

      <div className="mt-3 h-px w-10 bg-[#c29a52]" />

      <p className="mt-4 leading-7 text-[#65584e] dark:text-[#c9bca9]">
        {description}
      </p>
    </article>
  );
}
