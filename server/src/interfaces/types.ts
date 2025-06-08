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

export interface ExamRoutine {
  id: number;
  exam_name: string;
  semester: string;
  subject: string;
  exam_date: string; // Use string for DATE (e.g., '2025-06-15')
  start_time: string; // Use string for TIME (e.g., '10:00:00')
  end_time: string;
  room_no?: string | null;
  invigilator?: string | null;
}
