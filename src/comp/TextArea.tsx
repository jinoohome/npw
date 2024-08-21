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
  width?: number;
  height?: number;
  placeholder?: string;
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
  placeholder,
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
    <div>
      <div className={`${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : "" } `}>
      <label className={`col-span-1 ${layout === "vertical" ? "" : "text-right"}`}>{title}</label>
        <textarea
            ref={ref}
            className={`col-span-2 p-2 border border-gray-300 rounded-lg
                        ${width ? `w-[${width}px]` : "w-full"}
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
