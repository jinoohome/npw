import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, DatePickerComp, RadioGroup, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, PencilIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Ms0108 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);
   const GridRef2 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);
   const grid2GridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);

   const [gridDatas1, setGridDatas1] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [tabIndex, setTabIndex] = useState(0);

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      yyyyMm: date(-1, 'month'),
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "모니터링" }, { name: "조회" }, { name: "화환 매출 현황" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef2, containerRef: grid2GridContainerRef, sec: 200 });
   }, []);

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      // refreshGrid(GridRef1);
   
   }, [activeComp, leftMode]);

   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         const gridInstance = GridRef1.current.getInstance();
         gridInstance.resetData(gridDatas1);
      }
   }, [gridDatas1]);

   useEffect(() => {
      if (GridRef2.current && gridDatas2) {
         const gridInstance = GridRef2.current.getInstance();
         gridInstance.resetData(gridDatas2);
      }
   }, [gridDatas2]);

   useEffect(() => {
      // inputValues 중 날짜가 변경되면 검색을 실행
      const handleSearch = async () => {
          await MS0108_S01();
          await MS0108_S02();
      };
  
      handleSearch();
  }, [inputValues.yyyyMm]);

   const handleTabIndex = (index: number) => {
      setTabIndex(index);
   };

 
   //---------------------- api -----------------------------

   // 금액기준 조회
   const MS0108_S01 = async () => {
      const yyyyMm = inputValues.yyyyMm ? inputValues.yyyyMm.slice(0, 7).replace('-','') : '';
      
      try {
        const param = {
          yyyyMm: yyyyMm,
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`MS0108_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas1([]);
          return;
        }

        setGridDatas1(result);
        
        return result;
      } catch (error) {
        console.error("MS0108_S01 Error:", error);
      }
    };

   // 품목기준 조회
   const MS0108_S02 = async () => {
      const yyyyMm = inputValues.yyyyMm ? inputValues.yyyyMm.slice(0, 7).replace('-','') : '';
      
      try {
        const param = {
          yyyyMm: yyyyMm,
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`MS0108_S02`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas2([]);
          return;
        }

        setGridDatas2(result);
        
        return result;
      } catch (error) {
        console.error("MS0108_S02 Error:", error);
      }
    };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await MS0108_S01();
            await MS0108_S02();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      await MS0108_S01();
   };

   //-------------------button--------------------------  
   

   //-------------------div--------------------------

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
      </div>
   );

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm">
         <div className="grid gap-y-3 justify-start w-[80%] 2xl:w-[80%] xl:grid-cols-4 md:grid-cols-2">
            <DatePickerComp 
               title="조회년월"
               value={inputValues.yyyyMm}
               layout="flex"
               textAlign="right"
               minWidth="100px"
               onChange={(e) => { 
                  onInputChange('yyyyMm', e);  
               }} 
               format="yyyy-MM"
               type="month"
            />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   // 금액기준 컬럼 (상단 표)
   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "단가", name: "costPrice", minWidth: 80, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 기본
      { header: "수량", name: "baseQty", minWidth: 70, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출", name: "baseSales", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가", name: "baseCost", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 당사
      { header: "수량", name: "ownQty", minWidth: 70, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출", name: "ownSales", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가", name: "ownCost", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 타부서
      { header: "수량", name: "deptQty", minWidth: 70, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출", name: "deptSales", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가", name: "deptCost", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 합계
      { header: "수량", name: "totalQty", minWidth: 70, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출\n(A)", name: "totalSales", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가\n(B)", name: "totalCost", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출이익\n(A-B)", name: "profit", minWidth: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
   ];

   // 품목기준 컬럼 (하단 표)
   const grid2Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "품목코드", name: "itemCd", minWidth: 90, align: "center" },
      { header: "품목명", name: "itemNm", minWidth: 120, align: "left" },
      { header: "단가", name: "costPrice", minWidth: 80, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 기본
      { header: "수량", name: "baseQty", minWidth: 60, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출", name: "baseSales", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가", name: "baseCost", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 당사
      { header: "수량", name: "ownQty", minWidth: 60, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출", name: "ownSales", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가", name: "ownCost", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 타부서
      { header: "수량", name: "deptQty", minWidth: 60, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출", name: "deptSales", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가", name: "deptCost", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // 합계
      { header: "수량", name: "totalQty", minWidth: 60, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출\n(A)", name: "totalSales", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "원가\n(B)", name: "totalCost", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출이익\n(A-B)", name: "profit", minWidth: 90, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
   ];

   // 복합 헤더 (금액기준)
   const complexColumns1 = [
      { header: "기본", name: "baseGroup", childNames: ["baseQty", "baseSales", "baseCost"] },
      { header: "당사", name: "ownGroup", childNames: ["ownQty", "ownSales", "ownCost"] },
      { header: "타부서", name: "deptGroup", childNames: ["deptQty", "deptSales", "deptCost"] },
      { header: "합계", name: "totalGroup", childNames: ["totalQty", "totalSales", "totalCost", "profit"] },
   ];

   // 복합 헤더 (품목기준)
   const complexColumns2 = [
      { header: "기본", name: "baseGroup", childNames: ["baseQty", "baseSales", "baseCost"] },
      { header: "당사", name: "ownGroup", childNames: ["ownQty", "ownSales", "ownCost"] },
      { header: "타부서", name: "deptGroup", childNames: ["deptQty", "deptSales", "deptCost"] },
      { header: "합계", name: "totalGroup", childNames: ["totalQty", "totalSales", "totalCost", "profit"] },
   ];

   // 합계 정의 (금액기준)
   const summary1 = {
      height: 40,
      position: 'top', 
      columnContent: {
         costPrice: {
            template: (e:any) => { return `합계`; }
         },
         baseQty: { template: (e:any) => `${commas(e.sum)}` },
         baseSales: { template: (e:any) => `${commas(e.sum)}` },
         baseCost: { template: (e:any) => `${commas(e.sum)}` },
         ownQty: { template: (e:any) => `${commas(e.sum)}` },
         ownSales: { template: (e:any) => `${commas(e.sum)}` },
         ownCost: { template: (e:any) => `${commas(e.sum)}` },
         deptQty: { template: (e:any) => `${commas(e.sum)}` },
         deptSales: { template: (e:any) => `${commas(e.sum)}` },
         deptCost: { template: (e:any) => `${commas(e.sum)}` },
         totalQty: { template: (e:any) => `${commas(e.sum)}` },
         totalSales: { template: (e:any) => `${commas(e.sum)}` },
         totalCost: { template: (e:any) => `${commas(e.sum)}` },
         profit: { template: (e:any) => `${commas(e.sum)}` },
      }
   };

   // 합계 정의 (품목기준)
   const summary2 = {
      height: 40,
      position: 'top', 
      columnContent: {
         itemNm: {
            template: (e:any) => { return `합계`; }
         },
         baseQty: { template: (e:any) => `${commas(e.sum)}` },
         baseSales: { template: (e:any) => `${commas(e.sum)}` },
         baseCost: { template: (e:any) => `${commas(e.sum)}` },
         ownQty: { template: (e:any) => `${commas(e.sum)}` },
         ownSales: { template: (e:any) => `${commas(e.sum)}` },
         ownCost: { template: (e:any) => `${commas(e.sum)}` },
         deptQty: { template: (e:any) => `${commas(e.sum)}` },
         deptSales: { template: (e:any) => `${commas(e.sum)}` },
         deptCost: { template: (e:any) => `${commas(e.sum)}` },
         totalQty: { template: (e:any) => `${commas(e.sum)}` },
         totalSales: { template: (e:any) => `${commas(e.sum)}` },
         totalCost: { template: (e:any) => `${commas(e.sum)}` },
         profit: { template: (e:any) => `${commas(e.sum)}` },
      }
   };

   // 금액기준 그리드
   const Grid1 = () => {
      return (
         <div className="border rounded-md p-2 space-y-2 w-full overflow-x-auto">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">금액기준</div>
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} gridRef={GridRef1} height={window.innerHeight-495} summary={summary1} complexColumns={complexColumns1} headerHeight={80} />
         </div>
      );
   };

   // 품목기준 그리드
   const Grid2 = () => {
      return (
         <div className="border rounded-md p-2 space-y-2 w-full overflow-x-auto">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">품목기준</div>
               </div>
            </div>
   
            <TuiGrid01 columns={grid2Columns} gridRef={GridRef2} height={window.innerHeight-495} summary={summary2} complexColumns={complexColumns2} headerHeight={80} />
         </div>
      );
   };

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
         <div className="w-full h-full p-2">
            <div className="flex text-sm">
               <div
                  className={`p-1 w-[80px] text-center rounded-t-lg cursor-pointer
                              ${tabIndex === 0 ? "text-blue-500 border border-b-0 bg-white" : "text-gray-500 bg-gray-100"}
                  `}
                  onClick={() => handleTabIndex(0)}
               >
                  금액기준
               </div>
               <div
                  className={`p-1 w-[80px] text-center rounded-t-lg cursor-pointer
                              ${tabIndex === 1 ? "text-blue-500 border border-b-0 bg-white" : "text-gray-500 bg-gray-100"}
                  `}
                  onClick={() => handleTabIndex(1)}
               >
                  품목기준
               </div>
            </div>
            <div className={`w-full ${tabIndex === 0 ? "" : "hidden"}`} ref={gridGridContainerRef}>{Grid1()}</div>
            <div className={`w-full ${tabIndex === 1 ? "" : "hidden"}`} ref={grid2GridContainerRef}>{Grid2()}</div>
         </div>
      </div>
   );
};

export default Ms0108;
