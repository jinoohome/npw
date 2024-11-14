import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ReactSelectEditor";
const breadcrumbItem = [{ name: "관리자" }, { name: "메뉴" }, { name: "메뉴권한관리" }];
interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const Zz0202 = ({ item, activeComp, userInfo }: Props) => {
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
         await ZZ_B_BIZ();
         await ZZ_MENU_LIST();
         await ZZ_USER_LIST();
   
         let gridDatas1 = await ZZ0202_S01();
   
         if (gridDatas1.length > 0) {
            let gId = gridDatas1[0].gId;
            if (gId) {
               let gridDatas2 = await ZZ0202_S02(gId);
               let gridDatas3 = await ZZ0202_S03(gId);
               setGridDatas1(gridDatas1);
               setGridDatas2(gridDatas2);
               setGridDatas3(gridDatas3);
            }
         } else {
            // gridDatas1에 값이 없으면 gridDatas2와 gridDatas3을 빈 배열로 설정
            setGridDatas1([]);
            setGridDatas2([]);
            setGridDatas3([]);
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
   const ZZ0202_S01 = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            gName: searchRef1.current?.value || "999",
            menuId: searchRef2.current?.value || "999",
            usrId: searchRef3.current?.value || "999",
            bpNm: "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ0202_S01`, { data });
         setGridDatas1(result);
         return result;
      } catch (error) {
         console.error("ZZ0202_S01 Error:", error);
         throw error;
      }
   };
   const ZZ0202_S02 = async (gId: string) => {
      try {
         const param = {
            gId: gId,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ0202_S02`, { data });
         setGridDatas2(result);
         return result;
      } catch (error) {
         console.error("ZZ0202_S02 Error:", error);
         throw error;
      }
   };
   const ZZ0202_S03 = async (gId: string) => {
      try {
         const param = {
            gId: gId,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ0202_S03`, { data });
         setGridDatas3(result);
         return result;
      } catch (error) {
         console.error("ZZ0202_S01 Error:", error);
         throw error;
      }
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
         seChoice1(formattedResult);
         return result;
      } catch (error) {
         console.error("ZZ_B_BIZ Error:", error);
         throw error;
      }
   }

   var ZZ_MENU_LIST = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
         };

         const result = await fetchPost(`ZZ_MENU_LIST`, param );

         let formattedResult = Array.isArray(result)
         ? result.map(({ menuId, menuName, ...rest }) => ({
              value: menuId,
              text: menuName,
              label: menuName,
              ...rest,
           }))
         : [];
console.log(formattedResult);
         // 0번째 행에 전체 값을 추가
         // formattedResult.unshift({ value: '999', label: '전체' });

         seChoice2(formattedResult);
         return result;
      } catch (error) {
         console.error("ZZ_MENU_LIST Error:", error);
         throw error;
      }
   }

   var ZZ_USER_LIST = async () => {
      try {
         const param = {
            coCd : userInfo.coCd,
            usrId : '999',
            usrDiv : '999',
            useYn : '999',
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_USER_LIST`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ usrId, usrNm, ...rest }) => ({
              value: usrId,
              text: usrNm,
              label: usrNm,
              ...rest,
           }))
         : [];

         // 0번째 행에 전체 값을 추가
         // formattedResult.unshift({ value: '999', label: '전체' });

         seChoice3(formattedResult);
         return result;
      } catch (error) {
         console.error("ZZ_USER_LIST Error:", error);
         throw error;
      }
   }
   
   const ZZ0202_U04 = async () => {
      try {
         const data = await getGridValues();
         const result = await fetchPost(`ZZ0202_U04`, data);
         return result as any;
      } catch (error) {
         console.error("ZZ0202_U04 Error:", error);
         throw error;
      }
   };

   //---------------------- div -----------------------------
   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="그룹명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="메뉴" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="사용자" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );

   //---------------------- event -----------------------------
   const search = () => {
      setGridData();
   };

   const save = async () => {
      const data = await getGridValues();
   
      if (data) {
         let result = await ZZ0202_U04();
         if (result) {
            await returnResult(result);
         }
      }
   };

   const returnResult = (result : any) => {
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let auth = await getGridDatas(gridRef1);
      let menu = await getGridDatas(gridRef2);
      let user = await getGridDatas(gridRef3);

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         auth: JSON.stringify(auth),
         menu: JSON.stringify(menu),
         user: JSON.stringify(user),
      };

      return data;
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef1.current) {
         const grid = gridRef1.current.getInstance();
         const gId = grid.getValue(rowKey, "gId");

         if (gId) {
            const gridDatas2 = await ZZ0202_S02(gId);
            const gridDatas3 = await ZZ0202_S03(gId);
            setGridDatas2(gridDatas2);
            setGridDatas3(gridDatas3);
         } else {
            setGridDatas2([]);
            setGridDatas3([]);
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

   //grid 추가버튼
   const addGridRow1 = () => {
      let grid = gridRef1.current.getInstance();

      grid.appendRow({ sysGrp: "999", coCd: userInfo.coCd, useYn: "Y" }, { focus: true, at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow1 = () => {
      let grid = gridRef1.current.getInstance();      

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
   const addGridRow2 = () => {
      let grid = gridRef1.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      let coCd = gridRef1.current.getInstance().getValue(rowKey, 'coCd');
		let gId =  gridRef1.current.getInstance().getValue(rowKey, 'gId');

      gridRef2.current.getInstance().appendRow({coCd: coCd, gId: gId, useYn : 'Y'}, {focus:true});

      if (!gId) {
         gridRef2.current.getInstance().removeRow(gridRef2.current.getInstance().getFocusedCell().rowKey);
         let title = "그룹ID 미등록";
         let msg = "그룹ID 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
      }
   };

   //grid 삭제버튼
   const delGridRow2 = () => {
      let grid = gridRef2.current.getInstance();      

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
   const addGridRow3 = () => {
      let grid = gridRef1.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      let coCd = gridRef1.current.getInstance().getValue(rowKey, 'coCd');
		let gId =  gridRef1.current.getInstance().getValue(rowKey, 'gId');

      gridRef3.current.getInstance().appendRow({coCd: coCd, gId: gId, useYn : 'Y'}, {focus:true});
   };

   //grid 삭제버튼
   const delGridRow3 = () => {
      let grid = gridRef3.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };

   const handleTabIndex = async (index: number) => {
      await setTabIndex(index);
      await refreshGrid(gridRef2);
      await refreshGrid(gridRef3);
   };

   //---------------------- grid -----------------------------

   const columns1 = [
      { header: "그룹ID", name: "gId", align: "center", width: 100 },
      { header: "시스템그룹", name: "sysGrp", align: "center", hidden: "false" },
      { header: "사용처", name: "coCd", align: "center", width: 150, formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: [] } } },
      { header: "그룹명", name: "gName", width: 400, editor: "text" },
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
               <div className="">권한그룹 정보</div>
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

         <TuiGrid01 gridRef={gridRef1} columns={columns1} handleFocusChange={handleFocusChange} height={window.innerHeight - 520}/>
      </div>
   );

   const columns2 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "false" },
      { header: "그룹ID", name: "gId", align: "center", hidden: "false" },
      { header: "메뉴ID", name: "menuId", width : 600, formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: [] } } },
      {
         header: "권한",
         name: "auth",
         formatter: "listItemText",
         hidden: "false",
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
               <div className="">메뉴 정보</div>
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

         <TuiGrid01 gridRef={gridRef2} columns={columns2} height={window.innerHeight-550} />
      </div>
   );

   const columns3 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "false" },
      { header: "그룹ID", name: "gId", align: "center", hidden: "false" },
      { header: "사용자ID", name: "usrId", formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: [] } } },
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
               <div className="">권한그룹 정보</div>
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
               {buttonDiv()} 
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
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

export default Zz0202;
