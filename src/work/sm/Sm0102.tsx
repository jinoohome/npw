import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, DatePickerComp, RadioGroup, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const So0102 = ({ item, activeComp, leftMode, userInfo }: Props) => {

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
      div: 'receipt',
      receiptYnS: '999',
      cardYnS: '999',
      cashYnS: '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "정산관리" }, { name: "정산관리" }, { name: "현금 입금여부 확인" }];

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
         gridInstance.resetData(gridDatas1);
   
         gridDatas1.forEach((row, index) => {
            const rowKey = index; // 각 행의 고유 키
   
            // receiptAmt 값이 있는 경우 chkReceiptDt 활성화, 없으면 비활성화
            if (row.receiptAmt > 0) {
               gridInstance.enableCell(rowKey, 'chkReceiptDt'); // 활성화
            } else {
               gridInstance.disableCell(rowKey, 'chkReceiptDt'); // 비활성화
            }
   
            // cardAmt 값이 있는 경우 chkCardDt 활성화, 없으면 비활성화
            if (row.cardAmt > 0) {
               gridInstance.enableCell(rowKey, 'chkCardDt'); // 활성화
            } else {
               gridInstance.disableCell(rowKey, 'chkCardDt'); // 비활성화
            }
   
            // cashAmt 값이 있는 경우 chkCashDt 활성화, 없으면 비활성화
            if (row.cashAmt > 0) {
               gridInstance.enableCell(rowKey, 'chkCashDt'); // 활성화
            } else {
               gridInstance.disableCell(rowKey, 'chkCashDt'); // 비활성화
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
          await SM0102_S01();
      };
  
      handleSearch();
  }, [inputValues.yyyyMmS, inputValues.receiptYnS, inputValues.cardYnS, inputValues.cashYnS]);

 
   //---------------------- api -----------------------------

   const SM0102_S01 = async () => {
      const yyyyMm = inputValues.yyyyMmS ? inputValues.yyyyMmS.slice(0, 7).replace('-','') : '999';

      try {
        const param = {
          startDt: inputValues.startDate,
          endDt: inputValues.endDate,
          yyyyMm: yyyyMm,
          bpNm: searchRef2.current?.value || '999',
          receiptYn: inputValues.receiptYnS || '999',
          cardYn: inputValues.cardYnS || '999',
          cashYn: inputValues.cashYnS || '999',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`SM0102_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }

        setGridDatas(result);
        
        return result;
      } catch (error) {
        console.error("SM0102_S01 Error:", error);
      }
    };

   // 마감 저장
   const SM0101_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SM0101_U01`, data);
         return result;
      } catch (error) {
         console.error("SM0101_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = async () => {
      await SM0102_S01();
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await SM0102_S01();
   };

   const getGridValues = async (status:any) => {
      let sClose = await getGridCheckedDatas2(GridRef1);
      let yyyyMm = inputValues.yyyyMmS;

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
   //전체입력버튼
   const setDt = async () => {
      const gridInstance = GridRef1.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();  // 체크된 로우 가져오기
   
      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('입금확인할 데이터를 선택하시기 바랍니다.', '경고', 'error');
         return;
      }
   
      const depositDate = inputValues.yyyyMm || ''; // 사용자가 선택한 입금확인일
   
      // 구분 값에 따라 각 체크된 행의 특정 필드만 업데이트
      checkedRows.forEach((row: any) => {
         const rowKey = row.rowKey; // 행의 키를 가져와서 정확한 위치를 식별
   
         if (inputValues.div === 'receipt') {
            if (row.receiptAmt !== 0) {
               gridInstance.setValue(rowKey, 'chkReceiptDt', depositDate);  // 계산서입금일에 입금확인일 세팅
            }
         } else if (inputValues.div === 'card') {
            if (row.cardAmt !== 0) {
               gridInstance.setValue(rowKey, 'chkCardDt', depositDate);  // 카드입금일에 입금확인일 세팅
            }
         } else if (inputValues.div === 'cash') {
            if (row.cashAmt !== 0) {
               gridInstance.setValue(rowKey, 'chkCashDt', depositDate);  // 현금입금일에 입금확인일 세팅
            }
         }
      });

      alertSwal('각 항목의 금액이 있는것만 세팅됩니다. 저장 버튼을 클릭하세요.', '성공', 'success');
   };

   //저장버튼
   const saveClose = async () => {      
      const data = await getGridValues('S');

      if (data) {
         let result = await SM0101_U01(data);
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
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
            <DateRangePickerComp 
                  title="주문일시"
                  startValue= {inputValues.startDate}
                  endValue= {inputValues.endDate}
                  onChange={(startDate, endDate) => {
                     onInputChange('startDate', startDate);
                     onInputChange('endDate', endDate);   
            }
            
            } />
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
            />
            <InputComp title="고객사" ref={searchRef2} value={inputValues.bpNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('bpNmS', e);
                     }} />    
            <SelectSearchComp title="계산서 확인여부" 
                              ref={searchRef4}
                              value={inputValues.receiptYnS}
                              onChange={(label, value) => {
                                    onInputChange('receiptYnS', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'Y', label : '확인'},{value : 'N', label : '미확인'}]}
            />
            <SelectSearchComp title="카드 확인여부" 
                              ref={searchRef5}
                              value={inputValues.cardYnS}
                              onChange={(label, value) => {
                                    onInputChange('cardYnS', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'Y', label : '확인'},{value : 'N', label : '미확인'}]}
            />
            <SelectSearchComp title="현금 확인여부" 
                              ref={searchRef5}
                              value={inputValues.cashYnS}
                              onChange={(label, value) => {
                                    onInputChange('cashYnS', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'Y', label : '확인'},{value : 'N', label : '미확인'}]}
            />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "마감년월", name: "yyyyMm", align: "center", width: 80},
      { header: "주문번호", name: "soNo", align: "center", width: 100},
      { header: "고객사", name: "bpNm", width: 230 },
      { header: "품목", name: "itemNm", width: 280 },
      { header: "패키지", name: "pkgItemNm", width: 120 },
      { header: "카드", name: "cardYn", align: "center", hidden: true},
      { header: "현금", name: "cashYn", align: "center", hidden: true},
      { header: "매출금액", name: "soAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "계산서발행", name: "receiptAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "계산서입금일", name: "chkReceiptDt", align: "center", editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },
      { header: "카드결제", name: "cardAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "카드입금일", name: "chkCardDt", align: "center", editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },
      { header: "현금결제", name: "cashAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "입금일", name: "chkCashDt", align: "center", editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },
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
         pkgItemNm: {
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
         noPay: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         receiptAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         cardAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         cashAmt: {
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
   
               {/* 마감여부에 따라 버튼과 마감년월 input을 조건부 렌더링 */}
               <div className="flex space-x-1">
                     <RadioGroup
                        title="구분"
                        value={inputValues.div}
                        options={[
                           { label: "계산서", value: "receipt" },
                           { label: "카드", value: "card" },
                           { label: "현금", value: "cash" },
                        ]}
                        onChange={(e) => {
                           onInputChange("div", e);
                        }}
                     />
                     <>
                        <DatePickerComp 
                           title="입금확인일"
                           value={inputValues.yyyyMm}
                           layout="flex"
                           textAlign="right"
                           minWidth="100px"
                           onChange={(e) => { 
                              onInputChange('yyyyMm', e);  
                           }} 
                           format="yyyy-MM-dd"
                        />
                        <button type="button" onClick={setDt} className="bg-red-400 text-white rounded-3xl px-6 py-1 flex items-center shadow">
                           전체입력
                        </button>
                        <button type="button" onClick={saveClose} className="bg-blue-400 text-white rounded-3xl px-6 py-1 flex items-center shadow">
                           저장
                        </button>
                     </>
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} rowHeaders={['checkbox','rowNum']} gridRef={GridRef1} height={window.innerHeight-595} summary={summary}/>
         </div>
      );
   };

   return (
      <div className={`space-y-5 overflow-y-auto `}>
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

export default So0102;
