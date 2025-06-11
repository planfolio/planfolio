import { create } from "zustand";
import api from "../api/axiosInstance";
import { deleteCookie } from "../utils/deleteCookie";

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
  hasHydrated: boolean; // ← 인증 복원 완료 플래그
  signup: (data: {
    username: string;
    email: string;
    password: string;
    name: string;
    nickname: string;
  }) => Promise<void>;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateProfile: (
    data: Partial<Pick<User, "nickname" | "profile_image" | "is_public">>
  ) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasHydrated: false, // 초기 상태는 false

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

  logout: async () => {
    // 서버에도 로그아웃 요청이 필요하다면 추가
    // await api.post("/logout");
    // 쿠키 삭제
    deleteCookie("token"); // 쿠키 이름이 'token'일 때
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const res = await api.get("/me");
      if (res.data?.user?.username) {
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
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ hasHydrated: true }); // 복원 시도 끝
    }
  },

  logout: async () => {
    // 쿠키 삭제 (token 쿠키 이름이 맞는지 확인!)
    deleteCookie("token");
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const res = await api.patch("/users/me", data);
      if (res.data?.user) {
        set((state) => ({
          user: { ...state.user, ...res.data.user },
        }));
      }
    } catch (err) {
      console.error("프로필 수정 실패:", err);
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    try {
      const res = await api.patch("/password", { oldPassword, newPassword });
      alert(res.data.message || "비밀번호가 변경되었습니다!");
    } catch (err: any) {
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
