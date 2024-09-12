import React, { forwardRef, useEffect, useState, useRef, useImperativeHandle  } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Choices from 'choices.js';
import "../css/inputChoicejs.css";
import "../css/gridChoicejs.css";
import "choices.js/public/assets/styles/choices.min.css";
import { fetchPost } from "../util/fetch"; 
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Select from 'react-select';
import "../css/react-select.css";

const customStyles = {
   // control: (provided: any, state: any) => ({
   //   ...provided,
   //   borderColor: state.isFocused ? '#fb923c' : '#d1d5db',  // Focus 시에는 주황색, 그렇지 않으면 회색
   //   borderRadius: '0.375rem', // Tailwind의 'rounded-md'와 동일
   //   height: '2rem', // Tailwind의 'h-8'과 동일
   //   padding: '0.5rem', // Tailwind의 'p-2'와 동일
   //   width: '100%', // Tailwind의 'w-full'과 동일
   //   boxShadow: 'none',  // 기본 박스 그림자를 제거
   //   '&:hover': {
   //     borderColor: '#fb923c', // Hover 시 주황색 테두리
   //   },
   // }),
   // menu: (provided: any) => ({
   //   ...provided,
   //   borderRadius: '0.375rem', // Tailwind의 'rounded-md'와 동일
   // }),
   // option: (provided: any, state: any) => ({
   //   ...provided,
   //   backgroundColor: state.isSelected ? 'rgba(234, 88, 12, 0.1)' : 'white', // 선택된 항목 배경색
   //   color: 'black', // 기본 텍스트 색상
   //   '&:hover': {
   //     backgroundColor: 'rgba(234, 88, 12, 0.3)', // Hover 시 배경색
   //   },
   // }),
 };

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
   const handleKeyDown = (event: React.KeyboardEvent<HTMLSelectElement>) => {
      console.log('Arrow key pressed:', event.key);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
         event.preventDefault(); // 기본 동작 차단
         // 검색이나 다른 기능 처리 추가 가능
      }
   };
  
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
               onKeyDown={handleKeyDown} 
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
  layout?: "horizontal" | "vertical" | "flex"; // 레이아웃 옵션 추가
  target?: string;
  setChangeGridData?: (target: string, value: string) => void;
  stringify?: boolean;
  minWidth?: string;
  datas?: any[];
}

// HTMLSelectElement와 추가 메서드를 포함하는 타입 정의
interface SelectSearchCompRef extends HTMLSelectElement {
  getChoicesInstance: () => Choices | null;
  updateChoices: (items: { value: string; label: string }[]) => void;
}

const SelectSearchComp = forwardRef<SelectSearchCompRef, Props4>(
  ({ title, value = '', handleCallSearch, minWidth, onChange, procedure, param, dataKey, stringify, layout = "horizontal", target, setChangeGridData, datas }, ref) => {
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
                  choiceInstance.setChoiceByValue(value); 
               
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
      <div className={` ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""}
                        ${layout === "flex" ? "flex items-center space-x-2" : ""}
                        `}>
         <label className={` ${layout === "horizontal" ? "col-span-1 text-right" : ""}
                           ${layout === "flex" ? " w-auto" : ""}

               `} style={minWidth ? { minWidth: minWidth } : {}}>{title}</label>
            <div className={`${layout === "horizontal" ? "col-span-2" : "flex-grow"}
            `}>
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



interface SelectSearchProps {
   title: string;
   value?: string; // 초기 선택 값
   handleCallSearch?: () => void;
   onChange?: (label: string, value: string) => void;
   procedure?: string;
   param?: any;
   dataKey?: { value: string; label: string };
   layout?: "horizontal" | "vertical" | "flex"; // 레이아웃 옵션 추가
   target?: string;
   setChangeGridData?: (target: string, value: string) => void;
   stringify?: boolean;
   minWidth?: string;
   datas?: any[];
   readonly?: boolean; 
 }
 
 // react-select에 맞게 forwardRef를 사용하지 않음.
 const SelectSearch = ({
   title,
   value,
   handleCallSearch,
   onChange,
   procedure,
   param,
   dataKey,
   layout = "horizontal",
   target,
   setChangeGridData,
   stringify,
   minWidth,
   datas,
   readonly = false, 
 }: SelectSearchProps) => {
   const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
 
   useEffect(() => {
      let isMounted = true; // 컴포넌트가 마운트된 상태인지 추적하는 변수
    
      // 데이터가 있을 때 옵션 설정
      if (datas && datas.length > 0) {
        const items = datas.map((item) => ({
          value: dataKey ? item[dataKey.value] : item.value,
          label: dataKey ? item[dataKey.label] : item.label,
        }));
        setOptions(items);
      } else if (procedure && param && dataKey) {
        getData(procedure, param)
          .then((result) => {
            if (isMounted && Array.isArray(result)) {
              const items = result.map((item: any) => ({
                value: item[dataKey.value],
                label: item[dataKey.label],
              }));
              setOptions(items);
            }
          })
          .catch((error) => {
            console.error("데이터 로드 중 오류 발생:", error);
          });
      }
    
      return () => {
        isMounted = false; // cleanup 시점에 마운트 상태를 false로 설정
      };
    }, [datas, procedure, param, dataKey]);
 
   const getData = async (procedure: string, param: any) => {
     try {
       let result = "";
       if (stringify) {
         const data = JSON.stringify(param);
         result = await fetchPost(procedure, { data });
       } else {
         result = await fetchPost(procedure, param);
       }
       return result;
     } catch (error) {
       console.error(`${procedure}:`, error);
       throw error;
     }
   };
 
   const handleChange = (selectedOption: { value: string; label: string } | null) => {
     if (selectedOption) {
       if (setChangeGridData && target) {
         setChangeGridData(target, selectedOption.value);
       }
       if (handleCallSearch) {
         handleCallSearch();
       }
       if (onChange) {
         onChange(selectedOption.label, selectedOption.value);
       }
     }
   };
 
   return (
     <div
       className={` ${
         layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""
       } ${layout === "flex" ? "flex items-center space-x-2" : ""}`}
     >
       <label
         className={` ${
           layout === "horizontal" ? "col-span-1 text-right" : ""
         } ${layout === "flex" ? " w-auto" : ""}`}
         style={minWidth ? { minWidth: minWidth } : {}}
       >
         {title}
       </label>
       <div
         className={`${
           layout === "horizontal" ? "col-span-2" : "flex-grow"
         }`}
       >
         <Select
           value={options.find((option) => option.value === value) || null}
           onChange={handleChange}
           options={options}
           classNamePrefix="react-select"
           className=" focus:outline-orange-300"
           placeholder=""
           styles={customStyles}
           isDisabled={readonly}
         />
       </div>
     </div>
   );
 };


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




export { SelectComp1, SelectComp2, SelectComp3, SelectSearchComp, SelectPop, SelectSearch };
