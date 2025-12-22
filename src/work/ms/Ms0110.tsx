import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, DatePickerComp, RadioGroup, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, DateRangePickerComp, date } from "../../comp/Import";
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

const Ms0110 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      yyyyMm: date(-1, 'month'),
      itemNm: '999',
      ownNm: '999',
      deptDiv: '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "모니터링" }, { name: "조회" }, { name: "당사, 타부서 지원현황" }];

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
      // inputValues 중 날짜 또는 구분이 변경되면 검색을 실행
      const handleSearch = async () => {
          await MS0110_S01();
      };
  
      handleSearch();
  }, [inputValues.yyyyMm, inputValues.deptDiv]);

 
   //---------------------- api -----------------------------

   const MS0110_S01 = async () => {
      const yyyyMm = inputValues.yyyyMm ? inputValues.yyyyMm.slice(0, 7).replace('-','') : '';
      
      try {
        const param = {
          yyyyMm: yyyyMm,
          itemNm: inputValues.itemNm || '999',
          ownNm: inputValues.ownNm || '999',
          deptDiv: inputValues.deptDiv || '999',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`MS0110_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }

        setGridDatas(result);
        
        return result;
      } catch (error) {
        console.error("MS0110_S01 Error:", error);
      }
    };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await MS0110_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      await MS0110_S01();
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
            <InputComp 
               title="품목명"
               value={inputValues.itemNm === '999' ? '' : inputValues.itemNm}
               layout="flex"
               textAlign="right"
               minWidth="80px"
               onChange={(value: string) => { 
                  onInputChange('itemNm', value || '999');  
               }}
               handleCallSearch={search}
            />
            <InputComp 
               title="대상자명"
               value={inputValues.ownNm === '999' ? '' : inputValues.ownNm}
               layout="flex"
               textAlign="right"
               minWidth="80px"
               onChange={(value: string) => { 
                  onInputChange('ownNm', value || '999');  
               }}
               handleCallSearch={search}
            />
            <SelectSearchComp
               title="구분"
               value={inputValues.deptDiv}
               layout="horizontal"
               onChange={(label: string, value: string) => { 
                  onInputChange('deptDiv', value);  
               }}
               datas={[
                  { value: '999', label: '전체' },
                  { value: '당사', label: '당사' },
                  { value: '타부서', label: '타부서' },
               ]}
               dataKey={{ value: 'value', label: 'label' }}
            />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "주문번호", name: "soNo", align: "center", minWidth: 120 },
      { header: "주문일자", name: "orderDt", align: "center", minWidth: 100 },
      { header: "고객사코드", name: "soldToParty", align: "center", minWidth: 100 },
      { header: "고객사명", name: "bpNm", align: "left", minWidth: 150 },
      { header: "대상자명", name: "ownNm", align: "center", minWidth: 100 },
      { header: "주문자", name: "reqNm", align: "center", minWidth: 100 },
      { header: "부서명", name: "deptNm", align: "center", minWidth: 100 },
      { header: "직급", name: "roleNm", align: "center", minWidth: 80 },
      { header: "사유", name: "reason", align: "center", minWidth: 120 },
      { header: "구분", name: "remark1", align: "center", minWidth: 80 },
      { header: "품목코드", name: "itemCd", align: "center", minWidth: 100 },
      { header: "품목명", name: "itemNm", align: "left", minWidth: 150 },
      { header: "수량", name: "soQty", minWidth: 80, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "금액", name: "soAmt", minWidth: 120, align: "right", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
   ];

   // 합계 정의
   const summary = {
      height: 40,
      position: 'top', 
      columnContent: {
         soNo: {
            template: (e:any) => { return `합계 : `; }
         },
         soQty: { template: (e:any) => `${commas(e.sum)}` },
         soAmt: { template: (e:any) => `${commas(e.sum)}` },
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
                  <div className="">당사, 타부서 지원현황</div>
               </div>
            </div>
   
            <TuiGrid01 
               columns={grid1Columns} 
               gridRef={GridRef1} 
               height={window.innerHeight-495}
               headerHeight={50}
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

export default Ms0110;

