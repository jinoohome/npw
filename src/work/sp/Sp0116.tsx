import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, DocumentTextIcon, PaperClipIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import "tui-date-picker/dist/tui-date-picker.css";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';
import moment from "moment";
import "moment/locale/ko";

moment.locale("ko");

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0116 = ({ item, activeComp, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발주관리" }, { name: "영업일지 조회" }];

   // 관리역 여부 확인 (usrDiv가 'ZZ0220'이면 관리역)
   const isManager = userInfo?.usrDiv === "ZZ0220";

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      gridDatas1: [],
      fileDatas: [],
      coCd: "200",
      usrId: isManager ? userInfo?.usrId : "999",
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().format("YYYY-MM-DD"),
      // 상세보기 모달
      isOpen: false,
      selectedLog: null,
   });

   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   //------------------api--------------------------
   const SP0116_S01 = async () => {
      const param = {
         coCd: inputValues.coCd,
         usrId: inputValues.usrId || "999",
         startDt: inputValues.startDt || "999",
         endDt: inputValues.endDt || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0116_S01", { data });

      return result;
   };

   // 파일 목록 조회
   const SP0116_S02 = async (logId: number) => {
      const param = {
         logId: logId,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0116_S02", { data });

      return result;
   };

   //------------------useEffect--------------------------
   useEffect(() => {
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   useEffect(() => {
      refreshGrid(gridRef);
   }, [activeComp]);

   // 검색조건 변경 시 자동 조회
   useEffect(() => {
      if (inputValues.startDt && inputValues.endDt) {
         search();
      }
   }, [inputValues.usrId, inputValues.startDt, inputValues.endDt]);

   useEffect(() => {
      if (gridRef.current && inputValues.gridDatas1) {
         let grid = gridRef.current.getInstance();
         grid.resetData(inputValues.gridDatas1);

         if (inputValues.gridDatas1.length > 0) {
            grid.focusAt(0, 0, true);
         }
      }
   }, [inputValues.gridDatas1]);

   //-------------------event--------------------------
   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues: any) => {
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
      await fetchWithLoading(async () => {
         try {
            const result = await SP0116_S01();
            onInputChange("gridDatas1", result);
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   // 상세보기 모달 열기
   const openDetailModal = async (rowData: any) => {
      if (rowData) {
         // 파일 목록 조회
         const files = await SP0116_S02(rowData.logid);
         onInputChange("fileDatas", files || []);
         onInputChange("selectedLog", rowData);
         onInputChange("isOpen", true);
      }
   };

   // 그리드 더블클릭 - 상세보기
   const handleDblClick = async (e: any) => {
      const gridInstance = gridRef.current.getInstance();
      const rowData = gridInstance.getRow(e.rowKey);
      openDetailModal(rowData);
   };

   // 그리드 클릭 - 첨부 셀 클릭 시 상세보기
   const handleClick = async (e: any) => {
      if (e.columnName === "filecnt") {
         const gridInstance = gridRef.current.getInstance();
         const rowData = gridInstance.getRow(e.rowKey);
         openDetailModal(rowData);
      }
   };

   // 파일 미리보기
   const handleFilePreview = (file: any) => {
      const fileFullPath = `https://fnr.nhp.co.kr:8443/files/${file.filePath}/${file.saveFileNm}`;
      window.open(fileFullPath, '_blank');
   };

   // 파일 다운로드
   const handleFileDownload = async (file: any) => {
      await fetchWithLoading(async () => {
         try {
            const param = { fileId: file.fileId };
            const baseURL = process.env.REACT_APP_API_URL;

            const response = await fetch(`${baseURL}/SP0116_FILE`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(param),
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.fileNm;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
         } catch (error) {
            console.error("파일 다운로드 오류:", error);
         }
      });
   };

   //-------------------grid----------------------------
   const columns = [
      { header: "로그ID", name: "logid", hidden: true },
      { header: "회사코드", name: "cocd", hidden: true },
      { header: "사용자ID", name: "usrid", hidden: true },
      { header: "작성일자", name: "logdt", width: 120, align: "center" },
      { header: "성명", name: "usrnm", width: 100, align: "center" },
      { header: "작업내용", name: "content", width: 450 },
      { header: "비고", name: "remark", width: 200 },
      {
         header: "첨부",
         name: "filecnt",
         width: 80,
         align: "center",
         formatter: (e: any) => {
            if (e.value > 0) {
               return `<span class="text-blue-500">${e.value}건</span>`;
            }
            return "";
         }
      },
      { header: "등록일시", name: "regdt", width: 180, align: "center" },
   ];

   const grid = () => (
      <div ref={gridContainerRef} className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <DocumentTextIcon className="w-5 h-5 "></DocumentTextIcon>
               </div>
               <div className="min-w-[100px]">영업일지 목록</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} headerHeight={30} handleFocusChange={() => {}} handleClick={handleClick} handleDblClick={handleDblClick} perPageYn={false} height={window.innerHeight - 300} />
      </div>
   );

   //-------------------div--------------------------
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
      </div>
   );

   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3 gap-4 justify-start w-[80%]">
            <SelectSearch
               title="관리역"
               value={inputValues.usrId}
               addData={isManager ? "" : "999"}
               onChange={(label, value) => {
                  onInputChange("usrId", value);
               }}
               stringify={true}
               param={{ coCd: "200" }}
               procedure="SP0113_S02"
               dataKey={{ label: "usrnm", value: "usrid" }}
               readonly={isManager}
            />
            <div className="col-span-2">
               <DateRangePickerComp
                  title="조회기간"
                  startValue={inputValues.startDt}
                  endValue={inputValues.endDt}
                  onChange={(start, end) => {
                     onInputChange("startDt", start);
                     onInputChange("endDt", end);
                  }}
               />
            </div>
         </div>
      </div>
   );

   // 상세보기 모달
   const detailModal = () => (
      <div className="space-y-4">
         {inputValues.selectedLog && (
            <>
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                     <span className="font-semibold">작성일자:</span> {inputValues.selectedLog.logdt}
                  </div>
                  <div>
                     <span className="font-semibold">작성자:</span> {inputValues.selectedLog.usrnm}
                  </div>
               </div>
               <div className="text-sm">
                  <span className="font-semibold">작업내용:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap min-h-[100px]">
                     {inputValues.selectedLog.content || "-"}
                  </div>
               </div>
               <div className="text-sm">
                  <span className="font-semibold">비고:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                     {inputValues.selectedLog.remark || "-"}
                  </div>
               </div>
               {inputValues.fileDatas && inputValues.fileDatas.length > 0 && (
                  <div className="text-sm">
                     <span className="font-semibold">첨부파일:</span>
                     <div className="mt-2 space-y-2">
                        {inputValues.fileDatas.map((file: any, index: number) => (
                           <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100">
                              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleFilePreview(file)}>
                                 <PaperClipIcon className="w-4 h-4 text-gray-500" />
                                 <span className="text-blue-600 hover:underline">{file.fileNm}</span>
                                 <span className="text-gray-400 text-xs">({Math.round(file.fileSize / 1024)}KB)</span>
                              </div>
                              <button
                                 onClick={() => handleFileDownload(file)}
                                 className="bg-sky-500 rounded-md shadow p-1 hover:bg-sky-600"
                                 title="다운로드"
                              >
                                 <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </>
         )}
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto h-full work-scroll `}>
         <LoadingSpinner />
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
            <div>{grid()}</div>
         </div>
         <CommonModal
            isOpen={inputValues.isOpen}
            size="lg"
            onClose={() => {
               onInputChange("isOpen", false);
               onInputChange("selectedLog", null);
               onInputChange("fileDatas", []);
            }}
            title="영업일지 상세"
         >
            {detailModal()}
         </CommonModal>
      </div>
   );
};

export default Sp0116;
