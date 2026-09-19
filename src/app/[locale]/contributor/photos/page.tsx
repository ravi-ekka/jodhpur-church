"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    ArrowLeft,
    CalendarDays,
    Camera,
    CheckCircle2,
    Clock3,
    Edit3,
    ImagePlus,
    Loader2,
    Trash2,
    Upload,
    X,
    XCircle,
} from "lucide-react";

import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";

type ContributorPhotoStatus =
    | "pending"
    | "approved"
    | "rejected";

type ContributorPhoto = {
    id: string;
    title: string;
    description?: string;
    url: string;
    status: ContributorPhotoStatus;
    rejectionReason?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
};

function formatDate(
    value: unknown,
    unavailableText: string
) {
    if (!value) return unavailableText;

    try {
        if (
            typeof value === "object" &&
            value !== null &&
            "seconds" in value
        ) {
            const seconds = Number(
                (value as { seconds: number }).seconds
            );

            if (!Number.isNaN(seconds)) {
                return new Date(
                    seconds * 1000
                ).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });
            }
        }

        const date = new Date(
            value as string | number | Date
        );

        if (Number.isNaN(date.getTime())) {
            return unavailableText;
        }

        return date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return unavailableText;
    }
}

function StatusBadge({
    status,
    approvedLabel,
    rejectedLabel,
    pendingLabel,
}: {
    status: ContributorPhotoStatus;
    approvedLabel: string;
    rejectedLabel: string;
    pendingLabel: string;
}) {
    if (status === "approved") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b8cba4] bg-[#e7efdf] px-2.5 py-1 text-xs font-semibold text-[#52643d] dark:border-[#536447] dark:bg-[#2d3828] dark:text-[#b9d39c]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {approvedLabel}
            </span>
        );
    }

    if (status === "rejected") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9aaa4] bg-[#f6e3e0] px-2.5 py-1 text-xs font-semibold text-[#762f2f] dark:border-[#68413c] dark:bg-[#382624] dark:text-[#e3aaa3]">
                <XCircle className="h-3.5 w-3.5" />
                {rejectedLabel}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dbc58d] bg-[#f8efd7] px-2.5 py-1 text-xs font-semibold text-[#8a6418] dark:border-[#66552f] dark:bg-[#3a3323] dark:text-[#e0c77c]">
            <Clock3 className="h-3.5 w-3.5" />
            {pendingLabel}
        </span>
    );
}

function StatCard({
    label,
    count,
    icon: Icon,
    iconClassName,
    iconBackground,
}: {
    label: string;
    count: number;
    icon: typeof Clock3;
    iconClassName: string;
    iconBackground: string;
}) {
    return (
        <div className="border border-[#d8c9a8] bg-[#fffaf1] p-4 shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#b9a897]">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#4b2823] dark:text-[#f3dfbc]">
                        {count}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center ${iconBackground}`}
                >
                    <Icon
                        className={`h-5 w-5 ${iconClassName}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default function ContributorPhotosPage() {
    const router = useRouter();
    const params = useParams();

    const t = useTranslations("contributorPhotos");

    const locale = params.locale as string;

    const { user } = useAuth();

    const [photos, setPhotos] = useState<ContributorPhoto[]>(
        []
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [uploading, setUploading] = useState(false);

    const [editingPhoto, setEditingPhoto] =
        useState<ContributorPhoto | null>(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] =
        useState("");

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(
        null
    );

    const [showUploadForm, setShowUploadForm] =
        useState(false);

    const loadPhotos = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError("");

            const token = await user.getIdToken();

            const response = await fetch(
                "/api/contributors/photos",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        t("unableToLoadPhotos")
                );
            }

            setPhotos(
                Array.isArray(data.photos)
                    ? data.photos
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load contributor photos:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : t("unableToLoadPhotos")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPhotos();
    }, [user]);

    const pendingPhotos = useMemo(
        () =>
            photos.filter(
                (photo) => photo.status === "pending"
            ),
        [photos]
    );

    const approvedPhotos = useMemo(
        () =>
            photos.filter(
                (photo) => photo.status === "approved"
            ),
        [photos]
    );

    const rejectedPhotos = useMemo(
        () =>
            photos.filter(
                (photo) => photo.status === "rejected"
            ),
        [photos]
    );

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError(t("photoSizeError"));
            event.target.value = "";
            setFile(null);
            return;
        }

        setError("");
        setFile(selectedFile);
    };

    const handleUpload = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!user) {
            setError(t("pleaseSignInAgain"));
            return;
        }

        if (!title.trim()) {
            setError(t("pleaseEnterPhotoTitle"));
            return;
        }

        if (!file) {
            setError(t("pleaseSelectPhoto"));
            return;
        }

        try {
            setUploading(true);
            setError("");

            const token = await user.getIdToken();

            const formData = new FormData();

            formData.append("title", title.trim());

            formData.append(
                "description",
                description.trim()
            );

            formData.append("file", file);

            const response = await fetch(
                "/api/contributors/photos",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        t("unableToUploadPhoto")
                );
            }

            setTitle("");
            setDescription("");
            setFile(null);

            const fileInput = document.getElementById(
                "contributor-photo"
            ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }

            setShowUploadForm(false);

            await loadPhotos();
        } catch (err) {
            console.error(
                "Failed to upload contributor photo:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : t("unableToUploadPhoto")
            );
        } finally {
            setUploading(false);
        }
    };

    const openEditModal = (
        photo: ContributorPhoto
    ) => {
        setEditingPhoto(photo);
        setEditTitle(photo.title);
        setEditDescription(
            photo.description || ""
        );
        setError("");
    };

    const closeEditModal = () => {
        if (saving) return;

        setEditingPhoto(null);
        setEditTitle("");
        setEditDescription("");
    };

    const handleUpdate = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!user || !editingPhoto) return;

        if (!editTitle.trim()) {
            setError(t("pleaseEnterPhotoTitle"));
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token = await user.getIdToken();

            const response = await fetch(
                "/api/contributors/photos",
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: editingPhoto.id,
                        title: editTitle.trim(),
                        description:
                            editDescription.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        t("unableToUpdatePhoto")
                );
            }

            closeEditModal();

            await loadPhotos();
        } catch (err) {
            console.error(
                "Failed to update contributor photo:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : t("unableToUpdatePhoto")
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        photo: ContributorPhoto
    ) => {
        if (!user) return;

        const confirmed = window.confirm(
            photo.status === "approved"
                ? t("deleteApprovedConfirm")
                : t("deletePhotoConfirm")
        );

        if (!confirmed) return;

        try {
            setDeletingId(photo.id);
            setError("");

            const token = await user.getIdToken();

            const response = await fetch(
                "/api/contributors/photos",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: photo.id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        t("unableToDeletePhoto")
                );
            }

            await loadPhotos();
        } catch (err) {
            console.error(
                "Failed to delete contributor photo:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : t("unableToDeletePhoto")
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <RequireAuth>
            <main className="min-h-screen bg-[#fbf6eb] text-[#4b2823] dark:bg-[#1f1815] dark:text-[#f3dfbc]">
                {/* =====================================================
                    HEADER
                ====================================================== */}
                <section className="relative overflow-hidden border-b border-[#d8c9a8] bg-[#f7f0e2] dark:border-[#40342e] dark:bg-[#241b18]">
                    <div
                        className="absolute inset-x-0 top-0 h-1 bg-[#c29a52]"
                        aria-hidden="true"
                    />

                    <div
                        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ead9b6]/40 to-transparent dark:from-[#5a4030]/20"
                        aria-hidden="true"
                    />

                    <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/${locale}/dashboard`
                                )
                            }
                            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#762f2f] hover:underline dark:text-[#d8b56a]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t("backToDashboard")}
                        </button>

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#762f2f] text-[#f7e8c5] dark:bg-[#6b2b2b]">
                                    <Camera className="h-6 w-6" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b765f] dark:text-[#b9a897]">
                                        {t(
                                            "contributorDashboard"
                                        )}
                                    </p>

                                    <h1 className="mt-1 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc] sm:text-3xl">
                                        {t("myPhotos")}
                                    </h1>

                                    <p className="mt-1 text-sm text-[#65584e] dark:text-[#c9bca9]">
                                        {t(
                                            "uploadAndManage"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowUploadForm(
                                        (value) => !value
                                    )
                                }
                                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] transition-colors hover:bg-[#5f2525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c29a52] focus-visible:ring-offset-2 dark:bg-[#d8b56a] dark:text-[#2a211d] dark:hover:bg-[#e7c77e]"
                            >
                                {showUploadForm ? (
                                    <>
                                        <X className="h-4 w-4" />
                                        {t("closeUpload")}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        {t("uploadPhoto")}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    CONTENT
                ====================================================== */}
                <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    {/* Error */}
                    {error && (
                        <div className="mb-5 border border-[#d8aaa4] bg-[#f8e8e5] p-4 text-sm text-[#762f2f] dark:border-[#68413c] dark:bg-[#30211e] dark:text-[#e3a9a2]">
                            {error}
                        </div>
                    )}

                    {/* =================================================
                        STATS
                    ================================================== */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatCard
                            label={t("totalPhotos")}
                            count={photos.length}
                            icon={ImagePlus}
                            iconClassName="text-[#762f2f]"
                            iconBackground="bg-[#f0ded9]"
                        />

                        <StatCard
                            label={t("pending")}
                            count={
                                pendingPhotos.length
                            }
                            icon={Clock3}
                            iconClassName="text-[#a66b00]"
                            iconBackground="bg-[#f5e8c5]"
                        />

                        <StatCard
                            label={t("approved")}
                            count={
                                approvedPhotos.length
                            }
                            icon={CheckCircle2}
                            iconClassName="text-[#52643d]"
                            iconBackground="bg-[#dfe8d2]"
                        />

                        <StatCard
                            label={t("rejected")}
                            count={
                                rejectedPhotos.length
                            }
                            icon={XCircle}
                            iconClassName="text-[#762f2f]"
                            iconBackground="bg-[#f0d9d5]"
                        />
                    </div>

                    {/* =================================================
                        UPLOAD PANEL
                    ================================================== */}
                    {showUploadForm && (
                        <div className="mt-6 overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]">
                            <div className="border-b border-[#d8c9a8] bg-[#f7f0e2] px-5 py-4 dark:border-[#4a3c34] dark:bg-[#241b18]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center bg-[#762f2f] text-[#f7e8c5]">
                                        <ImagePlus className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <h2 className="font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                            {t(
                                                "uploadNewPhoto"
                                            )}
                                        </h2>

                                        <p className="text-xs text-[#8b765f] dark:text-[#b9a897]">
                                            {t(
                                                "maximumFileSize"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={handleUpload}
                                className="p-5 sm:p-6"
                            >
                                <div className="grid gap-5 lg:grid-cols-2">
                                    <div className="space-y-5">
                                        <div>
                                            <label
                                                htmlFor="photo-title"
                                                className="mb-2 block text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]"
                                            >
                                                {t(
                                                    "title"
                                                )}
                                            </label>

                                            <input
                                                id="photo-title"
                                                type="text"
                                                value={title}
                                                onChange={(
                                                    event
                                                ) =>
                                                    setTitle(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder={t(
                                                    "enterPhotoTitle"
                                                )}
                                                className="h-11 w-full border border-[#d8c9a8] bg-[#fffdf8] px-3 text-sm text-[#4b2823] outline-none transition focus:border-[#c29a52] focus:ring-1 focus:ring-[#c29a52] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#f3dfbc]"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="photo-description"
                                                className="mb-2 block text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]"
                                            >
                                                {t(
                                                    "description"
                                                )}
                                            </label>

                                            <textarea
                                                id="photo-description"
                                                value={
                                                    description
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setDescription(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder={t(
                                                    "addShortDescription"
                                                )}
                                                rows={5}
                                                className="w-full resize-none border border-[#d8c9a8] bg-[#fffdf8] px-3 py-3 text-sm text-[#4b2823] outline-none transition focus:border-[#c29a52] focus:ring-1 focus:ring-[#c29a52] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#f3dfbc]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contributor-photo"
                                            className="mb-2 block text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]"
                                        >
                                            {t("photo")}
                                        </label>

                                        <label
                                            htmlFor="contributor-photo"
                                            className="flex min-h-48 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#d8c9a8] bg-[#fdf8ee] px-5 text-center transition hover:border-[#c29a52] hover:bg-[#f8f0e0] dark:border-[#4a3c34] dark:bg-[#241b18] dark:hover:border-[#806334]"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center bg-[#762f2f] text-[#f7e8c5] dark:bg-[#6b2b2b]">
                                                <ImagePlus className="h-6 w-6" />
                                            </div>

                                            <p className="mt-3 text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {file
                                                    ? file.name
                                                    : t(
                                                          "choosePhoto"
                                                      )}
                                            </p>

                                            <p className="mt-1 text-xs text-[#8b765f] dark:text-[#b9a897]">
                                                {t(
                                                    "imageFormats"
                                                )}
                                            </p>

                                            <span className="mt-4 inline-flex items-center gap-2 border border-[#d8c9a8] bg-[#fffaf1] px-3 py-2 text-xs font-semibold text-[#762f2f] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#d8b56a]">
                                                <Upload className="h-3.5 w-3.5" />
                                                {t(
                                                    "browseFiles"
                                                )}
                                            </span>
                                        </label>

                                        <input
                                            id="contributor-photo"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={
                                                handleFileChange
                                            }
                                            className="sr-only"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#d8c9a8] pt-5 dark:border-[#4a3c34] sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowUploadForm(
                                                false
                                            )
                                        }
                                        className="min-h-11 border border-[#d8c9a8] bg-[#fffaf1] px-5 text-sm font-semibold text-[#65584e] transition hover:bg-[#f7f0e2] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#c9bca9] dark:hover:bg-[#241b18]"
                                    >
                                        {t("cancel")}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] transition hover:bg-[#5f2525] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                {t(
                                                    "uploading"
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                {t(
                                                    "submitPhoto"
                                                )}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* =================================================
                        PHOTOS
                    ================================================== */}
                    <div className="mt-6">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b765f] dark:text-[#b9a897]">
                                    {t("yourUploads")}
                                </p>

                                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                    {t("myPhotos")}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        `/${locale}/contributor/submissions`
                                    )
                                }
                                className="hidden text-sm font-semibold text-[#762f2f] hover:underline dark:text-[#d8b56a] sm:block"
                            >
                                {t(
                                    "viewSubmissions"
                                )}
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex min-h-64 items-center justify-center border border-[#d8c9a8] bg-[#fffaf1] dark:border-[#4a3c34] dark:bg-[#2a211d]">
                                <div className="flex items-center gap-3 text-sm text-[#8b765f] dark:text-[#b9a897]">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {t(
                                        "loadingPhotos"
                                    )}
                                </div>
                            </div>
                        ) : photos.length === 0 ? (
                            <div className="border border-dashed border-[#d8c9a8] bg-[#fffaf1] px-5 py-14 text-center dark:border-[#4a3c34] dark:bg-[#2a211d]">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#f0ded9] text-[#762f2f] dark:bg-[#382624] dark:text-[#d8b56a]">
                                    <ImagePlus className="h-7 w-7" />
                                </div>

                                <h3 className="mt-4 font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                    {t(
                                        "noPhotosYet"
                                    )}
                                </h3>

                                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#65584e] dark:text-[#c9bca9]">
                                    {t(
                                        "noPhotosDescription"
                                    )}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowUploadForm(
                                            true
                                        )
                                    }
                                    className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] hover:bg-[#5f2525]"
                                >
                                    <Upload className="h-4 w-4" />
                                    {t("uploadPhoto")}
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {photos.map((photo) => (
                                    <article
                                        key={photo.id}
                                        className="overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-sm dark:border-[#4a3c34] dark:bg-[#2a211d]"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-[#eee5d4] dark:bg-[#211a17]">
                                            <img
                                                src={photo.url}
                                                alt={photo.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />

                                            <div className="absolute left-3 top-3">
                                                <StatusBadge
                                                    status={
                                                        photo.status
                                                    }
                                                    approvedLabel={t(
                                                        "approved"
                                                    )}
                                                    rejectedLabel={t(
                                                        "rejected"
                                                    )}
                                                    pendingLabel={t(
                                                        "pending"
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-4">
                                            <h3 className="line-clamp-2 font-serif text-lg font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                                {photo.title}
                                            </h3>

                                            {photo.description && (
                                                <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#65584e] dark:text-[#c9bca9]">
                                                    {
                                                        photo.description
                                                    }
                                                </p>
                                            )}

                                            <div className="mt-3 flex items-center gap-2 text-xs text-[#8b765f] dark:text-[#b9a897]">
                                                <CalendarDays className="h-3.5 w-3.5" />

                                                <span>
                                                    {t(
                                                        "submitted",
                                                        {
                                                            date: formatDate(
                                                                photo.createdAt,
                                                                t(
                                                                    "dateUnavailable"
                                                                )
                                                            ),
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            {photo.status ===
                                                "pending" && (
                                                <p className="mt-3 border-l-2 border-[#c29a52] bg-[#f8efd7] px-3 py-2 text-xs leading-5 text-[#70581d] dark:bg-[#393221] dark:text-[#dbc67f]">
                                                    {t(
                                                        "waitingForReview"
                                                    )}
                                                </p>
                                            )}

                                            {photo.status ===
                                                "approved" && (
                                                <p className="mt-3 border-l-2 border-[#66784e] bg-[#e7efdf] px-3 py-2 text-xs leading-5 text-[#52643d] dark:bg-[#2d3828] dark:text-[#b9d39c]">
                                                    {t(
                                                        "publishedInGallery"
                                                    )}
                                                </p>
                                            )}

                                            {photo.status ===
                                                "rejected" && (
                                                <div className="mt-3 border-l-2 border-[#762f2f] bg-[#f6e3e0] px-3 py-2 dark:bg-[#382624]">
                                                    <p className="text-xs font-semibold text-[#762f2f] dark:text-[#e3aaa3]">
                                                        {t(
                                                            "rejectionReason"
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-[#6d4540] dark:text-[#d1aaa4]">
                                                        {photo.rejectionReason ||
                                                            t(
                                                                "noReasonProvided"
                                                            )}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="mt-4 flex gap-2 border-t border-[#d8c9a8] pt-4 dark:border-[#4a3c34]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            photo
                                                        )
                                                    }
                                                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-[#d8c9a8] bg-[#fffaf1] px-3 text-xs font-semibold text-[#762f2f] transition hover:bg-[#f7f0e2] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#d8b56a] dark:hover:bg-[#30251f]"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                    {t(
                                                        "update"
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            photo
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        photo.id
                                                    }
                                                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-[#d8aaa4] bg-[#fffaf1] px-3 text-xs font-semibold text-[#762f2f] transition hover:bg-[#f8e8e5] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#68413c] dark:bg-[#241b18] dark:text-[#e3aaa3] dark:hover:bg-[#30211e]"
                                                >
                                                    {deletingId ===
                                                    photo.id ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    )}

                                                    {t(
                                                        "delete"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Mobile submissions link */}
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/${locale}/contributor/submissions`
                                )
                            }
                            className="mt-5 w-full border border-[#d8c9a8] bg-[#fffaf1] py-3 text-sm font-semibold text-[#762f2f] dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#d8b56a] sm:hidden"
                        >
                            {t(
                                "viewMySubmissions"
                            )}
                        </button>
                    </div>
                </section>

                {/* =====================================================
                    EDIT MODAL
                ====================================================== */}
                {editingPhoto && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeEditModal();
                            }
                        }}
                    >
                        <div className="w-full max-w-lg overflow-hidden border border-[#d8c9a8] bg-[#fffaf1] shadow-2xl dark:border-[#4a3c34] dark:bg-[#2a211d]">
                            <div className="flex items-center justify-between border-b border-[#d8c9a8] bg-[#f7f0e2] px-5 py-4 dark:border-[#4a3c34] dark:bg-[#241b18]">
                                <div>
                                    <h2 className="font-serif text-xl font-semibold text-[#4b2823] dark:text-[#f3dfbc]">
                                        {t(
                                            "updatePhoto"
                                        )}
                                    </h2>

                                    <p className="mt-0.5 text-xs text-[#8b765f] dark:text-[#b9a897]">
                                        {t(
                                            "updateTitleDescription"
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={saving}
                                    className="flex h-9 w-9 items-center justify-center text-[#8b765f] hover:bg-[#eadfca] hover:text-[#4b2823] disabled:opacity-50 dark:hover:bg-[#30251f] dark:hover:text-[#f3dfbc]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleUpdate}
                                className="p-5 sm:p-6"
                            >
                                <div className="space-y-5">
                                    <div>
                                        <label
                                            htmlFor="edit-photo-title"
                                            className="mb-2 block text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]"
                                        >
                                            {t(
                                                "title"
                                            )}
                                        </label>

                                        <input
                                            id="edit-photo-title"
                                            type="text"
                                            value={
                                                editTitle
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setEditTitle(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="h-11 w-full border border-[#d8c9a8] bg-[#fffdf8] px-3 text-sm text-[#4b2823] outline-none focus:border-[#c29a52] focus:ring-1 focus:ring-[#c29a52] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#f3dfbc]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="edit-photo-description"
                                            className="mb-2 block text-sm font-semibold text-[#4b2823] dark:text-[#f3dfbc]"
                                        >
                                            {t(
                                                "description"
                                            )}
                                        </label>

                                        <textarea
                                            id="edit-photo-description"
                                            value={
                                                editDescription
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setEditDescription(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            rows={5}
                                            className="w-full resize-none border border-[#d8c9a8] bg-[#fffdf8] px-3 py-3 text-sm text-[#4b2823] outline-none focus:border-[#c29a52] focus:ring-1 focus:ring-[#c29a52] dark:border-[#4a3c34] dark:bg-[#241b18] dark:text-[#f3dfbc]"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#d8c9a8] pt-5 dark:border-[#4a3c34] sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={
                                            closeEditModal
                                        }
                                        disabled={saving}
                                        className="min-h-11 border border-[#d8c9a8] bg-[#fffaf1] px-5 text-sm font-semibold text-[#65584e] hover:bg-[#f7f0e2] disabled:opacity-50 dark:border-[#4a3c34] dark:bg-[#2a211d] dark:text-[#c9bca9]"
                                    >
                                        {t("cancel")}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#762f2f] px-5 text-sm font-semibold text-[#f7e8c5] hover:bg-[#5f2525] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                {t(
                                                    "saving"
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4" />
                                                {t(
                                                    "saveChanges"
                                                )}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </RequireAuth>
    );
}