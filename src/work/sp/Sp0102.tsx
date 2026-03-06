import {
   React, useEffect, useState, commas, useRef, SelectSearch, date, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, TrashIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import "tui-date-picker/dist/tui-date-picker.css";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';


interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0102 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발주관리" }, { name: "수주상세조회" }];
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
      zzWorks: [],
      zzPoBps: [],
      zzMA0001: [],
      zzMA0004: [],
      zzMA0005: [],
      zzItmes: [],
      focusKey: 0,
      searchWorkStatus :'999',
      searchWorkNm :'999',
      startDt: date(-1, 'month'),
      endDt: date(),
   });

   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const gridRef2 = useRef<any>(null);
   const gridContainerRef2 = useRef(null);

   const gridRef3 = useRef<any>(null);
   const gridContainerRef3 = useRef(null);
   
   const searchBpNmRef = useRef<HTMLInputElement>(null);
   const searchSoNoRef = useRef<HTMLInputElement>(null);

   const { fetchWithLoading } = useLoadingFetch();

   //------------------api--------------------------

   const SP0102_S01 = async (soNo: string) => {
      const param = {
         soNo: soNo || "999",
         bpNm: inputValues.searchBpNm || "999",
         startDt: inputValues.startDt || "999",
         endDt: inputValues.endDt || "999",
         poBpNm: inputValues.searchPoBpNm || "999",
         poBpCd: userInfo.bpCd,
         workNm: inputValues.searchWorkNm || "999",
         workStatus: inputValues.searchWorkStatus ,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0102_S01", { data });

      
      return result;
   };

   //------------------useEffect--------------------------
   useEffect(() => {
  
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      
   }, []);

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef2);
     
    }, [activeComp]);

   useEffect(() => {
        search();
    }, [inputValues.searchWorkStatus, inputValues.searchWorkNm]);
    

   useEffect(() => {
      if (gridRef2.current && inputValues.gridDatas2) {
         let grid = gridRef2.current.getInstance();

      
         grid.resetData(inputValues.gridDatas2);
         if (inputValues.gridDatas2.length > 0) {
            //grid.focusAt(inputValues.focusKey, 0, true);
         }

         refreshGrid(gridRef2);
      }
   }, [inputValues.gridDatas2]);

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

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await SP0102_S01(inputValues.searchSoNo);
            onInputChange("gridDatas2", result);
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };
  
   //-------------------grid----------------------------
   const columns2 = [
      { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
      { header: "수주번호", name: "soNo", width: 130, align: "center", rowSpan: true,   }, // SO_NO: 수주 번호
      { header: "구분번호", name: "soSeq", width: 120, align: "center", hidden: true }, // SO_NO: 수주 번호
      { header: "사업장", name: "bpNm", width: 220, rowSpan: false, sortable: true },
      { header: "사업장", name: "bpCd", hidden: true },
      { header: "작업명", name: "workNm", width: 170, sortable: true },
      { header: "협력업체", name: "poBpNm", width: 170, sortable: true },
      // { header: "신청일자", name: "orderDt", width: 120, align: "center", }, // ORDER_DT: 수주 일자
      { header: "요청일자", name: "reqDt", width: 80, align: "center", sortable: true }, // REQ_DT: 요청 일자
      { header: "수주상태", name: "orderStatus", width: 100, align: "center", hidden: true }, //
      { header: "진행상태", name: "workStatusNm", width: 80, align: "center",  }, //
      { header: "작업희망일", name: "hopeDt", width: 90, align: "center", sortable: true }, //
      { header: "작업요청일", name: "workReqDt", width: 90, align: "center", sortable: true }, //
      { header: "작업예정일", name: "expectDt", width: 130, align: "center", sortable: true }, //
      { header: "작업완료일", name: "finishDt", width: 90, align: "center", sortable: true }, //
      { header: "구분", name: "workDiv", width: 80, align: "center" }, // 
      // { header: "수량", name: "qty", width: 60, align: "center"}, // 
      // { header: "매출단가", name: "soPrice", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출금액", name: "soAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "공급가액", name: "soNetAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "부가세액", name: "soVatAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // { header: "발주단가", name: "poPrice", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "발주금액", name: "poAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "공급가액", name: "poNetAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "부가세액", name: "poVatAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "비고", name: "remark", width: 200, align: "center"}, // 
   
 
   ];

   const summary = {
      height: 40,
      position: 'top', 
      columnContent: {
         workDiv: {
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
         poAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         poNetAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         poVatAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
      }
   }

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">수주리스트</div>
            </div>
     
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} headerHeight={30} perPageYn={true} height={window.innerHeight - 540} summary={summary}/>
      </div>
   );
    
   //-------------------div--------------------------

   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         {/* <button type="button" onClick={del} className="bg-rose-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <TrashIcon className="w-5 h-5 mr-1" />
            삭제
         </button> */}
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
      
      </div>
   );

     //검색창 div
     const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <DateRangePickerComp 
                  title="수주일시"
                  startValue= {inputValues.startDt}
                  endValue= {inputValues.endDt}
                  onChange={(startDt, endDt) => {
                     onInputChange('startDt', startDt);
                     onInputChange('endDt', endDt);   
            }
            
            } /> 
            <InputComp title="수주번호" ref={searchSoNoRef} value={inputValues.searchSoNo} handleCallSearch={search}  onChange={(e) => onInputChange("searchSoNo", e)} />
            <InputComp title="사업장" ref={searchBpNmRef} value={inputValues.searchBpNm}   handleCallSearch={search} onChange={(e) => onInputChange("searchBpNm", e)} />

            <SelectSearch
                  title="작업명"
                  value={inputValues.searchWorkNm}
                  addData={"999"}
                  onChange={(label, value) => {
                     onInputChange("searchWorkNm", value);
                  }}
                  stringify={true}
                  param={{ coCd: "200" }}
                  procedure="ZZ_WORKS"
                  dataKey={{ label: "workNm", value: "workCd" }}
               />         
            <SelectSearch
                  title="진행상태"
                  value={inputValues.searchWorkStatus}
                  onChange={(label, value) => {
                     onInputChange("searchWorkStatus", value);
                  }}
                  addData={"999"}
                  param={{ coCd: "999", majorCode: "MA0005", div: "-999" }}
                  procedure="ZZ_CODE"
                  dataKey={{ label: "codeName", value: "code" }}
               />
            
            {userInfo.usrDiv === '999' && (
               <InputComp title="협력업체" value={inputValues.searchPoBpNm}  handleCallSearch={search} onChange={(e) => onInputChange("searchPoBpNm", e)} />
            )}
          
         </div>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto`}>
         <LoadingSpinner />
         <div className="space-y-2">
            <div className="flex justify-between ">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div> 
            <div>{searchDiv()}</div>
            <div className="flex space-x-2">
               <div className="w-full ">
                  <div>{grid2()}</div>
               </div>               
            </div>

         </div>
      </div>
   );
};

export default Sp0102;
