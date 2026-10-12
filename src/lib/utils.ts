import type { Room, RoomStatus } from "./types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function remainingMs(until: number | null, now: number) {
  if (!until) return 0;
  return Math.max(0, until - now);
}

export function remainingMinutes(until: number | null, now: number) {
  const ms = remainingMs(until, now);
  if (ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / 60_000));
}

export function countdownLabel(room: Room, now: number) {
  if (room.status === "available" || !room.occupiedUntil) {
    return "Available now";
  }
  const mins = remainingMinutes(room.occupiedUntil, now);
  if (room.status === "lecture") return `Free in ${mins}m`;
  return `Reserved for ${mins}m`;
}

export function statusMeta(status: RoomStatus) {
  if (status === "lecture") {
    return {
      label: "Lecture in progress",
      short: "In lecture",
      dot: "bg-rose-500",
      text: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      fill: "#fff1f2",
      stroke: "#f43f5e",
      glow: "rgba(244,63,94,0.45)",
    };
  }
  if (status === "reserved") {
    return {
      label: "Reserved · self-study",
      short: "Reserved",
      dot: "bg-amber-500",
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      fill: "#fffbeb",
      stroke: "#f59e0b",
      glow: "rgba(245,158,11,0.45)",
    };
  }
  return {
    label: "Available · free space",
    short: "Available",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    fill: "#ecfdf5",
    stroke: "#10b981",
    glow: "rgba(16,185,129,0.4)",
  };
}

export function occupancyPercent(rooms: Room[]) {
  const seats = rooms.reduce((s, r) => s + r.capacity, 0);
  const used = rooms.reduce((s, r) => s + r.occupantCount, 0);
  if (!seats) return 0;
  return Math.round((used / seats) * 100);
}

export function matchQuery(room: Room, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    room.name.toLowerCase().includes(q) ||
    room.number.toLowerCase().includes(q) ||
    room.building.toLowerCase().includes(q) ||
    room.type.toLowerCase().includes(q)
  );
}

export function recommendRooms(prompt: string, rooms: Room[], now: number) {
  const q = prompt.toLowerCase();
  const needsLab = q.includes("lab");
  const needsAc = q.includes("ac") || q.includes("air");
  const empty = q.includes("empty") || q.includes("free") || q.includes("available") || q.includes("right now");
  const quiet = q.includes("quiet") || q.includes("study");
  const seminar = q.includes("seminar") || q.includes("hall");
  const placement = q.includes("placement");
  const soon = q.includes("soon") || q.includes("freeing") || q.includes("next");
  const peopleMatch = q.match(/(\d+)\s*(people|person|students|heads)?/);
  const people = peopleMatch ? Number(peopleMatch[1]) : quiet ? 4 : 1;

  let scored = rooms.map((room) => {
    let score = 0;
    if (needsLab && room.type === "lab") score += 5;
    if (seminar && room.type === "seminar") score += 5;
    if (needsAc && room.amenities.ac) score += 3;
    if (empty && room.status === "available") score += 6;
    if (quiet && room.status !== "lecture") score += 3;
    if (quiet && room.capacity <= 40) score += 2;
    if (placement && (room.type === "seminar" || room.type === "classroom")) score += 2;
    if (room.capacity >= people) score += 3;
    if (room.capacity < people) score -= 8;
    if (soon && room.status !== "available" && remainingMinutes(room.occupiedUntil, now) <= 20) {
      score += 5;
    }
    if (room.status === "available") score += 1;
    if (room.status === "lecture" && !soon) score -= 4;
    return { room, score };
  });

  scored = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length) {
    scored = rooms
      .filter((r) => r.status === "available" && r.capacity >= people)
      .slice(0, 3)
      .map((room) => ({ room, score: 1 }));
  }

  const picks = scored.map((s) => s.room);
  const lines = picks.map((room) => {
    const when =
      room.status === "available"
        ? "open now"
        : `opens in ${remainingMinutes(room.occupiedUntil, now)}m`;
    return `• ${room.number} ${room.name} — ${room.capacity} seats, ${when}${room.amenities.ac ? ", AC" : ""}`;
  });

  const intro = picks.length
    ? `I scanned live occupancy and found ${picks.length} strong match${picks.length === 1 ? "" : "es"}:`
    : "Campus is tight right now — no clean matches. Try lowering headcount or checking rooms that free up soon.";

  return {
    content: [intro, ...lines].join("\n"),
    roomIds: picks.map((r) => r.id),
  };
}
