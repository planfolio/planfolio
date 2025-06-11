// src/store/useFriendStore.ts
import { create } from 'zustand';
import api from '../api/axiosInstance'; // 설정된 Axios 인스턴스

// 친구 목록에 표시될 친구 정보 타입 (API 응답 based)
interface Friend {
  id: number;
  username: string;
  nickname: string;
  profile_image: string | null;
  is_public: boolean; // 친구 캘린더 공개 여부 (새로운 필드)
  since: string;      // 친구 관계가 수락된 시점 (새로운 필드)
}

// 받은 친구 요청 목록에 표시될 요청 정보 타입 (API 응답 based)
interface ReceivedFriendRequest {
  id: number;
  user: { // 요청을 보낸 사용자의 정보가 user 객체 안에 중첩되어 있음
    id: number;
    username: string;
    nickname: string;
    profile_image: string | null;
  };
  status: 'pending'; // 받은 요청은 항상 'pending' 상태일 것임
  created_at: string;
}

// 캘린더 일정 데이터의 타입 정의
interface FriendCalendarEntry {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  // ... 다른 캘린더 필드
}

interface FriendState {
  friends: Friend[];
  pendingRequests: ReceivedFriendRequest[];
  fetchFriends: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  sendFriendRequest: (targetUsername: string) => Promise<void>;
  handleFriendRequest: (senderUsername: string, action: 'accept' | 'reject') => Promise<void>; // 수락/거절 통합
  removeFriend: (friendUsername: string) => Promise<void>; // 친구 삭제
  getFriendCalendar: (friendId: number) => Promise<FriendCalendarEntry[]>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  friends: [],
  pendingRequests: [],

  // 9. 친구 목록 조회 (GET /friends)
  fetchFriends: async () => {
    try {
      const response = await api.get('/friends');
      set({ friends: response.data.friends }); // 응답 객체에 'friends' 배열이 중첩되어 있음
    } catch (error) {
      console.error('친구 목록 불러오기 실패:', error);
      set({ friends: [] });
      throw error;
    }
  },

  // 7. 받은 친구 요청 목록 조회 (GET /friends/received)
  fetchPendingRequests: async () => {
    try {
      const response = await api.get('/friends/received');
      set({ pendingRequests: response.data.requests }); // 응답 객체에 'requests' 배열이 중첩되어 있음
    } catch (error) {
      console.error('받은 친구 요청 불러오기 실패:', error);
      set({ pendingRequests: [] });
      throw error;
    }
  },

  // 6. 친구 요청 보내기 (POST /friends)
  sendFriendRequest: async (targetUsername: string) => {
    try {
      const response = await api.post('/friends', { username: targetUsername });
      alert(response.data.message || '친구 요청을 성공적으로 보냈습니다!');
      // 요청 성공 후, 받은 친구 요청 목록이나 친구 목록을 새로고침할 필요는 없을 수 있음
      // 다만, 사용자에게 요청 보냈다는 피드백을 주는 것이 중요.
    } catch (error: any) {
      console.error('친구 요청 실패:', error.response?.data || error.message);
      let errorMessage = '친구 요청에 실패했습니다.';
      if (error.response?.status === 404) {
        errorMessage = '해당 아이디의 사용자를 찾을 수 없습니다.';
      } else if (error.response?.status === 409) {
        errorMessage = error.response.data.message || '이미 친구 상태이거나 요청 중인 상태입니다.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
      throw error;
    }
  },

  // 8. 친구 요청 수락/거절 (PATCH /friends/:username)
  handleFriendRequest: async (senderUsername: string, action: 'accept' | 'reject') => {
    try {
      const response = await api.patch(`/friends/${senderUsername}`, { action });
      alert(response.data.message);
      // 성공 후 친구 목록과 요청 목록 새로고침
      await get().fetchFriends();
      await get().fetchPendingRequests();
    } catch (error: any) {
      console.error(`친구 요청 ${action} 실패:`, error.response?.data || error.message);
      let errorMessage = `친구 요청 ${action === 'accept' ? '수락' : '거절'}에 실패했습니다.`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
      throw error;
    }
  },

  // 10. 친구 삭제 (DELETE /friends/:username)
  removeFriend: async (friendUsername: string) => {
    try {
      const response = await api.delete(`/friends/${friendUsername}`);
      alert(response.data.message || '친구를 성공적으로 삭제했습니다.');
      // 친구 목록 새로고침
      await get().fetchFriends();
    } catch (error: any) {
      console.error('친구 삭제 실패:', error.response?.data || error.message);
      let errorMessage = '친구 삭제에 실패했습니다.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
      throw error;
    }
  },

  // 캘린더 관련 API는 기존과 유사
  // (API 명세에 따로 언급이 없었지만, `/friends/:friendId/calendar`는 유지한다고 가정)
  getFriendCalendar: async (friendId: number) => {
    try {
      // 명세에는 없지만, 친구의 캘린더는 친구 ID로 가져온다고 가정
      const response = await api.get(`/friends/${friendId}/calendar`);
      return response.data; // FriendCalendarEntry[] 반환
    } catch (error) {
      console.error(`친구 (${friendId}) 캘린더 불러오기 실패:`, error);
      throw error;
    }
  },
}));