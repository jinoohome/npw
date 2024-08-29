import {
   React, useEffect, useState,commas, useRef,SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, TrashIcon, ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import "tui-date-picker/dist/tui-date-picker.css";
import DatePicker from "tui-date-picker";
import { on } from "events";
import { set } from "date-fns";
import { Input, Label } from "@headlessui/react";

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const MM0602 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "기준정보" }, { name: "계약관리" }, { name: "계약등록" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      gridDatas1: [],
      gridDatas2: [],
      gridDatas3: [],
      gridDatas4: [],
      gridDatas5: [],
      gridDatas6: [],
      isOpen: false,
      isOpen2: false,
      confirmYn: "N",
      compSmsYn: "N",
      etcSmsYn: "N",
      coCd : '100',
      subCodeDatas : [],
      hsTypeDatas : [],

   });

   const [errorMsgs, setErrorMsgs] = useState<{ [key: string]: string }>({});


   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const gridRef2 = useRef<any>(null);
   const gridContainerRef2 = useRef(null);

   const gridRef3 = useRef<any>(null);
   const gridContainerRef3 = useRef(null);

   const gridRef4 = useRef<any>(null);
   const gridContainerRef4 = useRef(null);

   const gridRef5 = useRef<any>(null);
   const gridContainerRef5 = useRef(null);

   const gridRef6 = useRef<any>(null);
   const gridContainerRef6 = useRef(null);


   const bpNmRef = useRef<HTMLInputElement>(null);
   const contNoRef = useRef<HTMLInputElement>(null);
   const searchBpNmRef = useRef<HTMLInputElement>(null);
   const searchContNoRef = useRef<HTMLInputElement>(null);
   const hsTypeRef = useRef<any>(null);
   const subCodeRef = useRef<any>(null);
   const contTypeRef = useRef<any>(null);
   const payCondRef = useRef<any>(null);
   const chargeDeptRef = useRef<any>(null);

   const setGridData = async () => {
      try {
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };
  


   //------------------api--------------------------

   const ZZ_B_PO_BP = async (bpBm:any) => {
      const param = {
         coCd: userInfo.coCd,
         bpDiv: "ZZ0188",
         bpNm: bpBm || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });


      onInputChange("gridDatas6", result);
      return result;
   };

 

   const MM0602_S01 = async (contNo :string) => {
      const param = {
         contNo: contNo  ,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0602_S01", { data });
     
      return result;
   };
   const MM0602_S02 = async (contNo :string) => {
      const param = {
         contNo: contNo  ,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0602_S02", { data });


      const updatedResult = result.map((item: any) => ({
         ...item,
         _attributes: {
             checked: true, // 체크박스를 true로 설정
         },
     }));
 

      onInputChange("gridDatas4", updatedResult);
      return result;
   };

   const MM0601_S01 = async () => {
      const param = {
         bpCd: inputValues.bpCd ,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0601_S01", { data });

      
      onInputChange("gridDatas1", result);
      return result;
   };

   const ZZ_CONT_INFO = async (contNo:any, searchDiv:any) => {  

   
      const param = {
         contNo: contNo ,
         bpCd: inputValues.bpCd ,
         subCode: inputValues.subCode || '999',
         searchDiv: searchDiv,
         hsCd: inputValues.hsCd ,
      };

     
      const data = JSON.stringify(param);

      const result = await fetchPost("ZZ_CONT_INFO", { data });

      

      if(searchDiv === 'SUB'){
       
         let subCodeDatas =
         [
            { value: '', label: '전체' }, // '전체' 항목을 추가
            ...result.map((item: any) => ({
               value: item.subCode,
               label: item.subCodeNm,
            })),
      ];
         onInputChange('subCodeDatas',subCodeDatas);
         onInputChange('subCode','');

      }else if(searchDiv === 'BP_HS'){
         let hsTypeDatas=
            [
               { value: '', label: '전체' }, // '전체' 항목을 추가
               ...result.map((item: any) => ({
                   value: item.hsType,
                   label: item.hsTypeNm,
               })),
           ];
    
         onInputChange('hsTypeDatas',hsTypeDatas);
         onInputChange("hsType", '');
      }
    
      
      return result;
   }

   
   const MM0601_S03 = async () => {
      const param = {
         bpCd: inputValues.bpCd ,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0601_S03", { data });

 
       
      onInputChange("gridDatas2", result);
      return result;
   };

   
   
   const MM0601_S04 = async () => {
      const param = {
         bpCd: inputValues.bpCd ,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0601_S04", { data });

      onInputChange("gridDatas3", result);
      return result;
   };



   //------------------useEffect--------------------------
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      reSizeGrid({ ref: gridRef4, containerRef: gridContainerRef4, sec: 200 });
      reSizeGrid({ ref: gridRef5, containerRef: gridContainerRef5, sec: 200 });
      reSizeGrid({ ref: gridRef6, containerRef: gridContainerRef6, sec: 200 });
      
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
      }
   }, [inputValues.gridDatas2]);

   useEffect(() => {
      if (gridRef3.current && inputValues.gridDatas3) {
         let grid = gridRef3.current.getInstance();
         grid.resetData(inputValues.gridDatas3);
         
      }
   }, [inputValues.gridDatas3]);

   useEffect(() => {
      if (gridRef4.current && inputValues.gridDatas4) {
         let grid = gridRef4.current.getInstance();
         grid.resetData(inputValues.gridDatas4);
      }
   }, [inputValues.gridDatas4]);

   useEffect(() => {
      if (gridRef5.current && inputValues.gridDatas5) {
         let grid = gridRef5.current.getInstance();
         grid.resetData(inputValues.gridDatas5);
         refreshGrid(gridRef5);
      }
   }, [inputValues.gridDatas5]);

   useEffect(() => {
      
      if (gridRef6.current && inputValues.gridDatas6) {
         let grid = gridRef6.current.getInstance();
         grid.resetData(inputValues.gridDatas6);
         refreshGrid(gridRef6);
      }
   }, [inputValues.gridDatas6]);


   useEffect(() => {
      if (inputValues.bpCd) {
         setBpCdChange(inputValues.bpCd);
      }
   }, [inputValues.bpCd]);

   useEffect(() => {
      if (inputValues.contNo) {
         //setCoCdChange(inputValues.contNo);
      }
   }, [inputValues.contNo]);


   useEffect(() => {
      if (inputValues.isOpen2) {
         searchBpNmRef.current?.focus();
      }
   }, [inputValues.isOpen2]);

   useEffect(() => {
      handleFilterChange();
   }, [inputValues.hsType, inputValues.subCode]);
   
   useEffect(() => {
      if (inputValues.contNo) {
         ZZ_CONT_INFO(inputValues.contNo,'BP_HS');
      }
   }, [inputValues.subCode]);

   //-------------------event--------------------------
   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
         ...prevValues,
         [name]: value,
      }));
   };

   const validateData = (action: string, dataString: any) => {
      // dataString이 문자열이면 JSON.parse()를 사용, 그렇지 않으면 직접 사용
      const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;
      let result = true;

      if (action === "save") {
         if (data.length < 1) return false;

         for (const item of data) {
            if (["U", "I"].includes(item.status)) {
          
               // if (!item.itemNm) {
               //    setErrorMsgs((prev) => ({ ...prev, itemNm: "*품목명을 입력해주세요." }));
               //    result = false;
               // }
            }
         }
      }

      
      if(!result){
         alertSwal("필수입력항목을 확인해주세요.", "error", "error");
      }else{
         return result; 
      }

   };

   const filterGridData = () => {
      let filteredData = inputValues.gridDatas4;
   
      // 경조구분 필터링
      if (inputValues.hsType) {
         filteredData = filteredData.filter((item: any) => item.hsType === inputValues.hsType);
      }
   
      // 재직구분 필터링
      if (inputValues.subCode) {
         filteredData = filteredData.filter((item: any) => item.subCode === inputValues.subCode);
      }
   
      return filteredData;
   };

   const handleFilterChange = () => {
     

      const filteredData = filterGridData();
   
      if (gridRef4.current) {
         const grid = gridRef4.current.getInstance();
         grid.resetData(filteredData);
      }
   };

   const search = async () => {
      const result = await MM0602_S01(inputValues.contNo);

      
      if(result.length == 1){
         Object.entries(result[0]).forEach(([key, value]) => {
            onInputChange(key, value);
         });

         setCoCdChange(inputValues.contNo);

      }

   };
   

   const save = async() => {
      let datas = await getGridCheckedDatas(gridRef4);
      inputValues.gridDatas4 = datas;
      inputValues.contNo ? inputValues.status = 'U' : inputValues.status = 'I';

     // if (!validateData("save", datas)) return false;

      let data = {
         contHdr: JSON.stringify(inputValues),
         contDtl: JSON.stringify(inputValues.gridDatas4),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
      };

      const result = await fetchPost(`MM0602_U03`, data);
      returnResult(result);
     
   };

   const del = async() => {
      let datas = await getGridCheckedDatas(gridRef4);
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
         if(inputValues.status === 'D'){
            onInputChange("contNo", "");
            onInputChange("contNm", "");
            onInputChange("bpCd", "");
            onInputChange("bpNm", "");
            onInputChange("contType", "");
            onInputChange("payCond", "");
            onInputChange("chargeDept", "");
            onInputChange("compSmsYn", "N");
            onInputChange("etcSmsYn", "N");
            onInputChange("confirmYn", "N");
            onInputChange("hsType", "");
            onInputChange("subCode", "");
            onInputChange("contDt", "");
            onInputChange("contFrDt", "");
            onInputChange("contToDt", "");
            onInputChange("mouYn", "N");
            onInputChange("remark", "");
            onInputChange("gridDatas1", []);
            onInputChange("gridDatas2", []);
            onInputChange("gridDatas3", []);
            onInputChange("gridDatas4", []);
            onInputChange("gridDatas5", []);

         }else{
            inputValues.contNo = result.contNoOut;
            search();
         }
      }
   
   };

   const handleBpCdOnKeyDown = async (e: any) => {
      const target = e.target as HTMLInputElement;
      inputValues.bpNm = target.value;
      onInputChange("searchBpNm", target.value);

      let result = await ZZ_B_PO_BP(inputValues.bpNm );

      if (result.length === 1) {
         onInputChange("bpCd", result[0].bpCd);
         onInputChange("bpNm", result[0].bpNm);
      } else {
         onInputChange("isOpen2", true);
      }
   };

   const handleBpCdOnIconClick = async (e: any) => {
      onInputChange("searchBpNm", e);
      await ZZ_B_PO_BP(e);
      onInputChange("isOpen2", true);
   };

   const handleDblClick = async (e: any) => {
      const gridInstance = gridRef5.current.getInstance(); 
      const rowData = gridInstance.getRow(e.rowKey);
     
      if(rowData) {
         Object.entries(rowData).forEach(([key, value]) => {
               onInputChange(key, value);
          });

         onInputChange("isOpen", false);
         setCoCdChange(rowData.contNo);
      }
   };
   const handleDblClick2 = (e: any) => {
      const gridInstance = gridRef6.current.getInstance(); 
      const rowData = gridInstance.getRow(e.rowKey);
      if(rowData) {
         onInputChange("bpCd", rowData.bpCd);
         onInputChange("bpNm", rowData.bpNm);
         onInputChange("isOpen2", false);
         
        
      }
   };

   const searchModalDiv = async () => {
      
      const result = await MM0602_S01(inputValues.searchContNo);
      onInputChange("gridDatas5", result);
    
   }

   const searchModalDiv2 = async () => {
      await ZZ_B_PO_BP(inputValues.searchBpNm);
    
   }

   const handleContNoOnKeyDown = async (e: any) => {
      const target = e.target as HTMLInputElement;
      inputValues.contNo = target.value;
      onInputChange("searchContNo", target.value);

      const result = await MM0602_S01(inputValues.contNo );
      onInputChange("gridDatas5", result);
      
      if (result.length === 1) {
         Object.entries(result[0]).forEach(([key, value]) => {
            onInputChange(key, value);
       });
          
      setCoCdChange(inputValues.contNo);
         
      } else {
         onInputChange("isOpen", true);
      }

   }

   const handleContNoOnIconClick = async (e: any) => {
      onInputChange("searchContNo", e);
      const result =  await MM0602_S01(e);
      onInputChange("gridDatas5", result);
      onInputChange("isOpen", true);
   }


   const setCoCdChange = async (e: any) => {
      MM0602_S02(e);
      MM0601_S01();
      MM0601_S03();
      MM0601_S04();
      ZZ_CONT_INFO(e,'SUB');
      ZZ_CONT_INFO(e,'BP_HS');
   };
   

   const setBpCdChange = (e: any) => {
      MM0601_S01();
      MM0601_S03();
      MM0601_S04();
   };

   const handleMakeItem = () => {
      const gridInstance1 = gridRef.current.getInstance();
      const gridInstance2 = gridRef2.current.getInstance();
      const gridInstance3 = gridRef3.current.getInstance();
      const gridInstance4 = gridRef4.current.getInstance();
  
      // 포커스된 셀을 기반으로 행을 가져오는 방법
      const focusedCell1 = gridInstance1.getFocusedCell();
      const focusedCell2 = gridInstance2.getFocusedCell();
  
      // 포커스된 셀이 있는 경우 해당 행의 데이터를 가져옴
      const row1 = focusedCell1 ? gridInstance1.getRow(focusedCell1.rowKey) : null;
      const row2 = focusedCell2 ? gridInstance2.getRow(focusedCell2.rowKey) : null;
  
      // row1이나 row2에 값이 없으면 경고 메시지를 표시하고 함수 종료
      if (!row1) {
          alertSwal("경고", "경조코드를 선택해주세요.", "warning");
          return;
      }
  
      if (!row2) {
          alertSwal("경고", "재직코드를 선택해주세요.", "warning");
          return;
      }
  
      // 체크된 행의 데이터를 가져옴
      const rows3 = gridInstance3.getCheckedRows();
      const currentRowCount = gridInstance4.getRowCount();
  
      // gridInstance4에 이미 존재하는 모든 행 데이터 가져오기
      const existingRows = gridInstance4.getData();
  
      const newRows = rows3
          .map((row3: any, index: number) => {
              return {
                  coCd: row1?.coCd || "",
                  contNo: row1?.contNo || "",
                  hsType: row1?.hsType || row2?.hsType || "",
                  subCode: row2?.subCode || "",
                  seqNo: (currentRowCount + index + 1).toString(),
                  itemCd: row3.itemCd || "",
                  itemNm: row3.itemNm || "",
                  qty: row3.qty || "1",
                  priceCom: row3.priceCom || "",
                  pricePer: row3.pricePer || "",
                  branchGroup: row3.branchGroup || "",
                  branchGroupNm: row3.branchGroupNm || "",
                  mandatoryYn: row3.mandatoryYn || "",
                  remark: row3.remark || "",
                  status: "I" ,
                  _attributes: { checked: true } 
              };
          })
          .filter((newRow: any) => {
              // 중복 체크: hsType, subCode, itemCd가 같은 행이 있는지 확인
              return !existingRows.some(
                  (existingRow: any) =>
                      existingRow.hsType === newRow.hsType &&
                      existingRow.subCode === newRow.subCode &&
                      existingRow.itemCd === newRow.itemCd
              );
          });
  
      if (newRows.length > 0) {
          // 중복이 아닌 새로운 행들을 gridInstance4에 추가
          gridInstance4.appendRows(newRows);
      } else {
          // 중복된 항목이 있을 경우 경고 메시지 표시 및 해당 행으로 포커스 이동
         
          alertSwal("품목중복", "중복된 품목이 있습니다.", "warning");
      }
  };
  
  
   //-------------------grid----------------------------
   const columns = [
      { header: "경조코드", name: "hsType", width: 100, align: "center" },
      { header: "경조구분명", name: "hsTypeNm" },
   ];

   const grid1 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">경조구분</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} headerHeight={30} handleFocusChange={() => {}} 
                  perPageYn={false} height={window.innerHeight - 1040} />
      </div>
   );

   const columns2 = [
      { header: "재직코드", name: "subCode" , width: 100, align: "center" },
      { header: "재직구분명", name: "subCodeNm"},
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">재직구분</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} headerHeight={30} 
            handleFocusChange={() => {}} perPageYn={false} height={window.innerHeight - 1040} />
      </div>
   );

   const columns3 = [
      { header: "품목코드", name: "itemCd", width: 100, align: "center"  },
      { header: "품목명", name: "itemNm"},
   ];

   const grid3 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef3} columns={columns3} headerHeight={30} 
                      rowHeaders={["rowNum", "checkbox"]}
         handleFocusChange={() => {}} perPageYn={false} height={window.innerHeight - 1040} />
      </div>
   );

   const columns4 = [
      { header: "회사코드", name: "coCd",  hidden: true }, // 회사 코드
      { header: "계약번호", name: "contNo", hidden: true }, // 계약 번호
      { header: "재직코드", name: "subCode", width: 80, align: "center" }, // 재직 구분
      { header: "재직구분", name: "subCodeNm", width: 80, align: "center" }, // 재직 구분
      { header: "경조구분", name: "hsType", width: 80, align: "center" }, // 경조 구분
      { header: "경조코드", name: "hsTypeNm", width: 80, align: "center" }, // 경조 구분
      { header: "순번", name: "seqNo",  hidden: true }, // 순번
      { header: "품목코드", name: "itemCd", width: 100, align: "center"  }, // 품목 코드
      { header: "품목명", name: "itemNm",  }, // 품목 코드
      { header: "수량", name: "qty", width: 80, align: "right", editor : 'text' , 
      formatter: function(e: any) {if(e.value){return commas(e.value);} }
      }, // 수량
      { header: "복리단가", name: "priceCom", width: 100, align: "right",  editor : 'text' , 
      formatter: function(e: any) {if(e.value){return commas(e.value);} }
      }, 
      { header: "개별단가", name: "pricePer", width: 100, align: "right", editor : 'text' , 
      formatter: function(e: any) {if(e.value){return commas(e.value);} }
      }, // 가격(개인)
      { header: "필수여부", name: "mandatoryYn", width: 80, align: "center" }, // 필수 여부
      { header: "발주그룹코드", hidden :true}, // 지점 그룹
      { header: "발주그룹", name: "branchGroupNm", width: 100, align: "center" }, // 지점 그룹
      { header: "비고", name: "remark", width: 300, editor : 'text' }, // 비고
      { header: "상태", name: "status", hidden:true} // 상태
  ];
  

   const grid4 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">계약품목</div>
               
            </div>
            <div className="flex items-center justify-between w-full">
               {/* <div className="flex">
                  <button type="button" onClick={search} 
                     className="bg-rose-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                     <TrashIcon className="w-5 h-5 mr-1" />
                     전체삭제
                  </button>

               
               </div> */}

               <div className="grid grid-cols-2 gap-4 search">
                 

                  <SelectSearch
                     title="재직구분"
                     value={inputValues.subCode}
                     onChange={(label, value) => {

                        onInputChange("subCode", value);
                        handleFilterChange();
                      }}
                      datas={inputValues.subCodeDatas}
                  />

                   <SelectSearch
                     title="경조구분"
                     value={inputValues.hsType}
                     onChange={(label, value) => {
                        
                        onInputChange("hsType", value);
                        handleFilterChange();
                      }}
                      datas={inputValues.hsTypeDatas}
                  />

                  
               </div>
               
            
               <div className="flex space-x-2">
                  <button type="button" onClick={handleMakeItem} className="bg-green-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                     <ChevronDoubleDownIcon className="w-5 h-5 mr-1" />
                     내리기
                  </button>

                  <button type="button" onClick={save} className="bg-blue-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                     <ServerIcon className="w-5 h-5 mr-1" />
                     저장
                  </button>
               </div>

            </div>
         </div>

         <TuiGrid01 gridRef={gridRef4} columns={columns4} headerHeight={30} 
                      rowHeaders={["rowNum", "checkbox"]}
         handleFocusChange={() => {}} perPageYn={false} height={window.innerHeight - 640} />
      </div>
   );

   const columns5 = [
      { header: "계약번호", name: "contNo", width : 120, align: "center" },
      { header: "고객사", name: "bpNm",width : 300,   },
      { header: "계약명", name: "contNm",width : 200  },
      { header: "계약일자", name: "contDt",  width : 120,  align: "center"},
      { header: "시작일", name: "contFrDt",  width : 120,  align: "center"},
      { header: "종료일", name: "contToDt",  width : 120,  align: "center"},
      { header: "계약종류", name: "contTypeNm",  width : 100,  align: "center"},
   ];

   const grid5= () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
           
         </div>

         <TuiGrid01 gridRef={gridRef5} columns={columns5} headerHeight={30} 
                  handleFocusChange={() => {}}  handleDblClick={handleDblClick}
                  perPageYn={false} height={window.innerHeight - 640} />
      </div>
   );

   const columns6 = [
      { header: "고객사코드", name: "bpCd", width : 100, align: "center" },
      { header: "고객사명", name: "bpNm",  },
   ];

   const grid6 = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
           
         </div>

         <TuiGrid01 gridRef={gridRef6} columns={columns6} headerHeight={30} 
                  handleFocusChange={() => {}}  handleDblClick={handleDblClick2}
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
         <div className="grid grid-cols-3 gap-y-2 justify-start ">
            <InputSearchComp title="계약번호" 
               value={inputValues.contNo} 
               onChange={(e) => onInputChange("contNo", e)}
               onKeyDown={handleContNoOnKeyDown} 
               onIconClick={handleContNoOnIconClick} />
            
            <InputComp title="계약명" 
            value={inputValues.contNm} onChange={(e)=> onInputChange('contNm',e)} />

            <RadioGroup
               title="확정여부"
               value={inputValues.confirmYn}
               options={[
                  { label: "확정", value: "Y" },
                  { label: "미확정", value: "N" },
               ]}
               onChange={(e) => {
                  onInputChange("confirmYn", e);
               }}
               onClick={() => {
                  
               }}
            />

            <InputSearchComp title="고객사" ref={bpNmRef} value={inputValues.bpNm} 
               onChange={(e) => onInputChange("bpNm", e)} 
               onKeyDown={handleBpCdOnKeyDown} 
               onIconClick={handleBpCdOnIconClick} />

            <SelectSearch
               title="계약종류"
               value={inputValues.contType}
               onChange={(label, value) => {
                  
                  onInputChange("contType", value);
               }}
               //초기값 세팅시
               param={{ coCd: "999", majorCode: "FU0001", div: "" }}
               procedure="ZZ_CODE"
               dataKey={{ label: "codeName", value: "code" }}
            />


            <DatePickerComp
               title="계약체결일"
               value={inputValues.contDt}
               onChange={(e) => {
                  onInputChange("contDt", e);
               }}
               //format="yyyy-MM-dd HH:mm A"
               //timePicker={true}
            />

            <DateRangePickerComp
               title="계약기간"
               startValue={inputValues.contFrDt}
               endValue={inputValues.contToDt}
               onChange={(startDate, endDate) => {
                  onInputChange("contFrDt", startDate);
                  onInputChange("contToDt", endDate);
               }}
            />

            <SelectSearch
               title="청구조건"
               value={inputValues.payCond}
               onChange={(label, value) => {
                  onInputChange("payCond", value);
               }}
               //초기값 세팅시
               param={{ coCd: "999", majorCode: "FU0002", div: "" }}
               procedure="ZZ_CODE"
               dataKey={{ label: "codeName", value: "code" }}
            />
            <Checkbox
               title="MOU"
               value={inputValues.mouYn}
               onChange={(e) =>  onInputChange("mouYn", e)}
            />

            <SelectSearch
               title="담당부서"
               value={inputValues.chargeDept}
               onChange={(label, value) => {
                  
                  onInputChange("chargeDept", value);
               }}

               //초기값 세팅시
               param={{ coCd: "999", majorCode: "FU0010", div: "" }}
               procedure="ZZ_CODE"
               dataKey={{ label: "codeName", value: "code" }}
            />
         </div>
      </div>
   );

   const div2 = () => (
      <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
         <div className="space-y-3 ">
            <div className="grid grid-cols-1 gap-y-2">
               <RadioGroup
                  title="완료문자이미지 전송 여부"
                  value={inputValues.compSmsYn}
                  options={[
                     { label: "Y", value: "Y" },
                     { label: "N", value: "N" },
                  ]}
                  onChange={(e) => {
                  
                     onInputChange("compSmsYn", e);
                  }}
                  onClick={() => {
                     
                  }}
               />

               <RadioGroup
                  title="기타이미지 전송 여부"
                  value={inputValues.etcSmsYn}
                  options={[
                     { label: "Y", value: "Y" },
                     { label: "N", value: "N" },
                  ]}
                  onChange={(e) => {
                     
                     onInputChange("etcSmsYn", e);
                  }}
                  onClick={() => {
                     
                  }}
               />
            </div>
            <div className="w-full">
               <TextArea title="비고" value={inputValues.remark} onChange={(e) => onInputChange("remark", e)} display="flex" labelWidth="1/6" width="5/6" height="50" />
            </div>
            



         </div>
      </div>
   );


   const modalDiv = () => (
      <div className="space-y-3">
         <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
            <div className="w-full flex justify-between">
               <div className="grid grid-cols-1 ps-2 gap-x-3 gap-y-3   justify-start w-[70%]">
               <InputComp title="계약번호" ref={searchContNoRef} value={inputValues.searchContNo} 
               handleCallSearch={searchModalDiv}  onChange={(e) => onInputChange('searchContNo',e)}
          
               />
               </div>
               <div className="w-[20%] flex justify-end">
               <  button type="button" onClick={searchModalDiv} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
               </div>
            </div>
         </div>
         <div>{grid5()}</div>
      </div>
   );

   const modalDiv2 = () => (
      <div className="space-y-3">
         <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
            <div className="w-full flex justify-between">
               <div className="grid grid-cols-1  gap-y-3  justify-start w-[70%]">
               <InputComp title="고객사" ref={searchBpNmRef} value={inputValues.searchBpNm} handleCallSearch={searchModalDiv2}  onChange={(e) => onInputChange('searchBpNm',e)}/>
               </div>
               <div className="w-[20%] flex justify-end">
               <  button type="button" onClick={searchModalDiv2} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
               </div>
            </div>
         </div>
         <div>{grid6()}</div>
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
               <div className="w-2/3">{div1()}</div>
               <div className="w-1/3">{div2()}</div>
            </div>
            <div className="flex w-full space-x-2">
               <div className="w-2/6">{grid2()}</div>
               <div className="w-2/6">{grid1()}</div>
               <div className="w-3/6">{grid3()}</div>
            </div>
            <div>{grid4()}</div>
         </div>
         <CommonModal isOpen={inputValues.isOpen} size="md" onClose={() => {onInputChange("isOpen", false); contNoRef.current?.focus()}} title="">
            <div>{modalDiv()}</div>
         </CommonModal>
         <CommonModal isOpen={inputValues.isOpen2} size="sm" onClose={() => {onInputChange("isOpen2", false); bpNmRef.current?.focus()}} title="">
            <div>{modalDiv2()}</div>
         </CommonModal>
      </div>
   );
};

export default MM0602;
