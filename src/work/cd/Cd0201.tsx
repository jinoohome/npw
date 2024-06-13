import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const Cd0201 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);


   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);

   const refs = {
      itemCd: useRef<any>(null),
      itemNm: useRef<any>(null),
      spec: useRef<any>(null),
      itemGrp: useRef<any>(null),
      itemDiv: useRef<any>(null),
      itemCost: useRef<any>(null),
      useYn: useRef<any>(null)
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [cd0004, setCd0004] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005, setCd0005] = useState<ZZ_CODE_RES[]>([]);
   
   const [zz0009, setZZ0009] = useState<ZZ_CODE_RES[]>([]);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();
   const [choice5, setChoice5] = useState<any>();
   const [choice6, setChoice6] = useState<any>();

   const [focusRow, setFocusRow] = useState<any>(0);

   const [isUsrIdReadOnly, setUsrIdReadOnly] = useState<boolean>(false);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "품목관리" }, { name: "품목등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1);
      initChoice(searchRef3, setChoice2);
      initChoice(searchRef4, setChoice3, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);


       initChoice(refs.itemGrp, setChoice4);
       initChoice(refs.itemDiv, setChoice5);
       initChoice(refs.useYn, setChoice6, [
         { value: "Y", label: "사용" , selected: true},
         { value: "N", label: "미사용" },
      ]);
      // initChoice(refs.empCnt, setChoice5);
      // initChoice(refs.bankCd, setChoice6);
   };

   const setGridData = async () => {
      try {
         let cd0004Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "CD0004", div: "999" });
         if (cd0004Data != null) {
            setCd0004(cd0004Data);
         }
         let cd0005Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "CD0005", div: "999" });
         if (cd0005Data != null) {
            setCd0005(cd0005Data);
         }

         // let cd0008Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "CD0008", div: "" });
         // if (cd0008Data != null) {
         //    setCd0008(cd0008Data);
         // }

         // let zz0009Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "ZZ0009", div: "" });
         // if (zz0009Data != null) {
         //    setZZ0009(zz0009Data);
         // }
         await SOL_CD0201_S01();
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
      //updateChoices(choice3, gridDatas, "coCd", "bpNm", "");
   }, [gridDatas]);

   //inputChoicejs 데이터 설정
   useEffect(() => {
       updateChoices(choice1, cd0004, "value", "text");
       updateChoices(choice2, cd0005, "value", "text");

       let cd0004DataInput = cd0004.filter((item) => item.value !== "999");
       updateChoices(choice4, cd0004DataInput, "value", "text", "");

       let cd0005DataInput = cd0005.filter((item) => item.value !== "999");
       updateChoices(choice5, cd0005DataInput, "value", "text", "");


   }, [cd0004, cd0005]);

   

   // Grid 내부 Choicejs 데이터 설정
   // useEffect(() => {
   //    if (zz0005) {
   //       let gridInstance = majorGridRef.current.getInstance();
   //       let column = gridInstance.getColumn("codeDiv");
   //       column.editor.options.listItems = zz0001;
   //       gridInstance.refreshLayout();
   //    }
   // }, [zz0005]);

   //---------------------- api -----------------------------

   const SOL_ZZ_CODE = async (param: ZZ_CODE_REQ) => {
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

   const SOL_CD0201_S01 = async () => {
      try {

         
         const param = {
            itemNm:  searchRef1.current.value ?? "999" ,
            itemGrp: searchRef2.current.value ?? "999",
            itemDiv: searchRef3.current.value ?? "999",
            useYn:  searchRef4.current.value ?? "999",
            coCd:  userInfo.coCd,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_CD0201_S01`, { data });
         
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("SOL_CD0201_S01 Error:", error);
         throw error;
      }
   };

   const SOL_MM001_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SOL_MM001_U01`, data);
         return result;
      } catch (error) {
         console.error("SOL_MM001_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const save = async () => {
      const data = await getGridValues();
      if (data) {
         let result = await SOL_MM001_U01(data);
         if (result) {
            returnResult();
         }
      }
   };
   const returnResult = () => {
      let grid = gridRef.current.getInstance();
      let focusMajorRowKey = grid.getFocusedCell().rowKey || 0;
      setFocusRow(focusMajorRowKey);
      alertSwal("저장완료", "저장이 완료되었습니다.", "success");
      setGridData();
      grid.focusAt(focusMajorRowKey, 0, true);
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
     // let datas = await getGridDatas(gridRef);

     let grid = gridRef.current.getInstance();

     if (grid.getRowCount() > 0) {
        let focusRowKey1 = grid.getFocusedCell().rowKey || 0;
        grid.focusAt(focusRowKey1, 0, true);
     }
  
     let rows = grid.getModifiedRows();
     let datas = rows.createdRows
        .map((e: any) => ({ ...e, usrStatus: "I" }))
        .concat(rows.deletedRows.map((e: any) => ({ ...e, usrStatus: "D" })))
        .concat(rows.updatedRows.map((e: any) => ({ ...e, usrStatus: "U" })));

      let data = {
         data: JSON.stringify(datas),
         menuId: "",
         insrtUserId: "jay8707",
      };

      return data;
   };

   //grid 추가버튼
   const addMajorGridRow = () => {
      let grid = gridRef.current.getInstance();

      grid.appendRow({  usrId: "", usrNm: "", pwd: "",email: "",hp: "",
                        useYn: "Y", coCd: "",usrStatus: "I"}, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if(rowData.usrId){
            setUsrIdReadOnly(true);
         }else{
            setUsrIdReadOnly(false);

         }

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs]; 

         
               if (ref && ref.current) {
                 
                  if (key === "itemGrp") {
                     setTimeout(function () {
                        choice4?.setChoiceByValue(value);
                     }, 100);
               
                  }else if (key === "itemDiv") {
                    
                     setTimeout(function () {
                        choice5?.setChoiceByValue(value);
                     }, 100);
               
                  }else if (key === "useYn") {
                    
                     setTimeout(function () {
                        choice6?.setChoiceByValue(value);
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
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="품목명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="품목그룹" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="품목구분" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef4} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
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
               <div className="">품목등록</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <InputComp2 ref={refs.itemCd} title="품목코드" target="usrId" setChangeGridData={setChangeGridData}  readOnly={isUsrIdReadOnly} />
               <InputComp2 ref={refs.itemNm} title="품목명" target="usrNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.spec} title="규격" target="pwd" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.itemGrp} title="품목그룹" target="usrDiv" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.itemDiv} title="품목구분" target="email" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.itemCost} title="원가" target="hp" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.useYn} title="사용여부" target="useYn" setChangeGridData={setChangeGridData} />
              
            </div>

            {/* <div className="grid grid-cols-4  gap-6  justify-around items-center ">
              
               <InputComp2 ref={refs.insrtDt} title="등록일" target="insrtDt" setChangeGridData={setChangeGridData} readOnly={true}/>
               <InputComp2 ref={refs.updtDt} title="수정일" target="updtDt" setChangeGridData={setChangeGridData}  readOnly={true} />
               <InputComp2 ref={refs.insrtUserId} title="등록자" target="insrtUserId" setChangeGridData={setChangeGridData}  readOnly={true} />
               <InputComp2 ref={refs.updtUserId} title="수정자" target="updtUserId" setChangeGridData={setChangeGridData}  readOnly={true}/>
            </div> */}

         

           
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "품목코드", name: "itemCd", hidden: false },
      { header: "품목명", name: "itemNm", hidden: false },
      { header: "규격", name: "spec", hidden: true },
      { header: "품목그룹", name: "itemGrp", hidden: true },
      { header: "품목구분", name: "itemDiv", hidden: true },
      { header: "원가", name: "itemCost", hidden: true },
      { header: "사용여부", name: "useYn", align: 'center', hidden: true },
   
    
     
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목 리스트</div>
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

export default Cd0201;