
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Locale = "en" | "hi" | "kru";

export type SliderItem = {
  id: string;

  title: {
    en: string;
    hi: string;
    kru: string;
  };

  description: {
    en: string;
    hi: string;
    kru: string;
  };

  buttonText: {
    en: string;
    hi: string;
    kru: string;
  };

  imageUrl: string;
  publicId: string;
  buttonUrl: string;
  displayOrder: number;
};

type HeroSliderProps = {
  locale: string;
  sliderItems: SliderItem[];
};

function getLocale(locale: string): Locale {
  if (locale === "hi") {
    return "hi";
  }

  if (locale === "kru") {
    return "kru";
  }

  return "en";
}

export default function HeroSlider({
  locale,
  sliderItems,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const selectedLocale = getLocale(locale);

  /*
   * Keep current slide valid
   */
  useEffect(() => {
    if (
      sliderItems.length > 0 &&
      current >= sliderItems.length
    ) {
      setCurrent(0);
    }
  }, [sliderItems.length, current]);

  /*
   * Next slide
   */
  const nextSlide = () => {
    if (sliderItems.length <= 1) {
      return;
    }

    setCurrent((previous) => {
      return (previous + 1) % sliderItems.length;
    });
  };

  /*
   * Previous slide
   */
  const previousSlide = () => {
    if (sliderItems.length <= 1) {
      return;
    }

    setCurrent((previous) => {
      return (
        (previous - 1 + sliderItems.length) %
        sliderItems.length
      );
    });
  };

  /*
   * Automatic slideshow
   *
   * Always autoplay.
   */
  useEffect(() => {
    if (sliderItems.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrent((previous) => {
        return (previous + 1) % sliderItems.length;
      });
    }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, [sliderItems.length]);

  /*
   * Touch / swipe
   */
  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;

    touchEndX.current = null;
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    touchEndX.current =
      event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;

    const minimumSwipeDistance = 50;

    if (Math.abs(distance) >= minimumSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const item = sliderItems[current];

  /*
   * Empty state
   */
  if (!item) {
    return null;
  }

  return (
    <section className="bg-[#fffdf7] py-10 text-[#33251d] dark:bg-[#211b18] dark:text-[#f5ead8] sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#b99755]" />

            <span
              className="font-serif text-sm text-[#a77a32]"
              aria-hidden="true"
            >
              ✦
            </span>

            <span className="h-px w-10 bg-[#b99755]" />
          </div>
        </div>

        {/* Slider */}
        <div
          className="group relative overflow-hidden rounded-xl border border-[#d8c9a8] bg-[#2e1b17] shadow-md dark:border-[#4b4038]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 
            Slider viewport

            The image completely fills this area.
          */}
          <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/7]">

            {sliderItems.map((slider, index) => {
              const title =
                slider.title[selectedLocale];

              const description =
                slider.description[selectedLocale];

              const buttonText =
                slider.buttonText[selectedLocale];

              const isCurrent = index === current;

              return (
                <div
                  key={slider.id}
                  className={[
                    "absolute inset-0",
                    "transition-opacity duration-700 ease-in-out",
                    "motion-reduce:transition-none",
                    isCurrent
                      ? "z-10 opacity-100"
                      : "pointer-events-none z-0 opacity-0",
                  ].join(" ")}
                  aria-hidden={!isCurrent}
                >
                  {/* Image */}
                  <Image
                    src={slider.imageUrl}
                    alt={title || "Jodhpur Church"}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className={[
                      "absolute inset-0",
                      "h-full w-full",
                      "object-contain",
                      "transition-transform duration-[4500ms] ease-out",
                      "motion-reduce:transition-none",
                      isCurrent
                        ? "scale-100"
                        : "scale-105",
                    ].join(" ")}
                    draggable={false}
                  />

                  {/* Traditional warm overlay */}
                  {/* <div className="absolute inset-0 bg-[#24130f]/45" /> */}

                  {/* Text readability overlay */}
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-[#24130f]/90 via-[#3a211d]/55 to-transparent" /> */}

                  {/* Bottom overlay */}
                  {/* <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#24130f]/80 to-transparent" /> */}

                  {/* Content */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full px-5 pb-9 sm:px-9 sm:pb-11 lg:px-14 lg:pb-14">
                      <div className="max-w-2xl text-white">

                        {title && (
                          <>
                            <div className="mb-3 flex items-center gap-3">
                              <span className="h-px w-8 bg-[#d8b56a]" />

                              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e5cb91]">
                                Jodhpur Church
                              </span>
                            </div>

                            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                              {title}
                            </h2>
                          </>
                        )}

                        {description && (
                          <p className="mt-3 max-w-xl text-sm leading-6 text-[#f4eadc] sm:mt-4 sm:text-base sm:leading-7 lg:text-lg">
                            {description}
                          </p>
                        )}

                        {buttonText && slider.buttonUrl && (
                          <Link
                            href={slider.buttonUrl}
                            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md border border-[#d4ae5e] bg-[#f4e7c8] px-5 py-2.5 text-sm font-semibold text-[#552521] shadow-lg transition-colors hover:bg-[#fff1d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c27b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a211d] sm:mt-6 sm:px-6 sm:text-base"
                          >
                            {buttonText}

                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Previous */}
            {sliderItems.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border border-white/30 bg-[#24130f]/70 text-white shadow-lg transition-colors hover:bg-[#762f2f] hover:text-white focus-visible:ring-2 focus-visible:ring-[#e2c27b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24130f] sm:left-5 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Next */}
            {sliderItems.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border border-white/30 bg-[#24130f]/70 text-white shadow-lg transition-colors hover:bg-[#762f2f] hover:text-white focus-visible:ring-2 focus-visible:ring-[#e2c27b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24130f] sm:right-5 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}

            {/* Counter */}
            {sliderItems.length > 1 && (
              <div className="absolute right-4 top-4 z-20 rounded-full border border-white/25 bg-[#24130f]/75 px-3 py-1.5 text-xs font-medium text-white sm:right-5 sm:top-5">
                {current + 1} / {sliderItems.length}
              </div>
            )}
          </div>
        </div>

        {/* Slide indicators */}
        {sliderItems.length > 1 && (
          <div
            className="mt-5 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Hero slides"
          >
            {sliderItems.map((slider, index) => (
              <button
                key={slider.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={current === index}
                role="tab"
                className={[
                  "min-h-6 min-w-6 p-2",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#a77a32]",
                  "focus-visible:ring-offset-2",
                  "dark:focus-visible:ring-offset-[#211b18]",
                ].join(" ")}
              >
                <span
                  className={[
                    "block h-1.5 rounded-full transition-all duration-300",
                    current === index
                      ? "w-8 bg-[#762f2f] dark:bg-[#d8b56a]"
                      : "w-2 bg-[#c9bca9] hover:w-4 dark:bg-[#66584e]",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

