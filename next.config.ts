import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
    reactCompiler: true,

    cacheComponents: true,

    typescript: {
        ignoreBuildErrors: true,
    },

    allowedDevOrigins: [
        "10.182.167.2",
    ],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "i.ytimg.com",
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin(
    "./src/i18n/request.ts",
);

const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV === "development",
});

export default withSerwist(withNextIntl(nextConfig));