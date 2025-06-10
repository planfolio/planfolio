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
  fetchTests: () => Promise<void>;
}

export const useCodingTestStore = create<CodingTestState>((set) => ({
  tests: [],
  isLoading: false,
  error: null,
  fetchTests: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/coding-tests");
      set({ tests: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "코딩테스트 데이터 불러오기 실패", isLoading: false });
    }
  },
}));
