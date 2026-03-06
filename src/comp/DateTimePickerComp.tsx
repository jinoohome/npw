import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface DateTimePickerCompProps {
   title: string;
   value?: string;
   onChange?: (value: string | null) => void;
   layout?: "horizontal" | "vertical" | "flex";
   minWidth?: string;
   textAlign?: "left" | "center" | "right";
   readonly?: boolean;
   require?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const ITEM_HEIGHT = 38;
const VISIBLE_COUNT = 5;

const ScrollWheel: React.FC<{
   items: number[];
   selected: number;
   onSelect: (val: number) => void;
}> = ({ items, selected, onSelect }) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const isUserScrolling = useRef(false);
   const snapTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
   const animFrameRef = useRef<number>();

   const isDragging = useRef(false);
   const dragStartY = useRef(0);
   const scrollOffset = useRef(0); // virtual scroll position (px)
   const lastY = useRef(0);
   const lastTime = useRef(0);
   const velocitySamples = useRef<{ dy: number; dt: number }[]>([]);
   const didDragMove = useRef(false);

   const padCount = Math.floor(VISIBLE_COUNT / 2);
   const selectedIndex = items.indexOf(selected);
   const maxScroll = (items.length - 1) * ITEM_HEIGHT;

   const clampScroll = (v: number) => Math.max(0, Math.min(v, maxScroll));

   const applyScroll = useCallback(() => {
      if (containerRef.current) {
         containerRef.current.scrollTop = scrollOffset.current;
      }
   }, []);

   // scroll to selected on mount / programmatic change
   useEffect(() => {
      if (!isUserScrolling.current) {
         scrollOffset.current = items.indexOf(selected) * ITEM_HEIGHT;
         applyScroll();
      }
   }, [selected, items, applyScroll]);

   const snapTo = useCallback((animated: boolean) => {
      if (!containerRef.current) return;
      const idx = Math.round(scrollOffset.current / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      const target = clamped * ITEM_HEIGHT;

      if (animated) {
         // smooth spring-like snap animation
         const start = scrollOffset.current;
         const dist = target - start;
         const duration = 200;
         const startTime = performance.now();

         const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            scrollOffset.current = start + dist * ease;
            applyScroll();

            if (progress < 1) {
               animFrameRef.current = requestAnimationFrame(animate);
            } else {
               scrollOffset.current = target;
               applyScroll();
               onSelect(items[clamped]);
               isUserScrolling.current = false;
            }
         };
         animFrameRef.current = requestAnimationFrame(animate);
      } else {
         scrollOffset.current = target;
         applyScroll();
         onSelect(items[clamped]);
         isUserScrolling.current = false;
      }
   }, [items, onSelect, applyScroll]);

   // mouse wheel — accumulate into smooth animation
   const wheelTarget = useRef(0);
   const wheelAnimating = useRef(false);

   const animateWheelTo = useCallback((target: number) => {
      const step = () => {
         const diff = target - scrollOffset.current;
         if (Math.abs(diff) < 0.5) {
            scrollOffset.current = target;
            applyScroll();
            wheelAnimating.current = false;
            // snap after wheel settles
            if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
            snapTimeoutRef.current = setTimeout(() => snapTo(true), 200);
            return;
         }
         // lerp — ease toward target
         scrollOffset.current += diff * 0.18;
         applyScroll();
         animFrameRef.current = requestAnimationFrame(step);
      };
      if (!wheelAnimating.current) {
         wheelAnimating.current = true;
         animFrameRef.current = requestAnimationFrame(step);
      }
   }, [applyScroll, snapTo]);

   const handleWheel = useCallback((e: React.WheelEvent) => {
      e.stopPropagation();
      isUserScrolling.current = true;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

      // normalize: one wheel tick = one item
      const delta = Math.sign(e.deltaY) * ITEM_HEIGHT;
      wheelTarget.current = clampScroll(
         (wheelAnimating.current ? wheelTarget.current : scrollOffset.current) + delta
      );
      animateWheelTo(wheelTarget.current);
   }, [animateWheelTo, maxScroll]);

   // prevent native scroll, use wheel handler instead
   const handleNativeScroll = useCallback(() => {
      if (!isDragging.current && containerRef.current) {
         scrollOffset.current = containerRef.current.scrollTop;
      }
   }, []);

   const getAverageVelocity = () => {
      const samples = velocitySamples.current;
      if (samples.length === 0) return 0;
      // weighted: recent samples matter more
      let totalDy = 0, totalDt = 0;
      for (let i = 0; i < samples.length; i++) {
         const weight = (i + 1);
         totalDy += samples[i].dy * weight;
         totalDt += samples[i].dt * weight;
      }
      return totalDt > 0 ? (totalDy / totalDt) * 16 : 0;
   };

   // momentum with deceleration curve
   const startMomentum = useCallback((v: number) => {
      const decel = 0.97; // higher = more glide
      const minV = 0.3;

      const step = () => {
         if (Math.abs(v) < minV) {
            snapTo(true);
            return;
         }
         scrollOffset.current = clampScroll(scrollOffset.current - v);
         applyScroll();

         // bounce back at boundaries
         if (scrollOffset.current <= 0 || scrollOffset.current >= maxScroll) {
            snapTo(true);
            return;
         }

         v *= decel;
         animFrameRef.current = requestAnimationFrame(step);
      };
      animFrameRef.current = requestAnimationFrame(step);
   }, [applyScroll, snapTo, maxScroll]);

   const handlePointerDown = useCallback((e: React.PointerEvent) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

      isDragging.current = true;
      didDragMove.current = false;
      isUserScrolling.current = true;
      dragStartY.current = e.clientY;
      lastY.current = e.clientY;
      lastTime.current = performance.now();
      velocitySamples.current = [];

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
   }, []);

   const handlePointerMove = useCallback((e: React.PointerEvent) => {
      if (!isDragging.current) return;

      const dy = lastY.current - e.clientY;
      if (Math.abs(e.clientY - dragStartY.current) > 3) {
         didDragMove.current = true;
      }

      scrollOffset.current = clampScroll(scrollOffset.current + dy);
      applyScroll();

      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
         velocitySamples.current.push({ dy: e.clientY - lastY.current, dt });
         // keep last 5 samples
         if (velocitySamples.current.length > 5) velocitySamples.current.shift();
      }
      lastY.current = e.clientY;
      lastTime.current = now;
   }, [applyScroll, maxScroll]);

   const handlePointerUp = useCallback(() => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const v = getAverageVelocity();
      if (Math.abs(v) > 2) {
         startMomentum(v);
      } else {
         snapTo(true);
      }
   }, [startMomentum, snapTo]);

   const handleItemClick = useCallback((idx: number) => {
      if (didDragMove.current) return; // ignore click after drag
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      isUserScrolling.current = true;

      const target = idx * ITEM_HEIGHT;
      const start = scrollOffset.current;
      const dist = target - start;
      const duration = 250;
      const startTime = performance.now();

      const animate = (now: number) => {
         const elapsed = now - startTime;
         const progress = Math.min(elapsed / duration, 1);
         const ease = 1 - Math.pow(1 - progress, 3);
         scrollOffset.current = start + dist * ease;
         applyScroll();
         if (progress < 1) {
            animFrameRef.current = requestAnimationFrame(animate);
         } else {
            scrollOffset.current = target;
            applyScroll();
            onSelect(items[idx]);
            isUserScrolling.current = false;
         }
      };
      animFrameRef.current = requestAnimationFrame(animate);
   }, [applyScroll, items, onSelect]);

   useEffect(() => {
      return () => {
         if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
         if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      };
   }, []);

   return (
      <div
         className="relative"
         style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
         onWheel={handleWheel}
      >
         {/* Selection highlight bar */}
         <div
            className="absolute left-1 right-1 rounded-full pointer-events-none z-0"
            style={{ top: padCount * ITEM_HEIGHT, height: ITEM_HEIGHT, backgroundColor: "#f97316" }}
         />
         <div
            ref={containerRef}
            onScroll={handleNativeScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative overflow-hidden scrollbar-hide z-10 touch-none select-none"
            style={{ height: ITEM_HEIGHT * VISIBLE_COUNT, cursor: "grab" }}
         >
            {/* top padding */}
            {Array.from({ length: padCount }).map((_, i) => (
               <div key={`pad-top-${i}`} style={{ height: ITEM_HEIGHT }} />
            ))}
            {items.map((item, idx) => {
               const isSelected = idx === selectedIndex;
               return (
                  <div
                     key={item}
                     onClick={() => handleItemClick(idx)}
                     className={`flex items-center justify-center select-none
                        ${isSelected ? "text-white font-semibold" : "text-gray-400"}
                     `}
                     style={{
                        height: ITEM_HEIGHT,
                        fontSize: isSelected ? "17px" : "15px",
                        cursor: "pointer",
                     }}
                  >
                     {String(item).padStart(2, "0")}
                  </div>
               );
            })}
            {/* bottom padding */}
            {Array.from({ length: padCount }).map((_, i) => (
               <div key={`pad-bot-${i}`} style={{ height: ITEM_HEIGHT }} />
            ))}
         </div>
      </div>
   );
};

const DateTimePickerComp: React.FC<DateTimePickerCompProps> = ({
   title,
   value = "",
   onChange,
   layout = "horizontal",
   minWidth,
   textAlign = "right",
   readonly = false,
   require = false,
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const [tempDate, setTempDate] = useState<Date | null>(null);
   const [hour, setHour] = useState(0);
   const [minute, setMinute] = useState(0);
   const [calendarView, setCalendarView] = useState<"date" | "month" | "year">("date");
   const modalRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (value) {
         const d = new Date(value);
         if (!isNaN(d.getTime())) {
            setTempDate(d);
            setHour(d.getHours());
            setMinute(Math.round(d.getMinutes() / 5) * 5);
         }
      } else {
         setTempDate(null);
         setHour(0);
         setMinute(0);
      }
   }, [value]);

   const openPicker = () => {
      if (readonly) return;
      if (value) {
         const d = new Date(value);
         if (!isNaN(d.getTime())) {
            setTempDate(d);
            setHour(d.getHours());
            setMinute(Math.round(d.getMinutes() / 5) * 5);
         } else {
            const now = new Date();
            setTempDate(now);
            setHour(now.getHours());
            setMinute(Math.round(now.getMinutes() / 5) * 5);
         }
      } else {
         const now = new Date();
         setTempDate(now);
         setHour(now.getHours());
         setMinute(Math.round(now.getMinutes() / 5) * 5);
      }
      setCalendarView("date");
      setIsOpen(true);
   };

   const handleConfirm = () => {
      if (tempDate && onChange) {
         const y = tempDate.getFullYear();
         const m = String(tempDate.getMonth() + 1).padStart(2, "0");
         const d = String(tempDate.getDate()).padStart(2, "0");
         const h = String(hour).padStart(2, "0");
         const min = String(minute).padStart(2, "0");
         onChange(`${y}-${m}-${d} ${h}:${min}`);
      }
      setIsOpen(false);
   };

   const handleCancel = () => {
      setIsOpen(false);
   };

   useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
         if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setIsOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, [isOpen]);

   return (
      <div
         className={`${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""} ${
            layout === "flex" ? "flex bg-translate items-center space-x-2" : ""
         }`}
      >
         <label
            className={`${layout === "horizontal" ? "col-span-1 text-right" : ""} ${
               layout === "flex" ? "w-auto" : ""
            }`}
            style={{
               ...(minWidth ? { minWidth } : {}),
               ...(textAlign ? { textAlign } : {}),
            }}
         >
            {title}
         </label>
         <div className={`${layout === "horizontal" ? "col-span-2" : "flex-grow"} relative`}>
            <input
               type="text"
               readOnly
               value={value || ""}
               onClick={openPicker}
               className={`border rounded-md h-8 p-2 w-full cursor-pointer focus:outline-orange-300
                  ${readonly ? "bg-gray-100 text-[#999]" : ""}
                  ${require ? "border-orange-500" : ""}
               `}
               placeholder="날짜/시간 선택"
            />

            {isOpen && (
               <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
                  <div
                     ref={modalRef}
                     className="bg-white rounded-2xl shadow-2xl w-[320px]"
                     style={{ overflow: "hidden" }}
                  >
                     {/* Calendar */}
                     <div className="dtp-calendar px-2 pt-8">
                        <ReactDatePicker
                           selected={tempDate}
                           onChange={(date: Date | null) => {
                              if (calendarView === "year") {
                                 setTempDate(date);
                                 setCalendarView("month");
                              } else if (calendarView === "month") {
                                 setTempDate(date);
                                 setCalendarView("date");
                              } else {
                                 setTempDate(date);
                              }
                           }}
                           inline
                           locale={ko}
                           showMonthYearPicker={calendarView === "month"}
                           showYearPicker={calendarView === "year"}
                           renderCustomHeader={({
                              date: headerDate,
                              decreaseMonth,
                              increaseMonth,
                              decreaseYear,
                              increaseYear,
                              prevMonthButtonDisabled,
                              nextMonthButtonDisabled,
                              prevYearButtonDisabled,
                              nextYearButtonDisabled,
                           }) => {
                              const year = headerDate.getFullYear();
                              const month = headerDate.getMonth() + 1;

                              if (calendarView === "year") {
                                 // year picker: show decade range
                                 const startYear = Math.floor(year / 12) * 12;
                                 return (
                                    <div className="flex items-center justify-between px-2 pb-2">
                                       <button type="button" onClick={decreaseYear} className="dtp-nav-btn"><ChevronLeftIcon className="w-4 h-4" /></button>
                                       <span className="dtp-header-text">
                                          {startYear}년 - {startYear + 11}년
                                       </span>
                                       <button type="button" onClick={increaseYear} className="dtp-nav-btn"><ChevronRightIcon className="w-4 h-4" /></button>
                                    </div>
                                 );
                              }

                              if (calendarView === "month") {
                                 return (
                                    <div className="flex items-center justify-between px-2 pb-2">
                                       <button type="button" onClick={decreaseYear} className="dtp-nav-btn"><ChevronLeftIcon className="w-4 h-4" /></button>
                                       <span
                                          className="dtp-header-text cursor-pointer hover:text-orange-500 transition-colors"
                                          onClick={() => setCalendarView("year")}
                                       >
                                          {year}년
                                       </span>
                                       <button type="button" onClick={increaseYear} className="dtp-nav-btn"><ChevronRightIcon className="w-4 h-4" /></button>
                                    </div>
                                 );
                              }

                              // date view
                              return (
                                 <div className="flex items-center justify-between px-2 pb-2">
                                    <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="dtp-nav-btn"><ChevronLeftIcon className="w-4 h-4" /></button>
                                    <span
                                       className="dtp-header-text cursor-pointer hover:text-orange-500 transition-colors"
                                       onClick={() => setCalendarView("month")}
                                    >
                                       {year}년 {String(month).padStart(2, "0")}월
                                    </span>
                                    <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="dtp-nav-btn"><ChevronRightIcon className="w-4 h-4" /></button>
                                 </div>
                              );
                           }}
                        />
                     </div>

                     {/* Divider */}
                     <div className="mx-4 border-t border-gray-200" />

                     {/* Time Wheels */}
                     <div className="flex items-center justify-center gap-2 py-3 px-4">
                        <div className="w-[90px]">
                           <ScrollWheel items={HOURS} selected={hour} onSelect={setHour} />
                        </div>
                        <span className="text-gray-300 font-light text-lg select-none" style={{ marginTop: -2 }}>:</span>
                        <div className="w-[90px]">
                           <ScrollWheel items={MINUTES} selected={minute} onSelect={setMinute} />
                        </div>
                     </div>

                     {/* Buttons */}
                     <div className="flex justify-center gap-4 px-4 pb-4 pt-1">
                        <button
                           onClick={handleCancel}
                           className="px-7 py-[7px] rounded-full text-[13px] font-bold transition-colors border border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                           취소
                        </button>
                        <button
                           onClick={handleConfirm}
                           className="px-7 py-[7px] rounded-full text-[13px] font-bold transition-colors text-white bg-blue-500 hover:bg-blue-600"
                        >
                           확인
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>

         <style>{`
            /* Calendar container */
            .dtp-calendar .react-datepicker {
               border: none !important;
               width: 100% !important;
               font-family: inherit !important;
               background: transparent !important;
            }
            .dtp-calendar .react-datepicker__month-container {
               width: 100% !important;
            }

            /* Header */
            .dtp-calendar .react-datepicker__header {
               background: white !important;
               border-bottom: none !important;
               padding-top: 8px !important;
               padding-bottom: 0 !important;
            }
            .dtp-calendar .react-datepicker__header--custom {
               padding-bottom: 0 !important;
            }
            /* Hide default nav (using custom header) */
            .dtp-calendar .react-datepicker__navigation {
               display: none !important;
            }
            .dtp-calendar .react-datepicker__current-month {
               display: none !important;
            }
            /* Custom header elements */
            .dtp-nav-btn {
               width: 32px;
               height: 32px;
               border-radius: 50%;
               border: 1px solid #e5e7eb;
               background: white;
               color: #374151;
               font-size: 14px;
               font-weight: 600;
               display: flex;
               align-items: center;
               justify-content: center;
               cursor: pointer;
               transition: all 0.15s;
            }
            .dtp-nav-btn:hover {
               background: #fff7ed;
               border-color: #f97316;
               color: #f97316;
            }
            .dtp-header-text {
               font-size: 16px;
               font-weight: 700;
               color: #1f2937;
            }

            /* Month picker cells */
            .dtp-calendar .react-datepicker__month-text {
               font-size: 14px !important;
               font-weight: 500 !important;
               padding: 8px 0 !important;
               border-radius: 20px !important;
               width: 70px !important;
               margin: 4px !important;
            }
            .dtp-calendar .react-datepicker__month-text:hover {
               background-color: #fff7ed !important;
            }
            .dtp-calendar .react-datepicker__month-text--keyboard-selected,
            .dtp-calendar .react-datepicker__month--selected {
               background-color: #f97316 !important;
               color: #fff !important;
               font-weight: 700 !important;
            }

            /* Year picker cells */
            .dtp-calendar .react-datepicker__year-text {
               font-size: 14px !important;
               font-weight: 500 !important;
               padding: 8px 0 !important;
               border-radius: 20px !important;
               width: 70px !important;
               margin: 4px !important;
            }
            .dtp-calendar .react-datepicker__year-text:hover {
               background-color: #fff7ed !important;
            }
            .dtp-calendar .react-datepicker__year-text--keyboard-selected,
            .dtp-calendar .react-datepicker__year-text--selected {
               background-color: #f97316 !important;
               color: #fff !important;
               font-weight: 700 !important;
            }

            /* Day names row */
            .dtp-calendar .react-datepicker__day-names {
               margin-bottom: 0 !important;
            }
            .dtp-calendar .react-datepicker__day-name {
               width: 36px !important;
               line-height: 36px !important;
               font-size: 13px !important;
               font-weight: 500 !important;
               color: #9ca3af !important;
               margin: 2px !important;
            }
            /* Sunday header red */
            .dtp-calendar .react-datepicker__day-name:first-child {
               color: #ef4444 !important;
            }

            /* Day cells */
            .dtp-calendar .react-datepicker__day {
               width: 36px !important;
               line-height: 36px !important;
               font-size: 15px !important;
               font-weight: 500 !important;
               margin: 2px !important;
               border-radius: 50% !important;
               color: #374151 !important;
            }
            .dtp-calendar .react-datepicker__day:hover {
               border-radius: 50% !important;
               background-color: #fff7ed !important;
            }

            /* Sunday cells red */
            .dtp-calendar .react-datepicker__week .react-datepicker__day:first-child {
               color: #ef4444 !important;
            }

            /* Selected day */
            .dtp-calendar .react-datepicker__day--selected,
            .dtp-calendar .react-datepicker__day--selected:hover {
               background-color: #f97316 !important;
               color: #fff !important;
               border-radius: 50% !important;
               font-weight: 700 !important;
            }

            /* Today */
            .dtp-calendar .react-datepicker__day--today {
               font-weight: 700 !important;
               border: 2px solid #fb923c !important;
               line-height: 32px !important;
            }
            .dtp-calendar .react-datepicker__day--today.react-datepicker__day--selected {
               border: none !important;
               line-height: 36px !important;
            }

            /* Outside month days */
            .dtp-calendar .react-datepicker__day--outside-month {
               color: #d1d5db !important;
            }
            .dtp-calendar .react-datepicker__week .react-datepicker__day--outside-month:first-child {
               color: #d1d5db !important;
            }

            /* Scrollbar hide */
            .scrollbar-hide::-webkit-scrollbar {
               display: none;
            }
            .scrollbar-hide {
               -ms-overflow-style: none;
               scrollbar-width: none;
            }
         `}</style>
      </div>
   );
};

export default DateTimePickerComp;
