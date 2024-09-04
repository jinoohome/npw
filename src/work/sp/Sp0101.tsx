import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, TrashIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import "tui-date-picker/dist/tui-date-picker.css";
import DatePicker from "tui-date-picker";
import { on } from "events";
import { set } from "date-fns";
import { Input, Label } from "@headlessui/react";
import ChoicesEditor from "../../util/ChoicesEditor";
import { ZZ0101_S02_API } from "../../ts/ZZ0101_S02";

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0101 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "기준정보" }, { name: "계약관리" }, { name: "계약등록" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
       gridDatas1: [],
       gridDatas2: [],
       isOpen: false,
       isOpen2: false,
       confirmYn: "N",
       compSmsYn: "N",
       etcSmsYn: "N",
       coCd: '200',
       subCodeDatas: [],
       hsTypeDatas: [],
       zzWorks : [],
       zzPoBps : [],
       zzMA0004 : [],
       zzMA0005 : [],
   });

   const [errorMsgs, setErrorMsgs] = useState<{ [key: string]: string }>({});

   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const gridRef2 = useRef<any>(null);
   const gridContainerRef2 = useRef(null);

   const bpNmRef = useRef<HTMLInputElement>(null);
   const contNoRef = useRef<HTMLInputElement>(null);
   const searchBpNmRef = useRef<HTMLInputElement>(null);
   const searchSoNoRef = useRef<HTMLInputElement>(null);
   const hsTypeRef = useRef<any>(null);
   const subCodeRef = useRef<any>(null);
   const contTypeRef = useRef<any>(null);
   const payCondRef = useRef<any>(null);
   const chargeDeptRef = useRef<any>(null);


   const setGridData = async () => {
    try {
        ZZ_WORKS();
        ZZ_B_PO_BP();
        ZZ_CODE('MA0004');
      
    } catch (error) {
    console.error("setGridData Error:", error);
    }
};


   //------------------api--------------------------

   const SP0101_S01 = async (soNo: string) => {
       const param = {
           soNo: soNo || '999',
       };

       const data = JSON.stringify(param);
       const result = await fetchPost("SP0101_S01", { data });

       return result;
   };

   const SP0101_S02 = async (soNo: string) => {
       const param = {
           soNo: soNo,
       };

       

       const data = JSON.stringify(param);
       const result = await fetchPost("SP0101_S02", { data });

       

       onInputChange("gridDatas1", result);

       return result;
   };

   const SP0101_P01 = async (soNo: string) => {
       const param = {
           soNo: soNo || '999',
           bpNm: inputValues.searchBpNm || '999',
           startDt: inputValues.startDt || '999',
           endDt: inputValues.endDt || '999',
       };

       

       const data = JSON.stringify(param);
       const result = await fetchPost("SP0101_P01", { data });

       

       return result;
   };


const ZZ_WORKS = async () => {   
    const param = {
        coCd: '200',
    };

    const data = JSON.stringify(param);
    const result = await fetchPost("ZZ_WORKS", { data });


    const formattedResult = result.map((item: any) => ({
        value: item.workCd,
        text: item.workNm
    }));

    
    onInputChange("zzWorks", formattedResult);

    return formattedResult;
};

const ZZ_B_PO_BP = async () => {   
    const param = {
        coCd: '200',
        bpDiv: '999',
        bpType: 'ZZ0003',
        bpNm: '999',
    };

    const data = JSON.stringify(param);
    const result = await fetchPost("ZZ_B_PO_BP", { data });


    const formattedResult = result.map((item: any) => ({
        value: item.bpCd,
        text: item.bpNm
    }));

    

    
    onInputChange("zzPoBps", formattedResult);

    return formattedResult;
};
const ZZ_CODE = async (majorCode:any) => {   
    const param={ 
        coCd: "999", 
        majorCode: majorCode, 
        div: "999" 
    };


    const result = await fetchPost("ZZ_CODE", param);

    
    const formattedResult = result.map((item: any) => ({
        value: item.code,
        text: item.codeName
    }));

    if(majorCode === 'MA0004') onInputChange("zzMA0004", formattedResult);
    
    

    return formattedResult;
};

useEffect(() => {

    if (inputValues.zzWorks) {
       let gridInstance = gridRef.current.getInstance();
       let column = gridInstance.getColumn("workCd");
       let zzWorks = inputValues.zzWorks.filter((item:any) => item.value !== "999");
       column.editor.options.listItems = zzWorks;
       gridInstance.refreshLayout();
    }
 }, [inputValues.zzWorks]);
 
useEffect(() => {

    if (inputValues.zzPoBps) {
       let gridInstance = gridRef.current.getInstance();
       let column = gridInstance.getColumn("poBpCd");
       let zzPoBps = inputValues.zzPoBps.filter((item:any) => item.value !== "999");
       column.editor.options.listItems = zzPoBps;
       gridInstance.refreshLayout();
    }
 }, [inputValues.zzPoBps]);
 
useEffect(() => {

    if (inputValues.zzMA0004) {
       let gridInstance = gridRef.current.getInstance();
       let column = gridInstance.getColumn("workDiv");
       let zzMA0004 = inputValues.zzMA0004.filter((item:any) => item.value !== "999");
       column.editor.options.listItems = zzMA0004;
       gridInstance.refreshLayout();
    }
 }, [inputValues.zzMA0004]);

 

   //------------------useEffect--------------------------
   useEffect(() => {
        setGridData();
       reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
       reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });

      
   }, []);

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
        
           if (inputValues.gridDatas2.length > 0) {
               grid.focusAt(0, 0, true);
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


   const addGridRow = () => {
      if(!inputValues.bpCd) 
        return alertSwal("사업장을 선택해주세요.", "error", "error");   

       let grid = gridRef.current.getInstance();
       grid.appendRow({ useYn: "Y", coCd: "200",soNo : inputValues.soNo, workStatus : 'MA0001'}, {focus: true} );

       
   };

   //grid 삭제버튼
   const delGridRow = () => {
       let grid = gridRef.current.getInstance();
       const { rowKey } = grid.getFocusedCell();
       grid.removeRow(rowKey, {});
   };

   const validateData = (action: string, dataString: any) => {
       // dataString이 문자열이면 JSON.parse()를 사용, 그렇지 않으면 직접 사용
       const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;
       let result = true;

       if (action === "save") {
           if (data.length < 1) return false;

           for (const item of data) {
               if (["U", "I"].includes(item.status)) {
                   // 필요한 유효성 검사를 여기서 수행
               }
           }
       }

       if (!result) {
           alertSwal("필수입력항목을 확인해주세요.", "error", "error");
       } else {
           return result;
       }
   };

   const search = async () => {
       const result = await SP0101_S01(inputValues.soNo);
        

       if (result.length == 1) {
           Object.entries(result[0]).forEach(([key, value]) => {
               onInputChange(key, value);
           });
       }
   };

   const save = async () => {
       let datas = await getGridDatas(gridRef);
       
       inputValues.gridDatas = datas;
       inputValues.soNo ? inputValues.status = 'U' : inputValues.status = 'I';
      

       let data = {
            oilSoHdr: JSON.stringify(inputValues),
            oilSoDtl: JSON.stringify(inputValues.gridDatas),
            menuId: activeComp.menuId,
            insrtUserId: userInfo.usrId,
       };


        const result = await fetchPost(`SP0101_U03`, data);
    //    returnResult(result);
   };

   const del = async () => {
       let datas = await getGridCheckedDatas(gridRef);
       inputValues.gridDatas4 = datas;
       inputValues.status = 'D';
       let data = {
           contHdr: JSON.stringify(inputValues),
           contDtl: JSON.stringify(inputValues.gridDatas4),
           menuId: activeComp.menuId,
           insrtUserId: userInfo.usrId,
       };

       const result = await fetchPost(`MM0602_U03`, data);
       returnResult(result);
   };

   const returnResult = async (result: any) => {
       alertSwal(result.msgText, result.msgCd, result.msgStatus);
       if (result.msgCd === "1") {
           if (inputValues.status === 'D') {
               // 삭제 처리 후 초기화
           } else {
               inputValues.contNo = result.contNoOut;
               search();
           }
       }
   };

   const handleDblClick = async (e: any) => {
       const gridInstance = gridRef2.current.getInstance();
       const rowData = gridInstance.getRow(e.rowKey);
       SP0101_S02(rowData.soNo);



       if (rowData) {
           Object.entries(rowData).forEach(([key, value]) => {
               onInputChange(key, value);
           });

           onInputChange("isOpen", false);
       }
   };

   const searchModalDiv = async () => {
       
       const result = await SP0101_P01(inputValues.searchSoNo);
       onInputChange("gridDatas2", result);
   }

   const handleSoNoOnKeyDown = async (e: any) => {
       const target = e.target as HTMLInputElement;
       onInputChange("soNo", target.value);
       onInputChange("searchSoNo", target.value);

       const result = await SP0101_S01(target.value);
       const result2 = await SP0101_S02(target.value);
       onInputChange("gridDatas1", result2);

       if (result.length === 1) {
           Object.entries(result[0]).forEach(([key, value]) => {
               onInputChange(key, value);
           });
       } else {
           onInputChange("isOpen", true);
       }
   }

   const handleSoNoOnIconClick = async (e: any) => {
       onInputChange("searchSoNo", e);
       const result = await SP0101_P01(e);
       onInputChange("gridDatas2", result);
       onInputChange("isOpen", true);
   }

   //-------------------grid----------------------------
   const columns = [
       { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
       { header: "계약번호", name: "soNo", hidden: true }, // SO_NO: 수주 번호
       { header: "순번", name: "soSeq", width: 80, align: "center",  hidden: true }, // SO_SEQ: 수주 순번
       { header: "작업코드", name: "workCd", width: 170, align: "center",
       formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: inputValues.zzWorks  } } 
        }, // WORK_CD: 작업 코드
       
       { header: "협력업체", name: "poBpCd", width: 180, align: "center",
       formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: inputValues.zzPoBps  } } 
        }, // PO_BP_CD: 발주처 코드
       { header: "희망일", name: "hopeDt", width: 120, align: "center",    
        editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },  
       { header: "요청일", name: "reqDt", width: 120, align: "center" ,
       editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },  
       { header: "예정일", name: "expectDt", width: 120, align: "center",
       editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },  
       { header: "완료일", name: "finishDt", width: 120, align: "center",
       editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },  
       { header: "수량", name: "qty", width: 80, align: "right", editor: 'text',
           formatter: function (e: any) { if (e.value) { return commas(e.value); } }
       }, // QTY: 수량
       { header: "작업구분", name: "workDiv", width: 100, align: "center",
       formatter: "listItemText", editor: { type: ChoicesEditor, options: { listItems: inputValues.zzMM0001  } } 
       }, 
       { header: "작업유형", name: "workType", width: 100, align: "center", hidden: true }, // WORK_TYPE: 작업 유형
       { header: "진행상태", name: "workStatus", width: 100, align: "center",  hidden: true}, // WORK_STATUS: 작업 상태
       { header: "진행상태", name: "workStatusNm", width: 100, align: "center"}, // WORK_STATUS: 작업 상태
       { header: "비고", name: "remark", editor: 'text' }, // REMARK: 비고
   ];

   const grid = () => (
       <div className="border rounded-md p-2 space-y-2 w-full">
           <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                   <div>
                       <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                   </div>
                   <div className="min-w-[100px]">작업리스트</div>
               </div>
               <div className="flex items-center justify-end w-full">
                   <div className="flex pt-2 space-x-2">
                       <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                           <PlusIcon className="w-5 h-5" />
                           추가
                       </button>
                       <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                           <MinusIcon className="w-5 h-5" />
                           삭제
                       </button>
                   </div>
               </div>
           </div>

           <TuiGrid01 gridRef={gridRef} columns={columns} headerHeight={30}
               handleFocusChange={() => { }} perPageYn={false} height={window.innerHeight } />
       </div>
   );

   const columns2 = [
       { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
       { header: "수주번호", name: "soNo", width: 120, align: "center" }, // SO_NO: 수주 번호
       { header: "고객사", name: "bpNmS", width: 300 }, // BP_NM_S: 고객사 (BP 코드와 이름의 조합)
       { header: "수주일자", name: "orderDt", width: 120, align: "center" }, // ORDER_DT: 수주 일자
       { header: "요청일자", name: "reqDt", width: 120, align: "center" }, // REQ_DT: 요청 일자
       { header: "수주상태", name: "orderStatus", width: 100, align: "center", hidden: true  }, // ORDER_STATUS: 수주 상태
       { header: "수주상태", name: "orderStatusNm", width: 100, align: "center" }, // ORDER_STATUS: 수주 상태
       { header: "요청자", name: "reqUserId", width: 100, align: "center",  hidden: true }, // REQ_USER_ID: 요청자 ID
       { header: "연락처", name: "reqTelNo", width: 150, align: "center" }, // REQ_TEL_NO: 요청자 연락처
       { header: "주소코드1", name: "addrCd1", hidden: true }, // ADDR_CD1: 주소 코드 1
       { header: "주소코드2", name: "addrCd2", hidden: true }, // ADDR_CD2: 주소 코드 2
       { header: "비고", name: "remark", width: 300 } // REMARK: 비고
   ];

   const grid2 = () => (
       <div className="border rounded-md p-2 space-y-2 w-full">
           <TuiGrid01 gridRef={gridRef2} columns={columns2} headerHeight={30}
               handleFocusChange={() => { }} handleDblClick={handleDblClick}
               perPageYn={false} height={window.innerHeight - 640} />
       </div>
   );

   //-------------------div--------------------------

   const buttonDiv = () => (
       <div className="flex justify-end space-x-2">
           <button type="button" onClick={del} className="bg-rose-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
               <TrashIcon className="w-5 h-5 mr-1" />
               삭제
           </button>
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

   const div1 = () => (
       <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
           <div className="space-y-2 w-[60%]">
               <div className="grid grid-cols-3 gap-y-2 justify-start ">
                   <InputSearchComp title="수주번호"
                       value={inputValues.soNo}
                       readOnly={true}
                       onChange={(e) => onInputChange("soNo", e)}
                       onKeyDown={handleSoNoOnKeyDown}
                       onIconClick={handleSoNoOnIconClick} />

                    <SelectSearch
                       title="진행상태"
                       value={inputValues.orderStatus}
                       onChange={(label, value) => {
                           onInputChange("orderStatus", value);
                       }}

                       param={{ coCd: "999", majorCode: "MA0001", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}
                       readonly={true}
                   /> 

                   
                    {/* <InputComp title="진행상태"
                       value={inputValues.orderStatus}
                       onChange={(e) => onInputChange("orderStatus", e)}
                       readOnly={true}
                   /> */}

                   <DatePickerComp
                       title="신청일자"
                       value={inputValues.reqDt}
                       onChange={(e) => {
                           onInputChange("reqDt", e);
                       }}
                   />

                   <SelectSearch
                       title="사업장"
                       value={inputValues.bpCd}
                       onChange={(label, value) => {
                           onInputChange("bpCd", value);
                       }}

                       stringify={true}
                       param={{ coCd: "200",bpType : "ZZ0002", bpNm : '999', bpDiv: '999' }}
                       procedure="ZZ_B_PO_BP"
                       dataKey={{ label: "bpNm", value: "bpCd" }}
                   />

                   <InputComp title="신청담당자"
                       value={inputValues.reqUserId}
                       onChange={(e) => onInputChange("reqUserId", e)}
                   />

                   <InputComp title="연락처"
                       value={inputValues.reqTelNo}
                       onChange={(e) => onInputChange("reqTelNo", e)}
                   />

                   <SelectSearch
                       title="지본"
                       value={inputValues.addrCd1}
                       onChange={(label, value) => {
                           onInputChange("addrCd1", value);
                       }}

                       param={{ coCd: "999", majorCode: "MA0002", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
                   <SelectSearch
                       title="시군지부"
                       value={inputValues.addrCd2}
                       onChange={(label, value) => {
                           onInputChange("addrCd2", value);
                       }}
                       param={{ coCd: "999", majorCode: "MA0003", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               </div>
               <div>
                   <TextArea title="비고" value={inputValues.remark}
                       onChange={(e) => onInputChange("remark", e)}
                       layout="flex" minWidth="102px"
                   />
               </div>
           </div>
       </div>
   );

   const modalDiv = () => (
       <div className="space-y-3">
           <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
               <div className="w-full flex justify-between">
                   <div className="grid grid-cols-3  justify-start ">
                       <InputComp title="수주번호" ref={searchSoNoRef} value={inputValues.searchSoNo}
                           handleCallSearch={searchModalDiv} onChange={(e) => onInputChange('searchSoNo', e)}
                       />

                       <InputComp title="고객사" ref={searchBpNmRef} value={inputValues.searchBpNm}
                           handleCallSearch={searchModalDiv} onChange={(e) => onInputChange('searchBpNm', e)} />

                       <DateRangePickerComp
                           title="신청기간"
                           startValue={inputValues.startDt}
                           endValue={inputValues.endDt}
                           onChange={(startDate, endDate) => {
                               onInputChange("startDt", startDate);
                               onInputChange("endDt", endDate);
                           }}
                       />
                   </div>
                   <div className="w-[20%] flex justify-end">
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
       <div className={`space-y-5 overflow-y-hidden h-screen`}>
           <div className="space-y-2">
               <div className="flex justify-between">
                   <Breadcrumb items={breadcrumbItem} />
                   {buttonDiv()}
               </div>
               <div className="flex space-x-3">
                   <div className="w-full">{div1()}</div>
               </div>

               <div>{grid()}</div>
           </div>
           <CommonModal isOpen={inputValues.isOpen} size="lg" onClose={() => { onInputChange("isOpen", false); contNoRef.current?.focus() }} title="">
               <div>{modalDiv()}</div>
           </CommonModal>

       </div>
   );
};

export default Sp0101;
