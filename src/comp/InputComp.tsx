import React, { forwardRef, useEffect, useRef, useImperativeHandle  } from "react";
import { commas, fetchPost } from "./Import";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DatePicker from "tui-date-picker";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";



interface InputCompProps {
   title: string;
   value?: string; // value prop 추가
   target?: string;
   setChangeGridData?: (target: string, value: string) => void;
   readOnly?: boolean;
   errorMsg?: string;
   type?: string;
   layout?: "horizontal" | "vertical";
   handleCallSearch?: () => void;
   onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
   onkeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputComp = forwardRef<HTMLInputElement, InputCompProps>(
   (
      {
         title,
         value ='', // value prop 추가
         target,
         setChangeGridData,
         readOnly = false,
         errorMsg,
         type,
         onChange,
         onkeyDown,
         layout = "horizontal",
         handleCallSearch,
      },
      ref
   ) => {
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         let newValue = event.target.value;
         if (type === "number") {
            newValue = newValue.replace(/[^0-9]/g, "");
            if (setChangeGridData && target) {
               setChangeGridData(target, newValue);
            }
            newValue = commas(Number(newValue));
            event.target.value = newValue;
         } else {
            if (setChangeGridData && target) {
               setChangeGridData(target, newValue);
            }
         }
         if (onChange) {
            onChange(newValue, event); // value와 event를 전달
         }
      };

      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
         if (e.key === "Enter" && handleCallSearch) {
            handleCallSearch();
         }
         if (onkeyDown) {
            onkeyDown(e);
         }
      };

      return (
         <div>
            <div className={`grid ${layout === "horizontal" ? "grid-cols-3 gap-3 items-center" : ""}`}>
               <label className={`col-span-1 ${layout === "vertical" ? "" : "text-right"}`}>{title}</label>
               <div className={`${layout === "horizontal" ? "col-span-2" : "col-span-1"}`}>
                  <input
                     ref={ref}
                     readOnly={readOnly}
                     value={value} // value 설정
                     type="text"
                     data-type={type === "number" ? "number" : "text"}
                     className={`border rounded-md h-8 p-2 w-full 
                        ${readOnly ? "bg-gray-100" : ""} 
                        ${type === "number" ? "text-right" : ""}
                        focus:outline-orange-300`}
                     onChange={handleChange}
                     onKeyDown={handleKeyDown}
                  />
               </div>
            </div>
            {errorMsg && <label className="text-rose-500 flex justify-end">{errorMsg}</label>}
         </div>
      );
   }
);

interface Props1 {
   title: string;
   readOnly?: boolean;
   errorMsg?: string;
   type?: string;
   handleCallSearch?: () => void;
   onChange?: (e: any) => void;
   onkeyDown?: (e: any) => void;
}

const InputComp1 = forwardRef<HTMLInputElement, Props1>(({ title, handleCallSearch, onChange, onkeyDown, readOnly, errorMsg, type }, ref) => {
   const handleChange = (event: any) => {
      let value = event.target.value;
      if (type === "number") {
         value = value.replace(/[^0-9]/g, "");
         value = commas(Number(value));
         event.target.value = value;
      } else {
         event.target.value = value;
      }
      onChange && onChange(event);
   };

   const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
         if (handleCallSearch) {
            handleCallSearch();
         }
      }
      if (onkeyDown) {
         onkeyDown(e);
      }
   };
   return (
      <div>
        <div className="grid  grid-cols-3 gap-3 items-center">
          <label className="col-span-1 text-right ">{title}</label>
          <div className="col-span-2">
              <input
                ref={ref}
                readOnly={readOnly}
                data-type={type === "number" ? "number" : "text"}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                type="text"
                className={`border rounded-md h-8 p-2 w-full 
                  ${readOnly ? "bg-gray-100" : ""} 
                  ${type === "number" ? "text-right" : ""}
                  focus:outline-orange-300`}
              ></input>
          </div>
        </div>
        <label className="text-rose-500 flex justify-end">{errorMsg}</label>
      </div>
   );
});

interface Props2 {
   title: string;
   target: string;
   setChangeGridData?: (target: string, value: string) => void;
   readOnly?: boolean;
   errorMsg?: string;
   type?: string;
   onChange?: (e: any) => void;
   onkeyDown?: (e: any) => void;
}

const InputComp2 = forwardRef<HTMLInputElement, Props2>(({ title, target, setChangeGridData, readOnly = false, errorMsg, type, onChange, onkeyDown }, ref) => {
   const handleChange = (event: any) => {
      let value = event.target.value;
      if (type === "number") {
         value = value.replace(/[^0-9]/g, "");
         setChangeGridData && setChangeGridData(target, value);
         value = commas(Number(value));
         event.target.value = value;
      } else {
         setChangeGridData && setChangeGridData(target, value);
      }
      onChange && onChange(event);
   };

   const handleKeyDown = (e: any) => {
      if (onkeyDown) {
         onkeyDown(e);
      }
   };

   return (
      <div>
         <label>{title}</label>
         <div>
            <input
               readOnly={readOnly}
               ref={ref}
               type="text"
               data-type={type === "number" ? "number" : "text"}
               className={`border rounded-md h-8 p-2 w-full 
            ${readOnly ? "bg-gray-100" : ""} 
            ${type === "number" ? "text-right" : ""}
            focus:outline-orange-300`}
               onChange={handleChange}
               onKeyDown={handleKeyDown}
            ></input>
         </div>
         <label className="text-rose-500">{errorMsg}</label>
      </div>
   );
});

interface Props3 {
   title: string;
   target?: string;
   value?: string;
   readOnly?: boolean;
   placeholder?: string;
   onChange?: (e: any) => void;
   handleInputSearch: (e: any) => void;
}
const InputSearchComp1 = forwardRef<HTMLInputElement, Props3>(({ title, value, target, readOnly = false, placeholder, handleInputSearch }, ref) => {
   const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
         handleInputSearch(e);
      }
   };

   return (
      <div className="grid grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right">{title}</label>
         <div className="col-span-2 relative">
            <input type="text" 
                  ref={ref} 
                  className="border rounded-md h-8 p-2 w-full focus:outline-orange-300" 
                   value={value} placeholder={placeholder} readOnly={readOnly} 
                   onKeyDown={handleKeyDown}  />
            <MagnifyingGlassIcon
               className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
               onClick={handleInputSearch} // 클릭 시 동일한 함수 호출
            />
         </div>
      </div>
   );
});

interface Props4 {
   title: string;
   value?: string;
   format?: string;
   timePicker?: boolean;
   onChange?: (e: any) => void;
   layout?: "horizontal" | "vertical";
   target?: string;
   setChangeGridData?: (target: string, value: string) => void;
}

const DatePickerComp = forwardRef<HTMLInputElement, Props4>(
   ({ title, value, format = 'yyyy-MM-dd', timePicker = false, onChange, layout = "horizontal", target, setChangeGridData }, ref) => {
      const inputRef = useRef<HTMLInputElement>(null);
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
         const inputElement = inputRef.current;
         const containerElement = containerRef.current;

         if (inputElement && containerElement) {
            const picker = new DatePicker(containerElement, {
               date: value ? new Date(value) : undefined, // 초기 날짜 설정
               input: {
                  element: inputElement, // 연결할 input 요소
                  format: format, // 날짜 포맷
               },
               timePicker: timePicker,
               usageStatistics: false, // 통계 수집 비활성화
               language: "ko", // 한글 설정
            });

            picker.on('change', () => {
               const formattedDate = inputElement.value;

               if (setChangeGridData && target) {
                  setChangeGridData(target, formattedDate);
               }
               if (onChange) {
                  onChange(formattedDate);
               }
            });

            return () => {
               picker.destroy();
            };
         } else {
            console.error("DatePicker 초기화에 필요한 요소를 찾을 수 없습니다.");
         }
      }, [value, onChange]);

      return (
         <div className={`grid ${layout === "horizontal" ? "grid-cols-3 gap-3 items-center" : "grid-cols-1 gap-2"}`}>
            <label className={`col-span-1 ${layout === "vertical" ? "" : "text-right"}`}>{title}</label>
            <div className={`${layout === "horizontal" ? "col-span-2" : "col-span-1"} relative`}>
               <div className="relative  ">
                  <input
                     ref={inputRef}
                     title={title}
                     type="text"
                     className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
                     autoComplete="off"
                     defaultValue={value || ""}
                  />
                  <span
                     className="tui-ico-date absolute top-1/2 right-3 transform -translate-y-1/2 z-10 cursor-pointer"
                     onClick={() => {
                        inputRef.current?.click();
                     }}
                  ></span>
                  <div ref={containerRef}  className="relative z-50"></div>
               </div>
            </div>
         </div>
      );
   }
);

interface DateRangePickerCompProps {
   startValue: string;
   endValue: string;
   title: string;
   onChange?: (startDate: string, endDate: string) => void;
   layout?: "horizontal" | "vertical";
}

const DateRangePickerComp: React.FC<DateRangePickerCompProps> = ({
   startValue,
   endValue,
   title,
   onChange,
   layout = "horizontal"
}) => {
   const startInputRef = useRef<HTMLInputElement>(null);
   const endInputRef = useRef<HTMLInputElement>(null);
   const startContainerRef = useRef<HTMLDivElement>(null);
   const endContainerRef = useRef<HTMLDivElement>(null);
   const startValeIconRef = useRef<HTMLDivElement>(null);
   const endDateValueIconRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const startInputElement = startInputRef.current;
      const endInputElement = endInputRef.current;
      const startContainerElement = startContainerRef.current;
      const endContainerElement = endContainerRef.current;

      if (startInputElement && endInputElement && startContainerElement && endContainerElement) {
         const picker = DatePicker.createRangePicker({
            startpicker: {
               date: startValue ? new Date(startValue) : undefined,
               input: startInputElement,
               container: startContainerElement,
            },
            endpicker: {
               date: endValue ? new Date(endValue) : undefined,
               input: endInputElement,
               container: endContainerElement,
            },
            language: "ko",
            usageStatistics: false,
            format: "yyyy-MM-dd",
         });

         if (startValue && startValeIconRef.current) {
            startValeIconRef.current.style.display = 'none';
         }
         if (endValue && endDateValueIconRef.current) {
            endDateValueIconRef.current.style.display = 'none';
         }

         picker.on("change:start", () => {
            const startDate = startInputElement.value;
            const endDate = endInputElement.value;
            if (startDate && startValeIconRef.current) {
               startValeIconRef.current.style.display = 'none';
            }
            if (onChange) {
               onChange(startDate, endDate);
            }
         });

         picker.on("change:end", () => {
            const startDate = startInputElement.value;
            const endDate = endInputElement.value;
            if (endDate && endDateValueIconRef.current) {
               endDateValueIconRef.current.style.display = 'none';
            }
            if (onChange) {
               onChange(startDate, endDate);
            }
         });

         return () => {
            picker.destroy();
         };
      }
   }, [startValue, endValue, onChange]);

   return (
      <div className={`grid ${layout === "horizontal" ? "grid-cols-3 gap-3 items-center" : "grid-cols-1 gap-2"}`}>
         <label className={`col-span-1 ${layout === "vertical" ? "" : "text-right"}`}>{title}</label>
         <div className={`col-span-2 flex items-center gap-2 w-full`}>
            <div className="relative  w-full">
               <input
                  ref={startInputRef}
                  value={startValue}
                  className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
                  type="text"
                  aria-label="Date"
                  autoComplete="off"
                  readOnly
               />
               <span
                  ref={startValeIconRef}
                  className="tui-ico-date absolute top-1/2 right-3 transform -translate-y-1/2 z-10 cursor-pointer"
                  onClick={() => startInputRef.current?.click()}
               ></span>
               <div ref={startContainerRef}  className="relative z-50"></div>
            </div>
            <div className="relative  w-full">
               <input
                  ref={endInputRef}
                  value={endValue}
                  className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
                  type="text"
                  aria-label="Date"
                  autoComplete="off"
                  readOnly
               />
               <span
                  ref={endDateValueIconRef}
                  className="tui-ico-date absolute top-1/2 right-3 transform -translate-y-1/2 z-10 cursor-pointer"
                  onClick={() => endInputRef.current?.click()}
               ></span>
               <div ref={endContainerRef} className="relative z-50"></div>
            </div>
         </div>
      </div>
   );
};

export { InputComp, InputComp1, InputComp2, InputSearchComp1, DatePickerComp, DateRangePickerComp };
