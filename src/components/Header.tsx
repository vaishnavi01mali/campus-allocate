"use client";

import type { ReactNode } from "react";
import {
  Activity,
  LayoutGrid,
  Map as MapIcon,
  Radio,
  Shield,
} from "lucide-react";
import { useCampus, useCampusStats } from "@/context/CampusContext";
import { cn } from "@/lib/utils";
import type { AppView } from "@/lib/types";

const VIEWS: { id: AppView; label: string; icon: typeof LayoutGrid }[] = [
  { id: "grid", label: "Grid View", icon: LayoutGrid },
  { id: "map", label: "Architectural SVG Map", icon: MapIcon },
  { id: "admin", label: "Admin Dashboard", icon: Shield },
];

export function Header() {
  const { view, setView, rooms } = useCampus();
  const { occupancy } = useCampusStats();
  const live = rooms.filter((r) => r.status === "lecture").length;
  const free = rooms.filter((r) => r.status === "available").length;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-lg shadow-slate-900/15">
            <Radio className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="bg-gradient-to-r from-slate-900 via-cyan-700 to-emerald-600 bg-clip-text text-lg font-extrabold tracking-[0.18em] text-transparent">
              CAMPUS ALLOCATE
            </p>
            <p className="text-xs font-medium text-slate-500">
              Live resource & space status · Block A campus
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live sync
          </Badge>
          <Badge>
            <Activity className="h-3.5 w-3.5 text-rose-500" />
            {live} lectures
          </Badge>
          <Badge>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {free} free
          </Badge>
          <Badge>{occupancy}% occupancy</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-inner">
            {VIEWS.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                    active
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-xs font-bold text-white">
              AR
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold text-slate-900">Aria Rao</p>
              <p className="text-[10px] text-slate-500">Space steward</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
      {children}
    </span>
  );
}
