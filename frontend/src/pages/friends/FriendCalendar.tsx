// src/pages/friends/FriendCalendar.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFriendStore } from '../../store/useFriendStore'; // useFriendStore 임포트
import { useAuthStore } from '../../store/useAuthStore';     // 로그인 상태 확인용 useAuthStore 임포트
import api from '../../api/axiosInstance'; // 친구 정보 조회를 위해 axiosInstance도 필요할 수 있음 (현재 /users/:id 호출에 사용)

// 캘린더 일정 데이터의 타입 정의
interface FriendCalendarEntry {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  // 필요하다면 다른 캘린더 관련 필드 추가 (예: description, location 등)
}

// 친구 정보 타입 (간단하게)
interface FriendInfo {
  id: number;
  username: string;
  nickname: string;
  profile_image: string | null;
}

const FriendCalendar: React.FC = () => {
  // URL 파라미터에서 username을 가져옵니다.
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  // useFriendStore에서 캘린더 가져오기 함수를 가져옵니다.
  const { getFriendCalendar } = useFriendStore();
  // useAuthStore에서 인증 상태를 가져옵니다.
  const { isAuthenticated, user } = useAuthStore(); // 현재 로그인 사용자 정보도 필요할 수 있음




  // 상태 관리
  const [friendCalendarEvents, setFriendCalendarEvents] = useState<FriendCalendarEntry[]>([]);
  const [friendInfo, setFriendInfo] = useState<FriendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 로그인되지 않았다면 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // friendId가 없을 경우 에러 처리
    if (!username) {
      setError("친구 username이 제공되지 않았습니다.");
      setLoading(false);
      return;
    }

    const fetchFriendDataAndCalendar = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 친구 정보 불러오기 (백엔드에 `/users/:id` 같은 API가 있다고 가정)
        // 이 부분은 `FriendList`에서 `Maps`할 때 `state`로 넘겨주거나,
        // 별도의 `useFriendStore` 함수를 추가하여 친구 목록에서 가져오는 것이 더 효율적일 수 있습니다.
        // 여기서는 임시로 API 호출을 가정합니다.
        
        const friendRes = await api.get(`/friends/${username}`);
        setFriendInfo(friendRes.data);

        // 2. 친구의 공개된 캘린더 일정 불러오기
        
        const events = await getFriendCalendar(username);
        console.log('[FriendCalendar] events from API:', events);
        setFriendCalendarEvents(Array.isArray(events) ? events : []);

      } catch (err: any) {
        console.error('친구 캘린더 또는 친구 정보 불러오기 실패:', err.response?.data || err.message);
        setError(err.response?.data?.message || '친구의 캘린더를 불러오는 데 실패했습니다.');
        setFriendCalendarEvents([]); // 에러 발생 시 일정 초기화
        setFriendInfo(null); // 에러 발생 시 친구 정보 초기화
      } finally {
        setLoading(false);
      }
    };

    fetchFriendDataAndCalendar();
  }, [isAuthenticated, username, navigate, getFriendCalendar]); // 의존성 배열에 모든 외부 변수 포함

  // 로딩, 에러, 친구 정보 없음 상태 처리
  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="text-lg font-medium text-gray-700">친구 캘린더를 불러오는 중입니다...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">오류 발생!</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/friends')}
            className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition"
          >
            친구 목록으로 돌아가기
          </button>
        </div>
      </section>
    );
  }

  if (!friendInfo) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">친구 정보를 찾을 수 없습니다.</h2>
          <p className="text-gray-600 mb-6">유효하지 않은 친구 ID이거나 정보를 불러올 수 없습니다.</p>
          <button
            onClick={() => navigate('/friends')}
            className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition"
          >
            친구 목록으로 돌아가기
          </button>
        </div>
      </section>
    );
  }

  // 친구 캘린더 UI
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center py-10 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 select-none">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 px-8 py-10">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-900 text-center tracking-tight">
          {friendInfo.nickname}님의 캘린더
        </h1>
        <p className="text-md text-gray-600 text-center mb-8">
          이 캘린더에는 {friendInfo.nickname}님이 공개 설정한 일정만 표시됩니다.
        </p>

        {friendCalendarEvents.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            현재 공개된 일정이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendCalendarEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">시작:</span> {new Date(event.start_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">종료:</span> {new Date(event.end_date).toLocaleDateString()}
                </p>
                {/* 추가적인 일정 상세 정보 (is_public은 이미 필터링되므로 UI에 표시할 필요 없음) */}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/friends')}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition shadow-md"
          >
            친구 목록으로 돌아가기
          </button>
        </div>
      </div>
    </section>
  );
};

export default FriendCalendar;