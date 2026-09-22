export interface Incident {
  id: string;
  title: string;
  status: string;
  impact: string;
  started_at: string;
  updated_at: string;
  latest_update: string;
}

export interface ChangelogEntry {
  id: string;
  title: string;
  published_at: string;
  url: string;
}

export interface StatusFeed {
  generated_at: string;
  overall_status: string;
  incidents: Incident[];
  changelog: ChangelogEntry[];
}
