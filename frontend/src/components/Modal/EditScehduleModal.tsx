import React, { useState } from "react";
import { useCalendarStore } from "../../store/useCalendarStore";

const EditScheduleModal = ({ event, onClose }) => {
  const updateEvent = useCalendarStore((state) => state.updateEvent);
  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    start_date: event.start_date.slice(0, 16), // 'YYYY-MM-DDTHH:mm'
    end_date: event.end_date.slice(0, 16),
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateEvent(event.id, {
      ...form,
      // 필요시 source 등 추가
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-10 shadow-2xl flex flex-col gap-6 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-extrabold text-orange-500 mb-2 tracking-tight">
          일정 수정
        </h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목"
          className="border rounded-lg p-3 text-base"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="설명"
          className="border rounded-lg p-3 text-base"
        />
        <div className="flex gap-4">
          <input
            name="start_date"
            type="datetime-local"
            value={form.start_date}
            onChange={handleChange}
            className="border rounded-lg p-2 flex-1"
            required
          />
          <input
            name="end_date"
            type="datetime-local"
            value={form.end_date}
            onChange={handleChange}
            className="border rounded-lg p-2 flex-1"
            required
          />
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-pink-400 text-white font-bold text-lg shadow hover:scale-105 transition"
          >
            저장
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScheduleModal;
