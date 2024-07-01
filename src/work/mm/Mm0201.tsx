import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const Mm0201 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);

   

   const refs = {
      coCd: useRef<any>(null),
      itemCd: useRef<any>(null),
      itemNm: useRef<any>(null),
      spec: useRef<any>(null),
      itemGrp: useRef<any>(null),
      itemDiv: useRef<any>(null),
      salePrice: useRef<any>(null),
      costPrice: useRef<any>(null),
      taxYn: useRef<any>(null),
      pkgItemYn: useRef<any>(null),
      subsYn: useRef<any>(null),
      deduYn: useRef<any>(null),
      useYn: useRef<any>(null),
      delYn: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null)
    };
    

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [cd0004, setCd0004] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005, setCd0005] = useState<ZZ_CODE_RES[]>([]);
   const [cd0004Input, setCd0004Input] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005Input, setCd0005Input] = useState<ZZ_CODE_RES[]>([]);
   const [coCds, setCoCds] = useState<ZZ_CODE_RES[]>([]);
 

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();
   const [choice5, setChoice5] = useState<any>();
   const [choice6, setChoice6] = useState<any>();
   const [choice7, setChoice7] = useState<any>();
   const [choice8, setChoice8] = useState<any>();
   const [choice9, setChoice9] = useState<any>();
   const [choice10, setChoice10] = useState<any>();
   const [choice11, setChoice11] = useState<any>();
   const [choice12, setChoice12] = useState<any>();
   const [choice13, setChoice13] = useState<any>();

   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "품목" }, { name: "품목등록" }];

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
      initChoice(searchRef5, setChoice4, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(searchRef6, setChoice5, [
         { value: "999", label: "전체"},
         { value: "Y", label: "사용" , selected: true },
         { value: "N", label: "미사용" },
      ]);

      initChoice(refs.coCd, setChoice6);
      initChoice(refs.itemGrp, setChoice7);
      initChoice(refs.itemDiv, setChoice8);
      initChoice(refs.taxYn, setChoice9, [
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.pkgItemYn, setChoice10, [
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.subsYn, setChoice11, [
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.deduYn, setChoice12, [
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.useYn, setChoice13, [
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
  
   };
   const setGridData = async () => {
      try {
          let cd0004Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0004", div: "999" });
          if (cd0004Data != null) {
              setCd0004(cd0004Data);
  
              let cd0004IntupData = cd0004Data.filter(item => !(item.value === "999" && item.text === "전체"));
              cd0004IntupData.unshift({ value: "", text: "" });
  
              setCd0004Input(cd0004IntupData);   
          }
  
          let cd0005Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0005", div: "999" });
          if (cd0005Data != null) {
              setCd0005(cd0005Data);
  
              let cd0005IntupData = cd0005Data.filter(item => !(item.value === "999" && item.text === "전체"));
              cd0005IntupData.unshift({ value: "", text: "" });
  
              setCd0005Input(cd0005IntupData);   
          }

          let coCdData = await ZZ_B_BIZ();
          if (coCdData != null) {
              setCoCds(coCdData);
          }
  
         
          await MM0201_S01();
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
   // useEffect(() => {
   //    updateChoices(choice1, zz0005, "value", "text");

   //    let zz0005Data = zz0005.filter((item) => item.value !== "999");
   //    updateChoices(choice4, zz0005Data, "value", "text", "");
   // }, [zz0005]);

   // //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(choice1, cd0004, "value", "text");
   }, [cd0004]);

   useEffect(() => {
      updateChoices(choice7, cd0004Input, "value", "text");
   }, [cd0004Input]);

   useEffect(() => {
      updateChoices(choice2, cd0005, "value", "text");
   }, [cd0005]);

   useEffect(() => {
      updateChoices(choice8, cd0005Input, "value", "text");
   }, [cd0005Input]);
  
   useEffect(() => {
      updateChoices(choice6, coCds, "value", "text");
   }, [coCds]);

   // //inputChoicejs 데이터 설정
   // useEffect(() => {
   //    updateChoices(choice6, zz0009, "value", "text");
   // }, [zz0009]);

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

   const MM0201_S01 = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            itemNm: searchRef1.current?.value   || "999",
            itemGrp: searchRef2.current?.value  || "999",
            itemDiv: searchRef3.current?.value  || "999",
            subsYn: searchRef4.current?.value   || "999",
            deduYn: searchRef5.current?.value   || "999",
            useYn: searchRef6.current?.value    || "999",
       
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0201_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0201_S01 Error:", error);
         throw error;
      }
   };

   const MM0201_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0201_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0201_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const save = async () => {
      let grid = gridRef.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      setFocusRow(rowKey);
      const data = await getGridValues();

      if (data) {
         let result = await MM0201_U01(data);
         if (result) {
            returnResult(result);
         }
      }
   };
   const returnResult = async (result:any) => {
      alertSwal(result.msgText,result.msgCd, result.msgStatus);
      setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);
    
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

      grid.appendRow({ coCd: userInfo.coCd  ,itemGrp: "", itemDiv: "", taxYn: "N", pkgItemYn: "N", subsYn: "N", deduYn: "N", useYn: "Y", isNew: true }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      let focusRowKey = grid.getRow(rowKey) ? 0 : rowKey;

      grid.removeRow(rowKey, {});
      grid.focusAt(focusRowKey, 1, true);

      
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
               
                  if (key === "coCd") {
                     setTimeout(function () {
                        choice6?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "itemGrp") {
                     setTimeout(function () {
                        choice7?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "itemDiv") {
                     setTimeout(function () {
                        choice8?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "taxYn") {
                     setTimeout(function () {
                        choice9?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "pkgItemYn") {
                     setTimeout(function () {
                        choice10?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "subsYn") {
                     setTimeout(function () {
                        choice11?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "deduYn") {
                     setTimeout(function () {
                        choice12?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "useYn") {
                     setTimeout(function () {
                        choice13?.setChoiceByValue(value);
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
            <SelectComp1 ref={searchRef4} title="대체유무" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef5} title="공제유무" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef6} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
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
               <div className="">품목 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-12  justify-around items-center ">
               <SelectComp2 ref={refs.coCd} title="회사코드" target="coCd" setChangeGridData={setChangeGridData}  />
               <InputComp2 ref={refs.itemCd} title="품목코드" target="itemCd" setChangeGridData={setChangeGridData} readOnly={true} />
               <InputComp2 ref={refs.itemNm} title="품목명" target="itemNm" setChangeGridData={setChangeGridData}  />
               <InputComp2 ref={refs.spec} title="규격" target="spec" setChangeGridData={setChangeGridData} />
               
            </div>

            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <SelectComp2 ref={refs.itemGrp} title="품목그룹" target="itemGrp" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.itemDiv} title="품목구분" target="itemDiv" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.salePrice} title="판매단가" target="salePrice" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.costPrice} title="발주단가" target="costPrice" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <SelectComp2 ref={refs.taxYn} title="과세여부" target="taxYn" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.pkgItemYn} title="패키지품목추가" target="pkgItemYn" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.subsYn} title="대체유무" target="subsYn" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.deduYn} title="공제유무" target="deduYn" setChangeGridData={setChangeGridData} />
             
            </div>
            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <SelectComp2 ref={refs.useYn} title="사용유무" target="useYn" setChangeGridData={setChangeGridData} />
              
             
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
   
      { header: "회사코드", name: "coCd", width: 80 },
      { header: "품목코드", name: "itemCd", width: 100 },
      { header: "품목명", name: "itemNm", validation: { required: true} },
      { header: "규격", name: "spec", hidden: true },
      { header: "품목그룹", name: "itemGrp", hidden: true },
      { header: "품목구분", name: "itemDiv", hidden: true },
      { header: "판매단가", name: "salePrice", hidden: true },
      { header: "발주단가", name: "costPrice", hidden: true },
      { header: "과세여부", name: "taxYn", hidden: true },
      { header: "패키지품목추가", name: "pkgItemYn", hidden: true },
      { header: "대체유무", name: "subsYn", hidden: true },
      { header: "공제유무", name: "deduYn", hidden: true },
      { header: "사용여부", name: "useYn", hidden: true },
      // { header: "등록자", name: "insrtUserId", hidden: true },
      // { header: "등록일시", name: "insrtDt", hidden: true },
      // { header: "수정자", name: "updtUserId", hidden: true },
      // { header: "수정일시", name: "updtDt", hidden: true }
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

         <TuiGrid01 gridRef={gridRef} columns={columns}  handleFocusChange={handleFocusChange}/>
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

export default Mm0201;