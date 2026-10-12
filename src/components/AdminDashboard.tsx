"use client";

import { Gauge, Ghost, Leaf, Users } from "lucide-react";
import { HOURLY_OCCUPANCY } from "@/lib/data";
import { useCampus, useCampusStats } from "@/context/CampusContext";
import { occupancyPercent, statusMeta } from "@/lib/utils";

export function AdminDashboard() {
  const { rooms } = useCampus();
  const { totalCapacity, occupancy, ghostReleased, energyIndex } = useCampusStats();

  const metrics = [
    {
      label: "Total capacity",
      value: totalCapacity.toLocaleString(),
      hint: "Seats across mapped spaces",
      icon: Users,
    },
    {
      label: "Active occupancy",
      value: `${occupancy}%`,
      hint: "Live headcount / capacity",
      icon: Gauge,
    },
    {
      label: 'Auto-released "ghost" bookings',
      value: String(ghostReleased),
      hint: "Expired holds returned to the pool",
      icon: Ghost,
    },
    {
      label: "Energy savings index",
      value: `${energyIndex}`,
      hint: "Idle AC rooms as a 0–100 score",
      icon: Leaf,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Utilization & space analytics</h2>
        <p className="text-sm text-slate-500">
          Facilities view of live occupancy, ghost-booking recovery, and peak load.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-500">{metric.hint}</p>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Peak hourly occupancy heatmap
            </h3>
            <p className="text-xs text-slate-500">Campus-wide load · 8 AM – 8 PM</p>
          </div>
          <p className="text-xs font-medium text-slate-400">Live overlay {occupancy}%</p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-[repeat(13,minmax(0,1fr))]">
          {HOURLY_OCCUPANCY.map((slot) => (
            <div key={slot.hour} className="flex flex-col items-center gap-2">
              <div className="flex h-36 w-full items-end rounded-xl bg-slate-50 p-1">
                <div
                  className="w-full rounded-lg transition-all duration-200"
                  style={{
                    height: `${slot.value}%`,
                    background: heatColor(slot.value),
                    boxShadow: `0 0 16px ${heatColor(slot.value)}55`,
                  }}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{slot.hour}</span>
              <span className="text-[10px] text-slate-400">{slot.value}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Headcount</th>
              <th className="px-4 py-3">Utilisation</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const meta = statusMeta(room.status);
              const util = occupancyPercent([room]);
              return (
                <tr key={room.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {room.number}
                    <span className="ml-2 font-normal text-slate-500">{room.name}</span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${meta.text}`}>{meta.short}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {room.occupantCount}/{room.capacity}
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{ width: `${util}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function heatColor(value: number) {
  if (value >= 85) return "#f43f5e";
  if (value >= 65) return "#f59e0b";
  if (value >= 40) return "#06b6d4";
  return "#10b981";
}
