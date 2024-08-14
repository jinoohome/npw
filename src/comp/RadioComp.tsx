import React, { useState, forwardRef } from "react";

interface Props1 {
   options: { label: string; value: string }[];
   name: string;
   title: string;
   defaultIndex?: number;
   onChange?: (value: string) => void;
   onClick?: (value: string) => void;
}

const RadioGroup1 = forwardRef<HTMLInputElement, Props1>(({ title, options, name, defaultIndex = 0, onChange, onClick }, ref) => {
   const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

   const handleChange = (index: number) => {
      setSelectedIndex(index);
      const selectedValue = options[index].value;
      if (onChange) {
         onChange(selectedValue);
      }
   };

   const handleClick = (index: number) => {
      const selectedValue = options[index].value;
      if (onClick) {
         onClick(selectedValue);
      }
   };

   return (
      <div className="grid grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right">{title}</label>
         <div className="col-span-2 flex space-x-4 bg-white  rounded-md ">
            {options.map((option, index) => (
               <div key={option.value} className="flex items-center custom-radio h-8 p-2 ps-3 cursor-pointer">
                  <input
                     ref={ref}
                     id={`${name}-${option.value}`}
                     name={name}
                     type="radio"
                     value={option.value}
                     checked={selectedIndex === index}
                     onChange={() => handleChange(index)}
                     onClick={() => handleClick(index)}
                     className="h-4 w-4 cursor-pointer"  // Tailwind CSS classes for larger size
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
                     className="h-4 w-4 cursor-pointer"
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

export { RadioGroup1, RadioGroup2 };
