import { React, useEffect, useState, useRef, useCallback, initChoice, commas, CommonModal, updateChoices, SelectSearch, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
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
   const searchRefP1_1 = useRef<any>(null);
   const searchRefP2_1 = useRef<any>(null);
   const searchRefP2_2 = useRef<any>(null);

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

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
   });

   const gridRef1 = useRef<any>(null);
   const gridRef2 = useRef<any>(null);
   const gridRef3 = useRef<any>(null);
   const gridRef4 = useRef<any>(null);
   const gridRef5 = useRef<any>(null);
   const gridRef6 = useRef<any>(null);
   const gridRefP1 = useRef<any>(null);
   const gridRefP2 = useRef<any>(null);

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
   const [gridDatasP1, setGridDatasP1] = useState<any[]>();
   const [gridDatasP2, setGridDatasP2] = useState<any[]>();
   
   const [isOpen, setIsOpen] = useState(false);
   const [isOpen2, setIsOpen2] = useState(false);

   const [bpCds, setBpCds] = useState<any>([]);
   const [subCode, setSubCode] = useState<any>([]);
  
   const [choice1, setChoice1] = useState<any>();

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
   };


   const setGridData = async () => {
      try {
         let sosocData = await ZZ_B_PO_BP();
   
         if (sosocData != null) {
            sosocData.unshift({ value: "", text: "" });
            setBpCds(sosocData);
         }
   
         let gridDatas1 = await MM0601_S01();
         let gridDatas2 = []; // gridDatas2를 블록 외부에서 선언
         const hsType = gridDatas1[0]?.hsType;
   
         if (gridDatas1?.length) {
            gridDatas2 = await MM0601_S02(hsType);
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
         setGridDatas2(gridDatas2); // 이제 이 부분에서 gridDatas2는 유효합니다.
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

   const handleCallSearchModal = async () => {
      await HS_CODE();
     
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

            let focusRowKey = grid.getFocusedCell().rowKey || 0;

            if (gridDatas1.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         }
      } catch (error) {}
   }, [gridDatas1]);

   useEffect(() => {
      try {
         if (gridRef2.current && Array.isArray(gridDatas2)) {
            let grid = gridRef2.current.getInstance();
            grid.resetData(gridDatas2);

            let focusRowKey = grid.getFocusedCell().rowKey || 0;

            if (gridDatas2.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         }
      } catch (error) {}
   }, [gridDatas2]);

   useEffect(() => {
      try {
         if (gridRef3.current && Array.isArray(gridDatas3)) {
            let grid = gridRef3.current.getInstance();
            grid.resetData(gridDatas3);

            let focusRowKey = grid.getFocusedCell().rowKey || 0;

            if (gridDatas3.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         }
      } catch (error) {}
   }, [gridDatas3]);

   useEffect(() => {
      try {
         if (gridRef4.current && Array.isArray(gridDatas4)) {
            let grid = gridRef4.current.getInstance();
            grid.resetData(gridDatas4);

            let focusRowKey = grid.getFocusedCell().rowKey || 0;

            if (gridDatas4.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         }
      } catch (error) {}
   }, [gridDatas4]);

   useEffect(() => {
      try {
         if (gridRef5.current && Array.isArray(gridDatas5)) {
            let grid = gridRef5.current.getInstance();
            grid.resetData(gridDatas5);

            let focusRowKey = grid.getFocusedCell().rowKey || 0;

            if (gridDatas5.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
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
         }
      } catch (error) {}
   }, [gridDatas6]);

   useEffect(() => {
      try {
         if (gridRefP1.current && Array.isArray(gridDatasP1)) {
            let grid = gridRefP1.current.getInstance();
            grid.resetData(gridDatasP1);

            let focusRowKey = grid.getFocusedCell()?.rowKey || 0;
            if (gridDatasP1.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         }
      } catch (error) {}
   }, [gridDatasP1]);

   useEffect(() => {
      try {
         if (gridRefP2.current && Array.isArray(gridDatasP2)) {
            let grid = gridRefP2.current.getInstance();
            grid.resetData(gridDatasP2);

            let focusRowKey = grid.getFocusedCell()?.rowKey || 0;
            if (gridDatasP2.length > 0) {
               grid.focusAt(focusRowKey, 0, true);
            }
         }
      } catch (error) {}
   }, [gridDatasP2]);

   useEffect(() => {
      updateChoices(choice1, bpCds, "value", "text");
   }, [bpCds]);
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

         if (!result || result.length === 0) {
            Object.keys(refs).forEach((key) => {
               const ref = refs[key as keyof typeof refs];
               if (ref?.current) {                  
                     ref.current.value = ""; // 각 ref의 값을 빈 값으로 설정
               }
            });

            setInputValues([]);
         }

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

   const ZZ_HS_CODE = async () => {
      try {
         const param = {
            hsNm: searchRefP1_1.current?.value,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_HS_CODE`, { data });

         return result;
      } catch (error) {
         console.error("MM0601_S03 Error:", error);
         throw error;
      }
   };

   const HS_CODE = async () => {
      const result = await ZZ_HS_CODE();

      setGridDatasP1(result);
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

   const MM0201_S01 = async () => {
      try {
         const param = {
            coCd: "100",
            itemNm: searchRefP2_1.current?.value || "999",
            itemGrp: inputValues.itemGrp || "999",
            itemDiv: inputValues.itemDiv || "999",
            pkgItemYn: "999",
            subsYn:  "999",
            deduYn:  "999",
            useYn: 'Y',
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0202_S01`, { data });
         console.log(result);
         setGridDatasP2(result);

         return result;
      } catch (error) {
         console.error("MM0201_S01 Error:", error);
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

   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid  gap-y-3  justify-start w-[70%]">
               <InputComp1 ref={searchRefP1_1} handleCallSearch={handleCallSearchModal} title="경조사유"></InputComp1>               
            </div>
            <div className="w-[30%] flex justify-end">
               <button type="button" onClick={handleCallSearchModal} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>
         </div>
      </div>
   );

   const modalSearchDiv2 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-3  gap-y-3  justify-start w-[80%]">
               <InputComp1 ref={searchRefP2_1} handleCallSearch={handleCallSearchModal} title="품목명"></InputComp1>
               <SelectSearch
                       title="품목그룹"
                       value={inputValues.itemGrp}
                       onChange={(label, value) => {
                          handleCallSearchModal();
                           onInputChange("itemGrp", value);
                       }}

                       param={{ coCd: "999", majorCode: "CD0004", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <SelectSearch
                       title="품목구분"
                       value={inputValues.itemDiv}
                       onChange={(label, value) => {
                          handleCallSearchModal();
                           onInputChange("itemDiv", value);
                       }}

                       param={{ coCd: "999", majorCode: "CD0005", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearchModal} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>
         </div>
      </div>
   );

   const ModalDiv = () => (
      <CommonModal isOpen={isOpen} size="sm" onClose={closeModal} title="경조사유 선택">
         {modalSearchDiv()}
         {GridP1()}
      </CommonModal>
   );

   const ModalDiv2 = () => (
      <CommonModal isOpen={isOpen2} onClose={closeModal2} title="품목등록">
         {modalSearchDiv2()}
         {GridP2()}
      </CommonModal>
   );

   //---------------------- event -----------------------------
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

   const save = async () => {
      const data = await getGridValues();

      // 경조 TYPE과 품목리스트의 필수 필드 체크 함수
      const validateRequiredFields = () => {
         // 경조 TYPE 그리드에서 HS_TYPE 필드가 비어있는지 확인
         const grid1 = gridRef1.current.getInstance();
         const hsTypeRows = grid1.getData();

         // 경조 TYPE 그리드에서 HS_TYPE 필드가 비어있는지 확인
         const grid3 = gridRef3.current.getInstance();
         const subCodeRows = grid3.getData();
         
         // 품목리스트 그리드에서 필수여부와 발주구분 필드가 비어있는지 확인
         const grid4 = gridRef4.current.getInstance();
         const itemRows = grid4.getData();

         // 경조 TYPE의 HS_TYPE 필수 체크
         const missingSubCode = subCodeRows.some((row: { subCode: any; }) => !row.subCode);
         if (missingSubCode) {
            alertSwal("재직구분의 소속은 필수 입력 항목입니다.", "", "warning");
            return false;
         }

         // 경조 TYPE의 HS_TYPE 필수 체크
         const missingHSType = hsTypeRows.some((row: { hsType: any; }) => !row.hsType);
         if (missingHSType) {
            alertSwal("경조 TYPE의 HS_TYPE은 필수 입력 항목입니다.", "", "warning");
            return false;
         }

         // 품목리스트의 필수여부와 발주구분 필수 체크
         const missingRequiredFields = itemRows.some((row: { mandatoryYn: any; branchGroup: any; }) => !row.mandatoryYn || !row.branchGroup);
         if (missingRequiredFields) {
            alertSwal("품목리스트의 필수여부와 발주구분은 필수 입력 항목입니다.", "", "warning");
            return false;
         }

         return true; // 모든 필수 필드가 채워졌다면 true 반환
      };

      // 필수 필드 체크
      if (!validateRequiredFields()) {
            return; // 필수 필드가 채워지지 않았다면 저장 중단
      }
   
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

   const handleClick = (ev: any) => {
      const { rowKey, columnName } = ev;
   
      const gridP1 = gridRefP1.current.getInstance();
      const isChecked = gridP1.getCheckedRows().some((row: any) => row.rowKey === rowKey);
   
      // Toggle the checkbox state by using check and uncheck methods
      if (isChecked) {
         gridP1.uncheck(rowKey);
      } else {
         gridP1.check(rowKey);
      }
   };

   const handleClick2 = (ev: any) => {
      const { rowKey, columnName } = ev;
   
      const gridP2 = gridRefP2.current.getInstance();
      const isChecked = gridP2.getCheckedRows().some((row: any) => row.rowKey === rowKey);
   
      // Toggle the checkbox state by using check and uncheck methods
      if (isChecked) {
         gridP2.uncheck(rowKey);
      } else {
         gridP2.check(rowKey);
      }
   };

   const handleAfterChange = (ev: any) => {
      const changesArray = ev.changes; // ev.changes가 배열이므로 이를 사용
      
      // 배열을 순회하며 변경 사항 처리
      changesArray.forEach((change: any) => {   
         const gridInstance4 = gridRef4.current.getInstance();
         
         // 현재 변경된 값이 onhandQty일 때만 처리
         if (change.columnName === "priceCom" || change.columnName === "pricePer" || change.columnName === "itemQty") {
            const rowKey = change.rowKey;
            const value = change.value; // 변경된 값을 가져옴
   
            // 숫자가 아닌 문자를 제거하여 정제
            const sanitizedValue = typeof value === 'string' ? value.replace(/[^0-9.-]/g, '') : value;
   
            // 정제 후 숫자가 아닐 경우 0으로 설정
            const numericValue = isNaN(Number(sanitizedValue)) ? 0 : Number(sanitizedValue);
   
            // 그리드의 데이터 값을 정제된 숫자 값으로 설정
            gridInstance4.setValue(rowKey, change.columnName, numericValue);
         }
      });
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef1.current) {
         const grid = gridRef1.current.getInstance();
         const hsType = grid.getValue(rowKey, "hsType");

         if (hsType) {
            const gridDatas2 = await MM0601_S02(hsType);
            setGridDatas2(gridDatas2);
         } else {
            setGridDatas2([]);
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
               
               onInputChange(key, value);
            }); 
         }

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs]; // Add index signature to allow indexing with a string
               if (ref && ref.current) {
                  ref.current.value = value;
               }
               
            });
         }
      }
   };

   const openModal = async() => {
      setIsOpen(true);
      await HS_CODE();
      refreshGrid(gridRefP1);
   };

   const closeModal = () => {
      setIsOpen(false);
   };

   const openModal2 = async() => {
      setIsOpen2(true);
      await MM0201_S01();
      refreshGrid(gridRefP2);
   };

   const closeModal2 = () => {
      setIsOpen2(false);
   };

   // 경조사유 추가
   const addItems = () => {
      const grid1 = gridRef1.current.getInstance();
      const rowData1 = grid1.getRow(grid1.getFocusedCell().rowKey);

      const gridP1 = gridRefP1.current.getInstance();
      const checkedRows = gridP1.getCheckedRows();
  
      const grid2 = gridRef2.current.getInstance();
      const existingItemCds = new Set(grid2.getData().map((row: any) => row.hsCode));
  
      checkedRows.forEach((row: any) => {
          if (!existingItemCds.has(row.hsCd)) {  // itemCd 중복 확인
              const newRow = {
                  coCd: rowData1.coCd,
                  bpCd: searchRef1.current?.value,
                  hsType: rowData1.hsType,
                  hsCode: row.hsCd,
                  hsNm: row.hsNm,
                  useYn: "Y",
                  status: "I"
              };
  
              grid2.appendRow(newRow, { focus: true });
          }
      });
  
      closeModal();
  };

   // 품목 추가
   const addItems2 = () => {
      const gridP2 = gridRefP2.current.getInstance();
      const checkedRows = gridP2.getCheckedRows();

      const grid4 = gridRef4.current.getInstance();
      const existingItemCds = new Set(grid4.getData().map((row: any) => row.itemCd));

      checkedRows.forEach((row: any) => {
         if (!existingItemCds.has(row.itemCd)) {  // itemCd 중복 확인
            const newRow = {
                  coCd: "100",
                  bpCd: searchRef1.current?.value,
                  itemCd: row.itemCd,
                  itemNm: row.itemNm,
                  itemQty: 1,
                  priceCom: row.salePrice,
                  pricePer: row.salePrice,
                  useYn: "Y",
                  status: "I"
            };

            grid4.appendRow(newRow, { focus: true });
         }
      });

      closeModal2();
   };

  const handleDblClick = (ev: any) => {
      const { rowKey } = ev;

      const grid1 = gridRef1.current.getInstance();
      const rowData1 = grid1.getRow(grid1.getFocusedCell().rowKey);

      const gridP1 = gridRefP1.current.getInstance();
      const rowData2 = gridP1.getRow(gridP1.getFocusedCell().rowKey);

      const grid2 = gridRef2.current.getInstance();
      const existingItemCds = new Set(grid2.getData().map((row: any) => row.hsCode));

      if (!existingItemCds.has(rowData2.hsCd)) {  // hsCd 중복 확인
         const newRow = {
                  coCd: rowData1.coCd,
                  bpCd: searchRef1.current?.value,
                  hsType: rowData1.hsType,
                  hsCode: rowData2.hsCd,
                  hsNm: rowData2.hsNm,
                  useYn: "Y",
                  status: "I"
         };

         grid2.appendRow(newRow, { focus: true });
      }

      setIsOpen(false);
   };

   const handleDblClick2 = (ev: any) => {
      const { rowKey } = ev;

      const gridP2 = gridRefP2.current.getInstance();
      const rowData3 = gridP2.getRow(rowKey);

      const grid4 = gridRef4.current.getInstance();
      const existingItemCds = new Set(grid4.getData().map((row: any) => row.itemCd));

      if (!existingItemCds.has(rowData3.itemCd)) {  // itemCd 중복 확인
         const newRow = {
            coCd: "100",
            bpCd: searchRef1.current?.value,
            itemCd: rowData3.itemCd,
            itemNm: rowData3.itemNm,
            itemQty: 1,
            priceCom: rowData3.salePrice,
            pricePer: rowData3.salePrice,
            useYn: "Y",
            status: "I"
         };

         grid4.appendRow(newRow, { focus: true });
      }

      setIsOpen2(false);
   };

   //-------------------div--------------------------

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={handleCallSearch} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
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

      grid.appendRow({ bpCd: searchRef1.current?.value, hsTypeNm: "", coCd: "100", useYn: "Y" }, { focus: true, at: 0 });
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
      let grid1 = gridRef1.current.getInstance();
      let flag = true;

      let inHsType = grid1.getValue(grid1.getFocusedCell().rowKey, "hsType");

      if (!inHsType) {
         flag = false;
         let title = "경조타입 미등록";
         let msg = "경조타입 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
      }

      if (flag) {
         openModal();
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
      let grid = gridRef3.current.getInstance();

      grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", useYn: "Y" }, { focus: true, at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
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

   //grid 추가버튼
   const addGridRow4 = () => {
      openModal2();

      // let grid = gridRef4.current.getInstance();

      // grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", useYn: "Y" }, { at: 0 });
      // grid.getPagination().movePageTo(0);
      // grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow4 = () => {
      let grid = gridRef4.current.getInstance();      

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
   const addGridRow5 = () => {
      let grid = gridRef5.current.getInstance();

      grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", useYn: "Y" }, { focus: true, at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow5 = () => {
      let grid = gridRef5.current.getInstance();      

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
   const addGridRow6 = () => {
      let grid = gridRef6.current.getInstance();

      grid.appendRow({ bpCd: searchRef1.current?.value, coCd: "100", alarmYn: "", subCode: "", useYn: "Y" }, { focus: true, at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow6 = () => {
      let grid = gridRef6.current.getInstance();      

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
      await refreshGrid(gridRef1);
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
               <SelectSearch
                       title="재직구분"
                       value={inputValues.subCode}
                       onChange={(label, value) => {
                           setChangeGridData("subCode", value);
                           onInputChange("subCode", value);
                       }}
                       addData={"empty"}
                       stringify={true}
                       layout="vertical"
                       param={{ bpCd: searchRef1.current?.value, }}
                       procedure="MM0601_S03"
                       dataKey={{ label: "subCodeNm", value: "subCode" }}
                   />
               <SelectSearch
                  title="알림톡 발생여부"
                  value={inputValues.alarmYn}
                  layout="vertical"
                  onChange={(label, value) => {
                     setChangeGridData("alarmYn", value);
                     onInputChange("alarmYn", value);
                  }}
                  datas={[
                     { value: "", label: "" },
                     { value: "Y", label: "사용" },
                     { value: "N", label: "미사용" },
                  ]}
               />
               <SelectSearch
                  title="사용여부"
                  value={inputValues.useYn}
                  layout="vertical"
                  onChange={(label, value) => {
                     setChangeGridData("useYn", value);
                     onInputChange("useYn", value);
                  }}
                  datas={[
                     { value: "", label: "" },
                     { value: "Y", label: "사용" },
                     { value: "N", label: "미사용" },
                  ]}
               />           
            </div>
         </div>
      </div>
   );

   //---------------------- grid -----------------------------
   const columns1 = [
      { header: "사용처", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "적용일자", name: "validDt", align: "center", hidden: "true" },
      { header: "TYPE", name: "hsType", align: "center", width: 150, editor: "text" },
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

         <TuiGrid01 gridRef={gridRef1} columns={columns1} handleFocusChange={handleFocusChange} height={window.innerHeight-535} />
      </div>
   );   

   const columns2 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true"},
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "TYPE", name: "hsType", align: "center", width: 150  },
      { header: "경조코드", name: "hsCode", align: "center", width: 150 },
      { header: "경조사유명", name: "hsNm" },
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

         <TuiGrid01 gridRef={gridRef2} columns={columns2} height={window.innerHeight-535} />
      </div>
   );

   const columns3 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "적용일자", name: "validDt", align: "center", hidden: "true" },
      { header: "소속", name: "subCode", align: "center", editor: "text", width: 150 },
      { header: "소속명", name: "subCodeNm", editor: "text" },      
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

         <TuiGrid01 gridRef={gridRef3} columns={columns3} height={window.innerHeight-535}  />
      </div>
   );

   const columns4 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "품목코드", name: "itemCd", align: "center", editor: "text", width: 150 },
      { header: "품목명", name: "itemNm", width: 450  },
      { header: "수량", name: "itemQty", align: "center", editor: "text", width: 100  },      
      { header: "복리단가", name: "priceCom", align: "right", editor: "text", width: 150,
         formatter: function(e: any) {
            if(e.value){return commas(e.value);}
         }},      
      { header: "개별단가", name: "pricePer", align: "right", editor: "text", width: 150,
         formatter: function(e: any) {
            if(e.value){return commas(e.value);}
         }},      
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

         <TuiGrid01 gridRef={gridRef4} columns={columns4} height={window.innerHeight-535} handleAfterChange={handleAfterChange} />
      </div>
   );

   const columns5 = [
      { header: "회사코드", name: "coCd", align: "center", hidden: "true" },
      { header: "고객사", name: "bpCd", align: "center", hidden: "true" },
      { header: "팁코드", name: "tipCode", align: "center", width: 150 },
      { header: "팁", name: "tip", editor: "text", width: 900 },
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
      { header: "시작일", name: "validFrDt", align: 'center', width: 140,
         editor: {
            type: 'datePicker',
            options: {
                  language: 'ko',
                  format: 'yyyy-MM-dd',
                  timepicker: false
            }
      }},
      { header: "시작일", name: "validToDt", align: 'center', width: 140,
         editor: {
            type: 'datePicker',
            options: {
                  language: 'ko',
                  format: 'yyyy-MM-dd',
                  timepicker: false
            }
      }},
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

         <TuiGrid01 gridRef={gridRef5} columns={columns5} height={window.innerHeight-535}  />
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

         <TuiGrid01 gridRef={gridRef6} columns={columns6} handleFocusChange={handleFocusChange2} height={window.innerHeight-535}  />
      </div>
   );

   const gridP1Columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "경조코드", name: "hsCd", hidden: true },
      { header: "경조사유", name: "hsNm" },
   ];

   const GridP1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>※ 더블클릭 시 단일 경조사유가 선택 됩니다.</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addItems} className="bg-orange-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  선택등록
               </button>
            </div>
         </div>
         <TuiGrid01 gridRef={gridRefP1} columns={gridP1Columns} handleClick={handleClick} rowHeaders={['checkbox','rowNum']} handleDblClick={handleDblClick} height = {window.innerHeight - 530}
         />
      </div>
   );

   const gridP2Columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 300 },
      { header: "규격", name: "spec", width: 200 },
      { header: "품목그룹", name: "itemGrpNm", width: 100 },
      { header: "품목구분", name: "itemDivNm", width: 100 },
      { header: "판매단가", name: "salePrice", width: 100, align: "right",   
         formatter: function(e: any) {if(e.value){return commas(e.value);} }  },
      { header: "발주단가", name: "costPrice", width: 100, align: "right",  
         formatter: function(e: any) {if(e.value){return commas(e.value);} }  },
      { header: "과세여부", name: "taxYn", width: 100, align: "center" },
      { header: "패키지품목추가", name: "pkgItemYn", hidden: true },
      { header: "대체유무", name: "subsYn", width : 100, align: "center" },
      { header: "공제유무", name: "deduYn", width : 100, align: "center" },
      { header: "사용여부", name: "useYn", hidden: true },
   ];

   const GridP2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>※ 더블클릭 시 단일 품목이 선택 됩니다.</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addItems2} className="bg-orange-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  선택등록
               </button>
            </div>
         </div>
         <TuiGrid01 gridRef={gridRefP2} columns={gridP2Columns} handleClick={handleClick2} rowHeaders={['checkbox','rowNum']} handleDblClick={handleDblClick2} height = {window.innerHeight - 530}
         />
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
                                 let setData;  
                                 let setData2;  

                                 if (index === 0) {    
                                    const gridInstance = gridRef1.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();

                                    setGridDatas1(setData);
                                  } else if (index === 1) {
                                    const gridInstance = gridRef3.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();

                                    setGridDatas3(setData);
                                  } else if (index === 2) {
                                    const gridInstance = gridRef4.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();

                                    setGridDatas4(setData);
                                  } else if (index === 3) {
                                    const gridInstance = gridRef5.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();

                                    setGridDatas5(setData);
                                  } else if (index === 4) {
                                    const gridInstance = gridRef6.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();

                                    setGridDatas6(setData);
                                  }

                                 handleTabIndex(index);
                              }}
                           >
                              {label}
                           </div>
                     ))}
                  </div>
                  <div className={"w-full md:flex md:space-x-2 md:space-y-0 space-y-2"}>
                     <div className={`w-1/2 ${tabIndex === 0 ? " " : "hidden"}`} ref={gridContainerRef1}>{grid1()}</div>
                     <div className={`w-1/2 ${tabIndex === 0 ? " " : "hidden"}`} ref={gridContainerRef2}>{grid2()} </div>                     
                  </div>
                  <div className={`w-1/2 ${tabIndex === 1 ? " " : "hidden"}`} ref={gridContainerRef3}>{grid3()}</div>
                  <div className={`w-4/5 ${tabIndex === 2 ? " " : "hidden"}`} ref={gridContainerRef4}>{grid4()}</div>
                  <div className={` ${tabIndex === 3 ? " " : "hidden"}`} ref={gridContainerRef5}>{grid5()}</div>
                  <div className="w-full flex space-x-2">
                     <div className={`w-1/3 ${tabIndex === 4 ? " " : "hidden"}`} ref={gridContainerRef6}>{grid6()}</div>
                     <div className={`w-2/3 ${tabIndex === 4 ? " " : "hidden"}`}>{inputDiv()} </div>
                  </div>
               </div>
         </div>
         {ModalDiv()}
         {ModalDiv2()}
      </div>
   );
};

export default Mm0601;
