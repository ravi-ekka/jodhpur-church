"use client";

import { FormEvent, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Church,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type FirebaseErrorLike = {
  message?: string;
};

export default function SignupPage() {
  const t = useTranslations("auth");
  const commonT = useTranslations("common");

  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;

  const { signup, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signup(name, email, password, locale);

      router.push(`/${locale}/verify-email`);
    } catch (error: unknown) {
      const firebaseError = error as FirebaseErrorLike;

      setError(firebaseError.message || t("signupFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const googleUser = await loginWithGoogle();

      if (googleUser.emailVerified) {
        router.push(`/${locale}`);
      } else {
        router.push(`/${locale}/verify-email`);
      }
    } catch (error: unknown) {
      const firebaseError = error as FirebaseErrorLike;

      setError(firebaseError.message || t("signupFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f0e2] px-4 py-8 text-[#3f302b] dark:bg-[#1d1715] dark:text-[#f3dfbc] sm:px-6">
      {/* Decorative background */}
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
          {/* Header */}
          <div className="border-b border-[#e1d4bb] px-6 pb-6 pt-7 text-center dark:border-[#493a32] sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52] bg-[#762f2f] text-[#f8e8c4] shadow-sm">
              <Church
                className="h-7 w-7"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b765f] dark:text-[#c9bca9]">
              Jodhpur Church
            </p>

            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
              {t("signupTitle")}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
              {t("signupDescription")}
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-[#4b2823] dark:text-[#ead8bb]"
                >
                  {commonT("name")}
                </label>

                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b765f] dark:text-[#b9a58c]"
                    aria-hidden="true"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder={commonT("name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="min-h-11 w-full rounded-lg border border-[#d8c9a8] bg-[#fffdf8] pl-10 pr-3 text-sm text-[#3f302b] outline-none transition-colors placeholder:text-[#9b8b7b] focus:border-[#a56b3d] focus:ring-2 focus:ring-[#c29a52]/30 dark:border-[#514039] dark:bg-[#211916] dark:text-[#f3dfbc] dark:placeholder:text-[#8f7c6b] dark:focus:border-[#c29a52] dark:focus:ring-[#c29a52]/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-[#4b2823] dark:text-[#ead8bb]"
                >
                  {commonT("email")}
                </label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b765f] dark:text-[#b9a58c]"
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder={commonT("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="min-h-11 w-full rounded-lg border border-[#d8c9a8] bg-[#fffdf8] pl-10 pr-3 text-sm text-[#3f302b] outline-none transition-colors placeholder:text-[#9b8b7b] focus:border-[#a56b3d] focus:ring-2 focus:ring-[#c29a52]/30 dark:border-[#514039] dark:bg-[#211916] dark:text-[#f3dfbc] dark:placeholder:text-[#8f7c6b] dark:focus:border-[#c29a52] dark:focus:ring-[#c29a52]/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-[#4b2823] dark:text-[#ead8bb]"
                >
                  {commonT("password")}
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={commonT("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="min-h-11 w-full rounded-lg border border-[#d8c9a8] bg-[#fffdf8] px-3 pr-11 text-sm text-[#3f302b] outline-none transition-colors placeholder:text-[#9b8b7b] focus:border-[#a56b3d] focus:ring-2 focus:ring-[#c29a52]/30 dark:border-[#514039] dark:bg-[#211916] dark:text-[#f3dfbc] dark:placeholder:text-[#8f7c6b] dark:focus:border-[#c29a52] dark:focus:ring-[#c29a52]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-1 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-md text-[#806d5d] transition-colors hover:bg-[#f1e7d5] hover:text-[#762f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:text-[#b9a58c] dark:hover:bg-[#352824] dark:hover:text-[#d8b56a]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-[#8b765f] dark:text-[#a89580]">
                  Minimum 6 characters
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-[#c9897f] bg-[#f9e8e4] px-3 py-2.5 text-sm leading-5 text-[#762f2f] dark:border-[#75483f] dark:bg-[#3a2421] dark:text-[#f0b5aa]"
                >
                  {error}
                </div>
              )}

              {/* Signup button */}
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#762f2f] px-4 py-2.5 text-sm font-semibold text-[#fff8e8] shadow-sm transition-colors hover:bg-[#632623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#8c3b38] dark:hover:bg-[#a34b42] dark:focus-visible:ring-offset-[#251c19]"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    {t("signingUp")}
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {t("signupButton")}
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#dfd1b8] dark:bg-[#493a32]" />

              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#a89580]">
                {t("or")}
              </span>

              <div className="h-px flex-1 bg-[#dfd1b8] dark:bg-[#493a32]" />
            </div>

            {/* Google signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#d8c9a8] bg-[#fffdf8] px-4 py-2.5 text-sm font-semibold text-[#4b2823] transition-colors hover:bg-[#f4ead8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#514039] dark:bg-[#211916] dark:text-[#f0dfc3] dark:hover:bg-[#30231f]"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm"
                aria-hidden="true"
              >
                G
              </span>

              {loading ? t("signingUp") : t("googleSignup")}
            </button>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-[#75665a] dark:text-[#aa9987]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push(`/${locale}/login`)}
                className="font-semibold text-[#762f2f] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:text-[#d8b56a]"
              >
                {t("loginButton")}
              </button>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-4 text-center text-xs leading-5 text-[#8b765f] dark:text-[#918170]">
          Jodhpur Church · A place to belong, believe &amp; grow
        </p>
      </div>
    </main>
  );
}