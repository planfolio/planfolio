// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../../store/useAuthStore";
// import EditProfileModal from "../Modal/EditProfileModal";
// import ChangePasswordModal from "../Modal/ChangePasswordModal";

// const MyPage: React.FC = () => {
//   const user = useAuthStore((state) => state.user);
//   const fetchMe = useAuthStore((state) => state.fetchMe);

//   // 모달/폼 상태
//   const [editOpen, setEditOpen] = useState(false);
//   const [pwOpen, setPwOpen] = useState(false);

//   useEffect(() => {
//     if (!user) fetchMe();
//   }, [user, fetchMe]);

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
//         <span className="text-4xl mb-4 animate-bounce">🔒</span>
//         <p className="text-lg font-semibold">로그인이 필요합니다.</p>
//       </div>
//     );
//   }

//   return (
//     <section className="max-w-2xl mx-auto mt-14 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-10 flex flex-col items-center gap-10">
//       {/* 프로필 영역 */}
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 flex items-center justify-center shadow-xl overflow-hidden">
//           {user.profile_image ? (
//             <img
//               src={user.profile_image}
//               alt="프로필"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <span className="text-5xl text-white">👤</span>
//           )}
//         </div>
//         <div className="text-2xl font-extrabold text-gray-900 mt-2">
//           {user.nickname || user.username}
//         </div>
//         <div className="text-sm text-gray-500">{user.email}</div>
//       </div>

//       {/* 정보 카드 */}
//       <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <div className="bg-orange-50 rounded-2xl p-5 flex flex-col items-center shadow">
//           <span className="text-orange-400 text-2xl mb-2">🪪</span>
//           <div className="text-gray-800 font-semibold">이름</div>
//           <div className="text-gray-500">{user.name || "-"}</div>
//         </div>
//         <div className="bg-pink-50 rounded-2xl p-5 flex flex-col items-center shadow">
//           <span className="text-pink-400 text-2xl mb-2">🎉</span>
//           <div className="text-gray-800 font-semibold">닉네임</div>
//           <div className="text-gray-500">{user.nickname || "-"}</div>
//         </div>
//       </div>

//       {/* 계정 관리 버튼 */}
//       <div className="w-full flex flex-col sm:flex-row gap-4 mt-8">
//         <button
//           className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition"
//           onClick={() => setEditOpen(true)}
//         >
//           내 정보 수정
//         </button>
//         <button
//           className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold bg-white/70 hover:bg-gray-50 shadow transition"
//           onClick={() => setPwOpen(true)}
//         >
//           비밀번호 변경
//         </button>
//       </div>

//       {/* 내 정보 수정 모달/폼 */}
//       {editOpen && (
//         <EditProfileModal user={user} onClose={() => setEditOpen(false)} />
//       )}

//       {/* 비밀번호 변경 모달/폼 */}
//       {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}
//     </section>
//   );
// };

// export default MyPage;

// src/components/Mypage/MyPage.tsx

import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import EditProfileModal from "../Modal/EditProfileModal";
import ChangePasswordModal from "../Modal/ChangePasswordModal";

const MyPage: React.FC = () => {
  const { user, fetchMe, isAuthenticated } = useAuthStore();

  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
        fetchMe();
    }
  }, [isAuthenticated, user, fetchMe]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <span className="text-4xl mb-4 animate-bounce">🔒</span>
        <p className="text-lg font-semibold">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto mt-14 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-10 flex flex-col items-center gap-10">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 flex items-center justify-center shadow-xl overflow-hidden">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-white">👤</span>
          )}
        </div>
        <div className="text-2xl font-extrabold text-gray-900 mt-2">
          {user.nickname || user.username}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>

      {/* 정보 카드 */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-orange-50 rounded-2xl p-5 flex flex-col items-center shadow">
          <span className="text-orange-400 text-2xl mb-2">🪪</span>
          <div className="text-gray-800 font-semibold">이름</div>
          <div className="text-gray-500">{user.name || "-"}</div>
        </div>
        <div className="bg-pink-50 rounded-2xl p-5 flex flex-col items-center shadow">
          <span className="text-pink-400 text-2xl mb-2">🎉</span>
          <div className="text-gray-800 font-semibold">닉네임</div>
          <div className="text-gray-500">{user.nickname || "-"}</div>
        </div>
      </div>

      {/* 계정 관리 버튼 */}
      <div className="w-full flex flex-col sm:flex-row gap-4 mt-8">
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition"
          onClick={() => setEditOpen(true)}
        >
          내 정보 수정
        </button>
        <button
          className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold bg-white/70 hover:bg-gray-50 shadow transition"
          onClick={() => setPwOpen(true)}
        >
          비밀번호 변경
        </button>
      </div>

      {/* 내 정보 수정 모달/폼 */}
      {editOpen && (
        <EditProfileModal user={user} onClose={() => setEditOpen(false)} />
      )}

      {/* 비밀번호 변경 모달/폼 */}
      {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}
      {/* 주석 내용 수정: 비밀번호 변경 모달 컴포넌트 */} {/* <-- 이 주석을 이렇게 분리합니다. */}
    </section>
  );
};

export default MyPage;