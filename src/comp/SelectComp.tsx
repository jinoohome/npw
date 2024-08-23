import React, { forwardRef, useEffect, useRef, useImperativeHandle  } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Choices from 'choices.js';
import "../css/inputChoicejs.css";
import "../css/gridChoicejs.css";
import "choices.js/public/assets/styles/choices.min.css";
import { fetchPost } from "../util/fetch"; 
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface Props1 {
   title: string;
   handleCallSearch?: () => void;
   onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
const SelectComp1 = forwardRef<HTMLSelectElement, Props1>(({ title, handleCallSearch, onChange }, ref) => {
   
   const selectRef = ref as React.RefObject<HTMLSelectElement>;
   
   
   // useEffect(() => {
   //    if (selectRef.current) {
   //      const newChoices = new Choices(selectRef.current, {
   //          removeItemButton: false,
   //          shouldSort: false,
   //          itemSelectText: "",
   //          allowHTML: true,
   //       });

   //       return () => {
   //          newChoices.destroy();
   //        };
        
   //    }

   // }, []);
 
 
   return (
      <div className="grid grid-cols-3 gap-3 items-center">
         <label className="col-span-1 text-right ">{title}</label>
         <div className="col-span-2">
            <select
               ref={ref}
               onChange={(event) => {
                  if (handleCallSearch){
                     handleCallSearch();
                     if (onChange) {
                        onChange(event);
                     }
                  }
               }}
               className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
            ></select>
         </div>
      </div>
   );
});

interface Props2 {
   title: string;
   target: string;
   setChangeGridData?: (target: string, value: string) => void;
   onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
const SelectComp2 = forwardRef<HTMLSelectElement, Props2>(({ title, target, setChangeGridData, onChange }, ref) => {
   return (
      <div>
         <label>{title}</label>
         <div>
            <select
               ref={ref}
               onChange={(event) => {
                  if (setChangeGridData) {
                     setChangeGridData(target, event.target.value);
                  }
                  if (onChange) {
                     onChange(event);
                  }
               }}
               className="border rounded-md h-3 p-2 w-full focus:outline-orange-300"
            ></select>
         </div>
      </div>
   );
});

interface Props3 {
    placeholder: string;
    handleSelectChange: (value: string) => void;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectComp3 = forwardRef<HTMLSelectElement, Props3>(({ placeholder, handleSelectChange, onChange }, ref) => {
  return (
    <div>
      <select
        ref={ref}
        onChange={(event) => {
          handleSelectChange(event.target.value);
          if (onChange) {
            onChange(event);
          }
        }}
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


 interface Props4 {
  title: string;
  value?: string; // 초기 선택 값
  handleCallSearch?: () => void;
  onChange?: (label:string, value:string) => void;
  procedure?: string;
  param?: any;
  dataKey?: { value: string; label: string };
  layout?: "horizontal" | "vertical"; // 레이아웃 옵션 추가
  target?: string;
  setChangeGridData?: (target: string, value: string) => void;
  stringify?: boolean;
  datas?: any[];
}

// HTMLSelectElement와 추가 메서드를 포함하는 타입 정의
interface SelectSearchCompRef extends HTMLSelectElement {
  getChoicesInstance: () => Choices | null;
  updateChoices: (items: { value: string; label: string }[]) => void;
}

const SelectSearchComp = forwardRef<SelectSearchCompRef, Props4>(
  ({ title, value, handleCallSearch, onChange, procedure, param, dataKey, stringify, layout = "horizontal", target, setChangeGridData, datas }, ref) => {
     const localRef = useRef<HTMLSelectElement>(null);
     const choicesInstanceRef = useRef<Choices | null>(null);

     // useImperativeHandle을 사용하여 부모 컴포넌트에서 ref로 Choices 인스턴스에 접근할 수 있도록 설정
     useImperativeHandle(ref, () => ({
        ...localRef.current!,
        getChoicesInstance: () => choicesInstanceRef.current,
        updateChoices: (items) => {
           const choiceInstance = choicesInstanceRef.current;
           if (choiceInstance) {
              // 기존 선택지 삭제
              choiceInstance.clearChoices();
              // 새로운 선택지 설정
               choiceInstance.setChoices(items, 'value', 'label', true);
              if (value) {
                 choiceInstance.setChoiceByValue(value); // 초기값 설정
              }
           } else {
              console.error("Choices 인스턴스가 초기화되지 않았습니다.");
           }
        },
        setChoiceByValue: (value: any) => {
          const choiceInstance = choicesInstanceRef.current;
          if (choiceInstance) {
              if (value) {
                  choiceInstance.setChoiceByValue(value); // 주어진 값으로 선택 설정
              } else {
                  const currentValue = choiceInstance.getValue(true);
                  
                  if (Array.isArray(currentValue)) {
                      currentValue.forEach((val) => {
                          if (typeof val === 'string') {
                              choiceInstance.removeActiveItemsByValue(val); // string 타입 값에 대해 선택 해제
                          } else if (val && typeof val === 'object' && 'value' in val) {
                              choiceInstance.removeActiveItemsByValue(val.value); // Item 객체의 value 속성 사용
                          }
                      });
                  } else if (typeof currentValue === 'string') {
                      choiceInstance.removeActiveItemsByValue(currentValue); // 단일 string 값에 대해 선택 해제
                  } else if (currentValue && typeof currentValue === 'object' && 'value' in currentValue) {
                      choiceInstance.removeActiveItemsByValue(currentValue.value); // 단일 Item 객체의 value 속성 사용
                  }
              }
          }
      }
        
     }));

     useEffect(() => {
        if (localRef.current) {
           const instance = new Choices(localRef.current, {
              removeItemButton: false,
              shouldSort: false,
              itemSelectText: "",
              allowHTML: true,
           });

           choicesInstanceRef.current = instance;

           if (datas && datas.length > 0) {
            const items = datas.map((item) => ({
              value: dataKey ? item[dataKey.value] : item.value,
              label: dataKey ? item[dataKey.label] : item.label
            }));
            instance.setChoices(items, 'value', 'label', true);
            if (value) {
              Array.isArray(value)
                ? value.forEach((val) => instance.setChoiceByValue(val))
                : instance.setChoiceByValue(value);
            }
          } else if (procedure && param && dataKey) {
              getData(procedure, param)
                 .then((result) => {

                                      
                    if (Array.isArray(result)) {
                       instance.setChoices(result, dataKey.value, dataKey.label, true);

                       if (value) {
                          instance.setChoiceByValue(value); // 초기값 설정
                       }
                    }
                 })
                 .catch((error) => {
                    console.error("데이터 로드 중 오류 발생:", error);
                 });
           }

           return () => {
              instance.destroy();
              choicesInstanceRef.current = null;
           };
        }
     }, []); // useEffect가 의존하는 값을 명시적으로 선언

     
     const getData = async (procedure: string, param: any) => {
        try {

         let result = ''
         if(stringify){
            const data = JSON.stringify(param);
            result = await fetchPost(procedure, {data});
            
         }else{
            result = await fetchPost(procedure, param);

         }

           return result;
        } catch (error) {
           console.error(`${procedure}:`, error);
           throw error;
        }
     };

     return (
        <div
           className={`grid ${
              layout === "horizontal" ? "grid-cols-3 gap-3 items-center" : ""
           }`}
        >
           <label className={`col-span-1 ${layout === "vertical" ? "" : "text-right"}`}>
              {title}
           </label>
           <div className={`${layout === "horizontal" ? "col-span-2" : "col-span-1"}`}>
              <select
                 ref={localRef}
                 value={value} // 초기 선택 값
                 onChange={(event) => {
                  const selectedLabel = event.target.selectedOptions[0].text;
                  const selectedValue = event.target.value;

                    if (setChangeGridData && target) {
                       setChangeGridData(target, selectedValue);
                    }
                    if (handleCallSearch) {
                       handleCallSearch();
                    }
                    if (onChange) {
                       onChange(selectedLabel, selectedValue);
                    }
                 }}
                 className="border rounded-md h-8 p-2 w-full focus:outline-orange-300"
              ></select>
           </div>
        </div>
     );
  }
);


interface SelectPopProps {
   title: string;
   target?: string;
   value?: string;
   readOnly?: boolean;
   placeholder?: string;
   handleInputSearch: (e: any) => void;
}

const SelectPop = forwardRef<HTMLSelectElement, SelectPopProps>(({ title, value, target, readOnly = false, placeholder, handleInputSearch }, ref) => {
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
       handleInputSearch(e);
    }
 };

 const handleClick = (e: any) => {
    e.preventDefault();
 };

 return (
    <div className="grid grid-cols-3 gap-3 items-center">
       <label className="col-span-1 text-right">{title}</label>
       <div className="col-span-2 relative">
          <select
             className="border rounded-md h-8 p-2 w-full focus:outline-orange-300 appearance-none cursor-pointer"
             onKeyDown={handleKeyDown}
             ref={ref}
             onClick={handleClick}
             disabled={readOnly} // Disable the select if readOnly is true
             value={value}
             
          >
             <option value="" disabled selected hidden>
                {placeholder || "Select an option"}
             </option>
             {/* Add your options here */}
          </select>
          <MagnifyingGlassIcon
             className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
             onClick={handleInputSearch} // 클릭 시 동일한 함수 호출
          />
       </div>
    </div>
 );
});




export { SelectComp1, SelectComp2, SelectComp3, SelectSearchComp, SelectPop };
