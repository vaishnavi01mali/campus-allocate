"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createInitialRooms } from "@/lib/data";
import type {
  AppView,
  BookingDraft,
  ChatMessage,
  Filters,
  Room,
  RoomStatus,
  ToastItem,
} from "@/lib/types";
import { matchQuery, occupancyPercent, recommendRooms } from "@/lib/utils";

interface CampusContextValue {
  rooms: Room[];
  now: number;
  view: AppView;
  setView: (view: AppView) => void;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  filteredRooms: Room[];
  selectedRoomId: string | null;
  selectedRoom: Room | null;
  drawerOpen: boolean;
  openBooking: (roomId: string) => void;
  closeBooking: () => void;
  submitBooking: (draft: BookingDraft) => void;
  joinStudyGroup: (roomId: string) => void;
  notifyWhenFree: (roomId: string) => void;
  conciergeOpen: boolean;
  setConciergeOpen: (open: boolean) => void;
  messages: ChatMessage[];
  askConcierge: (prompt: string) => void;
  ghostReleased: number;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
}

const CampusContext = createContext<CampusContextValue | null>(null);

const INITIAL_FILTERS: Filters = {
  query: "",
  minCapacity: 1,
  building: "all",
  statuses: ["lecture", "available", "reserved"],
};

const STABLE_NOW = 1_735_689_600_000;

export function CampusProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(() => createInitialRooms(STABLE_NOW));
  const [now, setNow] = useState(STABLE_NOW);
  const [view, setView] = useState<AppView>("grid");
  const [filters, setFiltersState] = useState<Filters>(INITIAL_FILTERS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [ghostReleased, setGhostReleased] = useState(14);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi — I’m the Campus Space Concierge. Ask for an empty lab, a quiet table for four, or a hall that frees up soon. I’ll match live occupancy.",
    },
  ]);

  const pushToast = useCallback((title: string, description: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, description }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  useEffect(() => {
    const stamp = Date.now();
    setNow(stamp);
    setRooms(createInitialRooms(stamp));

    const timer = window.setInterval(() => {
      const next = Date.now();
      setNow(next);
      setRooms((prev) => {
        let released = 0;
        const updated = prev.map((room) => {
          if (room.occupiedUntil && room.occupiedUntil <= next && room.status !== "available") {
            released += 1;
            return {
              ...room,
              status: "available" as const,
              occupiedUntil: null,
              occupantCount: 0,
              purpose: undefined,
            };
          }
          return room;
        });
        if (released) {
          setGhostReleased((g) => g + released);
        }
        return released ? updated : prev;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const setFilters = useCallback((patch: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (!matchQuery(room, filters.query)) return false;
      if (room.capacity < filters.minCapacity) return false;
      if (filters.building !== "all" && room.building !== filters.building) return false;
      if (!filters.statuses.includes(room.status)) return false;
      return true;
    });
  }, [rooms, filters]);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId],
  );

  const openBooking = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setDrawerOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const submitBooking = useCallback(
    (draft: BookingDraft) => {
      const room = rooms.find((r) => r.id === draft.roomId);
      if (!room) return;
      const lecture = draft.purpose === "Faculty Lecture";
      const nextStatus: RoomStatus = lecture ? "lecture" : "reserved";
      setRooms((prev) =>
        prev.map((item) =>
          item.id === draft.roomId
            ? {
                ...item,
                status: nextStatus,
                occupiedUntil: Date.now() + draft.duration * 60_000,
                occupantCount: Math.min(draft.headcount, item.capacity),
                purpose: draft.purpose,
              }
            : item,
        ),
      );
      setDrawerOpen(false);
      pushToast(
        lecture ? "Lecture locked in" : "Space reserved",
        `${room.number} is now ${lecture ? "in lecture" : "amber · self-study"} for ${draft.duration} minutes.`,
      );
    },
    [rooms, pushToast],
  );

  const joinStudyGroup = useCallback(
    (roomId: string) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;
      if (room.occupantCount >= room.capacity) {
        pushToast("Room is full", `${room.number} has no spare seats.`);
        return;
      }
      setRooms((prev) =>
        prev.map((item) =>
          item.id === roomId
            ? { ...item, occupantCount: item.occupantCount + 1 }
            : item,
        ),
      );
      pushToast("Joined study group", `You’re in ${room.number}. Headcount updated live.`);
    },
    [rooms, pushToast],
  );

  const notifyWhenFree = useCallback(
    (roomId: string) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;
      pushToast("Ping scheduled", `We’ll notify you the moment ${room.number} flips to available.`);
    },
    [rooms, pushToast],
  );

  const askConcierge = useCallback(
    (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed) return;
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };
      const rec = recommendRooms(trimmed, rooms, Date.now());
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: rec.content,
        roomIds: rec.roomIds,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
    },
    [rooms],
  );

  const value = useMemo<CampusContextValue>(
    () => ({
      rooms,
      now,
      view,
      setView,
      filters,
      setFilters,
      filteredRooms,
      selectedRoomId,
      selectedRoom,
      drawerOpen,
      openBooking,
      closeBooking,
      submitBooking,
      joinStudyGroup,
      notifyWhenFree,
      conciergeOpen,
      setConciergeOpen,
      messages,
      askConcierge,
      ghostReleased,
      toasts,
      dismissToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    }),
    [
      rooms,
      now,
      view,
      filters,
      setFilters,
      filteredRooms,
      selectedRoomId,
      selectedRoom,
      drawerOpen,
      openBooking,
      closeBooking,
      submitBooking,
      joinStudyGroup,
      notifyWhenFree,
      conciergeOpen,
      messages,
      askConcierge,
      ghostReleased,
      toasts,
    ],
  );

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}

export function useCampus() {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error("useCampus must be used inside CampusProvider");
  return ctx;
}

export function useCampusStats() {
  const { rooms, ghostReleased } = useCampus();
  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
  const occupancy = occupancyPercent(rooms);
  const acRooms = rooms.filter((r) => r.amenities.ac);
  const idleAc = acRooms.filter((r) => r.status === "available").length;
  const energyIndex = acRooms.length
    ? Math.round((idleAc / acRooms.length) * 100)
    : 0;
  return { totalCapacity, occupancy, ghostReleased, energyIndex };
}
