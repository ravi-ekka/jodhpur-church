"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Church,
  Clock3,
  Loader2,
  LogOut,
  Mail,
  MailCheck,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type FirebaseErrorLike = {
  message?: string;
};

export default function VerifyEmailPage() {
  const t = useTranslations("auth");

  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;

  const {
    user,
    refreshUser,
    sendVerificationEmail,
    logout,
  } = useAuth();

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCheckVerification = async () => {
    setChecking(true);
    setMessage("");
    setError("");

    try {
      const currentUser = await refreshUser();

      if (currentUser.emailVerified) {
        setMessage(t("emailVerified"));

        setTimeout(() => {
          router.push(`/${locale}`);
        }, 1000);
      } else {
        setError(t("emailNotVerified"));
      }
    } catch (error: unknown) {
      const firebaseError = error as FirebaseErrorLike;

      setError(firebaseError.message || t("verificationCheckFailed"));
    } finally {
      setChecking(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setMessage("");
    setError("");

    try {
      await sendVerificationEmail();

      setMessage(t("verificationEmailSent"));
    } catch (error: unknown) {
      const firebaseError = error as FirebaseErrorLike;

      setError(firebaseError.message || t("verificationEmailFailed"));
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    setMessage("");
    setError("");

    try {
      await logout();

      router.push(`/${locale}/login`);
    } catch (error: unknown) {
      const firebaseError = error as FirebaseErrorLike;

      setError(firebaseError.message || t("logoutFailed"));
    }
  };

  if (!user) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f0e2] px-4 py-8 text-[#3f302b] dark:bg-[#1d1715] dark:text-[#f3dfbc] sm:px-6">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
          aria-hidden="true"
        />

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
            <div className="border-b border-[#e1d4bb] px-6 pb-6 pt-7 text-center dark:border-[#493a32] sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52] bg-[#762f2f] text-[#f8e8c4]">
                <Church
                  className="h-7 w-7"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
                Jodhpur Church
              </p>

              <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                {t("loginRequired")}
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                {t("loginToVerify")}
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <button
                type="button"
                onClick={() => router.push(`/${locale}/login`)}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#762f2f] px-4 py-2.5 text-sm font-semibold text-[#fff8e8] shadow-sm transition-colors hover:bg-[#632623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0] dark:bg-[#8c3b38] dark:hover:bg-[#a34b42] dark:focus-visible:ring-offset-[#251c19]"
              >
                <MailCheck
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                {t("loginButton")}
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#8b765f] dark:text-[#918170]">
            A place to belong, believe &amp; grow
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f0e2] px-4 py-8 text-[#3f302b] dark:bg-[#1d1715] dark:text-[#f3dfbc] sm:px-6">
      {/* Top accent */}
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
                message && !error
                  ? "border-[#a7b58a] bg-[#edf2e3] text-[#557044] dark:border-[#65764f] dark:bg-[#293322] dark:text-[#b8cd9d]"
                  : "border-[#c29a52] bg-[#762f2f] text-[#f8e8c4]"
              }`}
            >
              {message && !error ? (
                <CheckCircle2
                  className="h-7 w-7"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              ) : (
                <MailCheck
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
              {t("verifyEmailTitle")}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
              {t("verifyEmailDescription")}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6 sm:px-8 sm:py-7">
            {/* Email address */}
            <div className="rounded-xl border border-[#d8c9a8] bg-[#f7f0e2] p-4 dark:border-[#493a32] dark:bg-[#211916]">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#762f2f] text-[#f8e8c4] dark:bg-[#8c3b38]">
                  <Mail
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b765f] dark:text-[#a89580]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-[#4b2823] dark:text-[#ead8bb]">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Status message */}
            {message && (
              <div
                role="status"
                className="mt-4 flex items-start gap-3 rounded-lg border border-[#a7b58a] bg-[#edf2e3] px-3 py-3 text-sm leading-5 text-[#557044] dark:border-[#65764f] dark:bg-[#293322] dark:text-[#b8cd9d]"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />

                <span>{message}</span>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-[#c9897f] bg-[#f9e8e4] px-3 py-3 text-sm leading-5 text-[#762f2f] dark:border-[#75483f] dark:bg-[#3a2421] dark:text-[#f0b5aa]"
              >
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={checking}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#762f2f] px-4 py-2.5 text-sm font-semibold text-[#fff8e8] shadow-sm transition-colors hover:bg-[#632623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#8c3b38] dark:hover:bg-[#a34b42] dark:focus-visible:ring-offset-[#251c19]"
              >
                {checking ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    {t("checkingVerification")}
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {t("checkVerification")}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#d8c9a8] bg-[#fffdf8] px-4 py-2.5 text-sm font-semibold text-[#4b2823] transition-colors hover:bg-[#f4ead8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#514039] dark:bg-[#211916] dark:text-[#f0dfc3] dark:hover:bg-[#30231f]"
              >
                {resending ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    {t("resendingVerification")}
                  </>
                ) : (
                  <>
                    <RefreshCw
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {t("resendVerification")}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#d8c9a8] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#762f2f] transition-colors hover:bg-[#f4ead8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:border-[#514039] dark:text-[#d8b56a] dark:hover:bg-[#30231f]"
              >
                <LogOut
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                {t("logout")}
              </button>
            </div>

            {/* Helpful note */}
            <div className="mt-6 flex items-start gap-3 border-t border-[#e1d4bb] pt-5 dark:border-[#493a32]">
              <Clock3
                className="mt-0.5 h-4 w-4 shrink-0 text-[#c29a52]"
                aria-hidden="true"
              />

              <p className="text-xs leading-5 text-[#8b765f] dark:text-[#a89580]">
                Please check your inbox and spam folder for the verification
                email.
              </p>
            </div>
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