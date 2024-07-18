import { userInfo } from "os";
import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Mm0101 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const refs = {
      coCd: useRef<any>(null),
      bpCd: useRef<any>(null),
      paBpCd: useRef<any>(null),
      bpType: useRef<any>(null),
      bpDiv: useRef<any>(null),
      bpRate: useRef<any>(null),
      bpFullNm: useRef<any>(null),
      bpNm: useRef<any>(null),
      indType: useRef<any>(null),
      cndType: useRef<any>(null),
      repreNm: useRef<any>(null),
      bpRgstNo: useRef<any>(null),
      telNo: useRef<any>(null),
      telNo2: useRef<any>(null),
      bankCd: useRef<any>(null),
      bankAcctNo: useRef<any>(null),
      bankHolder: useRef<any>(null),
      zipCd: useRef<any>(null),
      addr1: useRef<any>(null),
      addr2: useRef<any>(null),
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [zz0005, setZz0005] = useState<ZZ_CODE_RES[]>([]);
   const [cd0008, setCd0008] = useState<ZZ_CODE_RES[]>([]);
   const [zz0009, setZZ0009] = useState<ZZ_CODE_RES[]>([]);
   const [zz0019, setZZ0019] = useState<ZZ_CODE_RES[]>([]);
   const [coCds, setCoCds] = useState<any>([]);
   const [paBpCds, setPaBpCds] = useState<any>([]);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();
   const [choice5, setChoice5] = useState<any>();
   const [choice6, setChoice6] = useState<any>();
   const [choice7, setChoice7] = useState<any>();
   const [choice8, setChoice8] = useState<any>();


   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "관리자" }, { name: "거래처관리" }, { name: "거래처등록" }];

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
      initChoice(refs.paBpCd, setChoice3);
      initChoice(refs.bpType, setChoice4);
      initChoice(refs.bankCd, setChoice6);
      initChoice(refs.coCd, setChoice7);
      initChoice(refs.bpDiv, setChoice8);
   };

   const setGridData = async () => {
      try {
         let zz0005Data = await ZZ_CODE({ coCd: "999", majorCode: "ZZ0005", div: "999" });
         if (zz0005Data != null) {            
            setZz0005(zz0005Data);
         }

         let cd0008Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0008", div: "" });
         if (cd0008Data != null) {
            setCd0008(cd0008Data);
         }

         let zz0009Data = await ZZ_CODE({ coCd: "999", majorCode: "ZZ0009", div: "" });
         if (zz0009Data != null) {
            setZZ0009(zz0009Data);
         }

         let zz0019Data = await ZZ_CODE({ coCd: "999", majorCode: "ZZ0019", div: "" });
         if (zz0019Data != null) {
            setZZ0019(zz0019Data);
         }


         let coCdData = await ZZ_B_BIZ();
         if (coCdData != null) {
            coCdData.unshift({ value: "", text: "" });
             setCoCds(coCdData);
         }

         let paBpCdData = await MM0101_S01_IN();
         if (paBpCdData != null) {
            paBpCdData.unshift({ value: "", text: "" });
             setPaBpCds(paBpCdData);
         }
         

         await MM0101_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef);
   }, [activeComp, leftMode]);

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

   //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(choice1, zz0005, "value", "text");

      let zz0005Data = zz0005.filter((item) => item.value !== "999");
      updateChoices(choice4, zz0005Data, "value", "text", "");
   }, [zz0005]);

   //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(choice5, cd0008, "value", "text");
   }, [cd0008]);

   //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(choice6, zz0009, "value", "text");
   }, [zz0009]);

   //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(choice8, zz0019, "value", "text");
   }, [zz0019]);

   useEffect(() => {
      updateChoices(choice7, coCds, "value", "text");
   }, [coCds]);

   useEffect(() => {
      updateChoices(choice3, paBpCds, "value", "text");
   }, [paBpCds]);

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

   var ZZ_B_BIZ = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_B_BIZ`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ coCd, bpNm, ...rest }) => ({
              value: coCd,
              text: bpNm,
              label: bpNm,
              ...rest,
           }))
         : [];
     
         return formattedResult;
      } catch (error) {
         console.error("ZZ_B_BIZ Error:", error);
         throw error;
      }
   }

   const MM0101_S01_IN = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            bpNm: searchRef1.current?.value || "999",
            bpType: searchRef2.current?.value || "999",
            useYn: searchRef3.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0101_S01`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ bpCd, bpNm, ...rest }) => ({
              value: bpCd,
              text: bpNm,
              label: bpNm,
              ...rest,
           }))
         : [];
     
         return formattedResult;
      } catch (error) {
         console.error("MM0101_S01 Error:", error);
         throw error;
      }
   };

   const MM0101_S01 = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            bpNm: searchRef1.current?.value || "999",
            bpType: searchRef2.current?.value || "999",
            useYn: searchRef3.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0101_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0101_S01 Error:", error);
         throw error;
      }
   };

   const MM0101_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0101_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0101_U01 Error:", error);
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
         let result = await MM0101_U01(data);
         if (result) {
            returnResult(result);
         }
      }
   };
   const returnResult = (result: any) => {
      let grid = gridRef.current.getInstance();
      let focusMajorRowKey = grid.getFocusedCell().rowKey || 0;
      setFocusRow(focusMajorRowKey);
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
      grid.focusAt(focusMajorRowKey, 0, true);
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);

      let data = {
         data: JSON.stringify(datas),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
      };

      return data;
   };

   //grid 추가버튼
   const addGridRow = () => {
      let grid = gridRef.current.getInstance();

      grid.appendRow({ coCd: "", paBpCd: "", bpType: "", bpDiv: "", bankCd: "", useYn: "Y" }, { at: 0 });
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

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs]; // Add index signature to allow indexing with a string
               console.log(key+'>>'+value)
               if (ref && ref.current !== null) {
                  if (key === "paBpCd") {
                     setTimeout(function () {
                        choice3?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "coCd") {
                     setTimeout(function () {
                        choice7?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "bpType") {
                     setTimeout(function () {
                        choice4?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "bpDiv") {
                     setTimeout(function () {
                        choice8?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "bankCd") {
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
      //grid.setValue(5, 'bpNm', 'test', false);
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
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="회사약명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="회사구분" handleCallSearch={handleCallSearch}></SelectComp1>
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
               <div className="">회사 등록</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-12  justify-around items-center ">
               <SelectComp2 ref={refs.coCd} title="사업부서" target="coCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpCd} title="회사코드" target="bpCd" setChangeGridData={setChangeGridData} readOnly={true} />
               <SelectComp2 ref={refs.paBpCd} title="그룹사코드" target="paBpCd" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.bpType} title="회사구분" target="bpType" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-2  gap-12  justify-around items-center">
               <InputComp2 ref={refs.bpFullNm} title="회사전명" target="bpFullNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpNm} title="회사약명" target="bpNm" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <SelectComp2 ref={refs.bpDiv} title="회사종류" target="bpDiv" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.indType} title="업종" target="indType" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.cndType} title="업태" target="cndType" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.repreNm} title="대표자명" target="repreNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpRgstNo} title="사업자등록번호" target="bpRgstNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpRate} title="수수료비율" target="bpRate" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.telNo} title="전화번호1" target="telNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.telNo2} title="전화번호2" target="telNo2" setChangeGridData={setChangeGridData} /> 
            </div>

            <div className="grid grid-cols-3  gap-12  justify-around items-center">
               <InputComp2 ref={refs.zipCd} title="우편번호" target="zipCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr1} title="주소" target="addr1" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr2} title="상세주소" target="addr2" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-3  gap-12  justify-around items-center">
               <SelectComp2 ref={refs.bankCd} title="은행" target="bankCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bankAcctNo} title="은행계좌번호" target="bankAcctNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bankHolder} title="예금주" target="bankHolder" setChangeGridData={setChangeGridData} />    
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "사업부서", name: "coCd", hidden: true },
      { header: "회사코드", name: "bpCd", width: 100, align: "center" },
      { header: "그룹사코드", name: "paBpCd", hidden: true },
      { header: "회사명", name: "bpFullNm", hidden: true },
      { header: "회사약명", name: "bpNm" },
      { header: "회사구분", name: "bpType", hidden: true },
      { header: "회사종류", name: "bpDiv", hidden: true },
      { header: "", name: "repreNm", hidden: true },
      { header: "", name: "bpRgstNo", hidden: true },
      { header: "", name: "indType", hidden: true },
      { header: "", name: "cndType", hidden: true },
      { header: "우편번호", name: "zipCd", hidden: true },
      { header: "주소1", name: "addr1", hidden: true },
      { header: "주소2", name: "addr2", hidden: true },
      { header: "수수료비율", name: "bpRate", hidden: true },
      { header: "연락처", name: "telNo", hidden: true },
      { header: "연락처2", name: "telNo2", hidden: true },
      { header: "", name: "bankCd", hidden: true },
      { header: "", name: "bankAcctNo", hidden: true },
      { header: "", name: "bankHolder", hidden: true },
      { header: "사용여부", name: "useYn", hidden: true },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 정보</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
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

export default Mm0101;