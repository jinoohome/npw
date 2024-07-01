import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ0101_S01_RES, ZZ0101_S01_API } from "../../ts/ZZ0101_S01";
import { ZZ0101_S02_REQ, ZZ0101_S02_RES, ZZ0101_S02_API } from "../../ts/ZZ0101_S02";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
}

const Mm0401 = ({ item, activeComp, leftMode }: Props) => {
   const codeNameRef = useRef<any>(null);
   const codeDivRef = useRef<any>(null);
   const confirmYnRef = useRef<any>(null);
   const minorCodeNameRef = useRef<any>(null);
   const majorGridRef = useRef<any>(null);
   const minorGridRef = useRef<any>(null);

   const majorGridContainerRef = useRef(null);
   const minorGridContainerRef = useRef(null);

   const [majors, setMajors] = useState<ZZ0101_S01_RES[]>();
   const [minors, setMinors] = useState<ZZ0101_S02_RES[]>();
   const [zz0001, setZz0001] = useState<ZZ_CODE_RES[]>([]);

   const [codeDivChoice, setCodeDivChoice] = useState<any>();
   const [confirmYnChoice, setConfirmYnChoice] = useState<any>();

   const breadcrumbItem = [{ name: "관리자" }, { name: "공통" }, { name: "기준정보등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: majorGridRef, containerRef: majorGridContainerRef, sec: 200 });
      reSizeGrid({ ref: minorGridRef, containerRef: minorGridContainerRef, sec: 200 });
   }, []);

   const setChoiceUI = () => {
      initChoice(codeDivRef, setCodeDivChoice);
      initChoice(confirmYnRef, setConfirmYnChoice, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      try {
         let zz0001Data = await ZZ_CODE({ coCd: "999", majorCode: "zz0001", div: "999" });
         if (zz0001Data != null) {
            setZz0001(zz0001Data);
         }
         const majorResult = await ZZ0101_S01();
         if (majorResult?.length) {
            await ZZ0101_S02({ majorCode: majorResult[0].majorCode });
         }
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(majorGridRef);
      refreshGrid(minorGridRef);
   
   }, [activeComp, leftMode]);

   // Grid 데이터 설정
   useEffect(() => {
      if (majorGridRef.current && majors) {
         let majorGrid = majorGridRef.current.getInstance();
         majorGrid.resetData(majors);

         let focusRowKey = majorGrid.getFocusedCell()?.rowKey || 0;

         if (majors.length > 0) {
            majorGrid.focusAt(focusRowKey, 0, true);
         }
      } else if (minorGridRef.current) {
         minorGridRef.current.getInstance().clear();
      }
   }, [majors]);

   // Grid 데이터 설정
   useEffect(() => {
      if (minorGridRef.current && minors) {
         let minorGrid = minorGridRef.current.getInstance();
         minorGrid.resetData(minors);

         let focusRowKey = minorGrid.getFocusedCell().rowKey || 0;

         if (minors.length > 0) {
            minorGrid.focusAt(focusRowKey, 0, true);
         }
      }
   }, [minors]);

   // inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(codeDivChoice, zz0001, "value", "text");
   }, [zz0001]);

   // Grid 내부 Choicejs 데이터 설정
   useEffect(() => {
      if (zz0001) {
         let gridInstance = majorGridRef.current.getInstance();
         let column = gridInstance.getColumn("codeDiv");
         let zz0001Data = zz0001.filter((item) => item.value !== "999");
         column.editor.options.listItems = zz0001Data;
         gridInstance.refreshLayout();
      }
   }, [zz0001]);

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

   const ZZ0101_S01 = async () => {
      const param = {
         codeName: codeNameRef.current?.value,
         minorCodeName: minorCodeNameRef.current?.value,
         codeDiv: codeDivRef.current?.value || "999",
         confirmYn: confirmYnRef.current?.value || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`ZZ0101_S01`, { data });
      setMajors(result);
      return result;
   };

   const ZZ0101_S02 = async (param: { majorCode: string }) => {
      const result2 = await fetchPost(`ZZ0101_S02`, param);
      setMinors(result2);
   };

   const ZZ0101_U03 = async () => {
      try {
         const data = await getGridValues();
         const result = await fetchPost(`ZZ0101_U03`, data);
         return result as any;
      } catch (error) {
         console.error("ZZ0101_U03 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const save = async () => {
      let result = await ZZ0101_U03();
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
      let majorData = await getGridDatas(majorGridRef);
      let minorData = await getGridDatas(minorGridRef);

      let data = {
         major: JSON.stringify(majorData),
         minor: JSON.stringify(minorData),
         menuId: "",
         insrtUserId: "jay8707",
      };

      return data;
   };

   //grid 추가버튼
   const addMajorGridRow = () => {
      let majorGrid = majorGridRef.current.getInstance();
      let minorGrid = minorGridRef.current.getInstance();

      majorGrid.appendRow({}, { focus: true });
      let { rowKey } = majorGridRef.current.getInstance().getFocusedCell();
      majorGrid.setValue(rowKey, "useYn", "Y", false);
      majorGrid.setValue(rowKey, "status", "I", false);

      minorGrid.clear();
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let majorGrid = majorGridRef.current.getInstance();
      let minorGrid = minorGridRef.current.getInstance();
      let minorCnt = minorGrid.getRowCount();

      let flag = true;
      if (minorCnt > 0) {
         flag = false;
         let title = "minor코드 미삭제";
         let msg = "minor코드 삭제 후 major코드 삭제해 주세요";
         alertSwal(title, msg, "warning");
      } else {
         let { rowKey } = majorGrid.getFocusedCell();
         majorGrid.removeRow(rowKey, {});
      }
   };

   //grid 추가버튼
   const addMinorGridRow = () => {
      let majorGrid = majorGridRef.current.getInstance();
      let minorGrid = minorGridRef.current.getInstance();
      let flag = true;
      minorGrid.appendRow({}, { focus: true });

      let inMajorCode = majorGrid.getValue(majorGrid.getFocusedCell().rowKey, "majorCode");

      if (!inMajorCode) {
         minorGrid.removeRow(minorGrid.getFocusedCell().rowKey);
         flag = false;
         let title = "major코드 미등록";
         let msg = "major코드 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
      }

      minorGrid.setValue(minorGrid.getFocusedCell().rowKey, "majorCode", inMajorCode, false);
      minorGrid.setValue(minorGrid.getFocusedCell().rowKey, "status", "I", false);
      minorGrid.setValue(minorGrid.getFocusedCell().rowKey, "useYn", "Y", false);
      minorGrid.setValue(minorGrid.getFocusedCell().rowKey, "lev", "0", false);
   };

   //grid 삭제버튼
   const delMinorGridRow = () => {
      let minorGrid = minorGridRef.current.getInstance();
      let { rowKey } = minorGrid.getFocusedCell();
      minorGrid.removeRow(rowKey, {});
   };

   //grid 포커스변경시
   const handleMajorFocusChange = async ({ rowKey }: any) => {
      let majorGrid = majorGridRef.current.getInstance();
      let majorRow = majorGrid.getRow(rowKey);
      let majorCode = majorRow.majorCode;
      if (majorCode) {
         await ZZ0101_S02({ majorCode: majorCode });
      }
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
      <div className="bg-gray-100 rounded-lg p-5 search text-sm">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={codeNameRef} handleCallSearch={handleCallSearch} title="그룹코드명"></InputComp1>
            <SelectComp1 ref={codeDivRef} title="코드구분" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={confirmYnRef} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
            <InputComp1 ref={minorCodeNameRef} handleCallSearch={handleCallSearch} title="코드명"></InputComp1>
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const majorColumns = [
      { header: "major 코드", name: "majorCode", align: "center", width: 100 },
      { header: "그룹코드명", name: "codeName", align: "left", editor: "text" },
      { header: "코드 구분", name: "codeDiv", align: "center", formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: zz0001 } } },
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

   const minorColumns = [
      { header: "minor코드", name: "code", align: "center" },
      { header: "코드명", name: "codeName", editor: "text" },
      { header: "상위 코드", name: "paCode", editor: "text" },
      { header: "Lev", name: "lev", align: "center", editor: "text" },
      { header: "비고1", name: "remark1", editor: "text" },
      { header: "비고2", name: "remark2", editor: "text" },
      { header: "비고3", name: "remark3", editor: "text" },
      { header: "정렬", name: "sort", align: "center", editor: "text" },
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
      { header: "major코드", name: "majorCode", hidden: true },
      { header: "상태", name: "status", hidden: true },
   ];

   const majorGrid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">MAJOR 코드</div>
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

         <TuiGrid01 columns={majorColumns} handleFocusChange={handleMajorFocusChange} gridRef={majorGridRef} />
      </div>
   );

   const minorGrid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">MINOR 코드</div>
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

         <TuiGrid01 columns={minorColumns} gridRef={minorGridRef} />
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
         <div className="w-full h-full flex p-2 space-x-2">
            <div className="w-1/2" ref={majorGridContainerRef}>{majorGrid()}</div>
            <div className="w-1/2" ref={minorGridContainerRef}>{minorGrid()} </div>
         </div>
      </div>
   );
};

export default Mm0401;
