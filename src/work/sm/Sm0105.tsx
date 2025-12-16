import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, SelectSearch, alertSwal, DatePickerComp, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ZZ_MENU_RES } from "../../ts/ZZ_MENU";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
   handleAddMenuClick: (menuItem: ZZ_MENU_RES ) => void;
   setSoNo: (value: string) => void;
}

const So0104 = ({ item, activeComp, leftMode, userInfo, handleAddMenuClick, setSoNo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [originalDatas, setOriginalDatas] = useState<any[]>([]);
   const [pkgFilter, setPkgFilter] = useState<boolean>(false);

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      closeYnPoBpS: 'N',
      poBpS: userInfo.usrDiv !== '999' ? userInfo.bpCd : '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "정산관리" }, { name: "정산관리" }, { name: "매입조회" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });

      if (userInfo.usrDiv !== '999') {
         setInputValues((prevValues) => ({
            ...prevValues,
            poBpS: userInfo.bpCd, // 관할구역 값 세팅
         }));
      }
   }, []);

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      // refreshGrid(GridRef1);
   
   }, [activeComp, leftMode]);

   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         const gridInstance = GridRef1.current.getInstance();
   
         // 행 단위로 셀의 상태를 업데이트
         const updatedData = gridDatas1.map((row) => ({
            ...row,
            _attributes: {
               ...(row._attributes || {})
            },
         }));
   
         // 데이터 리셋
         gridInstance.resetData(updatedData);
      }
   }, [gridDatas1]);

   useEffect(() => {
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
         await fetchWithLoading(async () => {
            try {
               await SM0104_S01();
               
            } catch (error) {
               console.error("Search Error:", error);
            }
         });          
      };
  
      handleSearch();
  }, [inputValues.yyyyMmS, inputValues.closeYnPoBpS, inputValues.poBpS, inputValues.startDate, inputValues.endDate]);

   // 패키지 필터 변경 시 재조회
   useEffect(() => {
      if (originalDatas.length > 0) {
         SM0104_S01();
      }
   }, [pkgFilter]);

 
   //---------------------- api -----------------------------

   const SM0104_S01 = async () => {
      const yyyyMm = inputValues.yyyyMmS ? inputValues.yyyyMmS.slice(0, 7).replace('-','') : '999';

      try {
        const param = {
          startDt: inputValues.startDate,
          endDt: inputValues.endDate,
          soNo: searchRef1.current?.value || '999',
          dlvyNm: searchRef2.current?.value || '999',
          bpNm: searchRef3.current?.value || '999',
          poBpNm: inputValues.poBpS || '999',
          ownNm: searchRef4.current?.value || '999',
          itemNm: searchRef5.current?.value || '999',
          pkgYn: pkgFilter ? 'Y' : 'N',
          yyyyMm: yyyyMm,
          closeYn: 'Y',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`SM0104_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          setOriginalDatas([]);
          return;
        }

        setOriginalDatas(result);
        
        setTimeout(() => {
          setGridDatas(result);
        }, 100);
    
        return result;
      } catch (error) {
        console.error("SM0104_S01 Error:", error);
      }
    };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await SM0104_S01();

         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await SM0104_S01();
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
            <DateRangePickerComp 
                  title="주문일시"
                  startValue= {inputValues.startDate}
                  endValue= {inputValues.endDate}
                  onChange={(startDate, endDate) => {
                     onInputChange('startDate', startDate);
                     onInputChange('endDate', endDate);   
            }
            
            } /> 
            <InputComp title="주문번호" ref={searchRef1} value={inputValues.soNoS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('soNoS', e);
                     }} />
            <InputComp title="배송지" ref={searchRef2} value={inputValues.dlvyNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('dlvyNmS', e);
                     }} />  
            <InputComp title="고객사" ref={searchRef3} value={inputValues.bpNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('bpNmS', e);
                     }} />
            <InputComp title="대상자" ref={searchRef4} value={inputValues.ownNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('ownNmS', e);
                     }} />
            <div className="flex items-center gap-2">
               <InputComp title="품목명" ref={searchRef5} value={inputValues.itemNmS} handleCallSearch={handleCallSearch} 
                             onChange={(e)=>{
                             onInputChange('itemNmS', e);
                        }} />
               <label className="flex items-center cursor-pointer whitespace-nowrap">
                  <input 
                     type="checkbox" 
                     checked={pkgFilter}
                     onChange={(e) => setPkgFilter(e.target.checked)}
                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-1 text-gray-700">패키지</span>
               </label>
            </div>
            <SelectSearch title="관할구역" 
                              value={inputValues.poBpS}
                              onChange={(label, value) => {
                                    onInputChange('poBpS', value);
                                 }}

                              //readonly={userInfo.usrDiv == 'ZZ0196'}
                              readonly={userInfo.usrDiv !== '999' ? true : false}
                              addData={"999"}

                              //초기값 세팅시
                              stringify={true}
                              param={{ coCd: "100",bpType : "ZZ0003", bpNm : '999', bpDiv: '999' }}
                              procedure="ZZ_B_PO_BP"
                              dataKey={{ label: "bpNm", value: "bpCd" }}
               />
            <DatePickerComp 
               title="마감년월"
               value = {inputValues.yyyyMmS}
               layout="flex"
               textAlign="right"
               minWidth="100px"
               onChange={(e) => { 
                  onInputChange('yyyyMmS', e);  
                  }} 
               format="yyyy-MM"
               type="month"
            />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "마감년월", name: "yyyyMm", align: "center", width: 80},
      { header: "주문번호", name: "soNo", align: "center", width: 100, rowSpan: true},
      { header: "고객사", name: "bpNm", width: 200 },
      { header: "대상자", name: "ownNm", width: 80, align: "center" },
      { header: "배송지", name: "dlvyNm", width: 200},
      { header: "품목", name: "itemNm", width: 160 },
      { header: "매출금액", name: "soAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "청구금액", name: "purchaseAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "공급금액", name: "purchaseNetAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출이익", name: "profitAmt", align: "right", width: 100, formatter: function(e: any) {
         const soAmt = e.row.soAmt || 0;
         const purchaseAmt = e.row.purchaseAmt || 0;
         const profit = soAmt - purchaseAmt;
         if (profit === 0) {return '0';} 
         return commas(profit);
      }},
      { header: "부가세", name: "purchaseVatAmt", align: "right", width: 80, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "MOU여부", name: "mouYn", width: 80, align: "center" },
      { header: "본부조정금액", name: "poAdjAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "본사조정금액", name: "adjAmt", editor: "text", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "본부비고", name: "poRemark", width: 120 },
      { header: "본사비고", name: "remark", editor:"text", width: 120 },
   ];

   const summary = {
      height: 40,
      position: 'top', 
      columnContent: {
         itemNm: {
            template: (e:any) => {
                return `합계 : `;
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
         purchaseNetAmt: {
            template: (e:any) => {                  
               const data = e.sum;
               return `${commas(data)}`;
            }
         },
         profitAmt: {
            template: (valueMap:any) => {
               const gridInstance = GridRef1.current?.getInstance();
               if (!gridInstance) return '0';
               const data = gridInstance.getData();
               const totalProfit = data.reduce((sum: number, row: any) => {
                  const soAmt = row.soAmt || 0;
                  const purchaseAmt = row.purchaseAmt || 0;
                  return sum + (soAmt - purchaseAmt);
               }, 0);
               return `${commas(totalProfit)}`;
            }
         },
         purchaseVatAmt: {
            template: (e:any) => {                  
               const data = e.sum;
               return `${commas(data)}`;
            }
         },
         poAdjAmt: {
            template: (e:any) => {                  
               const data = e.sum;
               return `${commas(data)}`;
            }
         },
      }
   }

   const Grid1 = () => {
      const isCloseYnComplete = inputValues.closeYnPoBpS === 'Y'; // 마감완료
      const isCloseYnNotComplete = inputValues.closeYnPoBpS === 'N'; // 마감전
   
      return (
         <div className="border rounded-md p-2 space-y-2">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">본사 마감 된 주문 리스트</div>
               </div>    
            </div>
   
            <TuiGrid01 columns={grid1Columns} rowHeaders={['rowNum']} gridRef={GridRef1} height={window.innerHeight - 590} summary={summary}/>
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

export default So0104;
