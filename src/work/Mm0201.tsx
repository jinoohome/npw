import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../comp/Import";
import { SOL_ZZ_CODE_REQ, SOL_ZZ_CODE_RES, SOL_ZZ_CODE_API } from "../ts/SOL_ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
}

const Mm0201 = ({ item, activeComp }: Props) => {
   const gridRef = useRef<any>(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const refs = {
      coCd: useRef<any>(null),
      paCoCd: useRef<any>(null),
      bpType: useRef<any>(null),
      bpRgstNoFile: useRef<any>(null),
      bpFullNm: useRef<any>(null),
      bpNm: useRef<any>(null),
      indType: useRef<any>(null),
      cndType: useRef<any>(null),
      empCnt: useRef<any>(null),
      idCnt: useRef<any>(null),
      repreNm: useRef<any>(null),
      bpRgstNo: useRef<any>(null),
      telNo: useRef<any>(null),
      telNo2: useRef<any>(null),
      bankCd: useRef<any>(null),
      bankAcctNo: useRef<any>(null),
      bankHolder: useRef<any>(null),
      payAmt: useRef<any>(null),
      zipCd: useRef<any>(null),
      addr1: useRef<any>(null),
      addr2: useRef<any>(null),
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

   const breadcrumbItem = [{ name: "관리자" }, { name: "공통" }, { name: "기준정보등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
   }, []);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1);
      initChoice(searchRef3, setChoice2, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.paCoCd, setChoice3);
      initChoice(refs.bpType, setChoice4);
      initChoice(refs.empCnt, setChoice5);
      initChoice(refs.bankCd, setChoice6);
   };

   const setGridData = async () => {
      try {
         let zz0005Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "ZZ0005", div: "999" });
         if (zz0005Data != null) {
            setZz0005(zz0005Data);
         }

         let cd0008Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "CD0008", div: "" });
         if (cd0008Data != null) {
            setCd0008(cd0008Data);
         }

         let zz0009Data = await SOL_ZZ_CODE({ coCd: "999", majorCode: "ZZ0009", div: "" });
         if (zz0009Data != null) {
            setZZ0009(zz0009Data);
         }
         await SOL_MM0301_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      if (gridRef.current) {
         let gridInstance = gridRef.current.getInstance();
         gridInstance.refreshLayout();
      }
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

   const SOL_MM0301_S01 = async () => {
      try {
         const param = {
            bpNm: searchRef1.current?.value || "999",
            bpType: searchRef2.current?.value || "999",
            useYn: searchRef3.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_MM0301_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("SOL_MM0301_S01 Error:", error);
         throw error;
      }
   };

   const SOL_MM0301_U01 = async (data:any) => {
      try {
         const result = await fetchPost(`SOL_MM0301_U01`, data);
         return result;
      } catch (error) {
         console.error("SOL_MM0301_U01 Error:", error);
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
         let result = await SOL_MM0301_U01(data);
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
      let datas = await getGridDatas(gridRef);

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

      grid.appendRow({ paCoCd: "", bpType: "", bankCd: "", useYn: "Y" }, { at: 0 });
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
               if (ref) {
                  if (key === "paCoCd") {
                     setTimeout(function () {
                        choice3?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "bpType") {
                     setTimeout(function () {
                        choice4?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "empCnt") {
                     setTimeout(function () {
                        choice5?.setChoiceByValue(value);
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
               <InputComp2 ref={refs.coCd} title="회사코드" target="coCd" setChangeGridData={setChangeGridData} readOnly={true} />
               <SelectComp2 ref={refs.paCoCd} title="그룹사코드" target="paCoCd" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.bpType} title="회사구분" target="bpType" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpRgstNoFile} title="사업자등록증" target="bpRgstNoFile" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-2  gap-12  justify-around items-center">
               <InputComp2 ref={refs.bpFullNm} title="회사전명" target="bpFullNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpNm} title="회사약명" target="bpNm" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <InputComp2 ref={refs.indType} title="업종" target="indType" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.cndType} title="업태" target="cndType" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.empCnt} title="임직원수" target="empCnt" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.idCnt} title="계정수" target="idCnt" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.repreNm} title="대표자명" target="repreNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpRgstNo} title="사업자등록번호" target="bpRgstNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.telNo} title="전화번호1" target="telNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.telNo2} title="전화번호2" target="telNo2" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.bankCd} title="은행" target="bankCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bankAcctNo} title="은행계좌번호" target="bankAcctNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bankHolder} title="예금주" target="bankHolder" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.payAmt} title="결제금액" target="payAmt" setChangeGridData={setChangeGridData} readOnly={true} />
               <InputComp2 ref={refs.zipCd} title="우편번호" target="zipCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr1} title="주소" target="addr1" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr2} title="상세주소" target="addr2" setChangeGridData={setChangeGridData} />
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "회사코드", name: "coCd", width: 100, align: "center" },
      { header: "그룹사코드", name: "paCoCd", hidden: true },
      { header: "회사명", name: "bpFullNm", hidden: true },
      { header: "회사약명", name: "bpNm", editor: "text" },
      { header: "회사구분", name: "bpType", hidden: true },
      { header: "", name: "repreNm", hidden: true },
      { header: "", name: "bpRgstNo", hidden: true },
      { header: "", name: "indType", hidden: true },
      { header: "", name: "cndType", hidden: true },
      { header: "우편번호", name: "zipCd", hidden: true },
      { header: "주소1", name: "addr1", hidden: true },
      { header: "주소2", name: "addr2", hidden: true },
      { header: "연락처", name: "telNo", hidden: true },
      { header: "연락처2", name: "telNo2", hidden: true },
      { header: "", name: "bankCd", hidden: true },
      { header: "", name: "bankAcctNo", hidden: true },
      { header: "", name: "bankHolder", hidden: true },
      { header: "", name: "payAmt", hidden: true },
      { header: "", name: "empCnt", hidden: true },
      { header: "", name: "idCnt", hidden: true },
      { header: "", name: "saveFileNm", hidden: true },
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
         <div className="w-full h-full flex space-x-5">
            <div className="w-1/3 ">{grid()}</div>
            <div className="w-2/3 ">{inputDiv()} </div>
         </div>
      </div>
   );
};

export default Mm0201;
