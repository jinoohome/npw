import { React, useEffect, useState, useRef, useCallback, commas, date, SelectSearch, InputComp, DatePickerComp, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
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

const Mm0504 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef2 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
      div: '999',
      bpCd: '999',
      yyyymm: date(),
   });

   const breadcrumbItem = [{ name: "기준정보" }, { name: "재고" }, { name: "재고마감조회" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
   }, []);

   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            await MM0504_S01();
         } catch (error) {
            console.error("setGridData Error:", error);
         }
      });
   };

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(GridRef1);
   
   }, [activeComp, leftMode]);

   // Grid 데이터 설정
   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         let grid1 = GridRef1.current.getInstance();
         grid1.resetData(gridDatas1);

      } 
   }, [gridDatas1]);

   useEffect(() => {
      MM0504_S01();
   
   }, [inputValues.bpCd, inputValues.yyyymm]);

   //---------------------- api -----------------------------

   const MM0504_S01 = async () => {
      try {
         const param = {
            yyyymm: inputValues.yyyymm || "999",
            poBpCd: inputValues.bpCd || "999",
            itemNm: inputValues.itemCd || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0504_S01`, { data });
         setGridDatas(result);

         return result;
      } catch (error) {
         console.error("MM0504_S01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await MM0504_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await MM0504_S01();
   };

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
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
            <DatePickerComp 
                     title="마감년월"
                     value={inputValues.yyyymm}
                     layout="flex"
                     textAlign="right"
                     minWidth="100px"
                     onChange={(e) => { 
                        onInputChange('yyyymm', e);  
                     }} 
                     type="month"
                     format="yyyy-MM"
                     //월선택으로
                  />
            <SelectSearch
                        title="본부"
                        value={inputValues.bpCd}
                        onChange={(label, value) => {
                              onInputChange("bpCd", value);
                        }}
                        addData={"999"}

                        stringify={true}
                        
                        param={{ coCd: "100",
                                 bpDiv: "ZZ0189",            
                                 bpNm: '999',  }}
                        procedure="ZZ_B_PO_BP"
                        dataKey={{ label: "bpNm", value: "bpCd" }}
               />
            <InputComp title="품목"
                       value={inputValues.itemCd}
                       handleCallSearch={handleCallSearch}
                       onChange={(e)=>{
                        onInputChange('itemCd', e);
                       }}
                   />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "마감년월", name: "yyyymm", width: 100, align: "center" },
      { header: "본부코드", name: "poBpCd", width: 100, align: "center" },
      { header: "본부명", name: "poBpNm", width: 270 },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 300 },
      { header: "기초재고", name: "baseQty", width: 70, align: "right",
         formatter: function (e: any) { if (e.value) { return commas(e.value); } }
      }, // QTY: 수량
      { header: "입고수량", name: "inQty", width: 70, align: "right",
         formatter: function (e: any) { if (e.value) { return commas(e.value); } }
      }, // QTY: 수량
      { header: "출고수량", name: "outQty", width: 70, align: "right",
         formatter: function (e: any) { if (e.value) { return commas(e.value); } }
      }, // QTY: 수량
      { header: "기말재고", name: "closeQty", width: 70, align: "right",
         formatter: function (e: any) { if (e.value) { return commas(e.value); } }
      }, // QTY: 수량
   ];

   const summary3 = {
      height: 40,
      position: 'top', 
      columnContent: {
         itemNm: {
            template: (e:any) => {
                return `합계 : `;
            }
         },
         baseQty: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         }, 
         inQty: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
         outQty: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },
         closeQty: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },
      }
   }

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">재고마감조회</div>
            </div>
         </div>

         <TuiGrid01 columns={grid1Columns} summary={summary3} gridRef={GridRef1} height={window.innerHeight - 500}/>
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
         <div className="w-full h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-full" ref={gridGridContainerRef}>{Grid1()}</div>
         </div>
      </div>
   );
};

export default Mm0504;
