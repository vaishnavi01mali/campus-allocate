"use client";

import { CampusProvider, useCampus } from "@/context/CampusContext";
import { AdminDashboard } from "./AdminDashboard";
import { BookingDrawer } from "./BookingDrawer";
import { Concierge } from "./Concierge";
import { FilterBar } from "./FilterBar";
import { FloorMap } from "./FloorMap";
import { Header } from "./Header";
import { RoomGrid } from "./RoomGrid";
import { Toasts } from "./Toasts";

export function CampusPortal() {
  return (
    <CampusProvider>
      <PortalShell />
    </CampusProvider>
  );
}

function PortalShell() {
  const { view } = useCampus();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6">
        {view !== "admin" ? <FilterBar /> : null}
        {view === "grid" ? <RoomGrid /> : null}
        {view === "map" ? <FloorMap /> : null}
        {view === "admin" ? <AdminDashboard /> : null}
      </main>
      <BookingDrawer />
      <Concierge />
      <Toasts />
    </div>
  );
}
