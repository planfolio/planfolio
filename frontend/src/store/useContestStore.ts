import { create } from "zustand";
import api from "../api/axiosInstance"; // 경로는 실제 위치에 맞게 조정

export type Contest = {
  type: string;
  title: string;
  description: string;
  tags: string;
  start_date: string;
  end_date: string;
};

interface ContestState {
  contests: Contest[];
  isLoading: boolean;
  error: string | null;
  fetchContests: () => Promise<void>;
}

export const useContestStore = create<ContestState>((set) => ({
  contests: [],
  isLoading: false,
  error: null,
  fetchContests: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/contests");
      set({ contests: res.data, isLoading: false });
    } catch (err) {
      set({ error: "공모전 데이터 불러오기 실패", isLoading: false });
      // 필요시 console.error(err);
    }
  },
}));
