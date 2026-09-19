import { getLocale, getTranslations } from "next-intl/server";
import { getBaseUrl } from "@/lib/site-url";
import ShareButton from "@/components/common/ShareButton";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  published: boolean;
  imageUrl: string | null;
};

type SupportedLocale = "en" | "hi" | "kru";

function getDateLocale(locale: string): string {
  switch (locale) {
    case "hi":
      return "hi-IN";

    case "kru":
      // Kurukh does not have a reliable Intl locale in browsers.
      // Use English date formatting until a dedicated Kurukh locale
      // is available.
      return "en-IN";

    default:
      return "en-IN";
  }
}

function formatDate(
  dateString: string,
  locale: string
): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    getDateLocale(locale),
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

async function getEvents(): Promise<EventItem[]> {
  const baseUrl = await getBaseUrl();


  try {
    const response = await fetch(
      `${baseUrl}/api/events`,
      {
        next: {
          revalidate: 604800,
          tags: ["church-events"],
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    const data: unknown = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      !("events" in data) ||
      !Array.isArray(data.events)
    ) {
      return [];
    }

    return data.events as EventItem[];
  } catch (error) {
    console.error("Events page error:", error);
    return [];
  }
}

export const instant = false;

export default async function EventsPage() {
  const [t, locale] = await Promise.all([
    getTranslations("events"),
    getLocale(),
  ]);

  const events = await getEvents();

  const supportedLocale: SupportedLocale =
    locale === "hi" || locale === "kru"
      ? locale
      : "en";

  return (
    <main className="min-h-screen bg-[#fffdf7] text-[#33251d] dark:bg-[#1b1513] dark:text-[#f5ead8]">

      {/* Page Header */}
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
            {/* Centered Page Title */}
            <div className="min-w-0 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                {t("label")}
              </p>

              <h1 className="mt-1 flex items-center justify-center gap-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                <CalendarDays
                  className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a] sm:h-6 sm:w-6"
                  aria-hidden="true"
                />

                <span>{t("title")}</span>
              </h1>

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
      {/* Events */}
      <section className="bg-[#fffdf7] px-4 py-10 dark:bg-[#1b1513] sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          {events.length === 0 ? (
            /* Empty State */
            <div className="border border-[#d8c9a8] bg-white px-6 py-14 text-center shadow-sm dark:border-[#4a3c34] dark:bg-[#241d19] sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
                <CalendarDays
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                {t("noEvents")}
              </h2>

              <div className="mx-auto mt-3 flex items-center justify-center gap-2">
                <span
                  className="h-px w-8 bg-[#c29a52]"
                  aria-hidden="true"
                />

                <span
                  className="text-[10px] text-[#a77a32] dark:text-[#d8b56a]"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <span
                  className="h-px w-8 bg-[#c29a52]"
                  aria-hidden="true"
                />
              </div>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                {t("noEventsDescription")}
              </p>
            </div>
          ) : (
            /* Event List */
            <div className="space-y-8 lg:space-y-10">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="group overflow-hidden border border-[#d8c9a8] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-[#4a3c34] dark:bg-[#241d19]"
                >
                  <div className="grid lg:grid-cols-[1fr_0.9fr]">
                    {/* Content */}
                    <div className="order-2 p-6 sm:p-8 lg:order-1 lg:p-10">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                          {t("label")}
                        </p>
                      </div>

                      <h2 className="mt-4 max-w-2xl font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl lg:text-4xl">
                        {event.title}
                      </h2>

                      <div className="mt-4 flex items-center gap-2">
                        <span
                          className="h-px w-10 bg-[#c29a52]"
                          aria-hidden="true"
                        />

                        <span
                          className="text-[10px] text-[#a77a32] dark:text-[#d8b56a]"
                          aria-hidden="true"
                        >
                          ✦
                        </span>
                      </div>

                      {event.description && (
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#65584e] dark:text-[#c9bca9] sm:text-base">
                          {event.description}
                        </p>
                      )}

                      {/* Event Details */}
                      <div className="mt-7 grid gap-5 border-t border-[#d8c9a8] pt-6 dark:border-[#4a3c34] sm:grid-cols-2">
                        {/* Date */}
                        {event.eventDate && (
                          <div className="flex items-start gap-3">
                            <CalendarDays
                              className="mt-0.5 h-5 w-5 shrink-0 text-[#a77a32] dark:text-[#d8b56a]"
                              aria-hidden="true"
                            />

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#927c65] dark:text-[#b9aa96]">
                                {t("date")}
                              </p>

                              <p className="mt-1 text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-base">
                                {formatDate(
                                  event.eventDate,
                                  supportedLocale
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Time */}
                        {(event.startTime ||
                          event.endTime) && (
                            <div className="flex items-start gap-3">
                              <Clock
                                className="mt-0.5 h-5 w-5 shrink-0 text-[#a77a32] dark:text-[#d8b56a]"
                                aria-hidden="true"
                              />

                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#927c65] dark:text-[#b9aa96]">
                                  {t("time")}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-base">
                                  {event.startTime}

                                  {event.endTime &&
                                    ` - ${event.endTime}`}
                                </p>
                              </div>
                            </div>
                          )}

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-start gap-3 sm:col-span-2">
                            <MapPin
                              className="mt-0.5 h-5 w-5 shrink-0 text-[#a77a32] dark:text-[#d8b56a]"
                              aria-hidden="true"
                            />

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#927c65] dark:text-[#b9aa96]">
                                {t("location")}
                              </p>

                              <p className="mt-1 text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-base">
                                {event.location}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Indicator */}
                      <div className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#762f2f] dark:text-[#d8b56a]">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#c29a52]"
                          aria-hidden="true"
                        />

                        <span>{t("label")}</span>

                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* Image */}
                    <div className="order-1 p-4 sm:p-6 lg:order-2 lg:p-7">
                      {event.imageUrl ? (
                        <div className="relative aspect-[4/3] overflow-hidden border border-[#d8c9a8] bg-[#eee5d4] dark:border-[#4a3c34] dark:bg-[#241d19]">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />

                          <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#33251d]/20 via-transparent to-transparent"
                            aria-hidden="true"
                          />

                          <div
                            className="absolute inset-x-0 bottom-0 h-1 bg-[#c29a52]"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center border border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#4a3c34] dark:bg-[#2a211c]">
                          <CalendarDays
                            className="h-14 w-14 text-[#c29a52]/50 dark:text-[#d8b56a]/40"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}