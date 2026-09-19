
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Church,
  Heart,
  Landmark,
  MapPin,
  Users,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export const instant = false;

export default async function HistoryPage() {
  const [t, locale] = await Promise.all([
    getTranslations("history"),
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

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d7b76e]/60 text-[#d7b76e]">
                <Church className="h-4 w-4" />
              </span>

              <span>{t("label")}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>

            {/* Divider */}
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
          Introduction
      ───────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">

          <div>
            <SectionLabel>
              {t("introductionLabel")}
            </SectionLabel>

            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
              {t("introductionTitle")}
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
              {t("introductionDescription")}
            </p>

            <p className="mt-4 leading-8 text-[#65584e] dark:text-[#c9bca9]">
              {t("introductionDescriptionTwo")}
            </p>

            <p className="mt-4 leading-8 text-[#65584e] dark:text-[#c9bca9]">
              {t("introductionDescriptionThree")}
            </p>
          </div>


          {/* Historic beginning card */}
          <div className="relative overflow-hidden border border-[#d8c9a8] bg-[#f7f0e2] p-8 shadow-sm dark:border-[#4a3c34] dark:bg-[#28201c] sm:p-10">

            <div
              className="absolute right-0 top-0 h-24 w-24 border-l border-b border-[#c29a52]/20"
              aria-hidden="true"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#fffaf0] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
              <Landmark className="h-7 w-7" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6428] dark:text-[#d8b56a]">
              {t("beginningLabel")}
            </p>

            <p className="mt-2 font-serif text-5xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
              1947
            </p>

            <div className="mt-4 h-px w-12 bg-[#c29a52]" />

            <p className="mt-4 leading-7 text-[#65584e] dark:text-[#c9bca9]">
              {t("beginningDescription")}
            </p>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          Historical Timeline
      ───────────────────────────────────────── */}
      <section className="border-y border-[#d8c9a8] bg-[#f7f0e2] px-4 py-16 dark:border-[#40342e] dark:bg-[#241b18] sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel centered>
              {t("timelineLabel")}
            </SectionLabel>

            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
              {t("timelineTitle")}
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
              {t("timelineDescription")}
            </p>
          </div>


          {/* Timeline */}
          <div className="relative mx-auto mt-14 max-w-5xl">

            {/* Timeline line */}
            <div
              className="absolute left-5 top-5 hidden h-[calc(100%-40px)] w-px bg-[#c29a52]/50 md:block"
              aria-hidden="true"
            />

            <div className="space-y-12">

              {/* 1947 */}
              <TimelineItem
                number="1"
                year="1947"
                icon={<Church className="h-5 w-5" />}
                title={t("timeline1947Title")}
                description={t("timeline1947Description")}
                milestoneLabel={t("milestoneLabel")}
                milestoneTitle={t("milestone1947Title")}
                milestoneDescription={t("milestone1947Description")}
              />


              {/* 1977 */}
              <TimelineItem
                number="2"
                year="1977"
                icon={<Landmark className="h-5 w-5" />}
                title={t("timeline1977Title")}
                description={t("timeline1977Description")}
                secondaryDescription={t("timeline1977DescriptionTwo")}
              />


              {/* 1981 */}
              <TimelineItem
                number="3"
                year="1981"
                icon={<Church className="h-5 w-5" />}
                title={t("timeline1981Title")}
                description={t("timeline1981Description")}
                secondaryDescription={t("timeline1981DescriptionTwo")}

                stats={[
                  {
                    value: "1947",
                    label: t("stat1947"),
                  },
                  {
                    value: "1977",
                    label: t("stat1977"),
                  },
                  {
                    value: "1981",
                    label: t("stat1981"),
                  },
                ]}
              />


              {/* 22 December 1981 */}
              <TimelineItem
                number="4"
                date={t("timeline1981Date")}
                icon={<CalendarDays className="h-5 w-5" />}
                title={t("timelineInaugurationTitle")}
                description={t("timelineInaugurationDescription")}
                highlight={{
                  label: t("historicDayLabel"),
                  date: "22.12.1981",
                  description: t("historicDayDescription"),
                  personLabel: t("bishopLabel"),
                  person: "Bishop Philip Ekka",
                }}
              />


              {/* Today */}
              <TimelineItem
                number="5"
                date={t("todayLabel")}
                icon={<Users className="h-5 w-5" />}
                title={t("todayTitle")}
                description={t("todayDescription")}
                secondaryDescription={t("todayDescriptionTwo")}
                last
              />

            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          Legacy
      ───────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <SectionLabel centered>
              {t("legacyLabel")}
            </SectionLabel>

            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
              {t("legacyTitle")}
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
              {t("legacyDescription")}
            </p>
          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <ValueCard
              icon={<Heart className="h-6 w-6" />}
              title={t("faithTitle")}
              description={t("faithDescription")}
            />

            <ValueCard
              icon={<Users className="h-6 w-6" />}
              title={t("communityTitle")}
              description={t("communityDescription")}
            />

            <ValueCard
              icon={<Heart className="h-6 w-6" />}
              title={t("serviceTitle")}
              description={t("serviceDescription")}
            />

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          Faith
      ───────────────────────────────────────── */}
      <section className="bg-[#3a211d] text-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <SectionLabel>
                {t("faithSectionLabel")}
              </SectionLabel>

              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {t("faithSectionTitle")}
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[#d1ad61]" />

                <span
                  className="text-xs text-[#e1c17b]"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <span className="h-px w-16 bg-[#d1ad61]/60" />
              </div>

              <p className="mt-6 leading-8 text-[#eadfce]">
                {t("faithSectionDescription")}
              </p>

              <p className="mt-4 leading-8 text-[#eadfce]">
                {t("faithSectionDescriptionTwo")}
              </p>

            </div>


            {/* Scripture */}
            <div className="border border-[#d8b56a]/20 bg-white/10 p-8 sm:p-10">

              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d8b56a]/40 text-[#d8b56a]">
                <BookOpen className="h-6 w-6" />
              </div>

              <p className="mt-7 text-5xl leading-none text-[#d8b56a]/60">
                “
              </p>

              <blockquote className="mt-2 font-serif text-2xl font-semibold leading-relaxed text-[#fff8eb]">
                {t("scripture")}
              </blockquote>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-[#d8b56a]">
                {t("scriptureReference")}
              </p>

            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          Community
      ───────────────────────────────────────── */}
      <section className="border-y border-[#d8c9a8] bg-[#f7f0e2] px-4 py-16 dark:border-[#40342e] dark:bg-[#241b18] sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

          <div>

            <SectionLabel>
              {t("communitySectionLabel")}
            </SectionLabel>

            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl">
              {t("communitySectionTitle")}
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
              {t("communitySectionDescription")}
            </p>

            <p className="mt-4 leading-8 text-[#65584e] dark:text-[#c9bca9]">
              {t("communitySectionDescriptionTwo")}
            </p>

          </div>


          <div className="relative overflow-hidden border border-[#d8c9a8] bg-[#fffdf7] p-8 shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d] sm:p-10">

            <div
              className="absolute right-0 top-0 h-28 w-28 border-l border-b border-[#c29a52]/20"
              aria-hidden="true"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
              <Users className="h-7 w-7" />
            </div>

            <h3 className="mt-6 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
              {t("communityCardTitle")}
            </h3>

            <div className="mt-3 h-px w-12 bg-[#c29a52]" />

            <p className="mt-4 leading-7 text-[#65584e] dark:text-[#c9bca9]">
              {t("communityCardDescription")}
            </p>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────
          CTA
      ───────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

        <div className="relative mx-auto max-w-7xl overflow-hidden border border-[#8e6b35]/60 bg-[#3a211d] px-6 py-12 text-white shadow-md sm:px-10 sm:py-16 lg:px-14">

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
   Timeline Item
───────────────────────────────────────── */

function TimelineItem({
  number,
  year,
  date,
  icon,
  title,
  description,
  secondaryDescription,
  milestoneLabel,
  milestoneTitle,
  milestoneDescription,
  stats,
  highlight,
  last = false,
}: {
  number: string;
  year?: string;
  date?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  secondaryDescription?: string;
  milestoneLabel?: string;
  milestoneTitle?: string;
  milestoneDescription?: string;
  stats?: {
    value: string;
    label: string;
  }[];
  highlight?: {
    label: string;
    date: string;
    description: string;
    personLabel: string;
    person: string;
  };
  last?: boolean;
}) {
  return (
    <article className="relative grid gap-6 md:grid-cols-[40px_1fr] md:gap-8">

      {/* Timeline marker */}
      <div className="relative z-10 hidden md:block">

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c29a52] bg-[#3a211d] text-[#f4e7c8] shadow-sm">
          {icon}
        </div>

      </div>


      {/* Content */}
      <div className="border border-[#d8c9a8] bg-[#fffdf7] p-7 shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d] sm:p-8">

        <div className="flex flex-wrap items-center gap-3">

          {year && (
            <span className="font-serif text-4xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
              {year}
            </span>
          )}

          {date && (
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6428] dark:text-[#d8b56a]">
              {date}
            </span>
          )}

        </div>

        <h3 className="mt-3 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
          {title}
        </h3>

        <div className="mt-3 h-px w-12 bg-[#c29a52]" />

        <p className="mt-5 leading-8 text-[#65584e] dark:text-[#c9bca9]">
          {description}
        </p>

        {secondaryDescription && (
          <p className="mt-4 leading-8 text-[#65584e] dark:text-[#c9bca9]">
            {secondaryDescription}
          </p>
        )}


        {/* Historical milestone */}
        {milestoneTitle && (
          <div className="mt-7 border border-[#d8c9a8] bg-[#f7f0e2] p-6 dark:border-[#4a3c34] dark:bg-[#241b18]">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6428] dark:text-[#d8b56a]">
              {milestoneLabel}
            </p>

            <p className="mt-3 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
              {milestoneTitle}
            </p>

            <p className="mt-2 leading-7 text-[#65584e] dark:text-[#c9bca9]">
              {milestoneDescription}
            </p>

          </div>
        )}


        {/* Historical stats */}
        {stats && (
          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            {stats.map((stat) => (
              <div
                key={stat.value}
                className="border border-[#d8c9a8] bg-[#f7f0e2] p-5 dark:border-[#4a3c34] dark:bg-[#241b18]"
              >
                <p className="font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-[#65584e] dark:text-[#c9bca9]">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>
        )}


        {/* Historic day highlight */}
        {highlight && (
          <div className="mt-8 overflow-hidden border border-[#8e6b35]/60 bg-[#3a211d] text-white">

            <div className="p-7 sm:p-9">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e5cb91]">
                {highlight.label}
              </p>

              <p className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
                {highlight.date}
              </p>

              <p className="mt-5 max-w-2xl leading-8 text-[#eadfce]">
                {highlight.description}
              </p>

              <div className="mt-7 border-t border-white/10 pt-6">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#cdbb9e]">
                  {highlight.personLabel}
                </p>

                <p className="mt-2 font-serif text-xl font-semibold text-[#fff4dc]">
                  {highlight.person}
                </p>

              </div>
            </div>
          </div>
        )}

      </div>
    </article>
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

