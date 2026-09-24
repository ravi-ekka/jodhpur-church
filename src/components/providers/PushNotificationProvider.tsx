
"use client";
console.log("🔥🔥🔥 JODHPUR PUSH PROVIDER FILE LOADED 🔥🔥🔥");
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
    value: unknown
) {
    if (typeof value !== "string" || !value) {
        return null;
    }

    try {
        const url = new URL(
            value,
            window.location.origin
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

export default function PushNotificationProvider() {
     console.log("🔥🔥🔥 PUSH PROVIDER COMPONENT RENDERED 🔥🔥🔥");
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) {
            console.log(
                "Push notifications: already initialized, skipping."
            );

            return;
        }

        initializedRef.current = true;

        let mounted = true;

        const setupPushNotifications =
            async () => {
                console.log(
                    "Push notifications: provider started."
                );

                if (
                    !Capacitor.isNativePlatform()
                ) {
                    console.log(
                        "Push notifications: running on web, skipping."
                    );

                    return;
                }

                console.log(
                    "Push notifications: native Android detected."
                );

                try {
                    /*
                     * Register ALL listeners before calling
                     * PushNotifications.register().
                     */

                    await PushNotifications.addListener(
                        "registration",
                        async (
                            token: Token
                        ) => {
                            if (!mounted) {
                                return;
                            }

                            console.log(
                                "FCM TOKEN RECEIVED:",
                                token.value
                            );

                            try {
                                const response =
                                    await fetch(
                                        "/api/fcm/token",
                                        {
                                            method:
                                                "POST",
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
                                                }
                                            ),
                                        }
                                    );

                                const result =
                                    await response.json();

                                console.log(
                                    "FCM TOKEN API RESULT:",
                                    result
                                );
                            } catch (error) {
                                console.error(
                                    "FCM TOKEN API ERROR:",
                                    error
                                );
                            }
                        }
                    );

                    await PushNotifications.addListener(
                        "registrationError",
                        (error) => {
                            console.error(
                                "FCM REGISTRATION ERROR:",
                                error
                            );
                        }
                    );

                    await PushNotifications.addListener(
                        "pushNotificationReceived",
                        (
                            notification: PushNotificationSchema
                        ) => {
                            console.log(
                                "FCM NOTIFICATION RECEIVED:",
                                notification
                            );
                        }
                    );

                    await PushNotifications.addListener(
                        "pushNotificationActionPerformed",
                        (
                            action: ActionPerformed
                        ) => {
                            console.log(
                                "FCM NOTIFICATION TAPPED:",
                                action
                            );

                            const data =
                                action.notification
                                    .data;

                            const url =
                                getNotificationUrl(
                                    data?.url
                                );

                            if (url) {
                                window.location.href =
                                    url;
                            }
                        }
                    );

                    console.log(
                        "Push notification listeners registered."
                    );

                    /*
                     * Check notification permission.
                     */

                    const permission =
                        await PushNotifications.checkPermissions();

                    console.log(
                        "Push notification permission:",
                        permission
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
                            requested
                        );

                        receivePermission =
                            requested.receive;
                    }

                    if (
                        receivePermission !==
                        "granted"
                    ) {
                        console.log(
                            "Push notification permission was not granted."
                        );

                        return;
                    }

                    /*
                     * Create Android notification channel.
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
                        }
                    );

                    console.log(
                        "Push notification channel created."
                    );

                    /*
                     * Register device with FCM.
                     */

                    console.log(
                        "Registering device with FCM..."
                    );

                    await PushNotifications.register();

                    console.log(
                        "FCM registration request completed."
                    );
                } catch (error) {
                    console.error(
                        "PUSH NOTIFICATION SETUP ERROR:",
                        error
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

