import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, SelectSearch, CommonModal, commas, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import DatePickerEditor from "../../util/DatePickerEditor";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Mm0501 = ({ item, activeComp, leftMode, userInfo }: Props) => {

   const GridRef1 = useRef<any>(null);
   const GridRef2 = useRef<any>(null);
   const GridRef3 = useRef<any>(null);
   const GridRef4 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);
   const grid2GridContainerRef = useRef(null);
   const grid3GridContainerRef = useRef(null);
   const grid4GridContainerRef = useRef(null);
   
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
   });

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();
   const [gridDatas4, setGridDatas4] = useState<any[]>();

   const [isOpen, setIsOpen] = useState(false);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "재고" }, { name: "본부&창고별 재고관리" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef2, containerRef: grid2GridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef3, containerRef: grid3GridContainerRef, sec: 200 });
   }, []);

   const setGridData = async () => {
      try {
         const grid1Result = await MM0501_S01();
         if (grid1Result?.length) {
            let whNm = searchRef2.current?.value || '999'            
            const grid2Result = await MM0501_S02(grid1Result[0].bpCd,whNm);
            if (grid2Result?.length) {
               let itemNm = searchRef3.current?.value || '999'
               await MM0501_S03( grid2Result[0].bpCd, grid2Result[0].whCd, itemNm);
            } 
         } else {
            if (GridRef2.current) {
               GridRef2.current.getInstance().clear();
            }

            if (GridRef3.current) {
               GridRef3.current.getInstance().clear();
            }
         }
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(GridRef1);
      refreshGrid(GridRef2);
      refreshGrid(GridRef3);
   
   }, [activeComp, leftMode]);

   // Grid 데이터 설정
   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         let grid1 = GridRef1.current.getInstance();
         grid1.resetData(gridDatas1);

         let focusRowKey = grid1.getFocusedCell()?.rowKey || 0;

         if (gridDatas1.length > 0) {
            grid1.focusAt(focusRowKey, 0, true);
         }
      } else {
         if (GridRef2.current) {
            GridRef2.current.getInstance().clear();
         }
      }
   }, [gridDatas1]);

   // Grid 데이터 설정
   useEffect(() => {
      if (GridRef2.current && gridDatas2) {
         let grid2 = GridRef2.current.getInstance();
         grid2.resetData(gridDatas2);

         let focusRowKey = grid2.getFocusedCell().rowKey || 0;

         if (gridDatas2.length > 0) {
            grid2.focusAt(focusRowKey, 0, true);
         }
      } else if (GridRef3.current) {
         GridRef3.current.getInstance().clear();
      }
   }, [gridDatas2]);

   // Grid 데이터 설정
   useEffect(() => {
      if (GridRef3.current && gridDatas3) {
         let grid3 = GridRef3.current.getInstance();
         grid3.resetData(gridDatas3);

         let focusRowKey = grid3.getFocusedCell().rowKey || 0;

         if (gridDatas3.length > 0) {
            grid3.focusAt(focusRowKey, 0, true);
         }
      }
   }, [gridDatas3]);

   useEffect(() => {
      if (GridRef4.current && gridDatas4) {
         let grid4 = GridRef4.current.getInstance();
         grid4.resetData(gridDatas4);

         let focusRowKey = grid4.getFocusedCell().rowKey || 0;

         if (gridDatas4.length > 0) {
            grid4.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas4]);

   useEffect(() => {
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
          await MM0201_S01();
      };
  
      handleSearch();
  }, [inputValues.itemGrp, inputValues.itemDiv]);

   //---------------------- api -----------------------------
   const MM0501_S01 = async () => {
      const param = {
         coCd: userInfo.coCd,
         poBpNm: searchRef1.current?.value || '999',
         whNm: searchRef2.current?.value || '999',
         itemNm: searchRef3.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`MM0501_S01`, { data });
      setGridDatas(result);
      return result;
   };

   const MM0501_S02 = async (bpCd: string, whNm: string ) => {
      const param = {
         bpCd: bpCd,
         whNm: whNm,
      };
      const data = JSON.stringify(param);
      const result2 = await fetchPost(`MM0501_S02`, {data});
      setGridDatas2(result2);
      return result2;
   };

   const MM0501_S03 = async (bpCd: string, whCd: string, itemNm: string) => {
      const param = {
         bpCd: bpCd,
         whCd: whCd,
         itemNm: itemNm,
      };
      const data = JSON.stringify(param);
      const result3 = await fetchPost(`MM0501_S03`, {data});
      setGridDatas3(result3);
      return result3;
   };

   const MM0501_U03 = async () => {
      try {
         const data = await getGridValues();
         console.log(data);
         const result = await fetchPost(`MM0501_U03`, data);
         return result as any;
      } catch (error) {
         console.error("MM0501_U03 Error:", error);
         throw error;
      }
   };

   const MM0201_S01 = async () => {
      try {
         const param = {
            coCd: "100",
            itemNm: searchRef4.current?.value || "999",
            itemGrp: inputValues.itemGrp || "999",
            itemDiv: inputValues.itemDiv || "999",
            pkgItemYn: "999",
            subsYn:  "999",
            deduYn:  "999",
            useYn: 'Y',
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0202_S01`, { data });
         setGridDatas4(result);

         return result;
      } catch (error) {
         console.error("MM0201_S01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------
   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => {
          // null, undefined, ""을 하나의 빈 값으로 취급
          const currentValue = prevValues[name] ?? "";
          const newValue = value ?? "";
  
          // 동일한 값일 경우 상태를 업데이트하지 않음
          if (currentValue === newValue) {
              return prevValues;
          }
  
          return {
              ...prevValues,
              [name]: newValue,
          };
      });
   };

   const search = () => {
      setGridData();
   };

   const save = async () => {
      let grid3Data = await getGridDatas(GridRef3);

      // 입고일자 체크 로직 추가
      const missingEnterDtRows = grid3Data.filter((row: any) => !row.enterDt || row.enterDt.trim() === "");

      if (missingEnterDtRows.length > 0) {
      // 입고일자가 비어있다면 경고 메시지 출력
      alertSwal("입고일자 미등록","입고일자를 입력해 주세요", "warning");
      return;
   }

      let result = await MM0501_U03();
      if (result) {
         returnResult(result);
      }
   };
   const returnResult = (result:any) => {
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let grid2Data = await getGridDatas(GridRef2);
      let grid3Data = await getGridDatas(GridRef3);

      let data = {
         wh: JSON.stringify(grid2Data),
         whItem: JSON.stringify(grid3Data),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
      };

      return data;
   };

   //grid 추가버튼
   const addMajorGridRow = () => {
      let grid1 = GridRef1.current.getInstance();
      let grid2 = GridRef2.current.getInstance();
      let grid3 = GridRef3.current.getInstance();

      let inBpCd = grid1.getValue(grid1.getFocusedCell().rowKey, "bpCd");

      grid2.appendRow({  coCd: "100", status: "I", bpCd: inBpCd, useYn: "Y"}, { at: 0 });
      grid2.focusAt(0, 1, true);
      grid3.clear();
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = GridRef2.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };

   //grid 추가버튼
   const addMinorGridRow = () => {
      let grid2 = GridRef2.current.getInstance();
      let flag = true;

      let inWhCd = grid2.getValue(grid2.getFocusedCell().rowKey, "whCd");

      if (!inWhCd) {
         flag = false;
         let title = "창고코드 미등록";
         let msg = "창고코드 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
      }

      if (flag) {
         openModal();
      }      
   };

   //grid 삭제버튼
   const delMinorGridRow = () => {
      let grid = GridRef3.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };

   //grid 포커스변경시
   const handleMajorFocusChange = async ({ rowKey }: any) => {
      if (rowKey === null) {
         rowKey = 0;
     }

      let grid1 = GridRef1.current.getInstance();
      let grid1Row = grid1.getRow(rowKey);
      let coCd = '100';
      let bpCd = grid1Row.bpCd;
      let whNm = searchRef2.current?.value || '999'
      if (bpCd) {
         const grid2Result = await MM0501_S02(bpCd, whNm);
         if (!grid2Result.length) {
            if (GridRef3.current) {
               GridRef3.current.getInstance().clear();
            }
         }
      }
   };

   //grid 포커스변경시
   const handleMajorFocusChange2 = async ({ rowKey }: any) => {
      if (rowKey === null) {
         rowKey = 0;
     }

      let grid2 = GridRef2.current.getInstance();
      let grid2Row = grid2.getRow(rowKey);
      let bpCd = grid2Row.bpCd;
      let whCd = grid2Row.whCd;
      let itemNm = searchRef3.current?.value || '999'
      if (whCd) {
         await MM0501_S03(bpCd, whCd, itemNm);
      } else {
         if (GridRef3.current) {
            GridRef3.current.getInstance().clear();
         }
      }
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      const grid1Result = await MM0501_S01();
      if (grid1Result?.length) {
         let whNm = searchRef2.current?.value || '999'            
         const grid2Result = await MM0501_S02(grid1Result[0].bpCd,whNm);
         if (grid2Result?.length) {
            let itemNm = searchRef3.current?.value || '999'
            await MM0501_S03( grid2Result[0].bpCd, grid2Result[0].whCd, itemNm);
         }
      } else {
         if (GridRef2.current) {
            GridRef2.current.getInstance().clear();
         }

         if (GridRef3.current) {
            GridRef3.current.getInstance().clear();
         }
      }
   };

   const handleCallSearchModal = async () => {
      await MM0201_S01();
     
  };

   const openModal = async() => {
      setIsOpen(true);
      await MM0201_S01();
      refreshGrid(GridRef4);
    };
  
    const closeModal = () => {
      setIsOpen(false);
    };

    const addItems = () => {
      const grid1 = GridRef1.current.getInstance();
      const rowData1 = grid1.getRow(grid1.getFocusedCell().rowKey);

      const grid2 = GridRef2.current.getInstance();
      const rowData2 = grid2.getRow(grid2.getFocusedCell().rowKey);

      const grid4 = GridRef4.current.getInstance();
      const checkedRows = grid4.getCheckedRows();
  
      const grid3 = GridRef3.current.getInstance();
      const existingItemCds = new Set(grid3.getData().map((row: any) => row.itemCd));
  
      checkedRows.forEach((row: any) => {
          if (!existingItemCds.has(row.itemCd)) {  // itemCd 중복 확인
              const newRow = {
                  coCd: rowData1.coCd,
                  bpCd: rowData1.bpCd,
                  whCd: rowData2.whCd,
                  itemCd: row.itemCd,
                  itemNm: row.itemNm,
                  useYn: "Y",
                  status: "I"
              };
  
              grid3.appendRow(newRow, { focus: true });
          }
      });
  
      closeModal();
  };

  const handleDblClick = (ev: any) => {
      const { rowKey } = ev;

      const grid4 = GridRef4.current.getInstance();
      const rowData3 = grid4.getRow(rowKey);

      const grid2 = GridRef2.current.getInstance();
      const rowData2 = grid2.getRow(grid2.getFocusedCell().rowKey);

      const grid1 = GridRef1.current.getInstance();
      const rowData1 = grid1.getRow(grid1.getFocusedCell().rowKey);

      const grid3 = GridRef3.current.getInstance();
      const existingItemCds = new Set(grid3.getData().map((row: any) => row.itemCd));

      if (!existingItemCds.has(rowData3.itemCd)) {  // itemCd 중복 확인
         const newRow = {
            coCd: rowData1.coCd,
                  bpCd: rowData1.bpCd,
                  whCd: rowData2.whCd,
                  itemCd: rowData3.itemCd,
                  itemNm: rowData3.itemNm,
                  useYn: "Y",
                  status: "I"
         };

         grid3.appendRow(newRow, { focus: true });
      }

      setIsOpen(false);
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
      <div className="bg-gray-100 rounded-lg p-5 search text-sm">
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="본부명"></InputComp1>
            <InputComp1 ref={searchRef2} handleCallSearch={handleCallSearch} title="창고명"></InputComp1>
            <InputComp1 ref={searchRef3} handleCallSearch={handleCallSearch} title="품목명"></InputComp1>
         </div>
      </div>
   );

   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-3  gap-y-3  justify-start w-[80%]">
               <InputComp1 ref={searchRef4} handleCallSearch={handleCallSearchModal} title="품목명"></InputComp1>
               <SelectSearch
                       title="품목그룹"
                       value={inputValues.itemGrp}
                       onChange={(label, value) => {
                          onInputChange("itemGrp", value);
                          handleCallSearchModal();
                       }}

                       param={{ coCd: "999", majorCode: "CD0004", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <SelectSearch
                       title="품목구분"
                       value={inputValues.itemDiv}
                       onChange={(label, value) => {
                          onInputChange("itemDiv", value);
                          handleCallSearchModal();
                       }}

                       param={{ coCd: "999", majorCode: "CD0005", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearchModal} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>
         </div>
      </div>
   );

   const ModalDiv = () => (
      <CommonModal isOpen={isOpen} onClose={closeModal} title="품목등록">
         {modalSearchDiv()}
         {Grid4()}
      </CommonModal>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "본부 코드", name: "bpCd", align: "center", width: 100 },
      { header: "본부명", name: "bpNm", align: "left" },    
      { header: "상태", name: "status", hidden: true },
      { header: "", name: "updtDt", hidden: true },
   ];

   const grid2Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "본부 코드", name: "bpCd", align: "center" , hidden: true },
      { header: "창고코드", name: "whCd", align: "center", width: 100 },
      { header: "창고명", name: "whNm", editor: "text"},
      { header: "상태", name: "status", hidden: true },
   ];

   const grid3Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "본부 코드", name: "bpCd", align: "center" , hidden: true },
      { header: "창고코드", name: "whCd", align: "center", hidden: true },
      { header: "품목코드", name: "itemCd", align: "center", width: 140 },
      { header: "품목명", name: "itemNm", width: 600},
      { header: "입고일자", name: "enterDt", align: 'center', width: 140,
         editor: {
            type: 'datePicker',
            options: {
                  language: 'ko',
                  format: 'yyyy-MM-dd',
                  timepicker: false
            }
        }},
      { header: "재고수량", name: "onhandQty", editor: "text", align: "center",
         formatter: function(e: any) {
            if(e.value){return commas(e.value);}
         }},
      { header: "상태", name: "status", hidden: true },
   ];

   const grid4Columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 300 },
      { header: "규격", name: "spec", width: 200 },
      { header: "품목그룹", name: "itemGrpNm", width: 100 },
      { header: "품목구분", name: "itemDivNm", width: 100 },
      { header: "판매단가", name: "salePrice", width: 100, align: "right",   
         formatter: function(e: any) {if(e.value){return commas(e.value);} }  },
      { header: "발주단가", name: "costPrice", width: 100, align: "right",  
         formatter: function(e: any) {if(e.value){return commas(e.value);} }  },
      { header: "과세여부", name: "taxYn", width: 100, align: "center" },
      { header: "패키지품목추가", name: "pkgItemYn", hidden: true },
      { header: "대체유무", name: "subsYn", width : 100, align: "center" },
      { header: "공제유무", name: "deduYn", width : 100, align: "center" },
      { header: "사용여부", name: "useYn", hidden: true },
   ];

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">본부 리스트</div>
            </div>            
         </div>

         <TuiGrid01 columns={grid1Columns} handleFocusChange={handleMajorFocusChange} gridRef={GridRef1} height={(window.innerHeight - 450) / 2} perPageYn = {false} />
      </div>
   );

   const Grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">창고 리스트</div>
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

         <TuiGrid01 columns={grid2Columns} handleFocusChange={handleMajorFocusChange2} gridRef={GridRef2} height={(window.innerHeight - 450) / 3} perPageYn = {false} />
      </div>
   );

   const Grid3 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목 리스트</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addMinorGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delMinorGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 columns={grid3Columns} gridRef={GridRef3} />
      </div>
   );

   const Grid4 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>※ 더블클릭 시 단일 품목이 선택 됩니다.</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addItems} className="bg-orange-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  선택등록
               </button>
            </div>
         </div>
         <TuiGrid01 gridRef={GridRef4} columns={grid4Columns} rowHeaders={['checkbox','rowNum']} handleDblClick={handleDblClick} height = {window.innerHeight - 530}
         />
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
         <div className="w-full h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-1/3 flex flex-col space-y-2">
               <div className="" ref={gridGridContainerRef}>{Grid1()}</div>
               <div className="" ref={grid2GridContainerRef}>{Grid2()}</div>
            </div>
            <div className="w-2/3 h-full" ref={grid3GridContainerRef}>{Grid3()}</div> 
         </div>
         {ModalDiv()}
      </div>
   );
};



export default Mm0501;

