import { Suspense } from "react";
import { CampusPortal } from "@/components/CampusPortal";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
          Loading campus live status…
        </div>
      }
    >
      <CampusPortal />
    </Suspense>
  );
}
