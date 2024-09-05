import { on } from "events";
import { React, useEffect, useState, useRef, useCallback, initChoice, 
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, SelectSearchComp, DateRangePickerComp, date, InputSearchComp, commas,
    RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, formatCardNumber, formatExpiryDate, getGridCheckedDatas2 } from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const SO0201 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef1 = useRef<any>(null);    // 고객사별 참고사항
   const gridRef2 = useRef<any>(null);    // 상품정보
   const gridRef3 = useRef<any>(null);    // 발주정보
   const gridRef4 = useRef<any>(null);    // 사전상담 정보
   const gridRef5 = useRef<any>(null);    // 결제처리
   const gridRef6 = useRef<any>(null);    // 메모정보
   const gridRef7 = useRef<any>(null);    // 재고이동정보
   const gridRef8 = useRef<any>(null);    // 발주확정정보
   const gridRefP1 = useRef<any>(null);    // 주문팝업
   const gridRefP2 = useRef<any>(null);    // 고객사팝업
   const gridRefP3 = useRef<any>(null);    // 배송지팝업
   const gridRefP4 = useRef<any>(null);    // 사전상담팝업
   const gridRefP5 = useRef<any>(null);    // 품목팝업
   const gridRefP6 = useRef<any>(null);    // 발주지점팝업
   const gridContainerRef1 = useRef(null);
   const gridContainerRef2 = useRef(null);
   const gridContainerRef3 = useRef(null);
   const gridContainerRef4 = useRef(null);
   const gridContainerRef5 = useRef(null);
   const gridContainerRef6 = useRef(null);
   const gridContainerRef7 = useRef(null);
   const gridContainerRef8 = useRef(null);

   //검색창 ref
    const searchRef1 = useRef<any>(null);
    const searchRef2 = useRef<any>(null);
    const searchRef3 = useRef<any>(null);
    const searchRef4 = useRef<any>(null);
    const searchRef5 = useRef<any>(null);
    const searchRef6 = useRef<any>(null);

   const [tabIndex, setTabIndex] = useState(0);
   const [currentInputDiv, setCurrentInputDiv] = useState<JSX.Element | null>(null);

   const refs = {
      rcptUserId: useRef<any>(null),
      mouYn: useRef<any>(null),
      subCode: useRef<any>(null),
      hsCd: useRef<any>(null),  
      rcptMeth: useRef<any>(null),  
      payYn: useRef<any>(null),  
   };

   const [gridDatas1, setGridDatas1] = useState<any[]>();       // 고객사별 참고사항
   const [gridDatas2, setGridDatas2] = useState<any[]>();      // 상품정보
   const [gridDatas3, setGridDatas3] = useState<any[]>();      // 발주정보
   const [gridDatas4, setGridDatas4] = useState<any[]>();      // 사전상담 정보
   const [gridDatas5, setGridDatas5] = useState<any[]>();      // 결제처리
   const [gridDatas6, setGridDatas6] = useState<any[]>();      // 메모정보
   const [gridDatas7, setGridDatas7] = useState<any[]>();      // 재고이동정보
   const [gridDatas8, setGridDatas8] = useState<any[]>();      // 발주확정정보
   const [gridDatasP1, setGridDatasP1] = useState<any[]>();      // 주문정보
   const [gridDatasP2, setGridDatasP2] = useState<any[]>();      // 고객사정보
   const [gridDatasP3, setGridDatasP3] = useState<any[]>();      // 배송지정보
   const [gridDatasP4, setGridDatasP4] = useState<any[]>();      // 사전상담팝업정보
   const [gridDatasP5, setGridDatasP5] = useState<any[]>();      // 품목팝업정보
   const [gridDatasP6, setGridDatasP6] = useState<any[]>();      // 발주지점팝업정보

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),    //주문팝업
      endDate: date(),
      startDate2: date(-1, 'month'),   // 사전상담 팝업
      endDate2: date(),
      dealType: 'A',
      rcptUserId: "",
      rcptMeth: "FU0007",
   });

   const onInputChange = (name: string, value: any) => {
      // 현재 상태와 비교하여 동일한 값이 들어오지 않을 경우에만 상태 업데이트
      setInputValues((prevValues) => {
          if (prevValues[name] === value) {
              return prevValues;
          }
          return {
              ...prevValues,
              [name]: value !== null ? value : "", // null 대신 빈 문자열
          };
      });
  };

   const [focusRow, setFocusRow] = useState<any>(0);
   const [isOpen, setIsOpen] = useState(false);       // 주문정보 팝업
   const [isOpen2, setIsOpen2] = useState(false);     // 고객사 팝업
   const [isOpen3, setIsOpen3] = useState(false);     // 배송지 팝업
   const [isOpen4, setIsOpen4] = useState(false);     // 사전상담 팝업
   const [isOpen5, setIsOpen5] = useState(false);     // 품목 팝업
   const [isOpen6, setIsOpen6] = useState(false);     // 발주지점 팝업

   const breadcrumbItem = [{ name: "주문관리" }, { name: "주문" }, { name: "주문 등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: gridRef1, containerRef: gridContainerRef1, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      reSizeGrid({ ref: gridRef4, containerRef: gridContainerRef4, sec: 200 });
      reSizeGrid({ ref: gridRef5, containerRef: gridContainerRef5, sec: 200 });
      reSizeGrid({ ref: gridRef6, containerRef: gridContainerRef6, sec: 200 });
      reSizeGrid({ ref: gridRef7, containerRef: gridContainerRef7, sec: 200 });
      reSizeGrid({ ref: gridRef8, containerRef: gridContainerRef7, sec: 200 });
   }, []);   

   //--------------------init---------------------------

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef1);
      refreshGrid(gridRef2);
      refreshGrid(gridRef3);
      refreshGrid(gridRef4);
      refreshGrid(gridRef5);
      refreshGrid(gridRef6);
      refreshGrid(gridRef7);
      refreshGrid(gridRef8);
      refreshGrid(gridRefP1);
      refreshGrid(gridRefP2);
      refreshGrid(gridRefP3);
      refreshGrid(gridRefP4);
   }, [activeComp,tabIndex]);

   useEffect(() => {
      //console.log(inputValues);
   }, [inputValues]);

   //Grid 데이터 설정
   useEffect(() => {
      if (gridRef1.current && gridDatas1) {
         let grid = gridRef1.current.getInstance();
         grid.resetData(gridDatas1);
         if (gridDatas1.length > 0) {
            grid.focusAt(focusRow, 0, true);
         }
      }

   }, [gridDatas1]);

   // 상품정보 팝업
   useEffect(() => {
      if (gridRef2.current && gridDatas2) {
         let grid2 = gridRef2.current.getInstance();
         
         // grid가 존재하는지 확인
         if (!grid2) return;

         // 기존에 등록된 클릭 이벤트가 있다면 제거
        grid2.off('click');
   
         grid2.on('click', async (e:any) => {                     
            if (e.columnName === 'poBpBtn') {
               if(inputValues.dealType === 'B') {
                  //handleCallSearch8();
                  const soQty = grid2.getValue(e.rowKey, 'soQty'); // 수량
                  const itemCd = grid2.getValue(e.rowKey, 'itemCd'); // 품목 코드
                  const branchGroup = grid2.getValue(e.rowKey, 'branchGroup'); // 지점 그룹

                  onInputChange('soQty', soQty);
                  onInputChange('itemCd', itemCd);
                  onInputChange('branchGroup', branchGroup);
                  onInputChange('poBpGubun', 'poBp');

                  let poBp = await SO0201_P07({ soQty: soQty, itemCd: itemCd, branchGroup: branchGroup, bpNm: '999' });
                  setGridDatasP6(poBp);
            
                  setIsOpen6(true);
                  setTimeout(() => {
            
                  refreshGrid(gridRefP6);
                  }, 100);
               } else {
                  setIsOpen6(false);
                  alertSwal("", "표준일때는 선택할 수 없습니다. 예외일때만 가능합니다.", "warning");
               }
            } else if (e.columnName === 'itemBtn') {
               console.log(inputValues.dealType); 
               if(inputValues.dealType === 'B') {  
                  handleCallSearch7();
            
                  setIsOpen5(true);
                  setTimeout(() => {
            
                  refreshGrid(gridRefP5);
                  }, 100);
               } else {
                  setIsOpen5(false);
                  alertSwal("", "표준일때는 선택할 수 없습니다. 예외일때만 가능합니다.", "warning");
               }
            }
         });
      }
   }, [inputValues.dealType, gridDatas2]);

   useEffect(() => {
      if (gridRef2.current) {
         const gridInstance = gridRef2.current.getInstance();
   
         if (inputValues.dealType === 'B') {
            gridInstance.enableColumn('soQty');
            gridInstance.enableColumn('soPrice');
            gridInstance.enableColumn('payDiv');
            gridInstance.enableColumn('reason');
         } else if (inputValues.dealType === 'A') {
            gridInstance.disableColumn('soQty');
            gridInstance.disableColumn('soPrice');
            gridInstance.disableColumn('payDiv');
            gridInstance.disableColumn('reason');
         }
      }
   }, [inputValues.dealType, gridDatas2]);

   useEffect(() => {
      if (gridRef2.current && gridDatas2) {
         let grid2 = gridRef2.current.getInstance();
         // 'MANDATORY_YN' 값이 'Y'인 것만 체크된 상태로 설정
         let filteredData = gridDatas2.map((row) => ({
            ...row,
            _attributes: {
               checked: row.mandatoryYn === 'Y',
            },
           
         }));

   

         grid2.resetData(filteredData);

         let focusRowKey = grid2.getFocusedCell().rowKey || 0;

         if (gridDatas2.length > 0) {
            grid2.focusAt(focusRowKey, 0, true);
         }
         
      }

   }, [gridDatas2]);

   useEffect(() => {
      if (gridRef3.current && gridDatas3) {
         let grid3 = gridRef3.current.getInstance();
         grid3.resetData(gridDatas3);

         let focusRowKey = grid3.getFocusedCell().rowKey || 0;

         if (gridDatas3.length > 0) {
            grid3.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas3]);

   useEffect(() => {
      if (gridRef4.current && gridDatas4) {
         let grid4 = gridRef4.current.getInstance();
         grid4.resetData(gridDatas4);
        
     
         let focusRowKey = grid4.getFocusedCell().rowKey || 0;

         if (gridDatas4.length > 0) {
            grid4.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas4]);

   useEffect(() => {
      if (gridRef5.current && gridDatas5) {
         let grid5 = gridRef5.current.getInstance();
         grid5.resetData(gridDatas5);

         let focusRowKey = grid5.getFocusedCell().rowKey || 0;

         if (gridDatas5.length > 0) {
            grid5.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas5]);

   useEffect(() => {
      if (gridRef6.current && gridDatas6) {
         let grid6 = gridRef6.current.getInstance();
         grid6.resetData(gridDatas6);

         let focusRowKey = grid6.getFocusedCell().rowKey || 0;

         if (gridDatas6.length > 0) {
            grid6.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas6]);

   // 상품정보 팝업
   useEffect(() => {
      if (gridRef7.current && gridDatas7) {
         let grid7 = gridRef7.current.getInstance();
         
         // grid가 존재하는지 확인
         if (!grid7) return;

         // 기존에 등록된 클릭 이벤트가 있다면 제거
        grid7.off('click');
   
         grid7.on('click', async (e:any) => {                     
            if (e.columnName === 'tsBpBtn') {
               const soQty = grid7.getValue(e.rowKey, 'soQty'); // 수량
               const itemCd = grid7.getValue(e.rowKey, 'itemCd'); // 품목 코드
               const branchGroup = grid7.getValue(e.rowKey, 'branchGroup'); // 지점 그룹

               onInputChange('soQty', soQty);
               onInputChange('itemCd', itemCd);
               onInputChange('branchGroup', branchGroup);
               onInputChange('poBpGubun', 'tsBp');

               let poBp = await SO0201_P07({ soQty: soQty, itemCd: itemCd, branchGroup: branchGroup, bpNm: '999' });
               setGridDatasP6(poBp);
         
               setIsOpen6(true);
               setTimeout(() => {
         
               refreshGrid(gridRefP6);
               }, 100);
            }
         });
      }
   }, [gridDatas7]);

   useEffect(() => {
      if (gridRef7.current && gridDatas7) {
         let grid7 = gridRef7.current.getInstance();
         grid7.resetData(gridDatas7);

         let focusRowKey = grid7.getFocusedCell().rowKey || 0;

         if (gridDatas7.length > 0) {
            grid7.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas7]);

   useEffect(() => {
      if (gridRef8.current && gridDatas8) {
         let grid8 = gridRef8.current.getInstance();
         grid8.resetData(gridDatas8);

         let focusRowKey = grid8.getFocusedCell().rowKey || 0;

         if (gridDatas8.length > 0) {
            grid8.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas8]);

   useEffect(() => {
      if (gridRefP1.current && gridDatasP1) {
         let gridP1 = gridRefP1.current.getInstance();
         gridP1.resetData(gridDatasP1);
         refreshGrid(gridRefP1);
         let focusRowKey = gridP1.getFocusedCell().rowKey || 0;

         if (gridDatasP1.length > 0) {
            gridP1.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatasP1]);

   useEffect(() => {
      if (gridRefP2.current && gridDatasP2) {
         let gridP2 = gridRefP2.current.getInstance();
      
         gridP2.resetData(gridP2);
         refreshGrid(gridRefP2);
         let focusRowKey = gridP2.getFocusedCell().rowKey || 0;

         if (gridDatasP2.length > 0) {
            gridP2.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatasP2]);

   useEffect(() => {
      if (gridRefP3.current && gridDatasP3) {
         let gridP3 = gridRefP3.current.getInstance();
         gridP3.resetData(gridDatasP3);
         refreshGrid(gridRefP3);
         let focusRowKey = gridP3.getFocusedCell().rowKey || 0;

         if (gridDatasP3.length > 0) {
            gridP3.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatasP3]);

   useEffect(() => {
      if (gridRefP4.current && gridDatasP4) {
         let gridP4 = gridRefP4.current.getInstance();
         gridP4.resetData(gridDatasP4);
         refreshGrid(gridRefP4);
         let focusRowKey = gridP4.getFocusedCell().rowKey || 0;

         if (gridDatasP4.length > 0) {
            gridP4.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatasP4]);

   useEffect(() => {
      if (gridRefP5.current && gridDatasP5) {
         let gridP5 = gridRefP5.current.getInstance();
         gridP5.resetData(gridDatasP5);
         refreshGrid(gridRefP5);
         let focusRowKey = gridP5.getFocusedCell().rowKey || 0;

         if (gridDatasP5.length > 0) {
            gridP5.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatasP5]);

   useEffect(() => {
      if (gridRefP6.current && gridDatasP6) {
         let gridP6 = gridRefP6.current.getInstance();
         gridP6.resetData(gridDatasP6);
         refreshGrid(gridRefP6);
         let focusRowKey = gridP6.getFocusedCell().rowKey || 0;

         if (gridDatasP6.length > 0) {
            gridP6.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatasP6]);

   //---------------------- api -----------------------------
   var ZZ_CONT_INFO = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_CONT_INFO`, { data });

         return result;
      } catch (error) {
         console.error("ZZ_CONT_INFO Error:", error);
         throw error;
      }
   }

   // 상품정보, 발주정보
   var SO0201_S02 = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0201_S02`, { data });

         return result;
      } catch (error) {
         console.error("SO0201_S02 Error:", error);
         throw error;
      }
   }

   // 사전상담 조회
   var SO0101_S02 = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0101_S02`, { data });

         return result;
      } catch (error) {
         console.error("SO0101_S02 Error:", error);
         throw error;
      }
   }

   // 결제처리 조회
   var SO0201_S03 = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0201_S03`, { data });

         return result;
      } catch (error) {
         console.error("SO0201_S03 Error:", error);
         throw error;
      }
   }

   // 메모 조회
   var SO0201_S04 = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0201_S04`, { data });

         return result;
      } catch (error) {
         console.error("SO0201_S04 Error:", error);
         throw error;
      }
   }

   // 계약품목 조회
   var SO0201_S10 = async (param : any) => {
      try {  
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0201_S10`, { data });

         setGridDatas2(result);
         setGridDatas3(result);
         setGridDatas7(result);
         setGridDatas8(result);

         return result;
      } catch (error) {
         console.error("SO0201_S10 Error:", error);
         throw error;
      }
   }

   // 고객사별 참고사항
   var SO0201_P05 = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0201_P05`, { data });

         return result;
      } catch (error) {
         console.error("SO0201_P05 Error:", error);
         throw error;
      }
   }

   // 지점팝업 조회
   var SO0201_P07 = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0201_P07`, { data });

         return result;
      } catch (error) {
         console.error("SO0201_P07 Error:", error);
         throw error;
      }
   }

   const SO0201_U05 = async (data: any) => {
      try {
         const result = await fetchPost(`SO0201_U05`, data);
         return result;
      } catch (error) {
         console.error("SO0201_U05 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = async (soNo:any) => {
      const param = {    
         soNo: soNo,
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_S01", {data});

      // 조회된 값이 없으면 함수 종료
      if (!result || result.length === 0) {
         return;
      }

      let subCodeIn = await ZZ_CONT_INFO({ contNo: result[0].contNo, bpCd: result[0].soldToParty, subCode: result[0].subCode, searchDiv: "SUB" });

      if (refs.subCode.current) {
         refs.subCode.current.updateChoices(
            subCodeIn.map((item:any) => ({
              value: item.subCode,
              label: item.subCodeNm,
            }))
         );
      };

      let hsCdIn = await ZZ_CONT_INFO({ contNo: result[0].contNo, bpCd: result[0].soldToParty, subCode: result[0].subCode, searchDiv: "HS" });

      if (refs.hsCd.current) {
         refs.hsCd.current.updateChoices(
            hsCdIn.map((item:any) => ({
            value: item.hsCode,
            label: item.hsNm,
            }))
         );
      };

      // 고객사별 참고사항
      let tip = await SO0201_P05({ bpCd: result[0].soldToParty });
      setGridDatas1(tip);

      // 상품정보
      let itemInfo = await SO0201_S02({ soNo: result[0].soNo });
      setGridDatas2(itemInfo);
      setGridDatas3(itemInfo);
      setGridDatas7(itemInfo);
      setGridDatas8(itemInfo);

      // 사전상담
      let preRcpt = await SO0101_S02({ preRcptNo: result[0].preRcptNo });
      setGridDatas4(preRcpt);

      // 결제처리
      let payInfo = await SO0201_S03({ soNo: result[0].soNo });
      setGridDatas5(payInfo);

      // 메모
      let memo = await SO0201_S04({ soNo: result[0].soNo });
      setGridDatas6(memo);

      // InputSearchComp1에 값 설정      
      onInputChange('coCd', result[0].coCd);
      onInputChange('soNo', result[0].soNo);
      onInputChange('rcptMeth', result[0].rcptMeth);
      refs.rcptMeth.current.setChoiceByValue(result[0].rcptMeth);
      onInputChange('orderDt', result[0].orderDt);
      onInputChange('rcptUserId', result[0].rcptUserId);
      refs.rcptUserId.current.setChoiceByValue(result[0].rcptUserId);
      onInputChange('ownNm', result[0].ownNm);
      onInputChange('ownTelNo', result[0].ownTelNo);
      onInputChange('soldToParty', result[0].soldToParty);
      onInputChange('bpNm', result[0].bpNm);
      onInputChange('contNo', result[0].contNo);
      onInputChange('subCode', result[0].subCode);
      refs.subCode.current.setChoiceByValue(result[0].subCode);
      onInputChange('hsCd', result[0].hsCd);
      refs.hsCd.current.setChoiceByValue(result[0].hsCd);
      onInputChange('deptNm', result[0].deptNm);
      onInputChange('roleNm', result[0].roleNm);
      onInputChange('dlvyHopeDt', result[0].dlvyHopeDt);
      onInputChange('roleNm', result[0].roleNm);
      onInputChange('dlvyCd', result[0].dlvyCd);
      onInputChange('dlvyNm', result[0].dlvyNm);
      onInputChange('preDlvyNm', result[0].dlvyNm);
      onInputChange('dlvyAddr', result[0].dlvyAddr);
      onInputChange('roomNo', result[0].roomNo);
      onInputChange('reqNm', result[0].reqNm);
      onInputChange('reqTelNo', result[0].reqTelNo);
      onInputChange('dNm', result[0].dNm);
      onInputChange('memo', result[0].memo);
      onInputChange('confirmDt', result[0].confirmDt);
      onInputChange('preRcptNo', result[0].preRcptNo);
      onInputChange('pkgYn', result[0].pkgYn);
      onInputChange('dealType', result[0].dealType);
   };

   const create = async () => {
      console.log('create');
   };

   const save = async () => {
      const gridInstance = gridRef3.current.getInstance();
      gridInstance.blur();
      const gridInstance2 = gridRef7.current.getInstance();
      gridInstance2.blur();
      
      const data = await getGridValues();
      console.log(data);
      if (data) {
         let result = await SO0201_U05(data);
         if (result) {
            await returnResult(result);
         }
      }
      
   };

   const returnResult = async(result:any) => {     
      search(result.soNoOut);
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      if (!inputValues.soNo) {
         inputValues.status = 'I';
      } else {
         inputValues.status = 'U';
      }

      let sSoHdr = [inputValues];
      let sSoDtl = await getGridCheckedDatas2(gridRef2);
      let sSoPay = await getGridDatas(gridRef5);
      let sSoMemo = await getGridDatas(gridRef6);
      let soNo = inputValues.soNo;

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         soNo: soNo,
         sSoHdr: JSON.stringify(sSoHdr),
         sSoDtl: JSON.stringify(sSoDtl),
         sSoPay: JSON.stringify(sSoPay),
         sSoMemo: JSON.stringify(sSoMemo),
      };

      return data;
   };

   //grid 추가버튼 상품정보
   const addGridRow = () => {
      let grid = gridRef2.current.getInstance();

      grid.appendRow({ useYn: "Y", coCd: "100", isNew: true, mandatoryYn: "Y" }, { at: 0 });
      grid.focusAt(0, 1, true);
      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      grid.check(rowKey);
   }; 

   //grid 삭제버튼 상품정보
   const delGridRow = () => {
      let grid = gridRef2.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
  };      

  //grid 추가버튼 결제처리
  const addGridRow2 = () => {
      let grid = gridRef5.current.getInstance();

      grid.appendRow({ useYn: "Y", coCd: "100", isNew: true, payType: "FU0019" }, { at: 0 });
      grid.focusAt(0, 1, true);
   }; 

//grid 삭제버튼 결제처리
   const delGridRow2 = () => {
      let grid = gridRef5.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };      

   //grid 추가버튼 메모정보
  const addGridRow3 = () => {
      let grid = gridRef6.current.getInstance();

      grid.appendRow({ useYn: "Y", coCd: "100", isNew: true, payType: "FU0019" }, { at: 0 });
      grid.focusAt(0, 1, true);
   }; 

   //주문 팝업조회
   const handleCallSearch2 = async () => {
      const param = {    
         startDt: inputValues.startDate,     
         endDt: inputValues.endDate,     
         soNo: '999',
         ownNm: searchRef1.current?.value || '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P01", { data });
      setGridDatasP1(result);
   };

   //고객사 팝업조회
   const handleCallSearch3 = async () => {
      const param = {
         coCd: '100',
         bpNm: searchRef2.current?.value || '999',
         bpDiv: 'ZZ0188',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      setGridDatasP2(result);
   };

   // 사전상담 조회 (연락처)
   const handleCallSearch4 = async () => {
      const param = {         
         ownTelNo: inputValues.ownTelNo,
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P02", { data });

      if (result.length === 1) {
         onInputChange('preRcptNo', result[0].preRcptNo);

         // 사전상담
         let preRcpt = await SO0101_S02({ preRcptNo: result[0].preRcptNo });
         setGridDatas4(preRcpt);
      }
   };

   //배송지 팝업조회
   const handleCallSearch5 = async () => {
      const param = {
         dlvyNm: searchRef3.current?.value || '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P04", { data });
      setGridDatasP3(result);
   };

   //사전상담 팝업조회
   const handleCallSearch6 = async () => {
      const param = {    
         startDt: inputValues.startDate2,     
         endDt: inputValues.endDate2,     
         reqNm: '999',
         ownNm: searchRef4.current?.value || '999',
         bpNm: '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0101_P01", { data });
      setGridDatasP4(result);
   };

   //품목 팝업조회
   const handleCallSearch7 = async () => {
      const param = {
         coCd: '100',
         bpCd: inputValues.soldToParty,
         itemNm: searchRef5.current?.value || '999',
         dealType: inputValues.dealType,
         dlvyCd: inputValues.dlvyCd,
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P10", { data });
      setGridDatasP5(result);
   };

   //발주지점 팝업조회
   const handleCallSearch8 = async () => {
      const param = {
         soQty: inputValues.soQty,
         itemCd: inputValues.itemCd,
         branchGroup: inputValues.branchGroup,
         bpNm: searchRef6.current?.value || '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P07", { data });
      setGridDatasP6(result);
   };

   const handleDblClick = async () => {
      const gridInstance = gridRefP1.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const soNo = gridInstance.getValue(rowKey, "soNo"); // 해당 rowKey에서 soNo 값을 가져옴
      
      search(soNo);

      setIsOpen(false);
   };

   // 거래처팝업 더블클릭
   const handleDblClick2 = async () => {
      refs.subCode.current.setChoiceByValue("");
      onInputChange('subCode', '');
      refs.hsCd.current.setChoiceByValue("");
      onInputChange('hsCd', '');

      const gridInstance = gridRefP2.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const bpCd = gridInstance.getValue(rowKey, "bpCd"); // 해당 rowKey에서 bpCd 값을 가져옴
      const bpNm = gridInstance.getValue(rowKey, "bpNm"); // 해당 rowKey에서 bpNm 값을 가져옴
      const contNo = gridInstance.getValue(rowKey, "contNo"); // 해당 rowKey에서 bpNm 값을 가져옴
      const mouYn = gridInstance.getValue(rowKey, "mouYn"); // 해당 rowKey에서 bpNm 값을 가져옴

      // InputSearchComp1에 값 설정
      onInputChange('bpNm', bpNm);
      onInputChange('soldToParty', bpCd);
      onInputChange('contNo', contNo);
      onInputChange('mouYn', mouYn);

      let subCodeIn = await ZZ_CONT_INFO({ contNo: contNo, bpCd: bpCd, subCode: "999", searchDiv: "SUB" });

      if (refs.subCode.current) {
         refs.subCode.current.updateChoices(
            subCodeIn.map((item:any) => ({
              value: item.subCode,
              label: item.subCodeNm,
            }))
         );
      };

      refs.hsCd.current.updateChoices();

      // 고객사별 참고사항
      const param = {       
         bpCd: bpCd,
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P05", { data });

      setGridDatas1(result);
      
      setIsOpen2(false);
   };

   // 배송지팝업 더블클릭
   const handleDblClick3 = async () => {
      const grid = gridRef2.current.getInstance();
      const firstRow = grid.getRow(0); // 첫 번째 행 가져오기

      const updateHSCode = async () => {
         const gridInstance = gridRefP3.current.getInstance();
         const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

         const dlvyCd = gridInstance.getValue(rowKey, "dlvyCd"); // 해당 rowKey에서 soNo 값을 가져옴
         const dlvyNm = gridInstance.getValue(rowKey, "dlvyNm"); // 해당 rowKey에서 soNo 값을 가져옴
         const addr1 = gridInstance.getValue(rowKey, "addr1"); // 해당 rowKey에서 soNo 값을 가져옴
         
         onInputChange('dlvyCd', dlvyCd);
         onInputChange('dlvyNm', dlvyNm);
         onInputChange('dlvyAddr', addr1);

         await SO0201_S10({soNo: inputValues.soNo, bpCd: inputValues.soldToParty, contNo: inputValues.contNo, subCode: inputValues.subCode, hsCd: inputValues.hsCd, dlvyCd: dlvyCd, dealType: inputValues.dealType});

         setIsOpen3(false);
      };

      if (firstRow && firstRow.chkYn === 'Y') {
         alertSwal("상품조회", "계약조건이 변경되어 상품정보가 삭제 후 다시 조회 됩니다. 계속 하시겠습니까?", "warning", true).then(async (result) => {
         if (result.isConfirmed) {
            await updateHSCode();
         } else if (result.isDismissed) {
            return;
         }
         });
      } else {
         await updateHSCode();
      }
      
   };

   // 사전상담 팝업 더블클릭
   const handleDblClick4 = async () => {
      const gridInstance = gridRefP4.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const preRcptNo = gridInstance.getValue(rowKey, "preRcptNo"); // 해당 rowKey에서 bpCd 값을 가져옴
      
      let preRcpt = await SO0101_S02({ preRcptNo: preRcptNo });

      setGridDatas4(preRcpt);

      setIsOpen4(false);
   };

   // 품목 팝업 더블클릭
   const handleDblClick5 = async () => {
      const gridInstance = gridRefP5.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴
    
      const gridInstance2 = gridRef2.current.getInstance();
      const { rowKey: rowKey2 } = gridInstance2.getFocusedCell(); // gridRef2의 포커스된 행
    
      // rowKey2가 null이 아니면 해당 행의 값을 업데이트
      if (rowKey2 !== null) {
        // 업데이트할 필드 목록
        const fieldsToUpdate = [
          "dealType", "itemCd", "itemNm", "soQty", "soPrice", "soAmt", "netAmt", "vatAmt",
          "cfmFlag", "poBpCd", "poBpNm", "poPrice", "poAmt", "poStatus", "branchGroup", "chkYn", "invQty"
        ];
    
        // 각 필드를 반복하며 gridInstance2의 값을 업데이트
        fieldsToUpdate.forEach((field) => {
          const value = gridInstance.getValue(rowKey, field);
          gridInstance2.setValue(rowKey2, field, value);
        });
      }
    
      setIsOpen5(false); // 팝업 닫기
    };

   // 발주지점 팝업 더블클릭
   const handleDblClick6 = async () => {
      const gridInstance = gridRefP6.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const gridInstance2 = gridRef2.current.getInstance();
      const { rowKey: rowKey2 } = gridInstance2.getFocusedCell(); // gridRef2의 포커스된 행

      if(inputValues.poBpGubun === 'poBp') {
      
         // rowKey2가 null이 아니면 해당 행의 값을 업데이트
         if (rowKey2 !== null) {
            // 업데이트할 필드 목록
            const fieldsToUpdate = [
               "poBpCd", "poBpNm", "poPrice", "poAmt", "invQty"
            ];
         
            // 각 필드를 반복하며 gridInstance2의 값을 업데이트
            fieldsToUpdate.forEach((field) => {
               const value = gridInstance.getValue(rowKey, field);
               gridInstance2.setValue(rowKey2, field, value);
            });
         }
      } else if(inputValues.poBpGubun === 'tsBp'){ 
         const gridInstance7 = gridRef7.current.getInstance();
         const { rowKey: rowKey7 } = gridInstance7.getFocusedCell(); // gridRef2의 포커스된 행

         gridInstance7.setValue(rowKey7, 'tsBpCd', gridInstance.getValue(rowKey, 'poBpCd'));
         gridInstance7.setValue(rowKey7, 'tsBpNm', gridInstance.getValue(rowKey, 'poBpNm'));
         gridInstance2.setValue(rowKey7, 'tsBpCd', gridInstance.getValue(rowKey, 'poBpCd'));
         gridInstance2.setValue(rowKey7, 'tsBpNm', gridInstance.getValue(rowKey, 'poBpNm'));
      }

      setIsOpen6(false);
   };


   // 주문 팝업
   const handleInputSearch = async (e: any) => {
      const param = {    
         startDt: inputValues.startDate,     
         endDt: inputValues.endDate,     
         soNo: '999',
         ownNm: searchRef1.current?.value || '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P01", { data });
      setGridDatasP1(result);

      await setIsOpen(true);
      setTimeout(() => {

         refreshGrid(gridRefP1);
      }, 100);
   };

   // 고객사 팝업
   const handleInputSearch2 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: '100',
         bpNm: target.value || '999',
         bpDiv: 'ZZ0188',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      setGridDatasP2(result);
      if (result.length === 1) {
            refs.subCode.current.setChoiceByValue("");
            onInputChange('subCode', '');
            refs.hsCd.current.setChoiceByValue("");
            onInputChange('hsCd', '');

            const bpCd = result[0].bpCd 
            const bpNm = result[0].bpNm
            const contNo = result[0].contNo
            const mouYn = result[0].mouYn

            // InputSearchComp1에 값 설정
            onInputChange('bpNm', bpNm);
            onInputChange('soldToParty', bpCd);
            onInputChange('contNo', contNo);
            onInputChange('mouYn', mouYn);

            let subCodeIn = await ZZ_CONT_INFO({ contNo: contNo, bpCd: bpCd, subCode: "999", searchDiv: "SUB" });

            if (refs.subCode.current) {
               refs.subCode.current.updateChoices(
                  subCodeIn.map((item:any) => ({
                  value: item.subCode,
                  label: item.subCodeNm,
                  }))
               );
            };

            refs.hsCd.current.updateChoices();

            // 고객사별 참고사항
            const param = {       
               bpCd: bpCd,
            };
            const data = JSON.stringify(param);
            const result2 = await fetchPost("SO0201_P05", { data });

            setGridDatas1(result2);
         } else {
            await setIsOpen2(true);
            setTimeout(() => {

               refreshGrid(gridRefP2);
            }, 100);
      }
   };

   // 고객사 팝업 돋보기 클릭
   const handleInputSearch3 = async (e: any) => {
      const param = {
         coCd: '100',
         bpNm: e || '999',
         bpDiv: 'ZZ0188',
      };

      onInputChange('bpNmS', e);
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      setGridDatasP2(result);
      
      await setIsOpen2(true);
      setTimeout(() => {

         refreshGrid(gridRefP2);
      }, 100);
   };

   // 배송지 팝업
   const handleInputSearch4 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         dlvyNm: target.value || '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P04", { data });
      setGridDatasP3(result);
      if (result.length === 1) {
            const grid = gridRef2.current.getInstance();
            const firstRow = grid.getRow(0); // 첫 번째 행 가져오기
            const dlvyCd = result[0].dlvyCd 
            const dlvyNm = result[0].dlvyNm
            const addr1 = result[0].addr1

            if (firstRow && firstRow.chkYn === 'Y') {
               alertSwal("상품조회", "계약조건이 변경되어 상품정보가 삭제 후 다시 조회 됩니다. 계속 하시겠습니까?", "warning", true).then((result) => {
                  if (result.isConfirmed) {   
                     // InputSearchComp1에 값 설정
                     onInputChange('dlvyCd', dlvyCd);
                     onInputChange('dlvyNm', dlvyNm);
                     onInputChange('dlvyAddr', addr1);
                     
                     SO0201_S10({soNo: inputValues.soNo, bpCd: inputValues.soldToParty, contNo: inputValues.contNo, subCode: inputValues.subCode, hsCd: inputValues.hsCd, dlvyCd: dlvyCd, dealType: inputValues.dealType});
                  } else if (result.isDismissed) {
                     onInputChange('dlvyNm', inputValues.preDlvyNm);
                     return;
                  }
              });
            }
         } else {
            await setIsOpen3(true);
            setTimeout(() => {

               refreshGrid(gridRefP3);
            }, 100);
      }
   };

   // 배송지 팝업 돋보기 클릭
   const handleInputSearch5 = async (e: any) => {
      const param = {
         dlvyNm: e || '999',
      };

      onInputChange('dlvyNmS', e);
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0201_P04", { data });
      setGridDatasP3(result);
      
      await setIsOpen3(true);
      setTimeout(() => {

         refreshGrid(gridRefP3);
      }, 100);
   };

   // 사전상담 팝업 돋보기 클릭
   const handleInputSearch6 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {    
         startDt: inputValues.startDate2,     
         endDt: inputValues.endDate2,     
         reqNm: '999',
         ownNm: searchRef4.current?.value || '999',
         bpNm: '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0101_P01", { data });
      setGridDatasP4(result);

      await setIsOpen4(true);
      setTimeout(() => {

         refreshGrid(gridRefP4);
      }, 100);
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef5.current) {
         const grid = gridRef5.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            // 새로운 inputValues 상태를 생성
            const newInputValues = { ...inputValues };

            Object.entries(rowData).forEach(([key, value]) => {
                  if (key === "payYn") {
                     setTimeout(function () {
                        refs.payYn.current?.setChoiceByValue(value);
                     }, 100);
                  }
                // inputValues 상태에 값 설정
                newInputValues[key] = value;
            });

            //상태 업데이트
            setInputValues(newInputValues);

            // payDiv 값에 따라 다른 InputDiv 설정
            if (rowData.payType === 'FU0019') {
               setCurrentInputDiv(inputDiv3());
           } else if (rowData.payType === 'FU0020') {
               setCurrentInputDiv(inputDiv4()); // inputDiv4 함수가 정의되어 있다고 가정
           } else {
               setCurrentInputDiv(null); // 아무것도 표시하지 않음
           }
        }
      }
   };

   //gridRef2 상품정보 수량, 단가 변경
   const handleAfterChange = async (ev: any) => {
      const changesArray = ev.changes; // ev.changes가 배열이므로 이를 사용
      
      // 배열이기 때문에 forEach로 순회
      changesArray.forEach((change: any) => {   
         const gridInstance2 = gridRef2.current.getInstance();
         
         // 현재 변경된 값이 soQty 또는 soPrice일 때 처리
         if (change.columnName === "soQty" || change.columnName === "soPrice") {
            const rowKey = change.rowKey;
   
            // 해당 행에서 soQty와 soPrice 값을 가져옴
            const soQty = gridInstance2.getValue(rowKey, 'soQty') || 0;
            const soPrice = gridInstance2.getValue(rowKey, 'soPrice') || 0;
   
            // soAmt 계산 (수량 * 단가)
            const soAmt = Math.round(soQty * soPrice); // 반올림하여 소수점 제거

            // 공급가액(netAmt): soAmt의 10%를 제외한 금액 (VAT 10% 가정)
            const netAmt = Math.round(soAmt / 1.1); // 반올림하여 소수점 제거

            // 부가세(vatAmt): soAmt에서 netAmt를 뺀 부가세 금액
            const vatAmt = Math.round(soAmt - netAmt); // 반올림하여 소수점 제거
   
            // 각각의 값들을 grid에 업데이트
            gridInstance2.setValue(rowKey, 'soAmt', soAmt);
            gridInstance2.setValue(rowKey, 'netAmt', netAmt);
            gridInstance2.setValue(rowKey, 'vatAmt', vatAmt);
         }
      });
   };

   //gridRef3 발주가 적용
   const handleAfterChange2 = async (ev: any) => {   
      const changesArray = ev.changes; // ev.changes가 배열이므로 이를 사용
      
      // 배열이기 때문에 forEach로 순회
      changesArray.forEach((change: any) => {   
         const gridInstance2 = gridRef2.current.getInstance();
         const gridInstance3 = gridRef3.current.getInstance();
         
         // 현재 변경된 값이 soQty 또는 soPrice일 때 처리
         if (change.columnName === "soQty" || change.columnName === "poPrice") {
            const rowKey = change.rowKey;
   
            // 해당 행에서 soQty와 soPrice 값을 가져옴
            const soQty = gridInstance3.getValue(rowKey, 'soQty') || 0;
            const soPrice = gridInstance3.getValue(rowKey, 'soPrice') || 0;
            const poPrice = gridInstance3.getValue(rowKey, 'poPrice') || 0;
   
            // soAmt 계산 (수량 * 단가)
            const soAmt = Math.round(soQty * soPrice); // 반올림하여 소수점 제거

            // 공급가액(netAmt): soAmt의 10%를 제외한 금액 (VAT 10% 가정)
            const netAmt = Math.round(soAmt / 1.1); // 반올림하여 소수점 제거

            // 부가세(vatAmt): soAmt에서 netAmt를 뺀 부가세 금액
            const vatAmt = Math.round(soAmt - netAmt); // 반올림하여 소수점 제거

            // poAmt 계산 (수량 * 단가)
            const poAmt = Math.round(soQty * poPrice); // 반올림하여 소수점 제거
   
            // 각각의 값들을 grid에 업데이트
            gridInstance2.setValue(rowKey, 'soQty', soQty);
            gridInstance2.setValue(rowKey, 'soAmt', soAmt);
            gridInstance2.setValue(rowKey, 'netAmt', netAmt);
            gridInstance2.setValue(rowKey, 'vatAmt', vatAmt);
            gridInstance2.setValue(rowKey, 'poPrice', poPrice);
            gridInstance2.setValue(rowKey, 'poAmt', poAmt);
            gridInstance3.setValue(rowKey, 'poAmt', poAmt);
         }
      });
   };

   //gridRef7 배송비 적용
   const handleAfterChange3 = async (ev: any) => {   
      const changesArray = ev.changes; // ev.changes가 배열이므로 이를 사용
   
      // 배열이기 때문에 forEach로 순회
      changesArray.forEach((change: any) => {   
         if (change.columnName === "moveCost") {
            const gridInstance2 = gridRef2.current.getInstance();
            gridInstance2.setValue(change.rowKey, 'moveCost', change.value);
         }
      });
   };

   //-------------------function--------------------------
   // 카드포맷
   const onCardNumberChange = (e: any) => {
      const inputValue = e;
  
      // 카드번호 포맷팅
      const formattedValue = formatCardNumber(inputValue);

      // 상태 업데이트
      onInputChange('cardNo', formattedValue);
  };

  // 유효년월포맷
  const onExpiryDateChange = (e: any) => {
      const inputValue = e;

      // 유효년월 포맷팅
      const formattedValue = formatExpiryDate(inputValue);

      // 상태 업데이트
      onInputChange('expDt', formattedValue);
   };

   //-------------------div--------------------------
   //주문 팝업 div
   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2 justify-start ">
               <DateRangePickerComp 
                     title="기간"
                     startValue= {inputValues.startDate}
                     endValue= {inputValues.endDate}
                     onChange={(startDate, endDate) => {
                        onInputChange('startDate', startDate);
                        onInputChange('endDate', endDate);   
               }
               
               } /> 
               <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch2} title="대상자"></InputComp1>              
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearch2} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div>
      </div>
   );

   //고객사 팝업 div
   const modalSearchDiv2 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2  gap-y-3  justify-start w-[60%]">
               <InputComp title="거래처명" ref={searchRef2} value={inputValues.bpNmS} handleCallSearch={handleCallSearch3} 
                          onChange={(e)=>{
                          onInputChange('bpNmS', e);
                     }} />              
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" onClick={handleCallSearch3} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div> 
      </div>
   );

   //배송지 팝업 div
   const modalSearchDiv3 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2  gap-y-3  justify-start w-[60%]">
               <InputComp title="배송지명" ref={searchRef3} value={inputValues.dlvyNmS} handleCallSearch={handleCallSearch5} 
                          onChange={(e)=>{
                          onInputChange('dlvyNmS', e);
                     }} />         
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" onClick={handleCallSearch5} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div> 
      </div>
   );

   //사전상담 팝업 div
   const modalSearchDiv4 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2 justify-start ">
               <DateRangePickerComp 
                     title="접수기간"
                     startValue= {inputValues.startDate2}
                     endValue= {inputValues.endDate2}
                     onChange={(startDate2, endDate2) => {
                        onInputChange('startDate2', startDate2);
                        onInputChange('endDate2', endDate2);   
               }
               
               } /> 
               <InputComp1 ref={searchRef4} handleCallSearch={handleCallSearch6} title="대상자"></InputComp1>              
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearch6} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div>
      </div>
   );

   //품목 팝업 div
   const modalSearchDiv5 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2  gap-y-3  justify-start w-[60%]">
               <InputComp title="품목명" ref={searchRef5} value={inputValues.itemNmS} handleCallSearch={handleCallSearch7} 
                          onChange={(e)=>{
                          onInputChange('itemNmS', e);
                     }} />              
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" onClick={handleCallSearch7} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div> 
      </div>
   );

   //품목 팝업 div
   const modalSearchDiv6 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2  gap-y-3  justify-start w-[60%]">
               <InputComp title="지점명" ref={searchRef6} value={inputValues.poBpNmS} handleCallSearch={handleCallSearch8} 
                          onChange={(e)=>{
                          onInputChange('poBpNmS', e);
                     }} />              
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" onClick={handleCallSearch8} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div> 
      </div>
   );

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={create} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            신규
         </button>
         <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
      </div>
   );

   // 주문정보
   const inputDiv = () => (
      <div className="border rounded-md space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">주문정보</div>
            </div>
         </div>

         <div className="space-y-5">
            <div className="grid grid-cols-2  gap-3  justify-around items-center pr-2 pb-[69px]">
               <InputSearchComp1 value={inputValues.soNo} readOnly={true} title="주문번호" target="soNo" handleInputSearch={handleInputSearch} />
               <SelectSearchComp title="접수구분" 
                              ref={refs.rcptMeth}
                              value={inputValues.rcptMeth}
                              onChange={(label, value) => {
                                    onInputChange('rcptMeth', value);
                                 }}

                              //초기값 세팅시
                              param={{ coCd: "999", majorCode: "FU0003", div: "-999" }}
                              procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
               />
               <InputComp title="접수일시" value={inputValues.orderDt} readOnly= {true} onChange={(e)=>{
                        onInputChange('orderDt', e);
                     }} />
               <SelectSearchComp title="접수자" 
                              ref={refs.rcptUserId}
                              value={inputValues.rcptUserId}
                              onChange={(label, value) => {
                                    onInputChange('rcptUserId', value);
                                 }}

                              //초기값 세팅시
                              stringify={true}
                              param={ { coCd : '100',
                                       usrId : '999',
                                       usrDiv : '999',
                                       useYn : '999' }}
                              procedure="ZZ_USER_LIST"  dataKey={{ label: 'usrNm2', value: 'usrId' }} 
               />
               <InputComp value={inputValues.ownNm} title="대상자" target="ownNm" 
                          onChange={(e) => {
                           onInputChange('ownNm', e);                           
                        }}   />
               <InputComp value={inputValues.ownTelNo} title="연락처" target="ownTelNo" 
                           onChange={(e) => {
                              onInputChange('ownTelNo', e);                      
                           }} 
                           handleCallSearch={handleCallSearch4} />
               <InputSearchComp title="고객사" value={inputValues.bpNm} target="bpNm" onKeyDown={handleInputSearch2} onIconClick={handleInputSearch3}
                                 onChange={(e) => {
                                    onInputChange('bpNm', e);                           
                                }} />
               <InputComp value={inputValues.contNo} readOnly={true} title="계약번호" target="contNo" 
                          onChange={(e) => {
                           onInputChange('contNo', e);                           
                        }}   />
               <SelectSearchComp title="재직구분" 
                              ref={refs.subCode}
                              value={inputValues.subCode}
                              onChange={async (label, value) => {
                                    onInputChange('subCode', value);
                                    onInputChange('subCodeNm', label);
                                    onInputChange('hsCd', '');
                                    refs.hsCd.current.setChoiceByValue("");

                                    let hsCdIn = await ZZ_CONT_INFO({ contNo: inputValues.contNo, bpCd: inputValues.soldToParty, subCode: value, searchDiv: "HS" });

                                    if (refs.hsCd.current) {
                                       refs.hsCd.current.updateChoices(
                                          hsCdIn.map((item:any) => ({
                                          value: item.hsCode,
                                          label: item.hsNm,
                                          }))
                                       );
                                    };
                                 }}   
               />                           
               <SelectSearchComp title="신청사유" 
                              ref={refs.hsCd}
                              value={inputValues.hsCd}
                              onChange={async (label, value) => {    
                                 const grid = gridRef2.current.getInstance();
                                 const firstRow = grid.getRow(0); // 첫 번째 행 가져오기

                                 const updateHSCode = async (value:any) => {
                                    onInputChange('hsCd', value);

                                    let hsCode = await ZZ_CONT_INFO({ 
                                    contNo: inputValues.contNo, 
                                    bpCd: inputValues.soldToParty, 
                                    subCode: inputValues.subCode, 
                                    searchDiv: "HS" 
                                    });

                                    const foundItem = hsCode.find((item: { hsCode: string; }) => item.hsCode === value);
                                    const foundhsType = foundItem ? foundItem.hsType : null;

                                    onInputChange('hsType', foundhsType);

                                    await SO0201_S10({
                                    soNo: inputValues.soNo, 
                                    bpCd: inputValues.soldToParty,
                                    contNo: inputValues.contNo,
                                    subCode: inputValues.subCode,
                                    hsCd: value,
                                    dlvyCd: inputValues.dlvyCd,
                                    dealType: inputValues.dealType
                                    });
                                 };

                                 if (firstRow && firstRow.chkYn === 'Y') {
                                    alertSwal("상품조회", "계약조건이 변경되어 상품정보가 삭제 후 다시 조회 됩니다. 계속 하시겠습니까?", "warning", true).then(async (result) => {
                                    if (result.isConfirmed) {
                                       await updateHSCode(value);
                                    } else if (result.isDismissed) {
                                       refs.hsCd.current.setChoiceByValue(inputValues.hsCd);
                                    }
                                    });
                                 } else {
                                    await updateHSCode(value);
                                 }
                              }}
               />
               <InputComp value={inputValues.deptNm} title="부서" target="deptNm" 
                          onChange={(e) => {
                           onInputChange('deptNm', e);                           
                        }}   />
               <InputComp value={inputValues.roleNm} title="직급" target="roleNm" 
                          onChange={(e) => {
                           onInputChange('roleNm', e);                           
                        }}   />
            </div>
         </div>
      </div>
   );


   // 배송정보
   const inputDiv2 = () => (
      <div className="border rounded-md space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">배송정보</div>
            </div>
         </div>

         <div className="px-3 space-y-2">            
            <div className="grid grid-cols-1 gap-y-2">
               <DatePickerComp 
                  title="배송희망일시"
                  value = {inputValues.dlvyHopeDt}
                  layout="flex"
                  textAlign="right"
                  minWidth="100px"
                  onChange={(e) => { 
                     onInputChange('dlvyHopeDt', e);  
                     }} 
                  format="yyyy-MM-dd HH:mm"
                  timePicker={true}
               />
               <InputSearchComp title="배송지" value={inputValues.dlvyNm} minWidth="100px"  layout="flex" target="dlvyNm" onKeyDown={handleInputSearch4} onIconClick={handleInputSearch5}
                                 onChange={(e) => {
                                    onInputChange('dlvyNm', e);                           
                                }} />
               <InputComp value={inputValues.dlvyAddr} title="상세주소"  minWidth="100px"  layout="flex" target="dlvyAddr" 
                          onChange={(e) => {
                           onInputChange('dlvyAddr', e);                           
                        }}   />
            </div>
            <div className="grid grid-cols-2 gap-3  justify-around items-center">
               <InputComp value={inputValues.roomNo} title="호실" target="roomNo"  minWidth="100px" layout="flex"
                          onChange={(e) => {
                           onInputChange('roomNo', e);                           
                        }}   />
               <InputComp value={inputValues.reqNm} title="주문자" target="reqNm"  minWidth="100px" layout="flex"
                           onChange={(e) => {
                              onInputChange('reqNm', e);                      
                           }} />
               <InputComp value={inputValues.reqTelNo} title="연락처" target="reqTelNo"   minWidth="100px" layout="flex"
                           onChange={(e) => {
                              onInputChange('reqTelNo', e);                      
                           }} />
               <InputComp value={inputValues.dNm} title="고인명" target="dNm"  minWidth="100px" layout="flex"
                           onChange={(e) => {
                              onInputChange('dNm', e);                      
                           }} />
            </div>
            <div className="">
               <InputComp title="의전배송메모" layout="flex" minWidth="100px" value={inputValues.memo} target="memo"
                                 onChange={(e) => {
                                    onInputChange('memo', e);                           
                                }} />
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-5  pb-2">
               <InputComp value={inputValues.confirmDt} title="발주확정일시" target="confirmDt" readOnly={true} layout="flex" minWidth="100px"
                          onChange={(e) => {
                           onInputChange('confirmDt', e);                           
                        }}   />
               <InputSearchComp title="사전상담번호" value={inputValues.preRcptNo} target="preRcptNo"  layout="flex" minWidth="100px"
                           onIconClick={handleInputSearch6} readOnly={true}
                                 onChange={(e) => {
                                    onInputChange('preRcptNo', e);                           
                                }} />    
               <Checkbox  title = "패키지 진행여부" value={inputValues.pkgYn} layout="flex" 
                           minWidth="100px"
                           checked={inputValues.pkgYn == 'Y'} 
                          onChange={(e) => {
                                    onInputChange('pkgYn', e)}} />           
            </div>  
         </div>
      </div>
   );

   // 카드결제
   const inputDiv3 = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">카드결제</div>
            </div>
            <div className="flex space-x-2">
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  결제
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  결제취소
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  영수증
               </button>
            </div>
         </div>

         <div className="">
            <div className="grid grid-cols-3  gap-3 justify-around items-center pt-4 pb-4">
               <SelectSearchComp title="결제상태" 
                              ref={refs.payYn}
                              value={inputValues.payYn}
                              onChange={(label, value) => {
                                    onInputChange('payYn', value);
                                 }}
                              
                              //datas={[{value : 'Y', label : '결제완료'},{value : 'N', label : '미결제'}]}
                              //초기값 세팅시
                              param={{ coCd: "999", majorCode: "FU0008", div: "-999" }}
                              procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
               />
               <InputComp value={inputValues.amt} title="결제금액" target="amt" type="number"
                          onChange={(e) => {
                              onInputChange('amt', e);  
                          }}/>   
            </div>
            <div className="grid grid-cols-3  gap-3  justify-around items-center pb-4">
               <InputComp value={inputValues.cardNo} title="카드번호" target="cardNo" 
                          onChange={(e) => {
                              onCardNumberChange(e);                            
                          }}/>    
               <InputComp value={inputValues.expDt} title="유효기간" target="expDt" 
                          onChange={(e) => {
                              onExpiryDateChange(e);                        
                          }}/>  
            </div>
            <div className="pb-4"> 
               <InputComp value={inputValues.remark} title="기타메모" target="remark" 
                          onChange={(e) => {
                              onInputChange('remark', e);                           
                          }}/>   
            </div>
            <div className="grid grid-cols-3  gap-3  justify-around items-center pb-2">
               <InputComp value={inputValues.appNo} title="승인번호" target="appNo" 
                          onChange={(e) => {
                              onInputChange('appNo', e);                           
                          }}/> 
               <InputComp value={inputValues.mbrRefNo} title="주문번호" target="mbrRefNo" 
                          onChange={(e) => {
                              onInputChange('mbrRefNo', e);                           
                          }}/> 
               <InputComp value={inputValues.cancelMbrRefNo} title="취소번호" target="cancelMbrRefNo" 
                          onChange={(e) => {
                              onInputChange('cancelMbrRefNo', e);                           
                          }}/>  
            </div>
         </div>
      </div>
   );

   // 현금결제
   const inputDiv4 = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">현금결제</div>
            </div>
            <div className="flex space-x-2">
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  발행
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  발행취소
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  영수증
               </button>
            </div>
         </div>

         <div className="">
            <div className="grid grid-cols-3  gap-3 justify-around items-center pt-4 pb-4">
               <SelectSearchComp title="결제상태" 
                              ref={refs.payYn}
                              value={inputValues.payYn}
                              onChange={(label, value) => {
                                    onInputChange('payYn', value);
                                 }}

                              //초기값 세팅시
                              param={{ coCd: "999", majorCode: "FU0007", div: "-999" }}
                              procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
               />
               <InputComp value={inputValues.amt} title="결제금액" target="amt" type="number"
                          onChange={(e) => {
                              onInputChange('amt', e);  
                          }}/>   
            </div>
            <div className="grid grid-cols-3  gap-3  justify-around items-center pb-4">
               <InputComp value={inputValues.cardNo} title="카드번호" target="cardNo" 
                          onChange={(e) => {
                              onCardNumberChange(e);                            
                          }}/>    
               <InputComp value={inputValues.expDt} title="유효기간" target="expDt" 
                          onChange={(e) => {
                              onExpiryDateChange(e);                        
                          }}/>  
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns1 = [
      { header: "참고사항", name: "tip" },
   ];

   const grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">고객사별 참고사항</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef1} columns={columns1}  height={window.innerHeight-650} perPageYn = {false}/>
      </div>
   );

   const columns2 = [
      { header: "주문번호", name: "soNo", hidden: true },
      { header: "순번", name: "soSeq", hidden: true },
      { header: "구분", name: "dealType", hidden: true },
      { header: "CHK", name: "chkYn", hidden: true},
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 300 },
      { header: "품목선택", name: "itemBtn", width: 80, align: "center", formatter: () => {
         return `<button class="bg-blue-500 text-white text-xs  rounded-md px-2 py-1  shadow"}>선택</button>`;
      }},
      { header: "지점코드", name: "poBpCd", width: 200, hidden: true},
      { header: "지점명", name: "poBpNm", width: 200},
      // { header: "지점선택", name: "poBpBtn", width: 80, align: "center", formatter: () => {
      //    return `<button class="bg-blue-500 text-white text-xs  rounded-md px-2 py-1  shadow"}>선택</button>`;
      // }},
      { header: "지점선택", name: "poBpBtn", width: 80, align: "center", formatter: () => {
         return `<button class="bg-blue-500 text-white text-xs rounded-md px-2 py-1 shadow custom-button">선택</button>`;
      }},
      { header: "수량", name: "soQty", width: 60, align:"center", editor: "text", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "가용재고", name: "invQty", width: 80, align:"center"},
      { header: "단가", name: "soPrice", width: 90, align:"right", editor: "text", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "금액", name: "soAmt", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "공급가액", name: "netAmt", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "부가세액", name: "vatAmt", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "유/무상", name: "payDiv", width: 120, editor: "text"},
      { header: "무상사유", name: "reason", editor: "text"},     
      { header: "", name: "cfmFlag", hidden: true}, 
      { header: "", name: "poPrice", hidden: true}, 
      { header: "", name: "poAmt", hidden: true}, 
      { header: "", name: "poStatus", hidden: true}, 
      { header: "", name: "branchGroup", hidden: true}, 
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2 ">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <RadioGroup value={inputValues.dealType} 
                           options={[ { label: "표준", value: "A" }, { label: "예외", value: "B" } ]} 
                           layout="horizontal"
                           onChange={(e)=>{
                              onInputChange('dealType', e);  
                              const grid = gridRef2.current.getInstance();
                              const firstRow = grid.getRow(0); // 첫 번째 행 가져오기

                              if (firstRow && firstRow.chkYn === 'Y') {
                                 alertSwal("상품조회", "계약조건이 변경되어 상품정보가 삭제 후 다시 조회 됩니다. 계속 하시겠습니까?", "warning", true).then((result) => {
                                    if (result.isConfirmed) {
                                       SO0201_S10({soNo: inputValues.soNo, bpCd: inputValues.soldToParty, contNo: inputValues.contNo, subCode: inputValues.subCode, hsCd: inputValues.hsCd, dlvyCd: inputValues.dlvyCd, dealType: e});
                                    } else if (result.isDismissed) {
                                       const newDealType = e === 'A' ? 'B' : 'A';
                                       onInputChange('dealType', newDealType);
                                    }
                                });
                              } else {
                                 SO0201_S10({soNo: inputValues.soNo, bpCd: inputValues.soldToParty, contNo: inputValues.contNo, subCode: inputValues.subCode, hsCd: inputValues.hsCd, dlvyCd: inputValues.dlvyCd, dealType: e});
                              }                            
                           }}  
                           onClick={() => {console.log('onClick')}} />
            </div>
            {inputValues.dealType === 'B' && (
               <div className="flex space-x-1">
                  <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                     <PlusIcon className="w-5 h-5" />
                     추가
                  </button>
                  <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                     <MinusIcon className="w-5 h-5" />
                     삭제
                  </button>
               </div>
            )}
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} handleAfterChange={handleAfterChange} rowHeaders={['checkbox','rowNum']} perPageYn = {false} height={window.innerHeight-750}             
         />
      </div>
   );

   const columns3 = [
      { header: "주문번호", name: "soNo", hidden: true },
      { header: "순번", name: "soSeq", hidden: true },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 500},
      { header: "지점코드", name: "poBpCd", align : "center", width: 100 },
      { header: "지점명", name: "poBpNm", align : "center", width: 300 },
      { header: "수량", name: "soQty", align:"center", width: 60, editor: "text", formatter: function(e: any) {if(e.value){return commas(e.value)}}},
      { header: "가용재고", name: "invQty", align:"center", width: 80, formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "발주단가", name: "poPrice", align:"right", width: 90, editor: "text", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "발주금액", name: "poAmt", align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
   ];

   const grid3 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">발주정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef3} columns={columns3} handleAfterChange={handleAfterChange2} rowHeaders={['checkbox','rowNum']} perPageYn = {false} height={window.innerHeight-750}/>
      </div>
   );

   const columns4 = [
      
      { header: "접수자", name: "insrtUserNm", width:150, align: "center" },
      { header: "접수일시", name: "insrtDt", width:200,  align: "center" },
      { header: "상담내용", name: "consultMemo" },
   ];

   const grid4 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사전상담 정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef4} columns={columns4} perPageYn = {false} height={window.innerHeight-750}/>
      </div>
   );

   const columns5 = [
      { header: "주문번호", name: "soNo", hidden: true },
      { header: "순번", name: "soSeq", hidden: true },
      { header: "결제방법", name: "payType", width: 150, align: "center"},
      { header: "결제금액", name: "amt", width: 150, align: "right", formatter: function(e: any) {if(e.value){return commas(e.value)}}},
      { header: "저장유무", name: "saveYn", align: "center" },
      { header: "", name: "netAmt", hidden: true },
      { header: "", name: "vatAmt", hidden: true },
      { header: "", name: "payYn", hidden: true },
      { header: "", name: "mbrNo", hidden: true },
      { header: "", name: "mbrRefNo", hidden: true },
      { header: "", name: "refNo", hidden: true },
      { header: "", name: "tranDate", hidden: true },
      { header: "", name: "payType2", hidden: true },
      { header: "", name: "tranTime", hidden: true },
      { header: "", name: "appNo", hidden: true },
      { header: "", name: "cancelMbrRefNo", hidden: true },
      { header: "", name: "cancelRefNo", hidden: true },
      { header: "", name: "cancelTranDate", hidden: true },
      { header: "", name: "cancelTranTime", hidden: true },
      { header: "", name: "remark", hidden: true },
   ];

   const grid5 = () => (
      <div className="border p-2 rounded-md space-y-4">            
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 pt-2">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">결제 항목 리스트</div>
            </div>     
            <div className="flex pt-2">
               <InputComp value={inputValues.payAmt} title="결제대상금액" target="payAmt" readOnly={true} type="number"
                              onChange={(e) => {
                                    onInputChange('payAmt', e);                           
                              }}/>            
            </div>
            <div className="flex pt-2 space-x-2">
               <button type="button" onClick={addGridRow2} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow2} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>      
         </div>

         <TuiGrid01 gridRef={gridRef5} columns={columns5} handleFocusChange={handleFocusChange} perPageYn = {false} height={window.innerHeight-785}/>
      </div>
   );

   const columns6 = [
      { header: "주문번호", name: "soNo", hidden: true },
      { header: "순번", name: "soSeq", hidden: true },
      { header: "작성일시", name: "insrtDt", width:200,  align: "center" },
      { header: "작성자", name: "insrtUserId", width:150, align: "center" },
      { header: "내용", name: "memo", editor: "text" },
   ];

   const grid6 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">메모리스트</div>
            </div>     
            <div className="flex pt-2">
               <button type="button" onClick={addGridRow3} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>               
            </div>        
         </div>

         <TuiGrid01 gridRef={gridRef6} columns={columns6} perPageYn = {false} height={window.innerHeight-750}/>
      </div>
   );

   const columns7 = [
      { header: "주문번호", name: "soNo", hidden: true },
      { header: "순번", name: "soSeq", hidden: true },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 330},
      { header: "수량", name: "soQty", align:"center", width: 60, formatter: function(e: any) {if(e.value){return commas(e.value)}}},
      { header: "도착지점코드", name: "poBpCd", align : "center", width: 100 },
      { header: "도착지점명", name: "poBpNm", width: 250 },
      { header: "가용재고", name: "invQty", align:"center", width: 80, formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "출발지점코드", name: "tsBpCd", align : "center", width: 100 },
      { header: "출발지점명", name: "tsBpNm", align : "center", width: 300 },
      { header: "지점선택", name: "tsBpBtn", width: 80, align: "center", formatter: () => {
         return `<button class="bg-blue-500 text-white text-xs rounded-md px-2 py-1 shadow custom-button">선택</button>`;
      }},
      { header: "배송비", name: "moveCost", align:"right", editor: "text", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
   ];

   const grid7 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">재고이동</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef7} columns={columns7} handleAfterChange={handleAfterChange3} rowHeaders={['checkbox','rowNum']} perPageYn = {false} height={window.innerHeight-750}/>
      </div>
   );

   const columns8 = [
      { header: "주문번호", name: "soNo", hidden: true },
      { header: "순번", name: "soSeq", hidden: true },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 250},
      { header: "수량", name: "soQty", align:"center", width: 60, formatter: function(e: any) {if(e.value){return commas(e.value)}}},
      { header: "도착지점코드", name: "poBpCd", align : "center", width: 100 },
      { header: "도착지점명", name: "poBpNm", align : "center", width: 150 },
      { header: "출발지점코드", name: "tsBpCd", align : "center", width: 100 },
      { header: "출발지점명", name: "tsBpNm", align : "center", width: 150 },
      { header: "배송비", name: "moveCost", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "단가", name: "soPrice", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "금액", name: "soAmt", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "공급가액", name: "netAmt", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "부가세액", name: "vatAmt", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "유/무상", name: "payDiv", width: 80},
      { header: "무상사유", name: "reason"},      
   ];

   const grid8 = () => (
      <div className="border p-2 rounded-md space-y-4">            
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 pt-2">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">확정 대상 품목 리스트</div>
               <div className="flex text-black pl-10">
                  <InputComp value={inputValues.payAmt} title="결제대상금액" target="payAmt" readOnly={true} type="number"
                                 onChange={(e) => {
                                       onInputChange('payAmt', e);                           
                                 }}/>            
               </div>
            </div>                 
            <div className="flex p-2 space-x-2">
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  주문취소
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  주문삭제
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  주문확정
               </button>
            </div>      
         </div>

         <TuiGrid01 gridRef={gridRef8} columns={columns8} rowHeaders={['checkbox','rowNum']} perPageYn = {false} height={window.innerHeight-750}/>
      </div>
   );

   const columnsP1 = [
     
      { header: "주문번호", name: "soNo", align : "center", width: 120 },
      { header: "거래처명", name: "bpNm", width: 350 },
      { header: "주문일", name: "orderDt", align : "center", width: 150 },
      { header: "대상자", name: "ownNm", align : "center" },
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

   const columnsP2 = [
     
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "거래처코드", name: "bpCd", align : "center"},
      { header: "거래처명", name: "bpNm" },
      { header: "계약번호", name: "contNo", align : "center" },
   ];

   const gridP2 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRefP2} columns={columnsP2} handleDblClick={handleDblClick2} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columnsP3 = [
     
      { header: "배송지코드", name: "dlvyCd", align: "center", width: 80 },
      { header: "구분", name: "dlvyDiv", align: "center", width: 80},
      { header: "배송지명", name: "dlvyNm", width: 180},
      { header: "주소", name: "addr1" },
   ];

   const gridP3 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">배송지 정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRefP3} columns={columnsP3} handleDblClick={handleDblClick3} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columnsP4 = [
     
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "접수번호", name: "preRcptNo", align : "center"},
      { header: "신청자", name: "reqNm", align : "center" },
      { header: "대상자", name: "ownNm", align : "center" },
      { header: "고객사", name: "bpNm", align : "center" },
   ];

   const gridP4 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사전상담 접수정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRefP4} columns={columnsP4} handleDblClick={handleDblClick4} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columnsP5 = [
      { header: "", name: "dealType", width: 80, align: "center", hidden: true },
      { header: "품목코드", name: "itemCd", width: 80, align: "center" },
      { header: "품목명", name: "itemNm", width: 280 },
      { header: "지점코드", name: "poBpCd", width: 80, align: "center", hidden: true },
      { header: "지점명", name: "poBpNm", width: 280},
      { header: "수량", name: "soQty", width: 60, align:"center", hidden: true},
      { header: "가용재고", name: "invQty", width: 80, align:"center"},
      { header: "단가", name: "soPrice", width: 90, align:"right", editor: "text", hidden: true},
      { header: "금액", name: "soAmt", align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "공급가액", name: "netAmt", width: 90, align:"right", hidden: true},
      { header: "부가세액", name: "vatAmt", width: 90, align:"right", hidden: true},
      { header: "유/무상", name: "payDiv", width: 120, editor: "text", hidden: true},
      { header: "무상사유", name: "reason", editor: "text", hidden: true},    
      { header: "", name: "branchGroup", editor: "text", hidden: true},    
   ];

   const gridP5 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">품목정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRefP5} columns={columnsP5} handleDblClick={handleDblClick5} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columnsP6 = [
      { header: "품목코드", name: "itemCd", width: 80, align: "center" },
      { header: "품목명", name: "itemNm", width: 200 },
      { header: "지점코드", name: "poBpCd", width: 80, align: "center" },
      { header: "지점명", name: "poBpNm", width: 150},
      { header: "주소", name: "addr1", width: 200},
      { header: "가용재고", name: "invQty", width: 80, align:"center"},
      { header: "발주단가", name: "poPrice", width: 90, align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
      { header: "발주금액", name: "poAmt", align:"right", formatter: function(e: any) {if(e.value){return commas(e.value);}}},
   ];

   const gridP6 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">지점정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRefP6} columns={columnsP6} handleDblClick={handleDblClick6} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const handleTabIndex = async (index: number) => {
      await setTabIndex(index);
   };

   const tabLabels = ['상품정보', '발주정보', '사전상담', '결제처리', '메모정보', '재고이동', '주문확정'];

   return (
      <div className={`space-y-2 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
         </div>
         <div>
            <div className="w-full h-full flex">
               <div className="w-1/3 ">
                  <div className="space-x-2 p-1">{inputDiv()}</div> 
               </div>
               <div className="w-1/3 ">
                  <div className="space-x-2 p-1">{inputDiv2()}</div> 
               </div>
               <div className="w-1/3 ">
                  <div className="space-x-2 p-1" ref={gridContainerRef1}>{grid1()}</div> 
               </div>
            </div>
            <div className="w-full h-full md:flex md:space-x-2 md:space-y-0 space-y-2">
               <div className="w-full">
                  <div className="flex ">
                     {tabLabels.map((label, index) => (
                           <div
                              key={index} // 고유한 key 속성 추가
                              className={`p-1 px-2  w-auto text-center rounded-t-md  text-sm cursor-pointer border border-b-0
                                 ${tabIndex === index ? "text-white bg-sky-900  " : "text-gray-500"}
                              `}
                              onClick={() => {
                                 const preIndex = tabIndex; // 현재 탭 인덱스를 미리 저장         

                                 let setData;
                                 if (preIndex === 0 || preIndex === 2 || preIndex === 3 || preIndex === 4) {
                                    const gridInstance = gridRef2.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();
                                 } else if (preIndex === 1) {
                                    const gridInstance = gridRef3.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();
                                 } else if (preIndex === 5) {
                                    const gridInstance = gridRef7.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();
                                 } else if (preIndex === 6) {
                                    const gridInstance = gridRef8.current.getInstance();
                                    gridInstance.blur();
                                    setData = gridInstance.getData();
                                 }

                                 if (index === 0) {    
                                    const gridInstance = gridRef2.current.getInstance();
                                    gridInstance.blur();

                                    setGridDatas2(setData);
                                    setGridDatas3(setData);
                                    setGridDatas7(setData);
                                    setGridDatas8(setData);
                                  } else if (index === 1) {
                                    const gridInstance = gridRef3.current.getInstance();
                                    gridInstance.blur();

                                    setGridDatas2(setData);
                                    setGridDatas3(setData);
                                    setGridDatas7(setData);
                                    setGridDatas8(setData);
                                  } else if (index === 2 && gridRef4.current) {

                                    const gridInstance = gridRef4.current.getInstance();
                                    gridInstance.blur();
                                    const data = gridInstance.getData(); // 올바르게 데이터를 가져옴
                                    setGridDatas4(data);
                                  } else if (index === 3 && gridRef5.current) {

                                    const gridInstance = gridRef5.current.getInstance();
                                    gridInstance.blur();
                                    const data = gridInstance.getData(); // 올바르게 데이터를 가져옴
                                    setGridDatas5(data);
                                  } else if (index === 4 && gridRef6.current) {

                                    const gridInstance = gridRef6.current.getInstance();
                                    gridInstance.blur();
                                    const data = gridInstance.getData(); // 올바르게 데이터를 가져옴
                                    setGridDatas6(data);
                                  } else if (index === 5) {
                                    const gridInstance = gridRef7.current.getInstance();
                                    gridInstance.blur();

                                    setGridDatas2(setData);
                                    setGridDatas3(setData);
                                    setGridDatas7(setData);
                                    setGridDatas8(setData);
                                  } else if (index === 6) {
                                    const gridInstance = gridRef8.current.getInstance();
                                    gridInstance.blur();

                                    setGridDatas2(setData);
                                    setGridDatas3(setData);
                                    setGridDatas7(setData);
                                    setGridDatas8(setData);
                                  }

                                 handleTabIndex(index);
                              }}                              
                           >
                              {label}
                           </div>
                     ))}
                  </div>
                  <div className={"w-full md:flex md:space-x-2 md:space-y-0 space-y-2"}>
                     <div className={`w-full ${tabIndex === 0 ? " " : "hidden"}`} ref={gridContainerRef2}>{grid2()} </div>                     
                  </div>
                  <div className={`w-full ${tabIndex === 1 ? " " : "hidden"}`} ref={gridContainerRef3}>{grid3()}</div>
                  <div className={`w-full ${tabIndex === 2 ? " " : "hidden"}`} ref={gridContainerRef4}>{grid4()}</div>
                  <div className="w-full flex space-x-2">
                     <div className={`w-2/5 ${tabIndex === 3 ? " " : "hidden"}`} ref={gridContainerRef5}>{grid5()}</div>
                     <div className={`w-3/5 ${tabIndex === 3 ? " " : "hidden"}`}>{currentInputDiv} </div>
                  </div>
                  <div className={`w-full ${tabIndex === 4 ? " " : "hidden"}`} ref={gridContainerRef6}>{grid6()}</div>
                  <div className={`w-full ${tabIndex === 5 ? " " : "hidden"}`} ref={gridContainerRef7}>{grid7()}</div>
                  <div className={`w-full ${tabIndex === 6 ? " " : "hidden"}`} ref={gridContainerRef8}>{grid8()}</div>
               </div>
         </div>
         </div>
         <CommonModal isOpen={isOpen} size="md" onClose={() => setIsOpen(false)} title="">
            {modalSearchDiv()}
            {gridP1()}
         </CommonModal>
         <CommonModal isOpen={isOpen2} size="md" onClose={() => setIsOpen2(false)} title="">
            {modalSearchDiv2()}
            {gridP2()}
         </CommonModal>
         <CommonModal isOpen={isOpen3} size="md" onClose={() => setIsOpen3(false)} title="">
            {modalSearchDiv3()}
            {gridP3()}
         </CommonModal>
         <CommonModal isOpen={isOpen4} size="md" onClose={() => setIsOpen4(false)} title="">
            {modalSearchDiv4()}
            {gridP4()}
         </CommonModal>
         <CommonModal isOpen={isOpen5} size="md" onClose={() => setIsOpen5(false)} title="">
            {modalSearchDiv5()}
            {gridP5()}
         </CommonModal>
         <CommonModal isOpen={isOpen6} size="lg" onClose={() => setIsOpen6(false)} title="">
            {modalSearchDiv6()}
            {gridP6()}
         </CommonModal>
      </div>
   );
};

export default SO0201;