"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { formatPublishedDate, formatTimeAgo } from "@/lib/format-time-ago";
import type { StatusFeed } from "@/types/status-feed";

type PanelState = "waiting" | "no-incidents" | "disruption" | "network-failure";

const SKELETON_WIDTHS = [
  "w-full",
  "w-11/12",
  "w-10/12",
  "w-11/12",
  "w-9/12",
  "w-full",
  "w-11/12",
  "w-10/12",
  "w-11/12",
  "w-9/12",
] as const;

const CHANGELOG_URL = "https://docs.stripe.com/changelog";

function SkeletonBars() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-4 rounded bg-zinc-300 dark:bg-zinc-700 w-full" />
      <div className="mt-1 flex flex-col gap-3">
        {SKELETON_WIDTHS.slice(1, 5).map((width, index) => (
          <div
            key={`incident-skeleton-${index}`}
            className={`h-4 rounded bg-zinc-300 dark:bg-zinc-700 ${width}`}
          />
        ))}
      </div>
      <div className="mt-1 flex flex-col gap-3">
        {SKELETON_WIDTHS.slice(5).map((width, index) => (
          <div
            key={`changelog-skeleton-${index}`}
            className={`h-4 rounded bg-zinc-300 dark:bg-zinc-700 ${width}`}
          />
        ))}
      </div>
    </div>
  );
}

function resolvePanelState(feed: StatusFeed): PanelState {
  const hasDisruption =
    feed.overall_status !== "operational" || feed.incidents.length > 0;

  return hasDisruption ? "disruption" : "no-incidents";
}

export default function StatusPanel() {
  const searchParams = useSearchParams();
  const [panelState, setPanelState] = useState<PanelState>("waiting");
  const [feed, setFeed] = useState<StatusFeed | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const queryString = searchParams.toString();
  const feedUrl = queryString
    ? `/api/status-feed?${queryString}`
    : "/api/status-feed";

  const loadFeed = useCallback(async (signal: AbortSignal) => {
    setPanelState("waiting");
    setFeed(null);

    try {
      const response = await fetch(feedUrl, { signal });

      if (!response.ok) {
        setPanelState("network-failure");
        return;
      }

      const data = (await response.json()) as StatusFeed;
      setFeed(data);
      setPanelState(resolvePanelState(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setPanelState("network-failure");
    }
  }, [feedUrl]);

  useEffect(() => {
    const controller = new AbortController();
    void loadFeed(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadFeed, fetchKey]);

  const handleRetry = () => {
    setFetchKey((current) => current + 1);
  };

  const handleViewChangelog = () => {
    window.open(CHANGELOG_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="flex w-full min-h-[480px] flex-col px-6 py-8">
      {panelState === "network-failure" ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-semibold">Couldn&apos;t load status feed</h1>
          <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
            This panel couldn&apos;t reach the status feed. Stripe services are
            unaffected.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">Stripe API Status</h1>
          <hr className="my-4 border-zinc-300 dark:border-zinc-700" />

          {panelState === "waiting" && <SkeletonBars />}

          {feed && panelState === "no-incidents" && (
            <>
              <p>All systems operational.</p>
              <div className="mt-4 flex min-h-[280px] flex-1 items-center justify-center">
                <p>Nothing to report.</p>
              </div>
            </>
          )}

          {feed && panelState === "disruption" && (
            <>
              <p>Overall status: {feed.overall_status}.</p>
              <ul className="mt-4 flex flex-col gap-4">
                {feed.incidents.map((incident) => (
                  <li key={incident.id}>
                    <p>
                      {incident.title} ·{" "}
                      {incident.impact === "major" ? (
                        <span className="text-red-600 dark:text-red-400">
                          {incident.impact}
                        </span>
                      ) : (
                        incident.impact
                      )}{" "}
                      · {incident.status} · {formatTimeAgo(incident.updated_at)}
                    </p>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                      {incident.latest_update}
                    </p>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 flex min-h-[140px] flex-col gap-3">
                {feed.changelog.map((entry) => (
                  <li key={entry.id}>
                    {entry.title} · {formatPublishedDate(entry.published_at)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <div className="mt-6 min-h-[40px]">
        {panelState === "network-failure" && (
          <button
            type="button"
            onClick={handleRetry}
            className="text-sm font-medium underline underline-offset-4"
          >
            Retry
          </button>
        )}
        {panelState === "disruption" && (
          <button
            type="button"
            onClick={handleViewChangelog}
            className="text-sm font-medium underline underline-offset-4"
          >
            View changelog
          </button>
        )}
      </div>
    </section>
  );
}
