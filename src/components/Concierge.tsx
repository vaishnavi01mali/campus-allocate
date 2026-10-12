"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { CONCIERGE_PILLS } from "@/lib/data";
import { useCampus } from "@/context/CampusContext";

export function Concierge() {
  const {
    conciergeOpen,
    setConciergeOpen,
    messages,
    askConcierge,
    openBooking,
    rooms,
  } = useCampus();
  const [draft, setDraft] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={() => setConciergeOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/30 transition-all duration-200 hover:scale-105 hover:bg-slate-800"
      >
        <Sparkles className="h-4 w-4 text-emerald-300" />
        Campus Concierge
      </button>

      {conciergeOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close concierge"
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setConciergeOpen(false)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Campus Space Concierge
                  </p>
                  <p className="text-xs text-slate-500">Live occupancy matching</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConciergeOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.role === "user"
                      ? "ml-8 rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white"
                      : "mr-6 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm whitespace-pre-line text-slate-700"
                  }
                >
                  {msg.content}
                  {msg.roomIds?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.roomIds.map((id) => {
                        const room = rooms.find((r) => r.id === id);
                        if (!room) return null;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              setConciergeOpen(false);
                              openBooking(id);
                            }}
                            className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-cyan-700 shadow-sm"
                          >
                            Book {room.number}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {CONCIERGE_PILLS.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => askConcierge(pill)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-all duration-200 hover:bg-white"
                  >
                    {pill}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  askConcierge(draft);
                  setDraft("");
                }}
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask for a room…"
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-3 text-white transition-all duration-200 hover:bg-slate-800"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
