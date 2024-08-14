import React, { forwardRef, useEffect, useRef } from "react";
import { commas, fetchPost } from "./Import";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';


interface Props1 {
   title: string;
   handleCallSearch: () => void;
   onChange?: (e: any) => void;
   onkeyDown?: (e: any) => void;
}

const InputComp1 = forwardRef<HTMLInputElement, Props1>(({ title, handleCallSearch, onChange, onkeyDown }, ref) => {

   const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
          handleCallSearch();
      }
      if (onkeyDown) {
          onkeyDown(e);
      }
  };
   return (
      <div className="grid  grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right ">{title}</label>
         <div className="col-span-2">
            <input
               ref={ref}
               onKeyDown={handleKeyDown}
               onChange={onChange}
               type="text"
               className=" border rounded-md h-8 p-2 w-full
                  focus:outline-orange-300"
            ></input>
         </div>
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

const InputComp2 = forwardRef<HTMLInputElement, Props2>(({ title, target, setChangeGridData, readOnly = false, errorMsg, type, onChange,  onkeyDown }, ref) => {
   

   const handleChange = (event: any) => {
      let value = event.target.value;
      if (type === "number") {
         value = value.replace(/[^0-9]/g, '');
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
            <input readOnly={readOnly} ref={ref}   type="text"  data-type={type === 'number'? 'number' : 'text'} 
            className={`border rounded-md h-8 p-2 w-full 
            ${readOnly ? "bg-gray-100" : ""} 
            ${type === "number" ? "text-right" : ""}
            focus:outline-orange-300`}
            onChange={handleChange} 
            onKeyDown={handleKeyDown}
            >
            </input>
         </div>
          <label className="text-rose-500">{errorMsg}</label> 
      </div>
   );
});


interface Props3 {
   title: string;
   target?: string;
   readOnly?: boolean;
   placeholder?: string;
   handleInputSearch: (e: any) => void;
 }
 const InputSearchComp1 = forwardRef<HTMLInputElement, Props3>( 
   ( { title, target, readOnly = false, placeholder, handleInputSearch }, ref ) => {
 
     const handleKeyDown = (e:any) => {
       if (e.key === 'Enter') {
         handleInputSearch(e);
       }
     };
 
     return (
       <div className="grid grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right">{title}</label>
         <div className="col-span-2 relative">
           <input
             type="text"
             className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
             placeholder={placeholder}
             readOnly={readOnly}
             onKeyDown={handleKeyDown}
             ref={ref}
           />
           <MagnifyingGlassIcon
             className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
             onClick={handleInputSearch} // 클릭 시 동일한 함수 호출
           />
         </div>
       </div>
     );
   }
 );


 interface Props4 {
   title: string;
   id: string;
   selectedDate?: string;
   onChange?: (date: string) => void;
 }

 const DatePickerComp: React.FC<Props4> = ({ id, title, selectedDate, onChange }) => {
   useEffect(() => {
     const inputElement = document.getElementById(`${id}-target`) as HTMLInputElement;
     const containerElement = document.getElementById(`${id}-container`);
 
     if (inputElement && containerElement) {
       const picker = new DatePicker(containerElement, {
         date: selectedDate ? new Date(selectedDate) : undefined, // 초기 날짜 설정
         input: {
           element: inputElement, // 연결할 input 요소
           format: 'yyyy-MM-dd', // 날짜 포맷
         },
         usageStatistics: false, // 통계 수집 비활성화
         language: 'ko', // 한글 설정
       });

       picker.on('change', (date: Date | null) => {
         if (date) {
           if (onChange){
             onChange(date.toISOString().split('T')[0]);
           }
         }
       });
 
       const iconElement = containerElement.querySelector('.tui-ico-date');
       if (iconElement) {
         iconElement.addEventListener('click', () => {
           inputElement.click();
         });
       }
     } else {
       console.error('DatePicker 초기화에 필요한 요소를 찾을 수 없습니다.');
     }
   }, []);

   return (
     <div className="grid grid-cols-3 gap-3 items-center">
       <label className="col-span-1 text-right">{title}</label>
       <div className="col-span-2 relative z-40">
         <div className="relative">
           <input
             id={`${id}-target`}
             title={title}
             type="text"
             className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
             defaultValue={selectedDate || ''}
             autoComplete="off"
           />
           <span
             className="tui-ico-date absolute top-1/2 right-3 transform -translate-y-1/2 z-10 cursor-pointer"
             onClick={() => document.getElementById(`${id}-target`)?.click()}
           ></span>
           <div id={`${id}-container`}></div>
         </div>
       </div>
     </div>
   );
};

export { InputComp1, InputComp2, InputSearchComp1, DatePickerComp };
