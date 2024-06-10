import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { SOL_ZZ_CODE_REQ, SOL_ZZ_CODE_RES, SOL_ZZ_CODE_API } from "../../ts/SOL_ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
}

const Mm0301 = ({ item, activeComp }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);


   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const refs = {
      usrId: useRef<any>(null),
      usrNm: useRef<any>(null),
      pwd: useRef<any>(null),
      usrDiv: useRef<any>(null),
      hp: useRef<any>(null),
      email: useRef<any>(null),
      useYn: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null),
      coCd: useRef<any>(null),
      usrStatus: useRef<any>(null),
    
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [zz0005, setZz0005] = useState<SOL_ZZ_CODE_RES[]>([]);
   const [cd0008, setCd0008] = useState<SOL_ZZ_CODE_RES[]>([]);
   const [zz0009, setZZ0009] = useState<SOL_ZZ_CODE_RES[]>([]);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();
   const [choice5, setChoice5] = useState<any>();
   const [choice6, setChoice6] = useState<any>();

   const [focusRow, setFocusRow] = useState<any>(0);

   const [isUsrIdReadOnly, setUsrIdReadOnly] = useState<boolean>(false);

   const breadcrumbItem = [{ name: "관리자" }, { name: "사용자" }, { name: "사용자등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1);
      initChoice(searchRef3, setChoice2, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
       initChoice(refs.usrDiv, setChoice3);
       initChoice(refs.useYn, setChoice4, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      // initChoice(refs.empCnt, setChoice5);
      // initChoice(refs.bankCd, setChoice6);
   };

   const setGridData = async () => {
      try {
         // let zz0005Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "ZZ0005", div: "999" });
         // if (zz0005Data != null) {
         //    setZz0005(zz0005Data);
         // }

         // let cd0008Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "CD0008", div: "" });
         // if (cd0008Data != null) {
         //    setCd0008(cd0008Data);
         // }

         // let zz0009Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "ZZ0009", div: "" });
         // if (zz0009Data != null) {
         //    setZZ0009(zz0009Data);
         // }
         await SOL_MM001_S01();
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
      updateChoices(choice3, gridDatas, "coCd", "bpNm", "");
   }, [gridDatas]);

   //inputChoicejs 데이터 설정
   useEffect(() => {
      // updateChoices(choice1, zz0005, "value", "text");

      // let zz0005Data = zz0005.filter((item) => item.value !== "999");
      // updateChoices(choice4, zz0005Data, "value", "text", "");
   }, [zz0005]);

   

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

   const SOL_ZZ_CODE = async (param: SOL_ZZ_CODE_REQ) => {
      const result3 = await SOL_ZZ_CODE_API(param);
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

   const SOL_MM001_S01 = async () => {
      try {
         const param = {
            coCd:  "999",
            usrId:  "999",
            usrNm:  "999",
            usrDiv: "999",
            sysDiv: "999",
            confirmYn:  "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_MM001_S01`, { data });
         console.log(result)
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("SOL_MM001_S01 Error:", error);
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
                 
                  if (key === "usrDiv") {
                     setTimeout(function () {
                        choice3?.setChoiceByValue(value);
                     }, 100);
               
                  }else if (key === "useYn") {
                    
                     setTimeout(function () {
                        choice4?.setChoiceByValue(value);
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
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="사번"></InputComp1>
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="사용자명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="소속" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
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
               <div className="">사용자 등록</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <InputComp2 ref={refs.usrId} title="사번" target="usrId" setChangeGridData={setChangeGridData}  readOnly={isUsrIdReadOnly} />
               <InputComp2 ref={refs.usrNm} title="이름" target="usrNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.pwd} title="비밀번호" target="pwd" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.usrDiv} title="소속" target="usrDiv" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.email} title="이메일" target="email" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.hp} title="연락처" target="hp" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.useYn} title="사용여부" target="useYn" setChangeGridData={setChangeGridData} />
              
            </div>

            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
              
               <InputComp2 ref={refs.insrtDt} title="등록일" target="insrtDt" setChangeGridData={setChangeGridData} readOnly={true}/>
               <InputComp2 ref={refs.updtDt} title="수정일" target="updtDt" setChangeGridData={setChangeGridData}  readOnly={true} />
               <InputComp2 ref={refs.insrtUserId} title="등록자" target="insrtUserId" setChangeGridData={setChangeGridData}  readOnly={true} />
               <InputComp2 ref={refs.updtUserId} title="수정자" target="updtUserId" setChangeGridData={setChangeGridData}  readOnly={true}/>
            </div>

         

           
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "사번", name: "usrId", hidden: false },
      { header: "이름", name: "usrNm", hidden: false },
      { header: "비밀번호", name: "pwd", hidden: true },
      { header: "소속", name: "usrDiv", hidden: false },
      { header: "이메일", name: "email", hidden: true },
      { header: "연락처", name: "hp", hidden: true },
      { header: "사용여부", name: "useYn", align: 'center', hidden: false },
      { header: "회사구분", name: "coCd", hidden: true },
      { header: "상태", name: "usrStatus", hidden: true },
      { header: "등록일", name: "insrtDt", hidden: true },
      { header: "수정일", name: "updtDt", hidden: true },
      { header: "등록자", name: "insrtUserId", hidden: true },
      { header: "수정자", name: "updtUserId", hidden: true },
    
     
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사용자 리스트</div>
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

export default Mm0301;