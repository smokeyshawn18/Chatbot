import type { ChangeEvent, FormEvent } from "react";

export interface Routine {
  day: string;
  subject: string;
  start_time: string;
  end_time: string;
  room: string;
  instructor: string;
}

export interface Event {
  event_name: string;
  event_date: string;
  location: string;
  description: string;
}

export interface ChatRequest {
  message: string;
  username: string;
}

// Re-export React event types for convenience
export type { ChangeEvent, FormEvent };

export interface Message {
  text: string;
  sender: "user" | "bot";
}
