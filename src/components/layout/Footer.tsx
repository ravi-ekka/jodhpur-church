import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { ChurchSettings } from "@/lib/settings/church-settings";
import {
  Church,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";

const Footer = async ({
  settings,
}: {
  settings: ChurchSettings;
}) => {
  const locale = await getLocale();
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-[#c8a55c]/30 bg-[#241714] text-[#eadfce] dark:bg-[#17110f]">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14">

          {/* Church Information */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="group inline-flex items-center gap-3"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d1ad61]/60 bg-[#321d18] text-[#d8b56a] shadow-sm transition-colors group-hover:border-[#e2c27b]"
                aria-hidden="true"
              >
                <Church className="h-5 w-5" strokeWidth={1.7} />
              </span>

              <span className="font-serif text-2xl font-semibold tracking-tight text-[#fff8ec] transition-colors group-hover:text-[#e2c27b]">
                {settings.churchName}
              </span>
            </Link>

            {/* Decorative line */}
            <div className="mt-5 flex items-center gap-2">
              <span className="h-px w-10 bg-[#c29a52]" />

              <span
                className="text-xs text-[#d8b56a]"
                aria-hidden="true"
              >
                ✦
              </span>

              <span className="h-px w-16 bg-[#c29a52]/50" />
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#c9bca9]">
              {t("description")}
            </p>

            <Link
              href={`/${locale}/about`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#8e6b35]/60 px-4 py-2 text-sm font-medium text-[#e5c982] transition-colors hover:border-[#d8b56a] hover:bg-[#352019] hover:text-[#fff1d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#241714]"
            >
              {t("about")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <FooterHeading>
              {t("quickLinks")}
            </FooterHeading>

            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 sm:gap-x-6 lg:grid-cols-1 lg:gap-x-0">
              <FooterLink href={`/${locale}`}>
                {t("home")}
              </FooterLink>

              <FooterLink href={`/${locale}/about`}>
                {t("about")}
              </FooterLink>

              <FooterLink href={`/${locale}/bible`}>
                {t("bible")}
              </FooterLink>

              <FooterLink href={`/${locale}/gallery`}>
                {t("gallery")}
              </FooterLink>

              <FooterLink href={`/${locale}/events`}>
                {t("events")}
              </FooterLink>

              <FooterLink href={`/${locale}/notifications`}>
                {t("notifications")}
              </FooterLink>

              <FooterLink href={`/${locale}/sermons`}>
                {t("sermons")}
              </FooterLink>

              <FooterLink href={`/${locale}/blog`}>
                {t("blog")}
              </FooterLink>

              <FooterLink href={`/${locale}/contact`}>
                {t("contact")}
              </FooterLink>
            </ul>
          </div>

          {/* Church Information */}
          <div>
            <FooterHeading>
              {t("churchInfo")}
            </FooterHeading>

            <div className="mt-5 space-y-6 text-sm">

              {/* Sunday Worship */}
              <div>
                <p className="font-medium text-[#fff8ec]">
                  {t("sundayWorship")}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="h-px w-5 shrink-0 bg-[#c29a52]"
                    aria-hidden="true"
                  />

                  <p className="text-[#c9bca9]">
                    {settings.sundayWorship}
                  </p>
                </div>
              </div>

              {/* Events */}
              <div>
                <p className="font-medium text-[#fff8ec]">
                  {t("events")}
                </p>

                <Link
                  href={`/${locale}/events`}
                  className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-[#c9bca9] transition-colors hover:text-[#e5c982] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a]"
                >
                  {t("viewEvents")}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Sermons */}
              <div>
                <p className="font-medium text-[#fff8ec]">
                  {t("sermons")}
                </p>

                <Link
                  href={`/${locale}/sermons`}
                  className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-[#c9bca9] transition-colors hover:text-[#e5c982] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a]"
                >
                  {t("watchSermons")}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>
              {t("contactTitle")}
            </FooterHeading>

            <div className="mt-5 space-y-6 text-sm">

              {/* Address */}
              <div className="flex items-start gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8e6b35]/50 bg-[#321d18] text-[#d8b56a]"
                  aria-hidden="true"
                >
                  <MapPin className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#fff8ec]">
                    {t("address")}
                  </p>

                  <p className="mt-1 break-words leading-6 text-[#c9bca9]">
                    {settings.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8e6b35]/50 bg-[#321d18] text-[#d8b56a]"
                  aria-hidden="true"
                >
                  <Phone className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#fff8ec]">
                    {t("phone")}
                  </p>

                  <a
                    href="tel:+919340358685"
                    className="mt-1 inline-flex min-h-9 items-center text-[#c9bca9] transition-colors hover:text-[#e5c982] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a]"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8e6b35]/50 bg-[#321d18] text-[#d8b56a]"
                  aria-hidden="true"
                >
                  <Mail className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#fff8ec]">
                    {t("email")}
                  </p>

                  <a
                    href="mailto:jodhpur.church@gmail.com"
                    className="mt-1 block break-all leading-6 text-[#c9bca9] transition-colors hover:text-[#e5c982] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a]"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#c8a55c]/15 bg-[#1d1210]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">

          <p className="text-xs leading-5 text-[#9f9182] sm:text-sm">
            {t("copyright")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm md:justify-end">

            <Link
              href={`/${locale}/privacy`}
              className="inline-flex min-h-9 items-center text-[#9f9182] transition-colors hover:text-[#e5c982] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a]"
            >
              {t("privacy")}
            </Link>

            <span
              className="hidden h-3 w-px bg-[#8e6b35]/50 sm:block"
              aria-hidden="true"
            />

            <Link
              href={`/${locale}/terms`}
              className="inline-flex min-h-9 items-center text-[#9f9182] transition-colors hover:text-[#e5c982] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a]"
            >
              {t("terms")}
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

function FooterHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-serif text-lg font-semibold text-[#fff8ec]">
        {children}
      </h3>

      <div className="mt-3 flex items-center gap-2">
        <span className="h-px w-7 bg-[#c29a52]" />

        <span
          className="text-[10px] text-[#d8b56a]"
          aria-hidden="true"
        >
          ✦
        </span>

        <span className="h-px w-5 bg-[#c29a52]/40" />
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex min-h-10 items-center text-sm text-[#c9bca9] transition-colors hover:text-[#e5c982] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a]"
      >
        <span
          className="mr-2 h-px w-0 bg-[#c29a52] transition-all duration-200 group-hover:w-3"
          aria-hidden="true"
        />

        {children}
      </Link>
    </li>
  );
}

export default Footer;