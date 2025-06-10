import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { BsPersonPlusFill } from "react-icons/bs";

const SignupPage: React.FC = () => {
  const signup = useAuthStore((state) => state.signup);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    nickname: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      alert("회원가입 실패");
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 select-none">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 px-8 py-10 flex flex-col items-center"
      >
        <BsPersonPlusFill className="text-4xl text-orange-400 mb-2" />
        <h2 className="text-2xl font-extrabold mb-4 text-gray-900 tracking-tight">
          회원가입
        </h2>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base"
          autoComplete="username"
        />
        <input
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base"
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base"
          autoComplete="new-password"
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base"
        />
        <input
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
          className="w-full mb-5 px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition text-base shadow-md"
        >
          회원가입
        </button>
        <div className="w-full flex justify-end mt-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-orange-500 hover:underline font-medium"
          >
            이미 계정이 있으신가요?
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignupPage;
