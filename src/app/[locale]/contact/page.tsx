
import Link from "next/link";
import {
  ArrowRight,
  Church,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import ShareButton from "@/components/common/ShareButton";
import ContactForm from "@/components/layout/contact/ContactForm";
import { getChurchSettings } from "@/lib/settings/church-settings";

export const instant = false;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "contact",
  });
  const settings = await getChurchSettings();
  return (
    <main className="min-h-screen bg-[#fffdf7] text-[#33251d] dark:bg-[#1b1513] dark:text-[#f5ead8]">

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
          <div className="relative flex items-center justify-center">
            <div className="min-w-0 text-center">

              {/* Label */}
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                {t("label")}
              </p>

              {/* Icon + Title */}
              <h1 className="mt-1 flex items-center justify-center gap-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                <MessageCircle
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

            {/* SHARE */}
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
          CONTACT INFORMATION
      ===================================================== */}
      <section className="bg-[#fffdf7] px-4 py-10 dark:bg-[#1b1513] sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-5 md:grid-cols-3">

            {/* Visit Us */}
            <article className="border border-[#d8c9a8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-[#4a3c34] dark:bg-[#241d19] sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
                <MapPin className="h-5 w-5" />
              </div>

              <h2 className="mt-5 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                {t("visitTitle")}
              </h2>

              <div className="mt-3 h-px w-10 bg-[#c29a52]" />

              <p className="mt-4 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                {t("addressLine1")}
                <br />
                {t("addressLine2")}
                <br />
                {t("addressLine3")}
              </p>
            </article>

            {/* Worship */}
            <article className="border border-[#d8c9a8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-[#4a3c34] dark:bg-[#241d19] sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
                <Church className="h-5 w-5" />
              </div>

              <h2 className="mt-5 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                {t("worshipTitle")}
              </h2>

              <div className="mt-3 h-px w-10 bg-[#c29a52]" />

              <div className="mt-4 flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#a77a32] dark:text-[#d8b56a]" />

                <span className="font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                  {settings.sundayWorship}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                {t("worshipDescription")}
              </p>
            </article>

            {/* Get in Touch */}
            <article className="border border-[#d8c9a8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-[#4a3c34] dark:bg-[#241d19] sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
                <Mail className="h-5 w-5" />
              </div>

              <h2 className="mt-5 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                {t("getInTouchTitle")}
              </h2>

              <div className="mt-3 h-px w-10 bg-[#c29a52]" />

              <p className="mt-4 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                {t("getInTouchDescription")}
              </p>

              <a
                href="tel:+919340358685"
                className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-[#762f2f] hover:text-[#a34b42] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:text-[#d8b56a] dark:hover:text-[#f0d08b]"
              >
             {settings.phone}
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT FORM + MAP
      ===================================================== */}
      <section className="border-y border-[#d8c9a8] bg-[#f7f0e2]/60 dark:border-[#40342e] dark:bg-[#241b18]/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">

            {/* Contact Form */}
            <div>
              <div className="mb-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                  {t("formLabel")}
                </p>

                <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                  {t("formTitle")}
                </h2>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-px w-8 bg-[#c29a52]" />
                  <span
                    className="text-[10px] text-[#a77a32] dark:text-[#d8b56a]"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <span className="h-px w-8 bg-[#c29a52]" />
                </div>

                <p className="mt-3 max-w-lg text-sm leading-6 text-[#65584e] dark:text-[#c9bca9] sm:text-base">
                  {t("formDescription")}
                </p>
              </div>

              <div className="border border-[#d8c9a8] bg-white p-5 shadow-sm dark:border-[#4a3c34] dark:bg-[#241d19] sm:p-7">
                <ContactForm />
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="mb-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                  {t("mapLabel")}
                </p>

                <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                  {t("mapTitle")}
                </h2>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-px w-8 bg-[#c29a52]" />
                  <Church
                    className="h-4 w-4 text-[#a77a32] dark:text-[#d8b56a]"
                    aria-hidden="true"
                  />
                  <span className="h-px w-8 bg-[#c29a52]" />
                </div>

                <p className="mt-3 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9] sm:text-base">
                  {t("mapDescription")}
                </p>
              </div>

              {/* Map */}
              <div className="overflow-hidden border border-[#d8c9a8] bg-[#eee5d4] shadow-sm dark:border-[#4a3c34] dark:bg-[#241d19]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1239.3986304538553!2d83.833633710!3d23.554396526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398bc3f103dc7e15%3A0xaf598fbcc7eea5ac!2sHR3M%2BRG6%2C%20Balrampur%20-%20Chando%20-%20Kusmi%20Rd%2C%20Jodhpur%2C%20Nawadih%20Kalan%2C%20Chhattisgarh%20497119!5e1!3m2!1sen!2sin!4v1787728980551!5m2!1sen!2sin"
                  className="h-[300px] w-full border-0 sm:h-[400px] lg:h-[450px]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={t("mapIframeTitle")}
                />
              </div>

              {/* Address Card */}
              <div className="mt-4 flex gap-4 border border-[#d8c9a8] bg-white p-5 shadow-sm dark:border-[#4a3c34] dark:bg-[#241d19]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c29a52]/60 bg-[#f7f0e2] text-[#762f2f] dark:bg-[#342720] dark:text-[#d8b56a]">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-serif font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                    Jodhpur Church
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                    {t("fullAddress")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          PRAYER / HELP
      ===================================================== */}
      <section className="relative overflow-hidden border-t border-[#5d2828] bg-[#762f2f] text-[#fffaf0] dark:border-[#402020] dark:bg-[#4b2424]">

        {/* Decorative gold line */}
        <div
          className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
          aria-hidden="true"
        />

        {/* Decorative background */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#a35b45]/20 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d8b56a]/60 bg-[#fffaf0]/10 text-[#f0d08b]">
            <MessageCircle className="h-6 w-6" />
          </div>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f3dfbc]/75 sm:text-xs">
            {t("prayerLabel")}
          </p>

          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#fffaf0] sm:text-4xl">
            {t("prayerTitle")}
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-[#c29a52]" />
            <span
              className="text-[10px] text-[#d8b56a]"
              aria-hidden="true"
            >
              ✦
            </span>
            <span className="h-px w-8 bg-[#c29a52]" />
          </div>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#f3dfbc]/80 sm:text-base">
            {t("prayerDescription")}
          </p>

          <Link
            href={`/${locale}`}
            className="mt-7 inline-flex min-h-11 items-center gap-2 border border-[#d8b56a]/60 bg-[#fffaf0] px-6 py-3 text-sm font-semibold text-[#762f2f] shadow-sm transition hover:bg-[#f7f0e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#762f2f]"
          >
            {t("backHome")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}

