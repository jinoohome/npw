import React, { useEffect, useState, useRef, useCallback } from "react";
import { SOL_MM0401_S01_RES, SOL_MM0401_S01_API } from "../ts/SOL_MM0401_S01";
import { SOL_MM0401_S02_REQ, SOL_MM0401_S02_RES, SOL_MM0401_S02_API } from "../ts/SOL_MM0401_S02";
import { SOL_ZZ_CODE_REQ, SOL_ZZ_CODE_RES, SOL_ZZ_CODE_API } from "../ts/SOL_ZZ_CODE";
import "tui-grid/dist/tui-grid.css";
import "tui-pagination/dist/tui-pagination.css";
import Grid from "@toast-ui/react-grid";
import ChoicesEditor from "../util/ChoicesEditor";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import { fetchPost } from "../util/fetch";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import "../css/inputChoicejs.css";

interface Props {
   item: any;
   activeComp: any;
}

const Mm0401 = ({ item, activeComp }: Props) => {
   const codeNameRef = useRef<any>(null);
   const codeDivRef = useRef<any>(null);
   const confirmYnRef = useRef<any>(null);
   const minorCodeNameRef = useRef<any>(null);
   const majorGridRef = useRef<any>(null);
   const minorGridRef = useRef<any>(null);

   const [majors, setMajors] = useState<SOL_MM0401_S01_RES[]>();
   const [minors, setMinors] = useState<SOL_MM0401_S02_RES[]>();
   const [zz0001, setZz0001] = useState<SOL_ZZ_CODE_RES[]>([]);

   useEffect(() => {
      let selectElement = confirmYnRef.current;
      if (selectElement) {
         let newChoices2 = new Choices(selectElement, {
            removeItemButton: false,
            shouldSort: false,
            itemSelectText: "",
         });

         newChoices2.setChoices([
            { value: "999", label: "전체" },
            { value: "Y", label: "사용" },
            { value: "N", label: "미사용" },
         ]);

         newChoices2.setChoiceByValue("999");
      }
      init();



   }, []);

   useEffect(() => {
      if (majorGridRef.current) {
         const gridInstance = majorGridRef.current.getInstance();
         gridInstance.refreshLayout();
      }
      if (minorGridRef.current) {
         const gridInstance = minorGridRef.current.getInstance();
         gridInstance.refreshLayout();
      }
   }, [activeComp]);

   useEffect(() => {
      if (minorGridRef.current && minors) {
         minorGridRef.current.getInstance().resetData(minors);
      }
   }, [minors]);

   useEffect(() => {
      if (majorGridRef.current && majors) {
         majorGridRef.current.getInstance().resetData(majors);
      }
   }, [majors]);

   useEffect(() => {
      if (zz0001) {
         const gridInstance = majorGridRef.current.getInstance();
         const column = gridInstance.getColumn("codeDiv");
         column.editor.options.listItems = zz0001;
         gridInstance.refreshLayout();
      }
   }, [zz0001]);

   useEffect(() => {
      let selectElement = codeDivRef.current;

      if (selectElement && zz0001.length > 0) {
         let newChoices = new Choices(selectElement, {
            removeItemButton: false,
            shouldSort: false,
            itemSelectText: "",
         });

         newChoices.setChoices([
            { value: "999", label: "전체" },
            ...zz0001.map((item) => ({
               value: item.value,
               label: item.text,
            })),
         ]);

         newChoices.setChoiceByValue("999");

         return () => newChoices.destroy();
      }
   }, [zz0001]);



   //--------------------init---------------------------

   const init = async () => {
      await SOL_ZZ_CODE();
      const majorResult = await SOL_MM0401_S01();
      if (majorResult?.length > 0) {
         const param = { majorCode: majorResult[0].majorCode };
         await SOL_MM0401_S02(param);
      }
   };

   //---------------------- api -----------------------------

   const SOL_MM0401_S01 = async () => {
      const param = {
         codeName: codeNameRef.current.value,
         minorCodeName: minorCodeNameRef.current.value,
         codeDiv: codeDivRef.current.value ? codeDivRef.current.value : "999",
         confirmYn: confirmYnRef.current.value ? confirmYnRef.current.value : "999",
      };

      const result = await SOL_MM0401_S01_API(param);
      setMajors(result);
      return result;
   };

   const SOL_MM0401_S02 = async (param: SOL_MM0401_S02_REQ) => {
      const result2 = await SOL_MM0401_S02_API(param);
      setMinors(result2);
   };

   const SOL_ZZ_CODE = async () => {
      const param3 = {
         coCd: "999",
         majorCode: "zz0001",
         div: "-999",
      };
      const result3 = await SOL_ZZ_CODE_API(param3);
      let formattedResult = Array.isArray(result3)
         ? result3.map(({ code, codeName, ...rest }) => ({
              value: code,
              text: codeName,
              ...rest,
           }))
         : [];
      setZz0001(formattedResult);
   };

   //-------------------breadcrumb----------------------
   const breadcrumb = () => (
      <div className="flex gap-2 text-sm items-end">
         <div className="flex items-center space-x-2">
            <div>관리자</div>
            <ChevronRightIcon className="w-3 h-3"></ChevronRightIcon>
         </div>
         <div className="flex items-center space-x-2">
            <div>공통</div>
            <ChevronRightIcon className="w-3 h-3"></ChevronRightIcon>
         </div>
         <div className="flex items-center">
            <div className="text-rose-500">기준정보등록</div>
         </div>
      </div>
   );
   //-------------------button--------------------------
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

   const search = () => {
      init();
   };

   const save = async () => {
      const data = getGridValues();
      try {
         const baseURL = process.env.REACT_APP_API_URL;
         const result = await fetchPost(`${baseURL}/SOL_MM0401_U03`, data);
         return result as any;
      } catch (error) {
         console.error("SOL_MM0401_U03 Error:", error);
         throw error;
      }
   };

   const getGridValues = () => {
      let majorRows = majorGridRef.current.getInstance().getModifiedRows();
      let minorRows = minorGridRef.current.getInstance().getModifiedRows();

      let majorData = majorRows.createdRows
         .map((e: any) => ({ ...e, status: "I" }))
         .concat(majorRows.deletedRows.map((e: any) => ({ ...e, status: "D" })))
         .concat(majorRows.updatedRows.map((e: any) => ({ ...e, status: "U" })));

      let minorData = minorRows.createdRows
         .map((e: any) => ({ ...e, status: "I" }))
         .concat(minorRows.deletedRows.map((e: any) => ({ ...e, status: "D" })))
         .concat(minorRows.updatedRows.map((e: any) => ({ ...e, status: "U" })));

      let data = {
         major: JSON.stringify(majorData),
         minor: JSON.stringify(minorData),
         menuId: "",
         insrtUserId: "jay8707",
      };

      return data;
   };

   const addMajorGridRow = () => {
      let majorGrid = majorGridRef.current.getInstance();
      let minorGrid = minorGridRef.current.getInstance();

      majorGrid.appendRow({}, { focus: true });
      let { rowKey } = majorGridRef.current.getInstance().getFocusedCell();
      majorGrid.setValue(rowKey, "useYn", "Y", false);
      majorGrid.setValue(rowKey, "status", "I", false);

      //minor코드 초기화
      minorGrid.clear();
   };
   const delMajorGridRow = () => {
      let majorGrid = majorGridRef.current.getInstance();
      let minorGrid = minorGridRef.current.getInstance();
      let minorCnt = minorGrid.getRowCount();

      let flag = true;
      if (minorCnt > 0) {
         flag = false;
         let msg = "minor코드 삭제 후 major코드 삭제해 주세요";
      } else {
         let { rowKey } = majorGrid.getFocusedCell();
         majorGrid.removeRow(rowKey, {});
      }
   };


  
   //-------------------search--------------------------
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <div className="grid  grid-cols-3 gap-3 items-center">
               <label className="col-span-1 text-right text-sm">그룹코드명</label>
               <div className="col-span-2">
                  <input
                     ref={codeNameRef}
                     type="text"
                     className=" border rounded-md h-8 p-2
                           focus:outline-orange-300"
                  ></input>
               </div>
            </div>
            <div className="grid  grid-cols-3 gap-3 items-center">
               <label className="col-span-1 text-right text-sm">코드구분</label>
               <div className="col-span-2">
                  <select
                     ref={codeDivRef}
                     className="border rounded-md h-8 p-2
                           focus:outline-orange-300"
                  ></select>
               </div>
            </div>
            <div className="grid  grid-cols-3 gap-3 items-center">
               <label className="col-span-1 text-right text-sm">사용유무</label>
               <div className="col-span-2">
                  <select
                     ref={confirmYnRef}
                     className="border rounded-md h-8 p-2
                           focus:outline-orange-300"
                  ></select>
               </div>
            </div>
            <div className="grid  grid-cols-3 gap-3 items-center">
               <label className="col-span-1 text-right text-sm">코드명</label>
               <div className="col-span-2">
                  <input
                     ref={minorCodeNameRef}
                     type="text"
                     className="border rounded-md h-8 p-2
                              focus:outline-orange-300"
                  ></input>
               </div>
            </div>
         </div>
      </div>
   );
   //-------------------grid----------------------------

   const majorColumns = [
      {
         header: "major 코드",
         name: "majorCode",
         align: "center",
         width: 100,
      },
      {
         header: "그룹코드명",
         name: "codeName",
         align: "left",
         editor: "text",
      },
      {
         header: "코드 구분",
         name: "codeDiv",
         align: "center",
         formatter: "listItemText",
         editor: {
            type: ChoicesEditor,
            options: {
               listItems: zz0001,
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
      {
         header: "상태",
         name: "status",
         hidden: true,
      },
      {
         header: "",
         name: "updtDt",
         hidden: true,
      },
   ];

   const minorColumns = [
      {
         header: "minor코드",
         name: "code",
         align: "center",
      },
      {
         header: "코드명",
         name: "codeName",
         editor: "text",
      },
      {
         header: "상위 코드",
         name: "paCode",
         editor: "text",
      },
      {
         header: "Lev",
         name: "lev",
         align: "center",
         editor: "text",
      },
      {
         header: "비고1",
         name: "remark1",
         editor: "text",
      },
      {
         header: "비고2",
         name: "remark2",
         editor: "text",
      },
      {
         header: "비고3",
         name: "remark3",
         editor: "text",
      },
      {
         header: "정렬",
         name: "sort",
         align: "center",
         editor: "text",
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
      {
         header: "major코드",
         name: "majorCode",
         hidden: true,
      },
      {
         header: "상태",
         name: "status",
         hidden: true,
      },
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

         <Grid
            key={item.id}
            ref={majorGridRef}
            data={majors?.map((major) => ({
               ...major,
            }))}
            columns={majorColumns as OptColumn[]}
            bodyHeight={window.innerHeight - 450}
            columnOptions={{ resizable: true }}
            editingEvent={"click"}
            heightResizable={true}
            rowHeaders={["rowNum"]}
            oneTimeBindingProps={["data", "columns"]}
         ></Grid>
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
               <button type="button" className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>
         <Grid
            key={item.id}
            ref={minorGridRef}
            data={minors?.map((minor) => ({
               ...minor,
            }))}
            columns={minorColumns as OptColumn[]}
            bodyHeight={window.innerHeight - 450}
            columnOptions={{ resizable: true }}
            editingEvent={"click"}
            heightResizable={true}
            rowHeaders={["rowNum"]}
            oneTimeBindingProps={["data", "columns"]}
         ></Grid>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto ${activeComp.id}`}>
         <div className="space-y-2">
            <div className="flex justify-between">
               {breadcrumb()}
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full flex space-x-5">
            <div className="w-1/2 ">{majorGrid()} </div>
            <div className="w-1/2 ">{minorGrid()} </div>
         </div>
      </div>
   );
};

export default Mm0401;
