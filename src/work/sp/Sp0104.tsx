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

const Sp0104 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발관리" }, { name: "발주조회" }];
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
      searchWorkStatus :'999'
   });

   const [errorMsgs, setErrorMsgs] = useState<{ [key: string]: string }>({});

   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const gridRef2 = useRef<any>(null);
   const gridContainerRef2 = useRef(null);

   const gridRef3 = useRef<any>(null);
   const gridContainerRef3 = useRef(null);
   


   const bpNmRef = useRef<HTMLInputElement>(null);
   const contNoRef = useRef<HTMLInputElement>(null);
   const searchItemNmRef = useRef<HTMLInputElement>(null);
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
         ZZ_CODE("MA0004");
         ZZ_CODE("MA0005");
         ZZ_ITEMS();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   //------------------api--------------------------

   const SP0103_S01 = async (soNo: string, soSeq : string) => {
      const param = {
         soNo: soNo || "999",
         soSeq : soSeq || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0103_S01", { data });

      return result;
   };

   const SP0103_S02 = async (soNo: string, soSeq: string) => {
      const param = {
         soNo: soNo,
         soSeq: soSeq,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0103_S02", { data });

      
      onInputChange("gridDatas1", result);

      return result;
   };

   const SP0102_S01 = async (soNo: string) => {
      const param = {
         soNo: soNo || "999",
         bpNm: inputValues.searchBpNm || "999",
         startDt: inputValues.startDt || "999",
         endDt: inputValues.endDt || "999",
         poBpNm: inputValues.searchPoBpNm || "999",
         poBpCd: userInfo.coCd,
         workNm: inputValues.searchWorkNm || "999",
         workStatus: inputValues.searchWorkStatus ,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0102_S01", { data });

      
      return result;
   };

   const SP0103_P02 = async (itemNm : any) => {
      const param = {
         workCd: inputValues.workCd,
         itemNm : itemNm || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0103_P02", { data });

      
      return result;
   };

   const ZZ_WORKS = async () => {
      const param = {
         coCd: "200",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_WORKS", { data });

      const formattedResult = result.map((item: any) => ({
         value: item.workCd,
         text: item.workNm,
      }));

      onInputChange("zzWorks", formattedResult);

      return formattedResult;
   };

   const ZZ_ITEMS = async () => {
      const param = {
         coCd: "200",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_ITEMS", { data });

      const formattedResult = result.map((item: any) => ({
         value: item.itemCd,
         text: item.itemNm,
      }));

      onInputChange("zzItems", formattedResult);

      return formattedResult;
   };

   const ZZ_B_PO_BP = async () => {
      const param = {
         coCd: "200",
         bpDiv: "999",
         bpType: "ZZ0003",
         bpNm: "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });

      const formattedResult = result.map((item: any) => ({
         value: item.bpCd,
         text: item.bpNm,
      }));

      onInputChange("zzPoBps", formattedResult);

      return formattedResult;
   };
   const ZZ_CODE = async (majorCode: any) => {
      const param = {
         coCd: "999",
         majorCode: majorCode,
         div: "999",
      };

      const result = await fetchPost("ZZ_CODE", param);

      let formattedResult = result.map((item: any) => ({
         value: item.code,
         text: item.codeName,
         label : item.codeName,
      }));

      if (majorCode === "MA0004") onInputChange("zzMA0004", formattedResult);
      if (majorCode === "MA0005"){
         formattedResult = formattedResult.filter(
            (item: any) => item.value == "999" || item.value == "MA0016"  || item.value == "MA0017" 
        ); 
      onInputChange("zzMA0005", formattedResult);
      
      }

      return formattedResult;
   };

//    useEffect(() => {
//       if (inputValues.zzItmes) {
//          let gridInstance = gridRef.current.getInstance();
//          let column = gridInstance.getColumn("itemCd");
//          let zzItmes = inputValues.zzItmes.filter((item: any) => item.value !== "999");
//          column.editor.options.listItems = zzItmes;
//          gridInstance.refreshLayout();
//       }
//    }, [inputValues.zzItmes]);

//    useEffect(() => {
//       if (inputValues.zzPoBps) {
//          let gridInstance = gridRef.current.getInstance();
//          let column = gridInstance.getColumn("poBpCd");
//          let zzPoBps = inputValues.zzPoBps.filter((item: any) => item.value !== "999");
//          column.editor.options.listItems = zzPoBps;
//          gridInstance.refreshLayout();
//       }
//    }, [inputValues.zzPoBps]);

//    useEffect(() => {
//       if (inputValues.zzMA0004) {
//          let gridInstance = gridRef.current.getInstance();
//          let column = gridInstance.getColumn("workDiv");
//          let zzMA0004 = inputValues.zzMA0004.filter((item: any) => item.value !== "999");
//          column.editor.options.listItems = zzMA0004;
//          gridInstance.refreshLayout();
//       }
//    }, [inputValues.zzMA0004]);

   //------------------useEffect--------------------------
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });

      handleSoNoOnIconClick('999')
      
   }, []);

   useEffect(() => {
        search();
    }, [inputValues.searchWorkStatus]);
    

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
            grid.focusAt(inputValues.focusKey, 0, true);
         }

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

   const addGridRow =async () => {

      onInputChange("isOpen2", true);

      const result = await SP0103_P02('');
      const updatedResult = result.map((item: any) => ({
         ...item,
         _attributes: {
             checked: true, // 체크박스를 true로 설정
         },
     }));

      onInputChange("gridDatas3", updatedResult);


     
   };

   //grid 삭제버튼
   const delGridRow = () => {
      let grid = gridRef.current.getInstance();
      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);

      grid.removeRow(rowKey, {});
      grid.focusAt(rowIndex, 1, true);
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

      const result = await SP0102_S01(inputValues.searchSoNo);
      onInputChange("gridDatas2", result);
   };

   const save = async () => {
      if(!inputValues.soNo) {
         alertSwal("발주번호를 입력해주세요.", "", "warning");
         return;
      }

      let datas = await getGridDatas(gridRef);

      inputValues.gridDatas = datas;
      inputValues.soNo ? (inputValues.status = "U") : (inputValues.status = "I");

      if(inputValues.workReqDt) {
         inputValues.workStatus = "MA0017"
      } else {
         inputValues.workStatus = "MA0016"
      }
      

      let data = {
         oilSoHdrDtl: JSON.stringify(inputValues),
         oilSoDtlItem: JSON.stringify(inputValues.gridDatas),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
    };



      const result = await fetchPost(`SP0105_U03`, data);
      returnResult(result);
   };

   const del = async () => {

      if(!inputValues.soNo) {
         alertSwal("발주번호를 입력해주세요.", "", "warning");
         return;
      }

      let datas = gridRef.current.getInstance().getData();
      const updatedGridDatas = datas.map((item:any) => {
         return { ...item, status: 'D' }; // status 값을 'D'로 변경
      });
      inputValues.gridDatas = updatedGridDatas;
      inputValues.status = "D";
      let data = {
         oilSoHdrDtl: JSON.stringify(inputValues),
         oilSoDtlItem: JSON.stringify(inputValues.gridDatas),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
    };
      const result = await fetchPost(`SP0105_U03`, data);
      returnResult(result);
   };

   const returnResult = async (result: any) => {
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      if (result.msgCd === "1") {
         search();
      }
   };

   const handleDblClick = async (e: any) => {
      const gridInstance = gridRef2.current.getInstance();
      const rowData = gridInstance.getRow(e.rowKey);
      onInputChange("soSeq", rowData.soSeq);
      SP0103_S02(rowData.soNo, rowData.soSeq);

      if (rowData) {
         Object.entries(rowData).forEach(([key, value]) => {
            
            onInputChange(key, value);
         });

        
      }
   };
   const handleFocusChange = async (e: any) => {
      const gridInstance = gridRef2.current.getInstance();
      const rowData = gridInstance.getRow(e.rowKey);
      onInputChange("soSeq", rowData.soSeq);
      SP0103_S02(rowData.soNo, rowData.soSeq);

      if (rowData) {
         Object.entries(rowData).forEach(([key, value]) => {
            
            onInputChange(key, value);
         });

        
      }
   };

   const handleDblClick2 = async (e: any) => {
   
      let grid = gridRef.current.getInstance();
      let gridInstance = gridRef3.current.getInstance();
      const rowData = gridInstance.getRow(e.rowKey);
     
      
      if(rowData) {
         const qty = rowData.qty ?? 1; // 기본 수량
         const soPrice = rowData.salePrice ?? 0; // 판매 가격
         const poPrice = rowData.costPrice ?? 0; // 원가
         const soAmt = qty * soPrice; // 발주 금액 (판매 금액 * 수량)
         const soNetAmt = soAmt / 1.1; // 발주 순 금액 (공급가액)
         const soVatAmt = soAmt - soNetAmt; // 발주 부가세
     
         const poAmt = qty * poPrice; // 발주 금액 (원가 * 수량)
         const poNetAmt = poAmt / 1.1; // 발주 순 금액 (공급가액)
         const poVatAmt = poAmt - poNetAmt; // 발주 부가세
     
         const newRowData = {
             useYn: "Y", // 사용 여부
             coCd: "200", // 회사 코드
             soNo: inputValues.soNo, // 발주 번호
             soSeq: inputValues.soSeq, // 발주 순번
             itemGrp: rowData.itemGrp, // 품목 그룹
             itemDiv: rowData.itemDiv, // 품목 구분
             itemCd: rowData.itemCd, // 품목 코드
             itemNm: rowData.itemNm, // 품목 명
             workCd: rowData.workCd, // 작업 코드
             qty: qty, // 수량
             soPrice: soPrice, // 판매 가격
             soAmt: soAmt, // 발주 금액 (판매 금액 * 수량)
             soNetAmt: Math.round(soNetAmt), // 발주 순 금액 (공급가액), 소수점 반올림
             soVatAmt: Math.round(soVatAmt), // 발주 부가세, 소수점 반올림
             poPrice: poPrice, // 원가
             poAmt: Math.round(poAmt), // 발주 금액 (원가 * 수량), 소수점 반올림
             poNetAmt: Math.round(poNetAmt), // 발주 순 금액 (공급가액), 소수점 반올림
             poVatAmt: Math.round(poVatAmt), // 발주 부가세, 소수점 반올림
         };
     
         // grid에 새 행 추가
         grid.appendRow(newRowData, { focus: true });
          
         }
         onInputChange("isOpen2", false);
   };

   const handleMakeItem = async () => {
      let grid = gridRef.current.getInstance();
      let grid3Instance = gridRef3.current.getInstance();
  
      // grid3에서 체크된 행 데이터 가져오기
      const checkedRows = grid3Instance.getCheckedRows();
  
      if (checkedRows.length === 0) {
          alertSwal("선택한 품목이 없습니다.", "", "warning");
          return;
      }

      // 체크된 각 행을 grid에 추가
      checkedRows.forEach((rowData: any) => {
         const qty = rowData.qty ?? 1; // 기본 수량
         const soPrice = rowData.salePrice ?? 0; // 판매 가격
         const poPrice = rowData.costPrice ?? 0; // 원가
         const soAmt = qty * soPrice; // 발주 금액 (판매 금액 * 수량)
         const soNetAmt = soAmt / 1.1; // 발주 순 금액 (공급가액)
         const soVatAmt = soAmt - soNetAmt; // 발주 부가세
     
         const poAmt = qty * poPrice; // 발주 금액 (원가 * 수량)
         const poNetAmt = poAmt / 1.1; // 발주 순 금액 (공급가액)
         const poVatAmt = poAmt - poNetAmt; // 발주 부가세
     
         const newRowData = {
             useYn: "Y", // 사용 여부
             coCd: "200", // 회사 코드
             soNo: inputValues.soNo, // 발주 번호
             soSeq: inputValues.soSeq, // 발주 순번
             itemGrp: rowData.itemGrp, // 품목 그룹
             itemDiv: rowData.itemDiv, // 품목 구분
             itemCd: rowData.itemCd, // 품목 코드
             itemNm: rowData.itemNm, // 품목 명
             workCd: rowData.workCd, // 작업 코드
             qty: qty, // 수량
             soPrice: soPrice, // 판매 가격
             soAmt: soAmt, // 발주 금액 (판매 금액 * 수량)
             soNetAmt: Math.round(soNetAmt), // 발주 순 금액 (공급가액), 소수점 반올림
             soVatAmt: Math.round(soVatAmt), // 발주 부가세, 소수점 반올림
             poPrice: poPrice, // 원가
             poAmt: Math.round(poAmt), // 발주 금액 (원가 * 수량), 소수점 반올림
             poNetAmt: Math.round(poNetAmt), // 발주 순 금액 (공급가액), 소수점 반올림
             poVatAmt: Math.round(poVatAmt), // 발주 부가세, 소수점 반올림
         };
     
         // grid에 새 행 추가
         grid.appendRow(newRowData, { focus: true });
     });
     
 
  
      // 마지막 행에 포커스 설정
      const lastRowKey = grid.getRowCount() - 1;
      grid.focus(0, "itemCd");

      onInputChange("isOpen2", false);

   };

   const handleGridChange = (ev: any) => {
      if (ev.changes && ev.changes.length > 0) {
          const { columnName, rowKey, value } = ev.changes[0];
          const gridInstance = gridRef.current.getInstance();
          const rowData = gridInstance.getRow(rowKey);
  
          if (columnName === "soPrice" ) {
              const qty = rowData.qty ;
              const soPrice = rowData.soPrice;  
              const soAmt = qty * soPrice;
              const soNetAmt = soAmt / 1.1;
              const soVatAmt = soAmt - soNetAmt;
  
              gridInstance.setValue(rowKey, "soAmt", Math.round(soAmt));
              gridInstance.setValue(rowKey, "soNetAmt", Math.round(soNetAmt));
              gridInstance.setValue(rowKey, "soVatAmt", Math.round(soVatAmt));
          }
  
          if (columnName === "poPrice" ) {
              const qty = rowData.qty;
              const poPrice = rowData.poPrice; 
              const poAmt = qty * poPrice;
              const poNetAmt = poAmt / 1.1;
              const poVatAmt = poAmt - poNetAmt;
  
              gridInstance.setValue(rowKey, "poAmt", Math.round(poAmt));
              gridInstance.setValue(rowKey, "poNetAmt", Math.round(poNetAmt));
              gridInstance.setValue(rowKey, "poVatAmt", Math.round(poVatAmt));
          }
  
          if (columnName === "qty" ) {
              const qty = rowData.qty;
  
              const soPrice = rowData.soPrice;  
              const soAmt = qty * soPrice;
              const soNetAmt = soAmt / 1.1;
              const soVatAmt = soAmt - soNetAmt;
  
              gridInstance.setValue(rowKey, "soAmt", Math.round(soAmt));
              gridInstance.setValue(rowKey, "soNetAmt", Math.round(soNetAmt));
              gridInstance.setValue(rowKey, "soVatAmt", Math.round(soVatAmt));
  
              const poPrice = rowData.poPrice; 
              const poAmt = qty * poPrice;
              const poNetAmt = poAmt / 1.1;
              const poVatAmt = poAmt - poNetAmt;
  
              gridInstance.setValue(rowKey, "poAmt", Math.round(poAmt));
              gridInstance.setValue(rowKey, "poNetAmt", Math.round(poNetAmt));
              gridInstance.setValue(rowKey, "poVatAmt", Math.round(poVatAmt));
          }
      }
  };
  

   const searchModalDiv =  () => {
      const result =  SP0102_S01(inputValues.searchSoNo);
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

   const handleSoNoOnKeyDown = async (e: any) => {
    //   const target = e.target as HTMLInputElement;
    //   onInputChange("soNo", target.value);
    //   onInputChange("searchSoNo", target.value);

    //   const result = await SP0301_S01(target.value);
    //   const result2 = await SP0101_S02(target.value);
    //   onInputChange("gridDatas1", result2);

    //   if (result.length === 1) {
    //      Object.entries(result[0]).forEach(([key, value]) => {
    //         onInputChange(key, value);
    //      });
    //   } else {
    //      onInputChange("isOpen", true);
    //   }
   };

   const handleSoNoOnIconClick = async (e: any) => {
     
      const result = await SP0102_S01(e);
      onInputChange("gridDatas2", result);
    

   };

   //-------------------grid----------------------------
   const columns = [
    { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
    { header: "발주번호", name: "soNo", width: 100, align: "center", hidden: true  },
    { header: "발주 순번", name: "soSeq", width: 80, align: "center", hidden: true  }, 
    { header: "품목 순번", name: "itemSeq", width: 100, align: "center", hidden: true  }, 
    { header: "품목코드", name: "itemCd", width: 100, align: "center" }, 
    { header: "품목명", name: "itemNm", width: 200}, 
    { header: "품목그룹", name: "itemGrp", width: 120, align: "center", hidden: true }, 
    { header: "퓸목구분", name: "itemDiv", width: 120, align: "center", hidden: true },
    { header: "작업코드", name: "workCd", width: 250, align: "center", hidden: true  }, 
    {
       header: "수량", name: "qty", width: 60, align: "right", editor: "text",
       formatter: function (e: any) { return commas(e.value);},
    }, // QTY: 수량
    {
       header: "판매단가", name: "soPrice", width: 100, align: "right", editor: "text", hidden: true,
       formatter: function (e: any) { return commas(e.value); },
    }, // SO_PRICE: 발주 가격
    {
       header: "금액", name: "soAmt", width: 120, align: "right", hidden: true,
       formatter: function (e: any) { return commas(e.value); },
    }, // SO_AMT: 발주 금액
    {
       header: "공급가액", name: "soNetAmt", width: 120, align: "right", hidden: true,
       formatter: function (e: any) {  return commas(e.value); },
       
    }, // SO_NET_AMT: 발주 순 금액
    {
       header: "부가세", name: "soVatAmt", width: 120, align: "right", hidden: true,
       formatter: function (e: any) { return commas(e.value); },
    }, // SO_VAT_AMT: 발주 부가세
    {
       header: "단가", name: "poPrice", width: 80, align: "right", editor: "text",
       formatter: function (e: any) {  return commas(e.value); },
    }, // PO_PRICE: 발주 가격
    {
       header: "금액", name: "poAmt", width: 80, align: "right", 
       formatter: function (e: any) {  return commas(e.value); },
    }, // PO_AMT: 발주 금액
    {
       header: "공급금액", name: "poNetAmt", width: 100, align: "right",
       formatter: function (e: any) {  return commas(e.value); },
    }, // PO_NET_AMT: 발주 순 금액
    {
       header: "부가세", name: "poVatAmt", width: 100, align: "right", 
       formatter: function (e: any) {  return commas(e.value);  },
    }, // PO_VAT_AMT: 발주 부가세
   { header: "비고", name: "remark", editor: "text", width: 250 }, // REMARK: 비고
 ];
 
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
               {/* <div className="flex pt-2 space-x-2">
                  <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                     <PlusIcon className="w-5 h-5" />
                     추가
                  </button>
                  <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                     <MinusIcon className="w-5 h-5" />
                     삭제
                  </button>
               </div> */}
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} headerHeight={30} 
            handleFocusChange={() => {}} handleAfterChange={handleGridChange} 
            perPageYn={false} height={window.innerHeight-695} />
      </div>
   );

   const columns2 = [
      { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
      { header: "발주번호", name: "soNo", width: 120, align: "center", rowSpan: true,   }, // SO_NO: 발주 번호
      { header: "구분번호", name: "soSeq", width: 120, align: "center", hidden: true }, // SO_NO: 발주 번호
      { header: "사업장", name: "bpNm", width: 150, rowSpan: false }, 
      { header: "사업장", name: "bpCd", width: 300,   hidden: true }, 
      { header: "작업명", name: "workCd", width: 250,  hidden: true }, 
      { header: "작업명", name: "workNm", width: 100 }, 
      { header: "협력업체", name: "poBpCd", width: 300,  hidden: true }, 
      { header: "협력업체", name: "poBpNm", width: 100 }, 
      { header: "신청일자", name: "orderDt", width: 120, align: "center", }, // ORDER_DT: 발주 일자
      { header: "요청일자", name: "reqDt", width: 120, align: "center" }, // REQ_DT: 요청 일자
      { header: "발주상태", name: "orderStatus", width: 100, align: "center", hidden: true }, // 
      { header: "진행상태", name: "workStatus", width: 100, align: "center", hidden: true }, // 
      { header: "진행상태", name: "workStatusNm", width: 100, align: "center",  }, // 
      { header: "설치희망일", name: "hopeDt", width: 100, align: "center" }, // 
      { header: "설치요청일", name: "workReqDt", width: 100, align: "center" }, // 
      { header: "설치예정일", name: "expectDt", width: 100, align: "center" }, //
      { header: "설치완료일", name: "finishDt", width: 100, align: "center" }, // 
      { header: "수량", name: "qty", width: 100, align: "center"}, // 
      { header: "구분", name: "workDiv", width: 100, align: "center" }, // 
      { header: "비고", name: "remark", width: 100, align: "center"}, // 
      { header: "확정여부", name: "cfmFlag", width: 100, align: "center" }, // 
   
 
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">발주리스트</div>
            </div>
     
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} headerHeight={30} handleFocusChange={handleFocusChange} 
         handleDblClick={handleDblClick} perPageYn={false} height={window.innerHeight - 410} />
      </div>
   );

   const columns3 = [
      { header: "회사코드", name: "coCd", hidden: true }, // CO_CD: 회사 코드
      { header: "품목코드", name: "itemCd", width: 120, align: "center" }, // ITEM_CD: 품목 코드
      { header: "품목명", name: "itemNm",}, // ITEM_NM: 품목명
      { header: "판매가격", name: "salePrice", width: 120, align: "right",
         formatter: function (e: any) {return commas(e.value); }
      }, // SALE_PRICE: 판매 가격
      { header: "원가", name: "costPrice", width: 120, align: "right",
         formatter: function (e: any) { return commas(e.value); }
      }, // COST_PRICE: 원가
      { header: "작업코드", name: "workCd", width: 120, align: "center", hidden: true }, // WORK_CD: 작업 코드
      { header: "품목그룹", name: "itemGrp", width: 150, align: "center", hidden: true  }, // ITEM_GRP: 품목 그룹
      { header: "품목구분", name: "itemDiv", width: 150, align: "center" , hidden: true }, // ITEM_DIV: 품목 구분
      { header: "작업명", name: "workNm", width: 120, align: "center" }, // WORK_CD: 작업 코드
      { header: "품목그룹", name: "itemGrpNm", width: 150, align: "center"  }, // ITEM_GRP: 품목 그룹
      { header: "품목구분", name: "itemDivNm", width: 150, align: "center" }, // ITEM_DIV: 품목 구분
      { header: "규격", name: "spec", width: 50, align: "center" }, // SPEC: 규격
      { header: "과세여부", name: "taxYn", width: 100, align: "center", hidden: true }, // TAX_YN: 과세 여부
      { header: "패키지품목여부", name: "pkgItemYn", width: 150, align: "center", hidden: true }, // PKG_ITEM_YN: 패키지 품목 여부
      { header: "대체여부", name: "subsYn", width: 100, align: "center", hidden: true }, // SUBS_YN: 대체 여부
      { header: "공제여부", name: "deduYn", width: 100, align: "center", hidden: true }, // DEDU_YN: 공제 여부
      { header: "사용여부", name: "useYn", width: 100, align: "center" , hidden: true}, // USE_YN: 사용 여부
      { header: "삭제여부", name: "delYn", width: 100, align: "center", hidden: true }, // DEL_YN: 삭제 여부
      { header: "등록자", name: "insrtUserId", width: 120, align: "center", hidden: true }, // INSRT_USER_ID: 등록자
      { header: "등록일", name: "insrtDt", width: 150, align: "center", hidden: true }, // INSRT_DT: 등록일
      { header: "수정자", name: "updtUserId", width: 120, align: "center", hidden: true }, // UPDT_USER_ID: 수정자
      { header: "수정일", name: "updtDt", width: 150, align: "center", hidden: true } // UPDT_DT: 수정일
    ];
    

   const grid3 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <TuiGrid01  rowHeaders={["rowNum", "checkbox"]} gridRef={gridRef3} columns={columns3} headerHeight={30} handleFocusChange={() => {}} handleDblClick={handleDblClick2} perPageYn={false} height={window.innerHeight - 640} />
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

         <div className="space-y-2 ">
            <div className="grid grid-cols-3 gap-y-2 justify-start ">
               <InputComp title="발주번호" value={inputValues.soNo} readOnly={true} onChange={(e) => onInputChange("soNo", e)} />

               <SelectSearch
                  title="진행상태"
                  value={inputValues.workStatus}
                  onChange={(label, value) => {
                     onInputChange("workStatus", value);
                  }}
                  param={{ coCd: "999", majorCode: "MA0005", div: "" }}
                  procedure="ZZ_CODE"
                  dataKey={{ label: "codeName", value: "code" }}
                  readonly={true}
               />

               <DatePickerComp
                  title="신청일자"
                  value={inputValues.reqDt}
                  onChange={(e) => {onInputChange("reqDt", e); }}
                  readonly={true}
                 
               />

               <SelectSearch
                  title="협력업체"
                  value={inputValues.poBpCd}
                  onChange={(label, value) => {
                     onInputChange("poBpCd", value);
                  }}
                  stringify={true}
                  param={{ coCd: "200", bpType: "ZZ0003", bpNm: "999", bpDiv: "999" }}
                  procedure="ZZ_B_PO_BP"
                  dataKey={{ label: "bpNm", value: "bpCd" }}
                  readonly={true}
               />

               <SelectSearch
                  title="지점명"
                  value={inputValues.bpCd}
                  onChange={(label, value) => {
                     onInputChange("bpCd", value);
                  }}
                  stringify={true}
                  param={{ coCd: "200", bpType: "ZZ0002", bpNm: "999", bpDiv: "999" }}
                  procedure="ZZ_B_PO_BP"
                  dataKey={{ label: "bpNm", value: "bpCd" }}
                  readonly={true}
               />
               <SelectSearch
                  title="작업명"
                  value={inputValues.workCd}
                  onChange={(label, value) => {
                     onInputChange("workCd", value);
                  }}
                  stringify={true}
                  param={{ coCd: "200" }}
                  procedure="ZZ_WORKS"
                  dataKey={{ label: "workNm", value: "workCd" }}
                  readonly={true}
               />

               <InputComp title="수량" value={inputValues.qty} 
                          type="number"  readOnly={true}
               onChange={(e) => onInputChange("qty", e)} />

               <SelectSearch
                  title="구분"
                  value={inputValues.workDiv}
                  onChange={(label, value) => {
                     onInputChange("workDiv", value);
                  }}
                  param={{ coCd: "999", majorCode: "MA0004", div: "" }}
                  procedure="ZZ_CODE"
                  dataKey={{ label: "codeName", value: "code" }}
                  readonly={true}
               />

          
            </div>

             
            <div className="grid grid-cols-1 w-full justify-start">
               <TextArea title="비고" value={inputValues.remarkDtl}  readonly={true}
               onChange={(e) => onInputChange("remarkDtl", e)} layout="flex" minWidth="100px"
            
               />
           
            </div>

            <div className="grid grid-cols-3 gap-y-2 justify-start">
               <DatePickerComp
                  title="설치예정일"
                  value={inputValues.expectDt}
                  onChange={(e) => {
                     onInputChange("expectDt", e);
                  }}
               />
               <DatePickerComp
                  title="설치요청일"
                  value={inputValues.workReqDt}
                  readonly={true}
                  onChange={(e) => {
                     onInputChange("workReqDt", e);
                  }}
               />

                   {/* <DatePickerComp
                  title="설치희망일"
                  value={inputValues.hopeDt}
                  onChange={(e) => {
                     onInputChange("hopeDt", e);
                  }}
               /> */}

               
               {/* 
               <DatePickerComp
                  title="설치완료일"
                  value={inputValues.finishDt}
                  onChange={(e) => {
                     onInputChange("finishDt", e);
                  }}
               /> */}
            </div>
         </div>
      </div>
   );

     //검색창 div
     const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp title="발주번호" ref={searchSoNoRef} value={inputValues.searchSoNo} handleCallSearch={search}  onChange={(e) => onInputChange("searchSoNo", e)} />
            <InputComp title="사업장" ref={searchBpNmRef} value={inputValues.searchBpNm}   handleCallSearch={search} onChange={(e) => onInputChange("searchBpNm", e)} />
            <InputComp title="작업명" value={inputValues.searchWorkNm}  handleCallSearch={search} onChange={(e) => onInputChange("searchWorkNm", e)} />
            
            <SelectSearch
                  title="진행상태"
                  value={inputValues.searchWorkStatus}
                  onChange={(label, value) => {
                     onInputChange("searchWorkStatus", value);
                  }}
                
                  datas={inputValues.zzMA0005}
                  
               />
            
            {userInfo.coCd === '999' && (
               <InputComp title="협력업체" value={inputValues.searchPoBpNm}  handleCallSearch={search} onChange={(e) => onInputChange("searchPoBpNm", e)} />
            )}
          
         </div>
      </div>
   );

   // const modalDiv = () => (
   //    <div className="space-y-3">
   //       <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
   //          <div className="w-full flex justify-between">
   //             <div className="grid grid-cols-3 gap-y-2  justify-start ">
   //                <InputComp title="발주번호" ref={searchSoNoRef} value={inputValues.searchSoNo} handleCallSearch={searchModalDiv} onChange={(e) => onInputChange("searchSoNo", e)} />

   //                <InputComp title="고객사" ref={searchBpNmRef} value={inputValues.searchBpNm} handleCallSearch={searchModalDiv} onChange={(e) => onInputChange("searchBpNm", e)} />
                 
   //                <InputComp title="협력업체" value={inputValues.searchPoBpNm} handleCallSearch={searchModalDiv} onChange={(e) => onInputChange("searchPoBpNm", e)} />
                  
   //                <InputComp title="작업명" value={inputValues.searchWorkNm} handleCallSearch={searchModalDiv} onChange={(e) => onInputChange("searchWorkNm", e)} />

   //                <DateRangePickerComp
   //                   title="신청기간"
   //                   startValue={inputValues.startDt}
   //                   endValue={inputValues.endDt}
   //                   handleCallSearch={searchModalDiv}
   //                   onChange={(startDate, endDate) => {
   //                      onInputChange("startDt", startDate);
   //                      onInputChange("endDt", endDate);
   //                   }}
   //                />
   //             </div>
   //             <div className="w-[20%] flex justify-end h-8">
   //                <button type="button" onClick={searchModalDiv} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
   //                   <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
   //                   조회
   //                </button>
   //             </div>
   //          </div>
   //       </div>
   //       <div>{grid2()}</div>
   //    </div>
   // );
   const modalDiv2 = () => (
      <div className="space-y-3">
         <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
            <div className="w-full flex justify-between">
               <div className="grid grid-cols-3 gap-y-2  justify-start ">
                  <InputComp title="품목명" ref={searchItemNmRef} value={inputValues.searchItemNm} handleCallSearch={searchModalDiv2} onChange={(e) => onInputChange("searchItemNm", e)} />

               </div>
               <div className="w-[20%] flex justify-end h-8 space-x-2">
                  <button type="button" onClick={searchModalDiv2} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                     <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                     조회
                  </button>
                  <button type="button" onClick={handleMakeItem} className="bg-green-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                     <ChevronDoubleDownIcon className="w-5 h-5 mr-1" />
                     내리기
                  </button>
               </div>
            </div>
         </div>
         <div>{grid3()}</div>
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
               </div>
               {/* <div className="w-3/5 space-y-2">
                  <div className="flex space-x-3">
                     <div className="w-full">{div1()}</div>
                  </div>

                  <div>{grid()}</div>

               </div> */}
            </div>

         </div>
     
         <CommonModal
            isOpen={inputValues.isOpen2} size="xl" 
            onClose={() => { onInputChange("isOpen2", false); ; }} 
            title="" >
            <div>{modalDiv2()}</div>
         </CommonModal>
      </div>
   );
};

export default Sp0104;
