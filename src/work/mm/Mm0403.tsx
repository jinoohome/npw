import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Mm0403 = ({ item, activeComp, leftMode, userInfo }: Props) => {

   const GridRef1 = useRef<any>(null);
   const GridRef2 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);
   const grid2GridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();

   const [zz0019, setZz0019] = useState<ZZ_CODE_RES[]>([]);
   const [poBp, setPoBp] = useState<any>([]);
   

   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "배송지" }, { name: "지역별 본부설정" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef2, containerRef: grid2GridContainerRef, sec: 200 });
   }, []);

   const setGridData = async () => {
      try {
         let zz0019Data = await ZZ_CODE({ coCd: "999", majorCode: "zz0019", div: "999" });
         if (zz0019Data != null) {
            setZz0019(zz0019Data);
         }

         let poBp = await ZZ_B_PO_BP('999');
           
         if (poBp != null) {
            poBp.unshift({ value: "", text: "" });
            setPoBp(poBp);
         }

         const grid1Result = await MM0403_S01();
         if (grid1Result?.length) {
            let result = await MM0403_S02({ siGunGu: grid1Result[0].code });

            
         }
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(GridRef1);
      refreshGrid(GridRef2);
   
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
      } else if (GridRef2.current) {
         GridRef2.current.getInstance().clear();
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
      }
   }, [gridDatas2]);

   // Grid 내부 Choicejs 데이터 설정
   useEffect(() => {
      if (zz0019) {
         let gridInstance = GridRef2.current.getInstance();
         let column = gridInstance.getColumn("dlvyDiv");
         let zz0019Data = zz0019.filter((item) => item.value !== "999");
         column.editor.options.listItems = zz0019Data;
         gridInstance.refreshLayout();
      }
   }, [zz0019]);

   useEffect(() => {
      if (poBp) {
         let gridInstance = GridRef2.current.getInstance();
         let column = gridInstance.getColumn("dlvyCd");
         
         column.editor.options.listItems = poBp;
         gridInstance.refreshLayout();
      }
   }, [poBp]);


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

   var ZZ_B_PO_BP = async (poBpDiv : any) => {
      try {
         const param = {
            coCd: userInfo.coCd,
            bpDiv: poBpDiv,            
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_B_PO_BP`, { data });

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
         console.error("ZZ_B_PO_BP Error:", error);
         throw error;
      }
   };

   const MM0403_S01 = async () => {
      const param = {
         coCd: userInfo.coCd,
         siDo: searchRef1.current?.value || '999',
         siGunGu: searchRef2.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`MM0403_S01`, { data });
      setGridDatas(result);
      return result;
   };

   const MM0403_S02 = async (param: { siGunGu: string }) => {
      const result2 = await fetchPost(`MM0403_S02`, param);

      setGridDatas2(result2);
      return result2;
   };

   const MM0403_U01 = async () => {
      try {
         const data = await getGridValues();

         const result = await fetchPost(`MM0403_U01`, data);
         return result as any;
      } catch (error) {
         console.error("MM0403_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const save = async () => {
      let result = await MM0403_U01();

      if (result) {
         returnResult(result);
      }
   };
   const returnResult = (result : any) => {
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let grid2Data = await getGridDatas(GridRef2);

      let data = {
         data: JSON.stringify(grid2Data),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
      };

      return data;
   };

   //grid 추가버튼
   const addMinorGridRow = () => {
      let grid1 = GridRef1.current.getInstance();
      let grid2 = GridRef2.current.getInstance();
      let flag = true;
      grid2.appendRow({}, { focus: true });

      let inSiGunGu = grid1.getValue(grid1.getFocusedCell().rowKey, "code");

      if (!inSiGunGu) {
         grid2.removeRow(grid2.getFocusedCell().rowKey);
         flag = false;
         let title = "지역코드 미등록";
         let msg = "지역코드 먼저 선택 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
      }

      grid2.setValue(grid2.getFocusedCell().rowKey, "coCd", "100", false);
      grid2.setValue(grid2.getFocusedCell().rowKey, "siGunGu", inSiGunGu, false);
      grid2.setValue(grid2.getFocusedCell().rowKey, "status", "I", false);
      grid2.setValue(grid2.getFocusedCell().rowKey, "useYn", "Y", false);
   };

   //grid 삭제버튼
   const delMinorGridRow = () => {
      let grid2 = GridRef2.current.getInstance();
      let { rowKey } = grid2.getFocusedCell();
      grid2.removeRow(rowKey, {});
   };

   //grid 포커스변경시
   const handleMajorFocusChange = async ({ rowKey }: any) => {
      if (rowKey === null) {
         rowKey = 0;
     }

      let grid1 = GridRef1.current.getInstance();
      let grid1Row = grid1.getRow(rowKey);
      let code = grid1Row.code;
      if (code) {
         await MM0403_S02({ siGunGu: code });
      }



      
   };
   // const handleMajorFocusChange2 = async (ev: any) => {
     
   //    const { rowKey, columnName } = ev;
   //    const rowData = ev.instance.getRow(rowKey);
   //    if(columnName === 'dlvyCd') {
   //       let filter = poBp.filter((item: any) => item.value === rowData.dlvyCd);
   //      // let poBp = await ZZ_B_PO_BP(rowData.dlvyDiv);
   //       if (filter != null) {
   //          filter.unshift({ value: "", text: "" });
   //          setFilterPoBp(filter);
     
   //       }
   //    }
   // };

   const  handleClick = async (ev: any) => {      
      let gridInstance = GridRef2.current.getInstance();
      let { rowKey, columnName } = ev;
      let rowData = ev.instance.getRow(rowKey);

      if (columnName === 'dlvyCd') {
         let filter = poBp.filter((item: any) => item.bpDiv === rowData.dlvyDiv);
         if (filter != null) {
            filter.unshift({ value: "", text: "" });
            let column = gridInstance.getColumn("dlvyCd");
            column.editor.options.listItems = filter;
            gridInstance.refreshLayout();

            gridInstance.finishEditing();
            gridInstance.startEditing(rowKey, columnName);
         }
      }
   };


   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      const grid1Result = await MM0403_S01();
      if (grid1Result?.length) {
         await MM0403_S02({ siGunGu: grid1Result[0].code });
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
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="시/도"></InputComp1>
            <InputComp1 ref={searchRef2} handleCallSearch={handleCallSearch} title="시/군/구"></InputComp1>
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "코드", name: "code", hidden: true },
      { header: "시/도", name: "siDo", align: "center", width: 300 },
      { header: "시/군/구", name: "siGunGu", align: "left" },      
      { header: "상태", name: "status", hidden: true },
      { header: "", name: "updtDt", hidden: true },
   ];

   const grid2Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "시/군/구", name: "siGunGu", align: "center" , hidden: true },
      { header: "시/군/구", name: "siGunGu", align: "center" , hidden: true },
      { header: "발주구분", name: "dlvyDiv", align: "center", formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: zz0019 } }},
      { header: "발주지점", name: "dlvyCd", align: "center",   formatter: "listItemText", editor: { type: ChoicesEditor, options: 
         { 
            listItems: poBp,
            instance: new ChoicesEditor({ columnInfo: { editor: { options: { listItems: poBp } } }, value: "" }) 
         } } },
      //  { header: "발주지점", name: "dlvyCd", align: "center",   formatter: "listItemText", editor: { type: 'select'}},
      //{ header: "발주지점", name: "dlvyCd" },
      { header: "상태", name: "status", hidden: true },
   ];

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">지역 리스트</div>
            </div>            
         </div>

         <TuiGrid01 columns={grid1Columns} handleFocusChange={handleMajorFocusChange} gridRef={GridRef1} />
      </div>
   );

   const Grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">발주지점 정보</div>
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

         <TuiGrid01 columns={grid2Columns} handleClick={handleClick} gridRef={GridRef2} />
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
            <div className="w-1/2" ref={gridGridContainerRef}>{Grid1()}</div>
            <div className="w-1/2" ref={grid2GridContainerRef}>{Grid2()} </div>
         </div>
      </div>
   );
};

export default Mm0403;
