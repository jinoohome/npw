import React, { useRef, useEffect, useState, useCallback } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDraggable } from "react-use-draggable-scroll";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

// Component 인터페이스
interface Component {
  id: string;
  name: string;
}

// Props 인터페이스
interface TabProps {
  components: Component[];
  onTabMenuClick: (item: Component) => void;
  onTabCloseClick: (item: Component) => void;
  activeComp: Component;
  onAllTabCloseClick: () => void;
  topMode: string;
  tabRef: React.RefObject<HTMLDivElement>;
}

// Memoized TabItem 컴포넌트
const TabItem = React.memo(({ item, activeComp, onTabMenuClick, onTabCloseClick }: {
  item: Component;
  activeComp: Component;
  onTabMenuClick: (item: Component) => void;
  onTabCloseClick: (item: Component) => void;
}) => {
  return (
    <li
      className={`flex items-center gap-1 cursor-pointer drop-shadow-sm text-sm px-2 pt-2 pb-1 rounded-t-xl border-b-0
                  hover:bg-orange-400 hover:text-white select-none
                  ${item.id === activeComp.id ? "bg-orange-400 text-white" : "bg-white "}`}
    >
      <span onClick={() => onTabMenuClick(item)}>{item.name}</span>
      <span>
        <XMarkIcon onClick={() => onTabCloseClick(item)} className="w-4 h-4 text-red-500"></XMarkIcon>
      </span>
    </li>
  );
});

const Tab: React.FC<TabProps> = ({
  components,
  onTabMenuClick,
  onTabCloseClick,
  activeComp,
  onAllTabCloseClick,
  topMode,
  tabRef,
}) => {
   const dragRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const { events } = useDraggable(dragRef);
  const [tabs, setTabs] = useState<Component[]>(components);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
  
    if (!isDragging && dragRef.current) {
      // Scroll to the rightmost position only if not dragging
      const maxScrollLeft = dragRef.current.scrollWidth - dragRef.current.clientWidth;
      dragRef.current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    }
  }, [tabs]);

  useEffect(() => {
    setTabs(components); // Ensure tabs are updated when components change
  }, [components]);

  const handleTabCloseClick = useCallback((item: Component) => {
    onTabCloseClick(item);
  }, [onTabCloseClick]);

  const handleAllTabCloseClick = useCallback(() => {
    onAllTabCloseClick();
  }, [onAllTabCloseClick]);

  const scrollLeft = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  }, []);

  // Handle drag start and end to control scrolling behavior
  const onDragEnd = useCallback((result: DropResult) => {
     if (!result.destination) return;
     
  
    const updatedTabs = Array.from(tabs);
    const [movedTab] = updatedTabs.splice(result.source.index, 1);
    updatedTabs.splice(result.destination.index, 0, movedTab);

    setTabs(updatedTabs);
    setTimeout(() => setIsDragging(false), 100);
  }, [tabs]);

  const onDragStart = useCallback((start:any) => {
    setIsDragging(true); // Set dragging state

    const itemId = start.draggableId;
    const item:any = {
      id : itemId,
    }
    if(itemId){
       onTabMenuClick(item);
    }
   
  }, []);

  return (
    <div className={`${topMode === "mobileClose" || topMode === "mobileOpen" ? "hidden" : ""}`}>
      <div className="bg-gray-100 w-full h-[40px] border-b flex items-center">
        <div ref={dragRef} {...events} className="w-[90%] h-full overflow-x-hidden">
          <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <Droppable direction="horizontal" droppableId="tabs">
              {(provided) => (
                <ul
                  className="max-w-[1200px] h-full list-none flex gap-1 items-end px-2 whitespace-nowrap"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tabs.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex"
                        >
                          <TabItem
                            item={item}
                            activeComp={activeComp}
                            onTabMenuClick={onTabMenuClick}
                            onTabCloseClick={handleTabCloseClick}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
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
