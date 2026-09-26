"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Church,
  Images,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroProps = {
  locale: string;
  sundayWorship: string;
};

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  scale: number;
};

const STAR_COUNT = 32;

function createInitialStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, index) => ({
    id: index,
    left: 5 + ((index * 23) % 90),
    top: 8 + ((index * 37) % 78),
    size: 1 + (index % 3),
    opacity: 0,
    scale: 0.5,
  }));
}

export default function Hero({ locale,sundayWorship,   }: HeroProps) {
  const t = useTranslations("home");

  const [stars, setStars] =
    useState<Star[]>(createInitialStars);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    stars.forEach((_, index) => {
      const startDelay =
        500 + Math.random() * 5000;

      const startTimer = setTimeout(() => {
        const showStar = () => {
          const left =
            3 + Math.random() * 94;

          const top =
            5 + Math.random() * 82;

          const size =
            Math.random() > 0.8
              ? 3
              : Math.random() > 0.5
                ? 2
                : 1;

          setStars((current) =>
            current.map((star, starIndex) =>
              starIndex === index
                ? {
                    ...star,
                    left,
                    top,
                    size,
                    opacity: 0,
                    scale: 0.5,
                  }
                : star
            )
          );

          const fadeInTimer = setTimeout(() => {
            setStars((current) =>
              current.map((star, starIndex) =>
                starIndex === index
                  ? {
                      ...star,
                      opacity: 1,
                      scale:
                        size >= 3
                          ? 1.35
                          : 1,
                    }
                  : star
              )
            );
          }, 80);

          timers.push(fadeInTimer);

          const visibleTime =
            700 +
            Math.random() * 1800;

          const fadeOutTimer = setTimeout(() => {
            setStars((current) =>
              current.map((star, starIndex) =>
                starIndex === index
                  ? {
                      ...star,
                      opacity: 0,
                      scale: 0.4,
                    }
                  : star
              )
            );
          }, visibleTime);

          timers.push(fadeOutTimer);

          const nextCycleTimer = setTimeout(
            showStar,
            visibleTime +
              400 +
              Math.random() * 2800
          );

          timers.push(nextCycleTimer);
        };

        showStar();
      }, startDelay);

      timers.push(startTimer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#3a211d] text-white dark:bg-[#1c1513]">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/heroImage.webp')",
        }}
        aria-hidden="true"
      />

      {/* Dark cinematic overlay for stronger star visibility */}
      <div
        className="absolute inset-0 bg-[#120907]/1"
        aria-hidden="true"
      />

      {/* Stronger left-side shading for readable text */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#170b08]/95 via-[#291511]/65  to-[#24130f]/1"
        aria-hidden="true"
      />

      {/* Soft golden atmospheric glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#d9b35f]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[-160px] top-[-140px] h-[420px] w-[420px] rounded-full bg-[#f0d38c]/8 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          RANDOM TWINKLING STAR FIELD
      ====================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        aria-hidden="true"
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-[#ffe7aa] shadow-[0_0_14px_3px_rgba(255,231,170,0.95)]"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              transform: `scale(${star.scale})`,
              transition:
                "opacity 900ms ease, transform 900ms ease",
            }}
          />
        ))}
      </div>

      {/* A few larger soft stars */}
      <div
        className="pointer-events-none absolute left-[20%] top-[18%] z-10 h-1.5 w-1.5 rounded-full bg-[#ffe8b2] shadow-[0_0_18px_5px_rgba(255,232,178,0.35)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[18%] top-[25%] z-10 h-1.5 w-1.5 rounded-full bg-[#ffe8b2] shadow-[0_0_18px_5px_rgba(255,232,178,0.3)]"
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#24130f]/80 to-transparent"
        aria-hidden="true"
      />

    

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="relative z-20 mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-24 md:min-h-[680px] md:px-8 lg:min-h-[720px] lg:py-28">

        <div className="max-w-3xl">

          {/* Church label */}
          <div className="mb-6 inline-flex items-center gap-3 border border-[#d7b76e]/50 bg-[#2f1b17]/70 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f3dfb0] shadow-lg shadow-black/20 sm:text-sm">

            <span
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d7b76e]/60 text-[#d7b76e]"
              aria-hidden="true"
            >
              <Church className="h-4 w-4" />
            </span>

            <span>
              {t("heroLabel")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-7xl">

            {t("heroTitle")}

            <span className="mt-2 block bg-gradient-to-r from-[#f2d995] via-[#e2c27b] to-[#cda45a] bg-clip-text text-transparent">
              {t("heroSubtitle")}
            </span>

          </h1>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">

            <span className="h-px w-12 bg-[#d1ad61]" />

            <span
              className="text-sm text-[#e1c17b]"
              aria-hidden="true"
            >
              ✦
            </span>

            <span className="h-px w-20 bg-[#d1ad61]/60" />

          </div>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#f1e7d9] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-lg sm:leading-8 md:text-xl">
            {t("heroDescription")}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

            {/* Discover */}
            <Link
              href={`/${locale}/about`}
              className={cn(
                buttonVariants({
                  size: "lg",
                }),
                [
                  "min-h-12 rounded-md px-6 py-3.5",
                  "border border-[#d4ae5e]",
                  "bg-[#f4e7c8]",
                  "font-semibold text-[#552521]",
                  "shadow-lg shadow-black/20",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:bg-[#fff1d0]",
                  "hover:text-[#4a201d]",
                  "hover:shadow-xl",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#d8b96e]",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[#3a211d]",
                  "sm:px-7",
                ].join(" ")
              )}
            >
              {t("heroDiscover")}

              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            {/* Gallery */}
            <Link
              href={`/${locale}/gallery`}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                }),
                [
                  "min-h-12 rounded-md px-6 py-3.5",
                  "border-[#ead7ae]/60",
                  "bg-[#2c1a16]/50",
                  "font-semibold text-white",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:bg-[#f4e7c8]",
                  "hover:text-[#552521]",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#d8b96e]",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[#3a211d]",
                  "sm:px-7",
                ].join(" ")
              )}
            >
              <Images className="mr-2 h-4 w-4" />

              {t("heroGallery")}
            </Link>

          </div>

          {/* Worship information */}
          <div className="mt-10 flex items-center gap-3 border-l-2 border-[#c49a4e] pl-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d9bb79]">
                Sunday Worship
              </p>

              <p className="mt-1 text-sm text-[#f1e7d9] sm:text-base">
                 {sundayWorship}
              </p>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom decorative border */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 h-px bg-[#c49a4e]/50"
        aria-hidden="true"
      />
    </section>
  );
}