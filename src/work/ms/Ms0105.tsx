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

const Ms0105 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      ownNm: '',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "모니터링" }, { name: "조회" }, { name: "만족도조사 조회" }];

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
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
          await MS0105_S01();
      };
  
      handleSearch();
  }, [inputValues.startDate, inputValues.endDate]);

 
   //---------------------- api -----------------------------

   const MS0105_S01 = async () => {
      try {
        const param = {
          startDt: inputValues.startDate,
          endDt: inputValues.endDate,
          ownNm: inputValues.ownNm || '999',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`MS0105_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }

        setGridDatas(result);
        
        return result;
      } catch (error) {
        console.error("MS0105_S01 Error:", error);
      }
    };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await MS0105_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await MS0105_S01();
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
            <DateRangePickerComp 
               title="설문일시"
               startValue={inputValues.startDate}
               endValue={inputValues.endDate}
               onChange={(startDate, endDate) => {
                  onInputChange('startDate', startDate);
                  onInputChange('endDate', endDate);   
               }}
            />
            <InputComp
               title="대상자"
               value={inputValues.ownNm}
               handleCallSearch={handleCallSearch}
               onChange={(value) => onInputChange('ownNm', value)}
            />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "주문번호", name: "soNo", align: "center", width: 100},
      { header: "대상자", name: "ownNm", width: 70, align: "center" },     
      { header: "관할본부", name: "bpNm", width: 120, align: "center" },     
      { header: "지도사", name: "usrNm", width: 70, align: "center" },     
      { header: "합계점수", name: "totalCnt", width: 70, align: "center" },     
      { header: "Q3", name: "q3", width: 100},
      { header: "A3", name: "a3", width: 90, align: "center"},
      { header: "Q1", name: "q1", width: 120},
      { header: "A1", name: "a1", width: 90, align: "center"},
      { header: "Q2", name: "q2", width: 120},
      { header: "A2", name: "a2", width: 90, align: "center"},
      { header: "Q4", name: "q4", width: 120},
      { header: "A4", name: "a4", width: 90, align: "center"},
      { header: "Q5", name: "q5", width: 120},
      { header: "A5", name: "a5", width: 400},
      { header: "Q6", name: "q6", width: 100},
      { header: "A6", name: "a6", width: 250},
      { header: "Q7", name: "q7", width: 100},
      { header: "A7", name: "a7", width: 600},
      { header: "Q8", name: "q8", width: 120},
      { header: "A8", name: "a8", width: 120, align: "center"},
      { header: "설문일시", name: "insrtDt", align: "center", width: 90},
   ];

   const Grid1 = () => {
      return (
         <div className="border rounded-md p-2 space-y-2">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">만족도 조사 리스트</div>
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} gridRef={GridRef1} height={window.innerHeight-495} />
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

export default Ms0105;