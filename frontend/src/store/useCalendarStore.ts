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
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    if (get().isLoading) return; // 중복 방지

    set({ isLoading: true, error: null });
    try {
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        set({ events: [], isLoading: false });
        return;
      }
      const res = await api.get("/calendar");
      // 서버 응답이 배열 또는 { events: [...] } 형태 모두 대응
      set({ events: res.data.events || res.data || [], isLoading: false });
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
        events: [...state.events, res.data.event],
        isLoading: false,
      }));
    } catch (err) {
      console.error(err);
      set({ error: "일정 추가 실패", isLoading: false });
    }
  },
}));
