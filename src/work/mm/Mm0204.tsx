import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, commas } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Mm0204 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);

   const [searchChoices, setSearchChoices] = useState<{ [key: string]: any }>({});

   const [gridDatas, setGridDatas] = useState<any[]>();
   const breadcrumbItem = [{ name: "기준정보" }, { name: "품목" }, { name: "품목 조회 (유지보수)" }];

   const [cd0004, setCd0004] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005, setCd0005] = useState<ZZ_CODE_RES[]>([]);
   const [workCdsSearch, setWorkCdsSearch] = useState<any>([]);
   const [focusRow, setFocusRow] = useState<any>(0);

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      // Search Choices
      initChoice(searchRef2, (choice) => setSearchChoices((prev) => ({ ...prev, workCd: choice })));
      initChoice(searchRef3, (choice) => setSearchChoices((prev) => ({ ...prev, itemGrp: choice })));
      initChoice(searchRef4, (choice) => setSearchChoices((prev) => ({ ...prev, itemDiv: choice })));
      initChoice(searchRef5, (choice) => setSearchChoices((prev) => ({ ...prev, useYn: choice })), [
         { value: "999", label: "전체" },
         { value: "Y", label: "사용", selected: true },
         { value: "N", label: "미사용" },
      ]);
   };


   const setGridData = async () => {
      try {
         let cd0004Data = await ZZ_CODE({ coCd: "999", majorCode: "MA0006", div: "999" });
         if (cd0004Data != null) {
            setCd0004(cd0004Data);
         }

         let cd0005Data = await ZZ_CODE({ coCd: "999", majorCode: "MA0007", div: "999" });
         if (cd0005Data != null) {
            setCd0005(cd0005Data);
         }
         
         let workCdData = await ZZ_WORKS();
         if (workCdData != null) {
            let workCdSearch = workCdData.slice();
            workCdSearch = workCdSearch.filter((item) => !(item.value === "" && item.text === ""));
            workCdSearch.unshift({ value: "999", text: "전체" });
            setWorkCdsSearch(workCdSearch);
         }


         await MM0204_S01();
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
            let checkFocusRow = grid.getValue(focusRow, "itemCd") ? focusRow : 0;
            grid.focusAt(checkFocusRow, 0, true);
         }
      }
   }, [gridDatas]);

   useEffect(() => {
      updateChoices(searchChoices.itemGrp, cd0004, "value", "text");
   }, [cd0004]);

   useEffect(() => {
      updateChoices(searchChoices.itemDiv, cd0005, "value", "text");
   }, [cd0005]);

   useEffect(() => {
      updateChoices(searchChoices.workCd, workCdsSearch, "value", "text");
   }, [workCdsSearch]);


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

   const MM0204_S01 = async () => {
      try {
         const param = {
            coCd: "200",
            itemNm: searchRef1.current?.value || "999",
            workCd: searchRef2.current?.value || "999",
            itemGrp: searchRef3.current?.value || "999",
            itemDiv: searchRef4.current?.value || "999",
            useYn: searchRef5.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0204_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0204_S01 Error:", error);
         throw error;
      }
   };

   const ZZ_WORKS = async () => {
      try {
         const param = {
            coCd:  userInfo.coCd,
            workCd:  "999",
            workNm:  "999",
            useYn:  "Y",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_WORKS`, { data });   

         let formattedResult = Array.isArray(result)
            ? result.map(({ workCd, workNm, ...rest }) => ({
                 value: workCd,
                 text: workNm,
                 label: workNm,
                 ...rest,
              })
            )
            : [];
     
         return formattedResult;
      } catch (error) {
         console.error("ZZ_WORKS Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
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
      </div>
   );

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="품목명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="작업그룹" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="품목그룹" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef4} title="품목구분" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef5} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );
   //input div
   

   //-------------------grid----------------------------
   const columns = [
      { header: "회사코드", name: "coCd", width: 80, align: "center", hidden: true},
      { header: "사업부서", name: "bpNm", width: 80, align: "center"},
      { header: "작업코드", name: "workCd", width: 100, align: "center", hidden: true},
      { header: "작업", name: "workNm", width: 150},
      { header: "품목코드", name: "itemCd", width: 100, align: "center"},
      { header: "품목명", name: "itemNm", width: 300},
      { header: "규격", name: "spec", width:200},
      { header: "품목그룹코드", name: "itemGrp", align: "center", width:120, hidden: true},
      { header: "품목그룹", name: "itemGrpNm", width:200},
      { header: "품목구분코드", name: "itemDiv", align: "center", width:120,  hidden: true},
      { header: "품목구분", name: "itemDivNm", width:200},
      { header: "판매단가", name: "salePrice", align: "right", width: 100, 	
         formatter: function(e: any) {
            if(e.value){return commas(e.value);}
         }
      },
      { header: "발주단가", name: "costPrice", align: "right", width: 100,
         formatter: function(e: any) {
         if(e.value){return commas(e.value);}
      }
      },
      { header: "사용여부", name: "useYn", align: "center"},
   ];

   // const summary = {
   //    height: 40,
   //    position: 'top', 
   //    columnContent: {
   //       // bpNm: {
   //       //      template: (e:any) => {
   //       //          return  `총 ${e.cnt}개`;
              
   //       //      }
   //       //  },     
   //        itemDivNm: {
   //          template: (e:any) => {
   //              return `합계 : `;
   //          }
   //       },
   //       salePrice: {
   //          template: (e:any) => {                  
   //             const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
   //             return `${commas(data)}`; // 합계 표시
   //             }
   //       },   
   //       costPrice: {
   //          template: (e:any) => {                  
   //             const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
   //             return `${commas(data)}`; // 합계 표시
   //             }
   //       },  
   //    }
   // }

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목 리스트</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns}
                  height = {window.innerHeight - 590} />
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
            <div className="w-full" ref={gridContainerRef}>
               {grid()}
            </div>
           
         </div>
      </div>
   );
};

export default Mm0204;
