import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// 타입 정의를 추가하여 Props의 타입을 명확하게 합니다.
interface BreadcrumbItem {
  name: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="flex gap-1 text-sm items-end">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {/* 마지막 항목이면 특별한 스타일을 적용합니다. */}
          <div className={index === items.length - 1 ? "text-rose-500" : ""}>
            {item.name}
          </div>
          {/* 마지막 아이콘은 렌더링하지 않습니다. */}
          {index < items.length - 1 && <ChevronRightIcon className="w-3 h-3 mx-1" />}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
