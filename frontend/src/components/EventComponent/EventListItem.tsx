import React from "react";

type EventListItemProps = {
  title: string;
  date: string;
  type: string;
  description: string;
};

const EventListItem: React.FC<EventListItemProps> = ({
  title,
  date,
  type,
  description,
}) => (
  <div className="border-b py-4 px-2 flex flex-col gap-1 hover:bg-gray-50 transition">
    <div className="flex items-center gap-2">
      <span className="text-base font-bold">{title}</span>
      <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-600">
        {type}
      </span>
    </div>
    <span className="text-xs text-gray-500">{date}</span>
    <p className="text-sm text-gray-700">{description}</p>
  </div>
);

export default EventListItem;
