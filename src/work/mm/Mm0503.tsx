import { React, useEffect, useState, useRef, useCallback, DatePickerComp, commas, date, getGridCheckedDatas2, SelectSearch, InputComp, DateRangePickerComp, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { Grid } from "@mui/material";
import { on } from "events";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Mm0402 = ({ item, activeComp, leftMode, userInfo }: Props) => {

   const GridRef1 = useRef<any>(null);
   const GridRef2 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);
   const grid2GridContainerRef = useRef(null);

   //검색창 ref
   const searchRef2 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
      div: '999',
      bpCd: '999',
      whCd: '999',
      startDate: date(-1, 'month'),
      endDate: date(),
   });

   const breadcrumbItem = [{ name: "기준정보" }, { name: "재고" }, { name: "재고마감" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef2, containerRef: grid2GridContainerRef, sec: 200 });
   }, []);


   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      setGridData();
      refreshGrid(GridRef1);
      refreshGrid(GridRef2);
   
   }, [activeComp, leftMode]);

   const setGridData = async () => {
      await MM0503_S02();
   }

   // Grid 데이터 설정
   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         let grid1 = GridRef1.current.getInstance();
         grid1.resetData(gridDatas1);

         const rowData = grid1.getData();

         rowData.forEach((_ : any, index : any) => {
            grid1.disableRowCheck(index); // 행의 체크를 비활성화합니다.
         });
      } 

   }, [gridDatas1]);

   useEffect(() => {
      if (GridRef2.current && gridDatas2) {
         let grid2 = GridRef2.current.getInstance();
         grid2.resetData(gridDatas2);
      } 

   }, [gridDatas2]);

   useEffect(() => {
      MM0503_S01();

   }, [inputValues.yyyymm]);

   //---------------------- api -----------------------------
   // 마감 저장
   const MM0503_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0503_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0503_U01 Error:", error);
         throw error;
      }
   };

   const MM0503_S01 = async () => {
      try {
         const param = {
            yyyymm: inputValues.yyyymm || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0503_S01`, { data });

         if (result.length > 0) {
            if (result[0].msgCd) {
               await returnResult(result);
               return; 
            }
         }        

         let filteredData = result.map((row: any) => ({
                ...row,
                _attributes: {
                  ...(row._attributes || {}),  // 기존 _attributes가 있으면 병합
                  checked: 'Y',  // checked 속성 설정
                },
              }));

         setGridDatas(filteredData);

         return result;
      } catch (error) {
         console.error("MM0503_S01 Error:", error);
         throw error;
      }
   };

   const MM0503_S02 = async () => {
      try {
         const param = {
            yyyymm: inputValues.yyyymm || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0503_S02`, { data });

         setGridDatas2(result);

         if (result.length > 0) {
            const yyyymm = result[0].yyyymm;
            const [year, month] = yyyymm.split('-').map(Number);

            // Date 객체를 생성하고 1개월 추가
            const date = new Date(year, month - 1, 1); // month는 0부터 시작하므로 -1
            date.setMonth(date.getMonth() + 1);

            // 새로운 yyyymm 값 생성
            const newYear = date.getFullYear();
            const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // 다시 0부터 시작하므로 +1
            const newYyyymm = `${newYear}-${newMonth}`;

            // 새로운 yyyymm 값으로 설정
            onInputChange('yyyymm', newYyyymm);
         }

         return result;
      } catch (error) {
         console.error("MM0503_S02 Error:", error);
         throw error;
      }
   };

   const returnResult = async(result:any) => {     
      alertSwal(result[0].msgText, result[0].msgCd, result[0].msgStatus);
      setGridDatas([]);
      return;
   };

   const returnResult2 = async(result:any) => {     
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      await MM0503_S02();
   };

   //-------------------event--------------------------
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

   const getGridValues = async (status:any) => {
      let sClose = await getGridCheckedDatas2(GridRef1);
      let yyyymm = inputValues.yyyymm;

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         yyyymm: yyyymm,
         flag: status,
         data: JSON.stringify(sClose),
      };

      return data;
   };

   const getGridValues2 = async (status:any) => {
      let grid2 = GridRef2.current.getInstance();    
      let yyyymm = grid2.getValue(0, 'yyyymm');

      let sCancel = await getGridDatas(GridRef2);

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         yyyymm: yyyymm,
         flag: status,
         data: JSON.stringify(sCancel),
      };

      return data;
   };

   const addClose = async () => {
      // 마감년월 유효성 체크
      if (!inputValues.yyyymm || inputValues.yyyymm.trim() === '') {
         alertSwal('마감년월을 입력해 주세요.', '확인요청', 'error');
         return;
      }

      // 현재 날짜와 다음 달의 연월을 구함
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
      const nextMonthDate = new Date(currentYear, currentMonth, 1); // 다음 달의 1일
      const nextYear = nextMonthDate.getFullYear();
      const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(2, '0'); // 다시 +1을 해서 월을 2자리로 포맷
      const nextYyyymm = `${nextYear}-${nextMonth}`;

      // inputValues.yyyymm 값이 다음 달 이후일 경우 막기
      if (inputValues.yyyymm >= nextYyyymm) {
         alertSwal(`마감년월은 ${nextYyyymm}월 이후로 설정할 수 없습니다.`, '확인요청', 'error');
         return;
      }

      // 그리드에서 체크된 row 데이터 확인
      const gridInstance = GridRef1.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();

      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('마감할 데이터를 선택하시기 바랍니다.', '확인요청', 'error');
         return;
      }

      const yyyymm = inputValues.yyyymm ? inputValues.yyyymm.slice(0, 7) : '';

      alertSwal("마감확인", yyyymm+"월로 마감 하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues('I');

            if (data) {
               let result = await MM0503_U01(data);
               if (result) {
                  await returnResult2(result);
               }
            }
         } else if (result.isDismissed) {
            return;
         }
      });  
   }; 

   //모의마감조회
   const cancelClose = async () => {   
      let grid2 = GridRef2.current.getInstance();    
      let yyyymm = grid2.getValue(0, 'yyyymm');

      if (!yyyymm || yyyymm.trim() === '') {
         alertSwal('마감취소할 년월을 선택해 주세요.', '확인요청', 'error');
         return;
      }

      alertSwal("마감확인", yyyymm+"월의 마감을 취소하시겠습니까? 마감취소는 마지막에 마감한것부터 순차적으로 진행되어야 합니다.", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues2('D');

            if (data) {
               let result = await MM0503_U01(data);
               if (result) {
                  await returnResult2(result);
               }
            }
         } else if (result.isDismissed) {
            return;
         }
      });  
   }; 

   //모의마감조회
   const searchClose = async () => {
      // 마감년월 유효성 체크
      if (!inputValues.yyyymm || inputValues.yyyymm.trim() === '') {
         alertSwal('마감년월을 입력해 주세요.', '확인요청', 'error');
         return;
      }

      await MM0503_S01();
   }; 

   //-------------------div--------------------------

   //상단 버튼 div
   // const buttonDiv = () => (
   //    <div className="flex justify-end space-x-2">
   //       <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
   //          <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
   //          조회
   //       </button>
   //    </div>
   // );

   // //검색창 div
   // const searchDiv = () => (
   //    <div className="bg-gray-100 rounded-lg p-5 search text-sm">
   //       <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
   //          <DateRangePickerComp 
   //                title="기간"
   //                startValue= {inputValues.startDate}
   //                endValue= {inputValues.endDate}
   //                onChange={(startDate, endDate) => {
   //                   onInputChange('startDate', startDate);
   //                   onInputChange('endDate', endDate);   
   //          }
            
   //          } /> 
   //          <SelectSearch
   //                      title="본부"
   //                      value={inputValues.bpCd}
   //                      onChange={(label, value) => {
   //                            onInputChange("bpCd", value);
   //                      }}
   //                      addData={"999"}

   //                      stringify={true}
                        
   //                      param={{ coCd: "100",
   //                               bpDiv: "ZZ0189",            
   //                               bpNm: '999',  }}
   //                      procedure="ZZ_B_PO_BP"
   //                      dataKey={{ label: "bpNm", value: "bpCd" }}
   //             />
   //          <SelectSearch
   //                      title="창고"
   //                      value={inputValues.whCd}
   //                      onChange={(label, value) => {
   //                            onInputChange("whCd", value);
   //                      }}
   //                      addData={"999"}

   //                      stringify={true}
                        
   //                      param={{ poBpCd: inputValues.bpCd || "999", }}
   //                      procedure="ZZ_WH_INFO"
   //                      dataKey={{ label: "whNm", value: "whCd" }}
   //             />
   //          <InputComp title="품목"
   //                     value={inputValues.itemCd}
   //                     handleCallSearch={handleCallSearch}
   //                     onChange={(e)=>{
   //                      onInputChange('itemCd', e);
   //                     }}
   //                 />
   //          <SelectSearch title="구분" 
   //                         value={inputValues.div}
   //                         onChange={(label, value) => {
   //                               onInputChange('div', value);
   //                            }}                           

   //                         //초기값 세팅시
   //                         datas={[{value : '999', label : '전체'},{value : '입고', label : '입고'},{value : '출고', label : '출고'}]}
   //          />
   //       </div>
   //    </div>
   // );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "본부코드", name: "poBpCd", hidden: true },
      { header: "본부명", name: "poBpNm", width: 270 },
      { header: "품목코드", name: "itemCd", hidden: true },
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
      { header: "기말재고", name: "closeQty", align: "right",
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

   const grid2Columns = [
      { header: "마감년월", name: "yyyymm", align: "center" },
      { header: "마감여부", name: "status", align: "center" },
   ];

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">재고마감</div>
            </div>
            <div className="flex space-x-1">
                  <DatePickerComp 
                     title="마감년월"
                     value={inputValues.yyyymm}

                     layout="flex"
                     textAlign="right"
                     minWidth="100px"
                     onChange={(e) => { 
                        onInputChange('yyyymm', e);  
                     }} 
                     format="yyyy-MM"
                  />
                  {/* <button type="button" onClick={searchClose} className="bg-red-400 text-white rounded-3xl px-6 py-1 flex items-center shadow">
                     모의마감조회
                  </button> */}
                  <button type="button" onClick={addClose} className="bg-green-400 text-white rounded-3xl px-6 py-1 flex items-center shadow">
                     마감
                  </button>
            </div>
         </div>

         <TuiGrid01 columns={grid1Columns} rowHeaders={['checkbox','rowNum']} summary={summary3} gridRef={GridRef1} height={window.innerHeight - 500}/>
      </div>
   );

   const Grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">재고마감현황</div>
            </div>
            <div className="flex space-x-1">                  
                  <button type="button" onClick={cancelClose} className="bg-green-400 text-white rounded-3xl px-6 py-1 flex items-center shadow">
                     마감취소
                  </button>
            </div>
         </div>

         <TuiGrid01 columns={grid2Columns} gridRef={GridRef2} height={window.innerHeight - 500}/>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="w-full flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {/* {buttonDiv()} */}
            </div>
            {/* <div>{searchDiv()}</div> */}
         </div>
         <div className="w-full  h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-3/5" ref={gridGridContainerRef}>{Grid1()}</div>
            <div className="w-2/5" ref={gridGridContainerRef}>{Grid2()}</div>
         </div>
      </div>
   );
};

export default Mm0402;
