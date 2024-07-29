import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const MM0401 = ({ item, activeComp, userInfo }: Props) => {
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

   const breadcrumbItem = [{ name: "기준정보" }, { name: "계약관리" }, { name: "계약등록" }];

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
            let cd0006IntupData = cd0006Data.filter(item => !(item.value === "999" && item.text === "전체"));
            cd0006IntupData.unshift({ value: "", text: "" });

            setCd0006Input(cd0006IntupData);   
         }      

         let wo0002Data = await ZZ_CODE({ coCd: "999", majorCode: "WO0002", div: "999" });
         if (wo0002Data != null) {  
            let wo0002IntupData = wo0002Data.filter(item => !(item.value === "999" && item.text === "전체"));
            wo0002IntupData.unshift({ value: "", text: "" });

            setWo0002Input(wo0002IntupData);   
         }      

         let wo0003Data = await ZZ_CODE({ coCd: "999", majorCode: "WO0003", div: "999" });
         if (wo0003Data != null) {  
            let wo0003IntupData = wo0003Data.filter(item => !(item.value === "999" && item.text === "전체"));
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
            coCd:  userInfo.coCd,
            dlvyNm:  searchRef1.current?.value   || "999",
            useYn: searchRef2.current?.value   || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0401_S01`, { data });

         setGridDatas(result);

         const grid = gridRef.current.getInstance();

   
         if(grid.getData().length > 0){
            grid.focusAt(focusRow, 0, true);

         }
       
     
         return result;
      } catch (error) {
         console.error("MM0401_S01 Error:", error);
         throw error;
      }
   };

   const MM0401_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0401_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0401_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   // const validateData = (action: string, dataString: any) => {
   //    // dataString이 문자열이면 JSON.parse()를 사용, 그렇지 않으면 직접 사용
   //    const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;

   //    if (action === "save") {
   //       if (data.length < 1) return false;

   //       for (const item of data) {
   //          if (["U", "I"].includes(item.status)) {
   //             if (!item.coCd) {
   //                alertSwal("입력확인", "사업부서를 선택해주세요.", "warning"); // 사용자에게 알림
   //                return false;
   //             }
   //             if (!item.usrId) {
   //                alertSwal("입력확인", "사번을 입력해주세요.", "warning"); // 사용자에게 알림
   //                return false;
   //             }
   //          }
   //       }
   //    }

   //    return true;
   // };

   const save = async () => {

      let grid = gridRef.current.getInstance();
      const focusRow = grid.getFocusedCell().rowKey? grid.getFocusedCell().rowKey : 0;
      let rowKey = grid.getValue(focusRow, "isNew")? 0 : focusRow;     
      
      setFocusRow(rowKey);
    
      const data = await getGridValues();
      if (data) {
         let result = await MM0401_U01(data);
         if (result) {
            await returnResult();
         }
      }else{

         grid.focusAt(rowKey, 0, true);
      }

    
    
   };
   const returnResult = async() => {
     
      alertSwal("저장완료", "저장이 완료되었습니다.", "success");
      await setGridData();
   
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);
      //if (!validateData("save", datas)) return false;
    
      if(datas){
         let data = {
            data: JSON.stringify(datas),
            menuId: activeComp.menuId,
            insrtUserId: userInfo.usrId,
         };
   
         return data;
      }
   };

   //grid 추가버튼
   const addMajorGridRow = () => {
      let grid = gridRef.current.getInstance();

      grid.appendRow({  dlvyCd: "", dlvyNm: "", dlvyDiv: "", siDo: "", siGunGu: "",
                        useYn: "Y", coCd: "", telNo: "", zipCd: "", addr1: "", addr2: "", isNew: true}, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs]; // Add index signature to allow indexing with a string
               if (ref && ref.current) {
                 
                  if (key === "dlvyDiv") {
                     setTimeout(function () {
                        choice2?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "siDo") {
                     setTimeout(function () {
                        choice3?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "siGunGu") {
                     setTimeout(function () {
                        choice4?.setChoiceByValue(value);
                     }, 100);                  
                  }  else if (key === "useYn") {
                     setTimeout(function () {
                        choice5?.setChoiceByValue(value);
                     }, 100);  
                  } else {
                     ref.current.value = value;
                  }
               }
               
            });
         }
      }
   };

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

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
         <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
      </div>
   );

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="배송지명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );
   //input div
   const inputDiv = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">배송지 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <InputComp2 ref={refs.dlvyCd} title="배송지코드" target="dlvyCd" setChangeGridData={setChangeGridData}  readOnly= {true} />
               <InputComp2 ref={refs.dlvyNm} title="배송지명" target="dlvyNm" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.dlvyDiv} title="배송지구분" target="dlvyDiv" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.siDo} title="시/도" target="siDo" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.siGunGu} title="시/군/구" target="siGunGu" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.telNo} title="전화번호" target="telNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.zipCd} title="우편번호" target="zipCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr1} title="주소" target="addr1" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr2} title="상세주소" target="addr2" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.useYn} title="사용여부" target="useYn" setChangeGridData={setChangeGridData} />
              
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "배송지코드", name: "dlvyCd", width: 100, hidden: false },
      { header: "배송지명", name: "dlvyNm", hidden: false },
      { header: "배송지구분", name: "dlvyDiv", hidden: true },
      { header: "시/도", name: "siDo", hidden: true },
      { header: "시/군/구", name: "siGunGu", hidden: true },
      { header: "전화번호", name: "telNo", hidden: true },
      { header: "우편번호", name: "zipCd", hidden: true },
      { header: "주소", name: "addr1", hidden: true },
      { header: "상세주소", name: "addr2", hidden: true },
      { header: "사용여부", name: "useYn", align: 'center', hidden: true },
      { header: "", name: "isNew", hidden: true },   
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">배송지 리스트</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addMajorGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delMajorGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} />
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-1/3 " ref={gridContainerRef}>{grid()}</div>
            <div className="w-2/3 ">{inputDiv()} </div>
         </div>
      </div>
   );
};

export default MM0401;