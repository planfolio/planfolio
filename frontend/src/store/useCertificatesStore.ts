// src/store/useCertificateStore.ts
import { create } from "zustand";
import api from "../api/axiosInstance";

export type Qualification = {
  type: string;
  title: string;
  description: string;
  tags: string;
  start_date: string;
  end_date: string;
};

interface CertificateState {
  qualifications: Qualification[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  fetchQualifications: () => Promise<void>;
}

export const useCertificateStore = create<CertificateState>((set, get) => ({
  qualifications: [],
  isLoading: false,
  error: null,
  hasLoaded: false,
  fetchQualifications: async () => {
    const state = get();

    // 이미 로딩 중이거나 데이터가 있으면 호출하지 않음
    if (state.isLoading || state.qualifications.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/qualifications");
      set({ qualifications: res.data, isLoading: false, hasLoaded: true });
    } catch (err) {
      console.error(err);
      set({
        error: "자격증 데이터 불러오기 실패",
        isLoading: false,
        hasLoaded: true,
      });
    }
  },
}));
