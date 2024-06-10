import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { SOL_ZZ_CODE_REQ, SOL_ZZ_CODE_RES, SOL_ZZ_CODE_API } from "../../ts/SOL_ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
const breadcrumbItem = [{ name: "관리자" }, { name: "메뉴" }, { name: "메뉴권한관리" }];
interface Props {
   item: any;
   activeComp: any;
}

const Mm0102 = ({ item, activeComp }: Props) => {
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const gridRef1 = useRef<any>(null);
   const gridRef2 = useRef<any>(null);
   const gridRef3 = useRef<any>(null);

   const gridContainerRef1 = useRef(null); 
   const gridContainerRef2 = useRef(null); 
   const gridContainerRef3 = useRef(null); 

   const [gridDatas1, setGridDatas1] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();

  
   const [searchChoice1, setSearchChoice1] = useState<any>();
   const [searchChoice2, setSearchChoice2] = useState<any>();
   
   const [choice1, seChoice1] = useState<any[]>();
   const [choice2, seChoice2] = useState<any[]>();
   const [choice3, seChoice3] = useState<any[]>();

   const [tabIndex, setTabIndex] = useState(0);
   

   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef1, containerRef: gridContainerRef1, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
   }, []);

   const setChoiceUI = () => {
      initChoice(searchRef2, setSearchChoice1);
      initChoice(searchRef3, setSearchChoice2);
   };


   const setGridData = async () => {
      try {
         await SOL_ZZ_B_BIZ();
         await SOL_ZZ_MENU();
         await SOL_MM001_S01();

         let gridDatas1 = await SOL_MM0102_S01();
         let gId = gridDatas1[0].gId;
         if (gId) {
            let gridDatas2 = await SOL_MM0102_S02(gId);
            let gridDatas3 = await SOL_MM0102_S03(gId);
            setGridDatas1(gridDatas1);
            setGridDatas2(gridDatas2);
            setGridDatas3(gridDatas3);
         }
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   const handleCallSearch = () => {
      setGridData();
   };

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef1);
      refreshGrid(gridRef2);
      refreshGrid(gridRef3);
   }, [activeComp]);

   useEffect(() => {
      try {
         if (gridRef1.current && Array.isArray(gridDatas1)) {
            let grid = gridRef1.current.getInstance();
            grid.resetData(gridDatas1);

            let focusRowKey = grid.getFocusedCell()?.rowKey || 0;
            if (gridDatas1.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         } else {
            console.log("gridDatas1 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas1]);

   useEffect(() => {
      try {
         if (gridRef2.current && Array.isArray(gridDatas2)) {
            let grid = gridRef2.current.getInstance();
            grid.resetData(gridDatas2);
         } else {
            console.log("gridDatas1 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas2]);

   useEffect(() => {
      try {
         if (gridRef3.current && Array.isArray(gridDatas3)) {
            let grid = gridRef3.current.getInstance();
            grid.resetData(gridDatas3);
         } else {
            console.log("gridDatas1 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas3]);


   useEffect(() => {
    

      if (choice1) {
         let gridInstance = gridRef1.current.getInstance();
         let column = gridInstance.getColumn("coCd");
         column.editor.options.listItems = choice1;
         gridInstance.refreshLayout();
      }
   }, [choice1]);
 
   useEffect(() => {
      if (choice2) {
         updateChoices(searchChoice1, choice2, "value", "label");
         let gridInstance = gridRef2.current.getInstance();
         let column = gridInstance.getColumn("menuId");
         column.editor.options.listItems = choice2;
         gridInstance.refreshLayout();
      }
   }, [choice2]);
 
   useEffect(() => {
      if (choice3) {
         updateChoices(searchChoice2, choice3, "value", "label");
         let gridInstance = gridRef3.current.getInstance();
         let column = gridInstance.getColumn("usrId");
         column.editor.options.listItems = choice3;
         gridInstance.refreshLayout();
      }
   }, [choice3]);

   //---------------------- api -----------------------------
   const SOL_MM0102_S01 = async () => {
      try {
         const param = {
            coCd: "999",
            gId: "999",
            gName: "999",
            div: "999",
            sysGrp: "999",
            useYn: "999",
            menuId: "999",
            usrId: "999",
            bpNm: "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_MM0102_S01`, { data });
         setGridDatas1(result);
         return result;
      } catch (error) {
         console.error("SOL_MM0102_S01 Error:", error);
         throw error;
      }
   };
   const SOL_MM0102_S02 = async (gId: string) => {
      try {
         const param = {
            gId: gId,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_MM0102_S02`, { data });
         setGridDatas2(result);
         return result;
      } catch (error) {
         console.error("SOL_MM0102_S02 Error:", error);
         throw error;
      }
   };
   const SOL_MM0102_S03 = async (gId: string) => {
      try {
         const param = {
            gId: gId,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_MM0102_S03`, { data });
         setGridDatas3(result);
         return result;
      } catch (error) {
         console.error("SOL_MM0102_S01 Error:", error);
         throw error;
      }
   };

   var SOL_ZZ_B_BIZ = async () => {
      try {
         const param = {
            coCd: '999',
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_ZZ_B_BIZ`, { data });
         console.log("SOL_ZZ_B_BIZ", result);
         let formattedResult = Array.isArray(result)
         ? result.map(({ coCd, bpNm, ...rest }) => ({
              value: coCd,
              text: bpNm,
              label: bpNm,
              ...rest,
           }))
         : [];
         seChoice1(formattedResult);
         return result;
      } catch (error) {
         console.error("SOL_MM0102_S01 Error:", error);
         throw error;
      }
   }

   var SOL_ZZ_MENU = async () => {
      try {
         const param = {
            usrId: "sckcs",
            menuDiv: "",
         };

         const result = await fetchPost(`SOL_ZZ_MENU`, param );
         console.log("SOL_ZZ_MENU", result);
         let formattedResult = Array.isArray(result)
         ? result.map(({ menuId, menuName, ...rest }) => ({
              value: menuId,
              text: menuName,
              label: menuName,
              ...rest,
           }))
         : [];
         seChoice2(formattedResult);
         return result;
      } catch (error) {
         console.error("SOL_MM0102_S01 Error:", error);
         throw error;
      }
   }

   var SOL_MM001_S01 = async () => {
      try {
         const param = {
            coCd : '999',
            usrId : '999',
            usrNm : '999',
            usrDiv : '999',
            sysDiv : '999',
            confirmYn : '999',
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_MM001_S01`, { data });
         console.log("SOL_MM001_S01", result);
         let formattedResult = Array.isArray(result)
         ? result.map(({ usrId, usrNm, ...rest }) => ({
              value: usrId,
              text: usrNm,
              label: usrNm,
              ...rest,
           }))
         : [];
         seChoice3(formattedResult);
         return result;
      } catch (error) {
         console.error("SOL_MM0102_S01 Error:", error);
         throw error;
      }
   }
   

   //---------------------- div -----------------------------
   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="회사명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="메뉴" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="사용자" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );

   //---------------------- event -----------------------------

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef1.current) {
         const grid = gridRef1.current.getInstance();
         const gId = grid.getValue(rowKey, "gId");

         if (gId) {
            const gridDatas2 = await SOL_MM0102_S02(gId);
            const gridDatas3 = await SOL_MM0102_S03(gId);
            setGridDatas2(gridDatas2);
            setGridDatas3(gridDatas3);
         }
      }
   };

   //grid 추가버튼
   const addGridRow1 = () => {
      let grid = gridRef1.current.getInstance();

      grid.appendRow({ sysGrp: "999", coCd: "999", useYn: "Y" }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow1 = () => {
      let grid = gridRef1.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };
   //grid 추가버튼
   const addGridRow2 = () => {
      let grid = gridRef2.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      let coCd = gridRef1.current.getInstance().getValue(rowKey, 'coCd');
		let gId =  gridRef1.current.getInstance().getValue(rowKey, 'gId');

      grid.appendRow({coCd: coCd, gId: gId, useYn : 'Y'}, {focus:true});
   };

   //grid 삭제버튼
   const delGridRow2 = () => {
      let grid = gridRef2.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };
   //grid 추가버튼
   const addGridRow3 = () => {
      let grid = gridRef3.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      let coCd = gridRef1.current.getInstance().getValue(rowKey, 'coCd');
		let gId =  gridRef1.current.getInstance().getValue(rowKey, 'gId');

      grid.appendRow({coCd: coCd, gId: gId, useYn : 'Y'}, {focus:true});
   };

   //grid 삭제버튼
   const delGridRow3 = () => {
      let grid = gridRef3.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   const handleTabIndex = async (index: number) => {
      await setTabIndex(index);
      await refreshGrid(gridRef2);
      await refreshGrid(gridRef3);
   };

   //---------------------- grid -----------------------------

   const columns1 = [
      { header: "시스템그룹", name: "sysGrp", align: "center", hidden: "false" },
      { header: "회사명", name: "coCd", align: "center", formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: [] } } },
      { header: "그룹ID", name: "gId", align: "center", hidden: "false" },
      { header: "그룹명", name: "gName", align: "center", editor: "text" },
      {
         header: "사용여부",
         name: "useYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type:'select',
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
   ];

   const grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 정보</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow1} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow1} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef1} columns={columns1} handleFocusChange={handleFocusChange} />
      </div>
   );

   const columns2 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "false" },
      { header: "그룹ID", name: "gId", align: "center", hidden: "false" },
      { header: "메뉴ID", name: "menuId", align: "center", formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: [] } } },
      {
         header: "권한",
         name: "auth",
         formatter: "listItemText",
         editor: {
            type: "checkbox",
            options: {
               listItems: [
                  { text: "신규", value: "1000" },
                  { text: "조회", value: "100" },
                  { text: "저장", value: "10" },
                  { text: "삭제", value: "1" },
               ],
            },
         },
      },
      {
         header: "사용여부",
         name: "useYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type: "select",
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
      { name: "menuIdOrigin", align: "center", hidden: true },
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 정보</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow2} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow2} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} height={window.innerHeight-500} />
      </div>
   );

   const columns3 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "false" },
      { header: "그룹ID", name: "gId", align: "center", hidden: "false" },
      { header: "사용자ID", name: "usrId", align: "center", formatter: "listItemText", editor: { type: "select", options: { listItems: [] } } },
      {
         header: "사용여부",
         name: "useYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type: "select",
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
      { name: "usrIdOrigin", align: "center", hidden: true },
   ];

   const grid3 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 정보</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow3} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow3} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef3} columns={columns3} height={window.innerHeight-500}  />
      </div>
   );
   return (
      <div className={`space-y-5 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {/* {buttonDiv()} */}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-1/2" ref={gridContainerRef1}>{grid1()}</div>
            <div className="w-1/2">
               <div className="flex ">
                  <div
                     className={`p-1 w-[60px] text-center rounded-t-lg cursor-pointer
                                 ${tabIndex === 0 ? "text-blue-500 border border-b-0 " : "text-gray-500"}
                  `}
                     onClick={() => {
                        handleTabIndex(0);
                     }}
                  >
                     메뉴
                  </div>
                  <div
                     className={` p-1 w-[70px] text-center rounded-t-lg cursor-pointer
                                ${tabIndex === 1 ? "text-blue-500 border border-b-0" : "text-gray-500"}
                  `}
                     onClick={() => {
                        handleTabIndex(1);
                     }}
                  >
                     사용자
                  </div>
               </div>
               <div className={` ${tabIndex === 0 ? " " : "hidden"}`} ref={gridContainerRef2}>{grid2()}</div>
               <div className={` ${tabIndex === 1 ? " " : "hidden"}`} ref={gridContainerRef3}>{grid3()}</div>
            </div>
            {/* <div className="w-2/3 ">{inputDiv()} </div>  */}
         </div>
      </div>
   );
};

export default Mm0102;
