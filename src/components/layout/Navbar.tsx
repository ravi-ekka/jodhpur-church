
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Globe,
  History,
  Home,
  Images,
  Info,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Phone,
  Sun,
  User,
  Users,
  Video,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type NavbarProps = {
  locale: string;
  churchName: string;
};

type NavigationItem = {
  label: string;
  href: string;
};

export default function Navbar({
  locale,
  churchName,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("navbar");

  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [mediaOpen, setMediaOpen] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navigation: NavigationItem[] = [
    {
      label: t("home"),
      href: `/${locale}`,
    },
    {
      label: t("about"),
      href: `/${locale}/about`,
    },
    {
      label: t("events"),
      href: `/${locale}/events`,
    },
    {
      label: t("bible"),
      href: `/${locale}/bible`,
    },
    {
      label: t("members"),
      href: `/${locale}/members`,
    },
    {
      label: t("notifications"),
      href: `/${locale}/notifications`,
    },
    {
      label: t("contact"),
      href: `/${locale}/contact`,
    },
    {
      label: t("history"),
      href: `/${locale}/history`,
    },
  ];

  const mediaNavigation: NavigationItem[] = [
    {
      label: t("gallery"),
      href: `/${locale}/gallery`,
    },
    {
      label: t("sermons"),
      href: `/${locale}/sermons`,
    },
    {
      label: t("blog"),
      href: `/${locale}/blog`,
    },
  ];

  const languages = [
    {
      code: "en",
      label: "English",
    },
    {
      code: "hi",
      label: "हिन्दी",
    },
    {
      code: "kru",
      label: "Kurukh",
    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const isMediaActive =
    mediaNavigation.some((item) =>
      isActive(item.href)
    );

  const changeLanguage = (
    newLocale: string
  ) => {
    const pathWithoutLocale =
      pathname.replace(
        new RegExp(`^/${locale}`),
        ""
      );

    router.push(
      `/${newLocale}${
        pathWithoutLocale || ""
      }`
    );

    setMobileMenuOpen(false);
    setMediaOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();

      router.push(`/${locale}`);

      setMobileMenuOpen(false);
      setMediaOpen(false);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  const toggleTheme = () => {
    setTheme(
      theme === "dark"
        ? "light"
        : "dark"
    );
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setMediaOpen(false);
  };

  /*
   * Icons are used only for the mobile navigation.
   * Desktop navigation remains unchanged.
   */
  const navigationIcons = [
    Home,
    Info,
    CalendarDays,
    BookOpen,
    Users,
    Bell,
    Phone,
    History,
  ];

  const mediaIcons = [
    Images,
    Video,
    Newspaper,
  ];

  return (
    <>
      <header
        className="
          sticky top-0 z-50 w-full
          border-b border-[#d8c9a8]
          bg-[#fffdf7]/95
          text-[#33251d]
          shadow-sm
          backdrop-blur
          dark:border-[#4b4038]
          dark:bg-[#211b18]/95
          dark:text-[#f5ead8]
        "
      >
        <div
          className="
            mx-auto flex min-h-16
            max-w-7xl
            items-center
            justify-between
            px-4 sm:px-6 lg:px-8
          "
        >
          {/* =====================================================
              LOGO
          ====================================================== */}

          <Link
            href={`/${locale}`}
            onClick={closeMenus}
            className="
              group flex min-h-12
              items-center gap-3
            "
            aria-label={churchName}
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                border border-[#b08a3e]
                bg-[#f8f0df]
                text-[#762f2f]
                shadow-sm
                transition-transform
                group-hover:scale-105
                dark:bg-[#332720]
                dark:text-[#d8b56a]
              "
            >
              <span
                className="
                  font-serif
                  text-xl
                  leading-none
                "
              >
                ✝
              </span>
            </div>

            <div className="leading-tight">
              <span
                className="
                  block
                  font-serif
                  text-lg
                  font-bold
                  tracking-tight
                  text-[#5f2525]
                  dark:text-[#e2c17a]
                  sm:text-xl
                "
              >
                {churchName}
              </span>

              <span
                className="
                  hidden
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#806d5d]
                  sm:block
                  dark:text-[#b9a998]
                "
              >
                Faith • Hope • Love
              </span>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <nav
            className="
              hidden
              items-center
              gap-1
              lg:flex
            "
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const active =
                isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[#a77a32]",
                    "focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-[#fffdf7]",
                    active
                      ? "text-[#762f2f] dark:text-[#e2c17a]"
                      : "text-[#66574c] hover:text-[#762f2f] dark:text-[#c4b6a7] dark:hover:text-[#e2c17a]",
                  ].join(" ")}
                >
                  {item.label}

                  {active && (
                    <span
                      className="
                        absolute
                        inset-x-3
                        -bottom-[1px]
                        h-0.5
                        rounded-full
                        bg-[#a77a32]
                        dark:bg-[#d8b56a]
                      "
                    />
                  )}
                </Link>
              );
            })}

            {/* =================================================
                MEDIA DROPDOWN
            ================================================== */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setMediaOpen(
                    (open) => !open
                  )
                }
                aria-expanded={
                  mediaOpen
                }
                aria-haspopup="menu"
                className={[
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[#a77a32]",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[#fffdf7]",
                  isMediaActive
                    ? "text-[#762f2f] dark:text-[#e2c17a]"
                    : "text-[#66574c] hover:text-[#762f2f] dark:text-[#c4b6a7] dark:hover:text-[#e2c17a]",
                ].join(" ")}
              >
                {t("media")}

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    mediaOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {mediaOpen && (
                <div
                  role="menu"
                  className="
                    absolute
                    right-0
                    top-full
                    mt-2
                    w-48
                    rounded-xl
                    border
                    border-[#d8c9a8]
                    bg-[#fffdf7]
                    p-2
                    text-[#33251d]
                    shadow-xl
                    dark:border-[#4b4038]
                    dark:bg-[#2b231f]
                    dark:text-[#f5ead8]
                  "
                >
                  {mediaNavigation.map(
                    (item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() =>
                          setMediaOpen(
                            false
                          )
                        }
                        className={[
                          "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                          isActive(
                            item.href
                          )
                            ? "bg-[#f3e8d2] font-medium text-[#762f2f] dark:bg-[#3b3029] dark:text-[#e2c17a]"
                            : "text-[#66574c] hover:bg-[#f8f0df] hover:text-[#762f2f] dark:text-[#c4b6a7] dark:hover:bg-[#382d27] dark:hover:text-[#e2c17a]",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* =====================================================
              DESKTOP ACTIONS
          ====================================================== */}

          <div
            className="
              hidden
              items-center
              gap-1
              lg:flex
            "
          >
            {/* Language */}

            <select
              value={locale}
              onChange={(event) =>
                changeLanguage(
                  event.target.value
                )
              }
              className="
                h-10
                rounded-md
                border
                border-[#d8c9a8]
                bg-transparent
                px-2
                text-sm
                text-[#66574c]
                outline-none
                transition-colors
                hover:border-[#b08a3e]
                focus:ring-2
                focus:ring-[#a77a32]
                dark:border-[#4b4038]
                dark:text-[#c4b6a7]
              "
              aria-label={t(
                "language"
              )}
            >
              {languages.map(
                (language) => (
                  <option
                    key={
                      language.code
                    }
                    value={
                      language.code
                    }
                    className="
                      bg-[#fffdf7]
                      text-[#33251d]
                      dark:bg-[#2b231f]
                      dark:text-[#f5ead8]
                    "
                  >
                    {
                      language.label
                    }
                  </option>
                )
              )}
            </select>

            {/* Theme */}

            <button
              type="button"
              onClick={
                toggleTheme
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-md
                text-[#66574c]
                transition-colors
                hover:bg-[#f3e8d2]
                hover:text-[#762f2f]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#a77a32]
                dark:text-[#c4b6a7]
                dark:hover:bg-[#382d27]
                dark:hover:text-[#e2c17a]
              "
              aria-label={t(
                "toggleTheme"
              )}
            >
              {!mounted ? (
                <Moon className="h-5 w-5" />
              ) : theme ===
                "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Authentication */}

            {user ? (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="
                    ml-1
                    flex
                    min-h-10
                    items-center
                    gap-2
                    rounded-md
                    px-3
                    text-sm
                    font-medium
                    text-[#66574c]
                    transition-colors
                    hover:bg-[#f3e8d2]
                    hover:text-[#762f2f]
                    dark:text-[#c4b6a7]
                    dark:hover:bg-[#382d27]
                    dark:hover:text-[#e2c17a]
                  "
                >
                  <User className="h-4 w-4" />

                  <span className="max-w-28 truncate">
                    {user.displayName ||
                      t("dashboard")}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-md
                    text-[#66574c]
                    transition-colors
                    hover:bg-[#f3e8d2]
                    hover:text-[#762f2f]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#a77a32]
                    dark:text-[#c4b6a7]
                    dark:hover:bg-[#382d27]
                    dark:hover:text-[#e2c17a]
                  "
                  aria-label={t(
                    "logout"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="
                  ml-1
                  flex
                  min-h-10
                  items-center
                  gap-2
                  rounded-full
                  bg-[#762f2f]
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-colors
                  hover:bg-[#602525]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#a77a32]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#fffdf7]
                  dark:bg-[#9b4b4b]
                  dark:hover:bg-[#a95b5b]
                "
              >
                <LogIn className="h-4 w-4" />

                {t("login")}
              </Link>
            )}
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (open) => !open
              )
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-lg
              border
              border-[#d8c9a8]
              bg-[#fffdf7]
              text-[#762f2f]
              transition-colors
              hover:bg-[#f3e8d2]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#a77a32]
              lg:hidden
              dark:border-[#4b4038]
              dark:bg-[#332720]
              dark:text-[#e2c17a]
              dark:hover:bg-[#382d27]
            "
            aria-label={
              mobileMenuOpen
                ? t("closeMenu")
                : t("openMenu")
            }
            aria-expanded={
              mobileMenuOpen
            }
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* =======================================================
          MOBILE RIGHT SIDE DRAWER
      ======================================================== */}

      {mobileMenuOpen && (
        <>
          {/* Backdrop */}

          <button
            type="button"
            aria-label={t(
              "closeMenu"
            )}
            onClick={closeMenus}
            className="
              fixed
              inset-0
              z-[60]
              bg-[#211b18]/45
              backdrop-blur-[1px]
              lg:hidden
            "
          />

          {/* Drawer */}

          <aside
            className="
              fixed
              right-0
              top-0
              z-[70]
              flex
              h-dvh
              w-[60vw]
              sm:w-1/2
              flex-col
              overflow-y-auto
              border-l
              border-[#d8c9a8]
              bg-[#fffdf7]
              text-[#33251d]
              shadow-2xl
              lg:hidden
              dark:border-[#4b4038]
              dark:bg-[#211b18]
              dark:text-[#f5ead8]
            "
            aria-label="Mobile navigation"
          >
            {/* Drawer Header */}

            <div
              className="
                flex
                min-h-16
                items-center
                justify-between
                border-b
                border-[#d8c9a8]
                px-4
                dark:border-[#4b4038]
              "
            >
              <Link
                href={`/${locale}`}
                onClick={closeMenus}
                className="
                  min-w-0
                  truncate
                  pr-3
                  font-serif
                  text-base
                  font-bold
                  text-[#762f2f]
                  dark:text-[#e2c17a]
                "
              >
                {churchName}
              </Link>

              <button
                type="button"
                onClick={
                  closeMenus
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-[#66574c]
                  transition-colors
                  hover:bg-[#f3e8d2]
                  hover:text-[#762f2f]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#a77a32]
                  dark:text-[#c4b6a7]
                  dark:hover:bg-[#382d27]
                  dark:hover:text-[#e2c17a]
                "
                aria-label={t(
                  "closeMenu"
                )}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 px-3 py-4">
              {/* Main navigation */}

              <nav
                className="space-y-1"
                aria-label="Mobile navigation"
              >
                {navigation.map(
                  (item, index) => {
                    const active =
                      isActive(
                        item.href
                      );

                    const Icon =
                      navigationIcons[
                        index
                      ];

                    return (
                      <Link
                        key={
                          item.href
                        }
                        href={
                          item.href
                        }
                        onClick={
                          closeMenus
                        }
                        className={[
                          "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-[#f3e8d2] text-[#762f2f] dark:bg-[#382d27] dark:text-[#e2c17a]"
                            : "text-[#66574c] hover:bg-[#f8f0df] hover:text-[#762f2f] dark:text-[#c4b6a7] dark:hover:bg-[#382d27] dark:hover:text-[#e2c17a]",
                        ].join(
                          " "
                        )}
                      >
                        <Icon
                          className="
                            h-5
                            w-5
                            shrink-0
                          "
                          strokeWidth={
                            1.8
                          }
                        />

                        <span>
                          {
                            item.label
                          }
                        </span>
                      </Link>
                    );
                  }
                )}

                {/* Media */}

                <div className="pt-3">
                  <div
                    className="
                      px-3
                      py-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#967d68]
                      dark:text-[#9e8c7d]
                    "
                  >
                    {t("media")}
                  </div>

                  {mediaNavigation.map(
                    (
                      item,
                      index
                    ) => {
                      const active =
                        isActive(
                          item.href
                        );

                      const Icon =
                        mediaIcons[
                          index
                        ];

                      return (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          onClick={
                            closeMenus
                          }
                          className={[
                            "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-[#f3e8d2] font-medium text-[#762f2f] dark:bg-[#382d27] dark:text-[#e2c17a]"
                              : "text-[#66574c] hover:bg-[#f8f0df] hover:text-[#762f2f] dark:text-[#c4b6a7] dark:hover:bg-[#382d27] dark:hover:text-[#e2c17a]",
                          ].join(
                            " "
                          )}
                        >
                          <Icon
                            className="
                              h-5
                              w-5
                              shrink-0
                            "
                            strokeWidth={
                              1.8
                            }
                          />

                          <span>
                            {
                              item.label
                            }
                          </span>
                        </Link>
                      );
                    }
                  )}
                </div>
              </nav>

              <div
                className="
                  my-4
                  h-px
                  bg-[#e2d7c4]
                  dark:bg-[#4b4038]
                "
              />

              {/* Language */}

              <div className="flex items-center gap-2">
                <Globe
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-[#8d765f]
                    dark:text-[#b9a998]
                  "
                />

                <select
                  value={locale}
                  onChange={(
                    event
                  ) =>
                    changeLanguage(
                      event.target
                        .value
                    )
                  }
                  className="
                    min-h-10
                    min-w-0
                    flex-1
                    rounded-lg
                    border
                    border-[#d8c9a8]
                    bg-transparent
                    px-2
                    text-xs
                    text-[#5e5147]
                    outline-none
                    focus:ring-2
                    focus:ring-[#a77a32]
                    dark:border-[#4b4038]
                    dark:text-[#c4b6a7]
                  "
                  aria-label={t(
                    "language"
                  )}
                >
                  {languages.map(
                    (
                      language
                    ) => (
                      <option
                        key={
                          language.code
                        }
                        value={
                          language.code
                        }
                        className="
                          bg-[#fffdf7]
                          text-[#33251d]
                          dark:bg-[#2b231f]
                          dark:text-[#f5ead8]
                        "
                      >
                        {
                          language.label
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Theme */}

              <button
                type="button"
                onClick={
                  toggleTheme
                }
                className="
                  mt-3
                  flex
                  min-h-10
                  w-full
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-[#d8c9a8]
                  bg-transparent
                  px-3
                  text-xs
                  font-medium
                  text-[#5e5147]
                  transition-colors
                  hover:bg-[#f8f0df]
                  hover:text-[#762f2f]
                  dark:border-[#4b4038]
                  dark:text-[#c4b6a7]
                  dark:hover:bg-[#382d27]
                  dark:hover:text-[#e2c17a]
                "
              >
                {!mounted ? (
                  <Moon className="h-4 w-4" />
                ) : theme ===
                  "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}

                {t(
                  "toggleTheme"
                )}
              </button>

              {/* Authentication */}

              <div className="mt-3 space-y-2">
                {user ? (
                  <>
                    <Link
                      href={`/${locale}/dashboard`}
                      onClick={
                        closeMenus
                      }
                      className="
                        flex
                        min-h-10
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-[#d8c9a8]
                        bg-transparent
                        px-3
                        text-xs
                        font-medium
                        text-[#5e5147]
                        transition-colors
                        hover:bg-[#f8f0df]
                        hover:text-[#762f2f]
                        dark:border-[#4b4038]
                        dark:text-[#c4b6a7]
                        dark:hover:bg-[#382d27]
                        dark:hover:text-[#e2c17a]
                      "
                    >
                      <User className="h-4 w-4" />

                      <span className="truncate">
                        {user.displayName ||
                          t(
                            "dashboard"
                          )}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        flex
                        min-h-10
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-[#d8c9a8]
                        bg-transparent
                        px-3
                        text-xs
                        font-medium
                        text-[#5e5147]
                        transition-colors
                        hover:bg-[#f8f0df]
                        hover:text-[#762f2f]
                        dark:border-[#4b4038]
                        dark:text-[#c4b6a7]
                        dark:hover:bg-[#382d27]
                        dark:hover:text-[#e2c17a]
                      "
                    >
                      <LogOut className="h-4 w-4" />

                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      onClick={
                        closeMenus
                      }
                      className="
                        flex
                        min-h-10
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-[#762f2f]
                        bg-transparent
                        px-3
                        text-xs
                        font-semibold
                        text-[#762f2f]
                        transition-colors
                        hover:bg-[#f8f0df]
                        dark:border-[#9b4b4b]
                        dark:text-[#e2c17a]
                        dark:hover:bg-[#382d27]
                      "
                    >
                      <LogIn className="h-4 w-4" />

                      {t("login")}
                    </Link>

                    <Link
                      href={`/${locale}/signup`}
                      onClick={
                        closeMenus
                      }
                      className="
                        flex
                        min-h-10
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#762f2f]
                        px-3
                        text-xs
                        font-semibold
                        text-white
                        shadow-sm
                        transition-colors
                        hover:bg-[#602525]
                        dark:bg-[#9b4b4b]
                        dark:hover:bg-[#a95b5b]
                      "
                    >
                      {t("signup")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

