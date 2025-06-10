import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const ChangePasswordModal = ({ onClose }) => {
  const changePassword = useAuthStore((state) => state.changePassword);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordCheck: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.newPasswordCheck) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    await changePassword(form.oldPassword, form.newPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-4 min-w-[320px]"
      >
        <h2 className="text-xl font-bold mb-2">비밀번호 변경</h2>
        <input
          name="oldPassword"
          type="password"
          value={form.oldPassword}
          onChange={handleChange}
          placeholder="현재 비밀번호"
          className="border rounded-lg p-2"
        />
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="새 비밀번호"
          className="border rounded-lg p-2"
        />
        <input
          name="newPasswordCheck"
          type="password"
          value={form.newPasswordCheck}
          onChange={handleChange}
          placeholder="새 비밀번호 확인"
          className="border rounded-lg p-2"
        />
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600"
          >
            변경
          </button>
          <button
            type="button"
            className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;
