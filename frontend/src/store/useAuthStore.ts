import { create } from "zustand";
import api from "../api/axiosInstance";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signup: (data: {
    username: string;
    email: string;
    password: string;
    name: string;
    nickname: string;
  }) => Promise<void>;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>; // 내 정보 가져오기 (추가)
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  signup: async (data) => {
    await api.post("/signup", data);
  },

  login: async (data) => {
    // 쿠키 기반 인증: 토큰은 쿠키로 저장됨, body에는 없음
    await api.post("/login", {
      identifier: data.username,
      password: data.password,
    });
    // 로그인 성공 후 내 정보 요청으로 인증 상태 확인
    await useAuthStore.getState().fetchMe();
  },

  fetchMe: async () => {
    try {
      const res = await api.get("/me"); // 서버에 내 정보 요청
      if (res.data && res.data.user) {
        set({ user: res.data.user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    await api.post("/logout"); // 서버에서 쿠키 삭제 처리 (API가 있다면)
    set({ user: null, isAuthenticated: false });
  },
}));
