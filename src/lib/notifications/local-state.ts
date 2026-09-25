
export type ContentSection =
  | "notifications"
  | "gallery"
  | "events"
  | "sermons"
  | "blog";

const SECTION_KEYS: Record<
  ContentSection,
  {
    seen: string;
    initialized: string;
  }
> = {
  notifications: {
    seen: "jodhpur_notifications_seen_ids",
    initialized:
      "jodhpur_notifications_initialized",
  },

  gallery: {
    seen: "jodhpur_gallery_seen_ids",
    initialized:
      "jodhpur_gallery_initialized",
  },

  events: {
    seen: "jodhpur_events_seen_ids",
    initialized:
      "jodhpur_events_initialized",
  },

  sermons: {
    seen: "jodhpur_sermons_seen_ids",
    initialized:
      "jodhpur_sermons_initialized",
  },

  blog: {
    seen: "jodhpur_blog_seen_ids",
    initialized:
      "jodhpur_blog_initialized",
  },
};

function readIds(key: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string =>
        typeof id === "string"
    );
  } catch {
    return [];
  }
}

function writeIds(
  key: string,
  ids: string[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    key,
    JSON.stringify(ids)
  );
}

/**
 * Get IDs that the visitor has already seen
 * for a specific content section.
 */
export function getSeenContentIds(
  section: ContentSection
): string[] {
  const keys =
    SECTION_KEYS[section];

  return readIds(keys.seen);
}

/**
 * Check whether the local state for a section
 * has already been initialized.
 */
export function isContentStateInitialized(
  section: ContentSection
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const key =
    SECTION_KEYS[section]
      .initialized;

  return (
    localStorage.getItem(key) ===
    "true"
  );
}

/**
 * First visit to a section:
 *
 * All currently existing content is considered
 * already seen. This prevents old content from
 * immediately creating a red dot.
 */
export function initializeContentState(
  section: ContentSection,
  ids: string[]
) {
  if (typeof window === "undefined") {
    return;
  }

  if (
    isContentStateInitialized(
      section
    )
  ) {
    return;
  }

  const keys =
    SECTION_KEYS[section];

  /*
   * Remove duplicates and keep the latest
   * 500 IDs.
   */
  const uniqueIds =
    Array.from(
      new Set(ids)
    );

  writeIds(
    keys.seen,
    uniqueIds.slice(-500)
  );

  localStorage.setItem(
    keys.initialized,
    "true"
  );
}

/**
 * Mark content as seen for a section.
 */
export function markContentSeen(
  section: ContentSection,
  ids: string[]
) {
  if (typeof window === "undefined") {
    return;
  }

  const keys =
    SECTION_KEYS[section];

  const existing =
    getSeenContentIds(
      section
    );

  const merged =
    Array.from(
      new Set([
        ...existing,
        ...ids,
      ])
    );

  /*
   * Keep localStorage reasonably small.
   */
  const limited =
    merged.slice(-500);

  writeIds(
    keys.seen,
    limited
  );

  localStorage.setItem(
    keys.initialized,
    "true"
  );

  /*
   * Tell the unread provider that the
   * local seen state has changed.
   */
  window.dispatchEvent(
    new CustomEvent(
      "jodhpur-content-seen",
      {
        detail: {
          section,
        },
      }
    )
  );
}

/*
 * --------------------------------------------------
 * Backward-compatible notification functions
 * --------------------------------------------------
 *
 * These are kept so your existing
 * MarkNotificationsSeen.tsx and any other
 * notification code continue working.
 */

export function getSeenNotificationIds(): string[] {
  return getSeenContentIds(
    "notifications"
  );
}

export function markNotificationsSeen(
  ids: string[]
) {
  markContentSeen(
    "notifications",
    ids
  );
}

export function isNotificationStateInitialized(): boolean {
  return isContentStateInitialized(
    "notifications"
  );
}

export function initializeNotificationState(
  ids: string[]
) {
  initializeContentState(
    "notifications",
    ids
  );
}

