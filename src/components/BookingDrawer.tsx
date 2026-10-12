"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCampus } from "@/context/CampusContext";
import type { DurationMins, Purpose } from "@/lib/types";
import { cn, statusMeta } from "@/lib/utils";

const PURPOSES: Purpose[] = [
  "Group Discussion",
  "Placement Prep",
  "Self-Study",
  "Faculty Lecture",
];

const DURATIONS: DurationMins[] = [30, 60, 120];

export function BookingDrawer() {
  const { drawerOpen, closeBooking, selectedRoom, submitBooking } = useCampus();
  const [purpose, setPurpose] = useState<Purpose>("Self-Study");
  const [duration, setDuration] = useState<DurationMins>(60);
  const [headcount, setHeadcount] = useState(2);

  useEffect(() => {
    if (selectedRoom) {
      setHeadcount(Math.min(4, selectedRoom.capacity));
      setPurpose("Self-Study");
      setDuration(60);
    }
  }, [selectedRoom]);

  const cap = selectedRoom?.capacity ?? 1;
  const meta = useMemo(
    () => (selectedRoom ? statusMeta(selectedRoom.status) : null),
    [selectedRoom],
  );

  if (!drawerOpen || !selectedRoom || !meta) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close booking drawer"
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={closeBooking}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl animate-slide-in">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Reserve space
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              {selectedRoom.number}
            </h2>
            <p className="text-sm text-slate-500">{selectedRoom.name}</p>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition-all duration-200 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div className={cn("rounded-2xl border px-4 py-3 text-sm", meta.bg, meta.border, meta.text)}>
            Currently {meta.label.toLowerCase()} · {selectedRoom.occupantCount}/
            {selectedRoom.capacity} occupied
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-900">Purpose</legend>
            <div className="grid grid-cols-2 gap-2">
              {PURPOSES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPurpose(item)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
                    purpose === item
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-900">Duration</legend>
            <div className="flex gap-2">
              {DURATIONS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200",
                    duration === mins
                      ? "border-cyan-600 bg-cyan-50 text-cyan-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {mins === 30 ? "30 mins" : mins === 60 ? "1 hour" : "2 hours"}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-900">Headcount</p>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <button
                type="button"
                onClick={() => setHeadcount((n) => Math.max(1, n - 1))}
                className="rounded-xl bg-white p-2 text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{headcount}</p>
                <p className="text-[11px] text-slate-500">max {cap}</p>
              </div>
              <button
                type="button"
                onClick={() => setHeadcount((n) => Math.min(cap, n + 1))}
                className="rounded-xl bg-white p-2 text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={() =>
              submitBooking({
                roomId: selectedRoom.id,
                purpose,
                duration,
                headcount,
              })
            }
            className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-800 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all duration-200 hover:brightness-110"
          >
            Confirm {purpose === "Faculty Lecture" ? "lecture lock" : "reservation"}
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Student bookings flip the room to amber self-study instantly.
          </p>
        </div>
      </aside>
    </div>
  );
}
