
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getSeenContentIds,
  initializeContentState,
} from "@/lib/notifications/local-state";

export type ContentSection =
  | "notifications"
  | "gallery"
  | "events"
  | "sermons"
  | "blog";

type NotificationUnreadContextValue = {
  hasUnreadNotifications: boolean;
  hasUnreadGallery: boolean;
  hasUnreadEvents: boolean;
  hasUnreadSermons: boolean;
  hasUnreadBlog: boolean;
  hasAnyUnreadContent: boolean;
};

const NotificationUnreadContext =
  createContext<NotificationUnreadContextValue>({
    hasUnreadNotifications: false,
    hasUnreadGallery: false,
    hasUnreadEvents: false,
    hasUnreadSermons: false,
    hasUnreadBlog: false,
    hasAnyUnreadContent: false,
  });

type ApiItem = {
  id: string;
};

type ContentPushType =
  | "notification"
  | "photo"
  | "youtube_video"
  | "event"
  | "sermon"
  | "blog";

type ContentPushDetail = {
  type?: unknown;
  id?: unknown;
};

function getIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return (value as ApiItem[])
    .map((item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string"
        ? item.id
        : null
    )
    .filter(
      (id): id is string =>
        typeof id === "string" &&
        id.length > 0
    );
}

function getGalleryIds(
  data: unknown
): string[] {
  if (
    typeof data !== "object" ||
    data === null
  ) {
    return [];
  }

  const value = data as {
    photos?: unknown;
    videos?: unknown;
  };

  return Array.from(
    new Set([
      ...getIds(value.photos),
      ...getIds(value.videos),
    ])
  );
}

export function useNotificationUnread() {
  return useContext(
    NotificationUnreadContext
  );
}

export default function NotificationUnreadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    hasUnreadNotifications,
    setHasUnreadNotifications,
  ] = useState(false);

  const [
    hasUnreadGallery,
    setHasUnreadGallery,
  ] = useState(false);

  const [
    hasUnreadEvents,
    setHasUnreadEvents,
  ] = useState(false);

  const [
    hasUnreadSermons,
    setHasUnreadSermons,
  ] = useState(false);

  const [
    hasUnreadBlog,
    setHasUnreadBlog,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    /*
     * --------------------------------------------------------
     * UPDATE SECTION FROM API
     * --------------------------------------------------------
     */

    const updateSection = (
      section: ContentSection,
      ids: string[]
    ) => {
      /*
       * First visit on this browser/device:
       *
       * Existing content is considered already seen.
       * Only content added after initialization becomes unread.
       */

      initializeContentState(
        section,
        ids
      );

      const seenIds =
        getSeenContentIds(section);

      const hasNew = ids.some(
        (id) =>
          !seenIds.includes(id)
      );

      if (!mounted) {
        return;
      }

      switch (section) {
        case "notifications":
          setHasUnreadNotifications(
            hasNew
          );
          break;

        case "gallery":
          setHasUnreadGallery(
            hasNew
          );
          break;

        case "events":
          setHasUnreadEvents(
            hasNew
          );
          break;

        case "sermons":
          setHasUnreadSermons(
            hasNew
          );
          break;

        case "blog":
          setHasUnreadBlog(
            hasNew
          );
          break;
      }
    };

    /*
     * --------------------------------------------------------
     * CHECK ALL CONTENT
     * --------------------------------------------------------
     *
     * Fallback/reconciliation system.
     *
     * Runs:
     * - when provider starts
     * - every 30 seconds
     * - after a section is marked as seen
     * - when a push arrives without an ID
     *
     * No Firestore "read" flag is used.
     */

    const checkAllContent =
      async () => {
        try {
          const results =
            await Promise.allSettled([
              fetch(
                "/api/notifications",
                {
                  cache: "no-store",
                }
              ),

              fetch(
                "/api/gallery",
                {
                  cache: "no-store",
                }
              ),

              fetch(
                "/api/events",
                {
                  cache: "no-store",
                }
              ),

              fetch(
                "/api/sermons",
                {
                  cache: "no-store",
                }
              ),

              fetch(
                "/api/blogger/posts",
                {
                  cache: "no-store",
                }
              ),
            ]);

          if (!mounted) {
            return;
          }

          /*
           * ------------------------------------------------
           * NOTIFICATIONS
           * ------------------------------------------------
           */

          if (
            results[0].status ===
              "fulfilled" &&
            results[0].value.ok
          ) {
            const data: unknown =
              await results[0].value.json();

            if (
              typeof data === "object" &&
              data !== null &&
              "notifications" in data
            ) {
              const value =
                data as {
                  notifications?: unknown;
                };

              updateSection(
                "notifications",
                getIds(
                  value.notifications
                )
              );
            }
          }

          /*
           * ------------------------------------------------
           * GALLERY
           * ------------------------------------------------
           *
           * Gallery contains:
           * - Firestore photos
           * - YouTube videos
           */

          if (
            results[1].status ===
              "fulfilled" &&
            results[1].value.ok
          ) {
            const data: unknown =
              await results[1].value.json();

            updateSection(
              "gallery",
              getGalleryIds(data)
            );
          }

          /*
           * ------------------------------------------------
           * EVENTS
           * ------------------------------------------------
           */

          if (
            results[2].status ===
              "fulfilled" &&
            results[2].value.ok
          ) {
            const data: unknown =
              await results[2].value.json();

            if (
              typeof data === "object" &&
              data !== null &&
              "events" in data
            ) {
              const value =
                data as {
                  events?: unknown;
                };

              updateSection(
                "events",
                getIds(
                  value.events
                )
              );
            }
          }

          /*
           * ------------------------------------------------
           * SERMONS
           * ------------------------------------------------
           */

          if (
            results[3].status ===
              "fulfilled" &&
            results[3].value.ok
          ) {
            const data: unknown =
              await results[3].value.json();

            if (
              typeof data === "object" &&
              data !== null &&
              "sermons" in data
            ) {
              const value =
                data as {
                  sermons?: unknown;
                };

              updateSection(
                "sermons",
                getIds(
                  value.sermons
                )
              );
            }
          }

          /*
           * ------------------------------------------------
           * BLOG
           * ------------------------------------------------
           */

          if (
            results[4].status ===
              "fulfilled" &&
            results[4].value.ok
          ) {
            const data: unknown =
              await results[4].value.json();

            if (
              typeof data === "object" &&
              data !== null &&
              "posts" in data
            ) {
              const value =
                data as {
                  posts?: unknown;
                };

              updateSection(
                "blog",
                getIds(
                  value.posts
                )
              );
            }
          }
        } catch (error) {
          console.error(
            "Unread content check failed:",
            error
          );
        }
      };

    /*
     * --------------------------------------------------------
     * IMMEDIATE FCM PUSH HANDLER
     * --------------------------------------------------------
     *
     * PushNotificationProvider dispatches:
     *
     * "jodhpur-content-push"
     *
     * YouTube videos use:
     *
     * "youtube_video"
     *
     * Because YouTube videos appear in Gallery,
     * youtube_video maps to the Gallery unread state.
     */

    const handleContentPush =
      (event: Event) => {
        if (!mounted) {
          return;
        }

        const customEvent =
          event as CustomEvent<ContentPushDetail>;

        const type =
          customEvent.detail?.type;

        const id =
          customEvent.detail?.id;

        /*
         * ------------------------------------------------
         * PUSH TYPE -> CONTENT SECTION
         * ------------------------------------------------
         */

        const sectionMap: Record<
          ContentPushType,
          ContentSection
        > = {
          notification:
            "notifications",

          photo:
            "gallery",

          youtube_video:
            "gallery",

          event:
            "events",

          sermon:
            "sermons",

          blog:
            "blog",
        };

        /*
         * Ignore unsupported push types.
         */

        if (
          typeof type !== "string" ||
          !(type in sectionMap)
        ) {
          console.log(
            "Unread provider ignored unsupported push type:",
            type
          );

          return;
        }

        const section =
          sectionMap[
            type as ContentPushType
          ];

        /*
         * If the push contains no ID,
         * perform a full API check.
         */

        if (
          typeof id !== "string" ||
          id.length === 0
        ) {
          console.log(
            "Content push has no ID. Rechecking content:",
            {
              type,
              section,
            }
          );

          void checkAllContent();

          return;
        }

        /*
         * If this ID is already marked as seen,
         * do not show the red dot.
         */

        const seenIds =
          getSeenContentIds(
            section
          );

        if (
          seenIds.includes(id)
        ) {
          console.log(
            "Content push is already seen:",
            {
              type,
              section,
              id,
            }
          );

          return;
        }

        /*
         * NEW CONTENT.
         *
         * Immediately activate only the
         * corresponding section.
         */

        switch (section) {
          case "notifications":
            setHasUnreadNotifications(
              true
            );
            break;

          case "gallery":
            setHasUnreadGallery(
              true
            );
            break;

          case "events":
            setHasUnreadEvents(
              true
            );
            break;

          case "sermons":
            setHasUnreadSermons(
              true
            );
            break;

          case "blog":
            setHasUnreadBlog(
              true
            );
            break;
        }

        console.log(
          "🔴 UNREAD CONTENT PUSH:",
          {
            type,
            section,
            id,
          }
        );
      };

    /*
     * --------------------------------------------------------
     * INITIAL CHECK
     * --------------------------------------------------------
     */

    void checkAllContent();

    /*
     * --------------------------------------------------------
     * POLLING FALLBACK
     * --------------------------------------------------------
     */

    const interval =
      window.setInterval(
        () => {
          void checkAllContent();
        },
        30_000
      );

    /*
     * --------------------------------------------------------
     * CONTENT SEEN EVENT
     * --------------------------------------------------------
     */

    const handleContentSeen =
      () => {
        void checkAllContent();
      };

    /*
     * --------------------------------------------------------
     * EVENT LISTENERS
     * --------------------------------------------------------
     */

    window.addEventListener(
      "jodhpur-content-seen",
      handleContentSeen
    );

    window.addEventListener(
      "jodhpur-content-push",
      handleContentPush
    );

    /*
     * --------------------------------------------------------
     * CLEANUP
     * --------------------------------------------------------
     */

    return () => {
      mounted = false;

      window.clearInterval(
        interval
      );

      window.removeEventListener(
        "jodhpur-content-seen",
        handleContentSeen
      );

      window.removeEventListener(
        "jodhpur-content-push",
        handleContentPush
      );
    };
  }, []);

  /*
   * --------------------------------------------------------
   * ANY UNREAD CONTENT
   * --------------------------------------------------------
   *
   * Used by the mobile menu button.
   */

  const hasAnyUnreadContent =
    hasUnreadNotifications ||
    hasUnreadGallery ||
    hasUnreadEvents ||
    hasUnreadSermons ||
    hasUnreadBlog;

  return (
    <NotificationUnreadContext.Provider
      value={{
        hasUnreadNotifications,
        hasUnreadGallery,
        hasUnreadEvents,
        hasUnreadSermons,
        hasUnreadBlog,
        hasAnyUnreadContent,
      }}
    >
      {children}
    </NotificationUnreadContext.Provider>
  );
}

