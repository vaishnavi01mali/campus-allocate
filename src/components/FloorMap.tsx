"use client";

import { useMemo, useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { countdownLabel, statusMeta } from "@/lib/utils";
import type { Room } from "@/lib/types";

export function FloorMap() {
  const { filteredRooms, rooms, openBooking, now } = useCampus();
  const [hover, setHover] = useState<{
    room: Room;
    x: number;
    y: number;
  } | null>(null);

  const visible = useMemo(() => {
    const ids = new Set(filteredRooms.map((r) => r.id));
    return rooms.map((room) => ({ room, dim: !ids.has(room.id) }));
  }, [filteredRooms, rooms]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Block A · Level 2 architectural live map
          </p>
          <p className="text-xs text-slate-500">
            Hover a room for status · click to open the booking drawer
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
          <Legend color="bg-rose-500" label="Lecture" />
          <Legend color="bg-emerald-500" label="Available" />
          <Legend color="bg-amber-500" label="Reserved" />
        </div>
      </div>

      <div data-map-wrap className="relative overflow-x-auto p-3 sm:p-5">
        <svg
          viewBox="0 0 1200 740"
          className="min-w-[860px] w-full"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            </pattern>
            <filter id="glow-rose" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-green" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-amber" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="1200" height="740" fill="url(#grid)" />
          <rect
            x="16"
            y="16"
            width="1168"
            height="708"
            rx="28"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
          />

          <rect x="244" y="200" width="500" height="236" rx="16" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="494" y="318" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="700">
            CENTRAL ATRIUM / CORRIDOR
          </text>
          <text x="494" y="338" textAnchor="middle" fill="#cbd5e1" fontSize="11">
            North wing ↔ AI Labs
          </text>

          <rect x="252" y="208" width="70" height="52" rx="8" fill="#fff" stroke="#e2e8f0" />
          <text x="287" y="238" textAnchor="middle" fill="#94a3b8" fontSize="10">
            STAIRS
          </text>
          <rect x="656" y="208" width="70" height="52" rx="8" fill="#fff" stroke="#e2e8f0" />
          <text x="691" y="238" textAnchor="middle" fill="#94a3b8" fontSize="10">
            LIFTS
          </text>

          <text x="36" y="48" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="2">
            BLOCK A CLASSROOMS
          </text>
          <text x="760" y="48" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="2">
            AI LABS
          </text>
          <text x="268" y="452" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="2">
            SEMINAR WING
          </text>

          {visible.map(({ room, dim }) => {
            const meta = statusMeta(room.status);
            const filter =
              room.status === "lecture"
                ? "url(#glow-rose)"
                : room.status === "reserved"
                  ? "url(#glow-amber)"
                  : "url(#glow-green)";
            return (
              <g
                key={room.id}
                opacity={dim ? 0.28 : 1}
                className="cursor-pointer"
                onMouseMove={(e) => {
                  const wrap = e.currentTarget.ownerSVGElement?.closest(
                    "[data-map-wrap]",
                  ) as HTMLElement | null;
                  if (!wrap) return;
                  const bounds = wrap.getBoundingClientRect();
                  setHover({
                    room,
                    x: e.clientX - bounds.left + wrap.scrollLeft,
                    y: e.clientY - bounds.top,
                  });
                }}
                onClick={() => openBooking(room.id)}
              >
                <rect
                  x={room.map.x}
                  y={room.map.y}
                  width={room.map.w}
                  height={room.map.h}
                  rx="14"
                  fill={meta.fill}
                  stroke={meta.stroke}
                  strokeWidth="3"
                  filter={dim ? undefined : filter}
                  className="transition-all duration-200"
                />
                <circle
                  cx={room.map.x + 22}
                  cy={room.map.y + 24}
                  r="6"
                  fill={meta.stroke}
                />
                <text
                  x={room.map.x + 36}
                  y={room.map.y + 28}
                  fill="#0f172a"
                  fontSize="13"
                  fontWeight="800"
                >
                  {room.number}
                </text>
                <text
                  x={room.map.x + 18}
                  y={room.map.y + 52}
                  fill="#475569"
                  fontSize="11"
                >
                  {room.name}
                </text>
                <text
                  x={room.map.x + 18}
                  y={room.map.y + room.map.h - 16}
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                >
                  {room.capacity} cap · {meta.short}
                </text>
              </g>
            );
          })}
        </svg>

        {hover ? (
          <div
            className="pointer-events-none absolute z-10 w-64 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl shadow-slate-300/50 backdrop-blur-md"
            style={{
              left: Math.min(hover.x + 16, 420),
              top: Math.max(hover.y - 12, 8),
            }}
          >
            <TooltipBody room={hover.room} now={now} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TooltipBody({ room, now }: { room: Room; now: number }) {
  const meta = statusMeta(room.status);
  const label = countdownLabel(room, now);
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {room.building}
      </p>
      <p className="text-sm font-semibold text-slate-900">
        {room.number} · {room.name}
      </p>
      <p className={`mt-1 text-xs font-semibold ${meta.text}`}>{meta.label}</p>
      <p className="mt-2 text-xs text-slate-600">
        Headcount {room.occupantCount}/{room.capacity}
      </p>
      <p className="text-xs font-medium text-slate-700">
        {room.status === "available" ? "Available now" : `⏱️ ${label}`}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
