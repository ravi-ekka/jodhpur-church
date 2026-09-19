
"use client";

import { useEffect, useRef, useState } from "react";

export default function BibleIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(700);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let timers: number[] = [];

    const updateHeight = () => {
      try {
        const doc = iframe.contentDocument;

        if (!doc) return;

        const body = doc.body;
        const html = doc.documentElement;

        if (!body || !html) return;

        const contentHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          body.clientHeight,
          html.scrollHeight,
          html.offsetHeight,
          html.clientHeight
        );

        if (contentHeight > 0) {
          setHeight(contentHeight);
        }
      } catch (error) {
        console.error("Unable to resize Bible iframe:", error);
      }
    };

    const handleLoad = () => {
      updateHeight();

      try {
        const doc = iframe.contentDocument;

        if (!doc) return;

        const body = doc.body;

        if (!body) return;

        resizeObserver?.disconnect();
        mutationObserver?.disconnect();

        resizeObserver = new ResizeObserver(() => {
          updateHeight();
        });

        resizeObserver.observe(body);

        if (doc.documentElement) {
          resizeObserver.observe(doc.documentElement);
        }

        mutationObserver = new MutationObserver(() => {
          updateHeight();
        });

        mutationObserver.observe(body, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });

        requestAnimationFrame(updateHeight);

        timers.forEach((timer) => {
          window.clearTimeout(timer);
        });

        timers = [
          window.setTimeout(updateHeight, 100),
          window.setTimeout(updateHeight, 300),
          window.setTimeout(updateHeight, 500),
          window.setTimeout(updateHeight, 1000),
        ];
      } catch (error) {
        console.error(
          "Unable to observe Bible iframe:",
          error
        );
      }
    };

    iframe.addEventListener("load", handleLoad);

    if (iframe.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    return () => {
      iframe.removeEventListener("load", handleLoad);

      resizeObserver?.disconnect();
      mutationObserver?.disconnect();

      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timers = [];
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#241d19]">
      <iframe
        ref={iframeRef}
        src="/bible/index.html"
        title="Hindi Catholic Bible"
        loading="lazy"
        style={{
          width: "100%",
          height: `${height}px`,
          border: "0",
          display: "block",
          overflow: "hidden",
        }}
        className="w-full border-0"
      />
    </div>
  );
}
