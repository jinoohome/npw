import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, DatePickerComp, SelectSearch, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
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

const So0201 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      payYnS: '999',
      workCd: '999',
      closeYnS: 'N',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "정산관리" }, { name: "정산관리" }, { name: "매입/매출 마감" }];

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

   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         const gridInstance = GridRef1.current.getInstance();
         
         // gridDatas1을 순회하며 조건에 따라 컬럼을 활성화 또는 비활성화
         gridDatas1.forEach((row, index) => {
            if (row) {
               // 카드 입금일은 카드 결제금액이 0보다 클 때만 활성화
               if (row.closeYn === "N") {
                  gridInstance.enableColumn('soAmt');
                  gridInstance.enableColumn('soNetAmt');
                  gridInstance.enableColumn('soVatAmt');
                  gridInstance.enableColumn('poAmt');
                  gridInstance.enableColumn('poNetAmt');
                  gridInstance.enableColumn('poVatAmt');
               } else {
                  gridInstance.disableColumn('soAmt');
                  gridInstance.disableColumn('soNetAmt');
                  gridInstance.disableColumn('soVatAmt');
                  gridInstance.disableColumn('poAmt');
                  gridInstance.disableColumn('poNetAmt');
                  gridInstance.disableColumn('poVatAmt');
               }
            }
         });
      }
   }, [gridDatas1]);

   // useEffect(() => {
   //    if (GridRef1.current) {
   //       const gridInstance = GridRef1.current.getInstance();
   
   //       // 그리드가 초기화되지 않았을 경우에 대비한 안전한 접근
   //       if (!gridInstance) return;
   
   //       if (inputValues.closeYnS === 'N') {
   //          gridInstance.enableColumn('chkCashDt');
   //       } else if (inputValues.closeYnS === 'Y') {
   //          gridInstance.disableColumn('chkCashDt');
   //       } else if (inputValues.closeYnS === '999') {
   //          gridInstance.enableColumn('chkCashDt');
   //       }
   //    }
   // }, [inputValues.closeYnS]);

   useEffect(() => {
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
          await SM0201_S01();
      };
  
      handleSearch();
  }, [inputValues.workCd, inputValues.closeYnS]);

 
   //---------------------- api -----------------------------

   const SM0201_S01 = async () => {
      try {
        const param = {
          coCd: userInfo.coCd,
          startDt: inputValues.startDate,
          endDt: inputValues.endDate,
          soNo: searchRef1.current?.value || '999',
          bpNm: searchRef2.current?.value || '999',
          poBpNm: searchRef3.current?.value || '999',
          workCd: inputValues.workCd || '999',
          closeYn: inputValues.closeYnS || '999',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`SM0201_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }
    
        // _attributes가 없는 경우에도 안전하게 초기화
      //   let filteredData = result.map((row: any) => ({
      //     ...row,
      //     _attributes: {
      //       ...(row._attributes || {}),  // 기존 _attributes가 있으면 병합
      //       checked: row.closeYn === 'Y',  // checked 속성 설정
      //     },
      //   }));
    
        // 딜레이를 주어 그리드가 데이터를 안정적으로 처리할 시간을 줌
        setTimeout(() => {
          setGridDatas(result);
        }, 100);  // 100ms 딜레이 추가
    
        return result;
      } catch (error) {
        console.error("SM0201_S01 Error:", error);
      }
    };

   // 마감 저장
   const SM0201_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SM0201_U01`, data);
         return result;
      } catch (error) {
         console.error("SM0201_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await SM0201_S01();
            setGridDatas(result);
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await SM0201_S01();
   };

   const getGridValues = async (status:any) => {
      let sClose = await getGridCheckedDatas2(GridRef1);
      let yyyyMm = inputValues.yyyyMm;

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         yyyyMm: yyyyMm,
         status: status,
         sClose: JSON.stringify(sClose),
      };

      return data;
   };

   //-------------------button--------------------------
   //마감버튼
   const addClose = async () => {
      // 마감년월 유효성 체크
      if (!inputValues.yyyyMm || inputValues.yyyyMm.trim() === '') {
         alertSwal('마감년월을 입력해 주세요.', '확인요청', 'error');
         return;
      }

      // 그리드에서 체크된 row 데이터 확인
      const gridInstance = GridRef1.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();

      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('마감할 데이터를 선택하시기 바랍니다.', '확인요청', 'error');
         return;
      }

      const yyyyMm = inputValues.yyyyMm ? inputValues.yyyyMm.slice(0, 7) : '';

      alertSwal("마감확인", yyyyMm+"월로 마감 하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues('I');

            if (data) {
               let result = await SM0201_U01(data);
               if (result) {
                  await returnResult(result);
               }
            }
         } else if (result.isDismissed) {
            return;
         }
      });  
   }; 

   //마감취소버튼
   const delClose = async () => {
      const data = await getGridValues('D');

      if (data) {
         let result = await SM0201_U01(data);
         if (result) {
            await returnResult(result);
         }
      }
   }; 

   const returnResult = async(result:any) => {     
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      search();
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
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[80%]  xl:grid-cols-4 md:grid-cols-2">
            <DateRangePickerComp 
                  title="수주일시"
                  startValue= {inputValues.startDate}
                  endValue= {inputValues.endDate}
                  onChange={(startDate, endDate) => {
                     onInputChange('startDate', startDate);
                     onInputChange('endDate', endDate);   
            }
            
            } /> 
            <InputComp title="수주번호" ref={searchRef1} value={inputValues.soNoS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('soNoS', e);
                     }} />
            <InputComp title="사업장" ref={searchRef2} value={inputValues.bpNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('bpNmS', e);
                     }} />
            <InputComp title="협력업체" ref={searchRef3} value={inputValues.dlvyNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('dlvyNmS', e);
                     }} />                        
            <SelectSearch  title="작업명"
                           value={inputValues.workCd}
                           onChange={(label, value) => {
                              onInputChange("workCd", value);
                           }}
                           addData={"999"}
                           stringify={true}
                           param={{ coCd: "200" }}
                           procedure="ZZ_WORKS"
                           dataKey={{ label: "workNm", value: "workCd" }}
            />
            <SelectSearch title="마감여부" 
                              value={inputValues.closeYnS}
                              onChange={(label, value) => {
                                    onInputChange('closeYnS', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'Y', label : '마감완료'},{value : 'N', label : '마감전'}]}
            />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "마감주문번호", name: "closeSoNo", hidden: true },
      { header: "마감여부", name: "closeYn", align: "center", width: 60},
      { header: "마감년월", name: "yyyymm", align: "center", width: 80},
      { header: "수주번호", name: "soNo", align: "center", width: 130},
      { header: "사업장", name: "bpNm", width: 280 },
      { header: "협력업체", name: "poBpNm", width: 150 },
      { header: "작업명", name: "workNm", width: 280 },
      { header: "계약금액", name: "soAmt", align: "right", width: 90, editor: "text",formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "공급금액", name: "soNetAmt", align: "right", width: 90, editor: "text", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "부가세", name: "soVatAmt", align: "right", width: 90, editor: "text", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매입금액", name: "poAmt", align: "right", width: 90, editor: "text", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "공급금액", name: "poNetAmt", align: "right", width: 90, editor: "text", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "부가세", name: "poVatAmt", align: "center", editor: "text", formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
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
         workNm: {
            template: (e:any) => {
                return `합계 : `;
            }
         },
         soAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
         soNetAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         soVatAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
         poAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
         poNetAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         poVatAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },        
      }
   }

   const Grid1 = () => {
      const isCloseYnComplete = inputValues.closeYnS === 'Y'; // 마감완료
      const isCloseYnNotComplete = inputValues.closeYnS === 'N'; // 마감전
   
      return (
         <div className="border rounded-md p-2 space-y-2">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">주문 리스트</div>
               </div>
   
               {/* 마감여부에 따라 버튼과 마감년월 input을 조건부 렌더링 */}
               <div className="flex space-x-1">
                  {/* 마감전일 때 마감 버튼과 마감년월 표시 */}
                  {isCloseYnNotComplete && (
                     <>
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
                        <button type="button" onClick={addClose} className="bg-green-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                           <CheckIcon className="w-5 h-5" />
                           마감
                        </button>
                     </>
                  )}
   
                  {/* 마감완료일 때 마감 취소 버튼 표시 */}
                  {isCloseYnComplete && (
                     <button type="button" onClick={delClose} className="bg-red-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                        <XMarkIcon className="w-5 h-5" />
                        마감취소
                     </button>
                  )}
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} rowHeaders={['checkbox','rowNum']} gridRef={GridRef1} summary={summary}/>
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

export default So0201;
