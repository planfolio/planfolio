import { create } from "zustand";
import api from "../api/axiosInstance";
import { useAuthStore } from "./useAuthStore"; // 인증 상태 구독

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
  deleteEvent: (id: number) => Promise<void>;
  clearEvents: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    if (get().isLoading) return; // 중복 방지

    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/calendar");
      // 서버 응답이 배열 또는 { events: [...] } 형태 모두 대응
      const events = res.data.events || res.data || [];
      set({ events, isLoading: false });
    } catch (err: any) {
      console.error("캘린더 데이터 로딩 실패:", err);
      if (err.response?.status === 401) {
        set({ events: [], isLoading: false, error: null });
      } else {
        set({ error: "일정 불러오기 실패", isLoading: false });
      }
    }
  },

  addEvent: async (event) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/calendar", event);
      set((state) => ({
        events: [...state.events, res.data.event], // 서버 응답 객체만 추가
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "일정 추가 실패", isLoading: false });
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
    } catch (err) {
      set({ isLoading: false, error: "일정 수정 실패" });
    }
  },

  deleteEvent: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/calendar/${id}`);
      set((state) => ({
        events: state.events.filter((ev) => ev.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({ isLoading: false, error: "일정 삭제 실패" });
    }
  },

  clearEvents: () => set({ events: [] }),
}));
