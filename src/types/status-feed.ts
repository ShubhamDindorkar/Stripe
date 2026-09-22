export type ComponentStatus = "operational" | "degraded" | string;

export type ChangelogSeverity = "major" | "minor" | "info" | string;

export interface StatusComponent {
  id: string;
  name: string;
  status: ComponentStatus;
}

export interface ChangelogEntry {
  id: string;
  title: string;
  severity: ChangelogSeverity;
  published_at: string;
  url: string;
}

export interface StatusFeed {
  updated_at: string;
  overall_status: string;
  components: StatusComponent[];
  changelog: ChangelogEntry[];
}
