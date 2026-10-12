export type RoomStatus = "lecture" | "available" | "reserved";
export type RoomType = "classroom" | "lab" | "seminar";
export type Building = "Block A" | "AI Labs" | "Seminar Wing";
export type Purpose =
  | "Group Discussion"
  | "Placement Prep"
  | "Self-Study"
  | "Faculty Lecture";
export type DurationMins = 30 | 60 | 120;
export type AppView = "grid" | "map" | "admin";

export interface MapRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Room {
  id: string;
  name: string;
  number: string;
  building: Building;
  type: RoomType;
  capacity: number;
  amenities: {
    ac: boolean;
    projector: boolean;
    wifi: boolean;
  };
  status: RoomStatus;
  occupiedUntil: number | null;
  occupantCount: number;
  purpose?: Purpose | string;
  map: MapRect;
}

export interface BookingDraft {
  roomId: string;
  purpose: Purpose;
  duration: DurationMins;
  headcount: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  roomIds?: string[];
}

export interface ToastItem {
  id: string;
  title: string;
  description: string;
}

export interface Filters {
  query: string;
  minCapacity: number;
  building: "all" | Building;
  statuses: RoomStatus[];
}
