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

   const breadcrumbItem = [{ name: "정산관리" }, { name: "정산관리" }, { name: "매입등록" }];

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
   // useEffect(() => {
   //    if (GridRef1.current && gridDatas1) {
   //       let grid1 = GridRef1.current.getInstance();
   //       grid1.resetData(gridDatas1);

   //       let focusRowKey = grid1.getFocusedCell()?.rowKey || 0;

   //       if (gridDatas1.length > 0) {
   //          grid1.focusAt(focusRowKey, 0, true);
   //       }
         
         
   //    } 
   // }, [gridDatas1]);

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
      if (GridRef1.current && gridDatas1) {
         const gridInstance = GridRef1.current.getInstance();
         
         // gridDatas1을 순회하며 조건에 따라 컬럼을 활성화 또는 비활성화
         gridDatas1.forEach((row, index) => {
            if (row) {
               // 카드 입금일은 카드 결제금액이 0보다 클 때만 활성화
               if (row.closeYn === "N") {
                  gridInstance.enableColumn('purchaseAmt');
                  gridInstance.enableColumn('purchaseNetAmt');
                  gridInstance.enableColumn('purchaseVatAmt');
               } else {
                  gridInstance.disableColumn('purchaseAmt');
                  gridInstance.disableColumn('purchaseNetAmt');
                  gridInstance.disableColumn('purchaseVatAmt');
               }
            }
         });
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
          yyyyMm: yyyyMm,
          closeYn: inputValues.closeYnPoBpS || '999',
        };
    
        const data = JSON.stringify(param);
        const result = await fetchPost(`SM0104_S01`, { data });
    
        if (!result || result.length === 0) {
          setGridDatas([]);
          return;
        }

        setTimeout(() => {
          setGridDatas(result);
        }, 100);  // 100ms 딜레이 추가
    
        return result;
      } catch (error) {
        console.error("SM0104_S01 Error:", error);
      }
    };

   // 마감 저장
   const SM0104_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SM0104_U01`, data);
         return result;
      } catch (error) {
         console.error("SM0104_U01 Error:", error);
         throw error;
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

   const handleAfterChange = async (ev: any) => {

      const changesArray = ev.changes; // ev.changes가 배열이므로 이를 사용
  
      // 배열이기 때문에 forEach로 순회
      changesArray.forEach((change: any) => {   
         const gridInstance = GridRef1.current.getInstance();


         // 현재 변경된 값이 adjAmt일 때 처리
         if (change.columnName === "adjAmt") {
            const rowKey = change.rowKey;
   
            // 해당 행에서 poNetAmt poVatAmt, poAdjAmt 값을 가져옴
            const poNetAmt = Number(gridInstance.getValue(rowKey, 'purchaseNetAmt')) || 0;
            const poVatAmt = Number(gridInstance.getValue(rowKey, 'purchaseVatAmt')) || 0;
            const poAdjAmt = Number(gridInstance.getValue(rowKey, 'poAdjAmt')) || 0;
            const adjAmt = Number(gridInstance.getValue(rowKey, 'adjAmt')) || 0;
   
            // poAmt 계산 (공급가액 + 부가세액 + 본부조정금액 + 본사조정금액)
            const poAmt = Math.round(poNetAmt + poVatAmt + adjAmt + poAdjAmt); // 반올림하여 소수점 제거
   
            gridInstance.setValue(rowKey, 'purchaseAmt', poAmt);
         }
      });
   };

   //-------------------button--------------------------
   //grid 추가버튼
   const addGridRow = () => {
      let grid = GridRef1.current.getInstance();

      const focusedCell = grid.getFocusedCell();
  
      // 선택된 행의 rowKey와 columnName을 활용하여 soNo 값을 가져옴
      if (focusedCell) {
        const { rowKey } = focusedCell;
        const selectedSoNo = grid.getValue(rowKey, 'soNo'); // 선택된 행의 soNo 값 가져오기
        const selectedPoBpCd = grid.getValue(rowKey, 'poBpCd'); // 선택된 행의 poBpCd 값 가져오기
        const selectedOrderDt = grid.getValue(rowKey, 'orderDt'); // 선택된 행의 orderDt 값 가져오기
        
        // 새로운 행을 추가하면서 선택된 soNo 값을 사용
        grid.appendRow({ soNo: selectedSoNo, poBpCd: selectedPoBpCd, orderDt: selectedOrderDt, closeSoSeq: null, coCd: "100", isNew: true }, { at: rowKey+1 });

         grid.focusAt(rowKey+1, 1, true);
      }
   };

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
               let result = await SM0104_U01(data);
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
         let result = await SM0104_U01(data);
         if (result) {
            await returnResult(result);
         }
      }
   }; 

   //저장버튼
   const saveClose = async () => {      
      const data = await getGridValues('S');

      if (data) {
         let result = await SM0104_U01(data);
         console.log('data:', data);
         if (result) {
            await returnResult(result);
         }
      }         
   }; 

   const returnResult = async(result:any) => {     
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      search();
   };

   const handleClick = (ev: any) => {
      const { rowKey, columnName } = ev;
      const grid1 = GridRef1.current.getInstance();
   
      // 주문번호 컬럼 클릭일 때만 동작
      if (columnName !== "soNo") return;
   
      // 클릭된 행의 주문번호 가져오기
      const clickedSoNo = grid1.getValue(rowKey, "soNo");
   
      // 같은 주문번호를 가진 모든 행 찾기
      const allRows = grid1.getData();
      const sameSoNoRows = allRows
         .map((row: any, index: number) => ({ rowKey: index, soNo: row.soNo }))
         .filter((row: any) => row.soNo === clickedSoNo);
   
      // 현재 체크 상태 확인 (첫 번째 행 기준)
      const isChecked = grid1.getCheckedRows().some((row: any) => row.soNo === clickedSoNo);
   
      // 같은 주문번호를 가진 모든 행 체크/해제
      sameSoNoRows.forEach((row: any) => {
         if (isChecked) {
            grid1.uncheck(row.rowKey);
         } else {
            grid1.check(row.rowKey);
         }
      });
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
            <SelectSearch title="마감여부" 
                              value={inputValues.closeYnPoBpS}
                              onChange={(label, value) => {
                                    onInputChange('closeYnPoBpS', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '999', label : '전체'},{value : 'Y', label : '마감완료'},{value : 'N', label : '마감전'}]}
            />
            <SelectSearch title="관할구역" 
                              value={inputValues.poBpS}
                              onChange={(label, value) => {
                                    onInputChange('poBpS', value);
                                 }}

                              //readonly={userInfo.usrDiv == 'ZZ0196'}
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
      { header: "마감주문번호", name: "closeSoNo", hidden: true },
      { header: "마감", name: "closeYn", align: "center", width: 40},
      { header: "마감년월", name: "yyyyMm", align: "center", width: 80},
      { header: "주문번호", name: "soNo", align: "center", width: 100, rowSpan: true},
      { header: "고객사", name: "bpNm", width: 200 },
      { header: "대상자", name: "ownNm", width: 80, align: "center" },
      { header: "배송지", name: "dlvyNm", width: 200},
      { header: "관할구역", name: "poBpNm", width: 120, hidden: true},
      { header: "주문일", name: "orderDt", align: "center", width: 80, hidden: true},
      { header: "직원명", name: "empNm", width: 80, hidden: true },
      { header: "품목", name: "itemNm", width: 160 },
      { header: "수량", name: "soQty", width: 40, align: "center", hidden: true },
      { header: "비율", name: "bpRate", align: "center", width: 50, hidden: true},
      { header: "공급금액", name: "netAmt", align: "right", hidden: true, width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "부가세", name: "vatAmt", align: "right", hidden: true, width: 80, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "매출금액", name: "soAmt", align: "right", hidden: true, width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "청구금액", name: "purchaseAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
      { header: "공급금액", name: "purchaseNetAmt", align: "right", width: 100, formatter: function(e: any) {if (e.value === 0) {return '0';} if (e.value) {return commas(e.value); } return '';} },
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
         netAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         vatAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
         purchaseAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },   
         purchaseNetAmt: {
            template: (e:any) => {                  
               const data = e.sum; // e.data가 undefined일 경우 빈 배열로 대체            
               return `${commas(data)}`; // 합계 표시
               }
         },  
         purchaseVatAmt: {
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
                  <div className="">본부 마감 된 주문 리스트</div>
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
                        <button type="button" onClick={saveClose} className="bg-blue-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                           <ServerIcon className="w-5 h-5" />
                           저장 
                        </button>
                        <button type="button" onClick={addGridRow} className="bg-rose-500 text-white rounded-3xl px-3 py-1 flex items-center shadow">
                           <PlusIcon className="w-5 h-5" />
                              추가
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
               </div>
            </div>
   
            <TuiGrid01 columns={grid1Columns} handleDblClick={handleDblClick} handleClick={handleClick} handleAfterChange={handleAfterChange} rowHeaders={['checkbox','rowNum']} gridRef={GridRef1} height={window.innerHeight - 590} summary={summary}/>
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
