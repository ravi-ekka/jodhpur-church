
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Welcome() {
    const t = useTranslations("welcome");

    return (
        <section className="mx-auto max-w-7xl py-6">
            <div className="grid gap-10 md:grid-cols-1 md:items-center">
                {/* Welcome Content */}
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                        {t("label")}
                    </p>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                        {t("title")}
                    </h2>

                    <p className="mt-6 leading-8 text-gray-600">
                        {t("paragraph1")}
                    </p>

                    <p className="mt-4 leading-8 text-gray-600">
                        {t("paragraph2")}
                    </p>

                    {/* Bible Verse */}
                    <div className="mt-8 border-l-4 border-[#a77a32] pl-5">
                        <p className="text-lg font-medium leading-8 text-gray-800">
                            {t("verse")}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-[#a77a32]">
                            {t("reference")}
                        </p>
                    </div>
                </div>
                {/* Church Image */}
                <div className="overflow-hidden">
                    <Image
                        src="/church-image.webp"
                        alt={t("imageAlt")}
                        width={1600}
                        height={900}
                        className="h-auto w-full object-cover"
                        priority={false}
                    />
                </div>
            </div>
        </section>
    );
}

