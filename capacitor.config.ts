
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.jodhpurchurch.app",

    appName: "Jodhpur Church",

    webDir: "public",

    server: {
        url: "http://10.182.167.2:3001",
        cleartext: true,
    },
};

export default config;

