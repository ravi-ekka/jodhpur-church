
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { getChurchSettings } from "@/lib/settings/church-settings";
import { NextIntlClientProvider } from "next-intl";
import {
  getLocale,
  getMessages,
} from "next-intl/server";
import { Suspense } from "react";

//export const instant = false;

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const settings = await getChurchSettings();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <Suspense fallback={null}>
        <Navbar
          locale={locale}
          churchName={settings.churchName}
        />
      </Suspense>

      <main>{children}</main>

      <Footer settings={settings} />
    </NextIntlClientProvider>
  );
}

