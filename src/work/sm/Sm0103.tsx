import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, SelectSearch, alertSwal, DatePickerComp, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { ro } from "date-fns/locale";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const So0103 = ({ item, activeComp, leftMode, userInfo }: Props) => {
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

   const breadcrumbItem = [{ name: "정산관리" }, { name: "정산관리" }, { name: "본부마감" }];

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
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
          await SM0103_S01();
      };
  
      handleSearch();
  }, [inputValues.closeYnPoBpS, inputValues.poBpS]);

 
   //---------------------- api -----------------------------

   const SM0103_S01 = async () => {
      try {
        const param = {
          startDt: inputValues.startDate,
          endDt: inputValues.endDate,
          soNo: searchRef1.current?.value || '999',
          dlvyNm: searchRef2.current?.value || '999',
          bpNm: searchRef3.current?.value || '999',
          poBpNm: inputValues.poBpS || '999',
          empNm: inputValues.empNmS || '999',
          ownNm: inputValues.ownNmS || '999',
          yyyyMm: '999',
          closeYn: inputValues.closeYnPoBpS || '999',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`SM0103_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }
    
        // _attributes가 없는 경우에도 안전하게 초기화
      //   let filteredData = result.map((row: any) => ({
      //     ...row,
      //     _attributes: {
      //       ...(row._attributes || {}),  // 기존 _attributes가 있으면 병합
      //       checked: row.closeYnPoBp === 'Y',  // checked 속성 설정
      //     },
      //   }));
    
        // 딜레이를 주어 그리드가 데이터를 안정적으로 처리할 시간을 줌
        setTimeout(() => {
          setGridDatas(result);
        }, 100);  // 100ms 딜레이 추가
    
        return result;
      } catch (error) {
        console.error("SM0103_S01 Error:", error);
      }
    };

   // 마감 저장
   const SM0103_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SM0103_U01`, data);
         return result;
      } catch (error) {
         console.error("SM0103_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await SM0103_S01();
            setGridDatas(result);
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await SM0103_S01();
   };

   const getGridValues = async (status:any) => {
      let sClose = await getGridCheckedDatas2(GridRef1);

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         status: status,
         data: JSON.stringify(sClose),
      };

      return data;
   };

   const handleAfterChange = async (ev: any) => {

      const changesArray = ev.changes; // ev.changes가 배열이므로 이를 사용
  
      // 배열이기 때문에 forEach로 순회
      changesArray.forEach((change: any) => {   
         const gridInstance = GridRef1.current.getInstance();


         // 현재 변경된 값이 poAdjAmt일 때 처리
         if (change.columnName === "poAdjAmt") {
            const rowKey = change.rowKey;
   
            // 해당 행에서 poNetAmt poVatAmt, poAdjAmt 값을 가져옴
            const poNetAmt = Number(gridInstance.getValue(rowKey, 'poNetAmt')) || 0;
            const poVatAmt = Number(gridInstance.getValue(rowKey, 'poVatAmt')) || 0;
            const poAdjAmt = Number(gridInstance.getValue(rowKey, 'poAdjAmt')) || 0;
   
            // poAmt 계산 (공급가액 + 부가세액 + 조정금액)
            const poAmt = Math.round(poNetAmt + poVatAmt + poAdjAmt); // 반올림하여 소수점 제거
   
            gridInstance.setValue(rowKey, 'poAmt', poAmt);
         }
      });
   };

   //-------------------button--------------------------
   //저장버튼
   const saveClose = async () => {      
      const data = await getGridValues('S');

      if (data) {
         let result = await SM0103_U01(data);
         console.log('data:', data);
         if (result) {
            await returnResult(result);
         }
      }         
   }; 

   //마감버튼
   const addClose = async () => {
      // 그리드에서 체크된 row 데이터 확인
      const gridInstance = GridRef1.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();

      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('마감할 데이터를 선택하시기 바랍니다.', '확인요청', 'error');
         return;
      }

      alertSwal("마감확인", "마감 하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues('I');

            if (data) {
               let result = await SM0103_U01(data);
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
      const gridInstance = GridRef1.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();

      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('마감할 데이터를 선택하시기 바랍니다.', '확인요청', 'error');
         return;
      }

      const isAlreadyClosed = checkedRows.some((row: any) => row.closeYn === 'Y');
      if (isAlreadyClosed) {
         alertSwal('이미 본사 마감되었습니다. 관리자에게 문의하세요.', '확인요청', 'error');
         return;
      }

      alertSwal("마감취소확인", "마감 취소 하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues('D');

            if (data) {
               let result = await SM0103_U01(data);
               if (result) {
                  await returnResult(result);
               }
            }
         } else if (result.isDismissed) {
            return;
         }
      });  
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
            <InputComp title="직원명" ref={searchRef4} value={inputValues.empNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('empNmS', e);
                     }} />       
            <SelectSearch  title="마감여부" 
                           value={inputValues.closeYnPoBpS}
                           onChange={(label, value) => {
                                 onInputChange('closeYnPoBpS', value);
                              }}                           

                           //초기값 세팅시
                           datas={[{value : '999', label : '전체'},{value : 'Y', label : '마감완료'},{value : 'N', label : '마감전'}]}
            />
            <SelectSearch  title="관할구역" 
                           value={inputValues.poBpS}
                           onChange={(label, value) => {
                                 onInputChange('poBpS', value);
                              }}

                           readonly={userInfo.usrDiv !== '999' ? true : false}
                           addData={"999"}

                           //초기값 세팅시
                           stringify={true}
                           param={{ coCd: "100",bpType : "ZZ0003", bpNm : '999', bpDiv: '999' }}
                           procedure="ZZ_B_PO_BP"
                           dataKey={{ label: "bpNm", value: "bpCd" }}
               />
            <InputComp title="대상자" ref={searchRef5} value={inputValues.ownNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('ownNmS', e);
                     }} />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "마감주문번호", name: "closeSoNo", hidden: true },
      { header: "마감", name: "closeYnPoBp", align: "center", width: 40},
      { header: "주문번호", name: "soNo", align: "center", width: 100, rowSpan: true },
      { header: "고객사", name: "bpNm", width: 200 },
      { header: "대상자", name: "ownNm", width: 60, align: "center" },
      { header: "배송지", name: "dlvyNm", width: 200},
      { header: "관할구역", name: "poBpNm", width: 120},
      { header: "주문일", name: "orderDt", align: "center", width: 80, hidden: true},
      { header: "직원명", name: "empNm", width: 60},
      { header: "품목", name: "itemNm", width: 200 },
      { header: "수량", name: "soQty", width: 40, align: "center" },
      { header: "정산금액", name: "totalAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      // { header: "비율", name: "bpRate", align: "center", width: 60},
      { header: "공급금액", name: "poNetAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "부가세", name: "poVatAmt", align: "right", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "조정금액", name: "poAdjAmt", align: "right", editor:"text", width: 90, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "청구금액", name: "poAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "비고", name: "poRemark", width: 200, editor:"text" },
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
         bpRate: {
            template: (e:any) => {
                return `합계 : `;
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
         poAdjAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
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
                  <div className="">주문 리스트</div>
               </div>
   
               {/* 마감여부에 따라 버튼 input을 조건부 렌더링 */}
               <div className="flex space-x-1">
                  {/* 마감전일 때 마감 버튼 표시 */}
                  {isCloseYnNotComplete && (
                     <>
                        <button type="button" onClick={addClose} className="bg-green-400 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                           <CheckIcon className="w-5 h-5" />
                           마감
                        </button>
                     </>
                  )}
   
                  {/* 마감완료일 때 마감 취소 버튼 표시 */}
                  {isCloseYnComplete && (
                     <>
                        <button type="button" onClick={delClose} className="bg-rose-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                           <XMarkIcon className="w-5 h-5" />
                           마감취소
                        </button>
                        <button type="button" onClick={saveClose} className="bg-blue-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                           <ServerIcon className="w-5 h-5" />
                           저장 
                        </button>
                     </>
                  )}
                  
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} handleAfterChange={handleAfterChange} rowHeaders={['checkbox','rowNum']} gridRef={GridRef1} height={window.innerHeight - 590} summary={summary}/>
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

export default So0103;
