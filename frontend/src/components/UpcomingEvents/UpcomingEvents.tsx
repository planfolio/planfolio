import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContestStore } from "../../store/useContestStore";
import { useCertificateStore } from "../../store/useCertificatesStore";
import { useCodingTestStore } from "../../store/useCodingTestStore";

type EventItem = {
  type: string;
  title: string;
  start_date: string;
  end_date: string;
};

const ICONS: Record<string, React.ReactNode> = {
  contest: (
    <span className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full shadow-md">
      <span className="text-white text-xl">🏆</span>
    </span>
  ),
  certificate: (
    <span className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-green-400 to-blue-400 rounded-full shadow-md">
      <span className="text-white text-xl">📜</span>
    </span>
  ),
  codingtest: (
    <span className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full shadow-md">
      <span className="text-white text-xl">💻</span>
    </span>
  ),
};

const typeToPath: Record<string, string> = {
  contest: "/contests",
  certificate: "/certificates",
  codingtest: "/coding-tests",
};

const UpcomingEvents: React.FC = () => {
  const [upcoming, setUpcoming] = useState<EventItem[]>([]);
  const navigate = useNavigate();

  // 기존 store들을 사용
  const { contests, fetchContests } = useContestStore();
  const { qualifications, fetchQualifications } = useCertificateStore();
  const { tests, fetchTests } = useCodingTestStore();

  // 컴포넌트 마운트 시 데이터 로드 (이미 인증된 상태에서만 렌더링됨)
  useEffect(() => {
    fetchContests();
    fetchQualifications();
    fetchTests();
  }, []); // 의존성 배열 단순화

  // store 데이터가 변경될 때마다 upcoming 이벤트 업데이트
  useEffect(() => {
    const all = [
      ...contests.map((item) => ({ ...item, type: "contest" })),
      ...qualifications.map((item) => ({ ...item, type: "certificate" })),
      ...tests.map((item) => ({ ...item, type: "codingtest" })),
    ];

    const now = new Date();
    const filtered = all
      .filter((item) => new Date(item.start_date) >= now)
      .sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      )
      .slice(0, 5);
    setUpcoming(filtered);
  }, [contests, qualifications, tests]);

  return (
    <section className="my-10 select-none">
      <h2 className="text-2xl font-extrabold mb-6 tracking-tight text-gray-900 ">
        <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          다가오는 일정
        </span>
      </h2>
      {upcoming.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          다가오는 일정이 없습니다.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {upcoming.map((event) => (
            <li
              key={event.title + event.start_date}
              className="flex items-center gap-4 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-gray-100 hover:scale-[1.025] hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(typeToPath[event.type])}
              tabIndex={0}
              role="button"
              aria-label={`${event.type}로 이동`}
            >
              {ICONS[event.type] || (
                <span className="flex items-center justify-center w-9 h-9 bg-gray-200 rounded-full shadow">
                  <span className="text-gray-500 text-xl">📅</span>
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg text-gray-800 truncate">
                  {event.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {event.start_date.split(" ")[0]}
                </div>
              </div>
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold
                  ${
                    event.type === "contest"
                      ? "bg-orange-100 text-orange-600"
                      : event.type === "certificate"
                      ? "bg-green-100 text-green-600"
                      : "bg-indigo-100 text-indigo-600"
                  }`}
              >
                {event.type === "contest"
                  ? "공모전"
                  : event.type === "certificate"
                  ? "자격증"
                  : "코딩테스트"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UpcomingEvents;
