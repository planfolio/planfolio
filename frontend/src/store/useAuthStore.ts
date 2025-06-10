import { create } from "zustand";
import api from "../api/axiosInstance";

interface User {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  profile_image?: string | null;
  is_public?: boolean;
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
  fetchMe: () => Promise<void>;
  updateProfile: (
    data: Partial<Pick<User, "nickname" | "profile_image" | "is_public">>
  ) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  signup: async (data) => {
    await api.post("/signup", data);
  },

  login: async (data) => {
    await api.post("/login", {
      identifier: data.username,
      password: data.password,
    });
    await useAuthStore.getState().fetchMe();
  },

  fetchMe: async () => {
    try {
      const res = await api.get("/me");
      console.log("me 응답 :", res.data);
      if (res.data && res.data.user && res.data.user.username) {
        set({
          user: {
            id: res.data.user.id,
            username: res.data.user.username,
            email: res.data.user.email,
            nickname: res.data.user.nickname,
            profile_image: res.data.user.profile_image,
            is_public: res.data.user.is_public,
          },
          isAuthenticated: true,
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    await api.post("/logout");
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const res = await api.patch("/users/me", data);
      if (res.data && res.data.user) {
        set((state) => ({
          user: {
            ...state.user,
            ...res.data.user, // 최신 정보로 병합
          },
        }));
      }
    } catch (err) {
      console.error("프로필 수정 실패:", err);
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const res = await api.patch("/password", {
        oldPassword,
        newPassword,
      });
      // 성공 메시지 처리(알림 등)
      alert(res.data.message || "비밀번호가 변경되었습니다!");
    } catch (err: any) {
      // 에러 응답에 따라 메시지 처리
      if (err.response?.status === 403) {
        alert("현재 비밀번호가 올바르지 않습니다.");
      } else if (err.response?.status === 400) {
        alert("필드를 모두 입력해 주세요.");
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    }
  },
}));
