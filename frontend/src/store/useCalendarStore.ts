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
    // 이미 로딩 중이면 중복 호출 방지
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        set({ events: [], isLoading: false });
        return;
      }
      const res = await api.get("/calendar");
      set({ events: res.data.events || [], isLoading: false });
    } catch (err: any) {
      console.error("캘린더 데이터 로딩 실패:", err);
      // 401 인증 오류인 경우 events 초기화
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
