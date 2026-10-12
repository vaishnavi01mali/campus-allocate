"use client";

import {
  AirVent,
  Bell,
  MonitorPlay,
  Timer,
  Users,
  Wifi,
  UsersRound,
} from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import type { Room } from "@/lib/types";
import { cn, countdownLabel, statusMeta } from "@/lib/utils";

export function RoomCard({ room }: { room: Room }) {
  const { now, openBooking, joinStudyGroup, notifyWhenFree } = useCampus();
  const meta = statusMeta(room.status);
  const label = countdownLabel(room, now);

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {room.building}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            {room.number}
            <span className="ml-2 text-sm font-medium text-slate-500">
              {room.name}
            </span>
          </h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            meta.bg,
            meta.border,
            meta.text,
          )}
        >
          <span className={cn("h-2 w-2 animate-pulse rounded-full", meta.dot)} />
          {meta.short}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <Spec icon={Users} text={`${room.occupantCount}/${room.capacity} seats`} />
        {room.amenities.ac && <Spec icon={AirVent} text="AC" />}
        {room.amenities.projector && <Spec icon={MonitorPlay} text="Projector" />}
        {room.amenities.wifi && <Spec icon={Wifi} text="High-speed Wi-Fi" />}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
        <Timer className="h-4 w-4 text-slate-400" />
        {room.status === "available" ? (
          <span>Available now</span>
        ) : room.status === "lecture" ? (
          <span>⏱️ {label}</span>
        ) : (
          <span>⏳ {label}</span>
        )}
        {room.purpose ? (
          <span className="ml-auto text-xs text-slate-400">{room.purpose}</span>
        ) : null}
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {room.status === "available" ? (
          <button
            type="button"
            onClick={() => openBooking(room.id)}
            className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800"
          >
            Book / Reserve
          </button>
        ) : room.status === "reserved" ? (
          <>
            <button
              type="button"
              onClick={() => joinStudyGroup(room.id)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-600"
            >
              <UsersRound className="h-4 w-4" />
              Join study group
            </button>
            <button
              type="button"
              onClick={() => notifyWhenFree(room.id)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
            >
              <Bell className="h-4 w-4" />
              Notify
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => openBooking(room.id)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
            >
              View / override
            </button>
            <button
              type="button"
              onClick={() => notifyWhenFree(room.id)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-rose-600"
            >
              <Bell className="h-4 w-4" />
              Notify
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function Spec({
  icon: Icon,
  text,
}: {
  icon: typeof Users;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
      <Icon className="h-3 w-3" />
      {text}
    </span>
  );
}
