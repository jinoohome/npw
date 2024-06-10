import React, { forwardRef } from "react";
import {  ChevronDownIcon} from "@heroicons/react/24/outline";

interface Props1 {
   title: string;
   handleCallSearch: () => void;
}
const SelectComp1 = forwardRef<HTMLSelectElement, Props1>(({ title, handleCallSearch }, ref) => {
   return (
      <div className="grid  grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right ">{title}</label>
         <div className="col-span-2">
            <select
               ref={ref}
               onChange={handleCallSearch}
               className="border rounded-md h-8 p-2 w-full
                  focus:outline-orange-300"
            ></select>
         </div>
      </div>
   );
});

interface Props2 {
   title: string;
   target: string;
   setChangeGridData: (target: string, value: string) => void;
}
const SelectComp2 = forwardRef<HTMLSelectElement, Props2>(({ title, target, setChangeGridData }, ref) => {
   return (
      <div>
         <label>{title}</label>
         <div>
            <select
               ref={ref}
               onChange={(event) => setChangeGridData(target, event.target.value)}
               className="border rounded-md h-3 p-2 w-full
                              focus:outline-orange-300"
            ></select>
         </div>
      </div>
   );
});


interface Props3 {
    placeholder: string;
    handleSelectChange: (value: string) => void; 
}

const SelectComp3 = forwardRef<HTMLSelectElement, Props3>(({ placeholder, handleSelectChange }, ref) => {
  return (
    <div>
      <select
        ref={ref}
        onChange={(event) => handleSelectChange(event.target.value)}
        defaultValue="" // 기본값 설정
        className="border rounded-md h-3 p-2 w-full focus:outline-orange-300"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {/* 다른 옵션들 추가 가능 */}
      </select>
    </div>
  );
});
 

export { SelectComp1, SelectComp2, SelectComp3 };
