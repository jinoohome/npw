import { React, useEffect, useState, useRef, SelectSearch, useCallback, initChoice, updateChoices, alertSwal, DatePickerComp, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, CheckIcon, XMarkIcon, CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';
import { hi } from "date-fns/locale";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Ms0103 = ({ item, activeComp, leftMode, userInfo }: Props) => {

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      yyyyMm: date(),
      poBpCd: userInfo.usrDiv !== '999' ? userInfo.bpCd : '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "모니터링" }, { name: "조회" }, { name: "본부 정산" }];

   const { fetchWithLoading } = useLoadingFetch();

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
   }, []);

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      // refreshGrid(GridRef1);
   
   }, [activeComp, leftMode]);

   // Grid 데이터 설정
   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         let grid1 = GridRef1.current.getInstance();
         grid1.resetData(gridDatas1);

         // let focusRowKey = grid1.getFocusedCell()?.rowKey || 0;

         // if (gridDatas1.length > 0) {
         //    grid1.focusAt(focusRowKey, 0, true);
         // }
         
         
      } 
   }, [gridDatas1]);

   useEffect(() => {
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
          await MS0103_S01();
      };
  
      handleSearch();
  }, [inputValues.yyyyMm, inputValues.poBpCd]);

 
   //---------------------- api -----------------------------

   const MS0103_S01 = async () => {
      try {
        const param = {
          yyyyMm: inputValues.yyyyMm,
          poBpCd: inputValues.poBpCd,          
          itemNm: searchRef1.current?.value || '999',          
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`MS0103_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }
        
        // 딜레이를 주어 그리드가 데이터를 안정적으로 처리할 시간을 줌
        setTimeout(() => {
          setGridDatas(result);
        }, 200);  // 100ms 딜레이 추가
    
        return result;
      } catch (error) {
        console.error("MS0103_S01 Error:", error);
      }
    };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await MS0103_S01();
            setGridDatas(result);
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   const handleCallSearch = async () => {
      await fetchWithLoading(async () => {      
         try {
            await MS0103_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
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
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[80%]  xl:grid-cols-4 md:grid-cols-2">
            <DatePickerComp 
               title="마감년월"
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
            <SelectSearch  title="관할구역" 
               value={inputValues.poBpCd}
               onChange={(label, value) => {
                     onInputChange('poBpCd', value);
                  }}

               readonly={userInfo.usrDiv !== '999' ? true : false}
               addData={"999"}

               //초기값 세팅시
               stringify={true}
               param={{ coCd: "100",bpType : "ZZ0003", bpNm : '999', bpDiv: '999' }}
               procedure="ZZ_B_PO_BP"
               dataKey={{ label: "bpNm", value: "bpCd" }}
               />  
               <InputComp title="품목명" ref={searchRef1} value={inputValues.itemNm} handleCallSearch={handleCallSearch} 
                     onChange={(e)=>{
                     onInputChange('itemNm', e);
               }} />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "마감년월", name: "yyyyMm", align: "center", width: 130, hidden: true},
      { header: "본부코드", name: "poBpCd", align: "center", width: 130, rowSpan: true},
      { header: "본부명", name: "poBpNm", width: 250, rowSpan: true},
      { header: "대표자", name: "repreNm", align: "center", width: 80, rowSpan: true},
      { header: "품목코드", name: "itemCd", width: 120},
      { header: "품목명", name: "itemNm", width: 350},
      { header: "수수료율", name: "bpRate", width: 120, align: "right"},
      { header: "수량", name: "soQty", align: "center", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "단가", name: "cost", align: "right", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "수수료", name: "purchaseAmt", align: "right", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
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
         poBpNm: {
            template: (e:any) => {
                return `합계 : `;
            }
         },
         purchaseAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
      }
   }

   const Grid1 = () => {   
      return (
         <div className="border rounded-md p-2 space-y-2">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">정산 리스트</div>
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} perPageYn={false} rowHeaders={['rowNum']} gridRef={GridRef1} height={window.innerHeight-455} summary={summary}/>
         </div>
      );
   };

   return (
      <div className={`space-y-2 overflow-y-auto`}>
         <LoadingSpinner />
         <div className="space-y-1">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full md:flex md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-full" ref={gridGridContainerRef}>{Grid1()}</div>
         </div>
      </div>
   );
};

export default Ms0103;
