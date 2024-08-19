import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
const breadcrumbItem = [{ name: "관리자" }, { name: "메뉴" }, { name: "고객사별 기준정보 등록" }];
interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const Mm0601 = ({ item, activeComp, userInfo }: Props) => {
   const searchRef1 = useRef<any>(null);

   const refs = {
      prsnCd: useRef<any>(null),
      prsnNm: useRef<any>(null),
      prsnType: useRef<any>(null),
      hp: useRef<any>(null),
      subCode: useRef<any>(null),
      alarmYn: useRef<any>(null),
      useYn: useRef<any>(null),
      coCd: useRef<any>(null),
    
   };

   const gridRef1 = useRef<any>(null);
   const gridRef2 = useRef<any>(null);
   const gridRef3 = useRef<any>(null);
   const gridRef4 = useRef<any>(null);
   const gridRef5 = useRef<any>(null);
   const gridRef6 = useRef<any>(null);

   const gridContainerRef1 = useRef(null); 
   const gridContainerRef2 = useRef(null); 
   const gridContainerRef3 = useRef(null); 
   const gridContainerRef4 = useRef(null); 
   const gridContainerRef5 = useRef(null); 
   const gridContainerRef6 = useRef(null); 

   const [gridDatas1, setGridDatas1] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();
   const [gridDatas4, setGridDatas4] = useState<any[]>();
   const [gridDatas5, setGridDatas5] = useState<any[]>();
   const [gridDatas6, setGridDatas6] = useState<any[]>();

   const [bpCds, setBpCds] = useState<any>([]);
   const [subCode, setSubCode] = useState<any>([]);
  
   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();

   const [tabIndex, setTabIndex] = useState(0);
   

   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef1, containerRef: gridContainerRef1, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      reSizeGrid({ ref: gridRef4, containerRef: gridContainerRef4, sec: 200 });
      reSizeGrid({ ref: gridRef5, containerRef: gridContainerRef5, sec: 200 });
      reSizeGrid({ ref: gridRef6, containerRef: gridContainerRef6, sec: 200 });
   }, []);

   const setChoiceUI = () => {
      initChoice(searchRef1, setChoice1);
      initChoice(refs.subCode, setChoice2);
      initChoice(refs.alarmYn, setChoice3, [
         { value: "", label: "", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.useYn, setChoice4, [
         { value: "", label: "", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
   };


   const setGridData = async () => {
      try {
         let sosocData = await ZZ_B_PO_BP();

         if (sosocData != null) {
            sosocData.unshift({ value: "", text: "" });
            setBpCds(sosocData);
         }

         let gridDatas1 = await MM0601_S01();
         if (gridDatas1?.length) {
            let gridDatas2 = await MM0601_S02({ majorCode: gridDatas1[0].hsType });
         }
         let gridDatas3 = await MM0601_S03();
         let gridDatas4 = await MM0601_S04();
         let gridDatas5 = await MM0601_S05();
         let gridDatas6 = await MM0601_S06();
                  
         let subCodeData = await SUB_CODE();

         if (subCodeData != null) {
            subCodeData.unshift({ value: "", text: "" });
            setSubCode(subCodeData);
         }

         setGridDatas1(gridDatas1);
         setGridDatas2(gridDatas2);
         setGridDatas3(gridDatas3);
         setGridDatas4(gridDatas4);
         setGridDatas5(gridDatas5);
         setGridDatas6(gridDatas6);
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
      refreshGrid(gridRef4);
      refreshGrid(gridRef5);
      refreshGrid(gridRef6);
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
            console.log("gridDatas2 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas2]);

   useEffect(() => {
      try {
         if (gridRef3.current && Array.isArray(gridDatas3)) {
            let grid = gridRef3.current.getInstance();
            grid.resetData(gridDatas3);
         } else {
            console.log("gridDatas3 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas3]);

   useEffect(() => {
      try {
         if (gridRef4.current && Array.isArray(gridDatas4)) {
            let grid = gridRef4.current.getInstance();
            grid.resetData(gridDatas4);
         } else {
            console.log("gridDatas4 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas4]);

   useEffect(() => {
      try {
         if (gridRef5.current && Array.isArray(gridDatas5)) {
            let grid = gridRef5.current.getInstance();
            grid.resetData(gridDatas5);
         } else {
            console.log("gridDatas5 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas5]);

   useEffect(() => {
      try {
         if (gridRef6.current && Array.isArray(gridDatas6)) {
            let grid = gridRef6.current.getInstance();
            grid.resetData(gridDatas6);

            let focusRowKey = grid.getFocusedCell()?.rowKey || 0;
            if (gridDatas6.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         } else {
            console.log("gridDatas6 is not an array or undefined");
         }
      } catch (error) {}
   }, [gridDatas6]);

   useEffect(() => {
      updateChoices(choice1, bpCds, "value", "text");
   }, [bpCds]);

   useEffect(() => {
      updateChoices(choice2, subCode, "value", "text");
   }, [subCode]);
   //---------------------- api -----------------------------
   const MM0601_S01 = async () => {
      try {
         const param = {
            bpCd: searchRef1.current?.value,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0601_S01`, { data });
         setGridDatas1(result);
         return result;
      } catch (error) {
         console.error("MM0601_S01 Error:", error);
         throw error;
      }
   };
   const MM0601_S02 = async (hsType: any) => {
      try {
         const param = {
            bpCd: searchRef1.current?.value,
            hsType: hsType,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0601_S02`, { data });
         setGridDatas2(result);
         return result;
      } catch (error) {
         console.error("MM0601_S02 Error:", error);
         throw error;
      }
   };

   const MM0601_S03 = async () => {
      try {
         const param = {
            bpCd: searchRef1.current?.value,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0601_S03`, { data });
         setGridDatas3(result);
         return result;
      } catch (error) {
         console.error("MM0601_S03 Error:", error);
         throw error;
      }
   };

   const MM0601_S04 = async () => {
      try {
         const param = {
            bpCd: searchRef1.current?.value,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0601_S04`, { data });
         setGridDatas4(result);
         return result;
      } catch (error) {
         console.error("MM0601_S04 Error:", error);
         throw error;
      }
   };

   const MM0601_S05 = async () => {
      try {
         const param = {
            bpCd: searchRef1.current?.value,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0601_S05`, { data });
         setGridDatas5(result);
         return result;
      } catch (error) {
         console.error("MM0601_S05 Error:", error);
         throw error;
      }
   };

   const MM0601_S06 = async () => {
      try {
         const param = {
            bpCd: searchRef1.current?.value,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0601_S06`, { data });
         setGridDatas6(result);
         return result;
      } catch (error) {
         console.error("MM0601_S06 Error:", error);
         throw error;
      }
   };

   var ZZ_B_PO_BP = async () => {
      try {
         const param = {
            coCd: "100",
            bpDiv: "ZZ0188",
            bpNm: "999",
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
         console.error("ZZ_B_BIZ Error:", error);
         throw error;
      }
   }

   const SUB_CODE = async () => {
      try {
         const param = {
            bpCd: searchRef1.current?.value,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0601_S03`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ subCode, subCodeNm, ...rest }) => ({
              value: subCode,
              text: subCodeNm,
              label: subCodeNm,
              ...rest,
           }))
         : [];

         return formattedResult;
      } catch (error) {
         console.error("MM0601_S03 Error:", error);
         throw error;
      }
   }
   
   const MM0601_U07 = async () => {
      try {
         const data = await getGridValues();
         const result = await fetchPost(`MM0601_U07`, data);
         return result as any;
      } catch (error) {
         console.error("MM0601_U07 Error:", error);
         throw error;
      }
   };

   //---------------------- div -----------------------------
   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
            <SelectComp1 ref={searchRef1} title="회사약명" handleCallSearch={handleCallSearch}></SelectComp1>
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
         let result = await MM0601_U07();
         if (result) {
            await returnResult(result);
         }
      }
   };

   const returnResult = (result:any) => {
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let hs = await getGridDatas(gridRef1);
      let hsCode = await getGridDatas(gridRef2);
      let subCode = await getGridDatas(gridRef3);
      let item = await getGridDatas(gridRef4);
      let tipCode = await getGridDatas(gridRef5);
      let person = await getGridDatas(gridRef6);

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         hs: JSON.stringify(hs),
         hsCode: JSON.stringify(hsCode),
         subCode: JSON.stringify(subCode),
         item: JSON.stringify(item),
         tipCode: JSON.stringify(tipCode),
         person: JSON.stringify(person),
      };

      return data;
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef1.current) {
         const grid = gridRef1.current.getInstance();
         const hsType = grid.getValue(rowKey, "hsType");

         if (hsType) {
            const gridDatas2 = await MM0601_S02(hsType);
            setGridDatas2(gridDatas2);
         }
      }
   };

   //grid 포커스변경시
   const handleFocusChange2 = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef6.current) {
         const grid = gridRef6.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs]; // Add index signature to allow indexing with a string
               if (ref && ref.current) {
                 
                  if (key === "subCode") {
                     setTimeout(function () {
                        choice2?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "alarmYn") {
                     setTimeout(function () {
                        choice3?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "useYn") {                    
                     setTimeout(function () {
                        choice4?.setChoiceByValue(value);
                     }, 100);
               
                  } else {
                     ref.current.value = value;
                  }
               }
               
            });
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

      grid.appendRow({ bpCd: searchRef1.current?.value, hsTypeNm: "", coCd: "100", useYn: "Y" }, { at: 0 });
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
      let grid = gridRef1.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      let hsType = gridRef1.current.getInstance().getValue(rowKey, 'hsType');

      gridRef2.current.getInstance().appendRow({bpCd: searchRef1.current?.value, coCd: "100", hsType: hsType, useYn : 'Y'}, {focus:true});
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

      grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", useYn: "Y" }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow3 = () => {
      let grid = gridRef3.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   //grid 추가버튼
   const addGridRow4 = () => {
      let grid = gridRef4.current.getInstance();

      grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", useYn: "Y" }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow4 = () => {
      let grid = gridRef4.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   //grid 추가버튼
   const addGridRow5 = () => {
      let grid = gridRef5.current.getInstance();

      grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", useYn: "Y" }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow5 = () => {
      let grid = gridRef5.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   //grid 추가버튼
   const addGridRow6 = () => {
      let grid = gridRef6.current.getInstance();

      grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", alarmYn: "", subCode: "", useYn: "Y" }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow6 = () => {
      let grid = gridRef6.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   const handleTabIndex = async (index: number) => {
      await setTabIndex(index);
      await refreshGrid(gridRef2);
      await refreshGrid(gridRef3);
      await refreshGrid(gridRef4);
      await refreshGrid(gridRef5);
      await refreshGrid(gridRef6);
   };

   const setChangeGridData = (columnName: string, value: any) => {
      const grid = gridRef6.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.setValue(rowKey, columnName, value, false);
   };

   //input div
   const inputDiv = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">담당자 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <InputComp2 ref={refs.prsnCd} title="담당자코드" target="prsnCd" setChangeGridData={setChangeGridData} readOnly={true}/>
               <InputComp2 ref={refs.prsnType} title="구분" target="prsnType" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.prsnNm} title="담당자명" target="prsnNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.hp} title="연락처" target="hp" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.subCode} title="재직구분" target="subCode" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.alarmYn} title="알림톡 발생여부" target="alarmYn" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.useYn} title="사용여부" target="useYn" setChangeGridData={setChangeGridData} />              
            </div>
         </div>
      </div>
   );

   //---------------------- grid -----------------------------


   const handleChoiceChange = (value: string) => {
    
   };



   const columns1 = [
      { header: "사용처", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "적용일자", name: "validDt", align: "center", hidden: "true" },
      { header: "TYPE", name: "hsType", align: "center", editor: "text" },
      { header: "TYPE명", name: "hsTypeNm", editor: "text" },      
   ];

   const grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">경조 TYPE</div>
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

         <TuiGrid01 gridRef={gridRef1} columns={columns1} handleFocusChange={handleFocusChange} height={window.innerHeight-550} />
      </div>
   );   

   const columns2 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true"},
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "TYPE", name: "hsType", align: "center",  },
      { header: "경조코드", name: "hsCode", align: "center", editor: "text" },
      { header: "경조사유명", name: "hsNm", editor: "text" },
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">경조사유</div>
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
      { header: "회사코드", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "적용일자", name: "validDt", align: "center", hidden: "true" },
      { header: "소속", name: "subCode", align: "center", editor: "text", width: 150 },
      { header: "소속명", name: "subCodeNm", align: "center", editor: "text" },      
   ];

   const grid3 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">재직구분</div>
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

   const columns4 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "품목코드", name: "itemCd", align: "center", editor: "text", width: 150 },
      { header: "품목명", name: "itemNm", width: 450  },
      { header: "수량", name: "itemQty", align: "center", editor: "text", width: 100  },      
      { header: "복리단가", name: "priceCom", align: "center", editor: "text", width: 150  },      
      { header: "개별단가", name: "pricePer", align: "center", editor: "text", width: 150  },      
      {
         header: "필수여부",
         name: "mandatoryYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type:'select',
            options: {
               listItems: [
                  { text: "예", value: "Y" },
                  { text: "아니오", value: "N" },
               ],
            },
         },
      },  
      {
         header: "발주구분",
         name: "branchGroup",
         align: "center",
         formatter: "listItemText",
         editor: {
            type:'select',
            options: {
               listItems: [
                  { text: "의전본부", value: "ZZ0189" },
                  { text: "화환업체", value: "ZZ0193" },
               ],
            },
         },
      },  
   ];

   const grid4 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목리스트</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow4} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow4} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef4} columns={columns4} height={window.innerHeight-500}  />
      </div>
   );

   const columns5 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "팁코드", name: "tipCode", align: "center", width: 150 },
      { header: "팁", name: "tip", align: "center", editor: "text", width: 800 },
      {
         header: "중요여부",
         name: "impactYn",
         align: "center", 
         width: 100,         
         formatter: "listItemText",
         editor: {
            type:'select',
            options: {
               listItems: [
                  { text: "예", value: "Y" },
                  { text: "아니오", value: "N" },
               ],
            },
         },
      },  
      { header: "시작일", name: "validFrDt", align: "center", editor: "text" },
      { header: "종료일", name: "validToDt", align: "center", editor: "text" },      
      { header: "정렬", name: "ordr", align: "center", editor: "text" },             
   ];

   const grid5 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">주문팁 내용</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow5} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow5} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef5} columns={columns5} height={window.innerHeight-500}  />
      </div>
   );

   const columns6 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "담당자코드", name: "prsnCd", align: "center", hidden: "true" },
      { header: "구분", name: "prsnType", align: "center" },
      { header: "담당자명", name: "prsnNm", align: "center" },
      { header: "연락처", name: "hp", align: "center", hidden: "true" },
      { header: "재직구분", name: "subCode", align: "center", hidden: "true" },
      { header: "알림톡발생여부", name: "alarmYn", align: "center", hidden: "true" },
      { header: "사용여부", name: "useYn", align: "center", hidden: "true" }, 
   ];

   const grid6 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">담당자 리스트</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow6} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow6} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef6} columns={columns6} handleFocusChange={handleFocusChange2} height={window.innerHeight-500}  />
      </div>
   );

   const tabLabels = ['경조매핑', '재직구분', '품목매핑', '주문팁', '담당자연락처'];

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
               <div className="w-full">
                  <div className="flex ">
                     {tabLabels.map((label, index) => (
                           <div
                              key={index} // 고유한 key 속성 추가
                              className={`p-1 px-2  w-auto text-center rounded-t-md  text-sm cursor-pointer border border-b-0
                                 ${tabIndex === index ? "text-white bg-sky-900  " : "text-gray-500"}
                              `}
                              onClick={() => {
                                 handleTabIndex(index);
                              }}
                           >
                              {label}
                           </div>
                     ))}
                  </div>
                  <div className={"w-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2"}>
                     <div className={`w-1/2 ${tabIndex === 0 ? " " : "hidden"}`} ref={gridContainerRef1}>{grid1()}</div>
                     <div className={`w-1/2 ${tabIndex === 0 ? " " : "hidden"}`} ref={gridContainerRef2}>{grid2()} </div>                     
                  </div>
                  <div className={`w-1/2 ${tabIndex === 1 ? " " : "hidden"}`} ref={gridContainerRef3}>{grid3()}</div>
                  <div className={`w-4/5 ${tabIndex === 2 ? " " : "hidden"}`} ref={gridContainerRef4}>{grid4()}</div>
                  <div className={` ${tabIndex === 3 ? " " : "hidden"}`} ref={gridContainerRef5}>{grid5()}</div>
                  <div className="w-full flex space-x-2 p-2">
                     <div className={`w-1/3 ${tabIndex === 4 ? " " : "hidden"}`} ref={gridContainerRef6}>{grid6()}</div>
                     <div className={`w-2/3 ${tabIndex === 4 ? " " : "hidden"}`}>{inputDiv()} </div>
                  </div>
               </div>
         </div>
      </div>
   );
};

export default Mm0601;
