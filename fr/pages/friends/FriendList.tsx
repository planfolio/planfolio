// src/pages/friends/FriendList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriendStore } from '../../store/useFriendStore'; // useFriendStore 임포트
import { useAuthStore } from '../../store/useAuthStore';     // 로그인 상태 확인용 useAuthStore 임포트

const FriendList: React.FC = () => {
  // useFriendStore에서 필요한 상태와 함수들을 가져옵니다.
  const {
    friends,
    pendingRequests,
    fetchFriends,
    fetchPendingRequests,
    sendFriendRequest,
    handleFriendRequest,
    removeFriend, // <--- 추가: removeFriend 함수를 가져옵니다.
  } = useFriendStore();

  // useAuthStore에서 인증 상태를 가져옵니다.
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // 친구 추가를 위한 입력 상태
  const [newFriendUsername, setNewFriendUsername] = useState('');

  // 컴포넌트 마운트 시 또는 인증 상태 변경 시 친구 목록 및 요청 불러오기
  useEffect(() => {
    // 로그인되지 않았다면 로그인 페이지로 리다이렉트 (임시 로그인 활성화 시에는 해당 안됨)
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchFriends();
    fetchPendingRequests();
  }, [isAuthenticated, fetchFriends, fetchPendingRequests, navigate]);

  // 친구 요청 보내기 핸들러
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 방지
    if (!newFriendUsername.trim()) {
      alert('친구 아이디를 입력해주세요.');
      return;
    }
    try {
      await sendFriendRequest(newFriendUsername);
      setNewFriendUsername(''); // 요청 성공 시 입력창 초기화
      // 성공 메시지는 useFriendStore에서 alert으로 처리됨
    } catch (error) {
      // 에러 메시지는 useFriendStore에서 alert으로 처리됨
    }
  };

  // 친구 요청 수락 핸들러 (handleFriendRequest 사용)
  const handleAcceptRequest = async (senderUsername: string) => {
    try {
      await handleFriendRequest(senderUsername, 'accept');
      // 성공 시 useFriendStore에서 alert 및 목록 새로고침 처리됨
    } catch (error) {
      // 에러 처리 (useFriendStore에서 이미 alert 처리)
      console.error('친구 요청 수락 실패:', error);
    }
  };

  // 친구 요청 거절 핸들러 (handleFriendRequest 사용)
  const handleDeclineRequest = async (senderUsername: string) => {
    try {
      await handleFriendRequest(senderUsername, 'reject');
      // 성공 시 useFriendStore에서 alert 및 목록 새로고침 처리됨
    } catch (error) {
      // 에러 처리 (useFriendStore에서 이미 alert 처리)
      console.error('친구 요청 거절 실패:', error);
    }
  };

  // 로그인되지 않은 경우 (실제 로그인 기능 활성화 시)
  if (!isAuthenticated) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 select-none">
        <div className="p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">로그인이 필요합니다.</h2>
          <p className="text-gray-600 mb-6">친구 목록을 보려면 먼저 로그인해주세요.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </section>
    );
  }

  // 로그인 상태일 때 친구 관리 UI
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center py-10 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 select-none">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 px-8 py-10">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center tracking-tight">
          친구 관리
        </h1>

        {/* 친구 추가 섹션 */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-gray-800">새로운 친구 추가</h2>
          <form onSubmit={handleSendRequest} className="flex gap-3">
            <input
              type="text"
              placeholder="친구 아이디 입력"
              value={newFriendUsername}
              onChange={(e) => setNewFriendUsername(e.target.value)}
              className="flex-grow px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition shadow-md"
            >
              친구 요청
            </button>
          </form>
        </div>

        {/* 받은 친구 요청 섹션 */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-gray-800">받은 친구 요청 ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-600 text-center py-4">받은 친구 요청이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {pendingRequests.map((request) => (
                <li key={request.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    {/* 프로필 이미지 플레이스홀더 */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                      {request.user.nickname ? request.user.nickname[0] : 'U'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">{request.user.nickname}</span>
                      <span className="text-sm text-gray-500 ml-2">@{request.user.username}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.user.username)}
                      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition text-sm"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.user.username)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      거절
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 내 친구 목록 섹션 */}
        <div className="p-6 bg-gray-50 rounded-xl shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-gray-800">내 친구 목록 ({friends.length})</h2>
          {friends.length === 0 ? (
            <p className="text-gray-600 text-center py-4">아직 친구가 없습니다. 새로운 친구를 추가해보세요!</p>
          ) : (
            <ul className="space-y-3">
              {friends.map((friend) => (
                <li key={friend.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    {/* 프로필 이미지 (실제 이미지 URL 또는 플레이스홀더) */}
                    {friend.profile_image ? (
                      <img src={friend.profile_image} alt={friend.nickname} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
                        {friend.nickname[0]}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-gray-800">{friend.nickname}</span>
                      <span className="text-sm text-gray-500 ml-2">@{friend.username}</span>
                    </div>
                  </div>
                  <div className="flex gap-2"> {/* 버튼들을 감싸는 div 추가 */}
                    <button
                      onClick={() => navigate(`/friends/${friend.username}/schedule`)} // 친구 캘린더 페이지로 이동
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition text-sm shadow-md"
                    >
                      캘린더 보기
                    </button>
                    {/* 친구 삭제 버튼 추가 */}
                    <button
                      onClick={() => removeFriend(friend.username)} // useFriendStore의 removeFriend는 username을 인자로 받습니다.
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition text-sm shadow-md"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default FriendList;