import Link from "next/link";
import {
    ArrowLeft,
    Church,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
} from "lucide-react";

export const metadata = {
    title: "Privacy Policy | Jodhpur Church",
    description:
        "Privacy Policy for Jodhpur Church, Balrampur, Chhattisgarh.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#fbf6eb] text-[#4b2823] dark:bg-[#1f1815] dark:text-[#f3dfbc]">
            {/* =========================================================
                PAGE HEADER
            ========================================================== */}
            <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]">
                <div
                    className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                    aria-hidden="true"
                />

                <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/40 to-transparent dark:from-[#5a4030]/20"
                    aria-hidden="true"
                />

                <div className="relative mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#d8b56a] bg-[#762f2f] text-[#f7e8c5] dark:border-[#806334]">
                            <ShieldCheck
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                                Jodhpur Church
                            </p>

                            <h1 className="mt-1 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                Privacy Policy
                            </h1>

                            <p className="mt-1 text-xs text-[#8b765f] dark:text-[#b9a897] sm:text-sm">
                                Last updated: September 5, 2026
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                CONTENT
            ========================================================== */}
            <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <article className="overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
                    {/* Decorative top line */}
                    <div
                        className="h-1 bg-[#c29a52]"
                        aria-hidden="true"
                    />

                    <div className="p-5 sm:p-8 lg:p-10">
                        <div className="min-w-0 space-y-7 text-sm leading-7 text-[#65584e] dark:text-[#c9bca9] sm:text-base">
                            {/* Introduction */}
                            <div className="border-b border-[#e3d7bf] pb-7 dark:border-[#40342e]">
                                <div className="mb-5 flex items-center gap-3">
                                    <Church
                                        className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                        aria-hidden="true"
                                    />

                                    <span className="font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                        Your Privacy Matters
                                    </span>
                                </div>

                                <p>
                                    Welcome to the official website of{" "}
                                    <strong className="font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                        Jodhpur Church
                                    </strong>
                                    , located in Jodhpur, Balrampur,
                                    Chhattisgarh, India.
                                </p>

                                <p className="mt-4">
                                    We respect your privacy and are committed
                                    to protecting any personal information that
                                    you may provide while using our website.
                                    This Privacy Policy explains what
                                    information we may collect, how we use it,
                                    and how we protect it.
                                </p>
                            </div>

                            {/* 1 */}
                            <PolicySection title="1. Information We Collect">
                                <p>
                                    We may collect information that you
                                    voluntarily provide when you contact us or
                                    use certain features of the website.
                                </p>

                                <p className="mt-4">
                                    This may include:
                                </p>

                                <PolicyList
                                    items={[
                                        "Your name",
                                        "Email address",
                                        "Phone number",
                                        "Message or enquiry details",
                                        "Other information that you voluntarily provide to us",
                                    ]}
                                />

                                <p className="mt-4">
                                    We do not intentionally collect sensitive
                                    personal information unless it is necessary
                                    for a specific service and you voluntarily
                                    provide it.
                                </p>
                            </PolicySection>

                            {/* 2 */}
                            <PolicySection title="2. How We Use Your Information">
                                <p>
                                    Information provided by visitors may be
                                    used to:
                                </p>

                                <PolicyList
                                    items={[
                                        "Respond to enquiries and messages",
                                        "Provide information about church activities",
                                        "Communicate information about events, services, or announcements",
                                        "Improve our website and services",
                                        "Maintain website security",
                                    ]}
                                />

                                <p className="mt-4">
                                    We do not sell, rent, or trade your
                                    personal information to third parties.
                                </p>
                            </PolicySection>

                            {/* 3 */}
                            <PolicySection title="3. Bible and Religious Content">
                                <p>
                                    The Bible section of this website is
                                    provided for personal, educational, and
                                    spiritual use. Bible texts, readings,
                                    references, and related materials may be
                                    provided from locally stored content or
                                    third-party services.
                                </p>

                                <p className="mt-4">
                                    The availability or accuracy of third-party
                                    services may change independently of
                                    Jodhpur Church.
                                </p>
                            </PolicySection>

                            {/* 4 */}
                            <PolicySection title="4. Cookies and Similar Technologies">
                                <p>
                                    Our website may use cookies or similar
                                    technologies when required for basic
                                    website functionality, security,
                                    preferences, or analytics.
                                </p>

                                <p className="mt-4">
                                    Cookies are small files stored on your
                                    device by your browser. You can control or
                                    disable cookies through your browser
                                    settings. Disabling certain cookies may
                                    affect some website functionality.
                                </p>
                            </PolicySection>

                            {/* 5 */}
                            <PolicySection title="5. Third-Party Services">
                                <p>
                                    Our website may use third-party services
                                    to provide certain functionality, such as
                                    hosting, maps, analytics, media, or other
                                    website features.
                                </p>

                                <p className="mt-4">
                                    These third-party services may process
                                    information according to their own privacy
                                    policies. We recommend reviewing the
                                    privacy policies of those services when
                                    appropriate.
                                </p>
                            </PolicySection>

                            {/* 6 */}
                            <PolicySection title="6. Google Maps and External Links">
                                <p>
                                    Our website may display Google Maps or
                                    links to external websites and social media
                                    platforms.
                                </p>

                                <p className="mt-4">
                                    When you follow an external link, you are
                                    leaving the Jodhpur Church website. We are
                                    not responsible for the privacy practices,
                                    content, or security of external websites.
                                </p>
                            </PolicySection>

                            {/* 7 */}
                            <PolicySection title="7. Data Security">
                                <p>
                                    We take reasonable measures to protect
                                    information provided through our website
                                    from unauthorized access, misuse,
                                    alteration, or disclosure.
                                </p>

                                <p className="mt-4">
                                    However, no method of transmission over the
                                    Internet or method of electronic storage is
                                    completely secure. Therefore, we cannot
                                    guarantee absolute security.
                                </p>
                            </PolicySection>

                            {/* 8 */}
                            <PolicySection title="8. Children's Privacy">
                                <p>
                                    Our website is intended for general use and
                                    is not specifically designed to collect
                                    personal information from children.
                                </p>

                                <p className="mt-4">
                                    We do not knowingly collect personal
                                    information from children without
                                    appropriate consent. If you believe that a
                                    child has provided personal information to
                                    us, please contact us so that we can take
                                    appropriate action.
                                </p>
                            </PolicySection>

                            {/* 9 */}
                            <PolicySection title="9. Your Privacy Choices">
                                <p>
                                    You may contact us if you would like to ask
                                    about personal information that you have
                                    provided to the church or request correction
                                    or deletion where applicable.
                                </p>

                                <p className="mt-4">
                                    Requests will be considered subject to
                                    applicable legal, administrative, and
                                    security requirements.
                                </p>
                            </PolicySection>

                            {/* 10 */}
                            <PolicySection title="10. Changes to This Privacy Policy">
                                <p>
                                    We may update this Privacy Policy from time
                                    to time to reflect changes in our website,
                                    services, or applicable requirements.
                                </p>

                                <p className="mt-4">
                                    Any changes will be posted on this page with
                                    an updated "Last updated" date.
                                </p>
                            </PolicySection>

                            {/* 11 */}
                            <PolicySection title="11. Contact Us">
                                <p>
                                    If you have any questions, concerns, or
                                    requests regarding this Privacy Policy,
                                    please contact Jodhpur Church.
                                </p>

                                {/* Contact card */}
                                <div className="mt-6 border border-[#d8c9a8] bg-[#f7f0e2] p-5 dark:border-[#4a3c34] dark:bg-[#241b18] sm:p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d8b56a] bg-[#762f2f] text-[#f7e8c5] dark:border-[#806334]">
                                            <Church
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                Jodhpur Church
                                            </p>

                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-start gap-2.5">
                                                    <MapPin
                                                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                                        aria-hidden="true"
                                                    />

                                                    <p className="min-w-0 text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                                        Jodhpur, Balrampur,
                                                        <br />
                                                        Chhattisgarh - 497119,
                                                        India
                                                    </p>
                                                </div>

                                                <div className="flex min-w-0 items-start gap-2.5">
                                                    <Mail
                                                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                                        aria-hidden="true"
                                                    />

                                                    <a
                                                        href="mailto:jodhpur.church@gmail.com"
                                                        className="min-w-0 break-words text-sm font-medium text-[#762f2f] hover:underline [overflow-wrap:anywhere] dark:text-[#d8b56a]"
                                                    >
                                                        jodhpur.church@gmail.com
                                                    </a>
                                                </div>

                                                <div className="flex items-start gap-2.5">
                                                    <Phone
                                                        className="mt-0.5 h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                                        aria-hidden="true"
                                                    />

                                                    <a
                                                        href="tel:+919340358685"
                                                        className="text-sm font-medium text-[#762f2f] hover:underline dark:text-[#d8b56a]"
                                                    >
                                                        +91 93403 58685
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PolicySection>

                            {/* Final note */}
                            <div className="border-t border-[#d8c9a8] pt-6 dark:border-[#4a3c34]">
                                <p className="text-sm leading-6 text-[#8b765f] dark:text-[#a99888]">
                                    By using this website, you acknowledge that
                                    you have read and understood this Privacy
                                    Policy.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom decorative line */}
                    <div
                        className="h-px bg-[#eadfc9] dark:bg-[#3d302a]"
                        aria-hidden="true"
                    />
                </article>

                {/* Back home */}
                <div className="mt-6">
                    <Link
                        href="/"
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#762f2f] transition-colors hover:text-[#a34b42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:text-[#d8b56a] dark:hover:text-[#f0d08b] dark:focus-visible:ring-offset-[#1f1815]"
                    >
                        <ArrowLeft
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                        Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
}

/* =========================================================
   REUSABLE POLICY SECTION
========================================================= */

function PolicySection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="min-w-0">
            <h2 className="font-serif text-xl font-semibold leading-snug text-[#4b2823] dark:text-[#f3dfbc] sm:text-2xl">
                {title}
            </h2>

            <div className="mt-3 min-w-0">{children}</div>
        </section>
    );
}

/* =========================================================
   POLICY LIST
========================================================= */

function PolicyList({ items }: { items: string[] }) {
    return (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[#65584e] marker:text-[#c29a52] dark:text-[#c9bca9]">
            {items.map((item) => (
                <li
                    key={item}
                    className="pl-1 break-words [overflow-wrap:anywhere]"
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}