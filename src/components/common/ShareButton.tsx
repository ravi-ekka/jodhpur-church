"use client";

import { useState } from "react";
import { Check, Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

type ShareButtonProps = {
    title: string;
    text?: string;
    url?: string;
    className?: string;
};

export default function ShareButton({
    title,
    text = "",
    url,
    className = "",
}: ShareButtonProps) {
    const t = useTranslations("share");

    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const getShareUrl = () => {
        if (url) {
            return url;
        }

        if (typeof window !== "undefined") {
            return window.location.href;
        }

        return "";
    };

    const getShareText = () => {
        return text
            ? `${title}\n\n${text}`
            : title;
    };

    const handleNativeShare = async () => {
        const shareUrl = getShareUrl();

        if (!navigator.share) {
            setOpen((value) => !value);
            return;
        }

        try {
            await navigator.share({
                title,
                text,
                url: shareUrl,
            });
        } catch (error) {
            // User cancelled the native share sheet.
            if (
                error instanceof DOMException &&
                error.name === "AbortError"
            ) {
                return;
            }

            console.error("Share failed:", error);
        }
    };

    const handleCopy = async () => {
        const shareUrl = getShareUrl();

        try {
            await navigator.clipboard.writeText(shareUrl);

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Copy link failed:", error);
        }
    };

    const handleWhatsApp = () => {
        const shareUrl = getShareUrl();

        const message = encodeURIComponent(
            `${getShareText()}\n\n${shareUrl}`
        );

        window.open(
            `https://wa.me/?text=${message}`,
            "_blank",
            "noopener,noreferrer"
        );

        setOpen(false);
    };

    const handleEmail = () => {
        const shareUrl = getShareUrl();

        const subject = encodeURIComponent(title);

        const body = encodeURIComponent(
            `${getShareText()}\n\n${shareUrl}`
        );

        window.location.href =
            `mailto:?subject=${subject}&body=${body}`;

        setOpen(false);
    };

    const handleMessage = () => {
        const shareUrl = getShareUrl();

        const body = encodeURIComponent(
            `${getShareText()}\n\n${shareUrl}`
        );

        window.location.href = `sms:?body=${body}`;

        setOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex h-8 w-8 items-center justify-center text-[#762f2f] transition-colors hover:text-[#a15a3f] dark:text-[#d8b56a] dark:hover:text-[#f0d38c]"
                aria-label={t("button")}
                title={t("button")}
            >
                <Share2
                    className="h-5 w-5"
                    aria-hidden="true"
                />
            </button>

            {open && (
                <div
                    className="absolute right-0 z-50 mt-2 w-52 overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-lg dark:border-[#4a3c34] dark:bg-[#2a211d]"
                    role="menu"
                >
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#4b2823] hover:bg-[#f7f0e2] dark:text-[#f3dfbc] dark:hover:bg-[#352923]"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}

                        <span>
                            {copied
                                ? t("copied")
                                : t("copyLink")}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={handleWhatsApp}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#4b2823] hover:bg-[#f7f0e2] dark:text-[#f3dfbc] dark:hover:bg-[#352923]"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span>{t("whatsapp")}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleEmail}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#4b2823] hover:bg-[#f7f0e2] dark:text-[#f3dfbc] dark:hover:bg-[#352923]"
                    >
                        <Mail className="h-4 w-4" />
                        <span>{t("email")}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleMessage}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#4b2823] hover:bg-[#f7f0e2] dark:text-[#f3dfbc] dark:hover:bg-[#352923]"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span>{t("message")}</span>
                    </button>
                </div>
            )}
        </div>
    );
}