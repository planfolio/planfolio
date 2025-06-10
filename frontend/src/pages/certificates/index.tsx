import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EventFilter from "../../components/EventComponent/EventFilter";
import EventListItem from "../../components/EventComponent/EventListItem";
import { useCertificateStore } from "../../store/useCertificatesStore";
import { useAuthStore } from "../../store/useAuthStore";

const EXCLUDE_TAGS = ["시험", "필기", "실기", "원서접수"];
const MAIN_CERT_TAGS = [
  "정보처리기사",
  "리눅스마스터",
  "빅데이터분석기사",
  "데이터분석전문가",
  "데이터분석준전문가",
  "sql전문가",
  "sql개발자",
  "데이터아키텍처전문가",
  "데이터아키텍처 준전문가",
];

const CertificatesPage: React.FC = () => {
  const { qualifications, isLoading, fetchQualifications } =
    useCertificateStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  useEffect(() => {
    fetchQualifications();
  }, [fetchQualifications]);

  useEffect(() => {
    // 태그 추출 및 정제
    const tagSet = new Set<string>();
    qualifications.forEach((qual) => {
      qual.tags
        .replace(/\//g, ",")
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => {
          if (
            tag &&
            tag.length > 0 &&
            !EXCLUDE_TAGS.includes(tag) &&
            MAIN_CERT_TAGS.includes(tag)
          ) {
            tagSet.add(tag);
          }
        });
    });
    setFilterTags(Array.from(tagSet));
  }, [qualifications]);

  const handleFilterChange = (tag: string) => {
    if (tag === "전체") {
      setSelected([]);
    } else {
      setSelected((prev) => {
        const next = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
        return next.length === 0 ? [] : next;
      });
    }
  };

  // 북마크(내 캘린더 추가) 핸들러
  const handleBookmark = useCallback(
    (qual) => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다!");
        navigate("/login");
        return;
      }
      // 북마크 추가 API (예시)
      // await axios.post("http://localhost:3000/calendar", { ... })
      alert("내 캘린더에 추가되었습니다!");
    },
    [isAuthenticated, navigate]
  );

  const filteredQualifications =
    selected.length === 0
      ? qualifications
      : qualifications.filter((qual) => {
          const tags = qual.tags
            .replace(/\//g, ",")
            .split(",")
            .map((t) => t.trim());
          return selected.some((sel) => tags.includes(sel));
        });

  return (
    <div className="certificate-page flex max-w-6xl mx-auto p-6 gap-6 select-none">
      {/* 좌측: 필터 */}
      <aside className="w-40">
        <div className="bg-white rounded-lg shadow p-4">
          <EventFilter
            categories={["전체", ...filterTags]}
            selected={selected}
            onChange={handleFilterChange}
          />
        </div>
      </aside>
      {/* 우측: 리스트 */}
      <section className="flex-1 min-w-0 bg-white rounded-lg shadow p-4 select-none">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : filteredQualifications.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            해당 분류의 자격증이 없습니다.
          </div>
        ) : (
          filteredQualifications.map((qual, idx) => (
            <EventListItem
              key={qual.title + idx}
              title={qual.title}
              date={`${qual.start_date} ~ ${qual.end_date}`}
              type={qual.tags}
              description={qual.description}
              onBookmark={() => handleBookmark(qual)}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default CertificatesPage;
