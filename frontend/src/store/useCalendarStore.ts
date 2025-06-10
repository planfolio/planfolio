import { create } from "zustand";
import api from "../api/axiosInstance"; // 경로는 실제 위치에 맞게 조정

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  source: string; // "contest" | "certificate" | "codingtest" | "manual"
}

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, "id">) => Promise<void>;
  // 필요에 따라 updateEvent, deleteEvent 등 추가 가능
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/calendar");
      set({ events: res.data.events, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "일정 불러오기 실패", isLoading: false });
    }
  },

  addEvent: async (event) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/calendar", event);
      set((state) => ({
        events: [...state.events, res.data.event],
        isLoading: false,
      }));
    } catch (err) {
      console.error(err);
      set({ error: "일정 추가 실패", isLoading: false });
    }
  },
}));
