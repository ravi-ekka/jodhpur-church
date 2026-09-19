"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  CheckCircle2,
  Church,
  Loader2,
  MailCheck,
} from "lucide-react";
import { applyActionCode } from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

type VerificationStatus = "loading" | "success" | "error";

export default function VerifyEmailActionPage() {
  const t = useTranslations("auth");

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const locale = params.locale as string;

  const [status, setStatus] = useState<VerificationStatus>("loading");

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    if (mode !== "verifyEmail" || !oobCode) {
      setStatus("error");
      return;
    }

    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    const verifyEmail = async () => {
      try {
        await applyActionCode(auth, oobCode);

        setStatus("success");

        redirectTimer = setTimeout(() => {
          router.push(`/${locale}/verify-email`);
        }, 1500);
      } catch (error: unknown) {
        console.error("Email verification failed:", error);

        setStatus("error");
      }
    };

    void verifyEmail();

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [locale, router, searchParams]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f0e2] px-4 py-8 text-[#3f302b] dark:bg-[#1d1715] dark:text-[#f3dfbc] sm:px-6">
      {/* Top gold accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
        aria-hidden="true"
      />

      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d8c9a8]/25 dark:bg-[#6b4a37]/10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#ead9b6]/30 dark:bg-[#5a4030]/10"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-[#d8c9a8] bg-[#fffaf0] shadow-[0_18px_50px_rgba(76,43,35,0.12)] dark:border-[#493a32] dark:bg-[#251c19] dark:shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
          {/* Header */}
          <div className="border-b border-[#e1d4bb] px-6 pb-6 pt-7 text-center dark:border-[#493a32] sm:px-8">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${
                isSuccess
                  ? "border-[#a7b58a] bg-[#edf2e3] text-[#557044] dark:border-[#65764f] dark:bg-[#293322] dark:text-[#b8cd9d]"
                  : isError
                    ? "border-[#c9897f] bg-[#f9e8e4] text-[#762f2f] dark:border-[#75483f] dark:bg-[#3a2421] dark:text-[#f0b5aa]"
                    : "border-[#c29a52] bg-[#762f2f] text-[#f8e8c4]"
              }`}
            >
              {isLoading && (
                <Loader2
                  className="h-7 w-7 animate-spin"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              )}

              {isSuccess && (
                <CheckCircle2
                  className="h-7 w-7"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              )}

              {isError && (
                <AlertCircle
                  className="h-7 w-7"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              )}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
              Jodhpur Church
            </p>

            <h1 className="mt-1 font-serif text-2xl font-semibold leading-snug tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
              {isLoading && t("verifyingEmail")}
              {isSuccess && t("emailVerified")}
              {isError && t("verificationLinkInvalid")}
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-7 text-center sm:px-8 sm:py-8">
            {isLoading && (
              <>
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4ead8] text-[#762f2f] dark:bg-[#352824] dark:text-[#d8b56a]">
                  <MailCheck
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                  {t("verifyingEmailDescription")}
                </p>

                <div
                  className="mx-auto mt-6 h-1 w-24 overflow-hidden rounded-full bg-[#e4d7c0] dark:bg-[#493a32]"
                  aria-hidden="true"
                >
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-[#c29a52]" />
                </div>
              </>
            )}

            {isSuccess && (
              <>
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2e3] text-[#557044] dark:bg-[#293322] dark:text-[#b8cd9d]">
                  <CheckCircle2
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                  {t("emailVerifiedDescription")}
                </p>

                <p className="mt-4 text-xs text-[#8b765f] dark:text-[#a89580]">
                  Redirecting…
                </p>
              </>
            )}

            {isError && (
              <>
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f9e8e4] text-[#762f2f] dark:bg-[#3a2421] dark:text-[#f0b5aa]">
                  <AlertCircle
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                  {t("verificationLinkInvalidDescription")}
                </p>

                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/verify-email`)}
                  className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#762f2f] px-4 py-2.5 text-sm font-semibold text-[#fff8e8] shadow-sm transition-colors hover:bg-[#632623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0] dark:bg-[#8c3b38] dark:hover:bg-[#a34b42] dark:focus-visible:ring-offset-[#251c19]"
                >
                  <MailCheck
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  {t("backToVerification")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8b765f] dark:text-[#918170]">
          <Church
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
          <span>A place to belong, believe &amp; grow</span>
        </div>
      </div>
    </main>
  );
}