import React, { forwardRef, useEffect, useRef, useImperativeHandle, useState  } from "react";
import { commas, fetchPost } from "./Import";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DatePicker from "tui-date-picker";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; 
import '../css/datePicker.css';
import { read } from "fs";




interface InputCompProps {
   title: string;
   value?: string; // value prop 추가
   target?: string;
   setChangeGridData?: (target: string, value: string) => void;
   readOnly?: boolean;
   errorMsg?: string;
   type?: string;
   layout?: "horizontal" | "vertical" | "flex";
   minWidth? : string;
   handleCallSearch?: () => void;
   onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
   onkeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
   textAlign?: "left" | "center" | "right";

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
         minWidth,
         textAlign="right"
      },
      ref
   ) => {

      const [internalValue, setInternalValue] = useState(value);

      // 포맷팅된 값을 별도로 관리
      const [formattedValue, setFormattedValue] = useState(value);

      useEffect(() => {
         if (type === "number" && value) {
            setFormattedValue(commas(value)); // 포맷팅된 값을 설정
         } else {
            setFormattedValue(value);
         }
         setInternalValue(value); // 실제 값을 설정
      }, [value, type]);

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         let newValue = event.target.value.replace(/,/g, ''); // 포맷팅 제거된 값

         if (type === "number") {
            if (setChangeGridData && target) {
               setChangeGridData(target, newValue);
            }
            setFormattedValue(commas(newValue)); // 포맷된 값을 다시 설정
         } else {
            setFormattedValue(newValue);
            if (setChangeGridData && target) {
               setChangeGridData(target, newValue);
            }
         }

         setInternalValue(newValue); // 실제 값을 업데이트

         if (onChange) {
            onChange(newValue, event); // 실제 값과 이벤트를 전달
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
            <div className={` ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""}
                              ${layout === "flex" ? "flex items-center space-x-2" : ""}
             `}>
               <label className={` ${layout === "horizontal" ? "col-span-1 text-right" : ""}
                                   ${layout === "flex" ? " w-auto" : ""}
                           `}   
                           style={{
                              ...(minWidth ? { minWidth: minWidth } : {}),
                              ...(textAlign ? { textAlign: textAlign } : {})
                           }}>
                              {title}</label>
               <div className={`${layout === "horizontal" ? "col-span-2" : "flex-grow"}`}>
                  <input
                     ref={ref}
                     readOnly={readOnly}
                     value={formattedValue} // 포맷팅된 값을 표시
                     type="text"
                     data-type={type === "number" ? "number" : "text"}
                     className={`border rounded-md h-8 p-2 w-full 
                        ${readOnly ? "bg-gray-100" : ""} 
                        ${type === "number" ? "text-right" : ""}
                        ${layout === "flex" ? "w-full" : ""}
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

interface InputSearchCompProps {
   title: string;
   target?: string;
   value?: string;
   readOnly?: boolean;
   placeholder?: string;
   onChange?: (value: string) => void;
   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
   onIconClick?: (value: string) => void;
   layout?: 'horizontal' | 'vertical' | 'flex';
   minWidth?: string;
   textAlign?: 'left' | 'center' | 'right';
 }
 
 const InputSearchComp = forwardRef<HTMLInputElement, InputSearchCompProps>(
   ({ title, value = '', layout='horizontal', minWidth, target, readOnly = false, placeholder, textAlign ='right', onChange, onKeyDown, onIconClick }, ref) => {
     const inputRef = useRef<HTMLInputElement>(null);
 
     // Combine the forwarded ref with the internal ref
     useImperativeHandle(ref, () => inputRef.current!);
 
     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
       if (e.key === "Enter" && onKeyDown) {
         onKeyDown(e);
       }
     };
 
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       if (onChange) {
         onChange(e.target.value);
       }
     };
 
     const handleIconClick = () => {
       if (inputRef.current && onIconClick) {
         onIconClick(inputRef.current.value);
       }
     };
 
     return (
       <div className={` ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""}
                      ${layout === "flex" ? "flex items-center space-x-2" : ""}

         `}>      
            <label className={` ${layout === "horizontal" ? "col-span-1 text-right" : ""}
                                     ${layout === "flex" ? " w-auto" : ""}

                           `} style={{
                              ...(minWidth ? { minWidth: minWidth } : {}),
                              ...(textAlign ? { textAlign: textAlign } : {})
                           }}>{title}</label>
        <div className={`relative ${layout === "horizontal" ? "col-span-2" : "flex-grow"}

        `}>
           <input
             type="text"
             ref={inputRef}
             className={`border rounded-md h-8 p-2 w-full focus:outline-orange-300 
                       ${readOnly ? "bg-gray-100" : ""}
                  
             `}
             value={value}
             placeholder={placeholder}
             readOnly={readOnly}
             onKeyDown={handleKeyDown}
             onChange={handleChange}
           />
           <MagnifyingGlassIcon
             className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
             onClick={handleIconClick}
           />
         </div>
       </div>
     );
   }
 );
 
 

 interface Props3 {
   title: string;
   target?: string;
   value?: string;
   readOnly?: boolean;
   placeholder?: string;
   onChange?: (e: any) => void;
   handleInputSearch?: (e: any) => void;
}
const InputSearchComp1 = forwardRef<HTMLInputElement, Props3>(({ title, value ='', target, readOnly = false, placeholder,onChange, handleInputSearch }, ref) => {
   const inputRef = useRef<HTMLInputElement>(null);
   
   const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
         if (handleInputSearch) {
         handleInputSearch(e);
         }
      }
   };

   const handleChange = (e: any) => {

      if (onChange) {
         onChange(e.target.value);
      }
   }

   const handleIconClick = () => {
      if (inputRef.current && handleInputSearch) {
         handleInputSearch({ target: inputRef.current });
      }
   };

   return (
      <div className="grid grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right">{title}</label>
         <div className="col-span-2 relative">
            <input
               type="text"
               ref={ref || inputRef}
               className={`border rounded-md h-8 p-2 w-full focus:outline-orange-300
                           ${readOnly ? "bg-gray-100" : ""}
               `}
               
               value={value}
               placeholder={placeholder}
               readOnly={readOnly}
               onKeyDown={handleKeyDown}
               onChange={handleChange}
            />
            <MagnifyingGlassIcon
               className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
               onClick={handleIconClick} // 클릭 시 동일한 함수 호출
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
   onChange?: (value: string | null) => void;
   onClick?: () => void;
   layout?: 'horizontal' | 'vertical' | 'flex';
   target?: string;
   setChangeGridData?: (target: string, value: string) => void;
   minWidth?: string;
   textAlign?: "left" | "center" | "right";
   readonly?: boolean;
}

const DatePickerComp = forwardRef<HTMLInputElement, Props4>(
   ({ title, value = '', format = 'yyyy-MM-dd', timePicker = false, readonly =false, textAlign = "right", onChange, onClick, layout = 'horizontal', minWidth }, ref) => {
       const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);

       useEffect(() => {
           if (value) {
               setSelectedDate(new Date(value));
           } else {
               setSelectedDate(null);
           }
       }, [value]);

       const handleChange = (date: Date | null) => {
           if (date) {
               let formattedDate;

               if (timePicker) {
                   const year = date.getFullYear();
                   const month = (date.getMonth() + 1).toString().padStart(2, '0');
                   const day = date.getDate().toString().padStart(2, '0');
                   const hours = date.getHours().toString().padStart(2, '0');
                   const minutes = date.getMinutes().toString().padStart(2, '0');

                   formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
               } else {
                   const year = date.getFullYear();
                   const month = (date.getMonth() + 1).toString().padStart(2, '0');
                   const day = date.getDate().toString().padStart(2, '0');

                   formattedDate = `${year}-${month}-${day}`;
               }

               setSelectedDate(date);

               if (onChange) {
                   onChange(formattedDate);
               }
           } else if (onChange) {
               setSelectedDate(null);
               onChange(null);
           }
       };

       const handleClick = () => {
           if (onClick) {
               onClick(); // onClick 함수가 전달되면 실행
           }
       };

       return (
           <div
               className={` ${layout === 'horizontal' ? 'grid grid-cols-3 gap-3 items-center' : ''} ${
                   layout === 'flex' ? 'flexbg-gray-100 items-center space-x-2' : ''
               }`}
           >
               <label
                   className={` ${layout === 'horizontal' ? 'col-span-1 text-right' : ''} ${
                       layout === 'flex' ? 'w-auto' : ''
                   }`}
                   style={{
                     ...(minWidth ? { minWidth: minWidth } : {}),
                     ...(textAlign ? { textAlign: textAlign } : {})
                  }}>
                   {title}
               </label>
               <div className={`${layout === 'horizontal' ? 'col-span-2' : 'flex-grow'}`}>
                   <div className="w-full">
                       <ReactDatePicker
                           selected={selectedDate}
                           onChange={handleChange}
                           onInputClick={handleClick}
                           dateFormat={format}
                           showTimeSelect={timePicker}
                           timeFormat="p"
                           readOnly = {readonly}
                           timeIntervals={30}
                           locale={ko}
                           className={`border rounded-md h-8 p-2 w-full focus:outline-orange-300
                                       ${readonly ? "bg-gray-100" : ""}
                                    `}
                           wrapperClassName="w-full z-50"
                           popperClassName="custom-datepicker-popper"  
                           showIcon
                       />
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
   onChange?: (startDate: string | undefined, endDate: string | undefined) => void;
   layout?: 'horizontal' | 'vertical';
   startPlaceholder?: string;
   endPlaceholder?: string;
   handleCallSearch?: () => void;
}

const DateRangePickerComp: React.FC<DateRangePickerCompProps> = ({
   startValue = '',
   endValue = '',
   title,
   onChange,
   layout = 'horizontal',
   startPlaceholder,
   endPlaceholder,
   handleCallSearch
}) => {
   const [startDate, setStartDate] = useState<Date | undefined>(startValue ? new Date(startValue) : undefined);
   const [endDate, setEndDate] = useState<Date | undefined>(endValue ? new Date(endValue) : undefined);


   useEffect(() => {

      if (startValue) {
         setStartDate(new Date(startValue));
      }else{
         setStartDate(undefined);
      }
   }, [startValue]);

   useEffect(() => {

      if (endValue) {
         setEndDate(new Date(endValue));
      }else{
         setEndDate(undefined);
      }
   }, [endValue]);


   useEffect(() => {
     
      if (onChange) {
         let formattedStartDate: string | undefined = undefined;
         let formattedEndDate: string | undefined = undefined;

         if (startDate) {
            // 날짜를 "YYYY-MM-DD" 형식으로 변환
            formattedStartDate = startDate.toISOString().substring(0, 10);
          
         }

         if (endDate) {
            // 날짜를 "YYYY-MM-DD" 형식으로 변환
            formattedEndDate = endDate.toISOString().substring(0, 10);
          
         }

         onChange(formattedStartDate, formattedEndDate);
      }
   }, [startDate, endDate]);

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && handleCallSearch) {
         console.log('enter')
         handleCallSearch();
      }
    
   };

   const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onKeyDown, placeholder }, ref) => (
      <input
        ref={ref}
        onClick={onClick}
        onKeyDown={onKeyDown}
        value={value}
        placeholder={placeholder}
        className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
        readOnly
      />
    ));


   return (
       <div className={`grid ${layout === 'horizontal' ? 'grid-cols-3 gap-3 items-center' : 'grid-cols-1 '}`}>
           <label className={`col-span-1 ${layout === 'vertical' ? '' : 'text-right'}`}>{title}</label>
           <div className={`col-span-2 flex items-center gap-2 w-full`}>
               <div className="relative w-full">
                   <ReactDatePicker
                       selected={startDate}
                       onChange={(date: Date | null) => setStartDate(date || undefined)}
                       selectsStart
                       startDate={startDate}
                       endDate={endDate}
                       dateFormat="yyyy-MM-dd"
                       className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
                       placeholderText={startPlaceholder}
                       locale={ko}
                       wrapperClassName="w-full z-50"
                       popperClassName="custom-datepicker-popper" 
                       showIcon = {!startDate}
                       customInput={<CustomInput onKeyDown={handleKeyDown} placeholder={startPlaceholder} />}
                      
                   />
               </div>
               <div className="relative w-full">
                   <ReactDatePicker
                       selected={endDate}
                       onChange={(date: Date | null) => setEndDate(date || undefined)}
                       selectsEnd
                       startDate={startDate}
                       endDate={endDate}
                       minDate={startDate}
                       dateFormat="yyyy-MM-dd"
                       className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
                       placeholderText={endPlaceholder}
                       locale={ko}
                       wrapperClassName="w-full z-50"
                       popperClassName="custom-datepicker-popper" 
                       showIcon = {!endDate}
                       customInput={<CustomInput onKeyDown={handleKeyDown} placeholder={startPlaceholder} />}
                       
                   />
               </div>
           </div>
       </div>
   );
};


export { InputComp, InputComp1, InputComp2, InputSearchComp, InputSearchComp1, DatePickerComp, DateRangePickerComp };
