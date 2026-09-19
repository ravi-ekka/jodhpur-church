import Link from "next/link";
import {
    ArrowRight,
    Heart,
    Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getBaseUrl } from "@/lib/site-url";
import ShareButton from "@/components/common/ShareButton";
export const instant = false
type Props = {
    params: Promise<{
        locale: string;
    }>;
};

type PublicMember = {
    id: string;
    memberId: string;

    type:
        | "priest"
        | "sister"
        | "brother"
        | "lay_person";

    title: string;

    firstName: string;
    middleName: string;
    lastName: string;

    designation: string;
    serviceRole: string;

    congregation: string;
    diocese: string;

    photoUrl: string;
    photoPublicId: string;

    ordinationYear: number | null;
    professionYear: number | null;
    joinedParishYear: number | null;

    responsibility: string;

    languages: string[];

    qualification: string;

    bio: string;

    bibleVerse: string;
    bibleReference: string;

    isActive: boolean;
    showOnWebsite: boolean;

    displayOrder: number;
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

function MemberCard({
    member,
    locale,
    viewProfile,
    churchMember,
}: {
    member: PublicMember;
    locale: string;
    viewProfile: string;
    churchMember: string;
}) {
    const name = getFullName(member);

    return (
        <Link
            href={`/${locale}/members/${member.id}`}
            className="group block"
        >
            <article className="overflow-hidden border border-[#d8c9a8] bg-[#fffaf0] shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#c29a52] dark:border-[#4a3c34] dark:bg-[#241b18]">
                {/* PHOTO */}

                <div className="relative aspect-[4/5] overflow-hidden bg-[#eee4d2] dark:bg-[#2a211d]">
                    {member.photoUrl ? (
                        <img
                            src={member.photoUrl}
                            alt={name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Users className="h-20 w-20 text-[#b7a991] dark:text-[#63564b]" />
                        </div>
                    )}

                    {/* WARM OVERLAY */}

                    <div
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2a1210]/70 to-transparent"
                        aria-hidden="true"
                    />

                    {/* GOLD LINE */}

                    <div
                        className="absolute inset-x-0 bottom-0 h-1 bg-[#c29a52]"
                        aria-hidden="true"
                    />

                    {/* VIEW PROFILE */}

                    <div className="absolute inset-x-3 bottom-4 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-4">
                        <div className="flex min-h-10 items-center justify-center gap-2 border border-[#f3dfbc]/60 bg-[#762f2f] px-4 text-sm font-semibold text-[#fffaf0] shadow-lg dark:bg-[#8a3b3b]">
                            {viewProfile}

                            <ArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>

                {/* CONTENT */}

                <div className="p-4 sm:p-5">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b765f] dark:text-[#c9bca9]">
                        {member.designation ||
                            member.serviceRole ||
                            churchMember}
                    </p>

                    <h3 className="font-serif text-lg font-semibold leading-snug text-[#4b2823] dark:text-[#f3dfbc]">
                        {name}
                    </h3>

                    {member.congregation && (
                        <p className="mt-2 line-clamp-1 text-sm text-[#6b5b50] dark:text-[#a99583]">
                            {member.congregation}
                        </p>
                    )}

                    <div className="mt-4 flex min-h-10 items-center gap-1 text-sm font-semibold text-[#762f2f] dark:text-[#d8b56a]">
                        <span>{viewProfile}</span>

                        <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </article>
        </Link>
    );
}

function MemberSection({
    title,
    description,
    members,
    locale,
    viewProfile,
    churchMember,
}: {
    title: string;
    description: string;
    members: PublicMember[];
    locale: string;
    viewProfile: string;
    churchMember: string;
}) {
    return (
        <section>
            {/* SECTION HEADING */}

            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-4">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                            {title}
                        </p>

                        <h2 className="mt-1 font-serif text-xl font-semibold leading-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-2xl">
                            {description}
                        </h2>
                    </div>

                    <div className="hidden h-px flex-1 bg-[#d8c9a8] sm:block dark:bg-[#4a3c34]" />
                </div>

                <div className="mt-3 h-px w-16 bg-[#c29a52]" />
            </div>

            {/* CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member) => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        locale={locale}
                        viewProfile={viewProfile}
                        churchMember={churchMember}
                    />
                ))}
            </div>
        </section>
    );
}

export default async function MembersPage({
    params,
}: Props) {
    const { locale } = await params;

    const t = await getTranslations({
        locale,
        namespace: "members",
    });

    const baseUrl = await getBaseUrl();

    const response = await fetch(
        `${baseUrl}/api/members`,
        {
            next: {
                revalidate: 604800,
                tags: ["church-members"],
            },
        }
    );

    if (!response.ok) {
        return (
            <main className="min-h-screen bg-[#fbf7ef] dark:bg-[#171210]">
                <section className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
                    <p className="text-[#65584e] dark:text-[#c9bca9]">
                        {t("noMembers")}
                    </p>
                </section>
            </main>
        );
    }

    const data = await response.json();

    const members: PublicMember[] =
        data.members ?? [];

    const priests = members.filter(
        (member) => member.type === "priest"
    );

    const sisters = members.filter(
        (member) => member.type === "sister"
    );

    const brothers = members.filter(
        (member) => member.type === "brother"
    );

    const leaders = members.filter(
        (member) => member.type === "lay_person"
    );

    return (
        <main className="min-h-screen bg-[#fbf7ef] dark:bg-[#171210]">
            {/* PAGE HEADER */}

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
                        <div className="min-w-0 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                                {t("label")}
                            </p>

                            <h1 className="mt-1 flex items-center justify-center gap-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                <Heart
                                    className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a] sm:h-6 sm:w-6"
                                    aria-hidden="true"
                                />

                                <span>{t("title")}</span>
                            </h1>

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

            {/* MEMBERS */}

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                {members.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <div className="w-full max-w-md border border-dashed border-[#cdbd9d] bg-[#fffaf0] px-6 py-10 text-center dark:border-[#51443a] dark:bg-[#241b18]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52]/50 text-[#762f2f] dark:text-[#d8b56a]">
                                <Users
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="mt-4 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                {t("noMembers")}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 sm:space-y-16">
                        {priests.length > 0 && (
                            <MemberSection
                                title={t("priests")}
                                description={t("priestDescription")}
                                members={priests}
                                locale={locale}
                                viewProfile={t("viewProfile")}
                                churchMember={t("churchMember")}
                            />
                        )}

                        {sisters.length > 0 && (
                            <MemberSection
                                title={t("sisters")}
                                description={t("sisterDescription")}
                                members={sisters}
                                locale={locale}
                                viewProfile={t("viewProfile")}
                                churchMember={t("churchMember")}
                            />
                        )}

                        {brothers.length > 0 && (
                            <MemberSection
                                title={t("brothers")}
                                description={t("brotherDescription")}
                                members={brothers}
                                locale={locale}
                                viewProfile={t("viewProfile")}
                                churchMember={t("churchMember")}
                            />
                        )}

                        {leaders.length > 0 && (
                            <MemberSection
                                title={t("leaders")}
                                description={t("leaderDescription")}
                                members={leaders}
                                locale={locale}
                                viewProfile={t("viewProfile")}
                                churchMember={t("churchMember")}
                            />
                        )}

                        {/* BOTTOM DECORATION */}

                        <div className="flex items-center justify-center gap-3 pt-2 text-[#c29a52]">
                            <span
                                className="h-px w-12 bg-[#c29a52]/60"
                                aria-hidden="true"
                            />

                            <span
                                className="text-sm"
                                aria-hidden="true"
                            >
                                ✦
                            </span>

                            <span
                                className="h-px w-12 bg-[#c29a52]/60"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}