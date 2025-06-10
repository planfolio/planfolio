import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { BsPersonFillLock } from "react-icons/bs";

const LoginPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form);
      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
      alert("로그인 실패");
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
          로그인
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
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-5 px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base"
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition text-base shadow-md"
        >
          로그인
        </button>
        <div className="w-full flex justify-end mt-4">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-sm text-orange-500 hover:underline font-medium"
          >
            회원가입 하러가기
          </button>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
