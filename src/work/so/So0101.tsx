import { React, useEffect, useState, useRef, useCallback, initChoice, 
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, InputComp, InputComp1, InputComp2, TextArea2, InputSearchComp1, SelectSearch, SelectComp1, SelectComp2, SelectSearchComp, DateRangePickerComp, date, InputSearchComp, commas,
    RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp } from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, ArrowUturnDownIcon, XMarkIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const SO0101 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridRef2 = useRef<any>(null);
   const gridRef3 = useRef<any>(null);
   const gridRef4 = useRef<any>(null);
   const gridContainerRef = useRef(null);
   const gridContainerRef2 = useRef(null);
   const gridContainerRef3 = useRef(null);
   const gridContainerRef4 = useRef(null);

   //검색창 ref
    const searchRef1 = useRef<any>(null);
    const searchRef2 = useRef<any>(null);
    const searchRef3 = useRef<any>(null);

   const refs = {
      preRcptNo: useRef<any>(null),
      rcptDt: useRef<any>(null),
      reqNm: useRef<any>(null),
      reqTelNo: useRef<any>(null),
      bpCd: useRef<any>(null),
      mouYn: useRef<any>(null),
      subCode: useRef<any>(null),
      hsCd: useRef<any>(null),
      ownNm: useRef<any>(null),
      coCd: useRef<any>(null),    
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();
   const [gridDatas4, setGridDatas4] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      rcptUserId: userInfo.usrId,
      subCode: "",
      hsCd: "",
      consultMemo: "",
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const [focusRow, setFocusRow] = useState<any>(0);
   const [isOpen, setIsOpen] = useState(false);
   const [isOpen2, setIsOpen2] = useState(false);

   const breadcrumbItem = [{ name: "주문관리" }, { name: "사전상담" }, { name: "사전상담등록" }];

   const { fetchWithLoading } = useLoadingFetch();

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      reSizeGrid({ ref: gridRef4, containerRef: gridContainerRef4, sec: 200 });

      addGridRow();
   }, []);

   //--------------------init---------------------------

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef);
      refreshGrid(gridRef2);
      refreshGrid(gridRef3);
      refreshGrid(gridRef4);
   }, [activeComp]);

   //Grid 데이터 설정
   useEffect(() => {
      if (gridRef.current && gridDatas) {
         let grid = gridRef.current.getInstance();
         grid.resetData(gridDatas);
         if (gridDatas.length > 0) {
            grid.focusAt(focusRow, 0, true);
         }
      }

   }, [gridDatas]);

   useEffect(() => {
      //console.log(inputValues);
   }, [inputValues]);

   useEffect(() => {
      if (gridRef2.current && gridDatas2) {
         let grid2 = gridRef2.current.getInstance();
         grid2.resetData(gridDatas2);

         let focusRowKey = grid2.getFocusedCell().rowKey || 0;

         if (gridDatas2.length > 0) {
            grid2.focusAt(focusRowKey, 0, true);
         } else {
            addGridRow(); // 데이터가 없을 경우 addGridRow() 호출
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

   const SO0101_U03 = async (data: any) => {
      try {
         const result = await fetchPost(`SO0101_U03_V2`, data);
         return result;
      } catch (error) {
         console.error("SO0101_U03 Error:", error);
         throw error;
      }
   };

   // 주문확정, 취소, 삭제
   const SO0101_U04 = async (data: any) => {
      try {
         const result = await fetchPost(`SO0101_U04`, data);
         return result;
      } catch (error) {
         console.error("SO0101_U04 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------
   const setChangeGridData = (columnName: string, value: any) => {
      const grid = gridRef2.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.setValue(rowKey, columnName, value, false);

      onInputChange(columnName, value);

   };

   const search = async (preRcptNo:any) => {

      await fetchWithLoading(async () => {
         const param = {    
            preRcptNo: preRcptNo,
         };
         const data = JSON.stringify(param);
         const result = await fetchPost("SO0101_S01_V2", {data});

         console.log(result);
       
         if (result.length === 0) {
            return;
         }
         let itemIn = await ZZ_CONT_INFO({ contNo: result[0].contNo, bpCd: result[0].bpCd, subCode: result[0].subCode, searchDiv: "ITEM", hsCd: result[0].hsCd});

         setGridDatas(itemIn);

         const result2 = await fetchPost("SO0101_S02", {data});

         setGridDatas2(result2);

         // InputSearchComp1에 값 설정      
         onInputChange('preRcptNo', result[0].preRcptNo);
         onInputChange('contNo', result[0].contNo);
         onInputChange('reqNm', result[0].reqNm);
         onInputChange('rcptUserId', result[0].rcptUserId);
         onInputChange('reqTelNo', result[0].reqTelNo);
         onInputChange('bpCd', result[0].bpCd);
         onInputChange('bpNm', result[0].bpNm);
         onInputChange('mouYn', result[0].mouYn);
         onInputChange('rcptDt', result[0].rcptDt);
         onInputChange('subCode', result[0].subCode);
         onInputChange('hsCd', result[0].hsCd);
         onInputChange('ownNm', result[0].ownNm);
      });
   };

   const add = async () => {
      setInputValues([]);
      setGridDatas([]);
      setGridDatas2([]);
      setGridDatas3([]);
      setGridDatas4([]);

      onInputChange('startDate', date(-1, 'month'));
      onInputChange('endDate', date());

   };

   const save = async () => {
      await fetchWithLoading(async () => {
         const data = await getGridValues();
         if (data) {
            let result = await SO0101_U03(data);
            if (result) {
               await returnResult(result);
            }
         }
      });
   };

   const del = async () => {
      if (inputValues.preRcptNo) {
         alertSwal("사전상담삭제", "사전상담을 삭제하시겠습니까?", "warning", true).then(async (result) => {
            if (result.isConfirmed) {
               await fetchWithLoading(async () => {
                  let preRcptNo = inputValues.preRcptNo;

                  let data = {
                     menuId: activeComp.menuId,
                     insrtUserId: userInfo.usrId,
                     preRcptNo: preRcptNo
                  };

                  if (data) {
                     let result = await SO0101_U04(data);
                     if (result) {
                        await returnResult(result);
                     }
                  }
               });
            }
         });  
      } else {
         alertSwal("사전상담삭제", "접수번호가 없습니다.", "warning");
      } 
   }; 

   const returnResult = async(result:any) => {     
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      if(result.preRcptNoOut){
         search(result.preRcptNoOut);
      }
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      if (!inputValues.preRcptNo) {
         inputValues.status = 'I';
      } else {
         inputValues.status = 'U';
      }

      let preConsultHdr = [inputValues];
      let preConsultDtl = await getGridDatas(gridRef2);
      let preRcptNo = inputValues.preRcptNo;

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         preRcptNo: preRcptNo,
         preConsultHdr: JSON.stringify(preConsultHdr),
         preConsultDtl: JSON.stringify(preConsultDtl),
      };

      return data;
   };

   //grid 추가버튼
   const addGridRow = () => {
      let grid = gridRef2.current.getInstance();

      grid.appendRow({  useYn: "Y", consultMemo:"", coCd: "100", isNew: true}, { at: 0 });

      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
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

   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef2.current) {
         const grid = gridRef2.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               
               onInputChange(key, value);
            }); 
         }
      }
   };

   //사전상담 팝업조회
   const handleCallSearch2 = async () => {
      await fetchWithLoading(async () => {
         const param = {    
            startDt: inputValues.startDate,     
            endDt: inputValues.endDate,     
            reqNm: '999',
            ownNm: searchRef2.current?.value || '999',
            reqTelNo : searchRef3.current?.value || '999',
            bpNm: '999',
         };
         const data = JSON.stringify(param);
         const result = await fetchPost("SO0101_P01", { data });
         setGridDatas3(result);
      });
   };

   //고객사 팝업조회
   const handleCallSearch3 = async () => {
      const param = {
         coCd: '100',
         bpNm: searchRef1.current?.value || '999',
         bpType: 'ZZ0002',
         bpDiv: '999',
      };
      const data = JSON.stringify(param);
  
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      setGridDatas4(result);
   };

   //연락처 조회
   const handleCallSearch4 = async () => {
      if (!inputValues.preRcptNo) {
         const param = {         
            reqTelNo: inputValues.reqTelNo,
         };
         const data = JSON.stringify(param);
         const result = await fetchPost("SO0101_P02_V2", { data });

         if (result.length > 0) {
            search(result[0].preRcptNo);
         }
      }      
   };

   const handleDblClick = async () => {
      onInputChange('subCode', '');
      onInputChange('hsCd', '');
      setGridDatas([]);

      const gridInstance = gridRef4.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const bpCd = gridInstance.getValue(rowKey, "bpCd"); // 해당 rowKey에서 bpCd 값을 가져옴
      const bpNm = gridInstance.getValue(rowKey, "bpNm"); // 해당 rowKey에서 bpNm 값을 가져옴
      const contNo = gridInstance.getValue(rowKey, "contNo"); // 해당 rowKey에서 bpNm 값을 가져옴
      const mouYn = gridInstance.getValue(rowKey, "mouYn"); // 해당 rowKey에서 bpNm 값을 가져옴

      // InputSearchComp1에 값 설정
      onInputChange('bpNm', bpNm);
      onInputChange('bpCd', bpCd);
      onInputChange('contNo', contNo);
      onInputChange('mouYn', mouYn);
      
      setIsOpen(false);
   };

   const handleDblClick2 = async () => {
      const gridInstance = gridRef3.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const preRcptNo = gridInstance.getValue(rowKey, "preRcptNo"); // 해당 rowKey에서 bpCd 값을 가져옴
      
      search(preRcptNo);

      setIsOpen2(false);
   };

   // 사전상담 팝업
   const handleInputSearch = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {    
         startDt: inputValues.startDate,     
         endDt: inputValues.endDate,     
         reqNm: '999',
         ownNm: searchRef2.current?.value || '999',
         bpNm: '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0101_P01", { data });
      setGridDatas3(result);

      await setIsOpen2(true);
      setTimeout(() => {

         refreshGrid(gridRef3);
      }, 100);
   };

   // 고객사 팝업
   const handleInputSearch2 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: '100',
         bpNm: target.value || '999',
         bpType: 'ZZ0002',
         bpDiv: '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });

      setGridDatas4(result);
      if (result.length === 1) {
            onInputChange('subCode', '');
            onInputChange('hsCd', '');
            setGridDatas([]);

            const bpCd = result[0].bpCd 
            const bpNm = result[0].bpNm
            const contNo = result[0].contNo
            const mouYn = result[0].mouYn

            // InputSearchComp1에 값 설정
            onInputChange('bpNm', bpNm);
            onInputChange('bpCd', bpCd);
            onInputChange('contNo', contNo);
            onInputChange('mouYn', mouYn);

         } else {
            await setIsOpen(true);
            setTimeout(() => {

               refreshGrid(gridRef4);
            }, 100);
      }
   };

   // 고객사 팝업
   const handleInputSearch3 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: '100',
         bpNm: '999',
         bpType: 'ZZ0002',
         bpDiv: '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });

      setGridDatas4(result);
      
      await setIsOpen(true);
      setTimeout(() => {

         refreshGrid(gridRef4);
      }, 100);
   };

   //-------------------div--------------------------
   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2 gap-y-2 justify-start ">
               <DateRangePickerComp 
                     title="접수기간"
                     startValue= {inputValues.startDate}
                     endValue= {inputValues.endDate}
                     onChange={(startDate, endDate) => {
                        onInputChange('startDate', startDate);
                        onInputChange('endDate', endDate);   
               }
               
               } /> 
               <InputComp1 ref={searchRef2} handleCallSearch={handleCallSearch2} title="대상자"></InputComp1>    
               <InputComp1 ref={searchRef3} handleCallSearch={handleCallSearch2} title="신청자연락처"></InputComp1>              
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearch2} className="h-[30px] bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div>
      </div>
   );

   const modalSearchDiv2 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2  gap-y-3  justify-start w-[60%]">
               <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch3} title="고객사명"></InputComp1>               
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

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={del} className="bg-rose-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <TrashIcon className="w-5 h-5 mr-1" />
            삭제
         </button>
         <button type="button" onClick={add} className="bg-green-500 text-white rounded-lg px-2 py-1 flex items-center shadow ">
         <PencilIcon className="w-5 h-5 mr-1" />
            신규
         </button>
         <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
      </div>
   );

   //input div
   const inputDiv = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">접수 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-3  gap-3  justify-around items-center ">
               <InputSearchComp1 value={inputValues.preRcptNo} readOnly={true} title="접수번호" target="preRcptNo" handleInputSearch={handleInputSearch} />
               <InputComp title="접수일시" value={inputValues.rcptDt} readOnly= {true} onChange={(e)=>{
                        onInputChange('rcptDt', e);
                     }} />
               <SelectSearch title="접수자" 
                              value={inputValues.rcptUserId}
                              addData={"empty"}
                              onChange={(label, value) => {
                                    onInputChange('rcptUserId', value);
                                 }}
                              readonly={true}

                              //초기값 세팅시
                              stringify={true}
                              param={ { coCd : '999',
                                       usrId : '999',
                                       usrDiv : '999',
                                       useYn : '999' }}
                              procedure="ZZ_USER_LIST"  dataKey={{ label: 'usrNm2', value: 'usrId' }} 
            />
            </div>
         </div>
      </div>
   );


   //input div
   const inputDiv2 = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">신청자 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-3  gap-3  justify-around items-center ">
               <InputComp value={inputValues.reqNm} title="신청자 성명" target="reqNm" 
                          onChange={(e) => {
                           onInputChange('reqNm', e);                           
                        }}   />
               <InputComp value={inputValues.reqTelNo} title="연락처" target="reqTelNo" 
                           onChange={(e) => {
                              onInputChange('reqTelNo', e);                      
                           }} 
                           handleCallSearch={handleCallSearch4} />
            </div>
         </div>
      </div>
   );

   //input div
   const inputDiv3 = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">지원 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-3  gap-3  justify-around items-center ">
               <InputSearchComp title="고객사" value={inputValues.bpNm} target="bpNm" onKeyDown={handleInputSearch2} onIconClick={handleInputSearch3}
                                 onChange={(e) => {
                                    onInputChange('bpNm', e);                           
                                }} />
               <Checkbox  title = "MOU" value={inputValues.mouYn}  checked={inputValues.mouYn == 'Y'} readOnly={true} />
               <SelectSearch title="재직구분" 
                              value={inputValues.subCode}
                              onChange={async (label, value) => {
                                    onInputChange('subCode', value);
                                    onInputChange('hsCd', '');                                    
                                 }}   

                              //초기값 세팅시
                              stringify={true}
                              param={{ contNo : inputValues.contNo,
                                       bpCd : inputValues.bpCd,
                                       subCode : "999",
                                       searchDiv : 'SUB' }}
                              procedure="ZZ_CONT_INFO"  dataKey={{ label: 'subCodeNm', value: 'subCode' }} 
               />                            
               <SelectSearch title="신청사유" 
                              value={inputValues.hsCd}
                              onChange={async (label, value) => {                                    
                                    onInputChange('hsCd', value);

                                    let itemIn = await ZZ_CONT_INFO({ contNo: inputValues.contNo, bpCd: inputValues.bpCd, subCode: inputValues.subCode, searchDiv: "ITEM", hsCd: value});

                                    setGridDatas(itemIn);
                                 }}

                              //초기값 세팅시
                              stringify={true}
                              param={{ contNo : inputValues.contNo,
                                       bpCd : inputValues.bpCd,
                                       subCode : inputValues.subCode,
                                       searchDiv : 'HS' }}
                              procedure="ZZ_CONT_INFO"  dataKey={{ label: 'hsNm', value: 'hsCode' }} 
               />
               <InputComp value={inputValues.ownNm} title="대상자" target="ownNm" 
                          onChange={(e) => {
                              onInputChange('ownNm', e);                           
                          }}/>               
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "품목코드", name: "itemCd", align:"center", width: 100, hidden: false },
      { header: "품목명", name: "itemNm", width: 350 },
      { header: "수량", name: "qty", align:"center" },
      { header: "복리단가", name: "priceCom", align:"right",
         formatter: function(e: any) {if(e.value){return commas(e.value);} }
       },
      { header: "개별단가", name: "pricePer", align:"right",
         formatter: function(e: any) {if(e.value){return commas(e.value);} }
       },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">지원품목</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns}  height={window.innerHeight-750} perPageYn = {false}/>
      </div>
   );

   const columns2 = [
      { header: "접수자", name: "insrtUserId", hidden: true },
      { header: "접수자", name: "insrtUserNm", width: 100, align: "center" },
      { header: "접수일시", name: "insrtDt", align: "center" },
      { header: "메모", name: "consultMemo", hidden: true},
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">주요상담내용</div>
            </div>
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
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-1/2 " ref={gridContainerRef}>
               <TuiGrid01 gridRef={gridRef2} columns={columns2} handleFocusChange={handleFocusChange} perPageYn = {false} height={window.innerHeight-650}/>
            </div>
            <div className="w-1/2 flex flex-col h-full">
            <TextArea2 title="" value={inputValues.consultMemo} 
                       onChange={(e) => 
                        setChangeGridData("consultMemo", e)
                        }
                       layout="vertical" textAlign="left"
                   />
            </div>
         </div>
         
      </div>
   );

   const columns3 = [
     
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "접수번호", name: "preRcptNo", align : "center"},
      { header: "신청자", name: "reqNm", align : "center" },
      { header: "대상자", name: "ownNm", align : "center" },
      { header: "고객사", name: "bpNm", align : "center" },
   ];

   const grid3 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사전상담 접수정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef3} columns={columns3} handleDblClick={handleDblClick2} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columns4 = [
     
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "고객사코드", name: "bpCd", align : "center"},
      { header: "고객사명", name: "bpNm" },
   ];

   const grid4 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">고객사 정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef4} columns={columns4} handleDblClick={handleDblClick} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   return (
      <div className={`space-y-2 overflow-y-auto`}>
         <LoadingSpinner />
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
         </div>
         <div className="w-full h-full flex">
            <div className="w-1/2 ">
               <div className="space-x-2 p-1">{inputDiv()}</div> 
               <div className="space-x-2 p-1">{inputDiv2()}</div> 
               <div className="space-x-2 p-1">{inputDiv3()}</div> 
            </div>
            <div className="w-1/2 ">
               <div className="space-x-2 p-1" ref={gridContainerRef}>{grid()}</div> 
               <div className="space-x-2 p-1" ref={gridContainerRef2}>{grid2()}</div>
            </div>
         </div>
         <CommonModal isOpen={isOpen} size="md" onClose={() => setIsOpen(false)} title="">
            {modalSearchDiv2()}
            {grid4()}
         </CommonModal>
         <CommonModal isOpen={isOpen2} size="md" onClose={() => setIsOpen2(false)} title="">
            {modalSearchDiv()}
            {grid3()}
         </CommonModal>
      </div>
   );
};

export default SO0101;