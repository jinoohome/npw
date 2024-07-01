import { refresh } from "aos";
import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid,  InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import ChoicesEditor from "../../util/ChoicesEditor";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
}

const Mm0101 = ({ item, activeComp }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null); 

   const [gridDatas, setGridDatas] = useState<any[]>();

   const breadcrumbItem = [{ name: "관리자" }, { name: "공통" }, { name: "메뉴등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);



   const setGridData = async () => {
      try {
         await ZZ_MENU();
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
         grid.resetData(getTreeData(gridDatas));
         if (gridDatas.length > 0) {
            // grid.focusAt(focusRow, 0, true);
         }
      }
   }, [gridDatas]);

   //---------------------- api -----------------------------

   const ZZ_MENU = async () => {
      try {
         const param = {
            usrId: "jay8707",
         };

         const result = await fetchPost(`ZZ_MENU`, param);
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("SOL_MM0301_S01 Error:", error);
         throw error;
      }
   };
   const SOL_MM0101_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SOL_MM0101_U01`, data);
         return result as any;
      } catch (error) {
         console.error("SOL_MM0101_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------
   const search = () => {
      setGridData();
   };

   const validateData = (action: string, dataString: any) => {
      // dataString이 문자열이면 JSON.parse()를 사용, 그렇지 않으면 직접 사용
      const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;

      if (action === "save") {
         if (data.length < 1) return false;

         for (const item of data) {
            if (["U", "I"].includes(item.status)) {
               if (!item.menuName) {
                  alertSwal("입력확인", "메뉴명을 입력해주세요.", "warning"); // 사용자에게 알림
                  return false;
               }
               if (!item.menuId) {
                  alertSwal("입력확인", "메뉴ID를 입력해주세요.", "warning"); // 사용자에게 알림
                  return false;
               }
            }
         }
      }

      return true;
   };

   const save = async () => {
      const data = await getGridValues();
      if (data) {
         let result = await SOL_MM0101_U01(data);
         if (result) {
            returnResult();
         }
      }
   };

   const returnResult = () => {
      alertSwal("저장완료", "저장이 완료되었습니다.", "success");
      setGridData();
   };

   const getGridValues = async () => {
      let gridDatas = await getGridDatas(gridRef);
      if (!validateData("save", gridDatas)) return false;

      let data = {
         data: JSON.stringify(gridDatas),
         menuId: "",
         insrtUserId: "jay8707",
      };

      return data;
   };

   var getTreeData = (data: any, parentId = null) => {
      return data
         .filter((item: any) => item.paMenuId === parentId)
         .map((item: any) => {
            const children = getTreeData(data, item.menuId);
            return {
               ...item, // 모든 필드를 그대로 가져옴
               ...(children.length > 0
                  ? {
                       _attributes: {
                          expanded: true,
                       },
                       _children: children,
                    }
                  : {}),
            };
         });
   };

   //grid 추가버튼
   const addGridRow = () => {
      let grid = gridRef.current.getInstance();
      grid.appendRow({}, { focus: true });
   };
   //grid 삭제버튼
   const delGridRow = () => {
      if (gridRef.current) {
         let grid = gridRef.current.getInstance();
         let focusedCell = grid.getFocusedCell();

         if (focusedCell && focusedCell.rowKey !== null) {
            grid.removeRow(focusedCell.rowKey);
         }
      }
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {});
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

   //-------------------grid----------------------------
   const columns = [
      { header: "메뉴명", name: "menuName", editor: "text", filter: { type: "select", showApplyBtn: true, showClearBtn: true } },
      { header: "메뉴ID", name: "menuId", align: "center", editor: "text" },
      { header: "메뉴구분", name: "menuDiv", align: "center", editor: "text" },
      { header: "부모ID", name: "paMenuId", align: "center", editor: "text" },
      { header: "파일명", name: "prgmId", align: "center", editor: "text" },
      { header: "파일경로", name: "prgmFullPath", align: "center", editor: "text" },
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
         filter: { type: "select", showApplyBtn: true, showClearBtn: true },
      },
      { header: "정렬순서", name: "zMenuOrdr", align: "center", editor: "text" },
      { name: "status", hidden: true },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">메뉴등록</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} treeColumnName="menuName" perPageYn={false} height={window.innerHeight - 350} />
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-full" ref={gridContainerRef}>{grid()}</div>
         </div>
      </div>
   );
};

export default Mm0101;
