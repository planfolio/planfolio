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
  fetchQualifications: () => Promise<void>;
}

export const useCertificateStore = create<CertificateState>((set) => ({
  qualifications: [],
  isLoading: false,
  error: null,
  fetchQualifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/qualifications");
      set({ qualifications: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: "자격증 데이터 불러오기 실패", isLoading: false });
    }
  },
}));
