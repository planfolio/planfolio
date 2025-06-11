import React, { useState } from "react";
import { useCalendarStore } from "../../store/useCalendarStore";

const AddScheduleModal = ({ onClose }) => {
  const addEvent = useCalendarStore((state) => state.addEvent);
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEvent(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-4 min-w-[340px]"
      >
        <h2 className="text-xl font-bold mb-2">일정 추가</h2>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-600">제목</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className="border rounded-lg p-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-gray-600">설명</span>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="일정에 대한 설명을 입력하세요"
            className="border rounded-lg p-2"
          />
        </label>
        <div className="flex gap-2">
          <label className="flex-1 flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">
              시작 일자
            </span>
            <input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              className="border rounded-lg p-2"
              required
            />
          </label>
          <label className="flex-1 flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-600">
              끝나는 일자
            </span>
            <input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              className="border rounded-lg p-2"
              required
            />
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600"
          >
            등록
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

export default AddScheduleModal;
