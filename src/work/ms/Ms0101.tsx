import { React, useEffect, useState, useRef, CommonModal, useCallback, initChoice, updateChoices, alertSwal, DatePickerComp, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ZZ_MENU_RES } from "../../ts/ZZ_MENU";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, CheckIcon, XMarkIcon, CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
   handleAddMenuClick: (menuItem: ZZ_MENU_RES ) => void;
   setSoNo: (value: string) => void;
}

const Ms0101 = ({ item, activeComp, leftMode, userInfo, handleAddMenuClick, setSoNo }: Props) => {

   const GridRef1 = useRef<any>(null);
   const gridRefP1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);
   const gridGridContainerRefP1 = useRef(null);

   //검색창 ref

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatasP1, setGridDatasP1] = useState<any[]>();
   const [isOpen, setIsOpen] = useState(false);

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      status: '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "모니터링" }, { name: "조회" }, { name: "현장 대시보드" }];

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

         let focusRowKey = grid1.getFocusedCell()?.rowKey || 0;

         if (gridDatas1.length > 0) {
            grid1.focusAt(focusRowKey, 0, true);
         }
         
         
      } 
   }, [gridDatas1]);

   // Grid 데이터 설정
   useEffect(() => {
      if (gridRefP1.current && gridDatasP1) {
         let gridP1 = gridRefP1.current.getInstance();
         gridP1.resetData(gridDatasP1);    
         
         refreshGrid(gridRefP1);
         
      } 
   }, [gridDatasP1]);

   useEffect(() => {
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
          await MS0101_S01();
      };
  
      handleSearch();
  }, [inputValues.startDate, inputValues.endDate]);

 
   //---------------------- api -----------------------------

   const MS0101_S01 = async () => {
      try {
        const param = {
          startDt: inputValues.startDate,
          endDt: inputValues.endDate,          
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`MS0101_S01`, { data });
    
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
        console.error("SM0101_S01 Error:", error);
      }
    };

    const MS0101_P01 = async (extraParam?: any) => {
      try {
         const baseParam = {
            startDt: inputValues.startDate,
            endDt: inputValues.endDate,
         };
   
         const param = {
            ...baseParam,
            ...(extraParam || {})
         };
   
         const data = JSON.stringify(param);
         const result = await fetchPost(`MS0101_P01`, { data });
   
         if (!result || result.length === 0) {
            setGridDatasP1([]);
            return;
         }
   
         setTimeout(() => {
            setGridDatasP1(result);
         }, 200);
   
         return result;
      } catch (error) {
         console.error("MS0101_P01 Error:", error);
      }
   };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await MS0101_S01();
            setGridDatas(result);
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   const handleClick = async (ev: any) => {
      const rowKey = ev?.rowKey;
      const columnName = ev?.columnName;
      const grid = GridRef1.current?.getInstance();
      const rowData = grid?.getRow(rowKey);
   
      if (!rowData || !rowData.poBpCd) return;
   
      // 기본 파라미터
      const param: any = {
         poBpCd: rowData.poBpCd,
      };
   
      // totalCnt 열 클릭 시 
      if (columnName === 'totalCnt') {
         param.exDiv = '999';
         param.pkgCd = '999';
      }

      // supportCnt 열 클릭 시 
      if (columnName === 'supportCnt') {
         param.exDiv = 'FU0070';
         param.pkgCd = '999';
      }
      
      // totalPkgCnt 열 클릭 시
      if (columnName === 'totalPkgCnt') {
         param.exDiv = 'FU0068';
         param.pkgCd = '999';
      }

      // pkgCnt1 열 클릭 시 
      if (columnName === 'pkgCnt1') {
         param.exDiv = 'FU0068';
         param.pkgCd = 'PKG0001';
      }

      // pkgCnt2 열 클릭 시
      if (columnName === 'pkgCnt2') {
         param.exDiv = 'FU0068';
         param.pkgCd = 'PKG0003';
      }
   
      await fetchWithLoading(async () => {
         try {
            await MS0101_P01(param); // 수정된 파라미터로 조회
         } catch (error) {
            console.error("MS0101_P01 Error:", error);
         }
      });
   
      setIsOpen(true);
   };

   const handleDblClick = (e:any) => {
      //주문 상세 화면으로 이동
      const menu: ZZ_MENU_RES = {
         menuId: "3021", // 메뉴 ID
         paMenuId: "3020", // 부모 메뉴 ID (상위 메뉴)
         menuName: "주문 등록", // 메뉴 이름
         description: "", // 메뉴 설명
         prgmId: "SO0201", // 프로그램 ID
         prgmFullPath: "so/So0201", // 프로그램 전체 경로
         prgmPath: "", // 프로그램 폴더 경로
         prgmFileName: "", // 프로그램 파일명
         menuOrdr: "03000 >> 13020 >> 13021", // 메뉴 순서 (상위 메뉴 내 정렬)
         remark: "", // 비고 (추가 설명)
         icon: "", // 아이콘 (사용할 아이콘 이름)
         useYn: "Y", // 사용 여부 ("Y": 사용, "N": 미사용)
         lev: 2, // 메뉴 레벨 (2단계 메뉴)
         zMenuOrdr: "1", // 추가적인 메뉴 정렬 순서
         status: "S"  ,
         menuDiv: ""
      };

      //주문번호를 상위 컴포넌트로 전달
      const grid = gridRefP1.current.getInstance();
      const rowData = grid.getRow(e.rowKey);

      setSoNo(rowData.soNo);
      handleAddMenuClick(menu);
    
   }

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
            <DateRangePickerComp 
                  title="주문일시"
                  startValue= {inputValues.startDate}
                  endValue= {inputValues.endDate}
                  onChange={(startDate, endDate) => {
                     onInputChange('startDate', startDate);
                     onInputChange('endDate', endDate);   
                  }            
            } />          
         </div>
      </div>
   );

   const columnsP1 = [
     
      { header: "주문번호", name: "soNo", align : "center", width: 120 },
      { header: "거래처명", name: "bpNm", width: 250 },
      { header: "대상자", name: "ownNm", width: 120, align : "center" },
      { header: "상품구분", name: "exDiv", width: 120, align : "center" },
      { header: "패키지명", name: "pkgName", align : "center", width: 200 },
   ];

   const gridP1 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">주문 정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRefP1} columns={columnsP1} handleDblClick={handleDblClick} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "본부코드", name: "poBpCd", align: "center", width: 130 },
      { header: "본부명", name: "poBpNm", width: 150},
      { header: "총 건수", name: "totalCnt", align: "right", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "지원 건수", name: "supportCnt", align: "right", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "패키지 총 건수", name: "totalPkgCnt", align: "right", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "화장형", name: "pkgCnt1", align: "right", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매장형", name: "pkgCnt2", align: "right", width: 120, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "패키지 진행율", name: "pkgRate", align: "right", width: 120},
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
         totalCnt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
         supportCnt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         totalPkgCnt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         pkgCnt1: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         pkgCnt2: {
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
                  <div className="">주문 리스트</div>
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} handleClick={handleClick} perPageYn={false} rowHeaders={['rowNum']} gridRef={GridRef1} height={window.innerHeight-455} summary={summary}/>
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
         <CommonModal isOpen={isOpen} size="md" onClose={() => setIsOpen(false)} title="">
            {gridP1()}
         </CommonModal>
      </div>
   );
};

export default Ms0101;
