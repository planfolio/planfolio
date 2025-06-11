import React, { useState } from "react";
import { useCalendarStore } from "../../store/useCalendarStore";

const AddScheduleModal = ({ onClose }) => {
  const addEvent = useCalendarStore((state) => state.addEvent);
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    source: "manual",
  });

  // 날짜+시간을 합쳐 ISO 문자열로 변환
  const getDateTimeValue = (date, time) => {
    if (!date || !time) return "";
    return `${date}T${time}`;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEvent({
      title: form.title,
      description: form.description,
      start_date: getDateTimeValue(form.start_date, form.start_time),
      end_date: getDateTimeValue(form.end_date, form.end_time),
      source: form.source,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col gap-6 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-extrabold text-orange-500 mb-2 tracking-tight">
          일정 추가
        </h2>
        <label className="flex flex-col gap-1">
          <span className="text-base font-semibold text-gray-700">제목</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className="border rounded-lg p-3 text-base"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-base font-semibold text-gray-700">설명</span>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="일정에 대한 설명을 입력하세요"
            className="border rounded-lg p-3 text-base"
          />
        </label>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-base font-semibold text-gray-700">시작</span>
            <div className="flex gap-2 w-full">
              <input
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                required
              />
              <input
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-base font-semibold text-gray-700">종료</span>
            <div className="flex gap-2 w-full">
              <input
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                required
              />
              <input
                name="end_time"
                type="time"
                value={form.end_time}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-pink-400 text-white font-bold text-lg shadow hover:scale-105 transition"
          >
            등록
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

export default AddScheduleModal;
