// src/store/useAuthStore.ts
import { create } from "zustand";
import api from "../api/axiosInstance"; // axiosInstance.ts에서 설정된 인스턴스

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
  // 새로 추가할 함수들의 타입 정의
  findUsername: (email: string) => Promise<void>; // 아이디 찾기
  requestPasswordReset: (identifier: string) => Promise<void>; // 비밀번호 재설정 요청 (이메일 전송)
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  signup: async (data) => {
    try {
      await api.post("/signup", data);
    } catch (err: any) {
      console.error("회원가입 실패:", err.response?.data || err.message);
      // 필요하다면 특정 에러 코드에 대한 사용자 피드백 추가
      throw err; // 에러를 호출자에게 다시 던져서 처리하도록 함
    }
  },

  login: async (data) => {
    try {
      await api.post("/login", {
        identifier: data.username,
        password: data.password,
      });
      await useAuthStore.getState().fetchMe(); // 로그인 성공 후 사용자 정보 가져오기
    } catch (err: any) {
      console.error("로그인 실패:", err.response?.data || err.message);
      // 로그인 실패 시 사용자에게 보여줄 메시지를 더욱 구체화할 수 있습니다.
      throw err; // 에러를 호출자에게 다시 던져서 처리하도록 함
    }
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
        // user 데이터가 없거나 유효하지 않은 경우
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      // fetchMe 실패 시 (예: 토큰 만료, 서버 에러) 인증 상태 초기화
      console.error("fetchMe 실패 (인증 상태 초기화):", err);
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/logout");
      set({ user: null, isAuthenticated: false });
    } catch (err) {
      console.error("로그아웃 실패:", err);
      // 로그아웃 실패 시에도 UI 상태는 변경하는 것이 일반적
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.patch("/users/me", data);
      if (res.data && res.data.user) {
        set((state) => ({
          user: {
            ...state.user,
            ...res.data.user, // 최신 정보로 병합하여 사용자 상태 업데이트
          },
        }));
        alert("프로필이 성공적으로 수정되었습니다!"); // 성공 알림 추가
      }
    } catch (err: any) {
      console.error("프로필 수정 실패:", err.response?.data || err.message);
      alert(err.response?.data?.message || "프로필 수정에 실패했습니다."); // 실패 알림
      throw err; // 에러를 호출자에게 다시 던져서 처리하도록 함
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const res = await api.patch("/password", {
        oldPassword,
        newPassword,
      });
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
      console.error("비밀번호 변경 실패:", err.response?.data || err.message);
      throw err; // 에러를 호출자에게 다시 던져서 처리하도록 함
    }
  },

  // --- 새로 추가될 함수들 ---

  findUsername: async (email: string) => {
    try {
      const response = await api.post("/find-username", { email });
      console.log("아이디 찾기 요청 성공:", response.data);
      // 백엔드에서 반환하는 성공 메시지를 필요에 따라 처리할 수 있습니다.
      alert(response.data.message || "아이디 정보를 이메일로 전송했습니다.");
    } catch (error: any) {
      console.error("아이디 찾기 API 호출 실패:", error.response?.data || error.message);
      // 백엔드에서 보낸 에러 메시지를 사용자에게 보여주는 것이 좋습니다.
      alert(error.response?.data?.message || "아이디를 찾을 수 없습니다. 이메일을 다시 확인해주세요.");
      throw error; // 에러를 상위 컴포넌트로 전달
    }
  },

  requestPasswordReset: async (identifier: string) => {
    try {
      const response = await api.post("/request-password-reset", { identifier });
      console.log("비밀번호 재설정 요청 성공:", response.data);
      // 백엔드에서 반환하는 성공 메시지를 필요에 따라 처리할 수 있습니다.
      alert(response.data.message || "비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    } catch (error: any) {
      console.error("비밀번호 재설정 요청 API 호출 실패:", error.response?.data || error.message);
      // 백엔드에서 보낸 에러 메시지를 사용자에게 보여주는 것이 좋습니다.
      alert(error.response?.data?.message || "비밀번호 재설정 요청에 실패했습니다. 아이디 또는 이메일을 다시 확인해주세요.");
      throw error; // 에러를 상위 컴포넌트로 전달
    }
  },
}));

// // src/store/useAuthStore.ts
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import api from '../api/axiosInstance'; // <--- 이 줄이 없었다면 꼭 추가해주세요! Axios 인스턴스 경로

// // 사용자 정보 인터페이스 (실제 백엔드 응답과 일치해야 합니다)
// interface User {
//   id: number;
//   username: string;
//   nickname: string;
//   email: string; // MyPage에서 user.email을 사용하므로 추가
//   profile_image?: string | null; // 프로필 이미지 URL
//   is_public?: boolean; // 필요하다면 추가
//   name?: string; // MyPage에서 user.name을 사용하므로 추가
// }

// interface AuthState {
//   isAuthenticated: boolean;
//   user: User | null;
//   authToken: string | null; // JWT 토큰을 저장할 필드

//   login: (token: string, userData: User) => void;
//   logout: () => void;
//   // checkAuth: () => void; // (이전 코드에 있었다면) 앱 로드 시 로컬 스토리지 확인 함수

//   // --- 새로 추가될 액션 함수들의 타입 정의 ---
//   fetchMe: () => Promise<void>; // <--- 여기에 fetchMe 함수의 타입을 추가합니다!
//   signup: (data: { // MyPage에서 직접 호출되진 않지만 useAuthStore에 있으므로 타입 추가
//     username: string;
//     email: string;
//     password: string;
//     name: string;
//     nickname: string;
//   }) => Promise<void>;
//   // login은 이미 AuthState에 있지만, 실제 login 구현은 이전 대화에서 변경된 AuthStore 방식을 따르므로
//   // 여기서는 타입만 유지하고 구현체는 아래에 맞게 추가할 것임.
//   // temporaryLogin과 clearTemporaryLogin도 마찬가지.
//   findUsername: (email: string) => Promise<void>;
//   requestPasswordReset: (identifier: string) => Promise<void>;
//   updateProfile: (data: Partial<Pick<User, "nickname" | "profile_image" | "is_public">>) => Promise<void>;
//   changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
// }

// export const useAuthStore = create<AuthState>()( // AuthState만 사용 (기존 구조 유지)
//   persist(
//     (set, get) => ({ // <--- get 함수를 사용하기 위해 두 번째 인자로 'get'을 추가합니다.
//       isAuthenticated: false,
//       user: null,
//       authToken: null,

//       // 실제 로그인 처리 함수 (이전 대화에서 업데이트된 방식으로 반영)
//       login: async (data: { username: string; password: string }) => {
//         try {
//           const res = await api.post("/login", {
//             identifier: data.username,
//             password: data.password,
//           });
//           // 백엔드에서 토큰과 사용자 정보를 응답한다고 가정 (res.data.token, res.data.user)
//           if (res.data.token && res.data.user) {
//              set({
//                  isAuthenticated: true,
//                  user: res.data.user,
//                  authToken: res.data.token,
//              });
//              // 로그인 성공 후 fetchMe를 호출하여 사용자 세부 정보를 다시 가져옵니다.
//              // 이 로직은 AuthButtons의 로그인 성공 후 navigate('/') 직전에 호출되어야 합니다.
//              // 또는 여기에 직접 await get().fetchMe(); 를 추가할 수 있습니다.
//              // 여기서는 간결하게 set만 하고, AuthButtons 같은 곳에서 fetchMe를 호출하도록 합니다.
//           } else {
//               throw new Error("로그인 응답에 사용자 정보 또는 토큰이 없습니다.");
//           }
//         } catch (err: any) {
//           console.error("로그인 API 호출 실패:", err.response?.data || err.message);
//           throw err;
//         }
//       },

//       // 실제 로그아웃 처리 함수
//       logout: async () => { // <--- async 키워드를 추가합니다.
//         try {
//           await api.post("/logout"); // <--- 로그아웃 API 호출
//           set({
//             isAuthenticated: false,
//             user: null,
//             authToken: null,
//           });
//         } catch (err) {
//           console.error("로그아웃 실패:", err);
//           // 로그아웃 실패 시에도 UI 상태는 변경하는 것이 일반적
//           set({ isAuthenticated: false, user: null, authToken: null });
//         }
//       },

//       // --- 새로 추가될 fetchMe 함수 구현 ---
//       fetchMe: async () => {
//         try {
//           const currentToken = get().authToken; // <--- get()을 통해 현재 스토어의 authToken을 가져옵니다.
//           if (!currentToken) {
//             // 토큰이 없으면 로그인 상태가 아님
//             set({ user: null, isAuthenticated: false, authToken: null });
//             return;
//           }

//           const res = await api.get('/me', { // 백엔드의 사용자 정보 API 엔드포인트
//             headers: {
//               Authorization: `Bearer ${currentToken}`, // 토큰을 Authorization 헤더에 포함
//             },
//           });

//           if (res.data && res.data.user) {
//             set({
//               user: res.data.user,
//               isAuthenticated: true,
//               authToken: currentToken, // 토큰은 유지
//             });
//           } else {
//             // API 응답에 user 정보가 없거나 유효하지 않으면 로그인 상태 해제
//             set({ user: null, isAuthenticated: false, authToken: null });
//           }
//         } catch (error) {
//           console.error("fetchMe 실패 (인증 상태 초기화):", error);
//           // API 호출 실패 시 로그인 상태 해제
//           set({ user: null, isAuthenticated: false, authToken: null });
//         }
//       },

//       // --- 개발용 임시 로그인 함수 ---
//       temporaryLogin: () => {
//         const dummyUser: User = {
//           id: 999, // 임시 사용자를 위한 고유 ID (충돌 방지)
//           username: 'temp_user_001',
//           nickname: '임시사용자',
//           email: 'temp@example.com', // 임시 사용자 이메일 추가
//           profile_image: null,
//           name: '임시 이름', // MyPage에서 user.name을 사용하므로 추가
//         };
//         const tempToken = 'mock-jwt-token-for-development-only';

//         set({
//           isAuthenticated: true,
//           user: dummyUser,
//           authToken: tempToken, // 임시 토큰도 저장하도록 설정
//         });

//         alert('✨ 임시 로그인 되었습니다! 개발용 계정으로 친구 기능을 테스트할 수 있습니다.');
//       },

//       // 임시 로그인 해제 함수
//       clearTemporaryLogin: () => {
//         set({
//           isAuthenticated: false,
//           user: null,
//           authToken: null,
//         });
//         alert('❌ 임시 로그인이 해제되었습니다.');
//       },

//       // --- 기존의 다른 액션 함수들 (MyPage에서 직접 호출되지 않지만, AuthState에 정의되어 있어야 함) ---
//       signup: async (data) => {
//         try {
//           await api.post("/signup", data);
//         } catch (err: any) {
//           console.error("회원가입 실패:", err.response?.data || err.message);
//           throw err;
//         }
//       },
//       findUsername: async (email: string) => {
//         try {
//           const response = await api.post("/find-username", { email });
//           console.log("아이디 찾기 요청 성공:", response.data);
//           alert(response.data.message || "아이디 정보를 이메일로 전송했습니다.");
//         } catch (error: any) {
//           console.error("아이디 찾기 API 호출 실패:", error.response?.data || error.message);
//           alert(error.response?.data?.message || "아이디를 찾을 수 없습니다. 이메일을 다시 확인해주세요.");
//           throw error;
//         }
//       },
//       requestPasswordReset: async (identifier: string) => {
//         try {
//           const response = await api.post("/request-password-reset", { identifier });
//           console.log("비밀번호 재설정 요청 성공:", response.data);
//           alert(response.data.message || "비밀번호 재설정 링크가 이메일로 전송되었습니다.");
//         } catch (error: any) {
//           console.error("비밀번호 재설정 요청 API 호출 실패:", error.response?.data || error.message);
//           alert(error.response?.data?.message || "비밀번호 재설정 요청에 실패했습니다. 아이디 또는 이메일을 다시 확인해주세요.");
//           throw error;
//         }
//       },
//       updateProfile: async (data) => {
//         try {
//           const res = await api.patch("/users/me", data);
//           if (res.data && res.data.user) {
//             set((state) => ({
//               user: {
//                 ...state.user,
//                 ...res.data.user,
//               },
//             }));
//             alert(res.data.message || "프로필이 성공적으로 수정되었습니다!");
//           }
//         } catch (err: any) {
//           console.error("프로필 수정 실패:", err.response?.data || err.message);
//           alert(err.response?.data?.message || "프로필 수정에 실패했습니다.");
//           throw err;
//         }
//       },
//       changePassword: async (oldPassword: string, newPassword: string) => {
//         try {
//           const res = await api.patch("/password", {
//             oldPassword,
//             newPassword,
//           });
//           alert(res.data.message || "비밀번호가 변경되었습니다!");
//         } catch (err: any) {
//           if (err.response?.status === 403) {
//             alert("현재 비밀번호가 올바르지 않습니다.");
//           } else if (err.response?.status === 400) {
//             alert("필드를 모두 입력해 주세요.");
//           } else {
//             alert("비밀번호 변경에 실패했습니다.");
//           }
//           console.error("비밀번호 변경 실패:", err.response?.data || err.message);
//           throw err;
//         }
//       },
//     }),
//     {
//       name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
//       storage: createJSONStorage(() => localStorage), // 사용할 스토리지 (localStorage)
//       // `authToken`, `isAuthenticated`, `user`만 영속화하도록 설정
//       partialize: (state) => ({ authToken: state.authToken, isAuthenticated: state.isAuthenticated, user: state.user }),
//     }
//   )
// );