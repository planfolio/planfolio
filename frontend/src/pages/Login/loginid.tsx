// src/pages/loginid.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/useAuthStore"; // Auth Store 사용
import { BsPersonFillLock } from "react-icons/bs"; // 아이콘 재활용

const LoginIdPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>(''); // 사용자에게 보여줄 메시지
  const navigate = useNavigate();
  const { findUsername } = useAuthStore(); // useAuthStore에서 findUsername 함수 가져오기

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // 메시지 초기화
    try {
      await findUsername(email); // useAuthStore의 findUsername 함수 호출
      setMessage('입력하신 이메일로 아이디 정보가 전송되었습니다. 이메일을 확인해주세요.');
    } catch (error: any) {
      console.error('아이디 찾기 실패:', error.response?.data || error.message);
      // 백엔드에서 받은 에러 메시지를 사용자에게 보여주는 것이 좋습니다.
      setMessage(error.response?.data?.message || '아이디를 찾을 수 없습니다. 이메일을 다시 확인해주세요.');
    }
  };

  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 select-none">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 px-8 py-10 flex flex-col items-center"
      >
        <BsPersonFillLock className="text-4xl text-orange-400 mb-2" />
        <h2 className="text-2xl font-extrabold mb-4 text-gray-900 tracking-tight">
          아이디 찾기
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          가입 시 사용한 이메일을 입력하시면, 해당 이메일로 아이디 정보를 보내드립니다.
        </p>
        <input
          type="email"
          name="email"
          placeholder="가입 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition text-base shadow-md"
        >
          아이디 찾기
        </button>
        {message && (
          <p className={`mt-4 text-sm ${message.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </form>
    </section>
  );
};

export default LoginIdPage;