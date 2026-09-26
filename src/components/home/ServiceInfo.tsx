import { useTranslations } from "next-intl";

type ServiceInfoProps = {
  sundayWorship: string;
};

export default function ServiceInfo({
  sundayWorship,
}: ServiceInfoProps) {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden  text-[#3f302b] dark:border-[#d7b76e]/20 dark:bg-[#1d1715] dark:text-[#f3dfbc]">

     

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 md:items-center lg:px-8">

        {/* Church Information */}
        <div className="flex flex-col gap-10">

          {/* Sunday Worship */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a77a32] dark:text-[#d9bb79]">
              {t("serviceInfo.sundayWorship")}
            </p>

            <h3 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#552521] dark:text-[#f3dfbc] sm:text-5xl">
              {sundayWorship}
            </h3>

            <p className="mt-2 text-sm text-[#6b5a52] dark:text-[#cdbda9] sm:text-base">
              {t("serviceInfo.everySunday")}
            </p>
          </div>

          {/* Location */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a77a32] dark:text-[#d9bb79]">
              {t("serviceInfo.location")}
            </p>

            <h3 className="mt-2 text-lg font-bold leading-7 text-[#3f302b] dark:text-[#f3dfbc] sm:text-xl">
              {t("serviceInfo.addressLine1")}
              <br />
              {t("serviceInfo.addressLine2")}
            </h3>
          </div>

        </div>

        {/* Google Map */}
        <div className="overflow-hidden rounded-2xl border border-[#d7b76e]/40 bg-white shadow-lg shadow-black/10 dark:border-[#d7b76e]/20 dark:bg-[#241b18]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1239.3986304538553!2d83.83363370231051!3d23.55439652634104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398bc3f103dc7e15%3A0xaf598fbcc7eea5ac!2sHR3M%2BRG6%2C%20Balrampur%20-%20Chando%20-%20Kusmi%20Rd%2C%20Jodhpur%2C%20Nawadih%20Kalan%2C%20Chhattisgarh%20497119!5e1!3m2!1sen!2sin!4v1787728980551!5m2!1sen!2sin"
            className="h-[280px] w-full border-0 sm:h-[350px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title={t("serviceInfo.mapTitle")}
          />
        </div>

      </div>
    </section>
  );
}