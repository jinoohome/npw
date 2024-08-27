import React, {forwardRef} from "react";
import { commas, fetchPost } from "./Import";
import { ChevronRightIcon } from "@heroicons/react/24/outline";



interface TextAreaProps {
  title : string;
  value?: string;
  target?: string;
  setChangeGridData?: (target: string, value: string) => void;
  readOnly?: boolean;
  errorMsg?: string;
  type?: string;
  layout?: "horizontal" | "vertical";
  width?: string;
  labelWidth?: string;
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
  readOnly = false,
  errorMsg,
  type,
  layout = "horizontal",
  width,
  height,
  labelWidth,
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
    <div >
      <div className={`${layout === "horizontal" && display === "grid"  ? "grid grid-cols-3 gap-3 items-center" : "" } 
                       ${layout === "horizontal" && display === "flex"  ? "flex w-full" : "" }
      `}> 
      <label className={`${layout === "horizontal" && display === "grid" ? "col-span-1 text-right" : "w-full"}
                         ${layout === "horizontal" && display === "flex" && labelWidth ? `w-${labelWidth} text-right px-3` : ""}
                         
                    `}>{title}</label>
        <textarea
            ref={ref}
            className={`
                      p-2 border border-gray-200 rounded-md  focus:outline-orange-300
                      ${layout === "horizontal"  && display === "grid"  ? "col-span-2" : ""}  
                      ${layout === "horizontal" && display === "flex" && width ? `w-${width}` : "w-full"}
                      ${height ? `h-[${height}px]` : ""}
            `}
            value={value}
            placeholder={placeholder}
            readOnly={readOnly}
            onChange={handleChange}
            data-type={type === "number" ? "number" : "text"}
            onKeyDown={handleKeyDown}
        />
      
      </div>
      {errorMsg && <label className="text-rose-500 flex justify-end">{errorMsg}</label>}
    </div>

  );
});

export {TextArea};
