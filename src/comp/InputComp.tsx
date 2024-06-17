import React, { forwardRef } from "react";

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
}

const InputComp2 = forwardRef<HTMLInputElement, Props2>(({ title, target, setChangeGridData, readOnly = false }, ref) => {
   
   
   return (
      <div>
         <label>{title}</label>
         <div>
            <input readOnly={readOnly} ref={ref} type="text" onChange={(event) => setChangeGridData(target, event.target.value)} 
            className={`border rounded-md h-8 p-2 w-full ${readOnly ? "bg-gray-100" : ""} focus:outline-orange-300`}></input>
         </div>
      </div>
   );
});

export { InputComp1, InputComp2 };
