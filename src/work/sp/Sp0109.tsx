import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, getGridCheckedDatas2, initChoice, date, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, TrashIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import "tui-date-picker/dist/tui-date-picker.css";
import * as XLSX from "xlsx";  // 엑셀 파일 처리를 위한 라이브러리


interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0109 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발주관리" }, { name: "엑셀일괄발주" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      gridDatas2: [],
      gridDatas3: [],
      searchWorkStatus: '999'
   });
   const [selectedFile, setSelectedFile] = useState<File | null>(null); // 엑셀 파일 상태 추가
   const gridRef2 = useRef<any>(null);
   const gridRef3 = useRef<any>(null);
   const gridContainerRef2 = useRef(null);
   const gridContainerRef3 = useRef(null);

   const searchBpNmRef = useRef<HTMLInputElement>(null);
   const searchSoNoRef = useRef<HTMLInputElement>(null);

   const setGridData = async () => {
      try {
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   //------------------api--------------------------
   // 마감 저장
   const SP0109_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SP0109_U01`, data);
         return result;
      } catch (error) {
         console.error("SP0109_U01 Error:", error);
         throw error;
      }
   };

   const SP0109_S01 = async () => {
      const param = {
         startDt: inputValues.startDate || "999",
         endDt: inputValues.endDate || "999",
         workCd: inputValues.workCdS || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0109_S01", { data });

      return result;
   };

   //------------------useEffect--------------------------
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      search();
   }, []);

   useEffect(() => {
      search();
   }, [inputValues.workCdS]);


   useEffect(() => {
      if (gridRef2.current && inputValues.gridDatas2) {
         let grid = gridRef2.current.getInstance();
         grid.resetData(inputValues.gridDatas2);

         if (inputValues.gridDatas2.length > 0) {
            grid.focusAt(0, 0, true);
         }
      }
   }, [inputValues.gridDatas2]);

   useEffect(() => {
      if (gridRef3.current && inputValues.gridDatas3) {
         let grid = gridRef3.current.getInstance();
         grid.resetData(inputValues.gridDatas3);

         if (inputValues.gridDatas3.length > 0) {
            grid.focusAt(0, 0, true);
         }
      }
   }, [inputValues.gridDatas3]);


   //-------------------event--------------------------
   const getGridValues = async (status:any) => {
      let sOrder = await getGridCheckedDatas2(gridRef2);
      let workCd = inputValues.workCd;
      let poBpCd = inputValues.poBpCd;

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         workCd: workCd,
         poBpCd: poBpCd,
         status: status,
         sOrder: JSON.stringify(sOrder),
      };

      return data;
   };

   const getGridValues2 = async (status:any) => {
      let sOrder = await getGridCheckedDatas2(gridRef3);
      let workCd = inputValues.workCd;
      let poBpCd = inputValues.poBpCd;

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         workCd: workCd,
         poBpCd: poBpCd,
         status: status,
         sOrder: JSON.stringify(sOrder),
      };

      return data;
   };

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => {
         const currentValue = prevValues[name] ?? "";
         const newValue = value ?? "";

         if (currentValue === newValue) {
            return prevValues;
         }

         return {
            ...prevValues,
            [name]: newValue,
         };
      });
   };

   const search = async () => {
       const result = await SP0109_S01();
       onInputChange("gridDatas3", result);
   };

   const excel = async () => {
      document.getElementById("excelFileInput")?.click();
   };

   const save = async () => {
      if (!inputValues.workCd || inputValues.workCd.trim() === '') {
         alertSwal('작업명을 입력해 주세요.', '확인요청', 'error');
         return;
      }

      if (!inputValues.poBpCd || inputValues.poBpCd.trim() === '') {
         alertSwal('협력업체를 입력해 주세요.', '확인요청', 'error');
         return;
      }
      // 저장 기능 구현
      // 그리드에서 체크된 row 데이터 확인
      const gridInstance = gridRef2.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();

      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('일괄발주 할 데이터를 선택하시기 바랍니다.', '확인요청', 'error');
         return;
      }

      alertSwal("발주등록확인", "발주 등록 하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues('I');

            if (data) {
               let result = await SP0109_U01(data);
               if (result) {
                  await returnResult(result);
               }
            }

         } else if (result.isDismissed) {
            return;
         }
      });  
   };

   const del = async () => {
      // 그리드에서 체크된 row 데이터 확인
      const gridInstance = gridRef3.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();

      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('삭제 할 데이터를 선택하시기 바랍니다.', '확인요청', 'error');
         return;
      }

      alertSwal("발주삭제확인", "선택된 발주를 삭제 하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues2('D');

            if (data) {
               let result = await SP0109_U01(data);
               if (result) {
                  await returnResult(result);
               }
            }
 
         } else if (result.isDismissed) {
            return;
         }
      });  
   };

   const returnResult = async(result:any) => {     
      onInputChange("gridDatas2", []);
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      search();
   };

   //-------------------엑셀 파일 업로드 및 파싱--------------------------
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         setSelectedFile(file);
         importExcel(file);
      }
   };

   // 날짜 포맷을 변환하는 함수
   const formatExcelDate = (excelDate: any) => {
      // 엑셀 날짜가 숫자인 경우 날짜 포맷으로 변환
      if (typeof excelDate === "number") {
         return XLSX.SSF.format("yyyy-mm-dd", excelDate);
      }
      return excelDate; // 숫자가 아니면 그대로 반환
   };

   const importExcel = async (file: File) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
         const data = new Uint8Array(event.target?.result as ArrayBuffer);
         const workbook = XLSX.read(data, { type: "array" });
         const sheetName = workbook.SheetNames[0];
         const worksheet = workbook.Sheets[sheetName];
   
         // 첫 번째 행을 헤더로 사용하고, 두 번째 행부터 데이터를 가져옴
         const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
   
         // 첫 번째 행(헤더)은 제외하고 두 번째 행부터 데이터를 처리
         const filteredData = jsonData.slice(1).filter((row: any[]) => row[0]).map((row: any[]) => ({
            regDt: formatExcelDate(row[0]),
            addrCd1: row[1],
            addrCd2: row[2],
            erpBpCd: row[3],
            bpNm: row[4],
            _attributes: {
               checked: true,  // 각 행을 체크 상태로 설정
            },
         }));
   
         setInputValues((prevValues) => ({
            ...prevValues,
            gridDatas2: filteredData,
         }));
      };
   
      reader.readAsArrayBuffer(file);
   };

   //-------------------grid----------------------------
   const columns2 = [
      { header: "등록일", name: "regDt", width: 120, align: "center" }, // SO_NO: 발주 번호
      { header: "지본", name: "addrCd1", width: 120, align: "center" }, // SO_NO: 발주 번호
      { header: "시군지부", name: "addrCd2", width: 150 },
      { header: "코드", name: "erpBpCd", width: 150 },
      { header: "주유소명", name: "bpNm", width: 250 },
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">주문 리스트</div>
            </div>

            <div className="flex space-x-1">
               <SelectSearch
                  title="작업명"
                  value={inputValues.workCd}
                  onChange={(label, value) => {
                     onInputChange("workCd", value);
                  }}
                  minWidth="100px"
                  stringify={true}
                  param={{ coCd: "200" }}
                  procedure="ZZ_WORKS"
                  dataKey={{ label: "workNm", value: "workCd" }}
               />
               <SelectSearch
                  title="협력업체"
                  value={inputValues.poBpCd}
                  onChange={(label, value) => {
                     onInputChange("poBpCd", value);
                  }}
                  minWidth="100px"
                  stringify={true}
                  param={{ coCd: "200", bpType: "ZZ0003", bpNm: "999", bpDiv: "999" }}
                  procedure="ZZ_B_PO_BP"
                  dataKey={{ label: "bpNm", value: "bpCd" }}
               />
               <button type="button" onClick={save} className="bg-green-400 text-white rounded-3xl px-6 py-1 flex items-center shadow">
                  발주등록
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} headerHeight={30}
            perPageYn={false} rowHeaders={['checkbox','rowNum']} height={window.innerHeight - 700} />
      </div>
   );

   const columns3 = [
      { header: "등록일", name: "orderDt", width: 120, align: "center" }, 
      { header: "수주번호", name: "soNo", width: 120, align: "center" }, 
      { header: "지본", name: "addrCd1", width: 120, align: "center" }, 
      { header: "시군지부", name: "addrCd2", width: 150 },
      { header: "코드", name: "erpBpCd", width: 150, align: "center" },
      { header: "주유소명", name: "bpNm", width: 270 },
      { header: "작업명", name: "workNm", width: 270 },
      { header: "협력업체", name: "poBpNm" },
   ];

   const grid3 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">엑셀 일괄 발주 리스트</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={del} className="bg-red-400 text-white rounded-3xl px-6 py-1 flex items-center shadow">
                  발주삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef3} columns={columns3} headerHeight={30}
            perPageYn={false} rowHeaders={['checkbox','rowNum']} height={window.innerHeight - 700} />
      </div>
   );

   //-------------------div--------------------------

   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
         <input
            type="file"
            id="excelFileInput"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            onChange={handleFileChange}
         />
         <button type="button" onClick={excel} className="bg-green-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <ChevronDoubleDownIcon className="w-5 h-5 mr-1" />
            엑셀
         </button>
      </div>
   );

   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-3 search text-sm search">
         <div className="grid grid-cols-3 gap-y-3 justify-start w-[60%]">
            <DateRangePickerComp
               title="등록일시"
               startValue={inputValues.startDate}
               endValue={inputValues.endDate}
               onChange={(startDate, endDate) => {
                  onInputChange('startDate', startDate);
                  onInputChange('endDate', endDate);
               }}
            />
            <SelectSearch
               title="작업명"
               value={inputValues.workCdS}
               onChange={(label, value) => {
                  onInputChange("workCdS", value);
               }}
               stringify={true}
               param={{ coCd: "200" }}
               procedure="ZZ_WORKS"
               dataKey={{ label: "workNm", value: "workCd" }}
            />
         </div>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto h-screen`}>
         <div className="space-y-2">
            <div className="flex justify-between ">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
            <div className="flex space-x-2">
               <div className="w-full ">
                  <div>{grid2()}</div>
                  <div className="pt-4">{grid3()}</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Sp0109;
