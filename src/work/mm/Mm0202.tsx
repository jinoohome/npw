import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, commas } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Mm0202 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);

   const [searchChoices, setSearchChoices] = useState<{ [key: string]: any }>({});
   const [errorMsgs, setErrorMsgs] = useState<{ [key: string]: string }>({});

   const [gridDatas, setGridDatas] = useState<any[]>();
   const breadcrumbItem = [{ name: "기준정보" }, { name: "품목" }, { name: "품목 조회 (장례지원단)" }];

   const [cd0004, setCd0004] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005, setCd0005] = useState<ZZ_CODE_RES[]>([]);
   const [cd0004Input, setCd0004Input] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005Input, setCd0005Input] = useState<ZZ_CODE_RES[]>([]);
   const [coCds, setCoCds] = useState<ZZ_CODE_RES[]>([]);
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
      initChoice(searchRef2, (choice) => setSearchChoices((prev) => ({ ...prev, itemGrp: choice })));
      initChoice(searchRef3, (choice) => setSearchChoices((prev) => ({ ...prev, itemDiv: choice })));
      initChoice(searchRef4, (choice) => setSearchChoices((prev) => ({ ...prev, subsYn: choice })), [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(searchRef5, (choice) => setSearchChoices((prev) => ({ ...prev, deduYn: choice })), [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(searchRef6, (choice) => setSearchChoices((prev) => ({ ...prev, useYn: choice })), [
         { value: "999", label: "전체" },
         { value: "Y", label: "사용", selected: true },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      try {
         let cd0004Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0004", div: "999" });
         if (cd0004Data != null) {
            setCd0004(cd0004Data);

            let cd0004IntupData = cd0004Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            cd0004IntupData.unshift({ value: "", text: "" });

            setCd0004Input(cd0004IntupData);
         }

         let cd0005Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0005", div: "999" });
         if (cd0005Data != null) {
            setCd0005(cd0005Data);

            let cd0005IntupData = cd0005Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            cd0005IntupData.unshift({ value: "", text: "" });

            setCd0005Input(cd0005IntupData);
         }

         let coCdData = await ZZ_B_BIZ();
         if (coCdData != null) {
            setCoCds(coCdData);
         }

         await MM0202_S01();
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

   // //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(searchChoices.itemGrp, cd0004, "value", "text");
   }, [cd0004]);

   useEffect(() => {
      updateChoices(searchChoices.itemDiv, cd0005, "value", "text");
   }, [cd0005]);

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
   };

   const MM0202_S01 = async () => {
      try {
         const param = {
            coCd: "100",
            itemNm: searchRef1.current?.value || "999",
            itemGrp: searchRef2.current?.value || "999",
            itemDiv: searchRef3.current?.value || "999",
            subsYn: searchRef4.current?.value || "999",
            deduYn: searchRef5.current?.value || "999",
            pkgItemYn: "999",
            useYn: searchRef6.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0202_S01`, { data });
         console.log("MM0202_S01", result);
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0202_S01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setErrorMsgs({});
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
            <SelectComp1 ref={searchRef2} title="품목그룹" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="품목구분" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef4} title="대체유무" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef5} title="공제유무" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef6} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );
   //input div
   

   //-------------------grid----------------------------
   const columns = [
      { header: "회사코드", name: "coCd", width: 80, align: "center", hidden: true},
      { header: "사업부서", name: "bpNm", width: 80, align: "center"},
      { header: "품목코드", name: "itemCd", width: 100, align: "center"},
      { header: "품목명", name: "itemNm", width: 250},
      { header: "규격", name: "spec", width:200},
      { header: "품목그룹코드", name: "itemGrp", align: "center", width:120, hidden: true},
      { header: "품목그룹", name: "itemGrpNm"},
      { header: "품목구분코드", name: "itemDiv", align: "center", width:120, hidden: true},
      { header: "품목구분", name: "itemDivNm"},
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
      { header: "과세여부", name: "taxYn", align: "center", width: 80},
      { header: "패키지품목추가", name: "pkgItemYn", align: "center", width: 120},
      { header: "대체유무", name: "subsYn", align: "center", width: 80},
      { header: "공제유무", name: "deduYn", align: "center", width: 80},
      { header: "사용여부", name: "useYn", align: "center", width: 80},
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

export default Mm0202;
