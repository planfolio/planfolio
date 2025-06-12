import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import React from "react";

interface EventListItemProps {
  title: string;
  date: string;
  type: string;
  description: string;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

const EventListItem: React.FC<EventListItemProps> = ({
  title,
  date,
  type,
  description,
  onBookmark,
  isBookmarked = false,
}) => (
  <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 px-5 py-4 mb-4 hover:shadow-md transition">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-base text-gray-800 truncate">
          {title}
        </span>
        {/* 태그(타입) 배지 */}
        <span className="inline-block bg-orange-100 text-orange-500 text-xs font-semibold px-2 py-0.5 rounded ml-2">
          {type}
        </span>
      </div>
      <div className="text-xs text-gray-500 mb-1">{date}</div>
      <div className="text-sm text-gray-700 line-clamp-2">{description}</div>
    </div>
    {onBookmark && (
      <button
        className="ml-6 p-2 rounded-full hover:bg-orange-100 transition flex items-center justify-center"
        onClick={onBookmark}
        aria-label="일정 북마크"
        type="button"
      >
        {isBookmarked ? (
          <BsBookmarkFill className="text-orange-500 w-6 h-6" />
        ) : (
          <BsBookmark className="text-gray-400 w-6 h-6" />
        )}
      </button>
    )}
  </div>
);

export default EventListItem;
