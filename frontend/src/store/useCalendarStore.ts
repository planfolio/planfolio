// store/useCalendarStore.ts
import { create } from "zustand";
import api from "../api/axiosInstance";

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  source: string;
  color?: string;
}

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (data: Omit<CalendarEvent, "id" | "source">) => Promise<void>;
  updateEvent: (
    id: number,
    data: Partial<Omit<CalendarEvent, "id" | "source">>
  ) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/calendar");
      if (res.status === 304 && res.data && Array.isArray(res.data)) {
        set({ events: res.data, isLoading: false });
        return;
      }
      set({ events: res.data.events || res.data || [], isLoading: false });
    } catch (err: any) {
      set({
        events: [],
        isLoading: false,
        error: "캘린더를 사용하려면 로그인하세요.",
      });
    }
  },

  addEvent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/calendar", data);
      set((state) => ({
        events: [...state.events, res.data.event],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: "일정 추가에 실패했습니다." });
    }
  },

  updateEvent: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/calendar/${id}`, data);
      set((state) => ({
        events: state.events.map((ev) =>
          ev.id === id ? { ...ev, ...res.data.event } : ev
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false, error: "일정 수정에 실패했습니다." });
    }
  },
}));
