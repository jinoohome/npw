import { read } from "fs";
import React, { useState, forwardRef, useId, useImperativeHandle, useEffect } from "react";

const checkboxStyles = `
   input[type='checkbox']:checked {
      background-image: url('data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%224%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%2220 6 9 17 4 12%22 /%3e%3c/svg%3e');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
   }
`;

interface CheckboxGroupProps {
   options: { label: string; value: string }[];
   title: string;
   values: string[];  // 현재 선택된 값을 부모로부터 받음
   onChange?: (values: string[]) => void;
   layout?: "horizontal" | "vertical";
   target?: string;
   setChangeGridData?: (target: string, value: string) => void;
 }
 
 const CheckboxGroup = forwardRef<HTMLInputElement, CheckboxGroupProps>(
   ({ title, options, values, onChange, layout = "horizontal",target, setChangeGridData }, ref) => {
      const uniqueId = useId();
 
      const handleChange = (selectedValue: string) => {


         if (setChangeGridData && target) {
            setChangeGridData(target, selectedValue);
         }

         let updatedValues;
         if (values.includes(selectedValue)) {
           updatedValues = values.filter((value) => value !== selectedValue);
         } else {
           updatedValues = [...values, selectedValue];
         }
         if (onChange) {
           onChange(updatedValues);
         }
       };
       
     return (
       <>
         <style>{checkboxStyles}</style>
         <div className={` ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""} `}>
           <label className="col-span-1 text-right">{title}</label>
           <div className="col-span-2 flex space-x-4 bg-white border rounded-md">
             {options.map((option) => (
               <div key={option.value} className="flex items-center custom-checkbox h-8 p-2 ps-3 cursor-pointer">
                 <input
                   ref={ref}
                   id={`${uniqueId}-${option.value}`}
                   name={`${uniqueId}-${option.value}`}
                   type="checkbox"
                   value={option.value}
                   checked={values.includes(option.value)}
                   onChange={() => handleChange(option.value)}
                   className="h-4 w-4 cursor-pointer  border border-gray-300  appearance-none bg-white
                        rounded-[4px] checked:bg-blue-500 checked:border-transparent 
                        "
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

interface Props1 {
   options: { label: string; value: string }[];
   name: string;
   title: string;
   defaultIndex?: number[];
   onChange?: (value: string[]) => void;
   onClick?: (value: string) => void;
}

const CheckboxGroup1 = forwardRef<HTMLInputElement, Props1>(({ title, options, name, defaultIndex = [], onChange, onClick }, ref) => {
   const [selectedIndices, setSelectedIndices] = useState(defaultIndex);

   const handleChange = (index: number) => {
      const updatedIndices = selectedIndices.includes(index)
         ? selectedIndices.filter((i) => i !== index)
         : [...selectedIndices, index];

      setSelectedIndices(updatedIndices);
      const selectedValues = updatedIndices.map((i) => options[i].value);
      if (onChange) {
         onChange(selectedValues);
      }
   };

   const handleClick = (index: number) => {
      const selectedValue = options[index].value;
      if (onClick) {
         onClick(selectedValue);
      }
   };

   return (
      <>
         <style>{checkboxStyles}</style>
         <div className="grid grid-cols-3 gap-3 items-center">
            <label className="col-span-1 text-right">{title}</label>
            <div className="col-span-2 flex space-x-4 bg-white rounded-md ">
               {options.map((option, index) => (
                  <div key={option.value} className="flex items-center custom-checkbox h-8 p-2 ps-3 cursor-pointer">
                     <input
                        ref={ref}
                        id={`${name}-${option.value}`}
                        name={name}
                        type="checkbox"
                        value={option.value}
                        checked={selectedIndices.includes(index)}
                        onChange={() => handleChange(index)}
                        onClick={() => handleClick(index)}
                        className="h-4 w-4 appearance-none bg-white border border-gray-300 rounded-[4px] checked:bg-blue-500 checked:border-transparent  cursor-pointer"  // Tailwind CSS classes for larger size
                     />
                     <label htmlFor={`${name}-${option.value}`} className="pl-3 text-gray-700 cursor-pointer">
                        {option.label}
                     </label>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
});

interface Props2 {
   options: { label: string; value: string }[];
   name: string;
   title: string;
   defaultIndex?: number[];
   onChange?: (value: string[]) => void;
   onClick?: (value: string) => void;
}

const CheckboxGroup2 = forwardRef<HTMLInputElement, Props2>(({ title, options, name, defaultIndex = [], onChange, onClick }, ref) => {
   const [selectedIndices, setSelectedIndices] = useState(defaultIndex);

   const handleChange = (index: number) => {
      const updatedIndices = selectedIndices.includes(index)
         ? selectedIndices.filter((i) => i !== index)
         : [...selectedIndices, index];

      setSelectedIndices(updatedIndices);
      const selectedValues = updatedIndices.map((i) => options[i].value);
      if (onChange) {
         onChange(selectedValues);
      }
   };

   const handleClick = (index: number) => {
      const selectedValue = options[index].value;
      if (onClick) {
         onClick(selectedValue);
      }
   };

   return (
      <>
         <style>{checkboxStyles}</style>
         <div>
            <label>{title}</label>
            <div className="flex space-x-4 bg-white border rounded-md ">
               {options.map((option, index) => (
                  <div key={option.value} className="flex items-center custom-checkbox h-8 p-2 ps-3 cursor-pointer ">
                     <input
                        ref={ref}
                        id={`${name}-${option.value}`}
                        name={name}
                        type="checkbox"
                        value={option.value}
                        checked={selectedIndices.includes(index)}
                        onChange={() => handleChange(index)}
                        onClick={() => handleClick(index)}
                        className="h-4 w-4 appearance-none bg-white border border-gray-300 rounded-[4px] checked:bg-blue-500  checked:border-transparent cursor-pointer"  // Tailwind CSS classes for larger size
                     />
                     <label htmlFor={`${name}-${option.value}`} className="pl-3 text-gray-700 cursor-pointer">
                        {option.label}
                     </label>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
});

interface Props3 {
   title: string;
   value?: string;
   checked?: boolean;
   onChange?: (checked: string) => void;
   layout?: "horizontal" | "vertical";
   target?: string;
   readOnly?: boolean;
   setChangeGridData?: (target: string, value: string) => void;
}

const Checkbox = forwardRef<HTMLInputElement, Props3>(
   ({ title, value,  checked = false, onChange, layout ='horizontal',readOnly, target, setChangeGridData }, ref) => {
      const [isChecked, setIsChecked] = useState(checked);
      const uniqueId = useId();

      useEffect(() => {
         setIsChecked(checked);
      }, [checked]);
  
 
      const handleChange = () => {
         
         const newChecked = !isChecked;

         let newValue = 'N';
         if(newChecked){
            newValue = 'Y';
         }

         if (setChangeGridData && target) {
            setChangeGridData(target, newValue);
         }


         setIsChecked(newChecked);
         if (onChange) {
            onChange(newValue);
         }
      };

      return (
         <>
            <style>{checkboxStyles}</style>
            <div className={` ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""} `}>
               <label htmlFor={`${uniqueId}`}  className="col-span-1 text-right cursor-pointer"> {title}  </label>
               <div className="col-span-2 flex items-center ">
                  <input
                     ref={ref}
                     id={`${uniqueId}`}
                     name={`${uniqueId}`}
                     type="checkbox"
                     value={value}
                     checked={isChecked}
                     onChange={handleChange}
                     disabled={readOnly}  
                     className="h-6 w-6 appearance-none bg-white border border-gray-300 rounded-md checked:bg-blue-500 checked:border-transparent cursor-pointer"/>
               </div>
            </div>
         </>
      );
   }
);

export { CheckboxGroup, CheckboxGroup1, CheckboxGroup2, Checkbox };
