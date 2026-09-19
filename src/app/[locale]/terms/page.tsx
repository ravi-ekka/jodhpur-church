import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Church,
  FileText,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Jodhpur Church",
  description:
    "Terms and Conditions for using the Jodhpur Church website.",
};

type SectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
};

function TermsSection({ number, title, children }: SectionProps) {
  return (
    <section className="scroll-mt-24">
      <div className="flex items-start gap-3">
        <div
          className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c29a52] bg-[#f7ecd7] text-xs font-semibold text-[#762f2f] dark:bg-[#3a2922] dark:text-[#d8b56a]"
          aria-hidden="true"
        >
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-xl font-semibold leading-snug text-[#4b2823] dark:text-[#f3dfbc] sm:text-2xl">
            {title}
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-7 text-[#65584e] dark:text-[#c9bca9]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f0e2] text-[#3f302b] dark:bg-[#1d1715] dark:text-[#f3dfbc]">
      {/* Top accent */}
      <div
        className="h-1 bg-[#c29a52]"
        aria-hidden="true"
      />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#fffaf0] dark:border-[#40342e] dark:bg-[#241b18]">
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/35 to-transparent dark:from-[#5a4030]/20"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <Link
              href="/"
              className="group flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-[#762f2f] transition-colors hover:text-[#a34b42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:text-[#d8b56a] dark:hover:text-[#f0d08b] dark:focus-visible:ring-offset-[#241b18]"
            >
              <ArrowLeft
                className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />

              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <span
              className="mt-1 h-6 w-px shrink-0 bg-[#d8c9a8] sm:mt-0 dark:bg-[#4a3c34]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                Jodhpur Church
              </p>

              <h1 className="mt-1 flex items-center gap-2 font-serif text-xl font-semibold leading-snug text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                <FileText
                  className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a] sm:h-6 sm:w-6"
                  aria-hidden="true"
                />
                <span>Terms and Conditions</span>
              </h1>

              <p className="mt-1 text-xs text-[#8b765f] dark:text-[#a89580] sm:text-sm">
                Last updated: September 5, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <article className="overflow-hidden rounded-2xl border border-[#d8c9a8] bg-[#fffaf0] shadow-[0_12px_40px_rgba(76,43,35,0.08)] dark:border-[#493a32] dark:bg-[#251c19] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
          {/* Intro */}
          <div className="border-b border-[#e1d4bb] px-5 py-6 sm:px-8 sm:py-8 dark:border-[#493a32] lg:px-10">
            <div className="flex items-start gap-4">
              <div className="hidden shrink-0 sm:flex h-11 w-11 items-center justify-center rounded-full border border-[#c29a52] bg-[#f7ecd7] text-[#762f2f] dark:bg-[#3a2922] dark:text-[#d8b56a]">
                <ShieldCheck
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm leading-7 text-[#65584e] dark:text-[#c9bca9]">
                  Welcome to the official website of{" "}
                  <strong className="font-semibold text-[#4b2823] dark:text-[#ead8bb]">
                    Jodhpur Church
                  </strong>
                  , located in Jodhpur, Balrampur, Chhattisgarh, India.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#65584e] dark:text-[#c9bca9]">
                  By accessing or using this website, you agree to comply with
                  these Terms and Conditions. If you do not agree with any part
                  of these terms, please do not use the website.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            <div className="space-y-9">
              <TermsSection number="1" title="Use of the Website">
                <p>
                  This website is provided to share information about Jodhpur
                  Church, its activities, events, services, announcements,
                  Bible resources, and other community-related information.
                </p>

                <p>
                  You agree to use this website only for lawful purposes and
                  in a manner that does not interfere with the operation or
                  security of the website.
                </p>
              </TermsSection>

              <TermsSection number="2" title="Website Content">
                <p>
                  Content available on this website may include text,
                  photographs, graphics, videos, church announcements, event
                  information, Bible references, and other materials.
                </p>

                <p>
                  We make reasonable efforts to keep information accurate and
                  up to date. However, church schedules, events, announcements,
                  and other information may change without prior notice.
                </p>
              </TermsSection>

              <TermsSection number="3" title="Bible and Religious Resources">
                <p>
                  The Bible and religious resources provided on this website
                  are intended for spiritual, educational, and personal use.
                </p>

                <p>
                  Bible references and readings may be obtained from locally
                  stored resources or third-party services. We do not guarantee
                  that every reference, translation, or reading will always be
                  available or error-free.
                </p>
              </TermsSection>

              <TermsSection number="4" title="Events and Service Information">
                <p>
                  Information regarding worship services, prayer meetings,
                  Bible studies, church events, and other activities is
                  provided for general information.
                </p>

                <p>
                  Event dates, times, locations, and schedules may change.
                  Please contact the church directly when confirmation is
                  important.
                </p>
              </TermsSection>

              <TermsSection number="5" title="Intellectual Property">
                <p>
                  Unless otherwise stated, the original website design, text,
                  graphics, logos, photographs, and other original materials
                  published by Jodhpur Church are protected by applicable
                  intellectual property laws.
                </p>

                <p>
                  You may view and use the website for personal and
                  non-commercial purposes. You should not reproduce, modify,
                  distribute, or commercially exploit original website content
                  without appropriate permission.
                </p>
              </TermsSection>

              <TermsSection number="6" title="Photographs and Gallery">
                <p>
                  The website may contain photographs and videos from church
                  services, events, celebrations, and community activities.
                </p>

                <p>
                  If you believe that a photograph or other content published
                  on the website should be removed because of a legitimate
                  privacy or rights-related concern, please contact us.
                </p>
              </TermsSection>

              <TermsSection number="7" title="User Submissions">
                <p>
                  If the website provides contact forms or other communication
                  features, you agree not to submit content that is unlawful,
                  abusive, threatening, misleading, defamatory, or otherwise
                  inappropriate.
                </p>

                <p>
                  You should not submit confidential or sensitive information
                  through a general contact form unless specifically requested.
                </p>
              </TermsSection>

              <TermsSection number="8" title="External Links and Services">
                <p>
                  The website may contain links to external websites, social
                  media platforms, maps, videos, or other third-party services.
                </p>

                <p>
                  These external services are operated independently. Jodhpur
                  Church is not responsible for the content, availability,
                  security, or privacy practices of third-party websites and
                  services.
                </p>
              </TermsSection>

              <TermsSection number="9" title="Website Availability">
                <p>
                  We aim to keep the website available and functional, but we
                  do not guarantee that the website will always be available,
                  uninterrupted, secure, or free from errors.
                </p>

                <p>
                  We may temporarily suspend or modify parts of the website
                  for maintenance, updates, security, or other reasons.
                </p>
              </TermsSection>

              <TermsSection number="10" title="Disclaimer">
                <p>
                  The information on this website is provided on an{" "}
                  <strong className="font-semibold text-[#4b2823] dark:text-[#ead8bb]">
                    &quot;as is&quot;
                  </strong>{" "}
                  and{" "}
                  <strong className="font-semibold text-[#4b2823] dark:text-[#ead8bb]">
                    &quot;as available&quot;
                  </strong>{" "}
                  basis.
                </p>

                <p>
                  While we make reasonable efforts to provide accurate
                  information, we do not guarantee that all content will always
                  be complete, accurate, current, or error-free.
                </p>
              </TermsSection>

              <TermsSection number="11" title="Limitation of Liability">
                <p>
                  To the extent permitted by applicable law, Jodhpur Church
                  shall not be responsible for losses or damages arising from
                  the use of, or inability to use, this website or information
                  provided through the website.
                </p>
              </TermsSection>

              <TermsSection number="12" title="Changes to These Terms">
                <p>
                  We may update these Terms and Conditions from time to time.
                  Changes will be published on this page with an updated
                  &quot;Last updated&quot; date.
                </p>

                <p>
                  Your continued use of the website after changes are
                  published means that you accept the updated terms.
                </p>
              </TermsSection>

              <TermsSection number="13" title="Governing Law">
                <p>
                  These Terms and Conditions shall be interpreted in accordance
                  with the applicable laws of India.
                </p>

                <p>
                  Any legal matters relating to the use of this website shall
                  be subject to the jurisdiction of the appropriate courts, as
                  applicable.
                </p>
              </TermsSection>

              <TermsSection number="14" title="Contact Us">
                <p>
                  If you have any questions regarding these Terms and
                  Conditions, please contact Jodhpur Church.
                </p>

                <div className="mt-5 overflow-hidden rounded-xl border border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#493a32] dark:bg-[#211916]">
                  <div className="border-b border-[#d8c9a8] px-4 py-3 dark:border-[#493a32]">
                    <div className="flex items-center gap-2">
                      <Church
                        className="h-5 w-5 text-[#762f2f] dark:text-[#d8b56a]"
                        aria-hidden="true"
                      />

                      <p className="font-serif font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                        Jodhpur Church
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 px-4 py-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                        aria-hidden="true"
                      />

                      <p className="leading-6 text-[#65584e] dark:text-[#c9bca9]">
                        Jodhpur, Balrampur,
                        <br />
                        Chhattisgarh - 497119, India
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                        aria-hidden="true"
                      />

                      <a
                        href="mailto:jodhpur.church@gmail.com"
                        className="min-w-0 break-all font-medium text-[#762f2f] hover:underline dark:text-[#d8b56a]"
                      >
                        jodhpur.church@gmail.com
                      </a>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                        aria-hidden="true"
                      />

                      <a
                        href="tel:+919340358685"
                        className="font-medium text-[#762f2f] hover:underline dark:text-[#d8b56a]"
                      >
                        +91 93403 58685
                      </a>
                    </div>
                  </div>
                </div>
              </TermsSection>
            </div>
          </div>

          {/* Bottom note */}
          <div className="border-t border-[#e1d4bb] bg-[#f7f0e2]/70 px-5 py-5 dark:border-[#493a32] dark:bg-[#211916]/70 sm:px-8 lg:px-10">
            <div className="flex items-start gap-3">
              <Scale
                className="mt-0.5 h-4 w-4 shrink-0 text-[#c29a52]"
                aria-hidden="true"
              />

              <p className="text-xs leading-6 text-[#75665a] dark:text-[#a89580]">
                By accessing and using the Jodhpur Church website, you
                acknowledge that you have read, understood, and agreed to these
                Terms and Conditions.
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}