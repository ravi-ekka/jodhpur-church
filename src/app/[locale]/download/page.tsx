import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowDownToLine,
  ArrowLeft,
  Download,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

type DownloadPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const APK_URL =
  "https://github.com/ravi-ekka/jodhpur-church/releases/latest/download/jodhpur-church.apk";

const APP_VERSION = "1.0.0";
const APK_SIZE = "11.69 MB";

export default async function DownloadPage({
  params,
}: DownloadPageProps) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "download",
  });

  const steps = [
    t("step1"),
    t("step2"),
    t("step3"),
    t("step4"),
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#762f2f]/10 via-background to-[#e2c17a]/10" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e2c17a]/40 bg-[#e2c17a]/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#a77a32]">
              <Smartphone className="h-4 w-4" />
              {t("label")}
            </div>

            {/* App Icon */}
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-[#e2c17a]/40 bg-white shadow-xl sm:h-32 sm:w-32">
              <Image
                src="/jodhpur_church_icon.png"
                alt={t("appName")}
                width={128}
                height={128}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t("description")}
            </p>

            {/* Download Card */}
            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
              <div className="flex flex-col items-center">
                {/* Official Release */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#762f2f]/10 px-4 py-2 text-sm font-medium text-[#762f2f]">
                  <ShieldCheck className="h-4 w-4" />
                  {t("officialRelease")}
                </div>

                <h2 className="text-2xl font-bold text-foreground">
                  {t("appName")}
                </h2>

                {/* Version / Size */}
                <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
                  <span className="rounded-full bg-muted px-4 py-2 text-muted-foreground">
                    {t("version")}: {APP_VERSION}
                  </span>

                  <span className="rounded-full bg-muted px-4 py-2 text-muted-foreground">
                    {t("size")}: {APK_SIZE}
                  </span>
                </div>

                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  {t("downloadDescription")}
                </p>

                {/* Download Button */}
                <a
                  href={APK_URL}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#762f2f] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#5f2525] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#e2c17a] focus:ring-offset-2 sm:w-auto"
                >
                  <Download className="h-5 w-5" />
                  {t("downloadButton")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2c17a]/20 text-[#a77a32]">
                <ArrowDownToLine className="h-6 w-6" />
              </div>

              <h2 className="text-3xl font-bold text-foreground">
                {t("installationTitle")}
              </h2>
            </div>

            <div className="mt-8 grid gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#762f2f] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="pt-1 text-sm leading-6 text-muted-foreground sm:text-base">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Security Note */}
            <div className="mt-8 rounded-2xl border border-[#e2c17a]/40 bg-[#e2c17a]/10 p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#a77a32]" />

                <p className="text-sm leading-6 text-foreground/80">
                  {t("securityNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Home */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#762f2f] transition hover:text-[#a77a32]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}