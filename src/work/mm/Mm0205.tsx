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

const Mm0205 = ({ item, activeComp, leftMode, userInfo }: Props) => {

   const GridRef1 = useRef<any>(null);
   const GridRef2 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);
   const grid2GridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();

   const [focusRow, setFocusRow] = useState<any>(0);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();

   const breadcrumbItem = [{ name: "기준정보" }, { name: "품목" }, { name: "패키지 품목 등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef2, containerRef: grid2GridContainerRef, sec: 200 });
   }, []);

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      try {
         const grid1Result = await MM0205_S01();
         if (grid1Result?.length) {
            await MM0205_S02({ pkgItemCd: grid1Result[0].pkgItemCd });
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

   const MM0205_S01 = async () => {
      const param = {
         coCd: userInfo.coCd,
         pkgName: searchRef1.current?.value || '999',
         useYn: searchRef2.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`MM0205_S01`, { data });
      setGridDatas(result);
      return result;
   };

   const MM0205_S02 = async (param: { pkgItemCd: string }) => {
      const result2 = await fetchPost(`MM0205_S02`, param);
      setGridDatas2(result2);
   };

   const MM0205_U03 = async () => {
      try {
         const data = await getGridValues();
         console.log(data);
         const result = await fetchPost(`MM0205_U03`, data);
         return result as any;
      } catch (error) {
         console.error("MM0205_U03 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const save = async () => {
      let result = await MM0205_U03();
      if (result) {
         returnResult();
      }
   };
   const returnResult = () => {
      alertSwal("저장완료", "저장이 완료되었습니다.", "success");
      setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let grid1Data = await getGridDatas(GridRef1);
      let grid2Data = await getGridDatas(GridRef2);

      let data = {
         pkgHdr: JSON.stringify(grid1Data),
         pkgDtl: JSON.stringify(grid2Data),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
      };

      return data;
   };

   //grid 추가버튼
   const addMajorGridRow = () => {
      let grid1 = GridRef1.current.getInstance();
      let grid2 = GridRef2.current.getInstance();

      grid1.appendRow({}, { focus: true });
      let { rowKey } = GridRef1.current.getInstance().getFocusedCell();
      grid1.setValue(rowKey, "coCd", userInfo.coCd, false);
      grid1.setValue(rowKey, "useYn", "Y", false);
      grid1.setValue(rowKey, "status", "I", false);

      grid2.clear();
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid1 = GridRef1.current.getInstance();     
      let { rowKey } = grid1.getFocusedCell();
      grid1.removeRow(rowKey, {});
   };

   //grid 추가버튼
   const addMinorGridRow = () => {
      let grid1 = GridRef1.current.getInstance();
      let grid2 = GridRef2.current.getInstance();
      let flag = true;
      grid2.appendRow({}, { focus: true });

      let inPkgItemCd = grid1.getValue(grid1.getFocusedCell().rowKey, "pkgItemCd");

      if (!inPkgItemCd) {
         grid2.removeRow(grid2.getFocusedCell().rowKey);
         flag = false;
         let title = "패키지코드 미등록";
         let msg = "패키지코드 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
      }

      grid2.setValue(grid2.getFocusedCell().rowKey, "coCd", userInfo.coCd, false);
      grid2.setValue(grid2.getFocusedCell().rowKey, "pkgItemCd", inPkgItemCd, false);
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
      let pkgItemCd = grid1Row.pkgItemCd;
      if (pkgItemCd) {
         await MM0205_S02({ pkgItemCd: pkgItemCd });
      }
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      const grid1Result = await MM0205_S01();
      if (grid1Result?.length) {
         await MM0205_S02({ pkgItemCd: grid1Result[0].pkgItemCd });
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
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="패키지명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "패키지 코드", name: "pkgItemCd", align: "center", width: 100 },
      { header: "패키지명", name: "pkgName", align: "left", editor: "text", width: 330 },
      { header: "금액", name: "pkgAmt", align: "right", editor: "text", width: 100 },
      {
         header: "필수체크",
         name: "mandatoryYn",
         align: "center",
         formatter: "listItemText", 
         width: 100,         
         editor: {
            type: ChoicesEditor,
            options: {
               listItems: [
                  { text: "Y", value: "Y" },
                  { text: "N", value: "N" },
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
            type: ChoicesEditor,
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
      { header: "상태", name: "status", hidden: true },
      { header: "", name: "updtDt", hidden: true },
   ];

   const grid2Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "패키지 코드", name: "pkgItemCd", align: "center" , hidden: true },
      { header: "품목코드", name: "itemCd", align: "center", editor: "text", width: 100 },
      { header: "품목명", name: "itemNm", width: 400},
      { header: "정렬순서", name: "sort", align: "center", editor: "text", width: 100 },
      {
         header: "사용여부",
         name: "useYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type: ChoicesEditor,
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
      { header: "상태", name: "status", hidden: true },
   ];

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">패키지 리스트</div>
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
               <div className="">패키지 정보</div>
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

         <TuiGrid01 columns={grid2Columns} gridRef={GridRef2} />
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

export default Mm0205;
