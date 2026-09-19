
import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    reactCompiler: true,

    cacheComponents: true,
    typescript: {
        ignoreBuildErrors: true,
    },
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

const withNextIntl =
    createNextIntlPlugin(
        "./src/i18n/request.ts",
    );

export default withNextIntl(nextConfig);

