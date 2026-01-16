import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1,
   Tabs2,
} from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}
const Mm0604 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "기준정보" }, { name: "계약관리" }, { name: "계약조회" }];

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      gridDatas1: [],
      contNo: "",
      contNm: "",
      searchContNo: "",
      searchBpCd: "",
      contDt: "",
   });
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);
   const gridRef2 = useRef<any>(null);
   const gridContainerRef2 = useRef(null);

   const contNoRef = useRef<HTMLInputElement>(null);
   const searchContNoRef = useRef<HTMLInputElement>(null);
   const searchBpCdRef = useRef<HTMLInputElement>(null);

   const { fetchWithLoading } = useLoadingFetch();

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
         ...prevValues,
         [name]: value,
      }));
   };

   //------------------api--------------------------


   const ZZ_CONT_INFO = async (contNo:any, searchDiv:any) => {  

      const param = {
         contNo: contNo,
         bpCd: inputValues.bpCd,
         subCode: inputValues.subCode || "999",
         searchDiv: searchDiv,
         hsType: inputValues.hsType || "999",
      };

      const data = JSON.stringify(param);

      const result = await fetchPost("ZZ_CONT_INFO", { data });

      if (searchDiv === "SUB") {
         let subCodeDatas = [
            { value: "", label: "전체" }, // '전체' 항목을 추가
            ...result.map((item: any) => ({
               value: item.subCode,
               label: item.subCodeNm,
            })),
         ];
         onInputChange("subCodeDatas", subCodeDatas);
         onInputChange("subCode", "");
      } else if (searchDiv === "BP_HS") {
         let hsTypeDatas = [
            { value: "", label: "전체" }, // '전체' 항목을 추가
            ...result.map((item: any) => ({
               value: item.hsType,
               label: item.hsTypeNm,
            })),
         ];

         onInputChange("hsTypeDatas", hsTypeDatas);
         onInputChange("hsType", "");
      }else if(searchDiv === 'ITEM_TYPE'){
         let itemTypeDatas=
            [
               { value: '', label: '전체' }, // '전체' 항목을 추가
               ...result.map((item: any) => ({
                   value: item.itemType,
                   label: item.itemTypeNm,
               })),
           ];
    console.log(itemTypeDatas);
         onInputChange('itemTypeDatas',itemTypeDatas);
         onInputChange("itemType", '');
      }

      return result;
   };

   const MM0602_S01 = async (contNo: string, bpNm: string) => {
      const param = {
         contNo: contNo,
         bpNm: bpNm,
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0602_S01", { data });

      return result;
   };

   
   const MM0604_S01 = async (contNo: string) => {
      const param = {
         contNo: contNo || '999',
         contNm: inputValues.contNm || '999',
         contDt: inputValues.contDt || '',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0604_S01", { data });
      console.log(param);

      onInputChange("gridDatas1", result);
      return result;

   };

   //------------------useEffect--------------------------
   useEffect(() => {
   
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      search();
   
   }, []);

   useEffect(() => {
      if (gridRef.current && inputValues.gridDatas1?.length > 0) {
         const grid = gridRef.current.getInstance();
         grid.resetData(inputValues.gridDatas1);
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
      handleFilterChange();
   }, [inputValues.hsType, inputValues.subCode, inputValues.itemType]);
   
   useEffect(() => {
      if (inputValues.contNo) {
         ZZ_CONT_INFO(inputValues.contNo,'BP_HS');
         ZZ_CONT_INFO(inputValues.contNo,'ITEM_TYPE');
      }
   }, [inputValues.subCode]);

   useEffect(() => {
      if (inputValues.contNo) {
         ZZ_CONT_INFO(inputValues.contNo,'ITEM_TYPE');
      }
   }, [inputValues.hsType]);


   //-------------------event--------------------------

   const handleFilterChange = () => {
     

      const filteredData = filterGridData();
   
      if (gridRef.current) {
         const grid = gridRef.current.getInstance();
         grid.resetData(filteredData);
      }
   };

   const filterGridData = () => {
      let filteredData = inputValues.gridDatas1;
   
      // 경조구분 필터링
      if (inputValues.hsType) {
         filteredData = filteredData.filter((item: any) => item.hsType === inputValues.hsType);
      }
   
      // 재직구분 필터링
      if (inputValues.subCode) {
         filteredData = filteredData.filter((item: any) => item.subCode === inputValues.subCode);
      }

      // 지원타입 필터링
      if (inputValues.itemType) {
         filteredData = filteredData.filter((item: any) => item.itemType === inputValues.itemType);
      }
   
      return filteredData;
   };

   const setCoCdChange = async (e: any) => {
      MM0604_S01(e);
      ZZ_CONT_INFO(e, "SUB");
      ZZ_CONT_INFO(e, "BP_HS");
      ZZ_CONT_INFO(e, "ITEM_TYPE");
   };

   const handleContNoOnKeyDown = async (e: any) => {
      const target = e.target as HTMLInputElement;
      inputValues.contNo = target.value;
      onInputChange("searchContNo", target.value);

      const result = await MM0602_S01(inputValues.contNo, '');
      onInputChange("gridDatas5", result);

      if (result.length === 1) {
         Object.entries(result[0]).forEach(([key, value]) => {
            onInputChange(key, value);
         });

         setCoCdChange(inputValues.contNo);
      } else {
         onInputChange("isOpen", true);
      }
   };

   const handleContNoOnIconClick = async (e: any) => {
      onInputChange("searchContNo", e);
      const result = await MM0602_S01(e,'');
      onInputChange("gridDatas2", result);
      onInputChange("isOpen", true);
   };

   const handleDblClick = async (e: any) => {
      const gridInstance = gridRef2.current.getInstance(); 
      const rowData = gridInstance.getRow(e.rowKey);
     
      if(rowData) {
         
         onInputChange("contNo", rowData.contNo);
         onInputChange("isOpen", false);
         setCoCdChange(rowData.contNo);
      }
   };

   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await MM0604_S01(inputValues.contNo);
            if (gridRef.current) {
               const grid = gridRef.current.getInstance();
               grid.resetData(result || []);
            }
         } catch (error) {
            console.error("setGridData Error:", error);
         }
      });
   };

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await MM0604_S01(inputValues.contNo);
            if (gridRef.current) {
               const grid = gridRef.current.getInstance();
               grid.resetData(result || []);
            }
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   const columns = [
      // { header: "회사코드", name: "coCd", hidden: true }, // 회사 코드
      {header: "계약번호", name: "contNo", width: 120, align: "center" }, // 계약 번호
      { header: "고객사명", name: "bpNm", width: 200 }, // 고객사 명
      // { header: "재직구분명", name: "subCodeNm", width: 150 }, // 재직 구분 명
      // { header: "경조구분명", name: "hsTypeNm", width: 150 }, // 경조 구분 명
      // { header: "지원타입명", name: "itemTypeNm", width: 150 }, // 경조 구분 명
      // { header: "품목명", name: "itemNm", width: 200 }, // 품목 명
      // { header: "수량", name: "qty", width: 80, align: "center", formatter: (e: any) => commas(e.value) }, // 수량
      // { header: "복리단가", name: "priceCom", width: 100, align: "right", formatter: (e: any) => commas(e.value) }, // 복리 단가
      // { header: "개별단가", name: "pricePer", width: 100, align: "right", formatter: (e: any) => commas(e.value) }, // 개별 단가
      // { header: "필수여부", name: "mandatoryYn", width: 80, align: "center" }, // 필수 여부
      // { header: "발주그룹코드", name: "branchGroup", hidden: true }, // 발주 그룹 코드
      // { header: "발주그룹명", name: "branchGroupNm", width: 100, align: "center" }, // 발주 그룹 명
      // { header: "비고", name: "dtlRemark", width: 300 }, // 비고 (DTL)
      { header: "계약명", name: "contNm", width: 200 }, // 계약 명
      { header: "고객사코드", name: "bpCd", hidden: true }, // 고객사 코드
      { header: "계약일자", name: "contDt", width: 120, align: "center" }, // 계약 일자
      { header: "시작일", name: "contFrDt", width: 120, align: "center" }, // 시작 일자
      { header: "종료일", name: "contToDt", width: 120, align: "center" }, // 종료 일자
      { header: "계약종류", name: "contType", hidden: true }, // 계약 종류 코드
      { header: "계약종류명", name: "contTypeNm", width: 150, align: "center" }, // 계약 종류 명
      { header: "완료문자전송", name: "compSmsYn", width: 100, align: "center" }, // 완료 문자 전송 여부
      { header: "기타문자전송", name: "etcSmsYn", width: 100, align: "center" }, // 기타 문자 전송 여부
      { header: "배송전", name: "dlvyBeforeYn", width: 100, align: "center", hidden: true  }, // 배송 전 여부
      { header: "배송후", name: "dlvyAfterYn", width: 100, align: "center", hidden: true  }, // 배송 후 여부
      { header: "MOU 여부", name: "mouYn", width: 80, align: "center" }, // MOU 여부
      { header: "청구조건", name: "payCondNm", width: 120, align: "center" }, // 청구 조건
      { header: "확정여부", name: "confirmYn", width: 80, align: "center" }, // 확정 여부
      { header: "담당부서", name: "chargeDept", width: 150 }, // 담당 부서
      { header: "비고", name: "hdrRemark", width: 300, }, // 비고 (HDR)
      { header: "경조코드", name: "hsType", width: 80, align: "center" }, // 경조 코드
      
      { header: "재직코드", name: "subCode", width: 80, align: "center" }, // 재직 코드
      
      { header: "순번", name: "seqNo", hidden: true }, // 순번
      { header: "품목코드", name: "itemCd", width: 100, align: "center" }, // 품목 코드
      
      { header: "상태", name: "status", hidden: true }, // 상태
  ];

  const summary = {
   height: 40,
   position: 'top', 
   columnContent: {
      // bpNm: {
      //      template: (e:any) => {
      //          return  `총 ${e.cnt}개`;
           
      //      }
      //  },     
       itemQty: {
         template: (e:any) => {
             return `합계 : `;
         }
      },
      priceCom: {
         template: (e:any) => {                  
            const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
            return `${commas(data)}`; // 합계 표시
            }
      },   
      pricePer: {
         template: (e:any) => {                  
            const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
            return `${commas(data)}`; // 합계 표시
            }
      },  
   }
}
  
   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">계약리스트</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={() => {}} height={window.innerHeight - 520} summary={summary} perPageYn={true} />
      </div>
   );


   const columns2 = [
      { header: "계약번호", name: "contNo", width : 120, align: "center" },
      { header: "고객사", name: "bpNm",width : 300,   },
      { header: "계약명", name: "contNm",width : 200  },
      { header: "계약일자", name: "contDt",  width : 120,  align: "center"},
      { header: "시작일", name: "contFrDt",  width : 120,  align: "center"},
      { header: "종료일", name: "contToDt",  width : 120,  align: "center"},
      { header: "계약종류", name: "contTypeNm",  width : 100,  align: "center"},
   ];

   const grid2= () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
           
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} headerHeight={30} 
                  handleFocusChange={() => {}}  handleDblClick={handleDblClick}
                  perPageYn={false} height={window.innerHeight - 640} />
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
      <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
         <div className="grid grid-cols-4 gap-y-2 justify-start w-[70%]">
            <InputSearchComp title="계약번호" value={inputValues.contNo} onChange={(e) => onInputChange("contNo", e)} onKeyDown={handleContNoOnKeyDown} onIconClick={handleContNoOnIconClick} />
            <InputComp 
               title="계약명"
               value={inputValues.contNm}
               onChange={(e) => {
                  onInputChange("contNm", e);
               }}
               handleCallSearch={search}
            />
            <DatePickerComp
               title="계약기준일"
               value={inputValues.contDt}
               onChange={(e) => {
                  onInputChange("contDt", e);
               }}
            />
         </div>
        
      </div>
   );

   const searchModalDiv = async () => {
      
      const result = await MM0602_S01(inputValues.searchContNo, inputValues.searchBpCd);
      onInputChange("gridDatas2", result);
    
   }


   const modalDiv = () => (
      <div className="space-y-3">
         <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
            <div className="w-full flex justify-between">
               <div className="grid grid-cols-2 ps-2 gap-x-3 gap-y-3   justify-start w-[70%]">
               <InputComp title="계약번호" ref={searchContNoRef} value={inputValues.searchContNo} 
               handleCallSearch={searchModalDiv}  onChange={(e) => onInputChange('searchContNo',e)}
          
               />
               <InputComp title="고객사" ref={searchBpCdRef} value={inputValues.searchBpCd} 
               handleCallSearch={searchModalDiv}  onChange={(e) => onInputChange('searchBpCd',e)}
          
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
         <div>{grid2()}</div>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto`}>
         <LoadingSpinner />
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-full" ref={gridContainerRef}>
               {grid()}
            </div>
         </div>

         <CommonModal isOpen={inputValues.isOpen} size="md" onClose={() => {onInputChange("isOpen", false); contNoRef.current?.focus()}} title="">
            <div>{modalDiv()}</div>
         </CommonModal>
      </div>
   );
};

export default Mm0604;
