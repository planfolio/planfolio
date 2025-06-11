import { create } from "zustand";
import api from "../api/axiosInstance";

export type CodingTest = {
  type: string;
  title: string;
  description: string;
  tags: string;
  start_date: string;
  end_date: string;
};

interface CodingTestState {
  tests: CodingTest[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  fetchTests: () => Promise<void>;
}

export const useCodingTestStore = create<CodingTestState>((set, get) => ({
  tests: [],
  isLoading: false,
  error: null,
  hasLoaded: false,
  fetchTests: async () => {
    const state = get();

    // 이미 로딩 중이거나 데이터가 있으면 호출하지 않음
    if (state.isLoading || state.tests.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/coding-tests");
      set({ tests: res.data, isLoading: false, hasLoaded: true });
    } catch (err) {
      console.error(err);
      set({
        error: "코딩테스트 데이터 불러오기 실패",
        isLoading: false,
        hasLoaded: true,
      });
    }
  },
}));
