import React, { forwardRef } from "react";
import { commas } from "./Import";

interface Props1 {
   title: string;
   handleCallSearch: () => void;
}

const InputComp1 = forwardRef<HTMLInputElement, Props1>(({ title, handleCallSearch }, ref) => {
   return (
      <div className="grid  grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right ">{title}</label>
         <div className="col-span-2">
            <input
               ref={ref}
               onKeyDown={(e) => {
                  e.key === "Enter" && handleCallSearch();
               }}
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
   setChangeGridData: (target: string, value: string) => void;
   readOnly?: boolean;
   errorMsg?: string;
   type?: string;
}

const InputComp2 = forwardRef<HTMLInputElement, Props2>(({ title, target, setChangeGridData, readOnly = false, errorMsg, type }, ref) => {
   

   const handleChange = (event: any) => {
      let value = event.target.value;
      if (type === "number") {
         value = value.replace(/[^0-9]/g, '');
         setChangeGridData(target, value);
         value = commas(Number(value));
         event.target.value = value;
      } else {
         setChangeGridData(target, value);
      }
   };

   
   return (
      <div>
         <label>{title}</label>
         <div>
            <input readOnly={readOnly} ref={ref}   type="text"  data-type={type === 'number'? 'number' : 'text'} onChange={handleChange} 
            className={`border rounded-md h-8 p-2 w-full 
                        ${readOnly ? "bg-gray-100" : ""} 
                        ${type === "number" ? "text-right" : ""}
                        focus:outline-orange-300`}></input>
         </div>
          <label className="text-rose-500">{errorMsg}</label> 
      </div>
   );
});

export { InputComp1, InputComp2 };
