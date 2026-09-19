
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Cross,
  Music2,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getTodayBibleReadings } from "@/lib/bible/bible";

export const instant = false;

type ReadingType =
  | "first-reading"
  | "psalm"
  | "second-reading"
  | "gospel";

type Verse = {
  number: number;
  text: string;
};

type Props = {
  params: Promise<{
    locale: string;
    type: string;
  }>;
};

export default async function BibleReadingPage({
  params,
}: Props) {
  const { locale, type: rawType } = await params;

  // ---------------------------------------------------------
  // Validate reading type
  // ---------------------------------------------------------

  if (
    rawType !== "first-reading" &&
    rawType !== "psalm" &&
    rawType !== "second-reading" &&
    rawType !== "gospel"
  ) {
    notFound();
  }

  const type = rawType as ReadingType;

  // ---------------------------------------------------------
  // Translations
  // ---------------------------------------------------------

  const t = await getTranslations("bibleReading");

  // ---------------------------------------------------------
  // Today's Catholic readings
  // ---------------------------------------------------------

  const data = await getTodayBibleReadings();

  let reference: string | undefined;
  let verses: Verse[] = [];

  switch (type) {
    case "first-reading":
      reference = data.readings.firstReading;
      verses = data.firstVerses ?? [];
      break;

    case "psalm":
      reference = data.readings.psalm;
      verses = data.psalmVerses ?? [];
      break;

    case "second-reading":
      reference = data.readings.secondReading;
      verses = data.secondVerses ?? [];
      break;

    case "gospel":
      reference = data.readings.gospel;
      verses = data.gospelVerses ?? [];
      break;
  }

  if (!reference) {
    notFound();
  }

  const readingInfo = getReadingInfo(type, t);

  const isGospel = type === "gospel";

  // ---------------------------------------------------------
  // Page
  // ---------------------------------------------------------

  return (
    <main className="min-h-screen bg-[#fffdf7] text-[#33251d] dark:bg-[#1b1513] dark:text-[#f5ead8]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section
        className={[
          "relative overflow-hidden border-b",
          isGospel
            ? "border-[#6b2929] bg-[#762f2f] text-[#fffaf0] dark:border-[#5a302c] dark:bg-[#4b2424]"
            : "border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]",
        ].join(" ")}
      >
        {/* Gold top line */}

        <div
          className="absolute inset-x-0 top-0 h-0.5 bg-[#c29a52]"
          aria-hidden="true"
        />

        {/* Decorative background */}

        <div
          className={[
            "pointer-events-none absolute right-0 top-0 h-full w-1/4",
            "bg-gradient-to-l",
            isGospel
              ? "from-[#a35b45]/20 to-transparent"
              : "from-[#ead9b6]/30 to-transparent dark:from-[#5a4030]/15",
          ].join(" ")}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-3.5">
          {/* =========================
              MOBILE
          ========================= */}

          <div className="flex flex-col items-center justify-center gap-1 sm:hidden">
            {/* First line */}

            <div className="flex items-center justify-center gap-2">
              <div
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  isGospel
                    ? "border-[#d8b56a]/70 bg-[#fffaf0]/10 text-[#f0d08b]"
                    : "border-[#c29a52]/60 bg-[#fffaf0] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]",
                ].join(" ")}
              >
                {readingInfo.icon}
              </div>

              <span
                className={[
                  "text-xs font-semibold uppercase tracking-[0.12em]",
                  isGospel
                    ? "text-[#f3dfbc]/80"
                    : "text-[#8b765f] dark:text-[#c9bca9]",
                ].join(" ")}
              >
                {readingInfo.title}
              </span>
            </div>

            {/* Second line */}

            <h1
              className={[
                "max-w-full truncate font-serif text-xl font-semibold leading-tight tracking-tight",
                isGospel
                  ? "text-[#fffaf0]"
                  : "text-[#4b2823] dark:text-[#f3dfbc]",
              ].join(" ")}
            >
              {reference}
            </h1>
          </div>

          {/* =========================
              DESKTOP
          ========================= */}

          <div className="hidden min-h-10 items-center justify-center gap-3 sm:flex sm:gap-4">
            {/* Icon */}

            <div
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                isGospel
                  ? "border-[#d8b56a]/70 bg-[#fffaf0]/10 text-[#f0d08b]"
                  : "border-[#c29a52]/60 bg-[#fffaf0] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]",
              ].join(" ")}
            >
              {readingInfo.icon}
            </div>

            {/* Reading type */}

            <span
              className={[
                "shrink-0 text-xs font-semibold uppercase tracking-[0.12em] sm:text-sm",
                isGospel
                  ? "text-[#f3dfbc]/80"
                  : "text-[#8b765f] dark:text-[#c9bca9]",
              ].join(" ")}
            >
              {readingInfo.title}
            </span>

            {/* Separator */}

            <span
              className={
                isGospel
                  ? "text-[#d8b56a]"
                  : "text-[#a77a32] dark:text-[#d8b56a]"
              }
              aria-hidden="true"
            >
              —
            </span>

            {/* Reference */}

            <h1
              className={[
                "min-w-0 truncate font-serif text-xl font-semibold leading-none tracking-tight sm:text-2xl",
                isGospel
                  ? "text-[#fffaf0]"
                  : "text-[#4b2823] dark:text-[#f3dfbc]",
              ].join(" ")}
            >
              {reference}
            </h1>
          </div>
        </div>
      </section>

      {/* =====================================================
          SCRIPTURE CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
        <article className="overflow-hidden border border-[#d8c9a8] bg-white shadow-sm dark:border-[#4a3c34] dark:bg-[#241d19]">
          {/* =================================================
              SCRIPTURE HEADER
          ================================================= */}

          <div className="border-b border-[#d8c9a8] bg-[#f7f0e2] px-5 py-6 dark:border-[#4a3c34] dark:bg-[#2a211c] sm:px-8 sm:py-7">
            <div className="flex items-start gap-4">
              {/* Icon */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c29a52]/50 bg-[#fffaf0] text-[#762f2f] dark:border-[#8b6b43] dark:bg-[#342720] dark:text-[#d8b56a]">
                <BookOpen className="h-5 w-5" />
              </div>

              {/* Heading */}

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#927c65] dark:text-[#b9aa96]">
                  {t("holyScripture")}
                </p>

                <h2 className="mt-1 break-words font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-2xl">
                  {reference}
                </h2>
              </div>
            </div>
          </div>

          {/* =================================================
              VERSES
          ================================================= */}

          <div className="px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            {verses.length > 0 ? (
              <div className="mx-auto max-w-3xl space-y-7">
                {verses.map((verse) => (
                  <p
                    key={verse.number}
                    className="text-[1rem] leading-8 text-[#493d35] dark:text-[#ded2c2] sm:text-[1.08rem] sm:leading-9"
                  >
                    <sup className="mr-2 inline-flex min-w-5 items-center justify-center align-super text-xs font-bold text-[#a77a32] dark:text-[#d8b56a]">
                      {verse.number}
                    </sup>

                    {verse.text}
                  </p>
                ))}
              </div>
            ) : (
              <div className="border border-[#d8c9a8] bg-[#f7f0e2] px-5 py-10 text-center dark:border-[#4a3c34] dark:bg-[#2a211c]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c29a52]/50 bg-[#fffaf0] text-[#927c65] dark:bg-[#342720] dark:text-[#c9bca9]">
                  <BookOpen className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                  {t("textNotAvailable")}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                  {t("textNotAvailableDescription")}
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              BOTTOM NAVIGATION
          ================================================= */}

          <div className="border-t border-[#d8c9a8] bg-[#f7f0e2] px-5 py-5 dark:border-[#4a3c34] dark:bg-[#2a211c] sm:px-8">
            <Link
              href={`/${locale}/bible`}
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#762f2f] transition-colors hover:text-[#a34b42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:text-[#d8b56a] dark:hover:text-[#f0d08b] dark:focus-visible:ring-offset-[#2a211c]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

              {t("backToReadings")}
            </Link>
          </div>
        </article>

        {/* =====================================================
            ENCOURAGEMENT
        ===================================================== */}

        <div className="mt-6 border border-[#d8c9a8] bg-[#f7f0e2] px-5 py-7 text-center dark:border-[#4a3c34] dark:bg-[#241d19] sm:px-8">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#c29a52]" />

            <Cross
              className="h-4 w-4 text-[#a77a32] dark:text-[#d8b56a]"
              aria-hidden="true"
            />

            <span className="h-px w-8 bg-[#c29a52]" />
          </div>

          <p className="mx-auto mt-4 max-w-2xl font-serif text-sm italic leading-7 text-[#65584e] dark:text-[#c9bca9] sm:text-base">
            &ldquo;{t("verseQuote")}&rdquo;
          </p>

          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#a77a32] dark:text-[#d8b56a]">
            Psalm 119:105
          </p>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   READING INFORMATION
============================================================ */

function getReadingInfo(
  type: ReadingType,
  t: Awaited<ReturnType<typeof getTranslations>>
) {
  switch (type) {
    case "psalm":
      return {
        title: t("psalm"),
        icon: <Music2 className="h-7 w-7" />,
      };

    case "gospel":
      return {
        title: t("gospel"),
        icon: <Cross className="h-7 w-7" />,
      };

    case "first-reading":
      return {
        title: t("firstReading"),
        icon: <BookOpen className="h-7 w-7" />,
      };

    case "second-reading":
      return {
        title: t("secondReading"),
        icon: <BookOpen className="h-7 w-7" />,
      };
  }
}