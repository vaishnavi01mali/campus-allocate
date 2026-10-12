"use client";

import { useCampus } from "@/context/CampusContext";
import { RoomCard } from "./RoomCard";

export function RoomGrid() {
  const { filteredRooms } = useCampus();

  if (!filteredRooms.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-base font-semibold text-slate-900">No rooms match those filters</p>
        <p className="mt-1 text-sm text-slate-500">
          Widen capacity, building, or status to see more campus space.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredRooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
