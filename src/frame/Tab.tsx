import React, { RefObject, useRef } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface TabProps {
   components: any;
   onTabMenuClick: (id: string) => void;
   onTabCloseClick: (id: string) => void;
   activeComp: any;
   onAllTabCloseClick: () => void;
   tabRef: RefObject<HTMLDivElement>; 
   
}
const Tab = ({ components, onTabMenuClick, onTabCloseClick, activeComp, onAllTabCloseClick, tabRef}: TabProps) => {
   const handleTabCloseClick = (item: any) => {
      onTabCloseClick(item);
   };
   const handleAllTabCloseClick = () => {
      onAllTabCloseClick();
   };

   const renderMenuItem = (item: any, index: number) => {
      return (
         <li
            key={index}
            className={`flex items-center gap-1 cursor-pointer drop-shadow-sm text-sm px-2 pt-2 pb-1 rounded-t-xl border-b-0
                        ${item.id === activeComp.id ? "bg-orange-400 text-white" : "bg-white "}
         `}
         >
            <span onClick={() => onTabMenuClick(item)}>{item.name}</span>
            <span>
               <XMarkIcon onClick={() => handleTabCloseClick(item)} className="w-4 h-4 text-red-500"></XMarkIcon>
            </span>
         </li>
      );
   };

   const scrollLeft = () => {
      if (tabRef.current) {
         tabRef.current.scrollBy({ left: -100, behavior: 'smooth' }); // 왼쪽으로 스크롤
      }
    };
  
    const scrollRight = () => {
      if (tabRef.current) {
         tabRef.current.scrollBy({ left: 100, behavior: 'smooth' }); // 오른쪽으로 스크롤
      }
    };
  

   return (
      <div>
         <div className="bg-gray-100 w-full h-[40px] border-b flex items-center ">
            <div ref={tabRef} className="w-[90%] h-full overflow-hidden">
               <ul  className="max-w-[1200px] h-full list-none flex gap-1 items-end px-2  whitespace-nowrap ">
                  {components.map(renderMenuItem)}
               </ul>
            </div>
            <div className="w-[10%] flex justify-around">
               <div className="flex gap-5">
                  <div>
                     <ChevronLeftIcon  onClick={scrollLeft} className="w-6 h-6 cursor-pointer"></ChevronLeftIcon>
                  </div>
                  <div>
                     <ChevronRightIcon onClick={scrollRight} className="w-6 h-6 cursor-pointer"></ChevronRightIcon>
                  </div>
               </div>
               <div>
                  <XMarkIcon onClick={() => handleAllTabCloseClick()} className="w-6 h-6 text-red-500 cursor-pointer"></XMarkIcon>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Tab;
