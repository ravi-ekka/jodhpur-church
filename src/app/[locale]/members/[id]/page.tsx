import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    GraduationCap,
    Heart,
    Languages,
    MapPin,
    Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getPublicMember } from "@/lib/members/members";
import ShareButton from "@/components/common/ShareButton";

type Props = {
    params: Promise<{
        locale: string;
        id: string;
    }>;
};

function getFullName(member: {
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
}) {
    return [
        member.title,
        member.firstName,
        member.middleName,
        member.lastName,
    ]
        .filter(Boolean)
        .join(" ");
}

export default async function MemberProfilePage({
    params,
}: Props) {
    const { locale, id } = await params;

    const t = await getTranslations({
        locale,
        namespace: "memberProfile",
    });

    const member = await getPublicMember(id);

    if (!member) {
        notFound();
    }

    const name = getFullName(member);

    return (
        <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#fbf6ea] text-[#3f3029] dark:bg-[#1f1714] dark:text-[#f2e5cf]">
            {/* Compact Page Header */}

            <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]">
                <div
                    className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                    aria-hidden="true"
                />

                <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/40 to-transparent dark:from-[#5a4030]/20"
                    aria-hidden="true"
                />

                <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                    <div className="relative flex min-h-10 items-center gap-3">
                        {/* BACK */}

                        <Link
                            href={`/${locale}/members`}
                            className="group inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-[#762f2f] transition-colors hover:text-[#a34b42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:text-[#d8b56a] dark:hover:text-[#f0d08b] dark:focus-visible:ring-offset-[#241b18]"
                        >
                            <ArrowLeft
                                className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1"
                                aria-hidden="true"
                            />

                            <span className="hidden sm:inline">
                                {t("back")}
                            </span>

                            <span className="sm:hidden">
                                {t("backShort")}
                            </span>
                        </Link>

                        <span
                            className="h-6 w-px shrink-0 bg-[#d8c9a8] dark:bg-[#4a3c34]"
                            aria-hidden="true"
                        />

                        {/* MEMBERS */}

                        <div className="flex min-w-0 items-center gap-2">
                            <Users
                                className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                aria-hidden="true"
                            />

                            <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-sm">
                                {t("members")}
                            </p>
                        </div>

                        {/* SHARE */}
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 sm:-right-3 lg:-right-6">
                            <ShareButton
                                title={name}
                                text={t("shareText")}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile */}

            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <div className="min-w-0 overflow-hidden border border-[#d8c9a8] bg-[#fffaf0] shadow-sm dark:border-[#4a3c34] dark:bg-[#241b18]">
                    <div className="grid min-w-0 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
                        {/* Photo */}

                        <div className="relative aspect-[4/5] min-w-0 overflow-hidden bg-[#eee3ce] dark:bg-[#30241f] lg:aspect-auto lg:min-h-[520px]">
                            {member.photoUrl ? (
                                <img
                                    src={member.photoUrl}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full min-h-[420px] items-center justify-center">
                                    <Users className="h-28 w-28 text-[#8b765f]/25 dark:text-[#c9bca9]/20" />
                                </div>
                            )}

                            <div
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[#c29a52]"
                                aria-hidden="true"
                            />
                        </div>

                        {/* Main Information */}

                        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-9 lg:p-12">
                            <div className="inline-flex w-fit max-w-full items-center gap-2 border border-[#d8c9a8] bg-[#f7f0e2] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#762f2f] dark:border-[#4a3c34] dark:bg-[#30241f] dark:text-[#d8b56a]">
                                <Heart
                                    className="h-4 w-4 shrink-0 fill-current"
                                    aria-hidden="true"
                                />

                                <span className="truncate">
                                    {t("family")}
                                </span>
                            </div>

                            <p className="mt-6 break-words text-xs font-semibold uppercase tracking-[0.16em] text-[#8b765f] dark:text-[#c9bca9]">
                                {member.designation ||
                                    member.serviceRole ||
                                    t("member")}
                            </p>

                            <h1 className="mt-2 break-words font-serif text-3xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-4xl lg:text-5xl">
                                {name}
                            </h1>

                            {member.serviceRole && (
                                <p className="mt-3 break-words text-base leading-7 text-[#65584e] dark:text-[#c9bca9] sm:text-lg">
                                    {member.serviceRole}
                                </p>
                            )}

                            <div className="my-7 h-px w-full bg-[#d8c9a8] dark:bg-[#4a3c34]" />

                            <div className="min-w-0 space-y-5">
                                {member.congregation && (
                                    <InfoRow
                                        icon={
                                            <MapPin className="h-5 w-5" />
                                        }
                                        label={t("congregation")}
                                        value={member.congregation}
                                    />
                                )}

                                {member.diocese && (
                                    <InfoRow
                                        icon={
                                            <MapPin className="h-5 w-5" />
                                        }
                                        label={t("diocese")}
                                        value={member.diocese}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details */}

            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
                <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
                    {/* Left Column */}

                    <div className="min-w-0 space-y-6">
                        {member.bio && (
                            <InfoSection
                                icon={
                                    <Heart className="h-5 w-5" />
                                }
                                title={t("about")}
                            >
                                <p className="break-words whitespace-pre-line text-sm leading-7 text-[#65584e] dark:text-[#c9bca9] sm:text-base sm:leading-8">
                                    {member.bio}
                                </p>
                            </InfoSection>
                        )}

                        {(member.responsibility ||
                            member.ordinationYear ||
                            member.professionYear ||
                            member.joinedParishYear) && (
                                <InfoSection
                                    icon={
                                        <Users className="h-5 w-5" />
                                    }
                                    title={t("service")}
                                >
                                    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                                        {member.responsibility && (
                                            <DetailBox
                                                label={t("responsibility")}
                                                value={
                                                    member.responsibility
                                                }
                                            />
                                        )}

                                        {member.ordinationYear && (
                                            <DetailBox
                                                label={t("ordination")}
                                                value={String(
                                                    member.ordinationYear
                                                )}
                                                icon={
                                                    <CalendarDays className="h-4 w-4" />
                                                }
                                            />
                                        )}

                                        {member.professionYear && (
                                            <DetailBox
                                                label={t("profession")}
                                                value={String(
                                                    member.professionYear
                                                )}
                                                icon={
                                                    <CalendarDays className="h-4 w-4" />
                                                }
                                            />
                                        )}

                                        {member.joinedParishYear && (
                                            <DetailBox
                                                label={t("joinedParish")}
                                                value={String(
                                                    member.joinedParishYear
                                                )}
                                                icon={
                                                    <CalendarDays className="h-4 w-4" />
                                                }
                                            />
                                        )}
                                    </div>
                                </InfoSection>
                            )}
                    </div>

                    {/* Right Column */}

                    <div className="min-w-0 space-y-6">
                        {(member.qualification ||
                            member.languages.length > 0) && (
                                <InfoSection
                                    icon={
                                        <GraduationCap className="h-5 w-5" />
                                    }
                                    title={t("education")}
                                >
                                    {member.qualification && (
                                        <DetailBox
                                            label={t("qualification")}
                                            value={
                                                member.qualification
                                            }
                                        />
                                    )}

                                    {member.languages.length > 0 && (
                                        <div className="mt-5 min-w-0">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                <Languages
                                                    className="h-4 w-4 shrink-0 text-[#762f2f] dark:text-[#d8b56a]"
                                                />

                                                <span>
                                                    {t("languages")}
                                                </span>
                                            </div>

                                            <div className="flex min-w-0 flex-wrap gap-2">
                                                {member.languages.map(
                                                    (language) => (
                                                        <span
                                                            key={language}
                                                            className="max-w-full break-words border border-[#d8c9a8] bg-[#f7f0e2] px-3 py-1.5 text-sm text-[#5d4c40] dark:border-[#4a3c34] dark:bg-[#30241f] dark:text-[#d8cbb8]"
                                                        >
                                                            {language}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </InfoSection>
                            )}

                        {(member.bibleVerse ||
                            member.bibleReference) && (
                                <section className="relative min-w-0 overflow-hidden border border-[#6d2929] bg-[#762f2f] p-6 text-[#fffaf0] shadow-sm sm:p-7 dark:border-[#8b4a42] dark:bg-[#542622]">
                                    <div
                                        className="absolute inset-x-0 top-0 h-1 bg-[#d8b56a]"
                                        aria-hidden="true"
                                    />

                                    <BookOpen
                                        className="mb-5 h-7 w-7 text-[#d8b56a]"
                                        aria-hidden="true"
                                    />

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ead9b6]">
                                        {t("bible")}
                                    </p>

                                    {member.bibleVerse && (
                                        <blockquote className="mt-4 break-words font-serif text-lg leading-8 sm:text-xl">
                                            “{member.bibleVerse}”
                                        </blockquote>
                                    )}

                                    {member.bibleReference && (
                                        <p className="mt-5 break-words text-sm font-semibold text-[#ead9b6]">
                                            {member.bibleReference}
                                        </p>
                                    )}
                                </section>
                            )}
                    </div>
                </div>

                <div
                    className="mt-12 text-center text-[#c29a52]"
                    aria-hidden="true"
                >
                    ✦
                </div>
            </section>
        </main>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 shrink-0 text-[#762f2f] dark:text-[#d8b56a]">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b765f] dark:text-[#c9bca9]">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-[#4b3b32] dark:text-[#eee1cc] sm:text-base">
                    {value}
                </p>
            </div>
        </div>
    );
}

function InfoSection({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="min-w-0 overflow-hidden border border-[#d8c9a8] bg-[#fffaf0] p-5 shadow-sm sm:p-7 dark:border-[#4a3c34] dark:bg-[#241b18]">
            <div className="mb-5 flex min-w-0 items-center gap-3">
                <div className="shrink-0 border border-[#d8c9a8] bg-[#f7f0e2] p-2 text-[#762f2f] dark:border-[#4a3c34] dark:bg-[#30241f] dark:text-[#d8b56a]">
                    {icon}
                </div>

                <div className="min-w-0">
                    <h2 className="break-words font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                        {title}
                    </h2>

                    <div
                        className="mt-2 h-px w-12 bg-[#c29a52]"
                        aria-hidden="true"
                    />
                </div>
            </div>

            {children}
        </section>
    );
}

function DetailBox({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="min-w-0 overflow-hidden border border-[#d8c9a8] bg-[#f7f0e2] p-4 dark:border-[#4a3c34] dark:bg-[#30241f]">
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b765f] dark:text-[#c9bca9]">
                <span className="shrink-0">
                    {icon}
                </span>

                <span className="min-w-0 break-words">
                    {label}
                </span>
            </div>

            <p className="mt-2 break-words text-sm font-medium leading-6 text-[#4b3b32] dark:text-[#eee1cc]">
                {value}
            </p>
        </div>
    );
}

