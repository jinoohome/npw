import { React, useEffect, useState, useRef, useCallback, initChoice, 
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2,
    RadioGroup1, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

import DatePicker from 'tui-date-picker';
import 'tui-date-picker/dist/tui-date-picker.css';



interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Zz0102 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);

   const refs = {
      dlvyCd: useRef<any>(null),
      dlvyNm: useRef<any>(null),
      dlvyDiv: useRef<any>(null),
      siDo: useRef<any>(null),
      siGunGu: useRef<any>(null),
      telNo: useRef<any>(null),
      zipCd: useRef<any>(null),
      addr1: useRef<any>(null),
      addr2: useRef<any>(null),
      useYn: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null),
      coCd: useRef<any>(null),
      usrStatus: useRef<any>(null),
      confirmYn: useRef<any>(null),
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [cd0006Input, setCd0006Input] = useState<ZZ_CODE_RES[]>([]);
   const [wo0002Input, setWo0002Input] = useState<ZZ_CODE_RES[]>([]);
   const [wo0003Input, setWo0003Input] = useState<ZZ_CODE_RES[]>([]);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();
   const [choice5, setChoice5] = useState<any>();

   const [focusRow, setFocusRow] = useState<any>(0);
   
   const [isOpen, setIsOpen] = useState(false);
 

   const breadcrumbItem = [{ name: "관리자" }, { name: "공통" }, { name: "INPUT GROUP" }];



   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   useEffect(() => {
      console.log("focusRow changed:", focusRow);
   }, [focusRow]);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.dlvyDiv, setChoice2);
      initChoice(refs.siDo, setChoice3);
      initChoice(refs.siGunGu, setChoice4);
      initChoice(refs.useYn, setChoice5, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      try {
         let cd0006Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0006", div: "999" });
         if (cd0006Data != null) {
            let cd0006IntupData = cd0006Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            cd0006IntupData.unshift({ value: "", text: "" });

            setCd0006Input(cd0006IntupData);
         }

         let wo0002Data = await ZZ_CODE({ coCd: "999", majorCode: "WO0002", div: "999" });
         if (wo0002Data != null) {
            let wo0002IntupData = wo0002Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            wo0002IntupData.unshift({ value: "", text: "" });

            setWo0002Input(wo0002IntupData);
         }

         let wo0003Data = await ZZ_CODE({ coCd: "999", majorCode: "WO0003", div: "999" });
         if (wo0003Data != null) {
            let wo0003IntupData = wo0003Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            wo0003IntupData.unshift({ value: "", text: "" });

            setWo0003Input(wo0003IntupData);
         }

         await MM0401_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef);
   }, [activeComp]);


  
   

   //Grid 데이터 설정
   useEffect(() => {
      if (gridRef.current && gridDatas) {
         let grid = gridRef.current.getInstance();
         grid.resetData(gridDatas);
         if (gridDatas.length > 0) {
            grid.focusAt(focusRow, 0, true);
         }
      }
   }, [gridDatas]);

   useEffect(() => {
      updateChoices(choice2, cd0006Input, "value", "text");
   }, [cd0006Input]);

   useEffect(() => {
      updateChoices(choice3, wo0002Input, "value", "text");
   }, [wo0002Input]);

   useEffect(() => {
      updateChoices(choice4, wo0003Input, "value", "text");
   }, [wo0003Input]);

   //---------------------- api -----------------------------

   const ZZ_CODE = async (param: ZZ_CODE_REQ) => {
      const result3 = await ZZ_CODE_API(param);
      let formattedResult = Array.isArray(result3)
         ? result3.map(({ code, codeName, ...rest }) => ({
              value: code,
              text: codeName,
              label: codeName,
              ...rest,
           }))
         : [];
      return formattedResult;
   };

   const MM0401_S01 = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            dlvyNm: searchRef1.current?.value || "999",
            useYn: searchRef2.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0401_S01`, { data });

         setGridDatas(result);

         const grid = gridRef.current.getInstance();

         if (grid.getData().length > 0) {
            grid.focusAt(focusRow, 0, true);
         }

         return result;
      } catch (error) {
         console.error("MM0401_S01 Error:", error);
         throw error;
      }
   };


   //-------------------event--------------------------

  

   const setChangeGridData = (columnName: string, value: any) => {
      const grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.setValue(rowKey, columnName, value, false);
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = () => {
      setGridData();
   };

   //-------------------div--------------------------

   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
              
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>
         </div>
      </div>
   );
   const handleRaioChange = (value: string) => {
      console.log(value);
   };

   
   const handleCheckChange = (value: string[]) => {
      console.log(value);
   };

   const handleCheckChangeYn = (value: boolean) => {
      console.log(value);
   };


   const handleRaioClick = (value: string) => {
      console.log(value);
   };

   const handleInputSearch = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: userInfo.coCd,
         dlvyNm: target.value || '999',
         useYn: searchRef2.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0401_S01", { data });

      if (result.length === 1) {
         console.log(result[0]);
      } else {
         setIsOpen(true);
      }
   };
   

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3 gap-y-3 justify-start w-[60%]">
            <InputComp1  title="계약명" handleCallSearch={handleCallSearch} ></InputComp1>
            <SelectComp1 title="계약번호" handleCallSearch={handleCallSearch}></SelectComp1>
            <RadioGroup1 title = "확정여부" name="confirmYn" 
                        options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
                        defaultIndex={0} onChange={handleRaioChange} onClick={handleRaioClick} />

            <CheckboxGroup1 title = "확정여부" name="confirmYn2" 
               options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
               onChange={handleCheckChange} onClick={handleRaioClick} />

            <Checkbox title = "확정여부" name="confirmYn2" onChange={handleCheckChangeYn} />
            <InputSearchComp1 title="계약번호"  handleInputSearch={handleInputSearch} />


            <DatePickerComp id="exampleDatePick" title="계약번호" 
            onChange={(date) => console.log(date)} />
         
        
         </div>
      </div>
   );

   //input div
   const inputDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-4 gap-3 space-x-3 justify-start w-[60%]">

            <InputComp2 ref={refs.dlvyCd} title="배송지코드" target="dlvyCd"  readOnly={false} />
            <SelectComp2 ref={refs.useYn} title="사용여부" target="useYn" />
            <RadioGroup2 ref = {refs.confirmYn} title = "확정여부" name="confirmYn3" 
               options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
               defaultIndex={0} />
            <CheckboxGroup2 title = "확정여부" name="confirmYn4" 
               options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
               onChange={handleCheckChange} onClick={handleRaioClick} />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   return (
      <div className={`space-y-5 overflow-y-hidden h-screen`}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
             
            </div>
            <div>{searchDiv()}</div>
            <div>{inputDiv()} </div>
            
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className=" " ref={gridContainerRef}>
               {/* {grid()} */}
            </div>
            {/* <div>{inputDiv()} </div> */}
         </div>

          <CommonModal isOpen={isOpen} size="md" onClose={() => setIsOpen(false)} title="">
            {modalSearchDiv()}
         </CommonModal>
      </div>
   );
};

export default Zz0102;
