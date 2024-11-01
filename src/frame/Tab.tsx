import React, { useRef, RefObject, useEffect, useState } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDraggable } from "react-use-draggable-scroll";

interface TabProps {
   components: any;
   onTabMenuClick: (id: string) => void;
   onTabCloseClick: (id: string) => void;
   activeComp: any;
   onAllTabCloseClick: () => void;
   topMode: string;
   tabRef: RefObject<HTMLDivElement>; 
}

const Tab = ({ components, onTabMenuClick, onTabCloseClick, activeComp, onAllTabCloseClick, topMode, tabRef }: TabProps) => {
   // MutableRefObject로 설정
   const dragRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
   const { events } = useDraggable(dragRef);
   const [isScrollable, setIsScrollable] = useState(false);

   useEffect(() => {
      if (tabRef.current) {
         setIsScrollable(tabRef.current.scrollWidth > tabRef.current.clientWidth);
      }
   }, [components, tabRef]);

   useEffect(() => {
      if (dragRef.current) {
         dragRef.current.scrollTo({ left: dragRef.current.scrollWidth, behavior: "smooth" });
      }
   }, [components]);

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
                        hover:bg-orange-400 hover:text-white select-none
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
   
      if (dragRef.current) {
         dragRef.current.scrollBy({ left: -100, behavior: 'smooth' });
      }
   };

   const scrollRight = () => {
   
      if (dragRef.current) {
         dragRef.current.scrollBy({ left: 100, behavior: 'smooth' });
      }
   };

   return (
      <div className={`${topMode === 'mobileClose' || topMode === 'mobileOpen' ? 'hidden' : ''}`}>
         <div className="bg-gray-100 w-full h-[40px] border-b flex items-center">
            <div  ref={dragRef} {...events} className="w-[90%] h-full overflow-x-hidden" >
               <ul className="max-w-[1200px] h-full list-none flex gap-1 items-end px-2 whitespace-nowrap">
                  {components.map(renderMenuItem)}
               </ul>
            </div>
            <div className="w-[10%] flex justify-around">
               <div className="flex gap-5">
                  <div>
                     <ChevronLeftIcon onClick={scrollLeft} className="w-6 h-6 cursor-pointer hover:text-gray-500"></ChevronLeftIcon>
                  </div>
                  <div>
                     <ChevronRightIcon onClick={scrollRight} className="w-6 h-6 cursor-pointer hover:text-gray-500"></ChevronRightIcon>
                  </div>
               </div>
               <div>
                  <XMarkIcon onClick={handleAllTabCloseClick} className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-400"></XMarkIcon>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Tab;
