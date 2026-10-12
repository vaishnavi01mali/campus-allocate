"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import type { Building, RoomStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const BUILDINGS: Array<"all" | Building> = [
  "all",
  "Block A",
  "AI Labs",
  "Seminar Wing",
];

const STATUSES: { id: RoomStatus; label: string; dot: string }[] = [
  { id: "available", label: "Available", dot: "bg-emerald-500" },
  { id: "reserved", label: "Reserved", dot: "bg-amber-500" },
  { id: "lecture", label: "In lecture", dot: "bg-rose-500" },
];

export function FilterBar() {
  const { filters, setFilters, filteredRooms, rooms } = useCampus();

  const toggleStatus = (status: RoomStatus) => {
    const has = filters.statuses.includes(status);
    const next = has
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    setFilters({ statuses: next.length ? next : [status] });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200/60 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          Filter campus spaces
        </div>
        <p className="text-xs font-medium text-slate-500">
          {filteredRooms.length} of {rooms.length} rooms
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <label className="relative lg:col-span-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
            placeholder="Search room name or number…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </label>

        <label className="flex flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 lg:col-span-3">
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>Min capacity</span>
            <span className="text-slate-900">{filters.minCapacity}+ seats</span>
          </div>
          <input
            type="range"
            min={1}
            max={120}
            value={filters.minCapacity}
            onChange={(e) => setFilters({ minCapacity: Number(e.target.value) })}
            className="accent-cyan-600"
          />
        </label>

        <div className="flex flex-wrap gap-1.5 lg:col-span-5">
          {BUILDINGS.map((building) => (
            <button
              key={building}
              type="button"
              onClick={() => setFilters({ building })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                filters.building === building
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {building === "all" ? "All buildings" : building}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {STATUSES.map((status) => {
          const on = filters.statuses.includes(status.id);
          return (
            <button
              key={status.id}
              type="button"
              onClick={() => toggleStatus(status.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                on
                  ? "border-slate-200 bg-white text-slate-800 shadow-sm"
                  : "border-transparent bg-slate-100 text-slate-400",
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", status.dot)} />
              {status.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
