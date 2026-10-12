"use client";

import { X } from "lucide-react";
import { useCampus } from "@/context/CampusContext";

export function Toasts() {
  const { toasts, dismissToast } = useCampus();
  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-300/40 backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              <p className="text-xs text-slate-500">{toast.description}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
