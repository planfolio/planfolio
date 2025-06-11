import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import EditProfileModal from "../Modal/EditProfileModal";
import ChangePasswordModal from "../Modal/ChangePasswordModal";

const MyPage: React.FC = () => {
  const { user, fetchMe, isAuthenticated, deleteAccount } = useAuthStore();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchMe();
    }
  }, [isAuthenticated, user, fetchMe]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/"); // 홈페이지로 리다이렉트
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
    }
  };

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
      <div className="w-full flex flex-col gap-4 mt-8">
        {/* 주요 기능 버튼들 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            onClick={() => setEditOpen(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <span>✏️</span>
              <span>내 정보 수정</span>
            </div>
          </button>
          <button
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            onClick={() => setPwOpen(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🔐</span>
              <span>비밀번호 변경</span>
            </div>
          </button>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* 위험한 작업 영역 */}
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="text-center mb-3">
            <h4 className="text-sm font-medium text-red-700 mb-1">위험 영역</h4>
            <p className="text-xs text-red-600">신중하게 결정해주세요</p>
          </div>
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
            onClick={() => setDeleteModalOpen(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>회원 탈퇴</span>
            </div>
          </button>
        </div>
      </div>

      {/* 내 정보 수정 모달 */}
      {editOpen && (
        <EditProfileModal user={user} onClose={() => setEditOpen(false)} />
      )}

      {/* 비밀번호 변경 모달 */}
      {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}

      {/* 회원 탈퇴 확인 모달 */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <span className="text-6xl">⚠️</span>
              <h3 className="text-xl font-bold text-gray-900">회원 탈퇴</h3>
              <div className="text-center text-gray-600">
                <p className="mb-2">정말로 탈퇴하시겠습니까?</p>
                <p className="text-sm text-red-500">
                  탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  onClick={handleDeleteAccount}
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyPage;
