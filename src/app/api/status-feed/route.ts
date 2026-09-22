import { readFile } from "fs/promises";
import path from "path";

import type { StatusFeed } from "@/types/status-feed";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "status-feed.json");
  const raw = await readFile(filePath, "utf-8");
  const feed = JSON.parse(raw) as StatusFeed;

  return Response.json(feed);
}
