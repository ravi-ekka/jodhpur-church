
import Link from "next/link";
import { ArrowRight, BookOpen, Cross, Music2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { getTodayBibleReadings } from "@/lib/bible/bible";

export default async function TodaysBible() {
  const [{ readings }, t, locale] = await Promise.all([
    getTodayBibleReadings(),
    getTranslations("home"),
    getLocale(),
  ]);

  return (
    <section className="relative overflow-hidden bg-[#f8f3e8] px-4 py-16 dark:bg-[#211b18] sm:px-6 sm:py-20 lg:px-8">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#c5a35d]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 border border-[#c8ad73] bg-[#fffdf7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#762f2f] shadow-sm dark:border-[#66563e] dark:bg-[#2b231f] dark:text-[#e1c17b] sm:text-sm">
            <BookOpen className="h-4 w-4" />
            <span>{t("bibleDailyWord")}</span>
          </div>

          {/* Heading */}
          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-[#4b2923] dark:text-[#f1e5d4] sm:text-4xl md:text-5xl">
            {t("bibleTodaysBible")}
          </h2>

          {/* Decorative divider */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#b99755]" />
            <span className="text-sm text-[#a77a32]" aria-hidden="true">
              ✦
            </span>
            <span className="h-px w-12 bg-[#b99755]" />
          </div>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#705f52] dark:text-[#bcae9f] sm:text-base">
            {t("bibleDescription")}
          </p>
        </div>

        {/* Reading Cards */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2">
          {readings.firstReading && (
            <ReadingCard
              title={t("bibleFirstReading")}
              reference={readings.firstReading}
              type="first-reading"
              readLabel={t("bibleReadPassage")}
              icon={<BookOpen className="h-5 w-5" />}
              locale={locale}
            />
          )}

          {readings.psalm && (
            <ReadingCard
              title={t("biblePsalm")}
              reference={readings.psalm}
              type="psalm"
              readLabel={t("bibleReadPassage")}
              icon={<Music2 className="h-5 w-5" />}
              locale={locale}
            />
          )}

          {readings.secondReading && (
            <ReadingCard
              title={t("bibleSecondReading")}
              reference={readings.secondReading}
              type="second-reading"
              readLabel={t("bibleReadPassage")}
              icon={<BookOpen className="h-5 w-5" />}
              locale={locale}
            />
          )}

          {readings.gospel && (
            <ReadingCard
              title={t("bibleGospel")}
              reference={readings.gospel}
              type="gospel"
              readLabel={t("bibleReadPassage")}
              icon={<Cross className="h-5 w-5" />}
              highlight
              locale={locale}
            />
          )}
        </div>
      </div>
    </section>
  );
}

type ReadingCardProps = {
  title: string;
  reference: string;
  icon: React.ReactNode;
  type:
    | "first-reading"
    | "psalm"
    | "second-reading"
    | "gospel";
  readLabel: string;
  highlight?: boolean;
  locale: string;
};

function ReadingCard({
  title,
  reference,
  icon,
  type,
  readLabel,
  highlight = false,
  locale,
}: ReadingCardProps) {
  return (
    <Link
      href={`/${locale}/bible-reading/${type}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a77a32] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#211b18]"
    >
      <article
        className={[
          "relative min-h-[190px] overflow-hidden rounded-lg border p-5",
          "transition-all duration-200 sm:p-7",
          highlight
            ? [
                "border-[#7d3434]",
                "bg-[#762f2f]",
                "text-white",
                "shadow-md",
                "hover:bg-[#672929]",
              ].join(" ")
            : [
                "border-[#dfd2bd]",
                "bg-[#fffdf8]",
                "text-[#44332b]",
                "shadow-sm",
                "hover:-translate-y-0.5",
                "hover:border-[#c5a35d]",
                "hover:shadow-md",
                "dark:border-[#4b4038]",
                "dark:bg-[#2b231f]",
                "dark:text-[#f1e5d4]",
                "dark:hover:border-[#806b47]",
              ].join(" "),
        ].join(" ")}
      >
        {/* Gospel decorative cross */}
        {highlight && (
          <div
            className="pointer-events-none absolute -right-5 -top-7 opacity-[0.07]"
            aria-hidden="true"
          >
            <Cross className="h-36 w-36" strokeWidth={1} />
          </div>
        )}

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  highlight
                    ? "border border-white/20 bg-white/10 text-[#f1d28c]"
                    : "border border-[#d9c69f] bg-[#f8f0df] text-[#762f2f] dark:border-[#62543e] dark:bg-[#3a2f28] dark:text-[#e1c17b]",
                ].join(" ")}
              >
                {icon}
              </span>

              <span
                className={[
                  "text-xs font-semibold uppercase tracking-[0.14em]",
                  highlight
                    ? "text-[#f0dba9]"
                    : "text-[#806d5d] dark:text-[#bcae9f]",
                ].join(" ")}
              >
                {title}
              </span>
            </div>

            <span
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                "transition-transform duration-200 group-hover:translate-x-1",
                highlight
                  ? "bg-white/10 text-[#f1d28c]"
                  : "bg-[#f3eadb] text-[#765d4d] dark:bg-[#3a2f28] dark:text-[#c9b99f]",
              ].join(" ")}
              aria-hidden="true"
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          {/* Scripture Reference */}
          <h3
            className={[
              "mt-6 font-serif text-xl font-semibold leading-tight sm:text-2xl",
              highlight ? "text-white" : "text-[#4b2923] dark:text-[#f1e5d4]",
            ].join(" ")}
          >
            {reference}
          </h3>

          {/* Read link */}
          <div
            className={[
              "mt-5 flex items-center gap-2 text-sm font-medium",
              highlight
                ? "text-[#f0dba9]"
                : "text-[#806d5d] dark:text-[#bcae9f]",
            ].join(" ")}
          >
            <span>{readLabel}</span>

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}

