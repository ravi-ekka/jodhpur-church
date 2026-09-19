"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    FileText,
    X,
    Maximize2,
    Download,
} from "lucide-react";

type Props = {
    notificationId: string;
    type: "image" | "pdf";
    fileName: string;
};

export default function NotificationAttachmentViewer({
    notificationId,
    type,
    fileName,
}: Props) {
    const [open, setOpen] = useState(false);

    const t = useTranslations("notifications");

    const attachmentUrl =
        `/api/notifications/${notificationId}/attachment`;

    return (
        <>
            {/* =========================================================
                IMAGE ATTACHMENT
            ========================================================== */}
            {type === "image" && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="group block min-w-0 w-full overflow-hidden border border-[#d8c9a8] bg-[#f7f0e2] text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:border-[#4a3c34] dark:bg-[#241b18] dark:focus-visible:ring-offset-[#2a211d]"
                    aria-label={t("openImage")}
                >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#e8decb] dark:bg-[#1d1714]">
                        <img
                            src={attachmentUrl}
                            alt={fileName}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />

                        {/* Gold bottom accent */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-1 bg-[#c29a52]"
                            aria-hidden="true"
                        />

                        {/* Desktop hover action */}
                        <div className="absolute inset-0 flex items-center justify-center bg-[#3b211d]/55 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                            <span className="inline-flex items-center gap-2 border border-[#d8b56a] bg-[#762f2f] px-4 py-2 text-xs font-semibold text-[#fffaf1]">
                                <Maximize2
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                {t("openImage")}
                            </span>
                        </div>
                    </div>

                    {/* Filename */}
                    <div className="min-w-0 border-t border-[#d8c9a8] px-3 py-3 dark:border-[#4a3c34]">
                        <p className="min-w-0 break-words text-xs font-medium leading-5 text-[#65584e] [overflow-wrap:anywhere] dark:text-[#c9bca9]">
                            {fileName}
                        </p>
                    </div>
                </button>
            )}

            {/* =========================================================
                PDF ATTACHMENT
            ========================================================== */}
            {type === "pdf" && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="group min-w-0 w-full border border-[#d8c9a8] bg-[#f7f0e2] p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:border-[#4a3c34] dark:bg-[#241b18] dark:focus-visible:ring-offset-[#2a211d]"
                    aria-label={t("viewPdf")}
                >
                    <div className="flex min-w-0 items-start gap-3">
                        {/* PDF icon */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#d8b56a] bg-[#762f2f] text-[#f7e8c5] dark:border-[#806334]">
                            <FileText
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </div>

                        {/* File information */}
                        <div className="min-w-0 flex-1">
                            <p className="font-serif text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                {t("pdfDocument")}
                            </p>

                            <p className="mt-1 min-w-0 break-words text-xs leading-5 text-[#8b765f] [overflow-wrap:anywhere] dark:text-[#b9a897]">
                                {fileName}
                            </p>
                        </div>
                    </div>

                    {/* View action */}
                    <div className="mt-4 flex min-h-10 items-center justify-between border-t border-[#d8c9a8] pt-3 text-sm font-semibold text-[#762f2f] dark:border-[#4a3c34] dark:text-[#d8b56a]">
                        <span>{t("viewPdf")}</span>

                        <Maximize2
                            className="h-4 w-4 transition-transform group-hover:scale-110"
                            aria-hidden="true"
                        />
                    </div>
                </button>
            )}

            {/* =========================================================
                FULL-SCREEN VIEWER
            ========================================================== */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1110]/90 p-2 sm:p-4"
                    onClick={() => setOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={fileName}
                >
                    <div
                        className="relative flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden border border-[#6b5141] bg-[#f7f0e2] shadow-2xl dark:border-[#5a483c] dark:bg-[#241b18] sm:h-[92vh]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* =================================================
                            VIEWER HEADER
                        ================================================== */}
                        <div className="relative flex min-h-14 shrink-0 items-center border-b border-[#d8c9a8] bg-[#fffaf1] px-3 dark:border-[#4a3c34] dark:bg-[#2a211d] sm:px-5">
                            {/* Gold top line */}
                            <div
                                className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                                aria-hidden="true"
                            />

                            <div className="min-w-0 flex-1 pr-3 pt-1">
                                <p className="min-w-0 break-words text-sm font-semibold leading-5 text-[#4b2823] [overflow-wrap:anywhere] dark:text-[#f3dfbc]">
                                    {fileName}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#d8c9a8] text-[#762f2f] transition-colors hover:bg-[#f4e6d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] dark:border-[#4a3c34] dark:text-[#d8b56a] dark:hover:bg-[#352923]"
                                aria-label={t("close")}
                                title={t("close")}
                            >
                                <X
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        {/* =================================================
                            IMAGE VIEWER
                        ================================================== */}
                        {type === "image" && (
                            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#1c1513] p-2 sm:p-6">
                                <img
                                    src={attachmentUrl}
                                    alt={fileName}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        )}

                        {/* =================================================
                            PDF VIEWER
                        ================================================== */}
                        {type === "pdf" && (
                            <div className="min-h-0 flex-1 bg-[#e9e2d6] dark:bg-[#171210]">
                                <iframe
                                    src={attachmentUrl}
                                    title={fileName}
                                    className="h-full min-h-0 w-full border-0"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}