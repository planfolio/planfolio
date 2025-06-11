import React from "react";

const ScheduleDetailModal = ({ event, onClose, onEdit, onDelete }) => {
  const getSourceInfo = (source: string) => {
    switch (source) {
      case "manual":
        return {
          icon: "📝",
          label: "내 일정",
          color: "bg-blue-500",
          bgColor: "bg-blue-50",
        };
      case "contest":
        return {
          icon: "🏆",
          label: "공모전",
          color: "bg-amber-500",
          bgColor: "bg-amber-50",
        };
      case "certificate":
        return {
          icon: "🎓",
          label: "자격증",
          color: "bg-green-500",
          bgColor: "bg-green-50",
        };
      case "codingtest":
        return {
          icon: "💻",
          label: "코딩테스트",
          color: "bg-purple-500",
          bgColor: "bg-purple-50",
        };
      default:
        return {
          icon: "📌",
          label: source,
          color: "bg-gray-500",
          bgColor: "bg-gray-50",
        };
    }
  };

  const sourceInfo = getSourceInfo(event.source);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* 헤더 그라데이션 */}
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 p-6 text-white relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="닫기"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl ${sourceInfo.bgColor} ${sourceInfo.color}`}
            >
              <span className="text-2xl">{sourceInfo.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${sourceInfo.bgColor} ${sourceInfo.color} mb-3`}
              >
                <span>{sourceInfo.label}</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {event.title}
              </h2>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6">
          {/* 설명 */}
          {event.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                설명
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-xl">
                {event.description}
              </p>
            </div>
          )}

          {/* 일정 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              일정 정보
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-600 w-12">
                  시작
                </span>
                <span className="text-gray-800 font-medium">
                  {new Date(event.start_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-600 w-12">
                  종료
                </span>
                <span className="text-gray-800 font-medium">
                  {new Date(event.end_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onEdit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              ✏️ 수정
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              🗑️ 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
