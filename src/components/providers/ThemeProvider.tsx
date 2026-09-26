"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme,
} from "next-themes";
import type { ReactNode } from "react";
import { useEffect } from "react";

function BrowserThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) {
      return;
    }

    const color =
      resolvedTheme === "dark"
        ? "#0f0f0f"
        : "#ffffff";

    let meta = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }

    meta.content = color;

    console.log(
      "Jodhpur Church browser theme:",
      resolvedTheme,
      color,
    );
  }, [resolvedTheme]);

  return null;
}

export default function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BrowserThemeColor />
      {children}
    </NextThemesProvider>
  );
}