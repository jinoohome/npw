import React, {forwardRef} from "react";
import { commas, fetchPost } from "./Import";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { he } from "date-fns/locale";
import DOMPurify from "dompurify";


interface TextAreaProps {
  title : string;
  value?: string;
  target?: string;
  setChangeGridData?: (target: string, value: string) => void;
  readonly?: boolean;
  errorMsg?: string;
  type?: string;
  layout?: "horizontal" | "vertical" | "flex";
  width?: string;
  minWidth?: string;
  textAlign?: "left" | "center" | "right";
  height?: string;
  placeholder?: string;
  display? : "flex" | "grid";
  onChange?: (e: any) => void;
  onkeyDown?: (e: any) => void;
  handleCallSearch?: () => void;


}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  title,
  value,
  target,
  setChangeGridData,
  readonly = false,
  errorMsg,
  type,
  layout = "horizontal",
  width,
  height,
  minWidth,
  textAlign="right",
  placeholder,
  display = "grid",
  onChange,
  onkeyDown,
  handleCallSearch

}, ref) => {

  const handleChange = (event: any) => {
    let newValue = event.target.value;
    newValue = DOMPurify.sanitize(newValue);
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
       onChange(newValue); // value와 event를 전달
    }
 };

 const handleKeyDown = (e:any) => {
  if (e.key === "Enter" && handleCallSearch) {
     handleCallSearch();
  }
  if (onkeyDown) {
     onkeyDown(e);
  }
};

  return (
   <div className="h-full">
      <div className={`
                        ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""}
                        ${layout === "flex" ? "flex items-center space-x-2" : ""}
                        ${layout === "vertical" ? "flex flex-col" : ""}
             `}
             style={{height:'100%'}}>
             
      <label className={` ${layout === "horizontal" ? "col-span-1" : ""}
                                   ${layout === "flex" ? " w-auto" : ""}
                           `}   
                           style={{
                              ...(minWidth ? { minWidth: minWidth } : {}),
                              ...(textAlign ? { textAlign: textAlign } : {}),
                           
                           }}>
                              {title}</label>
        <textarea
            ref={ref}
            className={`
                      p-2 border border-gray-200 rounded-md  focus:outline-orange-300 
                      ${layout === "horizontal" ? "col-span-2" : "flex-grow"}
                      ${readonly ? "bg-gray-100 text-[#999]" : ""}
            `}
            value={value}
            placeholder={placeholder}
            readOnly={readonly}
            onChange={handleChange}
            data-type={type === "number" ? "number" : "text"}
            onKeyDown={handleKeyDown}
        />
      
      </div>
      {errorMsg && <label className="text-rose-500 flex justify-end">{errorMsg}</label>}
    </div>

  );
});

const TextArea2 = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
   title,
   value,
   target,
   setChangeGridData,
   readonly = false,
   errorMsg,
   type,
   layout = "horizontal",
   width,
   height,
   minWidth,
   textAlign="right",
   placeholder,
   display = "grid",
   onChange,
   onkeyDown,
   handleCallSearch
 
 }, ref) => {
 
   const handleChange = (event: any) => {
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
        onChange(newValue); // value와 event를 전달
     }
  };
 
  const handleKeyDown = (e:any) => {
   if (e.key === "Enter" && handleCallSearch) {
      handleCallSearch();
   }
   if (onkeyDown) {
      onkeyDown(e);
   }
 };
 
   return (
    <div className="h-full">
       <div className={`
                         ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""}
                         ${layout === "flex" ? "flex items-center space-x-2" : ""}
                         ${layout === "vertical" ? "flex flex-col" : ""}
              `}
              style={{height:'100%'}}>
              
       <label className={` ${layout === "horizontal" ? "col-span-1" : ""}
                                    ${layout === "flex" ? " w-auto" : ""}
                            `}   
                            style={{
                               ...(minWidth ? { minWidth: minWidth } : {}),
                               ...(textAlign ? { textAlign: textAlign } : {}),
                            
                            }}>
                               {title}</label>
         <textarea
             ref={ref}
             className={`
                       p-2 border border-gray-200 rounded-md  focus:outline-orange-300 
                       ${layout === "horizontal" ? "col-span-2" : "flex-grow"}
                       ${readonly ? "bg-gray-100 text-[#999]" : ""}
             `}
             style={{ height: 300 }} 
             value={value}
             placeholder={placeholder}
             readOnly={readonly}
             onChange={handleChange}
             data-type={type === "number" ? "number" : "text"}
             onKeyDown={handleKeyDown}
         />
       
       </div>
       {errorMsg && <label className="text-rose-500 flex justify-end">{errorMsg}</label>}
     </div>
 
   );
 });

export {TextArea, TextArea2};
