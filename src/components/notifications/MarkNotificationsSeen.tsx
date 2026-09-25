
"use client";

import { useEffect } from "react";

import {
  markContentSeen,
  type ContentSection,
} from "@/lib/notifications/local-state";

type Props = {
  ids: string[];
  section?: ContentSection;
};

export default function MarkNotificationsSeen({
  ids,
  section = "notifications",
}: Props) {
  useEffect(() => {
    if (ids.length === 0) {
      return;
    }

    markContentSeen(
      section,
      ids
    );
  }, [section, ids]);

  return null;
}

