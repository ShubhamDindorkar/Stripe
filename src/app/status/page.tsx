import { Suspense } from "react";

import StatusPanel from "@/components/StatusPanel";

export default function StatusPage() {
  return (
    <main className="flex w-full justify-center">
      <div className="w-full max-w-3xl">
        <Suspense fallback={null}>
          <StatusPanel />
        </Suspense>
      </div>
    </main>
  );
}
