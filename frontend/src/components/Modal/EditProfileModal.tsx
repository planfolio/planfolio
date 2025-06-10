import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const EditProfileModal = ({ user, onClose }) => {
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [form, setForm] = useState({
    nickname: user.nickname || "",
    profile_image: user.profile_image || "",
    is_public: user.is_public ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form); // zustand 액션 호출
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-4 min-w-[320px] max-w-xs w-full"
      >
        <h2 className="text-xl font-bold mb-2">내 정보 수정</h2>
        <input
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="닉네임"
          className="border rounded-lg p-2"
        />
        <input
          name="profile_image"
          value={form.profile_image}
          onChange={handleChange}
          placeholder="프로필 이미지 URL"
          className="border rounded-lg p-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_public"
            checked={form.is_public}
            onChange={handleChange}
          />
          공개 프로필
        </label>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600"
          >
            저장
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

export default EditProfileModal;
