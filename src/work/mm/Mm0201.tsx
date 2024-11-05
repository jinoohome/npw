import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, SelectSearch, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp, InputComp1, InputComp2, SelectComp1, SelectComp2, commas } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Mm0201 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);

   const [searchChoices, setSearchChoices] = useState<{ [key: string]: any }>({});
   const [inputChoices, setInputChoices] = useState<{ [key: string]: any }>({});
   const [errorMsgs, setErrorMsgs] = useState<{ [key: string]: string }>({});

   const [gridDatas, setGridDatas] = useState<any[]>();
   const breadcrumbItem = [{ name: "기준정보" }, { name: "품목" }, { name: "품목 등록 (장례지원단)" }];

   const refs = {
      coCd: useRef<any>(null),
      itemCd: useRef<any>(null),
      itemNm: useRef<any>(null),
      spec: useRef<any>(null),
      itemGrp: useRef<any>(null),
      itemDiv: useRef<any>(null),
      salePrice: useRef<any>(null),
      costPrice: useRef<any>(null),
      taxYn: useRef<any>(null),
      pkgItemYn: useRef<any>(null),
      subsYn: useRef<any>(null),
      deduYn: useRef<any>(null),
      useYn: useRef<any>(null),
      delYn: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null),
   };

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
   });

   const [cd0004, setCd0004] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005, setCd0005] = useState<ZZ_CODE_RES[]>([]);
   const [cd0004Input, setCd0004Input] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005Input, setCd0005Input] = useState<ZZ_CODE_RES[]>([]);
   const [coCds, setCoCds] = useState<ZZ_CODE_RES[]>([]);
   const [focusRow, setFocusRow] = useState<any>(0);

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      // Search Choices
      initChoice(searchRef2, (choice) => setSearchChoices((prev) => ({ ...prev, itemGrp: choice })));
      initChoice(searchRef3, (choice) => setSearchChoices((prev) => ({ ...prev, itemDiv: choice })));
      initChoice(searchRef4, (choice) => setSearchChoices((prev) => ({ ...prev, subsYn: choice })), [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(searchRef5, (choice) => setSearchChoices((prev) => ({ ...prev, deduYn: choice })), [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(searchRef6, (choice) => setSearchChoices((prev) => ({ ...prev, useYn: choice })), [
         { value: "999", label: "전체" },
         { value: "Y", label: "사용", selected: true },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      try {
         let cd0004Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0004", div: "999" });
         if (cd0004Data !== null) {
            setCd0004(cd0004Data);

            let cd0004IntupData = cd0004Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            cd0004IntupData.unshift({ value: "", text: "" });

            setCd0004Input(cd0004IntupData);
         }

         let cd0005Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0005", div: "999" });
         if (cd0005Data !== null) {
            setCd0005(cd0005Data);

            let cd0005IntupData = cd0005Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            cd0005IntupData.unshift({ value: "", text: "" });

            setCd0005Input(cd0005IntupData);
         }

         let coCdData = await ZZ_B_BIZ();
         if (coCdData !== null) {
            setCoCds(coCdData);
         }

         const result = await MM0201_S01();

         if (!result || result.length === 0) {
            // 데이터가 없을 때 refs 값들 초기화
            Object.keys(refs).forEach((key) => {
               const ref = refs[key as keyof typeof refs];
               if (ref?.current) {                  
                     ref.current.value = ""; // 각 ref의 값을 빈 값으로 설정
               }
            });

            setInputValues([]);
         }
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
         grid.resetData(gridDatas);
         if (gridDatas.length > 0) {
            let checkFocusRow = grid.getValue(focusRow, "itemCd") ? focusRow : 0;
            grid.focusAt(checkFocusRow, 0, true);
         }
      }
      //updateChoices(choice3, gridDatas, "coCd", "bpNm", "");
   }, [gridDatas]);

   //inputChoicejs 데이터 설정
   // useEffect(() => {
   //    updateChoices(choice1, zz0005, "value", "text");

   //    let zz0005Data = zz0005.filter((item) => item.value !== "999");
   //    updateChoices(choice4, zz0005Data, "value", "text", "");
   // }, [zz0005]);

   // //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(searchChoices.itemGrp, cd0004, "value", "text");
   }, [cd0004]);

   useEffect(() => {
      updateChoices(inputChoices.itemGrp, cd0004Input, "value", "text");
   }, [cd0004Input]);

   useEffect(() => {
      updateChoices(searchChoices.itemDiv, cd0005, "value", "text");
   }, [cd0005]);

   useEffect(() => {
      updateChoices(inputChoices.itemDiv, cd0005Input, "value", "text");
   }, [cd0005Input]);

   useEffect(() => {
      updateChoices(inputChoices.coCd, coCds, "value", "text");
   }, [coCds]);

   // //inputChoicejs 데이터 설정
   // useEffect(() => {
   //    updateChoices(choice6, zz0009, "value", "text");
   // }, [zz0009]);

   // Grid 내부 Choicejs 데이터 설정
   // useEffect(() => {
   //    if (zz0005) {
   //       let gridInstance = majorGridRef.current.getInstance();
   //       let column = gridInstance.getColumn("codeDiv");
   //       column.editor.options.listItems = zz0001;
   //       gridInstance.refreshLayout();
   //    }
   // }, [zz0005]);

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

         return formattedResult;
      } catch (error) {
         console.error("ZZ_B_BIZ Error:", error);
         throw error;
      }
   };

   const MM0201_S01 = async () => {
      try {
         const param = {
            coCd: "100",
            itemNm: searchRef1.current?.value || "999",
            itemGrp: searchRef2.current?.value || "999",
            itemDiv: searchRef3.current?.value || "999",
            subsYn: searchRef4.current?.value || "999",
            deduYn: searchRef5.current?.value || "999",
            pkgItemYn:  "999",
            useYn: searchRef6.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0201_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0201_S01 Error:", error);
         throw error;
      }
   };

   const MM0201_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0201_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0201_U01 Error:", error);
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
      setErrorMsgs({});
      setGridData();
   };

   const validateData = (action: string, dataString: any) => {
      // dataString이 문자열이면 JSON.parse()를 사용, 그렇지 않으면 직접 사용
      const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;
      let result = true;

      if (action === "save") {
         if (data.length < 1) return false;

         for (const item of data) {
            if (["U", "I"].includes(item.status)) {
          
               if (!item.itemNm) {
                  setErrorMsgs((prev) => ({ ...prev, itemNm: "*품목명을 입력해주세요." }));
                  result = false;
               }
            }
         }
      }

      if(!result){
         alertSwal("필수입력항목을 확인해주세요.", "error", "error");
      }else{
         return result; 
      }

   };

   const save = async () => {
      setErrorMsgs({});
      let grid = gridRef.current.getInstance();
      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey);
      setFocusRow(rowKey); // 저장 후에는 추가Row가 맨마지막으로 이동하므로 rowkey로 지정

 
      const data = await getGridValues();

   
      if (data) {
         let result = await MM0201_U01(data);
         if (result) {
            returnResult(result);
         }
      } else {
         grid.focusAt(rowIndex, 0, true); //저장이 안된경우는 추가행이 맨위에 있으므로 rowIndex로 지정
      }
   };

   const returnResult = async (result: any) => {
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);
     
      if (!validateData("save", datas)) return false;

      if (datas) {
         let data = {
            data: JSON.stringify(datas),
            menuId: activeComp.menuId,
            insrtUserId: userInfo.usrId,
         };

         return data;
      }
   };

   //grid 추가버튼
   const addMajorGridRow = () => {
      let grid = gridRef.current.getInstance();

      grid.appendRow({ coCd: "100", itemGrp: "", itemDiv: "", taxYn: "N", pkgItemYn: "N", subsYn: "N", deduYn: "N", useYn: "Y" }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();
      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);

      grid.removeRow(rowKey, {});
      grid.focusAt(rowIndex, 1, true);
   };

   const handleFocusChange = async ({ rowKey }: any) => {
      
      if(focusRow !== rowKey) {
         setErrorMsgs({})
      }
      
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               
               onInputChange(key, value);
            }); 
         }

        
         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs];
               if (ref && ref.current) {
                  if (inputChoices[key]) {
                     setTimeout(() => {
                        inputChoices[key].setChoiceByValue(value);
                     }, 100);
                  } else{
                     let type = ref.current.getAttribute("data-type");
                     if (type === "number") {
                        ref.current.value = commas(Number(value));
                      } else {
                        ref.current.value = value;
                      }
                 }
               }
            });
         }
      }
   };

   const setChangeGridData = (columnName: string, value: any) => {
      const grid = gridRef.current.getInstance();
      let { rowKey } = grid.getFocusedCell();
      
      grid.setValue(rowKey, columnName, value, false);
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
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="품목명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="품목그룹" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="품목구분" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef4} title="대체유무" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef5} title="공제유무" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef6} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );
   //input div
   const inputDiv = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-12  justify-around items-center ">
               <SelectSearch
                       title="사업부서"
                       value={inputValues.coCd}
                       readonly={true}
                       onChange={(label, value) => {
                           setChangeGridData("coCd", value);
                           onInputChange("coCd", value);
                       }}

                       stringify={true}
                       layout="vertical"
                       param={{ coCd: userInfo.coCd }}
                       procedure="ZZ_B_BIZ"
                       dataKey={{ label: "bpNm", value: "coCd" }}
                   />
               <InputComp2 ref={refs.itemCd} title="품목코드" target="itemCd" setChangeGridData={setChangeGridData} readOnly={true} />
               <InputComp2 ref={refs.itemNm} title="품목명" target="itemNm" setChangeGridData={setChangeGridData} errorMsg={errorMsgs.itemNm} />
               <InputComp2 ref={refs.spec} title="규격" target="spec" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-4  gap-12  justify-around items-center">
            <SelectSearch
                       title="품목그룹"
                       value={inputValues.itemGrp}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("itemGrp", value);
                           onInputChange("itemGrp", value);
                       }}

                       param={{ coCd: "999", majorCode: "CD0004", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <SelectSearch
                       title="품목구분"
                       value={inputValues.itemDiv}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("itemDiv", value);
                           onInputChange("itemDiv", value);
                       }}

                       param={{ coCd: "999", majorCode: "CD0005", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <InputComp ref={refs.salePrice} value={inputValues.salePrice} layout="vertical" title="판매단가" target="salePrice" setChangeGridData={setChangeGridData}  type="number"/>
               <InputComp ref={refs.costPrice} value={inputValues.costPrice} layout="vertical" title="발주단가" target="costPrice" setChangeGridData={setChangeGridData} type="number"/>
            </div>

            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <SelectSearch title="과세여부" 
                                 value={inputValues.taxYn}
                                 layout="vertical"
                                 onChange={(label, value) => {
                                       setChangeGridData("taxYn", value);
                                       onInputChange('taxYn', value);
                                    }}                           

                                 //초기값 세팅시
                                 datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
               />
               <SelectSearch title="패키지품목추가" 
                                 value={inputValues.pkgItemYn}
                                 layout="vertical"
                                 onChange={(label, value) => {
                                       setChangeGridData("pkgItemYn", value);
                                       onInputChange('pkgItemYn', value);
                                    }}                           

                                 //초기값 세팅시
                                 datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
               />
               <SelectSearch title="대체유무" 
                                 value={inputValues.subsYn}
                                 layout="vertical"
                                 onChange={(label, value) => {
                                       setChangeGridData("subsYn", value);
                                       onInputChange('subsYn', value);
                                    }}                           

                                 //초기값 세팅시
                                 datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
               />
               <SelectSearch title="공제유무" 
                                 value={inputValues.deduYn}
                                 layout="vertical"
                                 onChange={(label, value) => {
                                       setChangeGridData("deduYn", value);
                                       onInputChange('deduYn', value);
                                    }}                           

                                 //초기값 세팅시
                                 datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
               />
            </div>
            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <SelectSearch title="사용유무" 
                                    value={inputValues.useYn}
                                    layout="vertical"
                                    onChange={(label, value) => {
                                          setChangeGridData("useYn", value);
                                          onInputChange('useYn', value);
                                       }}                           

                                    //초기값 세팅시
                                    datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
               />
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "품목코드", name: "itemCd", align:"center", width: 100 },
      { header: "품목명", name: "itemNm"},
      { header: "규격", name: "spec", hidden: true },
      { header: "품목그룹", name: "itemGrp", hidden: true },
      { header: "품목구분", name: "itemDiv", hidden: true },
      { header: "판매단가", name: "salePrice", hidden: true },
      { header: "발주단가", name: "costPrice", hidden: true },
      { header: "과세여부", name: "taxYn", hidden: true },
      { header: "패키지품목추가", name: "pkgItemYn", hidden: true },
      { header: "대체유무", name: "subsYn", hidden: true },
      { header: "공제유무", name: "deduYn", hidden: true },
      { header: "사용여부", name: "useYn", hidden: true },

      // { header: "등록자", name: "insrtUserId", hidden: true },
      // { header: "등록일시", name: "insrtDt", hidden: true },
      // { header: "수정자", name: "updtUserId", hidden: true },
      // { header: "수정일시", name: "updtDt", hidden: true }
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목 리스트</div>
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

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} height={window.innerHeight - 550}/>
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
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-1/3 " ref={gridContainerRef}>
               {grid()}
            </div>
            <div className="w-2/3 ">{inputDiv()} </div>
         </div>
      </div>
   );
};

export default Mm0201;
