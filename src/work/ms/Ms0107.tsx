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

const Ms0107 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      yyyyMm: date(-1, 'month'),
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "모니터링" }, { name: "조회" }, { name: "용품 및 도우미 매출 현황" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
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
      // inputValues 중 날짜가 변경되면 검색을 실행
      const handleSearch = async () => {
          await MS0107_S01();
      };
  
      handleSearch();
  }, [inputValues.yyyyMm]);

 
   //---------------------- api -----------------------------

   const MS0107_S01 = async () => {
      const yyyyMm = inputValues.yyyyMm ? inputValues.yyyyMm.slice(0, 7).replace('-','') : '';
      
      try {
        const param = {
          yyyyMm: yyyyMm,
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`MS0107_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }

        setGridDatas(result);
        
        return result;
      } catch (error) {
        console.error("MS0107_S01 Error:", error);
      }
    };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await MS0107_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      await MS0107_S01();
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

   const grid1Columns = [
      { header: "", name: "poBpCd", hidden: true },
      { header: "업체명", name: "bpFullNm", align: "center", width: 200 },
      { header: "조사용품", name: "box", width: 80, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "편의용품", name: "boxPyun", width: 80, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "조사용품\n(남해화학)", name: "boxNam", width: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "조사용품\n(NH투자증권)", name: "boxTu", width: 120, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "조사용품\n(진접농협)", name: "boxJin", width: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "조사용품\n(별내농협)", name: "boxByul", width: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "접객도우미\n(중앙회)", name: "dowme", width: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "접객도우미\n(투자증권)", name: "dowmeTu", width: 120, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출", name: "soAmt", width: 120, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "업체위탁비\n(B1)", name: "purchaseAmt", width: 120, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "타부서원가배분\n(B2)", name: "purchaseAmtEtc", width: 150, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "물품구매비\n(B3)", name: "buyAmt", width: 120, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출이익\n(A-B1+B2-B3)", name: "benefit", width: 150, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "기타", name: "remark2", width: 100, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "권역", name: "poBpNm", width: 100, align: "center" },
   ];

   // 컬럼 그룹 정의
   const complexColumns = [
      {
         header: "세부",
         name: "detailGroup",
         childNames: ["box", "boxPyun", "boxNam", "boxTu", "boxJin", "boxByul", "dowme", "dowmeTu"]
      },
      {
         header: "",
         name: "costGroup",
         childNames: ["purchaseAmt", "purchaseAmtEtc", "buyAmt"]
      }
   ];

   // 합계 정의
   const summary = {
      height: 40,
      position: 'top', 
      columnContent: {
         bpFullNm: {
            template: (e:any) => {
                return `합계 : `;
            }
         },
         box: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         boxPyun: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         boxNam: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         boxTu: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         boxJin: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         boxByul: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         dowme: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         dowmeTu: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         soAmt: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         purchaseAmt: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         purchaseAmtEtc: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         buyAmt: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         benefit: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
         remark2: {
            template: (e:any) => {                  
               const data = e.sum;           
               return `${commas(data)}`;
            }
         },
      }
   };

   const Grid1 = () => {
      return (
         <div className="border rounded-md p-2 space-y-2">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">용품 및 도우미 매출 현황</div>
               </div>
            </div>
   
            <TuiGrid01 
               columns={grid1Columns} 
               gridRef={GridRef1} 
               height={window.innerHeight-495}
               complexColumns={complexColumns}
               headerHeight={80}
               summary={summary}
            />
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
         <div className="w-full h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-full" ref={gridGridContainerRef}>{Grid1()}</div>
         </div>
      </div>
   );
};

export default Ms0107;
