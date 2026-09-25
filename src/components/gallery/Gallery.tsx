"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslations } from "next-intl";
import ShareButton from "@/components/common/ShareButton";
import MarkNotificationsSeen from "../notifications/MarkNotificationsSeen";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  Play,
  Video,
  X,
} from "lucide-react";

type GalleryPhoto = {
  id: string;
  type: "photo";
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  width: number | null;
  height: number | null;
  createdAt: string | null;

  // Official photo:
  // source is missing/null.
  //
  // Public contributor photo:
  // source === "contributor".
  source?: string | null;

  // Firestore photo view count.
  viewCount: number;
};

type GalleryVideo = {
  id: string;
  type: "video";
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string | null;
  duration: string | null;

  // YouTube view count.
  viewCount: string | null;

  likeCount: string | null;
  commentCount: string | null;
  liveBroadcastContent: string | null;
};

type GalleryMedia =
  | GalleryPhoto
  | GalleryVideo;

type FilterType =
  | "all"
  | "officialPhotos"
  | "publicPhotos"
  | "videos";

type GalleryProps = {
  initialPhotos: GalleryPhoto[];
  initialVideos: GalleryVideo[];
  initialError?: boolean;
};

/*
 * --------------------------------------------------------
 * FORMAT PHOTO VIEWS
 * --------------------------------------------------------
 */

function formatPhotoViews(
  value: number | null | undefined,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "0";
  }

  return value.toLocaleString("en-IN");
}

/*
 * --------------------------------------------------------
 * FORMAT YOUTUBE VIEWS
 * --------------------------------------------------------
 */

function formatVideoViews(
  value: string | null,
) {
  if (!value) {
    return "0";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`;
  }

  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  }

  return number.toLocaleString("en-IN");
}

/*
 * ========================================================
 * GALLERY COMPONENT
 * ========================================================
 */

export default function Gallery({
  initialPhotos,
  initialVideos,
  initialError = false,
}: GalleryProps) {
  const t = useTranslations("gallery");

  /*
   * ------------------------------------------------------
   * STATE
   * ------------------------------------------------------
   */

  const [photos, setPhotos] =
    useState<GalleryPhoto[]>(
      Array.isArray(initialPhotos)
        ? initialPhotos
        : [],
    );

  const [videos] =
    useState<GalleryVideo[]>(
      Array.isArray(initialVideos)
        ? initialVideos
        : [],
    );
  const galleryIds = useMemo(
    () => [
      ...photos.map(
        (photo) => photo.id,
      ),
      ...videos.map(
        (video) => video.id,
      ),
    ],
    [photos, videos],
  );
  const [filter, setFilter] =
    useState<FilterType>("all");

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [selectedMedia, setSelectedMedia] =
    useState<GalleryMedia | null>(null);

  const [viewLoading, setViewLoading] =
    useState(false);

  /*
   * ------------------------------------------------------
   * OFFICIAL PHOTOS
   * ------------------------------------------------------
   */

  const officialPhotos = useMemo(
    () =>
      photos.filter(
        (photo) =>
          photo.source !== "contributor",
      ),
    [photos],
  );

  /*
   * ------------------------------------------------------
   * PUBLIC PHOTOS
   * ------------------------------------------------------
   */

  const publicPhotos = useMemo(
    () =>
      photos.filter(
        (photo) =>
          photo.source === "contributor",
      ),
    [photos],
  );

  /*
   * ------------------------------------------------------
   * CURRENT MEDIA
   * ------------------------------------------------------
   */

  const media = useMemo<GalleryMedia[]>(() => {
    if (filter === "officialPhotos") {
      return officialPhotos;
    }

    if (filter === "publicPhotos") {
      return publicPhotos;
    }

    if (filter === "videos") {
      return videos;
    }

    return [
      ...officialPhotos,
      ...publicPhotos,
      ...videos,
    ];
  }, [
    filter,
    officialPhotos,
    publicPhotos,
    videos,
  ]);

  /*
   * ========================================================
   * REFRESH PHOTO VIEW COUNTS
   * ========================================================
   *
   * This ONLY READS the latest counts.
   *
   * It does NOT increment views.
   *
   * The endpoint is:
   *
   * GET /api/gallery/views?ids=id1,id2,id3
   *
   * This allows the main Gallery page to stay cached
   * while the displayed view counts remain fresh.
   * ========================================================
   */

  const refreshPhotoViewCounts =
    useCallback(
      async (photoIds: string[]) => {
        if (photoIds.length === 0) {
          return;
        }

        const uniqueIds = Array.from(
          new Set(
            photoIds.filter(
              (id) =>
                typeof id === "string" &&
                id.length > 0,
            ),
          ),
        );

        if (uniqueIds.length === 0) {
          return;
        }

        try {
          const queryString = uniqueIds
            .map((id) =>
              encodeURIComponent(id),
            )
            .join(",");

          const response = await fetch(
            `/api/gallery/views?ids=${queryString}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

          if (!response.ok) {
            return;
          }

          const data =
            (await response.json()) as {
              success?: boolean;
              views?: Record<
                string,
                number
              >;
            };

          if (
            data.success !== true ||
            !data.views
          ) {
            return;
          }

          /*
           * Update card counts.
           */

          setPhotos((currentPhotos) =>
            currentPhotos.map(
              (photo) => {
                const latestCount =
                  data.views?.[
                  photo.id
                  ];

                if (
                  typeof latestCount !==
                  "number"
                ) {
                  return photo;
                }

                if (
                  photo.viewCount ===
                  latestCount
                ) {
                  return photo;
                }

                return {
                  ...photo,
                  viewCount:
                    latestCount,
                };
              },
            ),
          );

          /*
           * Update modal count if the
           * currently opened item exists.
           */

          setSelectedMedia(
            (currentMedia) => {
              if (
                !currentMedia ||
                currentMedia.type !==
                "photo"
              ) {
                return currentMedia;
              }

              const latestCount =
                data.views?.[
                currentMedia.id
                ];

              if (
                typeof latestCount !==
                "number"
              ) {
                return currentMedia;
              }

              if (
                currentMedia.viewCount ===
                latestCount
              ) {
                return currentMedia;
              }

              return {
                ...currentMedia,
                viewCount:
                  latestCount,
              };
            },
          );
        } catch (error) {
          /*
           * View refresh failure must never
           * break the Gallery.
           */

          console.error(
            "Failed to refresh gallery view counts:",
            error,
          );
        }
      },
      [],
    );

  /*
   * ========================================================
   * INITIAL VIEW COUNT REFRESH
   * ========================================================
   *
   * IMPORTANT:
   *
   * Do NOT use [photos] here.
   *
   * If we use [photos], every view-count update would
   * trigger another refresh request.
   *
   * We only want to refresh when the number of photos
   * changes.
   * ========================================================
   */

  useEffect(() => {
    const photoIds =
      photos.map(
        (photo) => photo.id,
      );

    if (photoIds.length === 0) {
      return;
    }

    void refreshPhotoViewCounts(
      photoIds,
    );
  }, [
    photos.length,
    refreshPhotoViewCounts,
  ]);

  /*
   * ========================================================
   * RECORD PHOTO VIEW
   * ========================================================
   *
   * This increments Firestore viewCount by 1.
   *
   * It is called only when a photo is opened
   * or when navigating to another photo.
   * ========================================================
   */

  const recordPhotoView = useCallback(
    async (
      photo: GalleryPhoto,
    ): Promise<GalleryPhoto> => {
      setViewLoading(true);

      try {
        const response = await fetch(
          `/api/gallery/${encodeURIComponent(
            photo.id,
          )}/view`,
          {
            method: "POST",
          },
        );

        if (!response.ok) {
          return photo;
        }

        const data =
          (await response.json()) as {
            success?: boolean;
            viewCount?: number;
          };

        if (
          data.success !== true ||
          typeof data.viewCount !==
          "number"
        ) {
          return photo;
        }

        const updatedPhoto: GalleryPhoto = {
          ...photo,
          viewCount:
            data.viewCount,
        };

        /*
         * Update card count.
         */

        setPhotos((currentPhotos) =>
          currentPhotos.map(
            (currentPhoto) =>
              currentPhoto.id ===
                photo.id
                ? updatedPhoto
                : currentPhoto,
          ),
        );

        return updatedPhoto;
      } catch (error) {
        console.error(
          "Failed to record gallery photo view:",
          error,
        );

        return photo;
      } finally {
        setViewLoading(false);
      }
    },
    [],
  );

  /*
   * ========================================================
   * OPEN MEDIA
   * ========================================================
   */

  const openMedia = async (
    item: GalleryMedia,
    index: number,
  ) => {
    setSelectedIndex(index);
    setSelectedMedia(item);

    if (item.type === "photo") {
      const updatedPhoto =
        await recordPhotoView(item);

      setSelectedMedia(
        updatedPhoto,
      );
    }
  };

  /*
   * ========================================================
   * PREVIOUS
   * ========================================================
   */

  const showPrevious = async () => {
    if (
      selectedIndex === null ||
      media.length === 0
    ) {
      return;
    }

    const previousIndex =
      selectedIndex <= 0
        ? media.length - 1
        : selectedIndex - 1;

    const previousItem =
      media[previousIndex];

    setSelectedIndex(
      previousIndex,
    );

    setSelectedMedia(
      previousItem,
    );

    if (
      previousItem.type ===
      "photo"
    ) {
      const updatedPhoto =
        await recordPhotoView(
          previousItem,
        );

      setSelectedMedia(
        updatedPhoto,
      );
    }
  };

  /*
   * ========================================================
   * NEXT
   * ========================================================
   */

  const showNext = async () => {
    if (
      selectedIndex === null ||
      media.length === 0
    ) {
      return;
    }

    const nextIndex =
      selectedIndex >=
        media.length - 1
        ? 0
        : selectedIndex + 1;

    const nextItem =
      media[nextIndex];

    setSelectedIndex(
      nextIndex,
    );

    setSelectedMedia(
      nextItem,
    );

    if (
      nextItem.type === "photo"
    ) {
      const updatedPhoto =
        await recordPhotoView(
          nextItem,
        );

      setSelectedMedia(
        updatedPhoto,
      );
    }
  };

  /*
   * ========================================================
   * CLOSE MODAL
   * ========================================================
   */

  const closeMedia = () => {
    setSelectedMedia(null);
    setSelectedIndex(null);
    setViewLoading(false);
  };

  /*
   * ========================================================
   * KEYBOARD + BODY SCROLL
   * ========================================================
   */

  useEffect(() => {
    if (!selectedMedia) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        closeMedia();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        void showPrevious();
      }

      if (
        event.key === "ArrowRight"
      ) {
        void showNext();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    selectedMedia,
    selectedIndex,
    media,
  ]);

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <>
      <main className="min-h-screen bg-[#fbf7ef] dark:bg-[#171210]">
        <MarkNotificationsSeen
          section="gallery"
          ids={galleryIds}
        />
        {/* ================================================= */}
        {/* PAGE HEADER                                      */}
        {/* ================================================= */}

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

                  <ImageIcon
                    className="h-5 w-5 shrink-0 text-[#762f2f] dark:text-[#d8b56a] sm:h-6 sm:w-6"
                    aria-hidden="true"
                  />

                  <span>
                    {t("title")}
                  </span>

                </h1>

                <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-[#65584e] dark:text-[#c9bca9] sm:text-sm">
                  {t("subtitle")}
                </p>

              </div>

              {/* SHARE BUTTON */}

              <div className="absolute -right-2 top-1/2 -translate-y-1/2 sm:-right-3 lg:-right-6">

                <ShareButton
                  title={t("title")}
                  text={t("subtitle")}
                />

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* CONTENT                                          */}
        {/* ================================================= */}

        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

          {/* FILTERS */}

          <div className="mb-7 flex justify-center sm:mb-8">

            <div
              className="inline-flex max-w-full overflow-x-auto rounded-xl border border-[#d8c9a8] bg-[#fffaf0] p-1 shadow-sm dark:border-[#4a3c34] dark:bg-[#241b18]"
              role="tablist"
              aria-label={t("title")}
            >

              {(
                [
                  ["all", t("all")],
                  [
                    "officialPhotos",
                    t(
                      "officialPhotos",
                    ),
                  ],
                  [
                    "publicPhotos",
                    t(
                      "publicPhotos",
                    ),
                  ],
                  [
                    "videos",
                    t("videos"),
                  ],
                ] as const
              ).map(
                ([value, label]) => {
                  const isActive =
                    filter === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={
                        isActive
                      }
                      onClick={() => {
                        setFilter(
                          value,
                        );
                        closeMedia();
                      }}
                      className={[
                        "min-h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52]",
                        "sm:px-6",

                        isActive
                          ? "bg-[#762f2f] text-[#fffaf0] shadow-sm dark:bg-[#8a3b3b] dark:text-[#fffaf0]"
                          : "text-[#6b5b50] hover:bg-[#f1e7d4] hover:text-[#4b2823] dark:text-[#c9bca9] dark:hover:bg-[#342720] dark:hover:text-[#f3dfbc]",
                      ].join(
                        " ",
                      )}
                    >
                      {label}
                    </button>
                  );
                },
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* ERROR                                            */}
          {/* ================================================= */}

          {initialError &&
            media.length === 0 && (
              <div className="flex min-h-[320px] items-center justify-center">

                <div className="w-full max-w-md border border-[#d8c9a8] bg-[#fffaf0] px-6 py-8 text-center shadow-sm dark:border-[#4a3c34] dark:bg-[#241b18]">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c29a52]/50 text-[#762f2f] dark:text-[#d8b56a]">

                    <ImageIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />

                  </div>

                  <p className="mt-4 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                    {t("error")}
                  </p>

                </div>

              </div>
            )}

          {/* ================================================= */}
          {/* EMPTY                                            */}
          {/* ================================================= */}

          {!initialError &&
            media.length === 0 && (
              <div className="flex min-h-[320px] items-center justify-center">

                <div className="w-full max-w-md border border-dashed border-[#cdbd9d] bg-[#fffaf0]/70 px-6 py-10 text-center dark:border-[#51443a] dark:bg-[#241b18]/60">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c29a52]/50 text-[#762f2f] dark:text-[#d8b56a]">

                    {filter ===
                      "videos" ? (
                      <Video
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <ImageIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    )}

                  </div>

                  <p className="mt-4 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">

                    {filter ===
                      "officialPhotos"
                      ? t(
                        "noOfficialPhotos",
                      )
                      : filter ===
                        "publicPhotos"
                        ? t(
                          "noPublicPhotos",
                        )
                        : filter ===
                          "videos"
                          ? t(
                            "noVideos",
                          )
                          : t(
                            "noMedia",
                          )}

                  </p>

                </div>

              </div>
            )}

          {/* ================================================= */}
          {/* GRID                                             */}
          {/* ================================================= */}

          {media.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">

              {media.map(
                (
                  item,
                  index,
                ) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() =>
                      void openMedia(
                        item,
                        index,
                      )
                    }
                    aria-label={
                      item.title ||
                      (item.type ===
                        "video"
                        ? t(
                          "playVideo",
                        )
                        : t(
                          "title",
                        ))
                    }
                    className={[
                      "group relative aspect-square overflow-hidden border border-[#d8c9a8] bg-[#eee4d2] text-left shadow-sm",
                      "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2",
                      "dark:border-[#4a3c34] dark:bg-[#2a211d] dark:focus-visible:ring-offset-[#171210]",
                    ].join(" ")}
                  >

                    {/* IMAGE */}

                    <img
                      src={
                        item.type ===
                          "photo"
                          ? item.url
                          : item.thumbnail
                      }
                      alt={
                        item.title ||
                        t("title")
                      }
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* WARM OVERLAY */}

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#2a1210]/90 via-[#2a1210]/10 to-transparent"
                      aria-hidden="true"
                    />

                    {/* GOLD TOP LINE */}

                    <div
                      className="absolute inset-x-0 top-0 h-0.5 bg-[#c29a52] opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />

                    {/* MEDIA TYPE */}

                    <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">

                      {item.type ===
                        "video" ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f3dfbc]/60 bg-[#762f2f] text-[#fffaf0] shadow-md sm:h-10 sm:w-10">

                          <Play
                            className="ml-0.5 h-4 w-4 fill-current sm:h-5 sm:w-5"
                            aria-hidden="true"
                          />

                        </div>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f3dfbc]/60 bg-[#4b2823]/80 text-[#fffaf0] shadow-md sm:h-10 sm:w-10">

                          <ImageIcon
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            aria-hidden="true"
                          />

                        </div>
                      )}

                    </div>

                    {/* PUBLIC PHOTO BADGE */}

                    {item.type ===
                      "photo" &&
                      item.source ===
                      "contributor" && (
                        <div className="absolute right-2.5 top-2.5 rounded-full border border-[#f3dfbc]/40 bg-[#762f2f]/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#fffaf0] shadow-md sm:right-3 sm:top-3 sm:text-[10px]">

                          {t(
                            "publicPhotos",
                          )}

                        </div>
                      )}

                    {/* TITLE + VIEWS */}

                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">

                      <p className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-[#fffaf0] sm:text-base">

                        {item.title ||
                          (item.type ===
                            "video"
                            ? t(
                              "videos",
                            )
                            : t(
                              "photos",
                            ))}

                      </p>

                      {/* PHOTO VIEWS */}

                      {item.type ===
                        "photo" && (
                          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#f3dfbc]/80">

                            <Eye
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />

                            {formatPhotoViews(
                              item.viewCount,
                            )}{" "}
                            views

                          </p>
                        )}

                      {/* YOUTUBE VIEWS */}

                      {item.type ===
                        "video" &&
                        item.viewCount && (
                          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#f3dfbc]/80">

                            <Eye
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />

                            {formatVideoViews(
                              item.viewCount,
                            )}{" "}
                            views

                          </p>
                        )}

                      {/* VIDEO LABEL */}

                      {item.type ===
                        "video" && (
                          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#f3dfbc]/75">

                            {t(
                              "playVideo",
                            )}

                          </p>
                        )}

                    </div>

                  </button>
                ),
              )}

            </div>
          )}

          {/* ================================================= */}
          {/* DECORATION                                       */}
          {/* ================================================= */}

          {media.length > 0 && (
            <div className="mt-10 flex items-center justify-center gap-3 text-[#c29a52]">

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
          )}

        </section>

      </main>

      {/* ===================================================== */}
      {/* MEDIA MODAL                                          */}
      {/* ===================================================== */}

      {selectedMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#120b09]/95 p-2 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedMedia.title
          }
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeMedia();
            }
          }}
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeMedia}
            aria-label={t("close")}
            className="absolute right-2 top-2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#f3dfbc]/30 bg-[#241512] text-[#fffaf0] shadow-lg transition-colors hover:bg-[#4b2424] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a] sm:right-5 sm:top-5"
          >

            <X
              className="h-5 w-5"
              aria-hidden="true"
            />

          </button>

          {/* PREVIOUS */}

          {media.length > 1 && (
            <button
              type="button"
              onClick={() =>
                void showPrevious()
              }
              aria-label={t("previous")}
              className="absolute left-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#f3dfbc]/30 bg-[#241512] text-[#fffaf0] shadow-lg transition-colors hover:bg-[#4b2424] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a] sm:left-5"
            >

              <ChevronLeft
                className="h-5 w-5"
                aria-hidden="true"
              />

            </button>
          )}

          {/* NEXT */}

          {media.length > 1 && (
            <button
              type="button"
              onClick={() =>
                void showNext()
              }
              aria-label={t("next")}
              className="absolute right-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#f3dfbc]/30 bg-[#241512] text-[#fffaf0] shadow-lg transition-colors hover:bg-[#4b2424] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b56a] sm:right-5"
            >

              <ChevronRight
                className="h-5 w-5"
                aria-hidden="true"
              />

            </button>
          )}

          {/* MODAL CONTENT */}

          <div className="flex max-h-[96vh] w-full max-w-6xl flex-col items-center">

            {selectedMedia.type ===
              "photo" ? (
              <div className="relative flex max-h-[82vh] w-full items-center justify-center">

                <img
                  src={
                    selectedMedia.url
                  }
                  alt={
                    selectedMedia.title ||
                    t("title")
                  }
                  className="max-h-[82vh] max-w-full object-contain shadow-2xl"
                />

                {/* VIEW COUNT */}

                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5">

                  <div className="inline-flex items-center gap-2 rounded-full border border-[#f3dfbc]/30 bg-[#241512]/90 px-3 py-1.5 text-xs font-semibold text-[#fffaf0] shadow-lg backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">

                    <Eye
                      className="h-4 w-4 shrink-0 text-[#d8b56a] sm:h-4.5 sm:w-4.5"
                      aria-hidden="true"
                    />

                    <span>
                      {formatPhotoViews(
                        selectedMedia.viewCount,
                      )}{" "}
                      views
                    </span>

                  </div>

                </div>

                {/* UPDATING */}

                {viewLoading && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-5">

                    <div className="rounded-full border border-[#f3dfbc]/20 bg-[#241512]/90 px-3 py-1.5 text-[11px] text-[#f3dfbc]/80 shadow-lg backdrop-blur-sm">
                      Updating views...
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="w-full max-w-5xl">

                <div className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl">

                  <iframe
                    src={`https://www.youtube.com/embed/${encodeURIComponent(
                      selectedMedia.id,
                    )}?autoplay=1&rel=0&modestbranding=1`}
                    title={
                      selectedMedia.title
                    }
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />

                </div>

              </div>
            )}

            {/* ================================================= */}
            {/* DESCRIPTION                                      */}
            {/* ================================================= */}

            <div className="mt-3 w-full max-w-5xl border border-[#6d5547] bg-[#241512] px-4 py-3 text-[#fffaf0] sm:mt-4 sm:px-5 sm:py-4">

              <div className="flex items-start gap-3">

                <div className="mt-0.5 shrink-0 text-[#d8b56a]">

                  {selectedMedia.type ===
                    "video" ? (
                    <Video
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <ImageIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  )}

                </div>

                <div className="min-w-0 flex-1">

                  <h2 className="font-serif text-base font-semibold sm:text-lg">
                    {
                      selectedMedia.title
                    }
                  </h2>

                  {selectedMedia.description && (
                    <p className="mt-1 line-clamp-3 text-sm leading-5 text-[#f3dfbc]/70">
                      {
                        selectedMedia.description
                      }
                    </p>
                  )}

                </div>

                {/* MODAL VIEW COUNT */}

                {selectedMedia.type ===
                  "photo" && (
                    <div className="shrink-0">

                      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6d5547] bg-[#1b100e] px-2.5 py-1.5 text-[11px] font-semibold text-[#f3dfbc] sm:px-3 sm:text-xs">

                        <Eye
                          className="h-3.5 w-3.5 text-[#d8b56a]"
                          aria-hidden="true"
                        />

                        {formatPhotoViews(
                          selectedMedia.viewCount,
                        )}{" "}
                        views

                      </div>

                    </div>
                  )}

                {selectedMedia.type ===
                  "video" &&
                  selectedMedia.viewCount && (
                    <div className="shrink-0">

                      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6d5547] bg-[#1b100e] px-2.5 py-1.5 text-[11px] font-semibold text-[#f3dfbc] sm:px-3 sm:text-xs">

                        <Eye
                          className="h-3.5 w-3.5 text-[#d8b56a]"
                          aria-hidden="true"
                        />

                        {formatVideoViews(
                          selectedMedia.viewCount,
                        )}{" "}
                        views

                      </div>

                    </div>
                  )}

              </div>

              {/* MEDIA POSITION */}

              {media.length > 1 &&
                selectedIndex !==
                null && (
                  <div className="mt-3 border-t border-[#6d5547] pt-2 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[#d8b56a]/70">

                    {selectedIndex + 1} /{" "}
                    {media.length}

                  </div>
                )}

            </div>

          </div>

        </div>
      )}
    </>
  );
}