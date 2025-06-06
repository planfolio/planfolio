import React, { useState } from "react";
import EventFilter from "../../components/ContestEvent/EventFilter";
import EventListItem from "../../components/ContestEvent/EventListItem";

type Certificate = {
  type: string;
  title: string;
  description: string;
  tags: string;
  start_date: string;
  end_date: string;
};

// 더미 데이터 예시
const DUMMY_CERTIFICATES: Certificate[] = [
  {
    type: "certificate",
    title: "정보처리기사",
    description: "한국산업인력공단 주관 국가기술자격",
    tags: "IT, 국가기술, 기사",
    start_date: "2025-07-01 00:00:00",
    end_date: "2025-07-31 23:59:59",
  },
  {
    type: "certificate",
    title: "SQLD",
    description: "한국데이터산업진흥원 주관 SQL 개발자 자격증",
    tags: "데이터베이스, IT, 자격증",
    start_date: "2025-08-05 00:00:00",
    end_date: "2025-08-20 23:59:59",
  },
  {
    type: "certificate",
    title: "컴퓨터활용능력 1급",
    description: "대한상공회의소 주관",
    tags: "컴활, IT, 사무",
    start_date: "2025-09-10 00:00:00",
    end_date: "2025-09-25 23:59:59",
  },
  {
    type: "certificate",
    title: "ADsP",
    description: "한국데이터산업진흥원 주관 데이터분석 준전문가",
    tags: "데이터분석, IT, 자격증",
    start_date: "2025-10-01 00:00:00",
    end_date: "2025-10-15 23:59:59",
  },
];

// 모든 tags를 중복 없이 추출
const tagSet = new Set<string>();
DUMMY_CERTIFICATES.forEach((cert) => {
  cert.tags
    .replace(/\//g, ",")
    .split(",")
    .map((tag) => tag.trim())
    .forEach((tag) => tag && tag.length > 0 && tagSet.add(tag));
});
const FILTER_TAGS = Array.from(tagSet);

const CertificatesPage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

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

  const filteredCertificates =
    selected.length === 0
      ? DUMMY_CERTIFICATES
      : DUMMY_CERTIFICATES.filter((cert) => {
          const tags = cert.tags
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
            categories={["전체", ...FILTER_TAGS]}
            selected={selected}
            onChange={handleFilterChange}
          />
        </div>
      </aside>

      {/* 우측: 리스트 */}
      <section className="flex-1 min-w-0 bg-white rounded-lg shadow p-4 select-none">
        {filteredCertificates.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            해당 분류의 자격증이 없습니다.
          </div>
        ) : (
          filteredCertificates.map((cert, idx) => (
            <EventListItem
              key={cert.title + idx}
              title={cert.title}
              date={`${cert.start_date} ~ ${cert.end_date}`}
              type={cert.tags}
              description={cert.description}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default CertificatesPage;
