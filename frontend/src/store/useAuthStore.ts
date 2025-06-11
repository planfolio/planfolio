// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api/axiosInstance";

interface User {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  profile_image?: string | null;
  is_public?: boolean;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authToken: string | null;

  // 인증 관련
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  
  // 회원가입
  signup: (data: {
    username: string;
    email: string;
    password: string;
    name: string;
    nickname: string;
  }) => Promise<void>;

  // 프로필 관리
  updateProfile: (
    data: Partial<Pick<User, "nickname" | "profile_image" | "is_public">>
  ) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;

  // 계정 찾기/복구
  findUsername: (email: string) => Promise<void>;
  requestPasswordReset: (identifier: string) => Promise<void>;

  // 개발용 임시 로그인
  temporaryLogin: () => void;
  clearTemporaryLogin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authToken: null,

      // 회원가입
      signup: async (data) => {
        try {
          await api.post("/signup", data);
        } catch (err: any) {
          console.error("회원가입 실패:", err.response?.data || err.message);
          throw err;
        }
      },

      // 로그인 (쿠키 기반)
      login: async (data) => {
        try {
          const res = await api.post("/login", {
            identifier: data.username,
            password: data.password,
          });

          if (res.data.message === "Login successful") {
            // 로그인 성공 후 사용자 정보 가져오기
            await get().fetchMe();
          } else {
            throw new Error("로그인 실패");
          }
        } catch (err: any) {
          console.error("로그인 실패:", err.response?.data || err.message);
          throw err;
        }
      },

      // 로그아웃 (프론트엔드에서만 처리)
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          authToken: null,
        });

        // 쿠키 삭제
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

        console.log("로그아웃 완료");
      },

      // 사용자 정보 조회
      fetchMe: async () => {
        try {
          const res = await api.get("/me");
          console.log("me 응답:", res.data);
          
          if (res.data && res.data.user && res.data.user.username) {
            set({
              user: {
                id: res.data.user.id,
                username: res.data.user.username,
                email: res.data.user.email,
                nickname: res.data.user.nickname,
                profile_image: res.data.user.profile_image,
                is_public: res.data.user.is_public,
                name: res.data.user.name,
              },
              isAuthenticated: true,
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (err) {
          console.error("fetchMe 실패:", err);
          set({ user: null, isAuthenticated: false });
        }
      },

      // 프로필 수정
      updateProfile: async (data) => {
        try {
          const res = await api.patch("/me", data);
          if (res.data && res.data.profile) {
            set((state) => ({
              user: {
                ...state.user!,
                ...res.data.profile,
              },
            }));
            alert("프로필이 성공적으로 수정되었습니다!");
          }
        } catch (err: any) {
          console.error("프로필 수정 실패:", err.response?.data || err.message);
          alert(err.response?.data?.message || "프로필 수정에 실패했습니다.");
          throw err;
        }
      },

      // 비밀번호 변경
      changePassword: async (oldPassword: string, newPassword: string) => {
        try {
          const res = await api.patch("/password", {
            oldPassword,
            newPassword,
          });
          alert(res.data.message || "비밀번호가 변경되었습니다!");
        } catch (err: any) {
          if (err.response?.status === 401) {
            alert("현재 비밀번호가 올바르지 않습니다.");
          } else if (err.response?.status === 400) {
            alert("필드를 모두 입력해 주세요.");
          } else {
            alert("비밀번호 변경에 실패했습니다.");
          }
          console.error("비밀번호 변경 실패:", err.response?.data || err.message);
          throw err;
        }
      },

      // 아이디 찾기
      findUsername: async (email: string) => {
        try {
          const response = await api.post("/find-username", { email });
          console.log("아이디 찾기 요청 성공:", response.data);
          alert(response.data.message || "아이디 정보를 이메일로 전송했습니다.");
        } catch (error: any) {
          console.error("아이디 찾기 실패:", error.response?.data || error.message);
          alert(error.response?.data?.message || "아이디를 찾을 수 없습니다.");
          throw error;
        }
      },

      // 비밀번호 재설정 요청
      requestPasswordReset: async (identifier: string) => {
        try {
          const response = await api.post("/request-password-reset", { identifier });
          console.log("비밀번호 재설정 요청 성공:", response.data);
          alert(response.data.message || "비밀번호 재설정 링크가 이메일로 전송되었습니다.");
        } catch (error: any) {
          console.error("비밀번호 재설정 요청 실패:", error.response?.data || error.message);
          alert(error.response?.data?.message || "비밀번호 재설정 요청에 실패했습니다.");
          throw error;
        }
      },

      // 개발용 임시 로그인
      temporaryLogin: () => {
        const dummyUser: User = {
          id: 999,
          username: "temp_user_001",
          nickname: "임시사용자",
          email: "temp@example.com",
          profile_image: null,
          name: "임시 이름",
        };
        const tempToken = "mock-jwt-token-for-development-only";

        set({
          isAuthenticated: true,
          user: dummyUser,
          authToken: tempToken,
        });

        alert("✨ 임시 로그인 되었습니다! 개발용 계정으로 친구 기능을 테스트할 수 있습니다.");
      },

      // 임시 로그인 해제
      clearTemporaryLogin: () => {
        set({
          isAuthenticated: false,
          user: null,
          authToken: null,
        });
        alert("❌ 임시 로그인이 해제되었습니다.");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);