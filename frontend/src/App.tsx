// import React from "react";
// import AppRoutes from "./routes/routes";
// import { Header } from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";

// const App: React.FC = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <AppRoutes />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default App;

import React, { useEffect } from "react";
import AppRoutes from "./routes/routes"; // 변경 없음: AppRoutes는 routes/routes.tsx에서 가져옴
import { Header } from "./components/Header/Header"; // 변경 없음
import Footer from "./components/Footer/Footer";     // 변경 없음
import { useAuthStore } from "./store/useAuthStore"; // useAuthStore 임포트

const App: React.FC = () => {
  // useAuthStore에서 임시 로그인 관련 함수와 상태를 가져옵니다.
  const { temporaryLogin, clearTemporaryLogin, isAuthenticated } = useAuthStore();

  // 앱이 마운트될 때 (한 번만) 로컬 스토리지에 저장된 인증 상태를 기반으로 fetchMe를 시도할 수 있습니다.
  // 이 부분은 persist 미들웨어와 fetchMe의 로직에 따라 선택적으로 추가합니다.
  // persist 미들웨어가 상태를 자동으로 복원하므로, 별도의 `fetchMe` 호출이 불필요할 수도 있습니다.
  // 만약 토큰 유효성 검증을 위한 `fetchMe`가 필요하다면, `useAuthStore`의 `onRehydrateStorage`를 활용하거나,
  // 아니면 여기에 `useEffect`를 추가하여 `isAuthenticated`가 true일 때 `fetchMe`를 호출합니다.
  // 예시:
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // 토큰이 유효한지 서버에 확인하는 fetchMe 로직
  //     useAuthStore.getState().fetchMe();
  //   }
  // }, [isAuthenticated]); // 인증 상태가 변경될 때마다 실행

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />

      {/* 개발 환경에서만 보이는 임시 로그인/로그아웃 버튼 */}
      {/* process.env.NODE_ENV는 일반적으로 'development' 또는 'production' 값을 가집니다. */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg flex gap-2">
          {!isAuthenticated ? (
            <button
              onClick={temporaryLogin}
              className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition"
            >
              임시 로그인 (개발용)
            </button>
          ) : (
            <button
              onClick={clearTemporaryLogin}
              className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition"
            >
              임시 로그아웃 (개발용)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;