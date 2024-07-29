import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
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

   const gridGridContainerRef = useRef(null);
   const grid2GridContainerRef = useRef(null);
   const grid3GridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();

   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "재고" }, { name: "본부&창고별 재고관리" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef2, containerRef: grid2GridContainerRef, sec: 200 });
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

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const save = async () => {
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
      let flag = true;
      grid2.appendRow({}, { focus: true });

      let inBpCd = grid1.getValue(grid1.getFocusedCell().rowKey, "bpCd");

      grid2.setValue(grid2.getFocusedCell().rowKey, "coCd", "100", false);
      grid2.setValue(grid2.getFocusedCell().rowKey, "bpCd", inBpCd, false);
      grid2.setValue(grid2.getFocusedCell().rowKey, "status", "I", false);
      grid3.clear();
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid2 = GridRef2.current.getInstance();     
      let { rowKey } = grid2.getFocusedCell();
      grid2.removeRow(rowKey, {});
   };

   //grid 추가버튼
   const addMinorGridRow = () => {
      let grid2 = GridRef2.current.getInstance();
      let grid3 = GridRef3.current.getInstance();
      let flag = true;
      grid3.appendRow({}, { focus: true });

      let inBpCd = grid2.getValue(grid2.getFocusedCell().rowKey, "bpCd");
      let inWhCd = grid2.getValue(grid2.getFocusedCell().rowKey, "whCd");

      if (!inWhCd) {
         grid3.removeRow(grid3.getFocusedCell().rowKey);
         flag = false;
         let title = "창고코드 미등록";
         let msg = "창고코드 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
      }

      grid3.setValue(grid3.getFocusedCell().rowKey, "coCd", "100", false);
      grid3.setValue(grid3.getFocusedCell().rowKey, "bpCd", inBpCd, false);
      grid3.setValue(grid3.getFocusedCell().rowKey, "whCd", inWhCd, false);
      grid3.setValue(grid3.getFocusedCell().rowKey, "status", "I", false);
      grid3.setValue(grid3.getFocusedCell().rowKey, "useYn", "Y", false);
   };

   //grid 삭제버튼
   const delMinorGridRow = () => {
      let grid3 = GridRef3.current.getInstance();
      let { rowKey } = grid3.getFocusedCell();
      grid3.removeRow(rowKey, {});
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
      }
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
      { header: "품목코드", name: "itemCd", align: "center", editor: "text" },
      { header: "품목명", name: "itemNm"},
      { header: "입고일자", name: "enterDt", align: 'center',
         editor: {
            type: 'datePicker',
            options: {
                  language: 'ko',
                  format: 'yyyy-MM-dd',
                  timepicker: false
            }
        }},
      { header: "재고수량", name: "onhandQty", editor: "text"},
      { header: "상태", name: "status", hidden: true },
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
            <div className="w-1/4 flex flex-col space-y-2">
               <div className="" ref={gridGridContainerRef}>{Grid1()}</div>
               <div className="" ref={grid2GridContainerRef}>{Grid2()}</div>
            </div>
            <div className="w-3/4 h-full" ref={grid3GridContainerRef}>{Grid3()}</div> 
         </div>
      </div>
   );
};



export default Mm0501;

