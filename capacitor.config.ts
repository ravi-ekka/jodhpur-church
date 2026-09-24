import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.jodhpurchurch.app",

    appName: "Jodhpur Church",

    webDir: "public",

    server: {
        url: "https://jodhpur-church.vercel.app",
        cleartext: false,
    },

    plugins: {
        FirebaseAuthentication: {
            providers: ["google.com"],
        },

        PushNotifications: {
            presentationOptions: [
                "alert",
                "sound",
                "badge",
            ],
        },
    },
};

export default config;