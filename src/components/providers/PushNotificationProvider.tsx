
"use client";

console.log(
  "🔥🔥🔥 JODHPUR PUSH PROVIDER FILE LOADED 🔥🔥🔥"
);

import { Capacitor } from "@capacitor/core";
import { useEffect, useRef } from "react";
import {
  PushNotifications,
  type ActionPerformed,
  type PushNotificationSchema,
  type Token,
} from "@capacitor/push-notifications";

function getLocale() {
  return (
    document.documentElement.lang || "en"
  );
}

function getNotificationUrl(
  value: unknown,
) {
  if (
    typeof value !== "string" ||
    !value
  ) {
    return null;
  }

  try {
    const url = new URL(
      value,
      window.location.origin,
    );

    if (
      url.origin !==
      window.location.origin
    ) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

/*
 * --------------------------------------------------------
 * PUSH TYPE
 * --------------------------------------------------------
 *
 * These values are sent by the admin notification APIs.
 *
 * notification  -> Notifications
 * photo         -> Gallery
 * youtube_video -> Gallery
 * event         -> Events
 * sermon        -> Sermons
 * blog          -> Blog
 *
 * YouTube videos are part of the public Gallery, so
 * "youtube_video" is handled as Gallery content by the
 * local unread system.
 *
 * We keep this provider generic so the existing FCM
 * implementation continues to handle delivery, sound,
 * and notification taps.
 * --------------------------------------------------------
 */

type ContentPushType =
  | "notification"
  | "photo"
  | "youtube_video"
  | "event"
  | "sermon"
  | "blog";

function isContentPushType(
  value: unknown,
): value is ContentPushType {
  return (
    value === "notification" ||
    value === "photo" ||
    value === "youtube_video" ||
    value === "event" ||
    value === "sermon" ||
    value === "blog"
  );
}

export default function PushNotificationProvider() {
  console.log(
    "🔥🔥🔥 PUSH PROVIDER COMPONENT RENDERED 🔥🔥🔥",
  );

  const initializedRef =
    useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      console.log(
        "Push notifications: already initialized, skipping.",
      );

      return;
    }

    initializedRef.current = true;

    let mounted = true;

    const setupPushNotifications =
      async () => {
        console.log(
          "Push notifications: provider started.",
        );

        if (
          !Capacitor.isNativePlatform()
        ) {
          console.log(
            "Push notifications: running on web, skipping.",
          );

          return;
        }

        console.log(
          "Push notifications: native Android detected.",
        );

        try {
          /*
           * Register ALL listeners before calling
           * PushNotifications.register().
           */

          await PushNotifications.addListener(
            "registration",
            async (
              token: Token,
            ) => {
              if (!mounted) {
                return;
              }

              console.log(
                "FCM TOKEN RECEIVED:",
                token.value,
              );

              try {
                const response =
                  await fetch(
                    "/api/fcm/token",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type":
                          "application/json",
                      },
                      body: JSON.stringify(
                        {
                          token:
                            token.value,
                          platform:
                            "android",
                          locale:
                            getLocale(),
                          userId:
                            null,
                        },
                      ),
                    },
                  );

                const result =
                  await response.json();

                console.log(
                  "FCM TOKEN API RESULT:",
                  result,
                );
              } catch (error) {
                console.error(
                  "FCM TOKEN API ERROR:",
                  error,
                );
              }
            },
          );

          await PushNotifications.addListener(
            "registrationError",
            (error) => {
              console.error(
                "FCM REGISTRATION ERROR:",
                error,
              );
            },
          );

          /*
           * ------------------------------------------------
           * FOREGROUND PUSH RECEIVED
           * ------------------------------------------------
           *
           * The existing FCM notification continues to work.
           *
           * We additionally notify the local unread system
           * so the appropriate red dot can appear immediately.
           * ------------------------------------------------
           */

          await PushNotifications.addListener(
            "pushNotificationReceived",
            (
              notification: PushNotificationSchema,
            ) => {
              console.log(
                "FCM NOTIFICATION RECEIVED:",
                notification,
              );

              const data =
                notification.data;

              const type =
                data?.type;

              const id =
                data?.id;

              if (
                !isContentPushType(type)
              ) {
                console.log(
                  "FCM notification has no supported content type:",
                  type,
                );

                return;
              }

              /*
               * Notify NotificationUnreadProvider.
               *
               * No Firestore write is made here.
               * This is completely local.
               */

              window.dispatchEvent(
                new CustomEvent(
                  "jodhpur-content-push",
                  {
                    detail: {
                      type,
                      id:
                        typeof id ===
                        "string"
                          ? id
                          : null,
                    },
                  },
                ),
              );

              console.log(
                "JODHPUR CONTENT PUSH EVENT DISPATCHED:",
                {
                  type,
                  id,
                },
              );
            },
          );

          /*
           * ------------------------------------------------
           * PUSH TAPPED
           * ------------------------------------------------
           *
           * Existing navigation behavior is preserved.
           * ------------------------------------------------
           */

          await PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (
              action: ActionPerformed,
            ) => {
              console.log(
                "FCM NOTIFICATION TAPPED:",
                action,
              );

              const data =
                action.notification
                  .data;

              /*
               * Also dispatch the local unread event when
               * the notification is opened from the system
               * notification tray.
               *
               * We intentionally do NOT mark it as read here.
               *
               * The destination page will mark its current
               * content as seen through MarkNotificationsSeen.
               */

              const type =
                data?.type;

              const id =
                data?.id;

              if (
                isContentPushType(type)
              ) {
                window.dispatchEvent(
                  new CustomEvent(
                    "jodhpur-content-push",
                    {
                      detail: {
                        type,
                        id:
                          typeof id ===
                          "string"
                            ? id
                            : null,
                      },
                    },
                  ),
                );

                console.log(
                  "JODHPUR CONTENT PUSH EVENT DISPATCHED FROM TAP:",
                  {
                    type,
                    id,
                  },
                );
              }

              const url =
                getNotificationUrl(
                  data?.url,
                );

              if (url) {
                const locale =
                  getLocale();

                const localizedUrl =
                  url.startsWith(
                    `/${locale}/`,
                  ) ||
                  url ===
                    `/${locale}`
                    ? url
                    : `/${locale}${url}`;

                console.log(
                  "FCM NAVIGATING TO:",
                  localizedUrl,
                );

                window.location.href =
                  localizedUrl;
              }
            },
          );

          console.log(
            "Push notification listeners registered.",
          );

          /*
           * Check notification permission.
           */

          const permission =
            await PushNotifications.checkPermissions();

          console.log(
            "Push notification permission:",
            permission,
          );

          let receivePermission =
            permission.receive;

          if (
            receivePermission !==
            "granted"
          ) {
            const requested =
              await PushNotifications.requestPermissions();

            console.log(
              "Push notification permission requested:",
              requested,
            );

            receivePermission =
              requested.receive;
          }

          if (
            receivePermission !==
            "granted"
          ) {
            console.log(
              "Push notification permission was not granted.",
            );

            return;
          }

          /*
           * Create Android notification channel.
           *
           * KEEPING YOUR EXISTING CHANNEL AND SOUND.
           */

          await PushNotifications.createChannel(
            {
              id: "jodhpur_church",
              name: "Jodhpur Church",
              description:
                "Jodhpur Church notifications",
              importance: 5,
              sound: "church_bell",
              vibration: true,
            },
          );

          console.log(
            "Push notification channel created.",
          );

          /*
           * Register device with FCM.
           */

          console.log(
            "Registering device with FCM...",
          );

          await PushNotifications.register();

          console.log(
            "FCM registration request completed.",
          );
        } catch (error) {
          console.error(
            "PUSH NOTIFICATION SETUP ERROR:",
            error,
          );
        }
      };

    void setupPushNotifications();

    return () => {
      mounted = false;

      /*
       * Do NOT call removeAllListeners() here.
       *
       * React Strict Mode can run effect cleanup during
       * development and this can remove the native listeners
       * while FCM registration is still in progress.
       */
    };
  }, []);

  return null;
}
