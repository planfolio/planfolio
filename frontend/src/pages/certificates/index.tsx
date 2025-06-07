import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventFilter from "../../components/EventComponent/EventFilter";
import EventListItem from "../../components/EventComponent/EventListItem";

type Qualification = {
  type: string;
  title: string;
  description: string;
  tags: string;
  start_date: string;
  end_date: string;
};

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

interface CertificatesPageProps {
  isAuthenticated?: boolean;
}

const CertificatesPage: React.FC<CertificatesPageProps> = ({
  isAuthenticated,
}) => {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/qualifications").then((res) => {
      setQualifications(res.data);

      // 태그 추출 및 정제
      const tagSet = new Set<string>();
      res.data.forEach((qual: Qualification) => {
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
    });
  }, []);

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
    (qual: Qualification) => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다!");
        navigate("/login");
        return;
      }
      axios
        .post("http://localhost:3000/calendar", {
          title: qual.title,
          description: qual.description,
          start_date: qual.start_date,
          end_date: qual.end_date,
          source: "qualification",
        })
        .then(() => {
          alert("내 캘린더에 추가되었습니다!");
        })
        .catch((err) => {
          alert("추가에 실패했습니다.");
          console.error(err);
        });
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
        {filteredQualifications.length === 0 ? (
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
