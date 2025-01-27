import React, { useState, forwardRef, useId  } from "react";

interface RadioGroupProps {
   options: { label: string; value: string }[];
   title?: string;
   value: string;  // 현재 선택된 값을 부모로부터 받음
   onChange?: (value: string) => void;
   onClick?: (value: string) => void;
   layout?: "horizontal" | "vertical" ;
   target?: string;
   setChangeGridData?: (target: string, value: string) => void;
   readonly?: boolean;
 }
 
 const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
   ({ title, options, value, onChange, onClick, layout = "horizontal", target, setChangeGridData, readonly=false }, ref) => {
     const uniqueId = useId(); // 컴포넌트별로 고유한 ID 생성
 
     const handleChange = (selectedValue: string) => {

      if (setChangeGridData && target) {
         setChangeGridData(target, selectedValue);
      }
      
       if (onChange) {
         onChange(selectedValue);
       }
     };
 
     const handleClick = (selectedValue: string) => {
       if (onClick) {
         onClick(selectedValue);
       }
     };

     const radioboxStyles = `
    

         input[type='radio']:disabled {
            background-color: #f3f4f6; /* Gray background for disabled */
            border-color: #d1d5db; /* Light gray border for disabled */
         }

         input[type='radio']:disabled:checked {
            background-image: url('data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22#9ca3af%22 stroke-width=%224%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3ccircle cx=%2212%22 cy=%2212%22 r=%2210%22/%3e%3c/svg%3e');
            background-color: #e5e7eb; /* Light gray for disabled checked */
            border-color: #9ca3af; /* Darker gray border for disabled checked */
         }
      `;
 
     return (
         <>
         <style>{radioboxStyles}</style>
         <div className={layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""}>
            <label className={`${layout === "horizontal" ? "col-span-1 text-right" : ""}
                                 ${!title ? "hidden" : ""}                 
            `}>{title}</label>
            <div className={`col-span-2 flex space-x-4 bg-white border rounded-md ${layout === "horizontal" ? "flex-row" : ""}`}>
            {options.map((option, index) => (
               <div key={index} className="flex items-center custom-radio h-8 p-2 ps-3 cursor-pointer">
                  <input
                  ref={ref}
                  id={`${uniqueId}-${option.value}`}  // 고유한 id 생성
                  type="radio"
                  value={option.value}
                  checked={value === option.value}  // 선택된 값과 비교하여 체크 상태 설정
                  onChange={() => handleChange(option.value)}
                  onClick={() => handleClick(option.value)}
                  disabled={readonly} 
                  className={`h-4 w-4 cursor-pointer rounded-full border border-gray-300 appearance-none 
                           bg-white checked:bg-white checked:border-4 checked:border-blue-500
                           ${readonly ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"}`}
                  />
                  <label htmlFor={`${uniqueId}-${option.value}`} className="pl-3 text-gray-700 cursor-pointer">
                  {option.label}
                  </label>
               </div>
            ))}
            </div>
         </div>
         </>
     );
   }
 );
 
 export default RadioGroup;

interface Props2 {
   options: { label: string; value: string }[];
   name: string;
   title: string;
   defaultIndex?: number;
   onChange?: (value: string) => void;
   onClick?: (value: string) => void;
}

const RadioGroup2 = forwardRef<HTMLInputElement, Props2>(({ title, options, name, defaultIndex = 0, onChange, onClick }, ref) => {
   const [selectedIndex2, setSelectedIndex2] = useState(defaultIndex);

   const handleChange2 = (index: number) => {
      setSelectedIndex2(index);
      const selectedValue = options[index].value;
      if (onChange) {
         onChange(selectedValue);
      }
   };

   const handleClick2 = (index: number) => {
      const selectedValue = options[index].value;
      if (onClick) {
         onClick(selectedValue);
      }
   };

   return (
      <div>
         <label>{title}</label>
         <div className="flex space-x-4 bg-white border rounded-md ">
            {options.map((option, index) => (
               <div key={option.value} className="flex items-center custom-radio h-8 p-2 ps-3 cursor-pointer">
                  <input
                     ref={ref}
                     id={`${name}-${option.value}`}
                     name={name}
                     type="radio"
                     value={option.value}
                     checked={selectedIndex2 === index}
                     onChange={() => handleChange2(index)}
                     onClick={() => handleClick2(index)}
                     className="h-4 w-4 cursor-pointer  rounded-full border 
                     border-gray-300 appearance-none bg-white  
                     checked:bg-white checked:border-4 checked:border-blue-500"
                  />
                  <label htmlFor={`${name}-${option.value}`} className="pl-3 text-gray-700 cursor-pointer">
                     {option.label}
                  </label>
               </div>
            ))}
         </div>
      </div>
   );
});

export { RadioGroup, RadioGroup2 };
