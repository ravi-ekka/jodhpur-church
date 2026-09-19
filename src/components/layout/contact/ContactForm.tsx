  
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Loader2,
  Send,
  AlertCircle,
} from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;

    setStatus("submitting");

    try {
      const formData = new FormData(form);

      const response = await fetch(
        "https://formspree.io/f/mbgjladn",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium"
        >
          {t("name")}{" "}
          <span className="text-destructive">*</span>
        </label>

        <input
          type="text"
          id="name"
          name="name"
          placeholder={t("namePlaceholder")}
          required
          autoComplete="name"
          className="h-11 w-full rounded-lg border bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          {t("email")}{" "}
          <span className="text-destructive">*</span>
        </label>

        <input
          type="email"
          id="email"
          name="_replyto"
          placeholder={t("emailPlaceholder")}
          required
          autoComplete="email"
          className="h-11 w-full rounded-lg border bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium"
        >
          {t("phone")}
        </label>

        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder={t("phonePlaceholder")}
          autoComplete="tel"
          className="h-11 w-full rounded-lg border bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="text-sm font-medium"
        >
          {t("subject")}
        </label>

        <input
          type="text"
          id="subject"
          name="subject"
          placeholder={t("subjectPlaceholder")}
          className="h-11 w-full rounded-lg border bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium"
        >
          {t("message")}{" "}
          <span className="text-destructive">*</span>
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          required
          className="w-full resize-none rounded-lg border bg-background px-3.5 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Honeypot spam protection */}
      <input
        type="text"
        name="_gotcha"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t("sendButton")}
          </>
        )}
      </button>

      {/* Success */}
      {status === "success" && (
        <div
          role="status"
          className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              {t("successTitle")}
            </p>

            <p className="mt-1 text-sm">
              {t("successDescription")}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              {t("errorTitle")}
            </p>

            <p className="mt-1 text-sm">
              {t("errorDescription")}
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

