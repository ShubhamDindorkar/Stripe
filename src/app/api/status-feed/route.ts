import { readFile } from "fs/promises";
import path from "path";

import type { StatusFeed } from "@/types/status-feed";

const NO_INCIDENTS_FEED: StatusFeed = {
  generated_at: "2024-09-18T14:32:07Z",
  overall_status: "operational",
  incidents: [],
  changelog: [],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const delayMs = Number(searchParams.get("delay") ?? 0);
  const shouldFail = searchParams.get("fail") === "1";
  const fixture = searchParams.get("fixture");

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  if (shouldFail) {
    return new Response(null, { status: 500 });
  }

  if (fixture === "no-incidents") {
    return Response.json(NO_INCIDENTS_FEED);
  }

  const filePath = path.join(process.cwd(), "data", "status-feed.json");
  const raw = await readFile(filePath, "utf-8");
  const feed = JSON.parse(raw) as StatusFeed;

  return Response.json(feed);
}
