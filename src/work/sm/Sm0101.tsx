import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, DatePickerComp, getGridCheckedDatas2, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, CheckIcon, XMarkIcon, CalendarDateRangeIcon } from "@heroicons/react/24/outline";
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

const So0101 = ({ item, activeComp, leftMode, userInfo, handleAddMenuClick, setSoNo }: Props) => {

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);
   const searchRef7 = useRef<any>(null);
   const searchRef8 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      payYnS: '999',
      closeYnS: 'N',
      status: '999',
      payDiv: '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "정산관리" }, { name: "정산관리" }, { name: "매출등록" }];

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

   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         const gridInstance = GridRef1.current.getInstance();
   
         // 행 단위로 셀의 상태를 업데이트
         const updatedData = gridDatas1.map((row) => ({
            ...row,
            _attributes: {
               ...(row._attributes || {}),
               editable: {
                  chkCashDt: row.cashAmt > 0, // cashAmt가 0보다 클 때만 편집 가능
               },
            },
         }));
   
         // 데이터 리셋
         gridInstance.resetData(updatedData);
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
          await SM0101_S01();
      };
  
      handleSearch();
  }, [inputValues.yyyyMmS, inputValues.payYnS, inputValues.closeYnS, inputValues.status, inputValues.startDate, inputValues.endDate, inputValues.payDiv]);

 
   //---------------------- api -----------------------------

   const SM0101_S01 = async () => {
      const yyyyMm = inputValues.yyyyMmS ? inputValues.yyyyMmS.slice(0, 7).replace('-','') : '999';
      
      try {
        const param = {
          coCd: userInfo.coCd,
          startDt: inputValues.startDate,
          endDt: inputValues.endDate,
          soNo: searchRef1.current?.value || '999',
          bpNm: searchRef2.current?.value || '999',
          ownNm: searchRef8.current?.value || '999',
          dlvyNm: searchRef3.current?.value || '999',
          payYn: inputValues.payYnS || '999',
          yyyyMm: yyyyMm,
          closeYn: inputValues.closeYnS || '999',
          payDiv: inputValues.payDiv || '999',
          status: inputValues.status || '999',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`SM0101_S01`, { data });
    
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
        }, 200);  // 100ms 딜레이 추가
    
        return result;
      } catch (error) {
        console.error("SM0101_S01 Error:", error);
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
      await fetchWithLoading(async () => {
         try {
            await SM0101_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await SM0101_S01();
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

   const handleDblClick = async (e: any) => {

      // SP0110 탭 열리기
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
      const grid = GridRef1.current.getInstance();
      const rowData = grid.getRow(e.rowKey);

      setSoNo(rowData.soNo);
      handleAddMenuClick(menu);
    
      

    
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
               let result = await SM0101_U01(data);
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
      // 그리드에서 체크된 row 데이터 확인
      const gridInstance = GridRef1.current.getInstance();
      const checkedRows = gridInstance.getCheckedRows();

      if (!checkedRows || checkedRows.length === 0) {
         alertSwal('마감취소할 데이터를 선택하시기 바랍니다.', '확인요청', 'error');
         return;
      }

      alertSwal("마감확인", "마감 취소하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            const data = await getGridValues('D');

            if (data) {
               let result = await SM0101_U01(data);
               if (result) {
                  await returnResult(result);
               }
            }
         } else if (result.isDismissed) {
            return;
         }
      });      
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
            <InputComp title="고객사" ref={searchRef2} value={inputValues.bpNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('bpNmS', e);
                     }} />
            <InputComp title="배송지" ref={searchRef3} value={inputValues.dlvyNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('dlvyNmS', e);
                     }} />            
            
            <SelectSearchComp title="결제여부" 
                              ref={searchRef4}
                              value={inputValues.payYnS}
                              onChange={(label, value) => {
                                    onInputChange('payYnS', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'Y', label : '결제완료'},{value : 'N', label : '미결제'}]}
            />
            <SelectSearchComp title="마감여부" 
                              ref={searchRef5}
                              value={inputValues.closeYnS}
                              onChange={(label, value) => {
                                    onInputChange('closeYnS', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'Y', label : '마감완료'},{value : 'N', label : '마감전'}]}
            />
            <SelectSearchComp title="진행상태" 
                              ref={searchRef6}
                              value={inputValues.status}
                              onChange={(label, value) => {
                                    onInputChange('status', value);
                                 }}                           

                              //초기값 세팅시
                              param={{ coCd: "999", majorCode: "FU0009", div: "999" }}
                              procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
               />
            <SelectSearchComp title="결제구분" 
                              ref={searchRef7}
                              value={inputValues.payDiv}
                              onChange={(label, value) => {
                                    onInputChange('payDiv', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'receipt', label : '계산서'},{value : 'card', label : '카드'},{value : 'cash', label : '현금'}]}
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
            <InputComp title="대상자" ref={searchRef8} value={inputValues.ownNmS} handleCallSearch={handleCallSearch} 
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
      { header: "마감여부", name: "closeYn", align: "center", width: 60},
      { header: "마감년월", name: "yyyyMm", align: "center", width: 80},
      { header: "주문번호", name: "soNo", align: "center", width: 100},
      { header: "고객사", name: "bpNm", width: 230 },
      { header: "재직구분", name: "subCodeNm", width: 100 },
      { header: "대상자", name: "ownNm", width: 80, align: "center" },
      { header: "품목", name: "itemNm", width: 280 },      
      { header: "매출금액", name: "soAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "미결제금액", name: "noPay", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "계산서발행", name: "receiptAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "카드결제", name: "cardAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "현금결제", name: "cashAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "입금일", name: "chkCashDt", align: "center", hidden: true, width: 120, editor: { type: 'datePicker', options: { language: 'ko', format: 'yyyy-MM-dd', timepicker: false } } },
      { header: "패키지", name: "pkgItemNm", width: 120 },
      { header: "주문상태", name: "poStatusNm", width: 120 },
      { header: "상품구분", name: "exDivNm", width: 120 },
      { header: "부서", name: "deptNm", width: 120 },
      { header: "직급", name: "roleNm", width: 120 },
      { header: "경조사유", name: "hsNm", width: 120 },
      { header: "배송지", name: "dlvyNm", width: 250 },
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
          itemNm: {
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
                        <button type="button" onClick={addClose} className="bg-green-400 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                           <CheckIcon className="w-5 h-5" />
                           마감
                        </button>
                     </>
                  )}
   
                  {/* 마감완료일 때 마감 취소 버튼 표시 */}
                  {isCloseYnComplete && (
                     <button type="button" onClick={delClose} className="bg-rose-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                        <XMarkIcon className="w-5 h-5" />
                        마감취소
                     </button>
                  )}
                  {/* <button type="button" onClick={saveClose} className="bg-blue-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                        <CalendarDateRangeIcon className="w-5 h-5" />
                        입금일 저장
                  </button> */}
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} handleDblClick={handleDblClick} rowHeaders={['checkbox','rowNum']} gridRef={GridRef1} height={window.innerHeight-595} summary={summary}/>
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

export default So0101;
