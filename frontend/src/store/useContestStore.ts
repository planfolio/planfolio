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
  hasLoaded: boolean; // 한 번 로드했는지 체크하는 플래그
  fetchContests: () => Promise<void>;
}

export const useContestStore = create<ContestState>((set, get) => ({
  contests: [],
  isLoading: false,
  error: null,
  hasLoaded: false,
  fetchContests: async () => {
    const state = get();

    // 이미 로딩 중이거나 데이터가 있으면 호출하지 않음
    if (state.isLoading || state.contests.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/contests");
      set({ contests: res.data, isLoading: false, hasLoaded: true });
    } catch (err) {
      set({
        error: "공모전 데이터 불러오기 실패",
        isLoading: false,
        hasLoaded: true,
      });
    }
  },
}));
