import {
   React, useEffect, useState, commas, useRef, SelectSearch, FileUpload, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, TrashIcon, ChevronDoubleDownIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "tui-date-picker/dist/tui-date-picker.css";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';
//import { useDropzone } from "react-dropzone";
//import imageCompression from "browser-image-compression";

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
   soNo: string;
   soSeq: string;
}

const Sp0101 = ({ item, activeComp, userInfo, soNo, soSeq }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발주관리" }, { name: "완료 보고 확인" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      gridDatas1: [],
      gridDatas2: [],
      isOpen: false,
      isOpen2: false,
      confirmYn: "N",
      compSmsYn: "N",
      etcSmsYn: "N",
      coCd: "200",
      subCodeDatas: [],
      hsTypeDatas: [],
      reportFiles: [],
      photoFiles: [],
      deleteFiles: [],
      searchWorkStatus: "999",

   });

   const [files1, setFiles1] = useState<File[]>([]);
   const [files2, setFiles2] = useState<File[]>([]);

   const handleFilesChange = (newFile: File[], uploadedFiles: any, deletedFiles: any) => {
      setFiles1(newFile); // 업데이트된 파일 리스트를 저장
      onInputChange("reportFiles", uploadedFiles);
     
      const currentDeletedFiles = inputValues.deleteFiles || [];
  
      onInputChange("deleteFiles", [...currentDeletedFiles, ...deletedFiles]);
   };

   const handleFilesChange2 = (newFiles: File[], uploadedFiles: any, deletedFiles: any) => {
      setFiles2(newFiles); // 업데이트된 파일 리스트를 저장
      onInputChange("photoFiles", uploadedFiles);
     const currentDeletedFiles = inputValues.deleteFiles || [];
  
      onInputChange("deleteFiles", [...currentDeletedFiles, ...deletedFiles]);
   };

   const [errorMsgs, setErrorMsgs] = useState<{ [key: string]: string }>({});

   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const gridRef2 = useRef<any>(null);
   const gridContainerRef2 = useRef(null);

   const gridRef3 = useRef<any>(null);
   const gridContainerRef3 = useRef(null);

   const contNoRef = useRef<HTMLInputElement>(null);
   const searchItemNmRef = useRef<HTMLInputElement>(null);
   const searchBpNmRef = useRef<HTMLInputElement>(null);
   const searchSoNoRef = useRef<HTMLInputElement>(null);

   //------------------api--------------------------

   const SP0103_S04 = async (soNo: string, soSeq: string) => {
      const param = {
         soNo: soNo || "999",
         soSeq: soSeq || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0103_S04", { data });

      //console.log(result);

      return result;
   };

   const SP0103_S03 = async (soNo: string, soSeq: string) => {
      const param = {
         soNo: soNo,
         soSeq: soSeq,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0103_S03", { data });

      onInputChange("gridDatas1", result);

      return result;
   };

   const SP0107_S03 = async (soNo: string, soSeq: string) => {
      const param = {
         soNo: soNo,
         soSeq: soSeq,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0107_S03", { data });

   
      const reportFiles = result.filter((item: any) => item.programId === "report");
      const photoFiles = result.filter((item: any) => item.programId === "photo");


      onInputChange("reportFiles", reportFiles);
      onInputChange("photoFiles", photoFiles);

      return result;
   };

   const SP0103_P03 = async (soNo: string) => {
      const param = {
         soNo: soNo || "999",
         bpNm: inputValues.searchBpNm || "999",
         billBpCd: userInfo.bpCd || "999",
         workNm: inputValues.searchWorkNm || "999",
      };

      console.log("param", param);

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0103_P03", { data });

      return result;
   };

   const SP0103_P02 = async (itemNm: any) => {
      const param = {
         workCd: inputValues.workCd,
         itemNm: itemNm || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0103_P02", { data });

      return result;
   };

   //------------------useEffect--------------------------
   useEffect(() => {
      if(soNo && soSeq){
         search(soNo, soSeq);
      }
   }, [soNo, soSeq]);

   useEffect(() => {
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
   }, []);

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef);
      refreshGrid(gridRef2);
      refreshGrid(gridRef3);
    }, [activeComp]);

   useEffect(() => {
      if (gridRef.current && inputValues.gridDatas1) {
         let grid = gridRef.current.getInstance();
         grid.resetData(inputValues.gridDatas1);

         if (inputValues.gridDatas1.length > 0) {
            grid.focusAt(0, 0, true);
         }
      }
   }, [inputValues.gridDatas1]);

   useEffect(() => {
      if (gridRef2.current && inputValues.gridDatas2) {
         let grid = gridRef2.current.getInstance();

         grid.resetData(inputValues.gridDatas2);

         refreshGrid(gridRef2);
      }
   }, [inputValues.gridDatas2]);

   useEffect(() => {
      if (gridRef3.current && inputValues.gridDatas3) {
         let grid = gridRef3.current.getInstance();

         grid.resetData(inputValues.gridDatas3);

         refreshGrid(gridRef3);
      }
   }, [inputValues.gridDatas3]);

   useEffect(() => {
      if(inputValues.searchWorkStatus){
         searchModalDiv();
      }
   }, [inputValues.searchWorkStatus]); 

   //-------------------event--------------------------
   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues:any) => {
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

   const search = async (soNo: string, soSeq: string) => {
      if (!soNo || !soSeq) {
         alertSwal("발주번호를 입력해주세요.", "", "warning");
         return;
      }

      const result = await SP0103_S04(soNo, soSeq);
      SP0103_S03(soNo, soSeq);
      SP0107_S03(soNo, soSeq);


      setFiles1([]); // 단일 파일 초기화
      setFiles2([]);
      inputValues.deleteFiles = [];

      if (result) {
         Object.entries(result[0]).forEach(([key, value]) => {
            onInputChange(key, value);
         });

         onInputChange("isOpen", false);
      }
   };

   const handleDblClick = async (e: any) => {
      await fetchWithLoading(async () => {
         try {
            const gridInstance = gridRef2.current.getInstance();
            const rowData = gridInstance.getRow(e.rowKey);
            onInputChange("soSeq", rowData.soSeq);
            SP0103_S03(rowData.soNo, rowData.soSeq);
            SP0107_S03(rowData.soNo, rowData.soSeq);

            if (rowData) {
               Object.entries(rowData).forEach(([key, value]) => {
                  //console.log(key, value);
                  onInputChange(key, value);
                  });

                  onInputChange("isOpen", false);
            }
         } catch (error) {
            console.error("DblClick Error:", error);
         }
      });
   };

   const handleGridChange = (ev: any) => {
      const { columnName, rowKey, value } = ev.changes[0];
      const gridInstance = gridRef.current.getInstance();
      const rowData = gridInstance.getRow(rowKey);
   
      if (columnName === "soPrice" || columnName === "poPrice" || columnName === "qty") {
         const qty = rowData.qty;
         const soPrice = rowData.soPrice;
         const poPrice = rowData.poPrice;
   
         const soAmt = qty * soPrice;
         const soNetAmt = soAmt / 1.1;
         const soVatAmt = soAmt - soNetAmt;
   
         const poAmt = qty * poPrice;
         const poNetAmt = poAmt / 1.1;
         const poVatAmt = poAmt - poNetAmt;
   
         gridInstance.setValue(rowKey, "soAmt", Math.round(soAmt));
         gridInstance.setValue(rowKey, "soNetAmt", Math.round(soNetAmt));
         gridInstance.setValue(rowKey, "soVatAmt", Math.round(soVatAmt));
   
         gridInstance.setValue(rowKey, "poAmt", Math.round(poAmt));
         gridInstance.setValue(rowKey, "poNetAmt", Math.round(poNetAmt));
         gridInstance.setValue(rowKey, "poVatAmt", Math.round(poVatAmt));
   
         
      }
   };
   

   const searchModalDiv = async () => {
      const result = await SP0103_P03(inputValues.searchSoNo);
      onInputChange("gridDatas2", result);
   };
   const searchModalDiv2 = async () => {
      const result = await SP0103_P02(inputValues.searchItemNm);
      const updatedResult = result.map((item: any) => ({
         ...item,
         _attributes: {
            checked: true, // 체크박스를 true로 설정
         },
      }));
      onInputChange("gridDatas3", updatedResult);
   };

   const handleSoNoOnIconClick = async (e: any) => {
      onInputChange("searchSoNo", e);
      const result = await SP0103_P03(e);
      onInputChange("gridDatas2", result);
      onInputChange("isOpen", true);

      setTimeout(() => {
         searchSoNoRef.current?.focus();
         searchSoNoRef.current?.select();
      }, 100);
   };

   //-------------------grid----------------------------
   const columns = [
      { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
      { header: "발주번호", name: "soNo", width: 130, align: "center", hidden: true },
      { header: "수주 순번", name: "soSeq", width: 80, align: "center", hidden: true },
      { header: "품목 순번", name: "itemSeq", width: 100, align: "center", hidden: true },
      { header: "품목코드", name: "itemCd", width: 120, align: "center" },
      { header: "품목명", name: "itemNm", width: 250 },
      { header: "품목그룹", name: "itemGrp", width: 120, align: "center", hidden: true },
      { header: "퓸목구분", name: "itemDiv", width: 120, align: "center", hidden: true },
      { header: "작업코드", name: "workCd", width: 250, align: "center", hidden: true },
      {
         header: "수량",
         name: "qty",
         width: 60,
         align: "right",
         editor: "text",
         formatter: function (e: any) {
            return commas(e.value);
         },
      }, // QTY: 수량
      {
         header: "금액",
         name: "soAmt",
         width: 120,
         align: "right",
         formatter: function (e: any) {
            return commas(e.value);
         },
      }, // SO_AMT: 수주 금액
      {
         header: "공급가액",
         name: "soNetAmt",
         width: 120,
         align: "right",
         formatter: function (e: any) {
            return commas(e.value);
         },
      }, // SO_NET_AMT: 수주 순 금액
      {
         header: "부가세",
         name: "soVatAmt",
         width: 120,
         align: "right",
         formatter: function (e: any) {
            return commas(e.value);
         },
      }, // SO_VAT_AMT: 수주 부가세      
      {
         header: "부가세",
         name: "poVatAmt",
         width: 120,
         align: "right",
         formatter: function (e: any) {
            return commas(e.value);
         },
      }, // PO_VAT_AMT: 발주 부가세
      { header: "비고", name: "remark", editor: "text" }, // REMARK: 비고
   ];

   const summary = {
      height: 40,
      position: 'top', 
      columnContent: {
         poPrice: {
            template: (e:any) => {
                return `합계 : `;
            }
         },
         soAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         soNetAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         soVatAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },            
      }
   }

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">품목리스트</div>
            </div>
            <div className="flex items-center justify-end w-full">
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} summary={summary} headerHeight={30} handleFocusChange={() => {}} handleAfterChange={handleGridChange} perPageYn={false} height={window.innerHeight - 750} />
      </div>
   );

   const columns2 = [
      { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
      { header: "발주번호", name: "soNo", width: 150, align: "center", rowSpan: false }, // SO_NO: 수주 번호
      { header: "구분번호", name: "soSeq", width: 120, align: "center", hidden: true }, // SO_NO: 수주 번호
      { header: "사업장", name: "bpNm", width: 300, rowSpan: false },
      { header: "사업장", name: "bpCd", width: 300, hidden: true },
      { header: "작업명", name: "workCd", width: 250, hidden: true },
      { header: "작업명", name: "workNm", width: 250 },
      { header: "신청일자", name: "orderDt", width: 120, align: "center" }, // ORDER_DT: 수주 일자
      { header: "요청일자", name: "reqDt", width: 120, align: "center" }, // REQ_DT: 요청 일자
      { header: "진행상태", name: "workStatus", width: 100, align: "center" }, //
      { header: "수량", name: "qty", width: 100, align: "center", hidden: true }, //
      { header: "구분", name: "workDiv", width: 100, align: "center", hidden: true }, //
      { header: "비고", name: "remark", width: 100, align: "center", hidden: true }, //
      { header: "비고", name: "remark2", width: 100, align: "center", hidden: true }, //
      { header: "확정여부", name: "cfmFlag", width: 100, align: "center", hidden: true }, //
      { header: "확정여부", name: "cfmFlag2", width: 100, align: "center", hidden: true }, //
      { header: "확정여부", name: "cfmFlag3", width: 100, align: "center", hidden: true }, //
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <TuiGrid01 gridRef={gridRef2} columns={columns2} headerHeight={30} handleFocusChange={() => {}} handleDblClick={handleDblClick} perPageYn={false} height={window.innerHeight - 640} />
      </div>
   );

   //-------------------div--------------------------

   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         {/* <button type="button" onClick={del} className="bg-rose-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <TrashIcon className="w-5 h-5 mr-1" />
            삭제
         </button> */}
         <button type="button" onClick={() => search(inputValues.soNo, inputValues.soSeq)} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>       
      </div>
   );

   const div1 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full text-sm">
         <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">발주정보</div>
            </div>
         </div>
         <div className="space-y-2 w-[70%]">
            <div className="grid grid-cols-4 gap-y-2 justify-start ">
               <InputSearchComp title="발주번호" value={inputValues.soNo} readOnly={true} onChange={(e) => onInputChange("soNo", e)} onIconClick={handleSoNoOnIconClick} />
               <InputComp title="진행상태" value={inputValues.workStatus} readOnly={true} onChange={(e) => onInputChange("workStatus", e)} />
               <InputComp title="작업명" value={inputValues.workNm} readOnly={true} onChange={(e) => onInputChange("workNm", e)} />
               <InputComp title="사업장" value={inputValues.bpNm} readOnly={true} onChange={(e) => onInputChange("bpNm", e)} />
               <InputComp title="수량" value={inputValues.qty} type="number" readOnly={true} onChange={(e) => onInputChange("qty", e)} />
               <InputComp title="구분" value={inputValues.workDiv} readOnly={true} onChange={(e) => onInputChange("workDiv", e)} />
            </div>
            <div className="flex justify-between w-full">
               <div className="w-5/6">
                  <TextArea title="비고" value={inputValues.remarkDtl} readonly={true} onChange={(e) => onInputChange("remarkDtl", e)} layout="flex" minWidth="90px" />
               </div>
            </div>
         </div>
      </div>
   );

   const div2 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full text-sm">
         <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">완료정보등록</div>
            </div>
         </div>

         <div className="flex space-x-8">
            <div className="space-y-2 w-[60%]">
               <div className="grid grid-cols-3 gap-y-2 justify-start ">
                  <DatePickerComp
                     title="작업요청일"
                     value={inputValues.workReqDt}
                     onChange={(e) => {
                        onInputChange("workReqDt", e);
                     }}
                     readonly={true}
                  />

                  <DatePickerComp
                     title="작업예정일"
                     value={inputValues.expectDt}
                     onChange={(e) => {
                        onInputChange("expectDt", e);
                     }}
                     readonly={true}
                  />

                  <DatePickerComp
                     title="작업완료일"
                     value={inputValues.finishDt}
                     onChange={(e) => {
                        onInputChange("finishDt", e);
                     }}
                     readonly={true}
                  />
               </div>
               <div className="flex justify-between w-full">
                  <div className="w-full">
                     <TextArea title="비고" value={inputValues.remarkDtl2} readonly={true} onChange={(e) => onInputChange("remarkDtl2", e)} layout="flex" minWidth="90px" />
                  </div>
                  <div className="w-full">
                     <TextArea title="현장비고" value={inputValues.remarkDtl3} readonly={true} onChange={(e) => onInputChange("remarkDtl3", e)} layout="flex" minWidth="90px" />
                  </div>
               </div>
            </div>
            <div>
               <Checkbox title="최종완료확인" value={inputValues.cfmFlag2} 
               readOnly={true}
               />
            </div> 
            <div>
               <Checkbox title="관리역확인" value={inputValues.cfmFlag3} 
               readOnly={true}
               />
            </div> 
         </div>

         <div className="grid grid-cols-2 w-[80%]">
            <FileUpload value={files1} uploadedFiles={inputValues.reportFiles} title="완료보고서" minWidth="90px" layout="flex" multiple={true} onFilesChange={handleFilesChange} />

            <FileUpload value={files2} uploadedFiles={inputValues.photoFiles} title="사진등록" minWidth="90px" layout="flex" multiple={true} onFilesChange={handleFilesChange2} />
         </div>
      </div>
   );
   const modalDiv = () => (
      <div className="space-y-3">
         <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
            <div className="w-full flex justify-between">
               <div className="grid grid-cols-3 gap-y-2  justify-start ">
                  <InputComp title="발주번호" ref={searchSoNoRef} value={inputValues.searchSoNo} handleCallSearch={searchModalDiv} onChange={(e) => onInputChange("searchSoNo", e)} />
                  <InputComp title="사업장" ref={searchBpNmRef} value={inputValues.searchBpNm} handleCallSearch={searchModalDiv} onChange={(e) => onInputChange("searchBpNm", e)} />
                  <InputComp title="작업명" value={inputValues.searchWorkNm} handleCallSearch={searchModalDiv} onChange={(e) => onInputChange("searchWorkNm", e)} />

                  <SelectSearch
                     title="진행상태"
                     value={inputValues.searchWorkStatus}
                     onChange={(label, value) => {
                        onInputChange("searchWorkStatus", value);
                     
                     }}
                     datas={inputValues.zzMA0005}
                     
                  />
               </div>
               <div className="w-[20%] flex justify-end h-8">
                  <button type="button" onClick={searchModalDiv} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                     <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                     조회
                  </button>
               </div>
            </div>
         </div>
         <div>{grid2()}</div>
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
            <div className="flex space-x-3">
               <div className="w-full">{div1()}</div>
            </div>

            <div>{grid()}</div>

            <div className="flex space-x-3">
               <div className="w-full">{div2()}</div>
            </div>
         </div>
         <CommonModal
            isOpen={inputValues.isOpen}
            size="xl"
            onClose={() => {
               onInputChange("isOpen", false);
               contNoRef.current?.focus();
            }}
            title=""
         >
            <div>{modalDiv()}</div>
         </CommonModal>
      </div>
   );
};

export default Sp0101;
