"use client";

import {
  type FormEvent,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  KeyRound,
  Church,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/firebase";

type FirebaseErrorLike = {
  code?: string;
  message?: string;
};

/* =========================================================
   LOGIN ERROR MESSAGE
========================================================= */

function getLoginErrorMessage(
  error: unknown,
  t: (key: string) => string,
): string {
  const firebaseError =
    error as FirebaseErrorLike;

  switch (firebaseError.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return t("invalidCredentials");

    case "auth/invalid-email":
      return t("invalidEmail");

    case "auth/user-disabled":
      return t("userDisabled");

    case "auth/too-many-requests":
      return t("tooManyRequests");

    case "auth/network-request-failed":
      return t("networkError");

    default:
      return t("loginFailed");
  }
}

/* =========================================================
   LOGIN PAGE
========================================================= */

export default function LoginPage() {
  const t = useTranslations("auth");
  const commonT =
    useTranslations("common");

  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;

  const {
    login,
    loginWithGoogle,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  /* =======================================================
     EMAIL / PASSWORD LOGIN
  ======================================================= */

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const loggedInUser =
        await login(
          email.trim(),
          password,
        );

      if (loggedInUser.emailVerified) {
        router.push(`/${locale}`);
      } else {
        router.push(
          `/${locale}/verify-email`,
        );
      }
    } catch (error: unknown) {
      console.error(
        "Login failed:",
        error,
      );

      setError(
        getLoginErrorMessage(
          error,
          t,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     GOOGLE LOGIN
  ======================================================= */

  const handleGoogleLogin =
    async () => {
      setError("");
      setMessage("");
      setLoading(true);

      try {
        const googleUser =
          await loginWithGoogle();

        if (googleUser.emailVerified) {
          router.push(`/${locale}`);
        } else {
          router.push(
            `/${locale}/verify-email`,
          );
        }
      } catch (error: unknown) {
        console.error(
          "Google login failed:",
          error,
        );

        const firebaseError =
          error as FirebaseErrorLike;

        switch (
          firebaseError.code
        ) {
          case "auth/popup-closed-by-user":
            setError(
              t("googleLoginCancelled"),
            );
            break;

          case "auth/popup-blocked":
            setError(
              t("googlePopupBlocked"),
            );
            break;

          case "auth/account-exists-with-different-credential":
            setError(
              t(
                "accountExistsDifferentCredential",
              ),
            );
            break;

          case "auth/network-request-failed":
            setError(
              t("networkError"),
            );
            break;

          default:
            setError(
              t("loginFailed"),
            );
        }
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     FORGOT PASSWORD
  ======================================================= */

  const handleForgotPassword =
    async () => {
      setError("");
      setMessage("");

      if (!email.trim()) {
        setError(
          t("enterEmailForReset"),
        );
        return;
      }

      setResetLoading(true);

      try {
        await sendPasswordResetEmail(
          auth,
          email.trim(),
        );

        setMessage(
          t("passwordResetSent"),
        );
      } catch (error: unknown) {
        console.error(
          "Password reset error:",
          error,
        );

        const firebaseError =
          error as FirebaseErrorLike;

        switch (
          firebaseError.code
        ) {
          case "auth/invalid-email":
            setError(
              t("invalidEmail"),
            );
            break;

          case "auth/user-not-found":
            setError(
              t("userNotFound"),
            );
            break;

          case "auth/too-many-requests":
            setError(
              t("tooManyRequests"),
            );
            break;

          case "auth/network-request-failed":
            setError(
              t("networkError"),
            );
            break;

          default:
            setError(
              t("passwordResetFailed"),
            );
        }
      } finally {
        setResetLoading(false);
      }
    };

  const isBusy =
    loading || resetLoading;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbf7ef] px-4 py-8 text-[#4b2823] dark:bg-[#171210] dark:text-[#f3dfbc] sm:py-12">
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#ead9b6]/40 dark:bg-[#5a4030]/20"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-[#ead9b6]/30 dark:bg-[#5a4030]/15"
        aria-hidden="true"
      />

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}

      <div className="relative w-full max-w-md">
        <div className="border border-[#d8c9a8] bg-[#fffaf0] shadow-[0_12px_40px_rgba(75,40,35,0.10)] dark:border-[#4a3c34] dark:bg-[#241b18] dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)]">

          {/* CARD TOP */}

          <div className="border-b border-[#e1d4b9] px-5 pb-5 pt-7 text-center dark:border-[#40342e] sm:px-8 sm:pt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52] bg-[#762f2f] text-[#fffaf0] shadow-sm dark:bg-[#8a3b3b]">
              <Church
                className="h-7 w-7"
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b765f] dark:text-[#c9bca9] sm:text-xs">
              Jodhpur Church
            </p>

            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
              {t("loginTitle")}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#65584e] dark:text-[#c9bca9]">
              {t("loginDescription")}
            </p>
          </div>

          {/* FORM */}

          <div className="px-5 py-6 sm:px-8 sm:py-7">
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]"
                >
                  {commonT("email")}
                </label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b765f] dark:text-[#a99583]"
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={commonT(
                      "email",
                    )}
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value,
                      )
                    }
                    required
                    disabled={isBusy}
                    className="min-h-11 w-full border border-[#d8c9a8] bg-[#fffdf7] pl-10 pr-3 text-sm text-[#4b2823] outline-none transition-colors placeholder:text-[#9b8b7c] focus:border-[#c29a52] focus:ring-2 focus:ring-[#c29a52]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#4a3c34] dark:bg-[#1d1715] dark:text-[#f3dfbc] dark:placeholder:text-[#89796c] dark:focus:border-[#d8b56a] dark:focus:ring-[#d8b56a]/20"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]"
                >
                  {commonT("password")}
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b765f] dark:text-[#a99583]"
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder={commonT(
                      "password",
                    )}
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value,
                      )
                    }
                    required
                    disabled={isBusy}
                    className="min-h-11 w-full border border-[#d8c9a8] bg-[#fffdf7] px-10 text-sm text-[#4b2823] outline-none transition-colors placeholder:text-[#9b8b7c] focus:border-[#c29a52] focus:ring-2 focus:ring-[#c29a52]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#4a3c34] dark:bg-[#1d1715] dark:text-[#f3dfbc] dark:placeholder:text-[#89796c] dark:focus:border-[#d8b56a] dark:focus:ring-[#d8b56a]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value,
                      )
                    }
                    disabled={isBusy}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#8b765f] transition-colors hover:text-[#762f2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#a99583] dark:hover:text-[#d8b56a]"
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD */}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={
                    handleForgotPassword
                  }
                  disabled={isBusy}
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#762f2f] transition-colors hover:text-[#a34b42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#d8b56a] dark:hover:text-[#f0d08b]"
                >
                  <KeyRound
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />

                  {resetLoading
                    ? t(
                        "sendingResetEmail",
                      )
                    : t(
                        "forgotPassword",
                      )}
                </button>
              </div>

              {/* ERROR */}

              {error && (
                <div
                  role="alert"
                  className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {message && (
                <div
                  role="status"
                  className="border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300"
                >
                  {message}
                </div>
              )}

              {/* LOGIN */}

              <button
                type="submit"
                disabled={isBusy}
                className="flex min-h-11 w-full items-center justify-center gap-2 bg-[#762f2f] px-4 text-sm font-semibold text-[#fffaf0] shadow-sm transition-colors hover:bg-[#652727] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8a3b3b] dark:hover:bg-[#762f2f] dark:focus-visible:ring-offset-[#241b18]"
              >
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-[#fffaf0]/30 border-t-[#fffaf0]"
                      aria-hidden="true"
                    />

                    {t("loggingIn")}
                  </>
                ) : (
                  <>
                    <LogIn
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    {t("loginButton")}
                  </>
                )}
              </button>
            </form>

            {/* DIVIDER */}

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#d8c9a8] dark:bg-[#4a3c34]" />

              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#9b8b7c] dark:text-[#89796c]">
                {t("or")}
              </span>

              <div className="h-px flex-1 bg-[#d8c9a8] dark:bg-[#4a3c34]" />
            </div>

            {/* GOOGLE */}

            <button
              type="button"
              onClick={
                handleGoogleLogin
              }
              disabled={isBusy}
              className="flex min-h-11 w-full items-center justify-center gap-3 border border-[#d8c9a8] bg-[#fffaf0] px-4 text-sm font-semibold text-[#4b2823] transition-colors hover:bg-[#f5ecdc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#f3dfbc] dark:hover:bg-[#342720] dark:focus-visible:ring-offset-[#241b18]"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm"
                aria-hidden="true"
              >
                G
              </span>

              {t("googleLogin")}
            </button>

            {/* SIGN UP */}

            <div className="mt-6 border-t border-[#e1d4b9] pt-5 text-center dark:border-[#40342e]">
              <span className="text-sm text-[#6b5b50] dark:text-[#c9bca9]">
                {t("noAccount")}{" "}
              </span>

              <Link
                href={`/${locale}/signup`}
                className="inline-flex min-h-10 items-center gap-1 font-semibold text-[#762f2f] hover:text-[#a34b42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:text-[#d8b56a] dark:hover:text-[#f0d08b]"
              >
                <UserPlus
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />

                {t("createAccount")}
              </Link>
            </div>
          </div>
        </div>

        {/* DECORATIVE FOOTER */}

        <div className="mt-5 flex items-center justify-center gap-3 text-[#c29a52]">
          <span
            className="h-px w-10 bg-[#c29a52]/60"
            aria-hidden="true"
          />

          <span
            className="text-sm"
            aria-hidden="true"
          >
            ✦
          </span>

          <span
            className="h-px w-10 bg-[#c29a52]/60"
            aria-hidden="true"
          />
        </div>
      </div>
    </main>
  );
}